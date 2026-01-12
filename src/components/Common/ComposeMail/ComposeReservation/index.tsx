// @ts-nocheck
// React
import { useEffect, useState } from "react"

// Third-party
import moment from "moment/moment"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { Alert, Button, Col, FormGroup, Input, Label } from "reactstrap"

// Project
import BaseModal from "components/Common/BaseModal"
import HanDatePicker from "components/Common/HanDatePicker"
import BaseSelect from "components/SettingAdmin/Inputselectwriting"
import BaseInput from "components/SettingAdmin/Inputwriting"

import { emailGet } from "helpers/email_api_helper"
import { useCustomToast } from "hooks/useCustomToast"
import { URL_EMAIL_TIMEZONE } from "modules/mail/compose/urls"
import { formatDateTime } from "utils"

import MuiDateTimePicker from "components/Common/HanDatePicker/MuiDateTimePicker"
import { CustomStyles, MAX_HEIGHT_MENU } from "../ComposeComponent/Body"

const COL_LAYOUT = 9

const ComposeReservation = ({
  handleClose = () => {},
  onSave = (data = { timezone: "", sendDate: "", delayDays: 0 }) => null,
  currentTimezone,
  sendDate,
  delayDays,
}) => {
  const { t } = useTranslation()
  const { errorToast } = useCustomToast()

  const { country_zone, time_zone } = useSelector((state) => state.Config.userConfig)

  const [reservation, setReservation] = useState("Date")
  const [timeZone, setTimeZone] = useState(currentTimezone)
  const [optionsTimeZone, setOptionsTimeZone] = useState([
    {
      label: "",
      value: "",
      gmt: "",
      nation: "",
    },
  ])
  const [startDate, setStartDate] = useState(sendDate ? new Date(sendDate) : new Date())
  const [days, setDays] = useState(delayDays || 0)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await emailGet(URL_EMAIL_TIMEZONE)
        if (res?.success && res?.Rows.length > 0) {
          const findTimeZone = res?.Rows.find(
            (row) => row?.timezone === country_zone && row?.gmt === time_zone,
          )

          if (!currentTimezone) {
            setTimeZone({
              label: `GMT ${findTimeZone?.gmt} (${findTimeZone?.timezone})`,
              value: findTimeZone?.timezone,
              gmt: findTimeZone?.gmt,
              nation: findTimeZone?.nation,
            })
          }

          const newOptionsTimeZone = res?.Rows.map((row) => ({
            label: `${row?.gmt} ${row?.timezone}`,
            value: row?.timezone,
            gmt: row?.gmt,
            nation: row?.nation,
          }))

          setOptionsTimeZone(newOptionsTimeZone)
        }
      } catch (err) {
        errorToast()
      }
    }

    fetchData()
  }, [])

  // Handle change startDate
  const handleChangeStartDate = (date) => setStartDate(date)

  const handleSave = () => {
    onSave({
      timezone: timeZone,
      sendDate: formatDateTime(startDate),
      delayDays: days,
    })
  }

  const renderBody = () => {
    return (
      <>
        <FormGroup className="d-flex align-items-center" row>
          <Label className={`col-form-label col-lg-${12 - COL_LAYOUT}`}>
            {t("mail.mail_secure_type_reservation")}
          </Label>
          <Col lg={COL_LAYOUT} className="st-fet-radio">
            <div>
              <Label check className="me-4">
                <Input
                  type="radio"
                  name="radio1"
                  checked={reservation === "Date"}
                  onChange={() => {}}
                  onClick={() => setReservation("Date")}
                />{" "}
                By Date
              </Label>
              <Label check>
                <Input
                  type="radio"
                  name="radio2"
                  checked={reservation === "Day"}
                  onChange={() => {}}
                  onClick={() => setReservation("Day")}
                />{" "}
                By Day
              </Label>
            </div>
          </Col>
        </FormGroup>
        <BaseSelect
          title={t("mail.mail_time_zone")}
          optionGroup={optionsTimeZone}
          onChange={(value) =>
            setTimeZone({
              label: `GMT ${value?.gmt} (${value?.value})`,
              value: value?.value,
              gmt: value?.gmt,
              nation: value?.nation,
            })
          }
          value={timeZone}
          col={COL_LAYOUT}
          maxMenuHeight={MAX_HEIGHT_MENU}
          stylesSelect={{
            ...CustomStyles,
            control: (base) => ({
              ...base,
              borderTopRightRadius: "4px",
              borderBottomRightRadius: "4px",
            }),
          }}
        />
        {reservation === "Date" ? (
          <FormGroup className="mb-4" row>
            <Label className={`col-form-label col-lg-${12 - COL_LAYOUT}`}>
              {t("mail.mail_revervation_time")}
            </Label>
            <Col lg={COL_LAYOUT}>
              <MuiDateTimePicker value={startDate} onChange={handleChangeStartDate} />
            </Col>
          </FormGroup>
        ) : (
          <>
            <FormGroup className="mb-4" row>
              <Label className={`col-form-label col-lg-${12 - COL_LAYOUT}`}>
                {t("mail.mail_reservation_start_date")}
              </Label>
              <Col lg={COL_LAYOUT}>
                <MuiDateTimePicker value={startDate} onChange={handleChangeStartDate} />
              </Col>
            </FormGroup>
            <BaseInput
              // title={"Days"}
              title={t("mail.mail_reservation_day_from_start_date")}
              note={"Days..."}
              col={COL_LAYOUT}
              mbForm="mb-form"
              value={days}
              onChange={(event) => setDays(event.target.value)}
              type="number"
            />
            <Col lg="12" className="d-flex align-items-center">
              <Col lg={`${12 - COL_LAYOUT}`}></Col>
              <Col lg={COL_LAYOUT} className="ml-checkbox mt-2 d-flex">
                <span className="mb-0 mx-1">
                  The number of days from start date that mail will be delivered
                </span>
              </Col>
            </Col>
            <Alert className="mt-3 mb-0">
              {t("mail.mail_d_day")} ({t("mail.mail_reservation_send_time")}) :{" "}
              {/* {formatDateTime(startDate, days)} */}
              {moment(formatDateTime(startDate, days)).format("YYYY/MM/DD hh:mm A")}
            </Alert>
          </>
        )}
      </>
    )
  }

  return (
    <BaseModal
      size="lg"
      open={true}
      renderHeader={() => <>{t("mail.mail_secure_type_reservation")}</>}
      renderBody={renderBody}
      renderFooter={() => (
        <>
          <Button outline color="grey" onClick={handleClose}>
            {t("common.common_cancel")}
          </Button>
          <Button color="primary" onClick={handleSave}>
            {t("common.common_btn_save")}
          </Button>
        </>
      )}
      footerClass="d-flex align-items-center justify-content-center"
      toggle={handleClose}
      centered
    />
  )
}

export default ComposeReservation
