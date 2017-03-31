import React from 'react';
import { render } from 'react-dom';
import { Modal } from 'react-bootstrap';

class DropModal extends React.Component {

    static propTypes = {
        show: React.PropTypes.bool.isRequired,
        name: React.PropTypes.string.isRequired,
        onNo: React.PropTypes.func.isRequired,
        onYes: React.PropTypes.func.isRequired
    };

    render() {

        return  (
            <Modal show={this.props.show} onHide={this.props.onNo} bsSize="small">
                <Modal.Body>
                    <p>{ `Do you really want to drop service account '${this.props.name}'?` }</p>
                </Modal.Body>
                <Modal.Footer>
                    <button onClick={this.props.onNo} type="button" className="btn btn-cancel">No</button>
                    <button onClick={this.props.onYes}type="button" className="btn btn-default">Yes</button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default DropModal;
