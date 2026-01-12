// @ts-nocheck
// React
import useDevice from "hooks/useDevice"
import React, { useEffect, useState } from "react"

// Third-party
import { Col, FormGroup, Label } from "reactstrap"

const RadioButton = ({
  title = "",
  value = "",
  options = [],
  onChange = () => {},
  name = "",
  formClass = "",
  radioGroupClass = "",
  valueDisable = "",
}) => {
  const { isMobile } = useDevice()

  const [currentValue, setCurrentValue] = useState(value)

  useEffect(() => {
    setCurrentValue(value)
  }, [value])

  const onChangeOption = (e, value) => {
    // setCurrentValue(e.target.value)
    setCurrentValue(value)
    // onChange && onChange(e.target.value, name)
    onChange && onChange(e, value)
  }

  return (
    <FormGroup className={`${formClass}`} row>
      <Label htmlFor="taskname" className="col-form-label col-lg-2">
        {title}
      </Label>
      <Col lg="10" className={`form-radio d-flex align-items-center ${radioGroupClass}`}>
        <div className={`d-flex align-items-center${isMobile ? " flex-column gap-2" : ""}`}>
          {options &&
            options.map((data, index) => (
              <div className="form-check mx-2" key={index}>
                <input
                  className="form-check-input"
                  type="radio"
                  // value={data.value}
                  checked={data.value === currentValue}
                  onChange={(e) => onChangeOption(e, data.value)}
                  id={["exampleRadios", name, index].join("")}
                  disabled={data.value === valueDisable}
                />
                <label
                  className="form-check-label"
                  htmlFor={["exampleRadios", name, index].join("")}
                >
                  {data.title}
                </label>
              </div>
            ))}
        </div>
      </Col>
    </FormGroup>
  )
}

export default RadioButton
