# SiriDB Admin Tool
Tool for managing SiriDB service accounts and databases. SiriDB-Adnin can be used both by command-line arguments but also supplies a graphical web-inteface.

---------------------------------------
  * [Installation](#installation)
    * [Pre-compiled](#pre-compiled)
    * [Compile from source](#compile-from-source)
  * [Graphical Web Interface](#graphical-web-interface)
  * [Command-line arguments](#command-line-arguments)
    * [Service accounts](#service-accounts)
      * [List service accounts](#list-service-accounts)
      * [New service account](#new-service-account)
      * [Change password](#change-password)
      * [Remove service account](#remove-service-account)

---------------------------------------
## Installation
SiriDB Admin Tool can be compiled from source or for most systems you can simple download a pre-compiled binary.

### Pre-compiled
Go to https://github.com/transceptor-technology/siridb-admin/releases/latest and download the binary for your system.
In this manual we refer to the binary as `siridb-admin`. On linux it can be preferred to copy the binary to /usr/bin and create a symlink like this:
```
$ sudo cp siridb-admin_X.Y.Z_OS_ARCH.bin /usr/bin/
$ sudo ln -s /usr/bin/siridb-admin_X.Y.Z_OS_ARCH.bin /usr/bin/siridb-admin
```
Note: replace `X.Y.Z_OS_ARCH` with your binary, for example `1.1.0_linux_amd64`

### Compile from source
SiriDB Admin is written in Go and ReactJs. We asume go, npm, lessc and python are installed on your system.

First you need to install the required npm packages from the `src` directory:
```
$ cd ./src && npm install
```
Within the same directory you can now build the required javascript file:
```
$ NODE_ENV='production' ./node_modules/.bin/webpack -p
```
Or in case you want to build the debug/development version:
```
$ ./node_modules/.bin/webpack -d
```
Next you should compile the less file (stylesheet):
```
$ cd .. && ./gobuild.py --less
```
SiriDB Admin includes all required files in the binary, unless when build using the `debug` tag. To build the binary files from the source files you should run:
```
$ ./gobuild.py --go
```
Or, in case you only want to use the debug/development version its enough to generate empty binary files which can be done with:
```
$ ./gobuild.py --go-empty
```
Now you can build the actual SiriDB admin tool. In case you want to build a production version:
```
$ go build
```
Or, for the debug/development version:
```
$ go build --tags debug
```

## Graphical Web Interface
A web interface can be started with the following command:
```  
siridb-admin --http
```
This will open a webserver listening on port 8080. You can now access the graphical interface by opening url http://localhost:8080 in your favorite web-browser.

Possible you want to use a different port for the webserver. This can be done using the `-O` or `--port` argument. For example:
```
siridb-admin --http --port 5050
```  

## Command-line arguments
SiriDB Admin can be used using command line arguments only. This can be useful in case you want to create and extend a SiriDB database using a script. 

All commands start with the following arguments:
```
siridb-admin -u <service_account> [-p <password>] [-s <siridb_server>] <command> ...
```
The service account is a required argument. By default the `sa` user with password `siri` is installed on a SiriDB server and this account will be used in most examples in this documentation. 

If the `-p` flag with the service account password is not given, the tool will ask for the service account password.

The other optional argument flag `-s` can be used to provide a SiriDB server address and optional port. If not given then the default `localhost:9000` is used. If we for example have installed SiriDB on a server with hostname `siridb01.foo.local`, we can simple use argument `-s siridb01.foo.local`. Note that adding `:9000` is not required since port 9000 is the default port.

It is also possible to use an IPv4 or IPv6 address instead of a hostname. In case you want to use both an IPv6 address and use an alternative port then do not forget to put the IPv6 address between braces. For example: `[::1]:5050` is a valid IPv6 address and port.

If something goes wrong you should usually get an error message with some information. More information can be printed when the `--verbose` flag is used. The `--verbose` flag works together with all arguments including the `--http` argument.

### Service accounts
Service accounts are used for managing databases. A service account is a user on a SiriDB server and never has access to a SiriDB database. We call users with access to a database 'database users'. We keep this accounts seperate because database accounts exist in a database which possible extends over multiple SiriDB servers.

### List service accounts
Get all service accounts on siridb01.foo.local using service account sa with password siri:
```
siridb-admin -u sa -p siri -s siridb01.foo.local get-accounts
```

#### New service account
A new service account can be created using the command below.
```
siridb-admin -u sa -s siridb01.foo.local new-account bob passwd4bob
```
This command will ask for the `sa` password and then create a service account `bob` with password `passwd4bob` on a SiriDB server with hostname `siridb01.foo.local`. 

#### Change password
A password can be changed using the following command:
```
siridb-admin -u sa -p siri -s siridb01.foo.local:9000 change-password newpassw0rd
```
This will change the password for the `sa` service account on SiriDB server `siridb01.foo.local` from `siri` to `newpassw0rd`.

#### Remove service account
Service accounts can be removed using the following command:
```
siridb-admin -u sa -p siri -s siridb01.foo.local drop-account bob
```
This command will remove service account `bob` from SiriDB server `siridb01.foo.local`.


