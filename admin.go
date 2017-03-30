package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"

	"github.com/astaxie/beego/session"
	"github.com/howeyc/gopass"
	siridb "github.com/transceptor-technology/go-siridb-connector"

	"strings"

	kingpin "gopkg.in/alecthomas/kingpin.v2"
)

// AppVersion exposes version information
const AppVersion = "1.0.0"

var (
	xApp      = kingpin.New("siridb-admin", "Tool for creating and expanding SiriDB databases.")
	xAccount  = xApp.Flag("user", "Service account name for connecting to the SiriDB server. (ignored with the --http flag)").Short('u').Required().String()
	xPassword = xApp.Flag("password", "Password for your service account.").Short('p').String()
	xServer   = xApp.Flag("server", "Server address[:port] for the SiriDB server.").Short('s').Default("localhost:9000").String()
	xHTTP     = xApp.Flag("http", "Start a webserver for a graphical user interface. (only --port flag is parsed, other arguments/flags are ignored)").Bool()
	xHTTPPort = xApp.Flag("port", "Specific port for the http webserver.").Short('O').Default("8080").Int()
	xVerbose  = xApp.Flag("verbose", "Enable verbose logging.").Bool()
	xVersion  = xApp.Flag("version", "Print version information and exit.").Bool()

	xGetVersion   = xApp.Command("get-version", "Returns SiriDB server version information.")
	xGetAccounts  = xApp.Command("get-accounts", "Returns all service accounts.")
	xGetDatabases = xApp.Command("get-databases", "Returns all databases on the SiriDB server.")

	xNewAccount = xApp.Command("new-account", "Create a new service account.")
	xNaAccount  = xNewAccount.Arg("name", "Name for the new service account.").Required().String()
	xNaPassword = xNewAccount.Arg("password", "Password for the new service account.").Required().String()

	xDropAccount = xApp.Command("drop-account", "Remove a service account.")
	xDaAccount   = xDropAccount.Arg("name", "Account name which you want to drop.").Required().String()

	xChangeAccount = xApp.Command("change-password", "Change password for your service account.")
	xCaPassword    = xChangeAccount.Arg("password", "New password.").Required().String()

	xNewDatabase = xApp.Command("new-database", "Create a new SiriDB database.")
	xNdDatabase  = xNewDatabase.Flag(
		"dbname", "Database name. (Must be at least 2 and at most 20 characters. "+
			"Fist character must be a letter. "+
			"Last character must be a letter or number. "+
			"In between letters, numbers, hyphen and underscores are allowed)").Short('d').Required().String()
	xNdTimep   = xNewDatabase.Flag("time-precision", "Time precision for the new database.").Short('t').Default("ms").HintOptions("s", "ms", "us", "ns").String()
	xNdBufSize = xNewDatabase.Flag("buffer-size", "Buffer size for the new database.").Short('b').Default("1024").Int()
	xNdDuraNum = xNewDatabase.Flag("duration-num", "Number duration for the new database.").Short('N').Default("1w").String()
	xNdDuraLog = xNewDatabase.Flag("duration-log", "Log duration for the new database.").Short('L').Default("1d").String()

	xNewPool    = xApp.Command("new-pool", "Expand a SiriDB database with a new pool.")
	xNpServer   = xNewPool.Flag("address", "SiriDB server address[:port]. Can be any server from the database you want to add a new pool to.").Short('a').Required().String()
	xNpDatabase = xNewPool.Flag("dbname", "Database name where you want to add the new pool to.").Short('d').Required().String()
	xNpUser     = xNewPool.Flag("database-user", "User with full privileges to the database.").Short('U').Required().String()
	xNpPassword = xNewPool.Flag("database-password", "Password for the database user.").Short('P').Required().String()
	xNpForce    = xNewPool.Flag("force", "Suppress warning message.").Short('f').Bool()

	xNewReplica = xApp.Command("new-replica", "Expand a SiriDB database with a new pool.")
	xNrServer   = xNewReplica.Flag("address", "SiriDB server address[:port]. Can be any server from the database you want to add a new replica to.").Short('a').Required().String()
	xNrDatabase = xNewReplica.Flag("dbname", "Database name where you want to add the new replica to.").Short('d').Required().String()
	xNrUser     = xNewReplica.Flag("database-user", "User with full privileges to the database.").Short('U').Required().String()
	xNrPassword = xNewReplica.Flag("database-password", "Password for the database user.").Short('P').Required().String()
	xNrPool     = xNewReplica.Flag("pool", "Pool number which you want to create the replica for.").Short('o').Required().Int()
	xNrForce    = xNewReplica.Flag("force", "Suppress warning message.").Short('f').Bool()
)

var globalSessions *session.Manager

const invalidServerAddress = "invalid server address: %s (valid examples: myserver.local, myserver.local:9000, ::1, [::1]:9000, etc...)\n"

func askForConfirmation(s string) bool {
	reader := bufio.NewReader(os.Stdin)

	for {
		fmt.Printf("%s [y/n]: ", s)

		response, err := reader.ReadString('\n')
		if err != nil {
			log.Fatal(err)
		}

		response = strings.ToLower(strings.TrimSpace(response))

		if response == "y" || response == "yes" {
			return true
		} else if response == "n" || response == "no" {
			return false
		}
	}
}

func getpass() string {
	var pass []byte
	var err error
	for len(pass) == 0 {
		fmt.Printf("Password: ")

		// Silent. For printing *'s use gopass.GetPasswdMasked()
		pass, err = gopass.GetPasswdMasked()
		if err != nil {
			println("error reading password")
			os.Exit(1)
		}
	}
	return string(pass)
}

func getHostAndPort(addr string) (string, uint16, error) {
	parts := strings.Split(addr, ":")
	// IPv4
	if len(parts) == 1 {
		return parts[0], 9000, nil
	}
	if len(parts) == 2 {
		u, err := strconv.ParseUint(parts[1], 10, 16)
		return parts[0], uint16(u), err
	}
	// IPv6
	if addr[0] != '[' {
		return addr, 9000, nil
	}
	if addr[len(addr)-1] == ']' {
		return addr[1 : len(addr)-1], 9000, nil
	}
	u, err := strconv.ParseUint(parts[len(parts)-1], 10, 16)
	addr = strings.Join(parts[:len(parts)-1], ":")
	return addr[1 : len(addr)-1], uint16(u), err
}

func newDatabase(conn *siridb.Connection) (interface{}, error) {
	var msg string
	options := make(map[string]interface{})

	options["dbname"] = *xNdDatabase
	options["time_precision"] = *xNdTimep
	options["buffer_size"] = *xNdBufSize
	options["duration_num"] = *xNdDuraNum
	options["duration_log"] = *xNdDuraLog

	_, err := conn.Manage(*xAccount, *xPassword, siridb.AdminNewDatabase, options)

	if err == nil {
		msg = fmt.Sprintf("successfully created database: %s\n", *xNdDatabase)
	}
	return msg, err
}

func newPool(conn *siridb.Connection) (interface{}, error) {
	var msg string
	server, port, err := getHostAndPort(*xNpServer)
	if err != nil {
		return msg, fmt.Errorf(invalidServerAddress, *xNpServer)
	}

	if !*xNpForce {
		c := askForConfirmation("WARNING: It is not possible to undo this action!\nAre you sure you want to continue?")
		if !c {
			return msg, fmt.Errorf("cancelled by user")
		}
	}

	options := make(map[string]interface{})

	options["dbname"] = *xNpDatabase
	options["host"] = server
	options["port"] = int(port)
	options["username"] = *xNpUser
	options["password"] = *xNpPassword

	_, err = conn.Manage(*xAccount, *xPassword, siridb.AdminNewPool, options)

	if err == nil {
		msg = fmt.Sprintf("successfully created a pool for database: %s\n", *xNpDatabase)
	}
	return msg, err
}

func newReplica(conn *siridb.Connection) (interface{}, error) {
	var msg string
	server, port, err := getHostAndPort(*xNrServer)
	if err != nil {
		return msg, fmt.Errorf(invalidServerAddress, *xNrServer)
	}

	if !*xNpForce {
		c := askForConfirmation("WARNING: It is not possible to undo this action!\nAre you sure you want to continue?")
		if !c {
			return msg, fmt.Errorf("cancelled by user")
		}
	}

	options := make(map[string]interface{})

	options["dbname"] = *xNrDatabase
	options["host"] = server
	options["port"] = int(port)
	options["username"] = *xNrUser
	options["password"] = *xNrPassword
	options["pool"] = *xNrPool

	_, err = conn.Manage(*xAccount, *xPassword, siridb.AdminNewReplica, options)

	if err == nil {
		msg = fmt.Sprintf("successfully created a replica for database: %s\n", *xNrDatabase)
	}
	return msg, err
}

func getAccounts(conn *siridb.Connection, account, password string) (interface{}, error) {
	res, err := conn.Manage(account, password, siridb.AdminGetAccounts, nil)
	return res, err
}

func getDatabases(conn *siridb.Connection, account, password string) (interface{}, error) {
	res, err := conn.Manage(account, password, siridb.AdminGetDatabases, nil)
	return res, err
}

func getVersion(conn *siridb.Connection, account, password string) (interface{}, error) {
	res, err := conn.Manage(account, password, siridb.AdminGetVersion, nil)
	return res, err
}

func newAccount(conn *siridb.Connection) (interface{}, error) {
	var msg string
	options := make(map[string]interface{})

	options["account"] = *xNaAccount
	options["password"] = *xNaPassword

	_, err := conn.Manage(*xAccount, *xPassword, siridb.AdminNewAccount, options)
	if err == nil {
		msg = fmt.Sprintf("successfully created service account: %s", *xNaAccount)
	}
	return msg, err
}

func dropAccount(conn *siridb.Connection) (interface{}, error) {
	var msg string
	options := make(map[string]interface{})

	options["account"] = *xDaAccount

	_, err := conn.Manage(*xAccount, *xPassword, siridb.AdminDropAccount, options)
	if err == nil {
		msg = fmt.Sprintf("successfully dropped service account: %s", *xDaAccount)
	}
	return msg, err
}

func changePassword(conn *siridb.Connection, account, password, changeAccount, newPassword string) (interface{}, error) {
	var msg string
	options := make(map[string]interface{})

	options["account"] = changeAccount
	options["password"] = newPassword

	_, err := conn.Manage(account, password, siridb.AdminChangePassword, options)
	if err == nil {
		msg = fmt.Sprintf("successfully changed password for service account: %s", changeAccount)
	}
	return msg, err
}

func logHandle(logCh chan string) {
	for {
		<-logCh // ignore logs when not in verbose mode
	}
}

func initHTTP() error {
	var err error
	cf := new(session.ManagerConfig)
	cf.EnableSetCookie = true
	s := `{"cookieName":"siridbadminsessionid","gclifetime":3600}`

	if err = json.Unmarshal([]byte(s), cf); err != nil {
		return err
	}

	if globalSessions, err = session.NewManager("memory", cf); err != nil {
		return err
	}

	go globalSessions.GC()

	http.HandleFunc("/", handlerMain)
	http.HandleFunc("/js/bundle", handlerJsBundle)
	http.HandleFunc("/css/bootstrap", handlerBootstrapCSS)
	http.HandleFunc("/css/layout", handlerLayout)
	http.HandleFunc("/favicon.ico", handlerFaviconIco)
	http.HandleFunc("/img/siridb-large.png", handlerSiriDBLargePNG)
	http.HandleFunc("/img/siridb-small.png", handlerSiriDBSmallPNG)
	http.HandleFunc("/css/font-awesome.min.css", handlerFontAwesomeMinCSS)
	http.HandleFunc("/fonts/FontAwesome.otf", handlerFontsFaOTF)
	http.HandleFunc("/fonts/fontawesome-webfont.eot", handlerFontsFaEOT)
	http.HandleFunc("/fonts/fontawesome-webfont.svg", handlerFontsFaSVG)
	http.HandleFunc("/fonts/fontawesome-webfont.ttf", handlerFontsFaTTF)
	http.HandleFunc("/fonts/fontawesome-webfont.woff", handlerFontsFaWOFF)
	http.HandleFunc("/fonts/fontawesome-webfont.woff2", handlerFontsFaWOFF2)
	http.HandleFunc("/version/fetch", handlerVersionFetch)
	http.HandleFunc("/accounts/fetch", handlerAccountsFetch)
	http.HandleFunc("/databases/fetch", handlerDatabasesFetch)
	http.HandleFunc("/auth/fetch", handlerAuthFetch)
	http.HandleFunc("/auth/login", handlerAuthLogin)
	http.HandleFunc("/auth/logoff", handlerAuthLogoff)
	http.HandleFunc("/auth/change-password", handlerAuthChangePassword)
	return nil
}

func main() {
	var server, args string
	var err error
	var port uint16

	// parse arguments
	args, err = xApp.Parse(os.Args[1:])

	if *xVersion {
		fmt.Printf("Version: %s\n", AppVersion)
		os.Exit(0)
	}

	if *xHTTP {
		if err != nil && strings.Compare(err.Error(), "required flag --user not provided") != 0 {
			fmt.Printf("%s\n", err)
			os.Exit(1)
		}

		initHTTP()

		fmt.Printf("Serving a graphical user interface on: http://0.0.0.0:%d\nPress CTRL+C to quit\n", *xHTTPPort)
		http.ListenAndServe(fmt.Sprintf(":%d", *xHTTPPort), nil)
	} else {
		if err != nil {
			fmt.Printf("%s\n", err)
			os.Exit(1)
		}

		server, port, err = getHostAndPort(*xServer)
		if err != nil {
			fmt.Printf(invalidServerAddress, *xServer)
			os.Exit(1)
		}

		// ask password if not supplied
		if len(*xPassword) == 0 {
			pass := getpass()
			xPassword = &pass
		}

		conn := siridb.NewConnection(server, port)
		if !*xVerbose {
			// suppress logging if not in verbose mode
			logCh := make(chan string)
			go logHandle(logCh)
			conn.LogCh = logCh
		}

		var msg interface{}

		switch kingpin.MustParse(args, err) {
		case xGetVersion.FullCommand():
			msg, err = getVersion(conn, *xAccount, *xPassword)
		case xGetAccounts.FullCommand():
			msg, err = getAccounts(conn, *xAccount, *xPassword)
		case xGetDatabases.FullCommand():
			msg, err = getDatabases(conn, *xAccount, *xPassword)
		case xNewReplica.FullCommand():
			msg, err = newReplica(conn)
		case xNewAccount.FullCommand():
			msg, err = newAccount(conn)
		case xDropAccount.FullCommand():
			msg, err = dropAccount(conn)
		case xChangeAccount.FullCommand():
			msg, err = changePassword(conn, *xAccount, *xPassword, *xAccount, *xCaPassword)
		case xNewDatabase.FullCommand():
			msg, err = newDatabase(conn)
		case xNewReplica.FullCommand():
			msg, err = newReplica(conn)
		case xNewPool.FullCommand():
			msg, err = newPool(conn)
		}

		conn.Close()

		if err != nil {
			fmt.Println(err)
			os.Exit(1)
		}
		fmt.Println(msg)
	}
}
