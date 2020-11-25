import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import CanvasJSReact from './canvasjs.react';

//var CanvasJS = CanvasJSReact.CanvasJS;
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

// Modal boilerplate code from documentation
// https://react-bootstrap.github.io/components/modal/#modals-overview

// Bar chart boilerplate: https://canvasjs.com/react-charts/bar-chart/

function CourseDetail(props) {
  var data = props.data
  if (props.data === undefined) {
    data = {
      title: "PS",
      creditHours: "999",
      instructorName: "Reed, Jason",
      term: "Fall",
      year: "2020",
      numStudents: "400",
      avgGPA: "4.0",
      description: "The best class"
    }
  }
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
        <Modal size="lg" show={props.setShow} onHide={props.close}>

          <Modal.Header closeButton>
          <Modal.Title>{data.title}</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            <p>{"Credit Hours: " + data.creditHours}</p>
            <p>{"Instructor Name: " + data.instructorName}</p>
            <p>{"Instructor Rating: " + "10"}</p>
            <p>{"Term: " + data.term}</p>
            <p>{"Year: " + data.year} </p>
            <p>{"Number of Students: " + data.numStudents }</p>
            <p>{"Average GPA: " + data.avgGPA} </p>
            <p>{"Description: " + data.description} </p>
            <p>{"Gen Ed Fulfillments: "} </p>
            <div>
            <CanvasJSChart options = {options} />
            </div>
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
