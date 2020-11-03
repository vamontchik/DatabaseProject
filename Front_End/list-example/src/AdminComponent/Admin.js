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
      <GeneralDataTable data={props.data} getUpdate={props.getUpdate} title={"Course Section"} headerBackgroundColor="#ADD8E6" editable={props.editable} col={colJSON.CourseSectionTable} />
      <GeneralDataTable data={props.data} getUpdate={props.getUpdate} title={"Gen Ed"} headerBackgroundColor="#EFA5B0" editable={props.editable} col={colJSON.GenEdTable} />
      <GeneralDataTable data={props.data} getUpdate={props.getUpdate} title={"Grade Distribution"} headerBackgroundColor="#ADA8F6" editable={props.editable} col={colJSON.GradeDistributionTable} />
      <GeneralDataTable data={props.data} getUpdate={props.getUpdate} title={"Instructor"} headerBackgroundColor="#89ED96" editable={props.editable} col={colJSON.InstructorTable} />
    </div>
  );
}

export default Admin;
