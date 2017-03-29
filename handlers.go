package main

import (
	"encoding/json"
	"net/http"
)

func handlerAuthFetch(w http.ResponseWriter, r *http.Request) {
	if sess, err := globalSessions.SessionStart(w, r); err == nil {
		defer sess.SessionRelease(w)
		username := sess.Get("username")
		m := make(map[string]interface{})
		m["user"] = username
		if b, err := json.Marshal(m); err == nil {
			w.Write(b)
		}
	}
}
