// @ts-nocheck
import React from "react"
import { Row, Col, Input, FormGroup, Label } from "reactstrap"

const BaseInput = props => {
  const {
    id = "taskname",
    type = "text",
    title,
    note,
    value = "",
    onChange = () => {
    },
    autoComplete = "on",
    invalid = false,
    formClass = "",
    col = "10",
    ...rest
  } = props
  return (
    <Col lg={`12`}>
      <FormGroup row className={`mb-3 ${formClass}`}>
        <Col lg={`${12 - col}`}>
          <Label htmlFor={id} className={`col-form-label`}>
            {title}
          </Label>
        </Col>
        <Col lg={col}>
          <Input
            id={id}
            name="taskname"
            type={type}
            value={value}
            className={`form-control ${
              props.disabled ? "cursor-not-allowed" : ""
            }`}
            placeholder={note}
            onChange={onChange}
            autoComplete={autoComplete}
            invalid={invalid}
            {...rest}
          />
        </Col>
      </FormGroup>
    </Col>
  )
}

export default BaseInput
