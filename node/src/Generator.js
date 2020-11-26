import React, { useState } from 'react';
import './Generator.css';
import {Form, Button, Row, Col, Container, Badge, Tooltip, OverlayTrigger} from 'react-bootstrap'
import InputSlider from './InputSlider'
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

function Generator() {

  const [ minAvgGpa, setMinAvgGpa ] = useState(0);

  const [ ACP_ACP, setACP_ACP ] = useState(0);

  const [ CS_US, setCS_US ] = useState(0);
  const [ CS_NW, setCS_NW ] = useState(0);
  const [ CS_WCC, setCS_WCC ] = useState(0);

  const [ HUM_HP, setHUM_HP ] = useState(0);
  const [ HUM_LA, setHUM_LA ] = useState(0);

  const [ NAT_LS, setNAT_LS ] = useState(0);
  const [ NAT_PS, setNAT_PS ] = useState(0);

  const [ QR_QR1, setQR_QR1 ] = useState(0);
  const [ QR_QR2, setQR_QR2 ] = useState(0);

  const [ SBS_SS, setSBS_SS ] = useState(0);
  const [ SBS_BSC, setSBS_BSC ] = useState(0);

  const available_priorities = ["Maximize GPA", "Maximize Credit Hours", "Minimize Credit Hours"];
  const [ priority, setPriority ] = useState(available_priorities[0]);

  const handleChange = (event) => {
    setPriority(event.target.value)
  };

  const generateSchedule = () => {
      let scheduleJSON = {
        	minAvgGpa: minAvgGpa,
        	ACP_ACP: ACP_ACP,
        	CS_US: CS_US,
        	CS_NW: CS_NW,
        	CS_WCC: CS_WCC,
        	HUM_HP: HUM_HP,
        	HUM_LA: HUM_LA,
        	NAT_LS: NAT_LS,
        	NAT_PS: NAT_PS,
        	QR_QR1: QR_QR1,
        	QR_QR2: QR_QR2,
        	SBS_SS: SBS_SS,
        	SBS_BSC: SBS_BSC,
          priority: priority
      };

      // TODO : API function to create a schedule
      // and then route to the new page
      console.log(scheduleJSON);
  };

  return (
    <Container className="generatorView">
      <Row>
        <Col className="text-center generatorViewTitle">
          <h3>Schedule Properties
          <OverlayTrigger placement="right" overlay={<Tooltip> Select the minimum average gpa and the number of courses that fulfill each general education requirement.</Tooltip>}>
            <span  style={{marginLeft: '1vw'}}>
              <Badge variant="info">?</Badge>
            </span>
          </OverlayTrigger>
          </h3>
        </Col>
      </Row>

      <InputSlider title="Minimum Average GPA" value={minAvgGpa} setValue={setMinAvgGpa} min={0} max={4} step={0.25}/>

      <InputSlider title="Advanced Composition" value={ACP_ACP} setValue={setACP_ACP} min={0} max={3} step={1}/>

      <InputSlider title="Cultural Studies - US" value={CS_US} setValue={setCS_US} min={0} max={3} step={1}/>
      <InputSlider title="Cultural Studies - NW" value={CS_NW} setValue={setCS_NW} min={0} max={3} step={1}/>
      <InputSlider title="Cultural Studies - WCC" value={CS_WCC} setValue={setCS_WCC} min={0} max={3} step={1}/>

      <InputSlider title="Humanities & the Arts- HP" value={HUM_HP} setValue={setHUM_HP} min={0} max={3} step={1}/>
      <InputSlider title="Humanities & the Arts - LA" value={HUM_LA} setValue={setHUM_LA} min={0} max={3} step={1}/>

      <InputSlider title="Natural Sciences & Technology - LS" value={NAT_LS} setValue={setNAT_LS} min={0} max={3} step={1}/>
      <InputSlider title="Natural Sciences & Technology - PS" value={NAT_PS} setValue={setNAT_PS} min={0} max={3} step={1}/>

      <InputSlider title="Quantitative Reasoning 1" value={QR_QR1} setValue={setQR_QR1} min={0} max={3} step={1}/>
      <InputSlider title="Quantitative Reasoning 2" value={QR_QR2} setValue={setQR_QR2} min={0} max={3} step={1}/>

      <InputSlider title="Social & Behavioral Sciences - SS" value={SBS_SS} setValue={setSBS_SS} min={0} max={3} step={1}/>
      <InputSlider title="Social & Behavioral Sciences - SBS" value={SBS_BSC} setValue={setSBS_BSC} min={0} max={3} step={1}/>

      <Row className="generatorViewBottom">
        <Col xs={6} className="text-center">
          <FormControl style={{width: "100%", height: "100%"}}>
              <Select fullWidth block size="sm"
              native
              value={priority}
              onChange={handleChange}
              inputProps={{
                name: 'Priority',
                id: 'filled-age-native-simple',
              }}
              >
              <option value={available_priorities[0]}>Maximize GPA</option>
              <option value={available_priorities[1]}>Minimize Credit Hours</option>
              <option value={available_priorities[2]}>Maximize Credit Hours</option>
              </Select>
            </FormControl>
        </Col>

        <Col xs={6} className="text-center">
          <Button block variant="primary" onClick={generateSchedule}>Generate!</Button>
        </Col>

      </Row>
    </Container>
  );

};

export default Generator;
