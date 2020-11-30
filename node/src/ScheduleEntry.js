import React, {useState} from 'react';
import {FormControl, Button, Row, Col, Container} from 'react-bootstrap'
import './ScheduleEntry.css';
import ScheduleViewer from './ScheduleViewer'
import {
  Switch,
  Route,
  useRouteMatch,
  useHistory
} from "react-router-dom";

function ScheduleEntry() {

  const match = useRouteMatch();
  const history = useHistory();

  const [scheduleId, setScheduleId] = useState("");
  const setInput = (e) => {
      setScheduleId(e.target.value)
  }

  const redirect = () => {
    if (scheduleId.contains('/')) {
      return
    }
    if (scheduleId) {
        history.push('/schedule/' + scheduleId);
    }
  }

  return (
    <Switch>
        <Route path={`${match.path}/:scheduleId`}>
          <ScheduleViewer />
        </Route>
        <Route path={match.path}>
          <Container className="schedule-entry-view">
              <Row>
                  <Col xs={12}>
                    <FormControl className="text-center id-input" value={scheduleId} placeholder="Schedule Id" onChange={setInput}></FormControl>
                  </Col>
              </Row>
              <Row>
                <Col>
                  <Button className="id-submit" block onClick={redirect}>View</Button>
                </Col>
              </Row>
          </Container>
        </Route>
      </Switch>
  );
};

export default ScheduleEntry;
