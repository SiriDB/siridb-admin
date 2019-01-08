package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	siridb "github.com/SiriDB/go-siridb-connector"
)

func respError(w http.ResponseWriter, r *http.Request) {

}

func handlerAuthFetch(w http.ResponseWriter, r *http.Request) {
	if sess, err := globalSessions.SessionStart(w, r); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	} else {
		defer sess.SessionRelease(w)
		username := sess.Get("username")
		m := make(map[string]interface{})
		m["user"] = username
		if b, err := json.Marshal(m); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		} else {
			w.Write(b)
		}
	}
}

type fetchFunc func(conn *siridb.Connection, account, password string) (interface{}, error)

func fetch(w http.ResponseWriter, r *http.Request, fn fetchFunc) {
	sess, err := globalSessions.SessionStart(w, r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	server, port, err := getHostAndPort(sess.Get("server").(string))
	if err != nil {
		msg := fmt.Sprintf(invalidServerAddress, sess.Get("server").(string))
		http.Error(w, msg, http.StatusInternalServerError)
		return
	}

	conn := siridb.NewConnection(server, port)
	conn.LogCh = *logChannel

	res, err := fn(conn, sess.Get("username").(string), sess.Get("password").(string))
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if b, err := json.Marshal(res); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	} else {
		w.Write(b)
	}
}

func handlerVersionFetch(w http.ResponseWriter, r *http.Request) {
	fetch(w, r, getVersion)
}

func handlerAccountsFetch(w http.ResponseWriter, r *http.Request) {
	fetch(w, r, getAccounts)
}

func handlerDatabasesFetch(w http.ResponseWriter, r *http.Request) {
	fetch(w, r, getDatabases)
}

func handlerAccountsDrop(w http.ResponseWriter, r *http.Request) {
	b, err := ioutil.ReadAll(r.Body)
	defer r.Body.Close()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	sess, err := globalSessions.SessionStart(w, r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	type DropAccount struct {
		Username string `json:"username"`
	}

	var dropAccnt DropAccount

	err = json.Unmarshal(b, &dropAccnt)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	server, port, err := getHostAndPort(sess.Get("server").(string))

	if err != nil {
		msg := fmt.Sprintf(invalidServerAddress, sess.Get("server").(string))
		http.Error(w, msg, http.StatusInternalServerError)
		return
	}

	conn := siridb.NewConnection(server, port)
	conn.LogCh = *logChannel

	res, err := dropAccount(
		conn,
		sess.Get("username").(string),
		sess.Get("password").(string),
		dropAccnt.Username)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if b, err := json.Marshal(res); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	} else {
		w.Write(b)
	}
}

func handlerDatabasesDrop(w http.ResponseWriter, r *http.Request) {
	b, err := ioutil.ReadAll(r.Body)
	defer r.Body.Close()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	sess, err := globalSessions.SessionStart(w, r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	type DropDatabase struct {
		Dbname        string `json:"dbname"`
		IgnoreOffline bool   `json:"ignoreOffline"`
	}

	var dropDb DropDatabase

	err = json.Unmarshal(b, &dropDb)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	server, port, err := getHostAndPort(sess.Get("server").(string))

	if err != nil {
		msg := fmt.Sprintf(invalidServerAddress, sess.Get("server").(string))
		http.Error(w, msg, http.StatusInternalServerError)
		return
	}

	conn := siridb.NewConnection(server, port)
	conn.LogCh = *logChannel

	res, err := dropDatabase(
		conn,
		sess.Get("username").(string),
		sess.Get("password").(string),
		dropDb.Dbname,
		dropDb.IgnoreOffline,
		true)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if b, err := json.Marshal(res); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	} else {
		w.Write(b)
	}
}

func handlerDatabasesNewReplica(w http.ResponseWriter, r *http.Request) {
	b, err := ioutil.ReadAll(r.Body)
	defer r.Body.Close()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	sess, err := globalSessions.SessionStart(w, r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	type NewReplica struct {
		Dbname   string `json:"dbname"`
		Server   string `json:"server"`
		Username string `json:"username"`
		Password string `json:"password"`
		Pool     int    `json:"pool"`
	}

	var newRpl NewReplica

	err = json.Unmarshal(b, &newRpl)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	server, port, err := getHostAndPort(sess.Get("server").(string))

	if err != nil {
		msg := fmt.Sprintf(invalidServerAddress, sess.Get("server").(string))
		http.Error(w, msg, http.StatusInternalServerError)
		return
	}

	conn := siridb.NewConnection(server, port)
	conn.LogCh = *logChannel

	res, err := newReplica(
		conn,
		sess.Get("username").(string),
		sess.Get("password").(string),
		newRpl.Dbname,
		newRpl.Server,
		newRpl.Username,
		newRpl.Password,
		newRpl.Pool,
		true)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if b, err := json.Marshal(res); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	} else {
		w.Write(b)
	}
}

func handlerDatabasesNewPool(w http.ResponseWriter, r *http.Request) {
	b, err := ioutil.ReadAll(r.Body)
	defer r.Body.Close()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	sess, err := globalSessions.SessionStart(w, r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	type NewPool struct {
		Dbname   string `json:"dbname"`
		Server   string `json:"server"`
		Username string `json:"username"`
		Password string `json:"password"`
	}

	var newPl NewPool

	err = json.Unmarshal(b, &newPl)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	server, port, err := getHostAndPort(sess.Get("server").(string))

	if err != nil {
		msg := fmt.Sprintf(invalidServerAddress, sess.Get("server").(string))
		http.Error(w, msg, http.StatusInternalServerError)
		return
	}

	conn := siridb.NewConnection(server, port)
	conn.LogCh = *logChannel

	res, err := newPool(
		conn,
		sess.Get("username").(string),
		sess.Get("password").(string),
		newPl.Dbname,
		newPl.Server,
		newPl.Username,
		newPl.Password,
		true)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if b, err := json.Marshal(res); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	} else {
		w.Write(b)
	}
}

func handlerDatabasesNewDatabase(w http.ResponseWriter, r *http.Request) {
	b, err := ioutil.ReadAll(r.Body)
	defer r.Body.Close()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	sess, err := globalSessions.SessionStart(w, r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	type NewDatabase struct {
		Dbname        string `json:"dbname"`
		TimePrecision string `json:"timePrecision"`
		BufferSize    int    `json:"bufferSize"`
		DurationNum   string `json:"durationNum"`
		DurationLog   string `json:"durationLog"`
	}

	var newDb NewDatabase

	err = json.Unmarshal(b, &newDb)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	server, port, err := getHostAndPort(sess.Get("server").(string))

	if err != nil {
		msg := fmt.Sprintf(invalidServerAddress, sess.Get("server").(string))
		http.Error(w, msg, http.StatusInternalServerError)
		return
	}

	conn := siridb.NewConnection(server, port)
	conn.LogCh = *logChannel

	res, err := newDatabase(
		conn,
		sess.Get("username").(string),
		sess.Get("password").(string),
		newDb.Dbname,
		newDb.TimePrecision,
		newDb.BufferSize,
		newDb.DurationNum,
		newDb.DurationLog)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if b, err := json.Marshal(res); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	} else {
		w.Write(b)
	}
}

func handlerAccountsNew(w http.ResponseWriter, r *http.Request) {
	b, err := ioutil.ReadAll(r.Body)
	defer r.Body.Close()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	sess, err := globalSessions.SessionStart(w, r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	type NewAccount struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	var newAccnt NewAccount

	err = json.Unmarshal(b, &newAccnt)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	server, port, err := getHostAndPort(sess.Get("server").(string))

	if err != nil {
		msg := fmt.Sprintf(invalidServerAddress, sess.Get("server").(string))
		http.Error(w, msg, http.StatusInternalServerError)
		return
	}

	conn := siridb.NewConnection(server, port)
	conn.LogCh = *logChannel

	res, err := newAccount(
		conn,
		sess.Get("username").(string),
		sess.Get("password").(string),
		newAccnt.Username,
		newAccnt.Password)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if b, err := json.Marshal(res); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	} else {
		w.Write(b)
	}
}

func handlerAuthChangePassword(w http.ResponseWriter, r *http.Request) {
	b, err := ioutil.ReadAll(r.Body)
	defer r.Body.Close()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	sess, err := globalSessions.SessionStart(w, r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	type ChangePw struct {
		Current  string `json:"current"`
		Password string `json:"password"`
	}

	var changePw ChangePw

	err = json.Unmarshal(b, &changePw)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	server, port, err := getHostAndPort(sess.Get("server").(string))

	if err != nil {
		msg := fmt.Sprintf(invalidServerAddress, sess.Get("server").(string))
		http.Error(w, msg, http.StatusInternalServerError)
		return
	}

	conn := siridb.NewConnection(server, port)
	conn.LogCh = *logChannel

	res, err := changePassword(
		conn,
		sess.Get("username").(string),
		changePw.Current,
		sess.Get("username").(string),
		changePw.Password)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if b, err := json.Marshal(res); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	} else {
		w.Write(b)
	}
}

func handlerAuthLogoff(w http.ResponseWriter, r *http.Request) {
	sess, err := globalSessions.SessionStart(w, r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	err = sess.Flush()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	if b, err := json.Marshal("successfully signed out"); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	} else {
		w.Write(b)
	}
}

func handlerAuthLogin(w http.ResponseWriter, r *http.Request) {
	b, err := ioutil.ReadAll(r.Body)
	defer r.Body.Close()
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	sess, err := globalSessions.SessionStart(w, r)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	type Login struct {
		Username string `json:"username"`
		Password string `json:"password"`
		Server   string `json:"server"`
	}
	var login Login

	err = json.Unmarshal(b, &login)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	server, port, err := getHostAndPort(login.Server)

	if err != nil {
		msg := fmt.Sprintf(invalidServerAddress, login.Server)
		http.Error(w, msg, http.StatusInternalServerError)
		return
	}

	conn := siridb.NewConnection(server, port)
	conn.LogCh = *logChannel

	_, err = getVersion(conn, login.Username, login.Password)

	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	sess.Set("username", login.Username)
	sess.Set("password", login.Password)
	sess.Set("server", login.Server)

	m := make(map[string]interface{})
	m["user"] = login.Username
	if b, err := json.Marshal(m); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	} else {
		w.Write(b)
	}
}
