// @ts-nocheck
import React from "react"
import AsyncCreatableSelect from "react-select/async-creatable"
import { Headers, emailGet } from "helpers/email_api_helper"
import { useTranslation } from "react-i18next"
import { get } from "helpers/api_helper"

let searchTimeout

const AutoCompleteOrg = props => {
  const {
    onChange,
    value,
    component,
    customComponents,
    stylesSelect = {},
    isMulti = false,
    maxMenuHeight = 300,
    onMenuScrollToBottom = () => {},
    invalid = false,
    placeholder = "common.org_select",
    defaultOptions = [],
    isDisabled = false,
    ...rest
  } = props

  const URL_COMPLETE_LIST = "org/tree/autocomplete"
  const { t } = useTranslation()

  const filterOptions = async inputValue => {
    const params = {
      keyword: inputValue,
      page: "1",
      limit: "15",
      tree: "dynatree",
    }
    const res = await get(URL_COMPLETE_LIST, params, Headers)

    return res?.rows?.length > 0 ? res.rows : []
  }

  const promiseOptions = inputValue =>
    new Promise(resolve => {
      clearTimeout(searchTimeout)
      searchTimeout = setTimeout(() => {
        filterOptions(inputValue).then(result => {
          let newOptions = []
          if (result.length > 0) {
            result.map(item =>
              newOptions.push({
                ...item,
                value: item?.title,
                label: item?.title,
              })
            )
          }
          resolve(newOptions)
        })
      }, 400)
    })

  const onChangeSelectedOption = value => {
    onChange(value)
  }

  return (
    <AsyncCreatableSelect
      cacheOptions
      isCreatable
      isDisabled={isDisabled}
      isMulti={isMulti}
      defaultOptions={defaultOptions}
      value={value}
      onChange={onChangeSelectedOption}
      loadOptions={promiseOptions}
      components={customComponents}
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
      placeholder={t(placeholder) + "..."}
      {...rest}
    />
  )
}

export default AutoCompleteOrg
