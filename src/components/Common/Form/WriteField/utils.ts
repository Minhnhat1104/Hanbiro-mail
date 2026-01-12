// @ts-nocheck
import _ from "lodash"

export const getParams = (mappingParams) => (data) => {
  let params = {}
  if (data) {
    Object.keys(data).forEach((key) => {
      const value = data[key]
      const parseParam = mappingParams[key]
      params[key] = parseParam ? parseParam(value) : value
    })
  }
  return params
}

const goParseData = (layoutFields, writeConfig, value) => {
  let fields = []
  let defaultValues = {}
  let mappingParams = {}

  //create Field based on page layout data
  layoutFields.forEach((_keyName, index) => {
    const fieldConfig = writeConfig?.[_keyName] || null

    if (!fieldConfig) return // continue If there is no fieldconfig

    const { parseValue, parseParam, defaultValue: originDefaultValue } = fieldConfig ?? {}

    let defaultValue
    if (value) {
      defaultValue = parseValue ? parseValue(value?.[_keyName], value) : value?.[_keyName]
    } else {
      defaultValue = originDefaultValue
    }

    fields.push({
      ...fieldConfig,
      defaultValue,
      keyName: _keyName,
    })

    // Append default value of field
    defaultValues[_keyName] = defaultValue
    // Append function parse of field
    mappingParams[_keyName] = parseParam
  })
  return { fields, defaultValues, mappingParams }
}

export const getWriteForm = (layoutFields, writeConfig, value) => {
  const { defaultValues, mappingParams, fields } = goParseData(layoutFields, writeConfig, value)

  return {
    fields,
    defaultValues,
    getParams: getParams(mappingParams),
  }
}
