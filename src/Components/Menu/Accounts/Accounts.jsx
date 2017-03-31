import React from 'react';
import Reflux from 'reflux-edge';
import { render } from 'react-dom';
import { Link, IndexLink } from 'react-router';
import AccountsStore from '../../../Stores/AccountsStore.jsx';
import AccountsActions from '../../../Actions/AccountsActions.jsx';
import DropModal from './DropModal.jsx';

class View extends Reflux.Component {

    constructor(props) {
        super(props);
        this.store = AccountsStore;
        this.state = {
            showDrop: false,
            dropName: ''
        }
    }

    onDrop(name) {
        this.setState({
            showDrop: true,
            dropName: name
        });
    }

    onYes() {
        this.setState({
            showDrop: false,
            dropName: ''
        });
        AccountsActions.dropAccount(this.state.dropName);
    }

    onNo() {
        this.setState({
            showDrop: false,
            dropName: ''
        });
    }

    render() {
        return (
            <div className="row">
                <h1>Service accounts</h1>
                <ul>
                    {
                        this.state.accounts.map((name, n) => <li key={n}><a onClick={() => this.onDrop(name)}><i className="fa fa-fw fa-trash"></i></a>{name}</li>)
                    }
                </ul>
                <hr />
                <ul>
                    <li><Link to="accounts/new"><i className="fa fa-fw fa-user"></i>new service account</Link></li>
                    <li><IndexLink to="/"><i className="fa fa-fw fa-arrow-left"></i>back</IndexLink></li>
                </ul>
                <DropModal
                    onYes={this.onYes.bind(this)}
                    onNo={this.onNo.bind(this)}
                    show={this.state.showDrop}
                    name={this.state.dropName} />
            </div>
        )
    }
}

export default View;