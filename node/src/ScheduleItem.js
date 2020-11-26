import React from 'react';
import './ScheduleItem.css';
import {Accordion, Card} from 'react-bootstrap'

function ScheduleItem(props) {

    return (
      <Accordion defaultActiveKey="0">
        <Card>
          <Accordion.Toggle as={Card.Header} eventKey="0">
            Click me!
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="0">
            <Card.Body>Hello! I'm the body</Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
    );
}

export default ScheduleItem;
