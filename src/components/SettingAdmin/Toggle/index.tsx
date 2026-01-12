// @ts-nocheck
// React
import React from "react"

// Third-party
import Switch from "react-switch"
import { Row, Col, FormGroup, Label } from "reactstrap"

import "./style.scss"

const BaseToggle = (props) => {
  const {
    title,
    checked = false,
    onChange = () => {},
    col = "10",
    position = "left",
    align = "ss" // ss: start start | se: start end | ee: end end | es: end start
  } = props

  return (
    <Row>
      <Col lg="12">
        <FormGroup row className="d-flex align-items-center">
          <Col lg={`${12 - col}`} className={`${align === "ss" || align === "se" ? "text-start" : "text-end"}`}>
            {position === "left" ? (
              <Label htmlFor="taskname" className={`col-form-label`}>
                {title}
              </Label>
            ) : (
              <Switch
                uncheckedIcon={<div className="symbol">Off</div>}
                checkedIcon={<div className="symbol">On</div>}
                className={`me-1 mb-sm-8`}
                onChange={onChange}
                checked={checked}
              />
            )}
          </Col>
          <Col lg={col} className={`${align === "ss" || align === "es" ? "text-start" : "text-end"}`}>
            {position === "right" ? (
              <Label htmlFor="taskname" className={`col-form-label`}>
                {title}
              </Label>
            ) : (
              <Switch
                uncheckedIcon={<div className="symbol">Off</div>}
                checkedIcon={<div className="symbol">On</div>}
                className={`me-1 mb-sm-8`}
                onChange={onChange}
                checked={checked}
              />
            )}
          </Col>
        </FormGroup>
      </Col>
    </Row>
  )
}

export default BaseToggle
