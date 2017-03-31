import React from 'react';
import Reflux from 'reflux-edge';
import { render } from 'react-dom';
import { Link } from 'react-router';
import AlertActions from '../../../Actions/AlertActions.jsx';
import DatabasesActions from '../../../Actions/DatabasesActions.jsx';
import DatabasesStore from '../../../Stores/DatabasesStore.jsx';
import ConfirmModal from './ConfirmModal.jsx';

class NewPool extends Reflux.Component {

    constructor(props) {
        super(props);
        this.store = DatabasesStore; // required so the store will be initialized
        this.state = {
            dbname: '',
            server: '',
            username: '',
            password: '',
            showConfirm: false
        };
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
        this.setState({showConfirm: true});
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
            this.onNewPool();
        }
    }

    render() {
        return (
            <div className="row">
                <h1>New pool</h1>
                <div className="form">
                    <div className="form-group">
                        <label htmlFor="inp-dbname">Database name</label>
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
                        <label htmlFor="inp-server">Server [:port]</label>
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
                        <label htmlFor="inp-username">Database user</label>
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