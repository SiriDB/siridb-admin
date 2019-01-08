import React from 'react';
import { render } from 'react-dom';
import { Modal } from 'react-bootstrap';

class DropModal extends React.Component {

    static propTypes = {
        show: React.PropTypes.bool.isRequired,
        dbname: React.PropTypes.string.isRequired,
        onNo: React.PropTypes.func.isRequired,
        onYes: React.PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            ignoreOffline: false,
            dbname: ''
        };
    }

    handleIgnoreOfflineChange = () => {
        this.setState(prevState => ({ignoreOffline: !prevState.ignoreOffline}));
    }

    onDbnameChange = ({target}) => {
        this.setState({
            dbname: target.value
        });
    }

    render() {

        return  (
            <Modal show={this.props.show} onHide={this.props.onNo} bsSize="small">
                <Modal.Body>
                    <div className="alert alert-warning">
                        <strong>{'WARNING:'}</strong>
                        <p>{'The database will be removed from all servers in the cluster and cannot be undone!!'}</p>
                    </div>
                    <div className="form-group">
                        <label htmlFor="inp-dbname">Type database name to confirm</label>
                        <div className="input-group input-group-sm">
                            <input
                                autoFocus
                                id="inp-dbname"
                                type="text"
                                className="form-control"
                                placeholder="database name"
                                value={this.state.dbname}
                                onChange={this.onDbnameChange} />
                        </div>
                    </div>
                    <p>{'By default this action requires all SiriDB servers to be online but with the following option `offline` servers can be ignored'}</p>
                    <div className="form-group">
                        <div className="input-group input-group-sm">
                            <input type="checkbox" name="ignoreOffline" id="ignoreOffline" checked={this.state.ignoreOffline} onChange={this.handleIgnoreOfflineChange} />
                            <label style={{marginLeft: 10}} htmlFor="ignoreOffline">{'Ignore offline servers'}</label>
                        </div>
                    </div>
                    <p>{ `Do you really want to drop database '${this.props.dbname}'?` }</p>
                </Modal.Body>
                <Modal.Footer>
                    <button
                        onClick={() => this.props.onYes(this.state.ignoreOffline)}
                        type="button"
                        disabled={this.props.dbname!==this.state.dbname}
                        className="btn btn-default"
                    >
                        {'Yes'}
                    </button>
                    <button onClick={this.props.onNo} type="button" className="btn btn-cancel">No</button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default DropModal;
