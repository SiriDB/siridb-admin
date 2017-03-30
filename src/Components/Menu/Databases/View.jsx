import React from 'react';
import Reflux from 'reflux-edge';
import { render } from 'react-dom';
import { Link } from 'react-router';
import DatabasesStore from '../../../Stores/DatabasesStore.jsx';

class View extends Reflux.Component {

    constructor(props) {
        super(props);
        this.store = DatabasesStore;
    }

    render() {
        return (
            <div className="row">
                <ul>
                    {
                        this.state.databases.map((dbname, n) => <li key={n}>{dbname}</li>)
                    }
                </ul>
                <ul>
                    <li><Link to="databases"><i className="fa fa-fw fa-arrow-left"></i>back</Link></li>
                </ul>
            </div>
        )
    }
}

export default View;