// @ts-nocheck
// React
import React, { useEffect, useRef, useState } from "react"

// Third-party
import { useTranslation } from "react-i18next"
import { Card, Col, Form, FormGroup, Input, InputGroup, Label, Row } from "reactstrap"
import Flatpickr from "react-flatpickr"
import "flatpickr/dist/themes/material_blue.css"

// Project
import BaseButton from "components/Common/BaseButton"
import BaseInput from "components/SettingAdmin/Input"
import RadioButton from "components/Common/Form/RadioButton"
import { useCustomToast } from "hooks/useCustomToast"
import { Headers, emailPost } from "helpers/email_api_helper"
import Loading from "components/Common/Loading"

import "components/SettingAdmin/Tabs/style.css"
import { URL_SPAM_REPORT } from "modules/mail/settings/urls"

const SpamReport = ({ data = null, smtpOptions = [], isLoading = false, setIsLoading }) => {
  const { t } = useTranslation()
  const { successToast, errorToast } = useCustomToast()

  const [status, setStatus] = useState("y")
  const [repeat, setRepeat] = useState(0)
  const [etime, setEtime] = useState("")
  const [stime, setStime] = useState("")
  const [maxEmail, setMaxEmail] = useState(0)

  const dataRef = useRef(null)

  useEffect(() => {
    data?.isuse === "true" ? setStatus("y") : setStatus("n")
    data?.repeat ? setRepeat(data?.repeat) : setRepeat(0)
    data?.etime ? setEtime(data?.etime) : setEtime("")
    data?.stime ? setStime(data?.stime) : setStime("")
    data?.maxemail ? setMaxEmail(data?.maxemail) : setMaxEmail(0)

    dataRef.current = { ...data }
  }, [data])

  // Handle save settings
  const handleSave = async (repeat, status, stime, maxEmail, etime) => {
    setIsLoading(true)
    try {
      const res = await emailPost(
        URL_SPAM_REPORT,
        {
          repeat: isNaN(parseInt(repeat)) ? "" : repeat,
          isuse: status,
          stime: stime,
          maxemail: isNaN(parseInt(maxEmail)) ? "" : maxEmail,
          etime: etime,
        },
        Headers,
      )
      if (res.success) {
        successToast()
        dataRef.current = {
          repeat: repeat,
          isuse: status === "y" ? "true" : "false",
          stime: stime,
          maxemail: maxEmail,
          etime: etime,
        }
      } else {
        errorToast(`Error<br/>${res.msg}`)
      }
      setIsLoading(false)
    } catch (err) {
      errorToast()
      setIsLoading(false)
    }
  }

  // Handle reset settings
  const handleReset = () => {
    setStatus(dataRef.current?.isuse === "true" ? "y" : "n")
    setRepeat(dataRef.current?.repeat ? dataRef.current?.repeat : 0)
    setEtime(dataRef.current?.etime ? dataRef.current?.etime : "")
    setStime(dataRef.current?.stime ? dataRef.current?.stime : "")
    setMaxEmail(dataRef.current?.maxemail ? dataRef.current?.maxemail : 0)
  }

  return (
    <div className="position-relative">
      <div className="mb-0">
        {/* --- Content --- */}
        <div className="SpamReport-radio">
          <RadioButton
            title={t("common.feedback_status")}
            options={smtpOptions}
            value={status}
            onChange={(e, value) => setStatus(value)}
            radioGroupClass="ml-negative-2"
            name="status-spam-report"
          />
        </div>
        <Row>
          <Col lg="12">
            <FormGroup row>
              <Label htmlFor="time-interval" className="col-form-label col-lg-2">
                {t("mail.mail_spam_settings_interval")}
              </Label>
              <Col lg="10" className="d-flex align-items-center gap-1">
                <Input
                  id="time-interval"
                  name="time-interval"
                  type="text"
                  value={repeat}
                  className="form-control"
                  onChange={(e) => setRepeat(e.target.value)}
                />
                M
              </Col>
            </FormGroup>
          </Col>
        </Row>
        <BaseInput
          title={t("mail.mail_spam_settings_maximum_number_of_mail")}
          value={maxEmail}
          onChange={(e) => setMaxEmail(e.target.value)}
        />
        <Form action="#">
          <FormGroup className="select-time" row>
            <Label className="col-form-label col-lg-2">
              {t("mail.mail_spam_settings_reception_time")}
            </Label>
            <Col lg="10">
              <Row className="gy-2">
                <Col md={6} className="pr-0">
                  <InputGroup>
                    <Flatpickr
                      className="form-control d-block"
                      value={stime}
                      options={{
                        enableTime: true,
                        noCalendar: true,
                        time_24hr: true,
                        dateFormat: "H:i",
                        minuteIncrement: 1,
                      }}
                      onChange={([date]) => {
                        const newDate = new Date(date)
                        setStime(
                          [
                            newDate.getHours(),
                            newDate.getMinutes() === 0 ? "00" : newDate.getMinutes(),
                          ].join(":"),
                        )
                      }}
                    />
                    <div className="input-group-append">
                      <span className="input-group-text">
                        <i className="mdi mdi-clock-outline" />
                      </span>
                    </div>
                  </InputGroup>
                </Col>
                <Col md={6} className="pl-0">
                  <InputGroup>
                    <Flatpickr
                      className="form-control d-block"
                      value={etime}
                      options={{
                        enableTime: true,
                        noCalendar: true,
                        time_24hr: true,
                        dateFormat: "H:i",
                        minuteIncrement: 1,
                      }}
                      onChange={([date]) => {
                        const newDate = new Date(date)
                        setEtime(
                          [
                            newDate.getHours(),
                            newDate.getMinutes() === 0 ? "00" : newDate.getMinutes(),
                          ].join(":"),
                        )
                      }}
                    />
                    <div className="input-group-append">
                      <span className="input-group-text">
                        <i className="mdi mdi-clock-outline" />
                      </span>
                    </div>
                  </InputGroup>
                </Col>
              </Row>
            </Col>
          </FormGroup>
        </Form>

        {/* --- Footer --- */}
        <div className="d-flex justify-content-center align-items-center p-2">
          <BaseButton
            color="primary"
            className="me-2"
            type="button"
            onClick={() => handleSave(repeat, status, stime, maxEmail, etime)}
          >
            {t("mail.mail_view_save")}
          </BaseButton>
          <BaseButton color="grey" className={"btn-action"} type="button" onClick={handleReset}>
            {t("mail.project_reset_msg")}
          </BaseButton>
        </div>
      </div>

      {isLoading && (
        <div className="position-absolute top-50 start-50 translate-middle">
          <Loading />
        </div>
      )}
    </div>
  )
}

export default SpamReport
