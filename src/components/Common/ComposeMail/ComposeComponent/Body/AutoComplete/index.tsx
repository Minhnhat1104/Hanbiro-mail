// @ts-nocheck
// React
import React from "react"

// Third-party
import { Row, Col, FormGroup, Label } from "reactstrap"
import AutoCompleteMail from "components/Common/AutoCompleteMail"
import "./styles.scss"

const AutoComplete = (props) => {
  const { AutoCompleteComponent, component, mbForm, formClass, col = 9, innerRef, ...rest } = props

  return (
    <div className="base-autocomplete">
      <Row>
        <Col lg="12" className={`${mbForm}`}>
          <FormGroup className={`${formClass} mb-4 d-flex align-items-center`} row>
            <Label htmlFor="taskname" className={`col-form-label col-lg-${12 - col}`}>
              {props.title}
            </Label>
            <Col lg={`${col}`} className={`${!!component ? "d-flex" : ""}`}>
              <div style={{ width: "calc(100% - 24px" }}>
                {AutoCompleteComponent ? (
                  <AutoCompleteComponent component={component} {...rest} />
                ) : (
                  <AutoCompleteMail component={component} {...rest} innerRef={innerRef} />
                )}
              </div>

              {!!component && component}
            </Col>
          </FormGroup>
        </Col>
      </Row>
    </div>
  )
}

export default AutoComplete
