import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import CourseDetailInner from './CourseDetailInnerView'

// Modal boilerplate code from documentation
// https://react-bootstrap.github.io/components/modal/#modals-overview

// Bar chart boilerplate: https://canvasjs.com/react-charts/bar-chart/

function CourseDetail(props) {
  var data = props.data
    return (
      <>
        <Modal size="lg" show={props.setShow} onHide={props.close}>

          <Modal.Header closeButton>
          <Modal.Title>{"Course Details"}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <CourseDetailInner data={data} />
          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={props.close}>
              Close
            </Button>
          </Modal.Footer>

        </Modal>
      </>
    );
}

export default CourseDetail;
