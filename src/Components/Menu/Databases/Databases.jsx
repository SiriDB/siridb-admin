import React from 'react';
import Reflux from 'reflux-edge';
import { render } from 'react-dom';
import { Link, IndexLink } from 'react-router';
import DatabasesStore from '../../../Stores/DatabasesStore.jsx';

class Databases extends Reflux.Component {

    constructor(props) {
        super(props);
        this.store = DatabasesStore;
    }

    render() {
        let items = (this.state.databases.length) ?
            this.state.databases.map((dbname, n) => <li key={n}>{dbname}</li>) :
            <li><i>no database installed</i></li>;

        return (
            <div className="row">
                <h1>Databases</h1>
                <ul>{items}</ul>
                <hr />
                <ul>
                    <li><Link to="databases/new-database"><i className="fa fa-fw fa-database"></i>new database</Link></li>
                    <li><Link to="databases/new-replica"><i className="fa fa-fw fa-link"></i>new replica</Link></li>
                    <li><Link to="databases/new-pool"><i className="fa fa-fw fa-link"></i>new pool</Link></li>
                    <li><IndexLink to="/"><i className="fa fa-fw fa-arrow-left"></i>back</IndexLink></li>
                </ul>
            </div>
        )
    }
}

export default Databases;