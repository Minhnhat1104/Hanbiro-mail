// @ts-nocheck
// React
import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import moment from "moment"

// Third-party
import { FormGroup, Label, Col, Input } from "reactstrap"

// Project
import BaseButton from "components/Common/BaseButton"
import { emailGet } from "helpers/email_api_helper"
import { BaseModal } from "components/Common"
import IdAutoComplete from "components/SettingAdmin/IdAutoComplete"
import HanDatePicker from "components/Common/HanDatePicker"
import { FORWARDING_RESIGNEE_MAIL } from "modules/mail/admin/url"
import { vailForwardMail } from "utils"
import "react-datepicker/dist/react-datepicker.css"
import MuiDateTimePicker from "components/Common/HanDatePicker/MuiDateTimePicker"

const AddForm = (props) => {
  const { isOpen, toggleForm, itemUpdate, handleUpdate } = props
  const { t } = useTranslation()

  const [emails, setEmails] = useState("")
  const [invalid, setInvalid] = useState(false)
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const today = moment()

  const [user, setUser] = useState({})

  const valid = vailForwardMail(emails)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await emailGet(`${FORWARDING_RESIGNEE_MAIL}/view/${itemUpdate}`)
        setStartDate(formatDate(res?.data?.start))
        setEndDate(formatDate(res?.data?.end))
        setEmails(res?.data?.fmails)
      } catch (err) {
        console.log("error messenger", err)
      }
    }
    if (itemUpdate) fetchData()
  }, [])

  // return date time to Date
  const formatDate = (value) => {
    if (value) {
      const currentYear = moment().format("YYYY")
      let formatTime = ""
      switch (value.length) {
        case 5:
          formatTime = new Date(`${moment(today).format("MM/DD/YYYY")} ${value}`)
          break
        case 11:
          formatTime = new Date(`${value.slice(0, 5)}/${currentYear} ${value.slice(6)}`)
          break
        case 16:
          formatTime = new Date(value)
          break
      }
      return formatTime
    }

    return null
  }

  const startDateChange = (date) => {
    setStartDate(date)
  }
  const endDateChange = (date) => {
    setEndDate(date)
  }

  const headerModal = () => {
    return <div>{t("mail.mail_retired_forward_title")}</div>
  }
  const bodyModal = () => {
    return (
      <div>
        <IdAutoComplete
          user={user}
          setUser={setUser}
          title={t("mail.mail_fetching_id")}
          idUpdate={itemUpdate}
          classForm={"mb-4"}
          pageSize={20}
        />
        <FormGroup className="mb-4" row>
          <Label className="col-form-label col-lg-3">{t("common.hr_pri_email")}</Label>
          <Col lg="9">
            <Input
              id="taskname"
              name="taskname"
              type="text"
              value={emails}
              className="form-control"
              placeholder={"a@a.com,b@b.com"}
              onChange={(e) => setEmails(e.target.value)}
              invalid={!valid?.status && invalid}
            />
          </Col>
        </FormGroup>

        <FormGroup className="mb-4" row>
          <Label className="col-form-label col-lg-3">{t("mail.mail_ical_start_date")}</Label>
          <Col lg="9">
            {/* <HanDatePicker
              className="form-control"
              value={startDate}
              onChange={startDateChange}
              showTimeInput
              dateFormat="MM/dd/yyyy HH:mm"
              timeFormat="HH:mm"
              minDate={itemUpdate ? undefined : today}
              timeIntervals={15}
              timeInputLabel="Time:"
            /> */}
            <MuiDateTimePicker
              value={startDate}
              onChange={startDateChange}
              timeSteps={{ minutes: 1 }}
              minDate={itemUpdate ? moment(startDate) : today}
            />
          </Col>
        </FormGroup>
        <FormGroup className="mb-4" row>
          <Label className="col-form-label col-lg-3">{t("mail.mail_ical_end_date")}</Label>
          <Col lg="9">
            {/* <HanDatePicker
              className="form-control"
              value={endDate}
              onChange={endDateChange}
              showTimeInput
              dateFormat="MM/dd/yyyy HH:mm"
              timeFormat="HH:mm"
              minDate={itemUpdate ? undefined : today}
              timeIntervals={15}
              timeInputLabel="Time:"
            /> */}
            <MuiDateTimePicker
              value={endDate}
              onChange={endDateChange}
              timeSteps={{ minutes: 1 }}
              minDate={itemUpdate ? moment(startDate) : today}
            />
          </Col>
        </FormGroup>
      </div>
    )
  }

  const footerModal = () => {
    return (
      <div className="action-form">
        <BaseButton
          color={"primary"}
          type="button"
          onClick={() => {
            setInvalid(true)
            if (user?.id && valid?.status) {
              handleUpdate(user?.id, emails, startDate, endDate, today, "MM/DD/YYYY HH:mm")
            }
          }}
        >
          {t("common.admin_save_msg")}
        </BaseButton>
        <BaseButton color={"secondary"} type="button" onClick={toggleForm}>
          {t("common.admin_cancel_msg")}
        </BaseButton>
      </div>
    )
  }

  return (
    <>
      <BaseModal
        isOpen={isOpen}
        toggle={toggleForm}
        centered
        renderHeader={headerModal}
        renderBody={bodyModal}
        renderFooter={footerModal}
      />
    </>
  )
}

export default AddForm
