import React from 'react';
import BaseStore from './BaseStore.jsx';
import AuthActions from '../Actions/AuthActions.jsx';
import AlertActions from '../Actions/AlertActions.jsx';


class AuthStore extends BaseStore {

    constructor() {
        super();
        this.listenables = AuthActions;
        this.state = {
            user: null
        };
        AuthActions.fetch();
    }

    onFetch() {
        this.fetch('/auth/fetch')
        .done((data) => {
            this.setState(data);
        })
    }

    onLogoff() {
        this.fetch('/auth/logoff')
        .done((data) => {
            this.setState({
                user: null
            });
        })
    }

    onLogin(username, password, server) {
        if (!username) {
            AlertActions.setAlert('Username is required');
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
                AlertActions.setAlert(data || 'Unknown error occurred');
            });
        }
    }

    onChangePassword(current, password, validate) {
        if (password != validate) {
            AlertActions.setAlert('password is not equal to validate password');
        } else {
            this.post('/auth/change-password', {
                current: current,
                password: password
            })
            .done((data) => {
                AlertActions.setAlert(data, 'success');
            })
            .fail((error, data) => {
                AlertActions.setAlert(data || 'Unknown error occurred');
            });
        }

    }
}

export default AuthStore;