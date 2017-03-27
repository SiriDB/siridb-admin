package main

import (
	"fmt"

	kingpin "gopkg.in/alecthomas/kingpin.v2"
)

var (
	verbose = kingpin.Flag("verbose", "Verbose mode.").Short('v').Bool()
	name    = kingpin.Flag("name", "Name of user.").Short('n').Required().String()
)

func main() {
	kingpin.Parse()
	fmt.Printf("%v, %s\n", *verbose, *name)
}
