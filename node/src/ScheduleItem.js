import React, {useState} from 'react';
import './ScheduleItem.css';
import {Accordion, Card, Container, Button, Row, Col} from 'react-bootstrap'
import CourseDetailInnerView from './CourseDetailInnerView';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import axios from 'axios'

function ScheduleItem(props) {

    let data = props.data;

    const [liked, setLiked] = useState(data.liked);

    // TODO: change api base url
    const api = axios.create({
      baseURL: `https://reqres.in/api`
    })

    // TODO: implement and link like backend call
    const handleLike = () => {
      // api call
      setLiked(!liked);
      // TODO: use API call to update the 'liked' field of a course in a schedule
      /*
        axios.post(baseURL + extension, scheduleJSON)
          .then(res => {
              // redirect to schedule URL
          }).catch(error=>{
              console.log("Error");
          });
      */

    };

    return (
      <Container>

        <Accordion defaultActiveKey="0">
          <Card className="schedule-item">

            <Card.Header className="schedule-item-header" >
              <Row className="align-items-center">
                <Col xs={10}>
                  <Accordion.Toggle as={Button} block variant="primary" style={{backgroundColor: "darkblue", borderColor: "darkblue"}} eventKey="1">
                    <h3>{data.subject + " " + String(data.number) + " (" + data.instructorName + ")"}</h3>
                  </Accordion.Toggle>
                </Col>

                <Col xs={2}>
                  <Button active variant="outline-primary" className="like-button text-center" style={{ backgroundColor:"darkblue"}} block onClick={handleLike}>
                    <Favorite color={liked == 1 ? "secondary" : ""}></Favorite>
                  </Button>
                </Col>
              </Row>


            </Card.Header>

            <Accordion.Collapse eventKey="1">
              <Card.Body>
                <CourseDetailInnerView data={data}></CourseDetailInnerView>
              </Card.Body>
            </Accordion.Collapse>

          </Card>
        </Accordion>

      </Container>

    );
}

export default ScheduleItem;
