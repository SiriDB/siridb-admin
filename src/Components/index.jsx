import React from 'react';
import Reflux from 'reflux-edge';

Reflux.defineReact(React, Reflux);

import { render } from 'react-dom';
import App from './App/App.jsx';
import { hashHistory, Router, Route, IndexRoute } from 'react-router';
import Menu from './Menu/Menu.jsx';
import Databases from './Databases/Databases.jsx';
import DatabasesView from './Databases/View.jsx';
import DatabasesNew from './Databases/New.jsx';
import DatabasesJoin from './Databases/Join/Join.jsx';
import ChangePassword from './ChangePassword/ChangePassword.jsx';

render((
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Menu} />
            <Route path="databases" component={Databases} />
            <Route path="databases/view" component={DatabasesView} />
            <Route path="databases/join" component={DatabasesJoin} />
            <Route path="change-password" component={ChangePassword} />
        </Route>
    </Router>
), document.getElementById("app"));

