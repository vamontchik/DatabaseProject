import React, {useState} from 'react';
import './ScheduleViewer.css';
import Schedule from './Schedule';
import {Container, Tooltip, OverlayTrigger} from 'react-bootstrap';
import axios from 'axios';
import FileCopy from '@material-ui/icons/FileCopy';

import {
  useParams, useHistory
} from "react-router-dom";

function ScheduleViewer() {
  let { scheduleId } = useParams();
  const url = window.location.href;

  const [data, setData] = useState([]);

  // TODO: change api base url
  const api = axios.create({
    baseURL: `https://reqres.in/api`
  })

  // TODO: change api endpoint and set data to the result
  api.get("/users/" + scheduleId)
      .then(res => {
          let final_data = [
            {
              subject: "AAS",
              number: 287,
              instructorName: "Sharif, Lila A",
              rating: 5,
              creditHours: "3 hours.",
              title: "Food and Asian Americans",
              term: "Fall",
              year: "2019",
              numStudents: 68,
              description: "Introduction to the interdisciplinary study of food to better understand the historical, social, and cultural aspects of Asian American food preparation, distribution and consumption. Students will investigate the politics and poetics of Asian American foodways by examining social habits, and rituals around food in restaurants, ethnic cookbooks, fictional works, memoirs, magazines, and television shows. Prerequisite: AAS 100 or AAS 120, or consent of instructor.",
              ACP: "ACP",
              NAT: "",
              CS: "WCC",
              QR: "QR1",
              HUM: "",
              SBS: "",
              avgGPA: 3.78911764705882,
              aPlus: 31,
              a: 12,
              aMinus: 14,
              bPlus: 12,
              b: 6,
              bMinus: 3,
              cPlus: 9,
              c: 2,
              cMinus: 8,
              dPlus: 2,
              d: 1,
              dMinus: 0,
              f: 0,
              w: 1,
              liked: 0
            },
            {
              subject: "CS",
              number: 225,
              instructorName: "Smith, Bob",
              rating: 5,
              creditHours: "3 hours.",
              title: "Abc",
              term: "Fall",
              year: "2019",
              numStudents: 150,
              description: "dsfhskjrddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
              ACP: "",
              NAT: "",
              CS: "",
              QR: "QR1",
              HUM: "",
              SBS: "",
              avgGPA: 3.42222,
              aPlus: 31,
              a: 12,
              aMinus: 14,
              bPlus: 12,
              b: 6,
              bMinus: 3,
              cPlus: 9,
              c: 2,
              cMinus: 8,
              dPlus: 2,
              d: 1,
              dMinus: 0,
              f: 0,
              w: 1,
              liked: 1
            },
            {
              subject: "ASTR",
              number: 122,
              instructorName: "Dunne, Bryan C",
              rating: 5,
              creditHours: "3 hours.",
              title: "Stars and Galaxies",
              term: "Fall",
              year: "2019",
              numStudents: 175,
              description: "Introduction to celestial objects and phenomena beyond the Solar System, and their governing basic physical principles; galaxies, quasars, and structure of the universe; dark matter and dark energy; the Big Bang and the fate of the universe; the Milky Way; the interstellar medium and the birth of stars; stellar distances, motions, radiation, structure, evolution, and remnants, including neutron stars and black holes. Emphasis will be placed on problem-solving and scientific methods. Credit is not given for ASTR 122 if credit in either ASTR 100 or ASTR 210 has been earned. Students with credit in PHYS 211 are encouraged to take ASTR 210.",
              ACP: "ACP",
              NAT: "",
              CS: "WCC",
              QR: "QR1",
              HUM: "",
              SBS: "",
              avgGPA: 3.19222857142857,
              aPlus: 31,
              a: 12,
              aMinus: 124,
              bPlus: 12,
              b: 6,
              bMinus: 3,
              cPlus: 9,
              c: 2,
              cMinus: 8,
              dPlus: 2,
              d: 1,
              dMinus: 0,
              f: 0,
              w: 1,
              liked: 0
            },
          ];
          setData(final_data);
          //setData(res.data.data)
       })
       .catch(error=>{
           console.log("Error");
           setData(undefined);
       });

  const copyURL = () => {
    navigator.clipboard.writeText(url);
  };

  return (
    <Container className="schedule-viewer">
      <h3 className="text-center">{url}

        <OverlayTrigger trigger="hover" placement="right" overlay={<Tooltip>Click to copy.</Tooltip>}>
          <FileCopy style={{right: 0}} onClick={copyURL}>
          </FileCopy>
        </OverlayTrigger>
      </h3>
      <Schedule data={data}></Schedule>
    </Container>
  );
}

export default ScheduleViewer;
