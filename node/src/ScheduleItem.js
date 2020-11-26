import React from 'react';
import './ScheduleItem.css';
import {Accordion, Card, Container} from 'react-bootstrap'

function ScheduleItem(props) {

    let data = props.data;

    if (data == undefined) {
      data = {
        subject: "CS",
        number: 225,
        instructorName: "Smith, Bob",
        rating: 5,
        creditHours: "3 hours.",
        title: "Abc",
        term: "Fall",
        year: "2019",
        numStudents: 150,
        description: "dsfhskjrddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
        ACP: "ACP",
        NAT: "",
        CS: "WCC",
        QR: "QR1",
        HUM: "",
        SBS: "",
        avgGPA: 3.42222,
        aPlus: 31,
        a: 12,
        aMinus: 14,
        bPlus: 12,
        b: 6,
        bMinus: 3,
        cPlus: 9,
        c: 2,
        cMinus: 8,
        dPlus: 2,
        d: 1,
        dMinus: 0,
        f: 0,
        w: 1
      };
    }

    return (
      <Container>

        <Accordion defaultActiveKey="0">
          <Card className="schedule-item">

            <Accordion.Toggle className="schedule-item-header" as={Card.Header} eventKey="1">
              {data.subject + " " + String(data.number) + " (" + data.instructorName + ")"}
            </Accordion.Toggle>

            <Accordion.Collapse eventKey="1">
              <Card.Body>{data.description}</Card.Body>
            </Accordion.Collapse>

          </Card>
        </Accordion>

      </Container>

    );
}

export default ScheduleItem;
