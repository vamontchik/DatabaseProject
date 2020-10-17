import React, {useState} from 'react';
import {FormControl} from 'react-bootstrap'
import JSONFile from './courseListExample.json';
import './lister.css'

export default function LazyList() {
    const [courseList, setCourseList] = useState(JSONFile.courses);
    const [courseName, setName] = useState("");
    const [fromNum, setFromNum] = useState(0);
    const [toNum, setToNum] = useState(1000);
    const [avgGPAGreaterThan, setGreaterThan] = useState(0)

    const inputers = [courseName, fromNum, toNum, avgGPAGreaterThan]

    const inputSearch = (e) => {
        setName(e.target.value)
    }
    const inputFrom = (e) => {
        if (e.target.value !== "") setFromNum(parseInt(e.target.value));
        else setFromNum(0)
    }
    const inputTo = (e) => {
        if (e.target.value !== "") setToNum(parseInt(e.target.value));
        else setToNum(0)
    }
    const inputAVG = (e) => {
        if (e.target.value !== "") setGreaterThan(parseInt(e.target.value));
        else setGreaterThan(0)
    }
    const listTitle = courseList.map((item) => {
        if (item.Subject.startsWith(courseName) && item.Number < toNum && item.Number > fromNum && item.avgGPA > avgGPAGreaterThan) {
            return (
                <ul className="subList">
                    <li>{item.Subject + " " + item.Number}</li>
                    <li>{"Credits: " + item.Credits}</li>
                    <li>{"AVG GPA: " + item.avgGPA}</li>
                </ul>
                )
        } else {
            return (<ul></ul>)
        }
    });

    return (
        <>
        <div id="bigCont">
            <ul className="bigList">
                {listTitle}
            </ul>
        </div>
        <div id="controls">
        <form>
            <div>
                <h3>Course subject</h3>
                <FormControl value={courseName} onChange={inputSearch} />
            </div>
            <div>
                <h3>From Course #</h3>
                <FormControl value={fromNum} onChange={inputFrom} />
            </div>
            <div>
                <h3>To Course #</h3>
                <FormControl value={toNum} onChange={inputTo} />
            </div>
            <div>
                <h3>AVG GPA Greater Than</h3>
                <FormControl value={avgGPAGreaterThan} onChange={inputAVG} />
            </div>
        </form>
        </div>
        </>
    )
}