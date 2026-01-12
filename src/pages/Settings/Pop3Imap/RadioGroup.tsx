// @ts-nocheck
// React
import useDevice from "hooks/useDevice"
import React, { useEffect, useState } from "react"

// Third-party
import { Col, FormGroup, Label, Row } from "reactstrap"

const RadioGroup = ({
  title = "",
  value = "",
  options = [],
  onChange = () => {},
  name = "",
  formClass = "",
  radioGroupClass = "",
  radioColumn = 6,
  valueDisable = "",
}) => {
  const { isMobile } = useDevice()

  const [currentValue, setCurrentValue] = useState(value)

  useEffect(() => {
    setCurrentValue(value)
  }, [value])

  const onChangeOption = (e, value) => {
    setCurrentValue(value)
    onChange && onChange(e, value)
  }

  return (
    <FormGroup row className={`mb-0 gx-0 gy-2 gy-lg-0 ${formClass} align-items-center`}>
      <Label
        htmlFor="taskname"
        className={`col-form-label col-12 col-lg-3 ${!title ? "p-0 m-0" : ""}`}
      >
        {title}
      </Label>
      <Col xs={12} lg={9}>
        <Row>
          {options &&
            options.map((data, index) => (
              <Col key={index} xs={12} lg={radioColumn} className={`form-radio ${radioGroupClass}`}>
                <div className="form-check mx-2" key={index}>
                  <input
                    className="form-check-input"
                    type="radio"
                    checked={data.value === currentValue}
                    onChange={(e) => onChangeOption(e, data.value)}
                    id={[name, index].join("-")}
                    disabled={data.value === valueDisable}
                  />
                  <label
                    className="form-check-label han-text-primary"
                    htmlFor={[name, index].join("-")}
                  >
                    {data.title}
                  </label>
                </div>
              </Col>
            ))}
        </Row>
      </Col>
    </FormGroup>
  )
}

export default RadioGroup
