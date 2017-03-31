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
        if (!dbname) {
            AlertActions.setAlert('Database name is required', 'warning');
        } else if (!bufferSize) {
            AlertActions.setAlert('Buffer size should be a multilple of 512. (default: 1024)', 'warning');
        } else if (!durationNum) {
            AlertActions.setAlert('Numeric duration is required. (default: 1w)', 'warning');
        } else if (!durationLog) {
            AlertActions.setAlert('Log duration is required. (default: 1d)', 'warning');
        } else {
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
    }
}

export default DatabasesStore;