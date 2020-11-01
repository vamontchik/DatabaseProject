import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
//import List from './lister';
//import Schedule from './schedule';
//import Tabler from './tabularSchedule'
//import Wrapper from './optionsMenu'
//import Manual from './manualTabularSchedule'
import Test from './test';
import Admin from './AdminComponent/Admin';
import CourseDetail from './CourseDetail';
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
          <Test />
        </Route>
        <Route path="/admin">
          <Admin />
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
