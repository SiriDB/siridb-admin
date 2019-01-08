import React from 'react';
import Vlow from 'vlow';
import { render } from 'react-dom';
import { Link } from 'react-router';
import AlertActions from '../../../Actions/AlertActions.jsx';
import DatabasesActions from '../../../Actions/DatabasesActions.jsx';
import DatabasesStore from '../../../Stores/DatabasesStore.jsx';
import ConfirmModal from './ConfirmModal.jsx';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const tooltipDn = <Tooltip id="tooltip-dn" placement="top">
    Database name which you want to extend with a new pool.
    </Tooltip>;
const tooltipSn = <Tooltip id="tooltip-sn" placement="top">
    Address of a SiriDB server hosting the database. If the database already has more than one server, just choose one.
    </Tooltip>;
const tooltipUn = <Tooltip id="tooltip-un" placement="top">
    Username with full privileges to the database. Note: do not confuse a database user with a service account.
    </Tooltip>;

class NewPool extends Vlow.Component {

    constructor(props) {
        super(props);
        this.state = {
            dbname: '',
            server: '',
            username: '',
            password: '',
            showConfirm: false
        };
        this.mapStore(DatabasesStore); // required so the store will be initialized
        AlertActions.clearAlert();
    }

    onNewPool() {
        DatabasesActions.newPool(
            this.state.dbname,
            this.state.server,
            this.state.username,
            this.state.password,
            () => this.props.router.push('databases')
        );
    }

    onSave() {
        if (!this.state.dbname) {
            AlertActions.setAlert('Database name is required', 'warning');
        } else if (!this.state.server) {
            AlertActions.setAlert('Server address is required', 'warning');
        } else if (!this.state.username) {
            AlertActions.setAlert('Username is required', 'warning');
        } else if (!this.state.password) {
            AlertActions.setAlert('Password is required', 'warning');
        } else {
            this.setState({showConfirm: true});
        }
    }

    onYes() {
        this.onNewPool();
        this.setState({showConfirm: false});
    }

    onNo() {
        this.setState({showConfirm: false});
    }

    onDbnameChange(event) {
        AlertActions.clearAlert();
        this.setState({
            dbname: event.target.value
        });
    }

    onServerChange(event) {
        AlertActions.clearAlert();
        this.setState({
            server: event.target.value
        });
    }

    onUsernameChange(event) {
        AlertActions.clearAlert();
        this.setState({
            username: event.target.value
        });
    }

    onPasswordChange(event) {
        AlertActions.clearAlert();
        this.setState({
            password: event.target.value
        });
    }

    onKeyPress(event) {
        if (event.key == 'Enter') {
            this.onSave();
        }
    }

    render() {
        return this.state.loading ? <img src="/img/loader.gif" alt="loading..." /> : (
            <div className="row">
                <h1>New pool</h1>
                <div className="form">
                    <div className="form-group">
                        <label htmlFor="inp-dbname">Database name&nbsp;
                            <OverlayTrigger
                                placement="top"
                                overlay={tooltipDn}>
                                <i className="fa fa-question-circle"></i>
                            </OverlayTrigger>
                        </label>
                        <div className="input-group input-group-sm">
                            <input
                                autoFocus
                                id="inp-dbname"
                                type="text"
                                className="form-control"
                                placeholder="database name"
                                value={this.state.dbname}
                                onKeyPress={this.onKeyPress.bind(this)}
                                onChange={this.onDbnameChange.bind(this)} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="inp-server">Server [:port]&nbsp;
                            <OverlayTrigger
                                placement="top"
                                overlay={tooltipSn}>
                                <i className="fa fa-question-circle"></i>
                            </OverlayTrigger>
                        </label>
                        <div className="input-group input-group-sm">
                            <input
                                id="inp-server"
                                type="text"
                                className="form-control"
                                placeholder="server... e.g. siridb01.local:9000"
                                value={this.state.server}
                                onKeyPress={this.onKeyPress.bind(this)}
                                onChange={this.onServerChange.bind(this)} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="inp-username">Database user&nbsp;
                            <OverlayTrigger
                                placement="top"
                                overlay={tooltipUn}>
                                <i className="fa fa-question-circle"></i>
                            </OverlayTrigger>
                        </label>
                        <div className="input-group input-group-sm">
                            <input
                                id="inp-username"
                                type="text"
                                className="form-control"
                                placeholder="database user..."
                                value={this.state.username}
                                onKeyPress={this.onKeyPress.bind(this)}
                                onChange={this.onUsernameChange.bind(this)} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="inp-password">Password</label>
                        <div className="input-group input-group-sm">
                            <input
                                id="inp-password"
                                type="password"
                                className="form-control"
                                placeholder="password for the database user..."
                                value={this.state.password}
                                onKeyPress={this.onKeyPress.bind(this)}
                                onChange={this.onPasswordChange.bind(this)} />
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="input-group input-group-sm">
                            <button
                                className="btn btn-default"
                                type="button"
                                onClick={this.onSave.bind(this)}>Ok</button>
                            &nbsp;
                            <Link className="btn btn-cancel" to="databases">Cancel</Link>
                        </div>
                    </div>
                </div>
                <ConfirmModal
                    onYes={this.onYes.bind(this)}
                    onNo={this.onNo.bind(this)}
                    show={this.state.showConfirm} />
            </div>
        )
    }
}

export default NewPool;