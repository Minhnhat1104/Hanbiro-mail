// @ts-nocheck
import React from "react"
import { Row, Col, FormGroup, Label } from "reactstrap"

const BaseViewText = props => {
  return (
    <div>
      <Row>
        <Col lg="12">
          <FormGroup className="mb-2" row>
            <Label htmlFor="taskname" className="col-form-label col-lg-3">
              {props.title}
            </Label>
            <Col className="col-form-label col-lg-9">{props.text}</Col>
          </FormGroup>
        </Col>
      </Row>
    </div>
  )
}

export default BaseViewText
