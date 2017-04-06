# SiriDB Admin Tool
Tool for managing SiriDB service accounts and databases. SiriDB-Adnin can be used both by command-line arguments but also supplies a graphical web-inteface.

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
siridb-admin -u <service_account> [-p <password>] -s <siridb_server> <command> ...
```


### Service accounts
Service accounts are used for managing databases. A service account is a user on a SiriDB server and never has access to a SiriDB database. We call users with access to a database 'database users'. We keep this accounts seperate because database accounts exist in a database which possible extends over multiple SiriDB servers.

#### Create a new service account
A new service account can be created using the command below.
```
siridb-admin -u sa -s siridb01.foo.local new-account bob passwd4bob
```
This command will ask for the `sa` password and then create a service account `bob` with password `passwd4bob` on a SiriDB server with hostname `siridb01.foo.local`. 

In case you do not want the tool to ask for your password it is possible to prevent this question by providing the password by using argument flag `-p <password>`.

The tool asumes SiriDB server `siridb01.foo.local` is listening to client connections on port 9000. If this is not the case then an altrnative port can be supplied by adding `:<port>` to the hostname. For eample: `siridb01.foo.local:5050`. 

It is also possible to use an IPv4 or IPv6 address instead of a hostname. In case you want to use both an IPv6 address and use an alternative port then do not forget to put the IPv6 address between braces. For example: `[::1]:5050` is a valid IPv6 address and port.

#### Change a service account password
A password can be changed using the following command:
```
siridb-admin -u sa -p siri -s siridb01.foo.local:9000 change-password newpassw0rd
```
This will change the password for the `sa` service account on SiriDB server `siridb01.foo.local` from `siri` to `newpassw0rd`.

### Remove a service account
Service accounts can be removed using the following command:
```
siridb-admin -u sa -p siri -s siridb01.foo.local drop-account bob
```
This command will remove service account `bob` from SiriDB server `siridb01.foo.local`.


