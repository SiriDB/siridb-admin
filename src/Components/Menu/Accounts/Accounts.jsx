import React from 'react';
import Reflux from 'reflux-edge';
import { render } from 'react-dom';
import { Link, IndexLink } from 'react-router';
import AccountsStore from '../../../Stores/AccountsStore.jsx';

class View extends Reflux.Component {

    constructor(props) {
        super(props);
        this.store = AccountsStore;
    }

    onDrop() {

    }

    render() {
        return (
            <div className="row">
                <ul>
                    {
                        this.state.accounts.map((dbname, n) => <li key={n}><a onClick={this.onDrop.bind(this)}><i className="fa fa-fw fa-trash"></i></a>{dbname}</li>)
                    }
                </ul>
                <hr />
                <ul>
                    <li><Link to="accounts/new"><i className="fa fa-fw fa-user"></i>new service account</Link></li>
                    <li><IndexLink to="/"><i className="fa fa-fw fa-arrow-left"></i>back</IndexLink></li>
                </ul>
            </div>
        )
    }
}

export default View;