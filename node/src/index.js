import React
//,{useState, useEffect}
from 'react';
import ReactDOM from 'react-dom';
import Admin from './AdminComponent/Admin';
import GeneralDataTable from './GeneralDataTable';
import colJSON from './columns.json';
import {
  //ListGroup, ListGroupItem,
  Nav, Navbar} from 'react-bootstrap'
//import {Button} from '@material-ui/core'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import Generator from './Generator';
import ScheduleEntry from './ScheduleEntry';

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
          <Nav.Link><Link className="linker" to="/generator">Generator</Link></Nav.Link>
          <Nav.Link><Link className="linker" to="/schedule">Schedule</Link></Nav.Link>
        </Nav>
      </Navbar>
      <Switch>
        <Route path={["/","/viewer"]}>
          <GeneralDataTable title={"Course Viewer"} editable={false} selection={true} col={colJSON.SmallCourseSectionTable} extension={'/CourseSection'}/>
        </Route>
        <Route path="/admin">
          <Admin editable={true} selection={false}/>
        </Route>
        <Route path="/generator">
          <Generator/>
        </Route>
        <Route path="/schedule">
          <ScheduleEntry/>
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
