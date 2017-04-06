# SiriDB Admin Tool
Tool for managing SiriDB service accounts and databases. SiriDB-Adnin can be used both by command-line arguments but also supplies a graphical web-inteface.

---------------------------------------
  * [Graphical Web Interface](#graphical-web-interface)
  * [Command-line arguments](#command-line-arguments)
    * [Service accounts](#service-accounts)
      * [New service account](#new-service-account)
      * [Change password](#change-password)
      * [Remove service account](#remove-service-account)

---------------------------------------

## Graphical Web Interface
A web interface can be stated with the sollowing command:
```  
siridb-admin --http
```
This will open a webserver lisening on port 8080 by default. You can now access the graphical interface by opening a web-browser and opening thu url http://localhost:8080.

Possible you want to use a different port for the webserver. This can be done using the `-O` argument. For example:
```
siridb-admin --http -O 5050
```  
This will start the web-server on port 5050 and you can now use url http://localhost:5050 for the graphical interface.

## Command-line arguments
SiriDB Admin can be used using command line arguments only. This can be useful in case you want to create and extend a SiriDB database using a script. 

All commands start with the following arguments:
```
siridb-admin -u <service_account> [-p <password>] [-s <siridb_server>] <command> ...
```
The service account is a required argument. By default the `sa` user with password `siri` is installed on a SiriDB server. 

If the `-p` flag with the service account password is not given, the tool will ask for the service account password.

The other optional argument flag `-s` can be used to provide a SiriDB server address and optional port. If not given then the default `localhost:9000` is used. If we for example have installed SiriDB on a server with hostname `siridb01.foo.local`, we can simple use argument `-s siridb01.foo.local`. Note that adding `:9000` is not required since port 9000 is the default port.

It is also possible to use an IPv4 or IPv6 address instead of a hostname. In case you want to use both an IPv6 address and use an alternative port then do not forget to put the IPv6 address between braces. For example: `[::1]:5050` is a valid IPv6 address and port.

### Service accounts
Service accounts are used for managing databases. A service account is a user on a SiriDB server and never has access to a SiriDB database. We call users with access to a database 'database users'. We keep this accounts seperate because database accounts exist in a database which possible extends over multiple SiriDB servers.

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


