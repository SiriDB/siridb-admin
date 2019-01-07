import React from 'react';
import Reflux from 'reflux-edge';
import { render } from 'react-dom';
import { Link, IndexLink } from 'react-router';
import DatabasesStore from '../../../Stores/DatabasesStore.jsx';
import DatabasesActions from '../../../Actions/DatabasesActions.jsx';
import DropModal from './DropModal.jsx';

class Databases extends Reflux.Component {

    constructor(props) {
        super(props);
        this.store = DatabasesStore;
        this.state = {
            showDrop: false,
            dropName: ''
        }
        DatabasesActions.fetch();
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
        this.setState({
            showDrop: true,
            dropName: dbname
        });
    }

    render() {
        let items = (this.state.databases.length) ?
            this.state.databases.map((dbname, n) => <li key={n}><a onClick={() => this.onDrop(dbname)}><i className="fa fa-fw fa-trash"></i></a>{dbname}</li>) :
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
                <DropModal
                    onYes={this.onYes}
                    onNo={this.onNo}
                    show={this.state.showDrop}
                    dbname={this.state.dropName} />
            </div>
        )
    }
}

export default Databases;