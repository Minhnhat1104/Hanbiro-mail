// @ts-nocheck
import React from "react"
import { Row, Col, Input, FormGroup, Label } from "reactstrap"

const BaseTextArea = (props) => {
  const {
    title,
    note,
    value,
    onChange,
    autoComplete = "on",
    col = 10,
    formClass = "mb-4",
    noMargin = false,
    ...rest
  } = props
  return (
    <div>
      <Row>
        <Col lg="12">
          <FormGroup className={formClass} row noMargin={noMargin}>
            <Label htmlFor="taskname" className={`col-form-label col-lg-${12 - col}`}>
              {title}
            </Label>
            <Col lg={col}>
              <Input
                id="taskname"
                name="taskname"
                type="textarea"
                value={value}
                className="form-control"
                placeholder={note}
                onChange={onChange}
                autoComplete={autoComplete}
                {...rest}
              />
            </Col>
          </FormGroup>
        </Col>
      </Row>
    </div>
  )
}

export default BaseTextArea
