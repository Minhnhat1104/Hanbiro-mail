// @ts-nocheck
import React, { useEffect, useState } from "react"
import { BaseButtonDropdown, BaseIcon } from "components/Common"
import DatePicker, { registerLocale } from "react-datepicker"
import { useTranslation } from "react-i18next"
import { Button, ButtonDropdown, DropdownMenu, DropdownToggle, Input } from "reactstrap"
import moment from "moment"
import "./styles.scss"
import "react-datepicker/dist/react-datepicker.css"
import { useSelector } from "react-redux"

import ko from "date-fns/locale/ko"
import useDevice from "hooks/useDevice"
registerLocale("ko", ko)

const options = [
  { title: "mail.asset_all", value: "all" },
  { title: "mail.mail_1_week", value: "w" },
  { title: "common.one_month_ago", value: "m" },
  { title: "mail.admin_mail_secure_approve_date_3_months", value: "3m" },
  { title: "mail.mail_search_date_range_6_month", value: "6m" },
  { title: "mail.unit_type_custom", value: "custom" },
]

const currentDataOptions = {
  w: moment().startOf("day").add("days", -7),
  m: moment().startOf("day").add("months", -1),
  "3m": moment().startOf("day").add("months", -3),
  "6m": moment().startOf("day").add("months", -6),
}

export const getInitFilterDate = (queryParams) => {
  if (
    queryParams?.["startdate"] &&
    queryParams["startdate"] !== "" &&
    queryParams?.["enddate"] &&
    queryParams["enddate"] !== ""
  ) {
    for (const key in currentDataOptions) {
      const startDate = moment(queryParams.startdate).format("YYYY/MM/DD")
      if (startDate === currentDataOptions[key].format("YYYY/MM/DD")) {
        return key
      }
    }
    return "custom"
  } else {
    return "all"
  }
}

const SearchDate = (props) => {
  const { menu, onFilterChange, isReset, setIsReset, isMobileFilter } = props
  const { t } = useTranslation()

  const { isMobile } = useDevice()

  // redux state
  const userConfig = useSelector((state) => state.Config.userConfig)
  const queryParams = useSelector((state) => state.QueryParams.query)

  const [value, setValue] = useState(() => getInitFilterDate(queryParams))
  const [openDropdown, setOpenDropdown] = useState(false)
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [dateFilter, setDateFilter] = useState({
    startdate: moment().format("YYYY/MM/DD"),
    enddate: moment().format("YYYY/MM/DD"),
  })

  // useEffect(() => {
  //   setValue("all")
  // }, [menu])

  useEffect(() => {
    let sDate = moment().startOf("day").add("days", -7)
    if (value === "w") {
      sDate = moment().startOf("day").add("days", -7)
    } else if (value === "m") {
      sDate = moment().startOf("day").add("months", -1)
    } else if (value === "3m") {
      sDate = moment().startOf("day").add("months", -3)
    } else if (value === "6m") {
      sDate = moment().startOf("day").add("months", -6)
    } else if (value === "custom") {
      setDateFilter({
        startdate: moment().format("YYYY/MM/DD"),
        enddate: moment().format("YYYY/MM/DD"),
      })
    } else {
      setDateFilter({
        startdate: "",
        enddate: "",
      })
      return
    }
    const dateObj = {
      startdate: sDate.format("YYYY/MM/DD"),
      enddate: moment().startOf("day").format("YYYY/MM/DD"),
    }
    setStartDate(new Date(dateObj.startdate))
    setEndDate(new Date(dateObj.enddate))
    setDateFilter(dateObj)
  }, [value])

  useEffect(() => {
    if (isReset) {
      setValue("all")
      setIsReset && setIsReset(false)
    }
  }, [isReset])

  const handleChangeDate = (option) => {
    setValue(option)
  }

  const onClickToggle = () => {
    setOpenDropdown(!openDropdown)
  }

  const handleSave = () => {
    if (menu === "Approval") {
      onFilterChange && onFilterChange("date", dateFilter)
    } else {
      onFilterChange && onFilterChange("date", "", dateFilter)
    }
    setOpenDropdown(false)
  }

  return (
    <ButtonDropdown
      isOpen={openDropdown}
      toggle={(e) => {
        e.stopPropagation()
        setOpenDropdown(!openDropdown)
      }}
      className={"han-h5 han-fw-regular han-text-primary base-button-dropdown"}
      direction={isMobileFilter ? (!isMobile ? "left" : "down") : "down"}
    >
      <DropdownToggle className={"btn dropdown-toggle"} tag="div" onClick={onClickToggle}>
        {t("mail.mail_list_sort_date")}
        <BaseIcon
          icon={`fas fa-chevron-${isMobileFilter ? "right" : "down"} text-secondary`}
          className={"ms-1"}
        />
      </DropdownToggle>
      <DropdownMenu className={"dropdown-item-custom dropdown-submenu"}>
        <div className="px-3 py-1">
          {options.map((option, i) => (
            <React.Fragment key={i}>
              <div className="form-check pb-3" onClick={(e) => e.stopPropagation()}>
                <Input
                  className="form-check-input"
                  type="radio"
                  name="dateOption"
                  id={`dateOption${option.value}`}
                  checked={option.value === value}
                  onChange={() => handleChangeDate(option.value)}
                />
                <label className="han-h5 han-fw-regular han-text-primary form-check-label" htmlFor={`dateOption${option.value}`}>
                  {t(option.title)}
                </label>
              </div>
            </React.Fragment>
          ))}

          {value !== "all" && (
            <div className="d-flex ms-4">
              <div className="row">
                <label className="col-12 han-h5 han-fw-regular han-text-primary" htmlFor="startDate">
                  {t("mail.mail_start_date")}
                </label>
                <DatePicker
                  locale={userConfig?.lang}
                  className={"date-picker-form start"}
                  selected={startDate}
                  // maxDate={endDate}
                  onChange={(date) => {
                    setStartDate(date)
                    if (new Date(date) > new Date(endDate)) {
                      setEndDate(date)
                    }
                    setDateFilter((prev) => {
                      return {
                        ...prev,
                        startdate: moment(date).format("YYYY/MM/DD"),
                        ...(new Date(date) > new Date(endDate) && {
                          enddate: moment(date).format("YYYY/MM/DD"),
                        }),
                      }
                    })
                  }}
                  dateFormat={"yyyy/MM/dd"}
                  disabled={value !== "custom"}
                />
              </div>
              <div className="row">
                <label className="col-12 han-h5 han-fw-regular han-text-primary" htmlFor="endDate">
                  {t("mail.mail_end_date")}
                </label>
                <DatePicker
                  locale={userConfig?.lang}
                  className={"date-picker-form end"}
                  selected={endDate}
                  minDate={startDate}
                  onChange={(date) => {
                    setEndDate(date)
                    setDateFilter((prev) => {
                      return {
                        ...prev,
                        enddate: moment(date).format("YYYY/MM/DD"),
                      }
                    })
                  }}
                  dateFormat={"yyyy/MM/dd"}
                  disabled={value !== "custom"}
                />
              </div>
            </div>
          )}

          <div className="d-flex justify-content-end">
            <Button size="" color="primary" className={`px-2 py-1 mt-3`} onClick={handleSave}>
              {t("common.common_btn_save")}
            </Button>
          </div>
        </div>
      </DropdownMenu>
    </ButtonDropdown>
  )
}

export default SearchDate
