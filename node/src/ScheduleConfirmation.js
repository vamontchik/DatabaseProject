import React from 'react';
import { Button, ListGroup, ListGroupItem, Modal } from 'react-bootstrap';
import './ScheduleConfirmation.css'
import axios from 'axios'
import { useHistory } from "react-router-dom";

export default function ScheduleConfirmation(props) {
    const history = useHistory();

    const api = axios.create({
        baseURL: `http://localhost:5000`
    })

    const confirmSchedule = () => {
        var retAr = []
        props.data.forEach((item) => {
            retAr.push({
                instructorName: item.instructorName,
                subject: item.subject,
                number: item.number,
            })
        })
        createSchedule(retAr)
    }

    //TODO: redirect to schedule when retrieve the oid
    const createSchedule = (scheduleArray) => {
        api.post('/create/mongodb', scheduleArray).then(res => {
            history.push('/schedule/' + res.data.oid)
        })
    }

    const mapOfProps = props.data.map((item) => {
        return <ListGroupItem>{item.title}</ListGroupItem>
    })
    return(
        <Modal size="lg" show={props.setShow} onHide={props.close}>
            <Modal.Header closeButton>
                <Modal.Title>{"Confirm This Schedule?"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <ListGroup>{mapOfProps}</ListGroup>
                <Button id="butt" onClick={confirmSchedule}>Confirm</Button>
            </Modal.Body>
        </Modal>
    )
}