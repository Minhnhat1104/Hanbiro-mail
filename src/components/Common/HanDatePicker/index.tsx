// @ts-nocheck
import React, { forwardRef, useEffect, useState } from "react"

import { useSelector } from "react-redux"
import DatePicker, { registerLocale } from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { Popper } from "react-popper"

import "./styles.scss"
import BaseIcon from "../BaseIcon"
import BaseButton from "../BaseButton"

import ko from "date-fns/locale/ko"
import { getDateFormat, getDateTimeFormat } from "utils/dateTimeFormat"
import useDevice from "hooks/useDevice"
import { Input, InputGroup } from "reactstrap"

registerLocale("ko", ko)

const CustomInput = forwardRef(function CustomInput(props, ref) {
  const {
    value,
    onClick,
    className,
    style,
    disabled,
    buttonColor = "grey",
    buttonClassName = "",
    buttonStyle = {},
    buttonWrapperStyle = {},
    icon,
    iconClassName,
  } = props
  return (
    <InputGroup ref={ref}>
      <Input
        disabled={disabled}
        className={className}
        style={style}
        value={value}
        onClick={onClick}
      />
      <div className="input-group-append date-pick-button han-bg-color-soft-grey" style={buttonWrapperStyle}>
        <BaseButton
          color={buttonColor}
          className={`btn-action ${buttonClassName}`}
          icon={`mdi mdi-calendar-blank-outline${icon ? " " + icon : ""}`}
          iconClassName={`m-0${iconClassName ? " " + iconClassName : ""}`}
          onClick={onClick}
          disabled={disabled}
          style={buttonStyle}
        />
      </div>
    </InputGroup>
  )
})

const HanDatePicker = (props) => {
  const {
    placeholder = "",
    onChange = () => {},
    value = "",
    disabled = false,
    className = "",
    dateFormat = "m/d/Y",
    enableTime = false,
    iconClass,
    attrs,
  } = props
  const { isMobile } = useDevice()
  const userConfig = useSelector((state) => state.Config.userConfig)

  const replaceFormat = (date) => {
    return date.replace("YYYY", "yyyy").replace("DD", "dd")
  }

  const [format, setFormat] = useState(replaceFormat(dateFormat))

  useEffect(() => {
    if (userConfig) {
      setFormat(enableTime ? getDateTimeFormat(userConfig) : getDateFormat(userConfig))
    }
  }, [userConfig, enableTime])

  return (
    <>
      <DatePicker
        locale={userConfig?.lang}
        onChange={onChange}
        placeholderText={placeholder}
        selected={value}
        disabled={disabled}
        dateFormat={format}
        showTimeSelect={!isMobile && enableTime}
        showTimeInput={isMobile && enableTime}
        // formatWeekDay={(nameOfDay) => nameOfDay.substr(0, 3)}
        showMonthDropdown
        showYearDropdown
        useWeekdaysShort={true}
        customInput={
          <CustomInput
            className={"form-control " + className}
            disabled={disabled}
            iconClassName={iconClass}
            {...attrs}
          />
        }
        popperProps={{
          positionFixed: true,
        }}
        {...attrs}
      />
    </>
  )
}

export default HanDatePicker
