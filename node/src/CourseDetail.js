import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import CanvasJSReact from './canvasjs.react';

//var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

// Modal boilerplate code from documentation
// https://react-bootstrap.github.io/components/modal/#modals-overview

// Bar chart boilerplate: https://canvasjs.com/react-charts/bar-chart/

function CourseDetail(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const options = {
      animationEnabled: true,
      theme: "light2",
      title: {
        text: "Grade Distribution",
        fontSize: 20,
      },
      axisX: {
        title: "Grade",
        reversed: true,
        interval: 1,
        labelTextAlign: "right",
      },
      axisY: {
        title: "Frequency",
        includeZero: true
      },
      data: [{
        type: "bar",
        dataPoints: [
          { y: 10, label: "A plus" },
          { y: 13, label: "A" },
          { y: 4, label: "A minus" },
          { y: 41, label: "B plus" },
          { y: 23, label: "B" },
          { y: 14, label: "B minus" },
          { y: 4, label: "C plus" },
          { y: 11, label: "C" },
          { y: 4, label: "C minus" },
          { y: 1, label: "D plus" },
          { y: 2, label: "D" },
          { y: 3, label: "D minus" },
          { y: 1, label: "F" },
          { y: 0, label: "W" },
        ]
      }]
    };

    return (
      <>
        <Button variant="primary" onClick={handleShow}>
          See course detail example
        </Button>

        <Modal size="lg" show={show} onHide={handleClose}>

          <Modal.Header closeButton>
            <Modal.Title>Course Detail: </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <p>Title: </p>
            <p>Credit Hours: </p>
            <p>Instructor Name: </p>
            <p>Instructor Rating: </p>
            <p>Term: </p>
            <p>Year: </p>
            <p>Number of Students: </p>
            <p>Average GPA: </p>
            <p>Description: </p>
            <p>Gen Ed Fulfillments: </p>
            <div>
            <CanvasJSChart options = {options}
              /* onRef = {ref => this.chart = ref} */
              />
            </div>

          </Modal.Body>

          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>

        </Modal>
      </>
    );
}

export default CourseDetail;
