// @ts-nocheck
import React, { useState } from "react"
import { InputGroup, Row, Col, FormGroup, Label } from "reactstrap"
import "react-datepicker/dist/react-datepicker.css";
//Import Flatepicker
import "flatpickr/dist/themes/material_blue.css";
import Flatpickr from "react-flatpickr";

const SettingTime = props => {
  const [pick_date, setPickDate] = useState("");
  return (

    <Row>
      <Col lg="12">
        <FormGroup row>
          <Label
            htmlFor="taskname"
            className="col-form-label col-lg-2"
          >
            {props.title}
          </Label>
          <Col lg="10">
            <input
              className="form-control"
              type="datetime-local"
              defaultValue="2019-08-19T13:45:00"
              id="example-datetime-local-input"
            />
            {/* <InputGroup>
              <Flatpickr
                value={Date.parse(pick_date)}
                className="form-control d-block"
                placeholder="2023/05/25 13:41"
                options={{
                  altInput: true,
                  dateFormat: "d-m-y"
                }}
              />
              <div className="input-group-append">
                <button
                  type="button"
                  className="btn btn-outline-secondary docs-datepicker-trigger"
                  disabled
                >
                  <i
                    className="mdi mdi-clock-outline"
                    aria-hidden="true"
                  />
                </button>
              </div>
            </InputGroup> */}

          </Col>
        </FormGroup>
      </Col>
    </Row>
  )
}
export default SettingTime