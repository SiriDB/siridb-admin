import React from 'react';
import Reflux from 'reflux-edge';
import { render } from 'react-dom';
import { Link } from 'react-router';
import AlertActions from '../../../Actions/AlertActions.jsx';
import AccountsActions from '../../../Actions/AccountsActions.jsx';
import AccountsStore from '../../../Stores/AccountsStore.jsx';

class NewAccount extends Reflux.Component {

    constructor(props) {
        super(props);
        this.store = AccountsStore; // required so the store will be initialized
        this.state = {
            username: '',
            password: ''
        };
        AlertActions.clearAlert();
    }

    onNewAccount() {
        AccountsActions.newAccount(
            this.state.username,
            this.state.password,
            () => this.props.router.push('accounts')
        );
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
            this.onNewAccount();
        }
    }

    render() {
        return (
            <div className="row">
                <h1>New service account</h1>
                <div className="form">
                    <div className="form-group">
                        <div className="input-group input-group-sm">
                            <input
                                autoFocus
                                type="text"
                                className="form-control"
                                placeholder="service account name"
                                value={this.state.username}
                                onKeyPress={this.onKeyPress.bind(this)}
                                onChange={this.onUsernameChange.bind(this)} />
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="input-group input-group-sm">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="your new password..."
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
                                onClick={this.onNewAccount.bind(this)}>Ok</button>
                            &nbsp;
                            <Link className="btn btn-cancel" to="accounts">Cancel</Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default NewAccount;