import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const Modals=(props)=>{    
    return (
      <Modal
        {...props}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
        keyboard={false}
      >
      <Modal.Header>
        <h2>{props.msg}</h2>
      </Modal.Header>        
      <Modal.Body>
        <b>{props.f}</b>
      </Modal.Body>
      { props.unlock&&
          <Button variant="primary" onClick={props.onHide}>
            Close
          </Button>
      }
      </Modal>
    );  
}
export default Modals;
