import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import Admin from './AdminComponent/Admin';
import GeneralDataTable from './GeneralDataTable';
import CourseDetail from './CourseDetail';
import colJSON from './columns.json';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import Axios from 'axios'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

const currUrl = "https://dbsampleserver.herokuapp.com";

function Main() {
  const [data, setData] = useState([]); //table data
  const getUpdate = () => {
    console.log("Updating")
    let final_data = []

    //toying around with personal server data entry
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
  useEffect(() => {
    getUpdate()
  }, [])

  return (
    <Router>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/viewer">Course Viewer</Link>
        </li>
        <li>
          <Link to="/admin">Admin</Link>
        </li>
        <li>
          <Link to="/course_detail_test">Course Detail Test</Link>
        </li>
      </ul>

      <Switch>
        <Route path="/viewer">
          <GeneralDataTable data={data} getUpdate={getUpdate} title={"Course Viewer"} editable={false} selection={true} col={colJSON.CourseSectionTable}/>
        </Route>
        <Route path="/admin">
          <Admin data={data} getUpdate={getUpdate} editable={true} selection={false}/>
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
