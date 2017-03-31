import React from 'react';
import { render } from 'react-dom';
import AuthStore from '../../Stores/AuthStore.jsx';
import AuthActions from '../../Actions/AuthActions.jsx';
import AlertActions from '../../Actions/AlertActions.jsx';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { Link } from 'react-router';

class ChangePassword extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            current: '',
            password: '',
            validate: ''
        };
    }

    onChangePassword() {
        AuthActions.changePassword(
            this.state.current,
            this.state.password,
            this.state.validate,
            () => this.props.router.push('/')
        );
    }

    onCurrentChange(event) {
        AlertActions.clearAlert();
        this.setState({
            current: event.target.value
        });
    }

    onPasswordChange(event) {
        AlertActions.clearAlert();
        this.setState({
            password: event.target.value
        });
    }

    onValidateChange(event) {
        AlertActions.clearAlert();
        this.setState({
            validate: event.target.value
        });
    }

    onKeyPress(event) {
        if (event.key == 'Enter') {
            this.onChangePassword();
        }
    }

    render() {
        return (
            <div className="row">
                <h1>Change password</h1>
                <div className="form">
                    <div className="form-group">
                        <div className="input-group input-group-sm">
                            <input
                                autoFocus
                                type="password"
                                className="form-control"
                                placeholder="your current password"
                                value={this.state.current}
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
                            <input
                                type="password"
                                className="form-control"
                                placeholder="validate your new password..."
                                value={this.state.validate}
                                onKeyPress={this.onKeyPress.bind(this)}
                                onChange={this.onValidateChange.bind(this)} />
                        </div>
                    </div>
                    <div className="form-group">
                         <div className="input-group input-group-sm">
                            <button
                                className="btn btn-default"
                                type="button"
                                onClick={this.onChangePassword.bind(this)}>Ok</button>
                            &nbsp;
                            <Link className="btn btn-cancel" to="/">Cancel</Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default ChangePassword;