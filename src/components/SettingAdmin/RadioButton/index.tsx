// @ts-nocheck
import React, { useState } from "react"
import { Row, Col, Card, CardBody, FormGroup, Label, Input } from "reactstrap"

const BaseRadioButton = props => {
  const { onChange, value } = props

  return (
    <div>
      <Row>
        <Col lg="12">
          <FormGroup
            className="mb-4"
            style={{ padding: "8px 0px", border: 0 }}
            row
          >
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
                {props.title}
              </label>
            </div>
          </FormGroup>
        </Col>
      </Row>
    </div>
  )
}

export default BaseRadioButton
