// @ts-nocheck
import BaseIconTooltip from "components/Common/BaseIconTooltip"
import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { Row, Col, Input, FormGroup, Label, FormText } from "reactstrap"

const BaseInput = ({
  title = "taskname",
  note,
  col = 9,
  value,
  onChange,
  formClass = "mb-3",
  mbForm = "",
  type = "text",
  min = "0",
  invalid = false,
  onBlur = () => {},
  disabled = false,
  style,
  id,
  onCopy,
  autoComplete = "off",
  formText,
}) => {
  const { t } = useTranslation()

  return (
    <div>
      <Row>
        <Col lg="12" className={`${mbForm}`}>
          <div className={`${formClass} row`}>
            <Label htmlFor={title} className={`col-form-label col-lg-${12 - col}`}>
              {title}
            </Label>
            <Col lg={`${col}`}>
              {onCopy && (
                <div
                  style={{
                    position: "absolute",
                    right: "16px",
                    top: "3px",
                    zIndex: 30,
                  }}
                >
                  <BaseIconTooltip
                    title={t("common.action_copy")}
                    id={`copy-${id}`}
                    icon={"mdi mdi-content-copy"}
                    onClick={() => onCopy()}
                  />
                </div>
              )}
              <Input
                id={title}
                name={title}
                className="form-control"
                placeholder={note}
                autoComplete={autoComplete}
                defaultValue={value}
                onChange={(e) => onChange(e)}
                type={type}
                min={min}
                invalid={invalid}
                onBlur={onBlur}
                disabled={disabled}
                style={style}
              />
              {formText && <FormText>{formText}</FormText>}
            </Col>
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default BaseInput
