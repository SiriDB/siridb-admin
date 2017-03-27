// +build debug

package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
)

func handlerMain(w http.ResponseWriter, r *http.Request) {
	handleFileRequest(w, "./build/index.html")
}

func handlerJsBundle(w http.ResponseWriter, r *http.Request) {
	handleFileRequest(w, "./build/bundle.js")
}

func handlerFaviconIco(w http.ResponseWriter, r *http.Request) {
	handleFileRequest(w, "./build/favicon.ico")
}

func handleFileRequest(w http.ResponseWriter, fn string) {
	b, err := ioutil.ReadFile(fn)
	if err == nil {
		_, err = w.Write(b)
	} else {
		w.WriteHeader(http.StatusInternalServerError)
		_, err = fmt.Fprintf(w, "Internal server error: %s", err)
	}
	if err != nil {
		fmt.Println(err)
	}
}

func init() {
	fmt.Println("DEBUG MODE: using original template files...")
}
