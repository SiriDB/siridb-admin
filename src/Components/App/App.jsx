import React from 'react';
import Reflux from 'reflux-edge';
import { render } from 'react-dom';
import AuthStore from '../../Stores/AuthStore.jsx';
import Auth from '../Auth/Auth.jsx';

class App extends Reflux.Component {

    constructor(props) {
        super(props);
        this.store = AuthStore;
    }

    render() {
        return  <Auth />
    }
}

export default App;