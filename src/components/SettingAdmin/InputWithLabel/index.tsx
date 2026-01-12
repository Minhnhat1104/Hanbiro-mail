// @ts-nocheck
import { BaseIcon } from "components/Common"
import React from "react"
import { Col, FormGroup, Input, Label } from "reactstrap"

const LabelText = props => {
  const { iconColor } = props
  return (
    <div>
      <FormGroup className="mb-4" row>
        <Label
          htmlFor="taskname"
          className={`col-form-label col-lg-${
            !!props.col ? 12 - props.col : "3"
          }`}
        >
          {props.title}
        </Label>
        <Col lg={`${!!props.col ? props.col : "9"}`}>
          <div className="input-group">
            <Input
              className="form-control"
              id="inputGroupFile02"
              type={props.type}
              min={props.min}
              onChange={props.onChange}
              value={props.value}
            />
            <Label
              className="input-group-text cursor-pointer"
              htmlFor="inputGroup"
              onClick={props.onClick}
            >
              {props.label}
              <BaseIcon
                className={iconColor ? iconColor : "color-red"}
                icon={props.icon}
              />
            </Label>
          </div>
        </Col>
      </FormGroup>
    </div>
  )
}

export default LabelText
