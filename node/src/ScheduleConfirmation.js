import React from 'react';
import { ListGroup, ListGroupItem, Modal } from 'react-bootstrap';

export default function ScheduleConfirmation(props) {

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
            </Modal.Body>
        </Modal>
    )
}