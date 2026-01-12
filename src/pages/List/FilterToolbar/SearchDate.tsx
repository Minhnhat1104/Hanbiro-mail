// @ts-nocheck
import MuiDatePicker from "components/Common/HanDatePicker/MuiDatePicker"
import { colourStyles } from "components/Common/HanSelect"
import ko from "date-fns/locale/ko"
import moment from "moment"
import { useEffect, useState } from "react"
import { registerLocale } from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import Select from "react-select"
import { Col, Row } from "reactstrap"
import { getDateTimeFormat } from "utils/dateTimeFormat"
registerLocale("ko", ko)

export const currentDataOptions = {
  w: moment().startOf("day").add("days", -7),
  m: moment().startOf("day").add("months", -1),
  "3m": moment().startOf("day").add("months", -3),
  "6m": moment().startOf("day").add("months", -6),
}

const getInitFilterDate = (queryParams, keyOfStartDate, keyOfEndDate, dateFormat) => {
  if (
    queryParams?.[keyOfStartDate] &&
    queryParams[keyOfStartDate] !== "" &&
    queryParams?.[keyOfEndDate] &&
    queryParams[keyOfEndDate] !== ""
  ) {
    for (const key in currentDataOptions) {
      const startDate = moment(queryParams?.[keyOfStartDate], dateFormat).format(dateFormat)
      if (startDate === currentDataOptions[key].format(dateFormat)) {
        return key
      }
    }
    return "custom"
  } else {
    return "all"
  }
}

const SearchDate = (props) => {
  const {
    type,
    filterOptions,
    onFilterChange,
    keyOfStartDate = "startdate",
    keyOfEndDate = "enddate",
  } = props
  const { t } = useTranslation()

  const userGeneralConfigValue = useSelector((state) => state?.Config?.userConfig)
  const userDateFormat = getDateTimeFormat(userGeneralConfigValue, "/", "MUI")
  const dateFormat = userDateFormat || "YYYY/MM/DD HH:mm:ss"

  const options = [
    { label: t("mail.asset_all"), value: "all" },
    { label: t("mail.mail_1_week"), value: "w" },
    { label: "1" + t("admin.approval_form_month"), value: "m" },
    { label: t("mail.admin_mail_secure_approve_date_3_months"), value: "3m" },
    { label: t("mail.mail_search_date_range_6_month"), value: "6m" },
    { label: t("mail.unit_type_custom"), value: "custom" },
  ]

  // redux state
  const userConfig = useSelector((state) => state.Config.userConfig)

  const [value, setValue] = useState("all")
  const [startDate, setStartDate] = useState(() =>
    filterOptions?.[keyOfStartDate] ? new Date(filterOptions?.[keyOfStartDate]) : new Date(),
  )
  const [endDate, setEndDate] = useState(
    filterOptions?.[keyOfEndDate] ? new Date(filterOptions?.[keyOfEndDate]) : new Date(),
  )
  const [dateFilter, setDateFilter] = useState(() => null)

  const calculateDate = (value) => {
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
      sDate = moment().startOf("day").add("days", -14)
    } else {
      setDateFilter({
        [keyOfStartDate]: "",
        [keyOfEndDate]: "",
      })
      return
    }
    const dateObj = {
      [keyOfStartDate]: sDate.format(dateFormat),
      [keyOfEndDate]: moment().endOf("day").format(dateFormat),
    }
    setStartDate(moment(dateObj?.[keyOfStartDate], dateFormat))
    setEndDate(moment(dateObj?.[keyOfEndDate], dateFormat))
    setDateFilter(dateObj)
  }

  useEffect(() => {
    setValue(() => getInitFilterDate(filterOptions, keyOfStartDate, keyOfEndDate, dateFormat))
  }, [filterOptions])

  useEffect(() => {
    if (dateFilter) {
      onFilterChange && onFilterChange({ type, value: dateFilter })
    }
  }, [dateFilter])

  return (
    <div className="d-flex flex-column">
      <Select
        value={options.find((item) => item.value === value)}
        options={options}
        onChange={(data) => {
          setValue(data?.value)
          calculateDate(data?.value)
        }}
        menuPosition="fixed"
        styles={colourStyles}
      />

      {value !== "all" && (
        <Row className="mt-2 gx-2 gy-lg-0 gy-2">
          <Col xs={12} lg={6}>
            <MuiDatePicker
              value={startDate}
              onChange={(date) => {
                setStartDate(date)
                if (new Date(date) > new Date(endDate)) {
                  setEndDate(date)
                }
                setDateFilter((prev) => {
                  return {
                    ...prev,
                    [keyOfStartDate]: moment(date).startOf("day").format(dateFormat),
                    ...(new Date(date) > new Date(endDate) && {
                      [keyOfEndDate]: moment(date).endOf("day").format(dateFormat),
                    }),
                  }
                })
              }}
              disabled={value !== "custom"}
            />
          </Col>
          <Col xs={12} lg={6}>
            <MuiDatePicker
              value={endDate}
              minDate={moment(startDate)}
              onChange={(date) => {
                setEndDate(date)
                setDateFilter((prev) => {
                  return {
                    ...prev,
                    [keyOfEndDate]: moment(date).endOf("day").format(dateFormat),
                  }
                })
              }}
              disabled={value !== "custom"}
            />
          </Col>
        </Row>
      )}
    </div>
  )
}

export default SearchDate
