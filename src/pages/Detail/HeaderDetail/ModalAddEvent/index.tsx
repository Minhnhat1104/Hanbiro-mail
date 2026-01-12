// @ts-nocheck
// React
import { useContext, useEffect, useState } from "react"

// Third-party
import { useTranslation } from "react-i18next"
import { Col, FormGroup, Input, Label, Row } from "reactstrap"

// Project
import { BaseButton, BaseModal } from "components/Common"
import MuiDatePicker from "components/Common/HanDatePicker/MuiDatePicker"
import MuiDateTimePicker from "components/Common/HanDatePicker/MuiDateTimePicker"
import Loading from "components/Common/Loading"
import { get, post } from "helpers/api_helper"
import { Headers, emailGet } from "helpers/email_api_helper"
import { useCustomToast } from "hooks/useCustomToast"
import { URL_CALENDAR_WRITE_EVENT, URL_GET_LIST_CALENDAR } from "modules/mail/common/urls"
import { URL_EMAIL_TIMEZONE } from "modules/mail/compose/urls"
import moment from "moment"
import { MailContext } from "pages/Detail"
import { useSelector } from "react-redux"
import Select from "react-select"
import { getDateFormat } from "utils/dateTimeFormat"

const ModalAddEvent = ({ open = true, handleClose = () => {} }) => {
  const { mail } = useContext(MailContext)
  const { t } = useTranslation()
  const { successToast, errorToast } = useCustomToast()
  const userConfig = useSelector((state) => state.Config.userConfig)

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState({})
  const [calendar, setCalendar] = useState(null)
  const [calendarOptions, setCalendarOptions] = useState([])
  const [timezone, setTimezone] = useState(null)
  const [timezoneOptions, setTimezoneOptions] = useState([])
  const [subject, setSubject] = useState("")
  const [content, setContent] = useState("")
  const [isAllday, setIsAllday] = useState(true)
  const [startDate, setStartDate] = useState(moment().toDate())
  const [endDate, setEndDate] = useState(moment().toDate())
  console.log("startDate:", startDate, endDate)

  useEffect(() => {
    const getTimzone = async () => {
      const res = await emailGet(URL_EMAIL_TIMEZONE)
      if (res?.success) {
        setTimezoneOptions(
          res?.Rows?.map((row) => ({
            ...row,
            value: row.timezone,
            label: row.nation,
          })),
        )
      }
    }
    getTimzone()
  }, [])

  useEffect(() => {
    if (userConfig && timezoneOptions.length > 0) {
      const currentTimezone = timezoneOptions.find(
        (timezone) => timezone.value === userConfig?.country_zone,
      )
      if (currentTimezone) {
        setTimezone(currentTimezone)
      }
    }
  }, [userConfig, timezoneOptions])

  useEffect(() => {
    setIsLoading(true)
    get(URL_GET_LIST_CALENDAR).then((res) => {
      if (res?.success) {
        const options = res?.rows
          ?.filter((row) => row?.type === "my")
          ?.map((_row) => ({
            ..._row,
            value: _row?.id,
            label: _row?.name,
          }))
        setCalendarOptions(options)
        setCalendar(options?.[0] || null)
      }
      setIsLoading(false)
    })
    setSubject(mail?.subject ?? "")
    setContent(mail?.contents ?? "")
  }, [mail])

  const onSaveCalendar = () => {
    if (!subject) return

    let checkError = {}

    if (!calendar) {
      checkError["calendar"] = true
    }

    if (!isAllday && !timezone) {
      checkError["timezone"] = true
    }
    setError(checkError)
    if (Object.keys(checkError).length > 0) {
      return false
    }

    const params = {
      title: subject,
      starthour: !isAllday ? moment(startDate).format("HH") : "8",
      endhour: !isAllday ? moment(endDate).format("HH") : "10",
      startmin: !isAllday ? moment(startDate).format("mm") : "0",
      endmin: !isAllday ? moment(endDate).format("mm") : "0",
      is_all_day: isAllday,
      timezone: !isAllday ? timezone.value : userConfig?.country_zone,
      invite_sms_list: [],
      is_enabled_sms: false,
      invite_email_list: [],
      invite_email_list_input: [],
      reader_list: [],
      publicvalue: false,
      is_add_guest: false,
      ctypelist: [],
      mode: "add",
      priority: "2",
      timestatus: "3",
      start: moment(startDate).format(getDateFormat(userConfig).toUpperCase()),
      end: moment(endDate).format(getDateFormat(userConfig).toUpperCase()),
      category: calendar.value,
    }

    setIsLoading(true)
    post(URL_CALENDAR_WRITE_EVENT, { data: params }, Headers).then((res) => {
      setIsLoading(false)
      if (res.success) {
        successToast(res?.msg)
        handleClose()
      } else {
        errorToast(res?.msg)
      }
    })
  }

  const renderBody = () => {
    return (
      <div className="position-relative">
        <Row className="gy-2">
          {/* title */}
          <Col lg="12">
            <Label htmlFor="delay-sent" className="col-form-label col-lg-12">
              {t("common.calendar_subject_msg")}
            </Label>
            <Col lg="12" className="d-flex align-items-center gap-1">
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
            </Col>
          </Col>
          {/* calendar */}
          <Col lg="12">
            <Label htmlFor="delay-sent" className="col-form-label col-lg-12">
              {t("common.calendar_select_list")}
            </Label>
            <Col lg="12" className="d-flex align-items-center gap-1">
              <Select
                value={calendar}
                onChange={(value) => setCalendar(value)}
                options={calendarOptions}
                className="select2-selection w-100"
                maxMenuHeight={190}
                styles={{
                  menu: (base) => ({
                    ...base,
                    backgroundColor: "white!important",
                    zIndex: 999,
                  }),
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    borderColor: error?.calendar ? "red" : "#ced4da",
                  }),
                }}
              />
            </Col>
          </Col>
          {/* select date */}
          <Col lg="12">
            <Label htmlFor="delay-sent" className="col-form-label col-lg-12">
              {t("common.calendar_calendar_date_msg")}
            </Label>
            <Row className="gx-3 gy-3">
              <Col md="12" lg="6" className="">
                {isAllday ? (
                  <MuiDatePicker
                    value={startDate}
                    onChange={(date) => {
                      setStartDate(date)
                      if (new Date(date) > new Date(endDate)) {
                        setEndDate(date)
                      }
                    }}
                  />
                ) : (
                  <MuiDateTimePicker
                    value={startDate}
                    onChange={(date) => {
                      setStartDate(date)
                      if (new Date(date) > new Date(endDate)) {
                        setEndDate(date)
                      }
                    }}
                  />
                )}
              </Col>
              <Col md="12" lg="6" className="">
                {isAllday ? (
                  <MuiDatePicker
                    value={endDate}
                    onChange={setEndDate}
                    shouldDisableDate={(date) => date.isBefore(startDate, "day")}
                  />
                ) : (
                  <MuiDateTimePicker
                    value={endDate}
                    onChange={setEndDate}
                    shouldDisableDate={(date) => date.isBefore(startDate, "day")}
                    shouldDisableTime={(time, view) => {
                      if (view === "hours" || view === "minutes") {
                        return moment(endDate).isSame(startDate, "day") && time.isBefore(startDate)
                      }
                      return false
                    }}
                  />
                )}
              </Col>
            </Row>
          </Col>
          {/* timezone */}
          {!isAllday && (
            <Col lg="12">
              <Label htmlFor="delay-sent" className="col-form-label col-lg-12">
                {t("mail.mail_time_zone")}
              </Label>
              <Col lg="12" className="d-flex align-items-center gap-1">
                <Select
                  value={timezone}
                  onChange={(value) => setTimezone(value)}
                  options={timezoneOptions}
                  className="select2-selection w-100"
                  maxMenuHeight={190}
                  styles={{
                    menu: (base) => ({
                      ...base,
                      backgroundColor: "white!important",
                      zIndex: 999,
                    }),
                    control: (baseStyles, state) => ({
                      ...baseStyles,
                      borderColor: error?.timezone ? "red" : "#ced4da",
                    }),
                  }}
                />
              </Col>
            </Col>
          )}
          {/* use Allday */}
          <Col lg="12">
            <Label htmlFor="delay-sent" className="col-form-label col-lg-12">
              {t("common.calendar_all_day_msg")}
            </Label>
            <Col lg="12" className="d-flex align-items-center gap-1">
              <FormGroup switch className="form-switch-lg">
                <Input
                  type="switch"
                  defaultChecked={isAllday}
                  onClick={() => {
                    setIsAllday(!isAllday)
                  }}
                />
              </FormGroup>
            </Col>
          </Col>
        </Row>
        {isLoading && (
          <div className="position-absolute top-50 start-50 translate-middle">
            <Loading />
          </div>
        )}
      </div>
    )
  }

  return (
    <BaseModal
      open={open}
      toggle={() => {
        handleClose()
      }}
      modalClass="write-calendar-modal"
      renderHeader={() => <>{t("common.main_calendar_menu")}</>}
      renderBody={renderBody}
      renderFooter={() => (
        <>
          <BaseButton
            type="button"
            className="st-sg-modal-btn-save"
            color="primary"
            onClick={() => {
              onSaveCalendar()
            }}
          >
            {t("mail.mail_view_save")}
          </BaseButton>
          <BaseButton
            outline
            type="button"
            className="st-sg-modal-btn-cancel"
            color="grey"
            onClick={() => {
              handleClose()
            }}
          >
            {t("mail.mail_write_discard")}
          </BaseButton>
        </>
      )}
      footerClass="d-flex align-items-center justify-content-center"
      centered
    />
  )
}

export default ModalAddEvent
