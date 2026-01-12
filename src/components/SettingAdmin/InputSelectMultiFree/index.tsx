// @ts-nocheck
// React
import React, { useState } from "react"

// Third-party
import { Row, Col, FormGroup, Label, Input } from "reactstrap"
import CreatableSelect from "react-select/creatable"
import { useTranslation } from "react-i18next"

const BaseInputFree = props => {
  const {
    onChange,
    value,
    component,
    customComponents,
    mbForm = "",
    formClass = "",
    stylesSelect = {},
    col = 9,
    isMulti = false,
    maxMenuHeight = 300,
    onMenuScrollToBottom = () => {},
    invalid = false,
    placeholder = "common.org_select",
    ...rest
  } = props

  const { t } = useTranslation()

  return (
    <div>
      <Row>
        <Col lg="12" className={`${mbForm}`}>
          <FormGroup
            className={`${formClass} mb-4 d-flex align-items-center`}
            row
          >
            <Label
              htmlFor="taskname"
              className={`col-form-label col-lg-${12 - col}`}
            >
              {props.title}
            </Label>
            <Col lg={`${col}`} className={`${!!component ? "d-flex" : ""}`}>
              <CreatableSelect
                value={value}
                components={customComponents}
                onChange={onChange}
                options={props.optionGroup}
                className={`select2-selection ${!!component ? "w-100" : ""} ${
                  invalid ? "border border-danger rounded" : ""
                }`}
                styles={{
                  control: (base, state) => ({
                    ...base,
                    borderTopRightRadius: component ? 0 : "4px",
                    borderBottomRightRadius: component ? 0 : "4px",
                    background: state.isDisabled ? "#eff2f7" : "white",
                    borderColor: "#ced4da",
                  }),
                  menu: (base, state) => ({
                    ...base,
                    backgroundColor: "white!important",
                  }),
                  ...stylesSelect,
                }}
                maxMenuHeight={maxMenuHeight}
                onMenuScrollToBottom={onMenuScrollToBottom}
                isMulti={isMulti}
                placeholder={t(placeholder) + "..."}
                {...rest}
              />

              {!!component && component}
            </Col>
          </FormGroup>
        </Col>
      </Row>
    </div>
  )
}

export default BaseInputFree
