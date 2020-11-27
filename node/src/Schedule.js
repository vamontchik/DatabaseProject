import React from 'react';
import ScheduleItem from './ScheduleItem';
import {Container} from 'react-bootstrap'

function Schedule(props) {

  if (props.data == undefined) {
    return (
      <Container className="text-center">
        <h3>No schedule data found.</h3>
      </Container>
    );
  }

  const scheduleItems = props.data.map((item) => {
      return <ScheduleItem data={item}></ScheduleItem>
  });

  return (
    <Container>
      {scheduleItems}
    </Container>
  );

}

export default Schedule;
