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
        return (
            <div className="row">
                <ul>
                    <li><Link to="databases/view"><i className="fa fa-fw fa-list"></i>view databases</Link></li>
                    <li><Link to="databases/new"><i className="fa fa-fw fa-square-o"></i>new database</Link></li>
                    <li><Link to="databases/join"><i className="fa fa-fw fa-link"></i>join existing database</Link></li>
                    <li><IndexLink to="/"><i className="fa fa-fw fa-arrow-left"></i>back</IndexLink></li>
                </ul>
            </div>
        )
    }
}

export default Databases;