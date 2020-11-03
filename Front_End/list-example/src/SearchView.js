import React, {useState, useEffect} from 'react';
import {FormControl, Button, Row, Col, Container} from 'react-bootstrap'
import GeneralDataTable from './GeneralDataTable'
import './SearchView.css'


export default function SearchView(props) {
    const [searchInput, setSearchInput] = useState("")
    const [searchInput2, setSearchInput2] = useState("")

    const setSearch1 = (e) => {
        setSearchInput(e.target.value)
    }
    const setSearch2 = (e) => {
        setSearchInput2(e.target.value)
    }

    return (
        <Container className={"Cont"}>
            <Row className={"row"}>
                <Col className={"col"} xs={5}><FormControl value={searchInput} placeholder="Subject" onChange={setSearch1}></FormControl></Col>
                <Col className={"col"} xs={5}><FormControl value={searchInput2} placeholder="Number" onChange={setSearch2}></FormControl></Col>
                <Col className={"col"} xs={2}><Button onClick={() => props.submit(searchInput, searchInput2)}>Submit</Button></Col>
            </Row>
        </Container>
    )

}