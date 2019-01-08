import React from 'react';
import BaseStore from './BaseStore.jsx';
import DatabasesActions from '../Actions/DatabasesActions.jsx';
import AlertActions from '../Actions/AlertActions.jsx';

class DatabasesStore extends BaseStore {

    constructor() {
        super(DatabasesActions);
        this.state = {
            databases: [],
            loading: false
        };
        DatabasesActions.fetch();
    }

    onFetch() {
        this.fetch('/databases/fetch')
        .done((data) => {
            this.setState({
                databases: data
            });
        });
    }

    onNewDatabase(dbname, timePrecision, bufferSize, durationNum, durationLog, successCb) {
        this.setState({loading: true});
        this.post('/databases/new-database', {
            dbname: dbname,
            timePrecision: timePrecision,
            bufferSize: parseInt(bufferSize),
            durationNum: durationNum,
            durationLog: durationLog
        })
        .done((data) => {
            this.setState({
                databases: [...this.state.databases, dbname],
                loading: false
            });
            AlertActions.setAlert(data, 'success');
            successCb();
        })
        .fail((err, data) => {
            AlertActions.setAlert(data, 'warning');
            this.setState({loading: false});
        });
    }

    onNewPool(dbname, server, username, password, successCb) {
        this.setState({loading: true});
        this.post('/databases/new-pool', {
            dbname: dbname,
            server: server,
            username: username,
            password: password
        })
        .done((data) => {
            this.setState({
                databases: [...this.state.databases, dbname],
                loading: false
            });
            AlertActions.setAlert(data, 'success');
            successCb();
        })
        .fail((err, data) => {
            AlertActions.setAlert(data, 'warning');
            this.setState({loading: false});
        });
    }

    onNewReplica(dbname, server, username, password, pool, successCb) {
        this.setState({loading: true});
        this.post('/databases/new-replica', {
            dbname: dbname,
            server: server,
            username: username,
            password: password,
            pool: parseInt(pool)
        })
        .done((data) => {
            this.setState({
                databases: [...this.state.databases, dbname],
                loading: false
            });
            AlertActions.setAlert(data, 'success');
            successCb();
        })
        .fail((err, data) => {
            AlertActions.setAlert(data, 'warning');
            this.setState({loading: false});
        });
    }

    onDropDatabase(dbname, ignoreOffline)
    {
        this.setState({loading: true});
        this.post('/databases/drop', {
            dbname: dbname,
            ignoreOffline: ignoreOffline,
        })
        .done((data) => {
            this.setState({
                databases: this.state.databases.filter(database => database != dbname),
                loading: false,
            });
            AlertActions.setAlert(data, 'success');
        })
        .fail((err, data) => {
            AlertActions.setAlert(data, 'warning');
            this.setState({loading: false});
        });
    }
}

export default DatabasesStore;