# SiriDB Admin Tool
Tool for managing SiriDB service accounts and databases. SiriDB-Adnin can be used both by command-line arguments but also supplies a graphical web-inteface.

## Graphical Web Interface
A web interface can be stated with the sollowing command:

  siridb-admin --http
  
This will open a webserver lisening on port 8080 by default. You can now access the graphical interface by opening a web-browser and opening thu url http://localhost:8080.

Possible you want to use a different port for the webserver. This can be done using the `-O` argument. For example:

  siridb-admin --http -O 5050
  
This will start the web-server on port 5050 and you can now use url http://localhost:5050 for the graphical interface.

## Command-line arguments
SiriDB Admin can be used using command line arguments only. This can be useful in case you want to create and extend a SiriDB database using a script. 

### Service accounts
Service accounts are used for managing databases. A service account is a user on a SiriDB server and never has access to a SiriDB database. We call users with access to a database 'database users'. We keep this accounts seperate because database accounts exist in a database which possible extends over multiple SiriDB servers.

#### Create a new service account
A new service account can be created using the command below.

  siridb-admin -u sa new-account bob passwd4bob

When entering the command you will be asked for the `sa` password. It is also possible to provide the password by using argument flag `-p <password>`.

