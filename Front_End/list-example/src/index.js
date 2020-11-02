import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import Admin from './AdminComponent/Admin'
import GeneralDataTable from './GeneralDataTable'
import colJSON from './columns.json'
import CourseDetail from './CourseDetail'
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

const api = axios.create({
  baseURL: `https://reqres.in/api`
})

function Main() {
  const [data, setData] = useState([]); //table data
  const [iserror, setIserror] = useState(false)
  const [errorMessages, setErrorMessages] = useState([])

  useEffect(() => {
    api.get("/users")
        .then(res => {
            let final_data = [...res.data.data];

            // for (let i = 1000; i < 1120; i += 1) {
            //   final_data.push({
            //     "id": i,
            //     "email": "george.bluth@reqres.in",
            //     "first_name": "George" + i.toString(),
            //     "last_name": "Bluth" + i.toString(),
            //     "avatar": "https://s3.amazonaws.com/uifaces/faces/twitter/calebogden/128.jpg"
            //     }
            //   );
            // }

            setData(final_data);
            //setData(res.data.data)
         })
         .catch(error=>{
             console.log("Error")
         })
         console.log("Hi1")
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
  const logState = () => {
    console.log(data)
  }

  return (
    <Router>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/viewer" onClick={logState}>Course Viewer</Link>
        </li>
        <li>
          <Link to="/admin" onClick={logState}>Admin</Link>
        </li>
        <li>
          <Link to="/course_detail_test">Course Detail Test</Link>
        </li>
      </ul>

      <Switch>
        <Route path="/viewer">
          <GeneralDataTable title={"Course Viewer"} selection={true} editable={false} iserror={iserror} errorMessages={errorMessages} handleRowAdd={handleRowAdd} handleRowDelete={handleRowDelete} handleRowUpdate={handleRowUpdate} data={data} col={colJSON.GradeDistributionTable}/>
        </Route>
        <Route path="/admin">
          <Admin editable={true} selection={false} iserror={iserror} errorMessages={errorMessages} handleRowAdd={handleRowAdd} handleRowDelete={handleRowDelete} handleRowUpdate={handleRowUpdate} data={data}/>
        </Route>
        <Route path="/course_detail_test">
          <CourseDetail />
        </Route>
        <Route>
          <Home path="/"/>
        </Route>

      </Switch>
    </Router>
  )
}

function Home() {
  return(<h1>Hello!</h1>)
}

ReactDOM.render(<Main />,
  document.getElementById('root')
);
