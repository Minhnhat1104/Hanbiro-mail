// @ts-nocheck
import { Field } from "formik"
import useDevice from "hooks/useDevice"
import React from "react"
import { useTranslation } from "react-i18next"
import { Col, Row } from "reactstrap"

const WriteField = (props) => {
  const {
    item,
    keyName,
    errors,
    isHidden,
    disabled = false,
    isHorizontal = true,
    ratio = { label: 3, component: 9 },
  } = props

  const {
    languageKey,
    hideTitle = false,
    hideErrorMsg = false,
    titleClass = {},
    itemClass = {},
    defaultValue: itemValue,
    validate,
    columns,
    Component,
    componentProps,
  } = item

  const { t } = useTranslation()

  const { isTablet } = useDevice()

  const getGridCol = () => {
    switch (isTablet ? 1 : columns) {
      case 1:
        return 12
      case 2:
        return 6
      case 3:
        return 4
      case 4:
        return 3
      case 6:
        return 2
      default:
        return 12
    }
  }

  return (
    <Col xs={getGridCol()} className={`d-${isHidden ? "none" : "block"}`}>
      <Row className={`g-${isHorizontal ? "0" : "1"}`}>
        {!hideTitle && (
          <Col xs={12} sm={isHorizontal ? ratio?.label : 12}>
            <span className={`han-h4 han-text-secondary han-fw-medium ${titleClass}`}>
              {t(languageKey)}
            </span>
          </Col>
        )}
        {Component ? (
          <Col xs={12} sm={isHorizontal && !hideTitle ? ratio?.component : 12}>
            <div className={`d-flex flex-column gap-2 ${itemClass}`}>
              <Field name={keyName}>
                {({ field: { onChange, value, onBlur }, form, meta }) => {
                  const { isCustomComponent } = componentProps || {}
                  return (
                    <Component
                      onBlur={onBlur}
                      disabled={disabled}
                      {...componentProps}
                      name={keyName}
                      value={value}
                      onChange={(data) => {
                        isCustomComponent ? form?.setFieldValue(keyName, data) : onChange(data)
                      }}
                    />
                  )
                }}
              </Field>
            </div>
          </Col>
        ) : (
          <span>{t("common.nodata_msg")}</span>
        )}

        {!isHorizontal && !hideErrorMsg && errors?.[keyName] && (
          <span className="han-body2 text-danger">{errors?.[keyName]}</span>
        )}
      </Row>
    </Col>
  )
}

export default WriteField
