import React from 'react';
import Vlow from 'vlow';
import { render } from 'react-dom';
import { Link, IndexLink } from 'react-router';
import DatabasesStore from '../../../Stores/DatabasesStore.jsx';
import VersionStore from '../../../Stores/VersionStore.jsx';
import DatabasesActions from '../../../Actions/DatabasesActions.jsx';
import AlertActions from '../../../Actions/AlertActions.jsx';
import DropModal from './DropModal.jsx';

class Databases extends Vlow.Component {

    constructor(props) {
        super(props);
        this.state = {
            showDrop: false,
            dropName: ''
        }
        this.mapStores([DatabasesStore, VersionStore]);
        DatabasesActions.fetch();
    }

    checkVersion = (requiredVersion) => {
        if (this.state.version === undefined) {
            return false;
        }
        let required = requiredVersion.split('.');
        let current = this.state.version.split('.');
        if (current.length < required.length) {
            return false;
        }

        for (let i = 0; i < required.length; ++i) {
            let a = parseInt(current[i]);
            let b = parseInt(required[i]);
            if (a < b) {
                return false;
            }
        }
        return true;
    }

    onYes = (ignoreOffline) => {
        this.setState({
            showDrop: false,
            dropName: ''
        });
        DatabasesActions.dropDatabase(this.state.dropName, ignoreOffline);
    }

    onNo = () => {
        this.setState({
            showDrop: false,
            dropName: ''
        });
    }

    onDrop(dbname) {
        AlertActions.clearAlert();
        this.setState({
            showDrop: true,
            dropName: dbname
        });
    }

    render() {
        let canDrop = this.checkVersion('2.0.31');
        let items = (this.state.databases.length) ?
            this.state.databases.map((dbname, n) => <li key={n}>
                {canDrop && <a onClick={() => this.onDrop(dbname)}>
                    <i className="fa fa-fw fa-trash" />
                </a>}
                {dbname}
            </li>) :
            <li><i>no database installed</i></li>;

        return this.state.loading ? <img src="/img/loader.gif" alt="loading..." /> : (
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
                <DropModal
                    onYes={this.onYes}
                    onNo={this.onNo}
                    show={this.state.showDrop}
                    dbname={this.state.dropName} />
            </div>
        );
    }
}

export default Databases;