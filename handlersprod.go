// +build !debug

package main

import "net/http"

// func handlerMain(w http.ResponseWriter, r *http.Request) {
// 	w.Write(FileIndexHTML)
// }

// func handlerJsBundle(w http.ResponseWriter, r *http.Request) {
// 	w.Write(FileBundleMinJS)
// }

func handlerFaviconIco(w http.ResponseWriter, r *http.Request) {
	w.Write(FileFaviconICO)
}
