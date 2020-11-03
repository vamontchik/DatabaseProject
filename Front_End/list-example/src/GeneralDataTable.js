// eslint-disable-next-line
import React, {useEffect, useState} from 'react';
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
import Alert from '@material-ui/lab/Alert';
import axios from 'axios';
import Axios from 'axios';

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

const currUrl = "https://dbsampleserver.herokuapp.com";;

export default function GeneralDataTable(props) {

  const [data, setData] = useState([]); //table data

  //for error handling
  const [iserror, setIserror] = useState(false)
  const [errorMessages, setErrorMessages] = useState([])

  useEffect(() => {
    getUpdate()
  }, [])

  const getUpdate = () => {
    let final_data = []
    Axios({
      method: "GET", 
      url: currUrl,
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => {
      res.data.forEach(element => {
        final_data.push(element)
      })
      console.log([...final_data])
      setData([...final_data])
    })
  }

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
      axios.post(currUrl + '/update', [newData, oldData])
        .then(res => {
          setErrorMessages([])
          setIserror(false)
          getUpdate()
        }).then(resolve())
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
      //toying around with local server fetching
      axios.post(currUrl + "/post", newData)
        .then(res => {
          setErrorMessages([])
          setIserror(false)
          getUpdate()
        }).catch(error => {
            setErrorMessages(["Cannot add data. Server error!"])
            setIserror(true)
            resolve()
          }).then(resolve())
    }else{
      setErrorMessages(errorList)
      setIserror(true)
      resolve()
    }
  }

  const handleRowDelete = (oldData, resolve) => {
    axios.post(currUrl + "/delete", oldData)
      .then(res => {
        setErrorMessages([])
        setIserror(false)
        getUpdate()
      }).then(resolve())
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
              title= {props.title}
              columns={props.col.map((c) => ({...c, tableData: undefined}))}
              data={data}
              icons={tableIcons}
              localization={{
                body: {
                    emptyDataSourceMessage: ''
                }
              }}
              editable={props.editable ? {
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
              } : {}}
              options={{
                headerStyle: {
                  backgroundColor: props.headerBackgroundColor
                },
                searchFieldStyle: {
                  border: "1px solid black",
                  padding: "0px 0px 0px 10px"
                },
                pageSize: 10,
                pageSizeOptions: [10, 15, 20, 25],
                addRowPosition: "first",
                grouping: true,
                selection: props.selection
              }}

            />
          </Grid>
          <Grid item xs={1}></Grid>
        </Grid>
    </div>
  );
}
