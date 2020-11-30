import React, {useState, useEffect} from 'react';
import './ScheduleViewer.css';
import Schedule from './Schedule';
import {Container, Tooltip, OverlayTrigger} from 'react-bootstrap';
import axios from 'axios';
import FileCopy from '@material-ui/icons/FileCopy';

import {
  useParams
} from "react-router-dom";

function ScheduleViewer() {
  let { scheduleId } = useParams();
  const url = window.location.href;

  const [data, setData] = useState([]);

  // TODO: change api base url
  const api = axios.create({
    baseURL: "http://localhost:5000/"
  })
  
  // TODO: change api endpoint and set data to the result
  useEffect(() => {
    api.post("/search/mongodb",
    {
      oid: scheduleId,
    })
      .then(res => {
          setData(res.data)
       })
       .catch(error=>{
           console.log("Error");
           setData(undefined);
       });
       // eslint-disable-next-line
  }, [])

  const copyURL = () => {
    navigator.clipboard.writeText(url);
  };

  return (
    <Container className="schedule-viewer">
      <h3 className="text-center">{url}

        <OverlayTrigger trigger="hover" placement="right" overlay={<Tooltip>Click to copy.</Tooltip>}>
          <FileCopy style={{right: 0}} onClick={copyURL}>
          </FileCopy>
        </OverlayTrigger>
      </h3>
      <Schedule data={data}></Schedule>
    </Container>
  );
}

export default ScheduleViewer;
