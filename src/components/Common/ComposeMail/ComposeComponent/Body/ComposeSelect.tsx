// @ts-nocheck
import React from "react"
import { Row, Col, FormGroup, Label } from "reactstrap"
import Select from "react-select"
import { useTranslation } from "react-i18next"
import { colourStyles } from "components/Common/HanSelect"
import DropdownIndicator from "components/Common/HanSelect/DropdownIndicator"

const ComposeSelect = (props) => {
  const {
    value,
    title,
    onChange,
    component,
    isMulti = false,
    customComponents = {},
    stylesSelect = {},
    maxMenuHeight = 300,
    onMenuScrollToBottom = () => {},
    placeholder = "common.org_select",
    composeFieldsClass = "",
    ...rest
  } = props

  const { t } = useTranslation()

  return (
    <div className={`${composeFieldsClass} d-flex align-items-center gap-2 mb-2`}>
      {title && (
        <Label htmlFor={title} className={`col-form-label mb-0`}>
          {title}
        </Label>
      )}

      <Select
        value={value}
        isMulti={isMulti}
        onChange={onChange}
        options={props.optionGroup}
        className={`select2-selection flex-grow-1`}
        styles={{
          menu: (base) => ({
            ...base,
            backgroundColor: "white!important",
          }),
          ...stylesSelect,
        }}
        maxMenuHeight={maxMenuHeight}
        onMenuScrollToBottom={onMenuScrollToBottom}
        placeholder={t(placeholder) + "..."}
        menuPosition="fixed"
        components={{
          IndicatorSeparator: () => null,
          IndicatorsContainer: DropdownIndicator,
          ...customComponents,
        }}
        {...rest}
      />
      {!!component && component}
    </div>
  )
}

export default ComposeSelect
