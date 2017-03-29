import React from 'react';
import Reflux from 'reflux-edge';

Reflux.defineReact(React, Reflux);

import JsonRequest from '../Utils/JsonRequest.jsx';


class BaseStore extends Reflux.Store {

    constructor() {
        super();
        this.serverUrl = '';
    }

    fetch(url) {
        return new JsonRequest('GET', `${this.serverUrl}${url}`);
    }

    post(url, data) {
        return new JsonRequest('POST', `${this.serverUrl}${url}`, data);
    }

    postraw(url, raw) {
        return new JsonRequest('POST', `${this.serverUrl}${url}`, raw, true);
    }
}

export default BaseStore;