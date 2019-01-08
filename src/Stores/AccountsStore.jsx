import React from 'react';
import BaseStore from './BaseStore.jsx';
import AccountsActions from '../Actions/AccountsActions.jsx';
import AlertActions from '../Actions/AlertActions.jsx';

class AccountsStore extends BaseStore {

    constructor() {
        super(AccountsActions);
        this.state = {
            accounts: [],
        };
        AccountsActions.fetch();
    }

    onFetch() {
        this.fetch('/accounts/fetch')
        .done((data) => {
            this.setState({
                accounts: data
            });
        })
        .fail((err, data) => {
            AlertActions.setAlert(data, 'danger');
        });
    }

    onNewAccount(username, password, successCb) {
        if (!username) {
            AlertActions.setAlert('Account name is required', 'warning');
        } else if (!password) {
            AlertActions.setAlert('Password is required', 'warning');
        } else {
            this.post('/accounts/new', {
                username: username,
                password: password
            })
            .done((data) => {
                this.setState({
                    accounts: [...this.state.accounts, username]
                });
                AlertActions.setAlert(data, 'success');
                successCb();
            })
            .fail((err, data) => {
                AlertActions.setAlert(data, 'warning');
            });
        }
    }

    onDropAccount(username) {
        this.post('/accounts/drop', {
                username: username,
        })
        .done((data) => {
            this.setState({
                accounts: this.state.accounts.filter((account) => account != username)
            });
            AlertActions.setAlert(data, 'success');
        })
        .fail((err, data) => {
            AlertActions.setAlert(data, 'warning');
        });
    }
}

export default AccountsStore;