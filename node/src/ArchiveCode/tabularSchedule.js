import React, {useEffect, useState} from 'react'
import {FormControlLabel, Switch} from '@material-ui/core'
import {DataGrid} from '@material-ui/data-grid'
import JSONFile from '../courseListExample.json'

import './tabular.css'

const cols = [
    {field: 'id', hide: false},
    {field: 'Subject', headerName: 'Department', width: 130},
    {field: 'Number', headerName: 'Course Number', width: 150},
    {field: 'Credits', headerName: 'Credits', width: 90},
    {field: 'avgGPA', headerName: 'Avg GPA', width: 100},
    {field: 'Instructor', headerName: 'Instructor', width: 100}
]

const rower = JSONFile.courses.map((item, index) => {
    return ({
        id:index, Subject: item.Subject, Number: item.Number, Credits: item.Credits, avgGPA: item.avgGPA, Instructor: item.Instructor
    })
})
  

export default function DataTable(props) {
    const apiRef = React.useRef(null)
    const [selected, setSelected] = useState([])
    const [selectedIds, setSelectedIds] = useState([])
    const [filtered, setFiltered] = useState([])
    const [showSelected, setShow] = useState(false);

    const selectionChange = (selection) => {
        if (selection.rows.length !== 0) {
            console.log(selection)
            setSelected(selection.rows)
            const selectedid = []
            for (var i = 0; i < selection.rows.length; i++) {
                selectedid.push(selection.rows[i].id)
            }
            console.log(selectedid)
            setSelectedIds(selectedid)
        }
    }

    const switchControl = () => {
        setShow(showSelected ? false : true)
    }

    useEffect(() => {

        const listOfIndexes = JSONFile.courses.map((item, index) => {
            if (item.Subject.startsWith(props.filterModel.courseName) && item.Number >= props.filterModel.from && item.Number <= props.filterModel.to && item.avgGPA >= props.filterModel.avgGPAgt) {
                return (index)
            }
        })
        
        const newRows = []
        for (var i = 0; i < listOfIndexes.length; i++) {
            for (var j = 0; j < rower.length; j++) {
                if (rower[j].id === listOfIndexes[i]) {
                    newRows.push(rower[j])
                }
            }
        }
        setFiltered(newRows)
    }, [props.filterModel])

    useEffect(() => {
        const rowModels = apiRef.current?.getRowModels();
        const before = []
        apiRef.current.setRowModels(
            rowModels.map((r) => {
                for (var i = 0; i < selectedIds.length; i++) {
                    if (r.data.id === selectedIds[i]) {
                        r.selected = true;
                    }
                }
                return r;
            })
        );
    }, [filtered])



    return (
        <>
            <div id="bigCont">
                <div id="diver" style={{height: showSelected ? '0' : '90vh', width: '100%'}}>
                    <DataGrid rows={filtered} columns={cols} autoPageSize sortingOrder={['desc', 'asc']} sortModel={props.sortModel} onSelectionChange={selectionChange} checkboxSelection components={{
          noRowsOverlay: (params) => {
            if (!apiRef.current) {
              apiRef.current = params.api.current;
            }
            return <div>No rows</div>;
          }
        }}/>
                </div>
                <div style={{height: showSelected ? '90vh' : '0', width: '100%'}}>
                    <DataGrid rows={selected} columns={cols} autoPageSize sortModel={props.sortModel} sortingOrder={['desc', 'asc']}/>
                </div> 
                <FormControlLabel
                value="viewer"
                control={<Switch onChange={switchControl} />}
                label="View Selected Classes"
                labelPlacement="end"
                />
            </div>
        </>
    )
}