// @ts-nocheck
import React, { useState } from "react"
import { Row, Col, FormGroup, Label, Card } from "reactstrap"
import Select from "react-select"

const BaseSelect = props => {
  const [selectedGroup, setselectedGroup] = useState(null)
  const { onChange, value } = props

  return (
    <div>
      <Row className="p-0 mx-1">
        <Col lg="12">
          <FormGroup row className="mt-2">
            <Label htmlFor="taskname" className="col-form-label col-lg-5">
              <input type="checkbox" className="form-check-input me-1" />
              {props.title}
            </Label>
            <Col lg="7">
              <Select
                className="select2-selection bg-white"
                value={value}
                onChange={onChange}
                options={props.optionGroup}
              />
            </Col>
          </FormGroup>
        </Col>
      </Row>

    </div>
  )
}

export default BaseSelect
