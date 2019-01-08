import React from 'react';
import BaseStore from './BaseStore.jsx';
import AuthActions from '../Actions/AuthActions.jsx';
import AlertActions from '../Actions/AlertActions.jsx';
import { browserHistory } from 'react-router';


class AuthStore extends BaseStore {

    constructor() {
        super(AuthActions);
        this.state = {
            user: null,
            loading: false
        };
        AuthActions.fetch();
    }

    onFetch() {
        this.fetch('/auth/fetch')
        .done((data) => {
            this.setState(data);
        })
        .fail((err, data) => {
            AlertActions.setAlert(data, 'danger');
        });
    }

    onLogoff() {
        this.fetch('/auth/logoff')
        .done((data) => {
            this.setState({
                user: null,
            });
            AlertActions.clearAlert();
        })
        .fail((err, data) => {
            AlertActions.setAlert(data, 'danger');
        });
    }

    onLogin(username, password, server) {
        if (!username) {
            AlertActions.setAlert('Account name is required');
        } else if (!password) {
            AlertActions.setAlert('Password is required');
        } else if (!server) {
            AlertActions.setAlert('Server is required');
        } else {
            this.post('/auth/login', {
                username: username,
                password: password,
                server: server
            })
            .done((data) => {
                this.setState(data);
            })
            .fail((error, data) => {
                AlertActions.setAlert(data, 'warning');
            });
        }
    }

    onChangePassword(current, password, validate, successCb) {
        if (password != validate) {
            AlertActions.setAlert('password is not equal to validate password');
        } else if (!current) {
            AlertActions.setAlert('Current password is required');
        } else if (!password) {
            AlertActions.setAlert('New Password is required');
        }else {
            this.post('/auth/change-password', {
                current: current,
                password: password
            })
            .done((data) => {
                AlertActions.setAlert(data, 'success');
                successCb();
            })
            .fail((error, data) => {
                AlertActions.setAlert(data || 'Unknown error occurred');
            });
        }

    }
}

export default AuthStore;