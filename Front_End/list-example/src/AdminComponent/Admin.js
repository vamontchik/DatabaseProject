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
      <GeneralDataTable title={"Course Section Table"} editable={props.editable} selection={props.selection} iserror={props.iserror} errorMessages={props.errorMessages} handleRowAdd={props.handleRowAdd} handleRowDelete={props.handleRowDelete} handleRowUpdate={props.handleRowUpdate} data={props.data} col={colJSON.CourseSectionTable} />
      <GeneralDataTable title={"GenEd Table"} editable={props.editable} selection={props.selection} iserror={props.iserror} errorMessages={props.errorMessages} handleRowAdd={props.handleRowAdd} handleRowDelete={props.handleRowDelete} handleRowUpdate={props.handleRowUpdate} data={props.data} col={colJSON.GenEdTable} />
      <GeneralDataTable title={"Grade Distribution Table"} editable={props.editable} selection={props.selection} iserror={props.iserror} errorMessages={props.errorMessages} handleRowAdd={props.handleRowAdd} handleRowDelete={props.handleRowDelete} handleRowUpdate={props.handleRowUpdate} data={props.data} col={colJSON.GradeDistributionTable} />
      <GeneralDataTable title={"Instructor Info Table"} editable={props.editable} selection={props.selection} iserror={props.iserror} errorMessages={props.errorMessages} handleRowAdd={props.handleRowAdd} handleRowDelete={props.handleRowDelete} handleRowUpdate={props.handleRowUpdate} data={props.data} col={colJSON.InstructorTable} />
    </div>
  );
}

export default Admin;
