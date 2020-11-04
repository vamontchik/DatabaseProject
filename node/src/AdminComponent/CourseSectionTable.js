import React, { useState, useEffect } from 'react';
import { forwardRef } from 'react';
import Grid from '@material-ui/core/Grid'

import MaterialTable from "material-table";
import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import axios from 'axios'
import Alert from '@material-ui/lab/Alert';

// boilerplate code from the documentation
// https://material-table.com/#/docs/get-started
// and https://levelup.gitconnected.com/react-material-table-crud-operations-with-restful-api-data-ca1af738d3c5

const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />)
};

const api = axios.create({
  baseURL: `cs411project_flask_1:5000`
})

function CourseSectionTable() {

  var columns = [
    {title: "id", field: "id", hidden: true},
    {title: "Subject", field: "first_name"},
    {title: "Number", field: "last_name"},
    {title: "Title", field: "last_name"},
    {title: "Credit Hours", field: "last_name"},
    {title: "Term", field: "last_name"},
    {title: "Year", field: "last_name"},
    {title: "Instructor Name", field: "last_name"},
    {title: "NumStudents", field: "last_name"},
    {title: "AvgGpa", field: "last_name", editable: "never"},
    {title: "Description", field: "email"},
  ]
  const [data, setData] = useState([]); //table data

  //for error handling
  const [iserror, setIserror] = useState(false)
  const [errorMessages, setErrorMessages] = useState([])

  useEffect(() => {
    api.get("/users")
        .then(res => {
            let final_data = [...res.data.data];

            for (let i = 1000; i < 1120; i += 1) {
              final_data.push({
                "id": i,
                "email": "george.bluth@reqres.in",
                "first_name": "George" + i.toString(),
                "last_name": "Bluth" + i.toString(),
                "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/calebogden/128.jpg"
                }
              );
            }

            setData(final_data);
            //setData(res.data.data)
         })
         .catch(error=>{
             console.log("Error")
         })
  }, [])

  const handleRowUpdate = (newData, oldData, resolve) => {
    //validation
    let errorList = []
    if(newData.first_name === ""){
      errorList.push("Please enter first name")
    }
    if(newData.last_name === ""){
      errorList.push("Please enter last name")
    }

    if(errorList.length < 1){
      api.patch("/users/"+newData.id, newData)
      .then(res => {
        const dataUpdate = [...data];
        const index = oldData.tableData.id;
        dataUpdate[index] = newData;
        setData([...dataUpdate]);
        resolve()
        setIserror(false)
        setErrorMessages([])
      })
      .catch(error => {
        setErrorMessages(["Update failed! Server error"])
        setIserror(true)
        resolve()

      })
    }else{
      setErrorMessages(errorList)
      setIserror(true)
      resolve()

    }

  }

  const handleRowAdd = (newData, resolve) => {
    //validation
    let errorList = []
    if(newData.first_name === undefined){
      errorList.push("Please enter first name")
    }
    if(newData.last_name === undefined){
      errorList.push("Please enter last name")
    }

    if(errorList.length < 1){ //no error
      api.post("/users", newData)
      .then(res => {
        let dataToAdd = [...data];
        dataToAdd.push(newData);
        setData(dataToAdd);
        resolve()
        setErrorMessages([])
        setIserror(false)
      })
      .catch(error => {
        setErrorMessages(["Cannot add data. Server error!"])
        setIserror(true)
        resolve()
      })
    }else{
      setErrorMessages(errorList)
      setIserror(true)
      resolve()
    }


  }

  const handleRowDelete = (oldData, resolve) => {

    api.delete("/users/"+oldData.id)
      .then(res => {
        const dataDelete = [...data];
        const index = oldData.tableData.id;
        dataDelete.splice(index, 1);
        setData([...dataDelete]);
        resolve()
      })
      .catch(error => {
        setErrorMessages(["Delete failed! Server error"])
        setIserror(true)
        resolve()
      })
  }


  return (
    <div className="App" style={{marginTop: "2%"}}>

      <Grid container spacing={1}>
          <Grid item xs={1}></Grid>
          <Grid item xs={10}>
          <div>
            {iserror &&
              <Alert severity="error">
                  {errorMessages.map((msg, i) => {
                      return <div key={i}>{msg}</div>
                  })}
              </Alert>
            }
          </div>
            <MaterialTable style={{ border: "2px solid black" }}
              title= "Course_Section"
              columns={columns}
              data={data}
              icons={tableIcons}
              localization={{
                body: {
                    emptyDataSourceMessage: ''
                }
              }}
              editable={{
                onRowUpdate: (newData, oldData) =>
                  new Promise((resolve) => {
                      handleRowUpdate(newData, oldData, resolve);

                  }),
                onRowAdd: (newData) =>
                  new Promise((resolve) => {
                    handleRowAdd(newData, resolve)
                  }),
                onRowDelete: (oldData) =>
                  new Promise((resolve) => {
                    handleRowDelete(oldData, resolve)
                  }),
              }}
              options={{
                headerStyle: {
                  backgroundColor: '#ADD8E6'
                },
                searchFieldStyle: {
                  border: "1px solid black",
                  padding: "0px 0px 0px 10px"
                },
                pageSize: 10,
                pageSizeOptions: [10, 15, 20, 25],
                addRowPosition: "first"
              }}

            />
          </Grid>
          <Grid item xs={1}></Grid>
        </Grid>
    </div>
  );
}

export default CourseSectionTable;
