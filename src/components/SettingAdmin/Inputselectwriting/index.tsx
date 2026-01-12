// @ts-nocheck
import React, { useState } from "react"
import { Row, Col, FormGroup, Label } from "reactstrap"
import Select from "react-select"
import { useTranslation } from "react-i18next"
import { colourStyles } from "components/Common/HanSelect"

const BaseInput = (props) => {
  const {
    onChange,
    value,
    component,
    mbForm = "",
    formClass = "",
    stylesSelect = {},
    col = 9,
    isMulti = false,
    maxMenuHeight = 300,
    onMenuScrollToBottom = () => {},
    placeholder = "common.org_select",
    title,
    noMargin = false,
    ...rest
  } = props

  const { t } = useTranslation()

  return (
    <div>
      <Row>
        <Col lg="12" className={`${mbForm}`}>
          <FormGroup row noMargin={noMargin} className={`d-flex align-items-center ${formClass}`}>
            {title && (
              <Label htmlFor={title} className={`col-form-label mb-0 col-lg-${12 - col}`}>
                {title}
              </Label>
            )}
            <Col lg={`${col}`} className={`${!!component ? "d-flex" : ""}`}>
              <Select
                value={value}
                onChange={onChange}
                options={props.optionGroup}
                className={`select2-selection ${!!component ? "w-100" : ""}`}
                styles={{
                  menu: (base) => ({
                    ...base,
                    backgroundColor: "white!important",
                  }),
                  ...stylesSelect,
                  ...colourStyles,
                }}
                maxMenuHeight={maxMenuHeight}
                onMenuScrollToBottom={onMenuScrollToBottom}
                isMulti={isMulti}
                placeholder={t(placeholder) + "..."}
                menuPosition="fixed"
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

export default BaseInput
