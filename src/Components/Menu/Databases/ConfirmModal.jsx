import React from 'react';
import { render } from 'react-dom';
import { Modal } from 'react-bootstrap';

class ConfirmModal extends React.Component {

    static propTypes = {
        show: React.PropTypes.bool.isRequired,
        onNo: React.PropTypes.func.isRequired,
        onYes: React.PropTypes.func.isRequired
    };

    render() {

        return  (
            <Modal show={this.props.show} onHide={this.props.onNo} bsSize="small">
                <Modal.Body>
                    <p>WARNING: It is not possible to undo this action!</p>
                    <p>Are you sure you want to continue?</p>
                </Modal.Body>
                <Modal.Footer>
                    <button onClick={this.props.onYes}type="button" className="btn btn-default">Yes</button>
                    <button onClick={this.props.onNo} type="button" className="btn btn-cancel">No</button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default ConfirmModal;
