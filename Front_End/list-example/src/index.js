import React from 'react';
import ReactDOM from 'react-dom';
import Admin from './AdminComponent/Admin';
import GeneralDataTable from './GeneralDataTable';
import CourseDetail from './CourseDetail';
import colJSON from './columns.json';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

function Main() {

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
  return(<h1>Hello!</h1>)
}

ReactDOM.render(<Main />,
  document.getElementById('root')
);
