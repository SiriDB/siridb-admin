import React from 'react';
import BaseStore from './BaseStore.jsx';
import AuthActions from '../Actions/AuthActions.jsx';

class AuthStore extends BaseStore {

    constructor() {
        super();
        this.listenables = AuthActions;
        this.state = {
            user: null,
            authError: null
        };
        AuthActions.fetch();
    }

    onSetAuthError(errorMsg) {
        this.setState({authError: errorMsg});
    }

    onClearAuthError() {
        this.setState({authError: null});
    }

    onFetch() {
        this.fetch('/auth/fetch')
        .done((data) => {
            this.setState(data);
        })
    }

    onLogoff() {
        localStorage.clear();
        QueryActions.clearAll();
        this.fetch('/auth/logoff')
        .done((data) => {
            this.setState({user: null});
        })
    }

    onLogin(username, password, server) {
        if (!username) {
            AuthActions.setAuthError('Username is required');
        } else if (!password) {
            AuthActions.setAuthError('Password is required');
        } else if (!server) {
            AuthActions.setAuthError('Server is required');
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
                AuthActions.setAuthError(data.error_msg || 'Unknown error occurred');
            });
        }
    }
}

export default AuthStore;