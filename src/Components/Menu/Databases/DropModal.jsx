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
        };
    }

    handleIgnoreOfflineChange = () => {
        this.setState(prevState => ({ignoreOffline: !prevState.ignoreOffline}));
    }

    render() {

        return  (
            <Modal show={this.props.show} onHide={this.props.onNo} bsSize="small">
                <Modal.Body>
                    <p>{ `Do you really want to drop database '${this.props.dbname}'?` }</p>
                    <div class="form-group">
                        <div className="input-group input-group-sm">
                            <input type="checkbox" name="ignoreOffline" id="ignoreOffline" checked={this.state.ignoreOffline} onChange={this.handleIgnoreOfflineChange} />
                            <label style={{marginLeft: 10}} htmlFor="ignoreOffline">{'Ignore offline servers'}</label>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button onClick={() => this.props.onYes(this.state.ignoreOffline)} type="button" className="btn btn-default">Yes</button>
                    <button onClick={this.props.onNo} type="button" className="btn btn-cancel">No</button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default DropModal;