// @ts-nocheck
import { BaseIcon } from "components/Common"
import moment from "moment"
import React, { useEffect, useRef, useState } from "react"
import DatePicker, { registerLocale } from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { Button, Input } from "reactstrap"
import "./styles.scss"

import { List, Popover } from "@mui/material"
import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers"
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment"
import useDevice from "hooks/useDevice"
import "moment/locale/ko"
import { getInitFilterDate } from "."

const options = [
  { title: "mail.asset_all", value: "all" },
  { title: "mail.mail_1_week", value: "w" },
  { title: "common.one_month_ago", value: "m" },
  { title: "mail.admin_mail_secure_approve_date_3_months", value: "3m" },
  { title: "mail.mail_search_date_range_6_month", value: "6m" },
  { title: "mail.unit_type_custom", value: "custom" },
]

const MobileSearchDate = (props) => {
  const { menu, onFilterChange, isReset, setIsReset, isMobileFilter } = props
  const { t } = useTranslation()

  const { isMobile } = useDevice()

  // redux state
  const userConfig = useSelector((state) => state.Config.userConfig)
  const queryParams = useSelector((state) => state.QueryParams.query)

  const searchDateRef = useRef(null)

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
    if (isReset) {
      setValue("all")
      setIsReset && setIsReset(false)
    }
  }, [isReset])

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
    <>
      <div
        ref={searchDateRef}
        className={"p-2 d-flex justify-content-between align-items-center w-100"}
        onClick={onClickToggle}
      >
        {t("mail.mail_list_sort_date")}
        <BaseIcon
          icon={`fas fa-chevron-${openDropdown ? "down" : "right"} text-secondary`}
          className={"ms-1"}
        />
      </div>
      <Popover
        id={`folder-popover`}
        open={openDropdown}
        onClose={() => setOpenDropdown((prev) => !prev)}
        anchorEl={searchDateRef.current}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{
          "& .MuiPopover-paper": {
            p: 0.5,
            boxShadow:
              "0px 10px 13px -6px rgba(0,0,0,0.2),0px 20px 100px 3px rgba(0,0,0,0.14),0px 8px 200px 7px rgba(0,0,0,0.12)",
          },
        }}
      >
        <List
          component="nav"
          sx={{
            p: 0,
            width: "90vw",
            maxWidth: 500,
            borderRadius: 0.5,
          }}
        >
          <div className="p-3">
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
                  <label className="form-check-label" htmlFor={`dateOption${option.value}`}>
                    {t(option.title)}
                  </label>
                </div>
              </React.Fragment>
            ))}

            {value !== "all" && (
              <div className="d-flex ms-4">
                <div className="w-50 d-flex flex-column">
                  <label className="" htmlFor="startDate">
                    {t("mail.mail_start_date")}
                  </label>
                  <LocalizationProvider
                    dateAdapter={AdapterMoment}
                    adapterLocale={userConfig?.lang}
                  >
                    <MobileDatePicker
                      value={moment(startDate)}
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
                      dateFormat={"YYYY/MM/DD"}
                      disabled={value !== "custom"}
                      sx={{
                        "& .MuiInputBase-root": { height: 40, fontSize: "13px" },
                        "& .Mui-focused": {
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderWidth: "1px !important",
                            borderColor: "var(--bs-gray-500) !important",
                          },
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderRight: "none !important",
                          borderTopRightRadius: 0,
                          borderBottomRightRadius: 0,
                        },
                      }}
                    />
                  </LocalizationProvider>
                </div>
                <div className="w-50 d-flex flex-column">
                  <label className="" htmlFor="endDate">
                    {t("mail.mail_end_date")}
                  </label>
                  <LocalizationProvider
                    dateAdapter={AdapterMoment}
                    adapterLocale={userConfig?.lang}
                  >
                    <MobileDatePicker
                      value={moment(endDate)}
                      minDate={moment(startDate)}
                      onChange={(date) => {
                        setEndDate(date)
                        setDateFilter((prev) => {
                          return {
                            ...prev,
                            enddate: moment(date).format("YYYY/MM/DD"),
                          }
                        })
                      }}
                      dateFormat={"YYYY/MM/DD"}
                      disabled={value !== "custom"}
                      sx={{
                        "& .MuiInputBase-root": { height: 40, fontSize: "13px" },
                        "& .Mui-focused": {
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderWidth: "1px !important",
                            borderColor: "var(--bs-gray-500) !important",
                          },
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderTopLeftRadius: 0,
                          borderBottomLeftRadius: 0,
                        },
                      }}
                    />
                  </LocalizationProvider>
                </div>
              </div>
            )}

            <div className="d-flex justify-content-end">
              <Button size="" color="primary" className={`px-2 py-1 mt-3`} onClick={handleSave}>
                {t("common.common_btn_save")}
              </Button>
            </div>
          </div>
        </List>
      </Popover>
    </>
  )
}

export default MobileSearchDate
