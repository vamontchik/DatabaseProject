import React from 'react';
import './Admin.css';
import GeneralDataTable from '../GeneralDataTable'
import colJSON from '../columns.json'

function Admin(props) {
  return (
    <div className="Admin" style={{margin: "2% 0 2% 0"}}>
      <GeneralDataTable title={"Course Section"} headerBackgroundColor="#ADD8E6" editable={props.editable} col={colJSON.CourseSectionTable} extension={"/CourseSection"}/>
      <GeneralDataTable title={"Search Table"} headerBackgroundColor="#ADD8E6" editable={false} isSearchable={true} col={colJSON.CourseSectionTable} extension={"/CourseSection"} />
    </div>
  );
}


export default Admin;
