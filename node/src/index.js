import React 
//,{useState, useEffect} 
from 'react';
import ReactDOM from 'react-dom';
import Admin from './AdminComponent/Admin';
import GeneralDataTable from './GeneralDataTable';
import CourseDetail from './CourseDetail';
import colJSON from './columns.json';
import {
  //ListGroup, ListGroupItem, 
  Nav, Navbar} from 'react-bootstrap'
//import {Button} from '@material-ui/core'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
//import Axios from 'axios'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

function Main() {
  return (
    <Router>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Navbar.Brand>GenEd Generator</Navbar.Brand>
        <Nav>
          <Nav.Link><Link className="linker" to="/viewer">Course Viewer</Link></Nav.Link>
          <Nav.Link><Link className="linker" to="/admin">Admin</Link></Nav.Link>
          <Nav.Link><Link className="linker" to="/course_detail_test">Course Detail Example</Link></Nav.Link>
        </Nav>
      </Navbar>
      <Switch>
        <Route path="/viewer">
          <GeneralDataTable title={"Course Viewer"} editable={false} selection={true} col={colJSON.CourseSectionTable}/>
        </Route>
        <Route path="/admin">
          <Admin editable={true} selection={false}/>
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
  return(<div></div>)
}

ReactDOM.render(<Main />,
  document.getElementById('root')
);