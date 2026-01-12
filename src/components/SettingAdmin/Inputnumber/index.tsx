// @ts-nocheck
import React from "react"
import { Row, Col, FormGroup, Label, Input } from "reactstrap"

const BaseInput = ({ col = "9", ...props }) => {
  return (
    <div>
      <Row>
        <Col lg="12">
          <FormGroup className="mb-3" row>
            <Label
              htmlFor="taskname"
              className={`col-form-label col-lg-${12 - col}`}
            >
              {props.title}
            </Label>
            <Col lg={col}>
              <Input
                className="form-control"
                type="number"
                // defaultValue={props.defaultValue}
                value={props.value}
                onChange={props.onChange}
                id="example-number-input"
              />
            </Col>
          </FormGroup>
        </Col>
      </Row>
    </div>
  )
}

export default BaseInput
