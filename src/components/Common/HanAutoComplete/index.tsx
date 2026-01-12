// @ts-nocheck
import React, { Fragment, useEffect, useMemo, useState } from "react"
import Select from "react-select"
import { useTranslation } from "react-i18next"
import { isArray, isEmpty } from "lodash"
import { colourStyles } from "../HanSelect/index"

const HanAutoComplete = (props) => {
  const { isMulti, loading, options, value, onChange, isDisabled, index } = props
  const { t } = useTranslation()
  const [selected, setSelected] = useState(null)

  const customOptions = useMemo(() => {
    return options.map((option) => {
      return {
        ...option,
        label: t(option.label),
      }
    })
  }, [options])

  useEffect(() => {
    if (!isEmpty(customOptions)) {
      if (value) {
        if (isMulti) {
          setSelected(value)
        } else {
          let option = customOptions.find((option) => option.value === value)
          setSelected(option)
        }
      } else {
        setSelected(isMulti ? [] : customOptions[0])
      }
    }
  }, [value])

  const onSelect = (data, action) => {
    setSelected(data)
    if (onChange) {
      if (index) {
        onChange(data, index)
      } else {
        onChange(data, action)
      }
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
        styles={{
          menu: (base) => ({
            ...base,
            backgroundColor: "white!important",
          }),
          ...colourStyles,
        }}
      />
    </Fragment>
  )
}

export default React.memo(HanAutoComplete)
