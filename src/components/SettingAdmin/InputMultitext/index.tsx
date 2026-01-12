// @ts-nocheck
import { BaseButton, BaseIcon } from "components/Common"
import React, { useState } from "react"
import { Row, Col, Card, CardBody, Input, FormGroup, Label } from "reactstrap"

const MultiText = props => {
  return (
    <div>
      <Row>
        <Col lg="12">
          <FormGroup className="mb-4" row>
            <Label htmlFor="taskname" className="col-form-label col-lg-3">
              {props.title}
            </Label>
            <Col lg="9">
              <div
                id="taskname"
                name="taskname"
                type="text"
                className="form-control"
                placeholder={props.note}
              >
                <div className="action-button">
                  <BaseButton
                    // key={index}
                    className={"btn btn-soft-secondary p-1 my-1"}
                    type="button"
                  >
                    hehe
                    <BaseIcon
                      icon={"mdi mdi-close-thick"}
                      // onClick={() => handleRemove(item, "fftype")}
                    />
                  </BaseButton>
                  <BaseButton
                    className={"btn btn-soft-secondary"}
                    type="button"
                  >
                    {props.name2}
                  </BaseButton>
                </div>
              </div>
            </Col>
          </FormGroup>
        </Col>
      </Row>
    </div>
  )
}

export default MultiText
