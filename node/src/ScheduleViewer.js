import React, {useState} from 'react';
import './ScheduleViewer.css';
import ScheduleItem from './ScheduleItem';
import {Container} from 'react-bootstrap'
import axios from 'axios'

import {
  useParams, useHistory
} from "react-router-dom";

function ScheduleViewer() {
  let { scheduleId } = useParams();
  const url = window.location.href;

  const [data, setData] = useState(undefined);

  const api = axios.create({
    baseURL: `https://reqres.in/api`
  })

  api.get("/users/2")
      .then(res => {
          setData(res.data.data)
       })
       .catch(error=>{
           console.log("Error")
       });

  return (
    <Container className="schedule-viewer">
      <h3 className="text-center">{url}</h3>
      <ScheduleItem></ScheduleItem>

      <ScheduleItem></ScheduleItem>
    </Container>
  );
}

export default ScheduleViewer;
