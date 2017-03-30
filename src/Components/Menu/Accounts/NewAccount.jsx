import React from 'react';
import { render } from 'react-dom';
import { Link } from 'react-router';

class NewAccount extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: ''
        };
    }

    onNewAccount() {

    }

    onUsernameChange(event) {
        AlertActions.clearAlert();
        this.setState({
            validate: event.target.value
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
                                onChange={this.onCurrentChange.bind(this)} />
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
                            <Link className="btn btn-cancel" to="/">cancel</Link>
                            &nbsp;
                            <button
                                className="btn btn-default"
                                type="button"
                                onClick={this.onChangePassword.bind(this)}>save new account</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default NewAccount;