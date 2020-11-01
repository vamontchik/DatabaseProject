import React from 'react';
import './Admin.css';
import CourseSectionTable from './CourseSectionTable';
import GenEdTable from './GenEdTable';
import GradeDistributionTable from './GradeDistributionTable';
import InstructorTable from './InstructorTable';

function Admin() {
  return (
    <div className="Admin" style={{margin: "2% 0 2% 0"}}>
      <CourseSectionTable />
      <GenEdTable />
      <GradeDistributionTable />
      <InstructorTable />
    </div>
  );
}

export default Admin;
