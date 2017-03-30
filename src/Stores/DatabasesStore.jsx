import React from 'react';
import BaseStore from './BaseStore.jsx';
import DatabasesActions from '../Actions/DatabasesActions.jsx';

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
}

export default DatabasesStore;