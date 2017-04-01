import React from 'react';
import BaseStore from './BaseStore.jsx';
import DatabasesActions from '../Actions/DatabasesActions.jsx';
import AlertActions from '../Actions/AlertActions.jsx';

class DatabasesStore extends BaseStore {

    constructor() {
        super();
        this.listenables = DatabasesActions;
        this.state = {
            databases: [],
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
        this.post('/databases/new-database', {
            dbname: dbname,
            timePrecision: timePrecision,
            bufferSize: parseInt(bufferSize),
            durationNum: durationNum,
            durationLog: durationLog
        })
        .done((data) => {
            this.setState({
                databases: [...this.state.databases, dbname]
            });
            AlertActions.setAlert(data, 'success');
            successCb();
        })
        .fail((err, data) => {
            AlertActions.setAlert(data, 'warning');
        });
    }

    onNewPool(dbname, server, username, password, successCb) {
        this.post('/databases/new-pool', {
            dbname: dbname,
            server: server,
            username: username,
            password: password
        })
        .done((data) => {
            this.setState({
                databases: [...this.state.databases, dbname]
            });
            AlertActions.setAlert(data, 'success');
            successCb();
        })
        .fail((err, data) => {
            AlertActions.setAlert(data, 'warning');
        });
    }
}

export default DatabasesStore;