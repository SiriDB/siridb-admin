import React from 'react';
import Vlow from 'vlow';
import { render } from 'react-dom';
import { Link } from 'react-router';
import AlertActions from '../../../Actions/AlertActions.jsx';
import DatabasesActions from '../../../Actions/DatabasesActions.jsx';
import DatabasesStore from '../../../Stores/DatabasesStore.jsx';
import ConfirmModal from './ConfirmModal.jsx';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';


const tooltipTp = <Tooltip id="tooltip-tp" placement="top">
    Precision used for storing timestamps in the database. This value cannot be changed once the database is created.
    </Tooltip>;
const tooltipBs = <Tooltip id="tooltop-bs" placement="top">
    Each series uses a buffer space in both memory and disk before points are actually written to shards.
    The size for this buffer cannot be changed once the database is created.</Tooltip>
const tooltipDn = <Tooltip id="tooltop-dn" placement="top">
    Points are written to shards and each shard has points for a specific time range. The size or time window
    can be chosen but not changed once the database is created. For example: the value '1w' will create shards holding points for 1 week.</Tooltip>
const tooltipDl = <Tooltip id="tooltop-dl" placement="top">
    Like numeric duration but then for log values.
    At the moment log values are not supported by SiriDB but this will be implemented in a future release.</Tooltip>


class NewDatabase extends Vlow.Component {

    constructor(props) {
        super(props);
        this.state = {
            dbname: '',
            timePrecision: 'ms',
            bufferSize: 1024,
            durationNum: '1w',
            durationLog: '1d',
            showConfirm: false
        };
        this.mapStore(DatabasesStore); // required so the store will be initialized
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

    onSave() {
        if (!this.state.dbname) {
            AlertActions.setAlert('Database name is required', 'warning');
        } else if (!this.state.bufferSize) {
            AlertActions.setAlert('Buffer size should be a multilple of 512. (default: 1024)', 'warning');
        } else if (!this.state.durationNum) {
            AlertActions.setAlert('Numeric duration is required. (default: 1w)', 'warning');
        } else if (!this.state.durationLog) {
            AlertActions.setAlert('Log duration is required. (default: 1d)', 'warning');
        } else {
            this.setState({showConfirm: true});
        }
    }

    onYes() {
        this.onNewDatabase();
        this.setState({showConfirm: false});
    }

    onNo() {
        this.setState({showConfirm: false});
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

    onBufferSizeChange(event) {
        AlertActions.clearAlert();
        this.setState({
            bufferSize: event.target.value
        });
    }

    onDurationNumChange(event) {
        AlertActions.clearAlert();
        this.setState({
            durationNum: event.target.value
        });
    }

    onDurationLogChange(event) {
        AlertActions.clearAlert();
        this.setState({
            durationLog: event.target.value
        });
    }

    onKeyPress(event) {
        if (event.key == 'Enter') {
            this.onSave();
        }
    }

    render() {
        return this.state.loading ? <img src="/img/loader.gif" alt="loading..." /> : (
            <div className="row">
                <h1>New database</h1>
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
                        <label htmlFor="inp-time-precision">
                            Time precision&nbsp;
                            <OverlayTrigger
                                placement="top"
                                overlay={tooltipTp}>
                                <i className="fa fa-question-circle"></i>
                            </OverlayTrigger>
                        </label>
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
                        <label htmlFor="inp-buffer-size">
                            Buffer size&nbsp;
                            <OverlayTrigger
                                placement="top"
                                overlay={tooltipBs}>
                                <i className="fa fa-question-circle"></i>
                            </OverlayTrigger>
                        </label>
                        <div className="input-group input-group-sm">
                            <input
                                id="inp-buffer-size"
                                type="number"
                                min="512"
                                max="1048576"
                                step="512"
                                className="form-control"
                                placeholder="buffer size (multiple of 512)"
                                value={this.state.bufferSize}
                                onKeyPress={this.onKeyPress.bind(this)}
                                onChange={this.onBufferSizeChange.bind(this)} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="inp-duration-num">
                            Sharding duration (for numeric values)&nbsp;
                            <OverlayTrigger
                                placement="top"
                                overlay={tooltipDn}>
                                <i className="fa fa-question-circle"></i>
                            </OverlayTrigger>
                        </label>
                        <div className="input-group input-group-sm">
                            <input
                                id="inp-duration-num"
                                type="text"
                                className="form-control"
                                placeholder="sharding duration e.g. 12h, 2d, 1w etc."
                                value={this.state.durationNum}
                                onKeyPress={this.onKeyPress.bind(this)}
                                onChange={this.onDurationNumChange.bind(this)} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="inp-duration-log">
                            Sharding duration (for log values)&nbsp;
                            <OverlayTrigger
                                placement="top"
                                overlay={tooltipDl}>
                                <i className="fa fa-question-circle"></i>
                            </OverlayTrigger>
                        </label>
                        <div className="input-group input-group-sm">
                            <input
                                id="inp-duration-log"
                                type="text"
                                className="form-control"
                                placeholder="sharding duration e.g. 12h, 2d, 1w etc."
                                value={this.state.durationLog}
                                onKeyPress={this.onKeyPress.bind(this)}
                                onChange={this.onDurationLogChange.bind(this)} />
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="input-group input-group-sm">
                            <button
                                className="btn btn-default"
                                type="button"
                                onClick={this.onSave.bind(this)}>Ok</button>
                            &nbsp;
                            <Link className="btn btn-cancel" to="databases">Cancel</Link>
                        </div>
                    </div>
                </div>
                <ConfirmModal
                    onYes={this.onYes.bind(this)}
                    onNo={this.onNo.bind(this)}
                    show={this.state.showConfirm} />
            </div>
        )
    }
}

export default NewDatabase;
