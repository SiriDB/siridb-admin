import React from 'react';
import BaseStore from './BaseStore.jsx';
import VersionActions from '../Actions/VersionActions.jsx';

class VersionStore extends BaseStore {

    constructor() {
        super();
        this.listenables = VersionActions;
        this.state = {
            version: "",
            build: "",
            date: ""
        };
        VersionActions.fetch();
    }

    onFetch() {
        this.fetch('/version/fetch')
        .done((data) => {
            this.setState({
                version: data[0],
                build: data[1],
                date: data[2]
            });
        })
    }
}

export default VersionStore;