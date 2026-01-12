// @ts-nocheck
import React, { useState } from "react";
import {
  Row,
  Col,
  Card,
  CardBody,
  Input,
  FormGroup,
  Label,
} from "reactstrap";

const BaseInputRadio = props => {
  return <div>
    <Row>
      <Col lg="12">
        <FormGroup className="mb-4" row>
          <Label
            htmlFor="taskname"
            className="col-form-label col-lg-2"
          >
            {props.title}
          </Label>
          <Col lg="10">
            <div className="form-check form-radio-info mb-3">
              <input
                type="radio"
                id="customRadiocolor3"
                name="customRadiocolor3"
                className="form-check-input"
              />
              <label
                className="form-check-label"
                htmlFor="taskname"
              >
                {props.status}
              </label>
            </div>
          </Col>
        </FormGroup>
      </Col>
    </Row>
  </div>
}


export default BaseInputRadio
