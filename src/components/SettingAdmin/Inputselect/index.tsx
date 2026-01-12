// @ts-nocheck
import React, { useState } from "react"
import { Row, Col, Card, CardBody, FormGroup, Label } from "reactstrap"
import Select from "react-select"
import { colourStyles } from "components/Common/HanSelect"

const BaseInput = (props) => {
  const [selectedGroup, setselectedGroup] = useState(null)
  const { onChange, value, maxMenuHeight } = props

  return (
    <div>
      <Row>
        <Col lg="12">
          <FormGroup className="mb-4" style={{ padding: "8px 0px", border: 0 }} row>
            <Label htmlFor="taskname" className="col-form-label col-lg-2">
              {props.title}
            </Label>
            <Col lg="10">
              <Select
                styles={colourStyles}
                value={value}
                onChange={onChange}
                // options={optionGroup}
                options={props.optionGroup}
                className="select2-selection"
                // maxMenuHeight={maxMenuHeight}
              />
            </Col>
          </FormGroup>
        </Col>
      </Row>
    </div>
  )
}

export default BaseInput
