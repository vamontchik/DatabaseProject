import React from 'react';
import { Button, ListGroup, ListGroupItem, Modal } from 'react-bootstrap';
import './ScheduleConfirmation.css'

export default function ScheduleConfirmation(props) {

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

    //todo
    const createSchedule = (scheduleArray) => {
        
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