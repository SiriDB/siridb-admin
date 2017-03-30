import React from 'react';
import Reflux from 'reflux-edge';

Reflux.defineReact(React, Reflux);

import { render } from 'react-dom';
import App from './App/App.jsx';
import { hashHistory, Router, Route, IndexRoute } from 'react-router';
import Menu from './Menu/Menu.jsx';
import Databases from './Menu/Databases/Databases.jsx';
import DatabasesView from './Menu/Databases/View.jsx';
import NewDatabase from './Menu/Databases/NewDatabase.jsx';
import DatabasesJoin from './Menu/Databases/Join/Join.jsx';
import ChangePassword from './Menu/ChangePassword.jsx';
import VersionInfo from './Menu/VersionInfo.jsx';
import Accounts from './Menu/Accounts/Accounts.jsx';
import NewAccount from './Menu/Accounts/NewAccount.jsx';

render((
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Menu} />
            <Route path="databases" component={Databases} />
            <Route path="databases/new" component={NewDatabase} />
            <Route path="databases/view" component={DatabasesView} />
            <Route path="databases/join" component={DatabasesJoin} />
            <Route path="accounts" component={Accounts} />
            <Route path="accounts/new" component={NewAccount} />
            <Route path="change-password" component={ChangePassword} />
            <Route path="version" component={VersionInfo} />
        </Route>
    </Router>
), document.getElementById("app"));

