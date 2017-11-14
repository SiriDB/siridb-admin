# SiriDB Admin Tool
![alt SiriDB Admin](/siridb-admin.png?raw=true)

Tool for managing SiriDB service accounts and databases. SiriDB-Admin can be used both by command-line arguments and a graphical web-interface.

---------------------------------------
  * [Requirements](#requirements)
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
    * [Databases](#databases)
      * [List databases](#list-databases)
      * [New database](#new-database)
      * [New replica](#new-replica)
      * [New pool](#new-pool)

---------------------------------------
## Requirements
SiriDB Admin only works with SiriDB version 2.0.16 and higher. For older versions of SiriDB the manage tool is required and can be found at https://github.com/transceptor-technology/siridb-manage

## Installation
SiriDB Admin Tool can be compiled from source or, for most systems, you can simply download a pre-compiled binary.

### Pre-compiled
Go to https://github.com/transceptor-technology/siridb-admin/releases/latest and download the binary for your system.
In this documentation we refer to the binary as `siridb-admin`. On Linux/OSX it might be required to set the execution flag:
```
$ chmod + x siridb-admin_X.Y.Z_OS_ARCH.bin
```

You might want to copy the binary to /usr/local/bin and create a symlink like this:
```
$ sudo cp siridb-admin_X.Y.Z_OS_ARCH.bin /usr/local/bin/
$ sudo ln -s /usr/local/bin/siridb-admin_X.Y.Z_OS_ARCH.bin /usr/local/bin/siridb-admin
```
Note: replace `X.Y.Z_OS_ARCH` with your binary, for example `1.1.1_linux_amd64`

### Compile from source
> Before compiling from source make sure **go**, **npm** and **git** are installed and your [$GOPATH](https://github.com/golang/go/wiki/GOPATH) is set.

Clone the project using git. (we assume git is installed)
```
git clone https://github.com/transceptor-technology/siridb-admin
```

Make sure less is installed:
```
$ sudo npm install -g less less-plugin-clean-css
```

The gobuild.py script can be used to build the binary:
```
$ ./gobuild.py -i -l -w -b -p
```

Or, if you want the development version which uses original files from /build and /static instead of build-in files:
```
$ ./gobuild.py -i -l -w -b -d
```

## Graphical Web Interface
A web interface can be started with the following command:
```
siridb-admin --http
```
This will start a webserver listening on port 8080. You can now access the graphical interface by opening url http://localhost:8080 in your favorite web-browser.

Note: you might want to use a different port for the webserver. This can be done using the `-O` or `--port` argument flag. For example:
```
siridb-admin --http --port 5050
```

## Command-line arguments
SiriDB Admin can be used by just using command line arguments. This can be useful in case you want to create and extend a SiriDB database using a script.

All commands start with the following arguments:
```
siridb-admin -u <service_account> [-p <password>] [-s <siridb_server>] <command> ...
```
The service account is a required argument. By default the `sa` user with password `siri` is installed on a SiriDB server and this account will be used in most examples in this documentation.

If the `-p` flag with the service account password is not given, the tool will ask for the service account password.

The other optional argument flag `-s` can be used to provide a SiriDB server address and optional port. If not given then the default `localhost:9000` is used. If we, for example, have installed SiriDB on a server with hostname `siridb01.foo.local`, we can simply use argument `-s siridb01.foo.local`. Note that adding `:9000` is not required since port 9000 is the default port.

It is also possible to use an IPv4 or IPv6 address instead of a hostname. In case you want to use both an IPv6 address and use an alternative port then do not forget to put the IPv6 address between braces. For example: `[::1]:5050` is a valid IPv6 address and port.

If something goes wrong you should usually get an error message with some information. More information can be printed when the `--verbose` flag is used. The `--verbose` flag works together with all arguments including the `--http` argument.

### Service accounts
Service accounts are used for managing databases. A service account is a user on a SiriDB server that never has access to a SiriDB database. We call users with access to a database 'database users'. We keep these accounts seperate because database accounts exist in a database which possible extends over multiple SiriDB servers.

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

### Databases
SiriDB Admin can be used to create a new database or extend an existing database with a new pool or replica. Note that databases can not be removed with this tool. As long as a database exists only on one SiriDB server you can remove the database by stopping the siridb-server process and then remove the database directory. All database directories can be found in the database path which can be configured in the siridb configuration file.

### List databases
Get all existing databases on a SiriDB server siridb01.foo.local using service account sa with password siri:
```
siridb-admin -u sa -p siri -s siridb01.foo.local get-databases
```

### New database
A new database can be created with the following syntax:
```
siridb-admin -u <service_account> [flags] new-database
  -d, --db-name=DB-NAME        Database name. (Must be at least 2 and at most 20 characters. First
                               character must be a letter. Last character must be a letter or number.
                               In between letters, numbers, hyphen and underscores are allowed)
  -t, --time-precision="ms"    Time precision for the new database. Supported time precessions are
                               s (second), ms (millisecond), us (microsecond) and ns (nanosecond).
                               This value cannot be changed once the database is created.
  -b, --buffer-size=1024       Buffer size for the new database. Each series uses a buffer space in
                               both memory and disk before points are actually written to shards.
                               This value cannot be changed once the database is created.
  -N, --duration-num="1w"      Number duration for the new database. Points are written to shards and
                               each shard has points for a specific time range. The size or time
                               window can be chosen but not changed once the database is created. For
                               example: the value '1w' will create shards holding points for 1 week.
  -L, --duration-log="1d"      Log duration for the new database. Like numeric duration but then for
                               log values. At the moment log values are not supported by SiriDB but
                               this will be implemented in a future release.

```
For example:
```
siridb-admin -u sa -p siri -s siridb01.foo.local new-database -d dbexample -t s
```
This will create database `dbexamle` on SiriDB server `siridb01.foo.local` with a *second* time precision. 

>Note: each new database will be created with a default database user `iris` and password `siri`.

### New replica
The following syntax can be used to create a new replica:
```
siridb-admin -u <service_account> [flags] new-replica
  -d, --db-name=DB-NAME          Database name where you want to add the new replica to.
  -U, --db-user=DB-USER          User with full privileges to the database.
  -P, --db-password=DB-PASSWORD  Password for the database user.
  -S, --db-server=DB-SERVER      SiriDB server address[:port]. Can be any server from the database
                                 you want to add a new replica to.
  -o, --pool=POOL                Pool number which you want to create the replica for.
  -f, --force                    Suppress warning message.
```
For example:
```
siridb-admin -u sa -p siri -s siridb02.foo.local new-replica -d dbexample -U iris -P siri -S siridb01.foo.local --pool 0
```
This will ask for confirmation and then create a replica on SiriDB server `siridb02.foo.local` for pool `0` in database `dbexample`.

### New pool
The following syntax can be used to create a new pool:
```
siridb-admin -u <service_account> [flags] new-pool
  -d, --db-name=DB-NAME          Database name where you want to add the new pool to.
  -U, --db-user=DB-USER          User with full privileges to the database.
  -P, --db-password=DB-PASSWORD  Password for the database user.
  -S, --db-server=DB-SERVER      SiriDB server address[:port]. Can be any server from the database
                                 you want to add a new pool to.
  -f, --force                    Suppress warning message.
```
For example:
```
siridb-admin -u sa -p siri -s siridb03.foo.local new-pool -d dbexample -U iris -P siri -S siridb01.foo.local
```
This will ask for confirmation and then create a new pool on SiriDB server `siridb03.foo.local` for database `dbexample`. Pool id's will be incremented automatically so if the database only had pool `0` then the new pool will have id `1`.

