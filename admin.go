package main

import (
	"fmt"
	"os"
	"strconv"

	"github.com/howeyc/gopass"
	siridb "github.com/transceptor-technology/go-siridb-connector"

	"strings"

	kingpin "gopkg.in/alecthomas/kingpin.v2"
)

// Version information.
const Version = "1.0.0"

var (
	xApp      = kingpin.New("siridb-admin", "Tool for creating and expanding SiriDB databases.")
	xAccount  = xApp.Flag("user", "Account name for connecting to the SiriDB server.").Short('u').Required().String()
	xPassword = xApp.Flag("password", "Password for your account.").Short('p').String()
	xServer   = xApp.Flag("server", "Server address[:port] for the SiriDB server.").Short('s').Default("localhost:9000").String()
	xVerbose  = xApp.Flag("verbose", "Enable verbose logging.").Bool()
	xVersion  = xApp.Flag("version", "Print version information and exit.").Bool()

	xGetVersion   = xApp.Command("get-version", "Returns SiriDB server version information.")
	xGetAccounts  = xApp.Command("get-accounts", "Returns all server account names.")
	xGetDatabases = xApp.Command("get-databases", "Returns all databases on the SiriDB server.")

	xNewAccount = xApp.Command("new-account", "Create a new server account.")
	xNaAccount  = xNewAccount.Arg("name", "Name for the new account.").Required().String()
	xNaPassword = xNewAccount.Arg("password", "Password for the new account.").Required().String()

	xDropAccount = xApp.Command("drop-account", "Remove a server account.")
	xDaAccount   = xDropAccount.Arg("name", "Account name which you want to drop.").Required().String()

	xChangeAccount = xApp.Command("change-password", "Change password for your server account.")
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

	xNewReplica = xApp.Command("new-replica", "Expand a SiriDB database with a new pool.")
	xNrServer   = xNewReplica.Flag("address", "SiriDB server address[:port]. Can be any server from the database you want to add a new replica to.").Short('a').Required().String()
	xNrDatabase = xNewReplica.Flag("dbname", "Database name where you want to add the new replica to.").Short('d').Required().String()
	xNrUser     = xNewReplica.Flag("database-user", "User with full privileges to the database.").Short('U').Required().String()
	xNrPassword = xNewReplica.Flag("database-password", "Password for the database user.").Short('P').Required().String()
	xNrPool     = xNewReplica.Flag("pool", "Pool number which you want to create the replica for.").Short('o').Required().Int()
)

const invalidServerAddress = "invalid server address: %s (valid examples: myserver.local, myserver.local:9000, ::1, [::1]:9000, etc...)\n"

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

func newDatabase(conn *siridb.Connection) error {
	options := make(map[string]interface{})

	options["dbname"] = *xNdDatabase
	options["time_precision"] = *xNdTimep
	options["buffer_size"] = *xNdBufSize
	options["duration_num"] = *xNdDuraNum
	options["duration_log"] = *xNdDuraLog

	_, err := conn.Manage(*xAccount, *xPassword, siridb.AdminNewDatabase, options)

	if err == nil {
		fmt.Printf("successfully created database: %s\n", *xNdDatabase)
	}
	return err
}

func newPool(conn *siridb.Connection) error {

	server, port, err := getHostAndPort(*xNpServer)
	if err != nil {
		return fmt.Errorf(invalidServerAddress, *xNpServer)
	}

	options := make(map[string]interface{})

	options["dbname"] = *xNpDatabase
	options["host"] = server
	options["port"] = int(port)
	options["username"] = *xNpUser
	options["password"] = *xNpPassword

	_, err = conn.Manage(*xAccount, *xPassword, siridb.AdminNewPool, options)

	if err == nil {
		fmt.Printf("successfully created a pool for database: %s\n", *xNpDatabase)
	}
	return err
}

func newReplica(conn *siridb.Connection) error {

	server, port, err := getHostAndPort(*xNrServer)
	if err != nil {
		return fmt.Errorf(invalidServerAddress, *xNrServer)
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
		fmt.Printf("successfully created a replica for database: %s\n", *xNrDatabase)
	}
	return err
}

func getAccounts(conn *siridb.Connection) error {
	res, err := conn.Manage(*xAccount, *xPassword, siridb.AdminGetAccounts, nil)
	if err == nil {
		fmt.Println(res)
	}
	return err
}

func getDatabases(conn *siridb.Connection) error {
	res, err := conn.Manage(*xAccount, *xPassword, siridb.AdminGetDatabases, nil)
	if err == nil {
		fmt.Println(res)
	}
	return err
}

func getVersion(conn *siridb.Connection) error {
	res, err := conn.Manage(*xAccount, *xPassword, siridb.AdminGetVersion, nil)
	if err == nil {
		fmt.Println(res)
	}
	return err
}

func newAccount(conn *siridb.Connection) error {
	options := make(map[string]interface{})

	options["account"] = *xNaAccount
	options["password"] = *xNaPassword

	_, err := conn.Manage(*xAccount, *xPassword, siridb.AdminNewAccount, options)
	if err == nil {
		fmt.Printf("successfully created server account: %s\n", *xNaAccount)
	}
	return err
}

func dropAccount(conn *siridb.Connection) error {
	options := make(map[string]interface{})

	options["account"] = *xDaAccount

	_, err := conn.Manage(*xAccount, *xPassword, siridb.AdminDropAccount, options)
	if err == nil {
		fmt.Printf("successfully dropped server account: %s\n", *xDaAccount)
	}
	return err
}

func changePassword(conn *siridb.Connection) error {
	options := make(map[string]interface{})

	options["account"] = *xAccount
	options["password"] = *xCaPassword

	_, err := conn.Manage(*xAccount, *xPassword, siridb.AdminChangePassword, options)
	if err == nil {
		fmt.Printf("successfully changed password for server account: %s", *xAccount)
	}
	return err
}

func logHandle(logCh chan string) {
	for {
		<-logCh // ignore logs when not in verbose mode
	}
}

func main() {
	var server, args string
	var err error
	var port uint16

	// parse arguments
	args, err = xApp.Parse(os.Args[1:])

	if *xVersion {
		fmt.Printf("Version: %s\n", Version)
		os.Exit(0)
	}

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

	switch kingpin.MustParse(args, err) {
	case xGetVersion.FullCommand():
		err = getVersion(conn)
	case xGetAccounts.FullCommand():
		err = getAccounts(conn)
	case xGetDatabases.FullCommand():
		err = getDatabases(conn)
	case xNewReplica.FullCommand():
		err = newReplica(conn)
	case xNewAccount.FullCommand():
		err = newAccount(conn)
	case xDropAccount.FullCommand():
		err = dropAccount(conn)
	case xChangeAccount.FullCommand():
		err = changePassword(conn)
	case xNewDatabase.FullCommand():
		err = newDatabase(conn)
	case xNewReplica.FullCommand():
		err = newReplica(conn)
	case xNewPool.FullCommand():
		err = newPool(conn)
	}

	conn.Close()

	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
}
