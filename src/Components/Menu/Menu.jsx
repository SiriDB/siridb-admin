import React from 'react';
import { render } from 'react-dom';
import { Link } from 'react-router';
import AuthActions from '../../Actions/AuthActions.jsx';

class Menu extends React.Component {

    render() {
        return (
            <div className="row">
                <h1>Menu</h1>
                <ul>
                    <li><Link to="databases"><i className="fa fa-fw fa-database"></i>databases</Link></li>
                    <li><Link to="accounts"><i className="fa fa-fw fa-users"></i>service accounts</Link></li>
                    <li><Link to="change-password"><i className="fa fa-fw fa-key"></i>change password</Link></li>
                    <li><Link to="version"><i className="fa fa-fw fa-info-circle"></i>version info</Link></li>
                    <li><a onClick={AuthActions.logoff}><i className="fa fa-fw fa-times"></i>logoff</a></li>
                </ul>
            </div>
        )
    }
}

export default Menu;