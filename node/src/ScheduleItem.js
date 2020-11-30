import React, {useState} from 'react';
import './ScheduleItem.css';
import {Accordion, Card, Container, Button, Row, Col} from 'react-bootstrap'
import CourseDetailInnerView from './CourseDetailInnerView';
import Favorite from '@material-ui/icons/Favorite';
import axios from 'axios'

function ScheduleItem(props) {

    let data = props.data;
    data.oid = props.scheduleId;

    const [liked, setLiked] = useState(data.liked);

    // TODO: change api base url
    // eslint-disable-next-line
    const api = axios.create({
      baseURL: "http://localhost:5000/"
    })

    // TODO: implement and link like backend call
    const handleLike = () => {
      //toggle like
      console.log(liked);
      setLiked(!liked);
      console.log(liked);

      console.log(data)

      // api call
      console.log("This ran");

      api.post("/like/ScheduleItem", data)
        .then(res => {
            console.log(res);

        }).catch(error=>{
            setLiked(!liked);
            console.log("Error");
        });
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
                    {/* eslint-disable-next-line*/}
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
