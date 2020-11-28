import React from 'react';
import CanvasJSReact from './canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

function CourseDetailInnerView(props) {
  const data = props.data;

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
          { y: data.aPlus, label: "A plus" },
          { y: data.a, label: "A" },
          { y: data.aMinus, label: "A minus" },
          { y: data.bPlus, label: "B plus" },
          { y: data.b, label: "B" },
          { y: data.bMinus, label: "B minus" },
          { y: data.cPlus, label: "C plus" },
          { y: data.c, label: "C" },
          { y: data.cMinus, label: "C minus" },
          { y: data.dPlus, label: "D plus" },
          { y: data.d, label: "D" },
          { y: data.dMinus, label: "D minus" },
          { y: data.f, label: "F" },
          { y: data.w, label: "W" },
        ]
      }]
    };

  const fulfillments = [data.ACP, data.NAT, data.CS, data.QR, data.HUM, data.SBS];

  let fulfillments_arr = [];
  fulfillments.forEach(item => {
    if (item) {
      fulfillments_arr.push(item);
    }
  });

  const fulfillments_string = fulfillments_arr.join(', ');

  return (
    <div>
      <p>{"Title: " + data.title}</p>
      <p>{"Credit Hours: " + data.creditHours}</p>
      <p>{"Instructor Name: " + data.instructorName}</p>
      <p>{"Instructor Rating: " + "10"}</p>
      <p>{"Term: " + data.term}</p>
      <p>{"Year: " + data.year} </p>
      <p>{"Number of Students: " + data.numStudents }</p>
      <p>{"Average GPA: " + data.avgGPA} </p>
      <p>{"Gen Ed Fulfillments: " + fulfillments_string.trim()} </p>
      <p>{"Description: " + data.description} </p>
      <div>
        <CanvasJSChart options = {options} />
      </div>
    </div>
  );
}

export default CourseDetailInnerView;
