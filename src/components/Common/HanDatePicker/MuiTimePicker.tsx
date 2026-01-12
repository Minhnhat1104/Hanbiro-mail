// @ts-nocheck
import { useEffect, useState } from "react"

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { TimePicker } from "@mui/x-date-pickers/TimePicker"
import { isEqual } from "lodash"

import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment"
import moment from "moment"
import { parseStrTimeToDate } from "utils/dateTimeFormat"
import { useSelector } from "react-redux"

// DefaultProps {
//   isDisabled?: boolean;
//   value: string; //format 'hh:mm'
//   label?: string;
//   onChange: (time: string) => void;
//   size?: 'small' | 'medium';
//   fullWidth?: boolean;
//   isAmPm?: boolean;
// }

const MuiTimePicker = (props) => {
  const {
    isDisabled = false,
    value,
    onChange,
    size = "medium",
    label,
    fullWidth = false,
    isAmPm = true,
  } = props

  const userGeneralConfigValue = useSelector((state) => state?.Config?.userConfig)
  //state
  const [crrValue, setCrrValue] = (useState < Date) | (null > null)

  //init
  useEffect(() => {
    function initValue() {
      if (crrValue === null) {
        setCrrValue(parseStrTimeToDate("00:00"))
      }
    }
    if (value) {
      if (value !== "") {
        const inputValue = parseStrTimeToDate(value)
        if (!isEqual(inputValue, crrValue)) {
          setCrrValue(inputValue)
        }
      } else {
        initValue()
      }
    } else {
      initValue()
    }
  }, [value])

  //value change
  const handleChangeTime = (_value) => {
    if (_value) {
      setCrrValue(_value)
      //callback
      const newHour = new Date(_value)?.getHours()
      const newMinute = new Date(_value)?.getMinutes()
      const newTimeData = `${newHour.toString().padStart(2, "0")}:${newMinute
        .toString()
        .padStart(2, "0")}`
      onChange && onChange(newTimeData)
    }
  }

  return (
    <LocalizationProvider
      dateAdapter={AdapterMoment}
      adapterLocale={
        Object.keys(localeMap)?.includes(userGeneralConfigValue?.lang)
          ? localeMap?.[userGeneralConfigValue?.lang]
          : undefined
      }
    >
      <TimePicker
        label={label}
        sx={{ width: fullWidth ? "100%" : "auto" }}
        disabled={isDisabled}
        value={moment(crrValue) || null} //format: Date | null
        onChange={(date) => handleChangeTime(date ? date.toDate() : null)}
        ampm={isAmPm}
      />
    </LocalizationProvider>
  )
}

export default MuiTimePicker
