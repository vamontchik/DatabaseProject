import React from 'react';
import './Admin.css';
// import CourseSectionTable from './CourseSectionTable';
// import GenEdTable from './GenEdTable';
// import GradeDistributionTable from './GradeDistributionTable';
// import InstructorTable from './InstructorTable';
import GeneralDataTable from '../GeneralDataTable'
import colJSON from '../columns.json'

function Admin(props) {
  return (
    // <div className="Admin" style={{margin: "2% 0 2% 0"}}>
    //   <CourseSectionTable />
    //   <GenEdTable />
    //   <GradeDistributionTable />
    //   <InstructorTable />
    // </div>
    <div className="Admin" style={{margin: "2% 0 2% 0"}}>
      <GeneralDataTable title={"Course Section"} headerBackgroundColor="#ADD8E6" editable={props.editable} iserror={props.iserror} errorMessages={props.errorMessages} handleRowAdd={props.handleRowAdd} handleRowDelete={props.handleRowDelete} handleRowUpdate={props.handleRowUpdate} data={props.data} col={colJSON.CourseSectionTable} />
      <GeneralDataTable title={"Gen Ed"} headerBackgroundColor="#EFA5B0" editable={props.editable} iserror={props.iserror} errorMessages={props.errorMessages} handleRowAdd={props.handleRowAdd} handleRowDelete={props.handleRowDelete} handleRowUpdate={props.handleRowUpdate} data={props.data} col={colJSON.GenEdTable} />
      <GeneralDataTable title={"Grade Distribution"} headerBackgroundColor="#ADA8F6" editable={props.editable} iserror={props.iserror} errorMessages={props.errorMessages} handleRowAdd={props.handleRowAdd} handleRowDelete={props.handleRowDelete} handleRowUpdate={props.handleRowUpdate} data={props.data} col={colJSON.GradeDistributionTable} />
      <GeneralDataTable title={"Instructor"} headerBackgroundColor="#89ED96" editable={props.editable} iserror={props.iserror} errorMessages={props.errorMessages} handleRowAdd={props.handleRowAdd} handleRowDelete={props.handleRowDelete} handleRowUpdate={props.handleRowUpdate} data={props.data} col={colJSON.InstructorTable} />
    </div>
  );
}

export default Admin;
