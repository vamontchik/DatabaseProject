import React from 'react';
import {Form, FormControl, Row, Col} from 'react-bootstrap'
import Slider from '@material-ui/core/Slider'

function InputSlider(props) {
  return (
    <Row>
      <Col xs={3}>
        <Form.Control className="text-center" plaintext readOnly defaultValue={props.title}/>
      </Col>

      <Col xs={6}>
        <Slider style={{top: "6px"}}
          value={props.value}
          min={props.min}
          step={props.step}
          max={props.max}
          onChange={(event, newValue) => {
            props.setValue(newValue);
          }}
          marks={true}
        />
      </Col>

      <Col xs={3}>
        <Form.Control className="text-center" plaintext readOnly value={props.value} />
      </Col>
    </Row>
  );

};

export default InputSlider;
