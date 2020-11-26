import React from 'react';
import './ScheduleViewer.css';
import ScheduleItem from './ScheduleItem';
import {
  useParams
} from "react-router-dom";

function ScheduleViewer() {
  let { scheduleId } = useParams();

  return (
    <ScheduleItem>
    </ScheduleItem>
  );
}

export default ScheduleViewer;
