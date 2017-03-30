import React from 'react';
import BaseStore from './BaseStore.jsx';
import AccountsActions from '../Actions/AccountsActions.jsx';

class AccountsStore extends BaseStore {

    constructor() {
        super();
        this.listenables = AccountsActions;
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
    }
}

export default AccountsStore;