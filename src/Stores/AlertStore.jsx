import React from 'react';
import BaseStore from './BaseStore.jsx';
import AlertActions from '../Actions/AlertActions.jsx';

class AlertStore extends BaseStore {

    constructor() {
        super(AlertActions);
        this.state = {
            alert: null,
        };
    }

    onSetAlert(msg, severity) {
        this.setState({
            alert: {
                msg: msg,
                severity: severity || 'warning'
            }
        });
    }

    onClearAlert() {
        this.setState({alert: null});
    }

}

export default AlertStore;