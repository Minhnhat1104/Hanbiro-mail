// @ts-nocheck
import React, { useState } from "react"
import { Row, Col, Card, CardBody, FormGroup, Label } from "reactstrap"
import Select from "react-select"

const SelectMulti = props => {
  const [selectedMulti, setselectedMulti] = useState(null)
  function handleMulti(selectedMulti) {
    setselectedMulti(selectedMulti)
  }

  return (
    <>
      <div>
        <Row>
          <Col lg="12">
            <FormGroup
              className="mb-4"
              style={{ padding: "8px 0px", border: 0 }}
              row
            >
              <Label htmlFor="taskname" className="col-form-label col-lg-2">
                {props.title}
              </Label>
              <Col lg="10">
                <Select
                  value={selectedMulti}
                  isMulti={true}
                  onChange={() => {
                    handleMulti()
                  }}
                  options={props.optionGroup}
                  className="select2-selection"
                />
              </Col>
            </FormGroup>
          </Col>
        </Row>
      </div>
    </>
  )
}
export default SelectMulti
