// @ts-nocheck
import React, { Fragment, useEffect, useMemo, useState } from "react"
import Select from "react-select"
import { useTranslation } from "react-i18next"
import { isArray, isEmpty } from "lodash"
import zIndex from "@mui/material/styles/zIndex"

export const colourStyles = {
  menu: (base) => ({
    ...base,
    backgroundColor: "white!important",
    zIndex: 3000,
  }),
  control: (styles) => ({
    ...styles,
    borderColor: "var(--bs-input-border-color)",
    boxShadow: "none",
    ":hover": {
      ...styles[":hover"],
      borderColor: "var(--bs-primary)",
      boxShadow: "0 0 0 1px var(--bs-primary)",
    },
  }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      backgroundColor: isDisabled
        ? undefined
        : isSelected
        ? "var(--bs-primary)"
        : isFocused
        ? "var(--bs-primary-lighter)"
        : undefined,
      color: isDisabled ? "#ccc" : isSelected ? "white" : "var(--bs-text-primary)",
      cursor: isDisabled ? "not-allowed" : "default",

      ":active": {
        ...styles[":active"],
        backgroundColor: !isDisabled ? (isSelected ? "var(--bs-primary)" : undefined) : undefined,
      },
    }
  },
}

export const borderBottomStyles = {
  control: (styles) => ({
    ...styles,
    border: "none",
    boxShadow: "none",
    ":hover": {
      ...styles[":hover"],
      border: "none",
      boxShadow: "none",
    },
  }),
}

const HanSelect = (props) => {
  const { loading, options, value, onChange, isDisabled, index } = props
  const { t } = useTranslation()
  const [selected, setSelected] = useState(null)
  const customOptions = useMemo(() => {
    return options.map((option) => {
      return {
        ...option,
        label: t(option.label),
      }
    })
  }, [])

  useEffect(() => {
    if (!isEmpty(customOptions)) {
      if (value) {
        let option = customOptions.find((option) => option.value === value)
        setSelected(option)
      } else {
        setSelected(customOptions[0])
      }
    }
  }, [])

  const onSelect = (obj) => {
    setSelected(obj)
    if (onChange && index) {
      onChange(obj, index)
    }
  }

  return (
    <Fragment>
      <Select
        {...props}
        options={customOptions}
        onChange={onSelect}
        value={selected ?? null}
        isLoading={loading}
        isDisabled={isDisabled}
        menuPosition="fixed"
        styles={colourStyles}
      />
    </Fragment>
  )
}

HanSelect.defaultProps = {
  options: [],
  loading: false,
}

export default React.memo(HanSelect)
