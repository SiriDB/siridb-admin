import React from 'react';
import Reflux from 'reflux-edge';
import { render } from 'react-dom';
import { Link } from 'react-router';
import AlertActions from '../../../Actions/AlertActions.jsx';
import DatabasesActions from '../../../Actions/DatabasesActions.jsx';
import DatabasesStore from '../../../Stores/DatabasesStore.jsx';

class NewDatabase extends Reflux.Component {

    constructor(props) {
        super(props);
        this.store = DatabasesStore; // required so the store will be initialized
        this.state = {
            dbname: '',
            timePrecision: 'ms',
            bufferSize: 1024,
            durationNum: '1w',
            durationLog: '1d'
        };
    }

    onNewDatabase() {
        DatabasesActions.newDatabase(
            this.state.dbname,
            this.state.timePrecision,
            this.state.bufferSize,
            this.state.durationNum,
            this.state.durationLog,
            () => this.props.router.push('databases')
        );
    }

    onDbnameChange(event) {
        AlertActions.clearAlert();
        this.setState({
            dbname: event.target.value
        });
    }

    onTimePrecisionChange(event) {
        AlertActions.clearAlert();
        this.setState({
            timePrecision: event.target.value
        });
    }

    onKeyPress(event) {
        if (event.key == 'Enter') {
            this.onNewDatabase();
        }
    }

    render() {
        return (
            <div className="row">
                <div className="form">
                    <div className="form-group">
                        <label htmlFor="inp-dbname">Database name</label>
                        <div className="input-group input-group-sm">
                            <input
                                autoFocus
                                id="inp-dbname"
                                type="text"
                                className="form-control"
                                placeholder="database name"
                                value={this.state.dbname}
                                onKeyPress={this.onKeyPress.bind(this)}
                                onChange={this.onDbnameChange.bind(this)} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="inp-time-precision">Time precision</label>
                        <div className="input-group input-group-sm">
                            <select
                                id="inp-time-precision"
                                className="form-control"
                                value={this.state.timePrecision}
                                onChange={this.onTimePrecisionChange.bind(this)}>
                                <option value="s">second</option>
                                <option value="ms">millisecond</option>
                                <option value="us">microsecond</option>
                                <option value="ns">nanosecond</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="inp-buffer-size">Buffer size</label>
                        <div className="input-group input-group-sm">
                            <input
                                autoFocus
                                id="inp-buffer-size"
                                type="text"
                                className="form-control"
                                placeholder="buffer size (multiple of 512)"
                                value={this.state.dbname}
                                onKeyPress={this.onKeyPress.bind(this)}
                                onChange={this.onBufferSizeChange.bind(this)} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="inp-duration-num">Sharding duration (numeric values)</label>
                        <div className="input-group input-group-sm">
                            <input
                                autoFocus
                                id="inp-dbname"
                                type="text"
                                className="form-control"
                                placeholder="sharding duration e.g. 12h, 2d, 1w etc."
                                value={this.state.durationNum}
                                onKeyPress={this.onKeyPress.bind(this)}
                                onChange={this.onDbnameChange.bind(this)} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="inp-duration-num">Sharding duration (numeric values)</label>
                        <div className="input-group input-group-sm">
                            <input
                                autoFocus
                                id="inp-dbname"
                                type="text"
                                className="form-control"
                                placeholder="sharding duration e.g. 12h, 2d, 1w etc."
                                value={this.state.durationNum}
                                onKeyPress={this.onKeyPress.bind(this)}
                                onChange={this.onDbnameChange.bind(this)} />
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="input-group input-group-sm">
                            <Link className="btn btn-cancel" to="accounts">cancel</Link>
                            &nbsp;
                            <button
                                className="btn btn-default"
                                type="button"
                                onClick={this.onNewDatabase.bind(this)}>save new database</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default NewDatabase;