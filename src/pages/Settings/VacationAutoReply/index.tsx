// @ts-nocheck
// React
import { useEffect, useMemo, useState } from "react"

// Third-party
import "flatpickr/dist/themes/material_blue.css"
import moment from "moment"
import { useTranslation } from "react-i18next"
import { Col, Collapse, InputGroup, Label, Row } from "reactstrap"

// Project
import BaseButton from "components/Common/BaseButton"
import HanDatePicker from "components/Common/HanDatePicker"
import Loading from "components/Common/Loading"
import BaseTextArea from "components/SettingAdmin/TextArea"
import ToggleSwitch from "components/SettingAdmin/Toggle/index"
import Tooltip from "components/SettingAdmin/Tooltip"
import { useCustomToast } from "hooks/useCustomToast"
import { postMailToHtml5 } from "modules/mail/common/api"
import { base64_decode, base64_encode, formatTimestampToDate } from "utils"

import MainHeader from "pages/SettingMain/MainHeader"
import "./style.scss"

const VacationAutoReply = (props) => {
  const { routeConfig } = props
  const { t } = useTranslation()
  const { successToast, errorToast } = useCustomToast()

  const strFormat = "YYYY/MM/DD HH:mm"
  const strFormat2 = "YYYY/MM/DD"

  // const [switchValue, setSwitchValue] = useState(false)
  const [isSet, setIsSet] = useState(false)
  const [data, setData] = useState({
    text: "",
    isAuto: 0,
    strDate: "",
    strStartDate: "",
    timestamp: 0,
  })
  console.log(" data:", data)

  const [fData, setFData] = useState({
    setTimeDate: moment().endOf("day").format(strFormat),
    setTimeStartDate: moment().startOf("day").format(strFormat),
    strFormat: strFormat,
    minStartDate: moment().startOf("day").format(strFormat2),
    minDate: moment().endOf("day").format(strFormat2),
  })
  const [minTime, setMinTime] = useState({
    minDate: new Date(),
    minStartDate: new Date(),
  })

  const [isLoading, setIsLoading] = useState(false)

  const getAutoReplyData = async () => {
    setIsLoading(true)
    try {
      const postParams = {
        act: "autorespond",
        mode: "read",
      }
      const res = await postMailToHtml5(postParams)
      if (res.success || res.success === "0") {
        if (typeof res.data !== "undefined") {
          const newText = typeof res.data.text !== "undefined" ? base64_decode(res.data.text) : ""
          setIsSet(true)
          if (res.data.servertime * 1 > 0) {
            // setSwitchValue(true)
            const newStrDate = formatTimestampToDate(res.data.timestamp, fData.strFormat)
            const newStrStartDate = formatTimestampToDate(res.data.startdate, fData.strFormat)
            setData({
              ...data,
              text: newText,
              isAuto: 1,
              strDate: newStrDate,
              strStartDate: newStrStartDate,
            })

            const endDate = new Date(res.data.timestamp * 1000)
            const startDate = new Date(res.data.startdate * 1000)

            setFData((prev) => ({
              ...prev,
              minDate: newStrDate,
              minStartDate: newStrStartDate,
            }))
          }
        }
        setIsLoading(false)
      }
    } catch (err) {
      errorToast()
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Call api -> Fetch data
    getAutoReplyData()
  }, [])

  // Handle save settings
  const handleSaveSettings = async (data) => {
    setIsLoading(true)
    if (data.isAuto === 1) {
      if (typeof data.text === "undefined" || data.text === "") {
        errorToast("Error<br/>Please enter the text")
        setIsLoading(false)
        return
      }
      try {
        const curStartDate = moment(
          data.strStartDate ? data.strStartDate : new Date().setHours(0, 0, 0, 0),
        ).unix()
        const curEndDate = moment(
          data.strDate ? data.strDate : new Date().setHours(23, 59, 59, 999),
        ).unix()
        if (curStartDate - curEndDate >= 0) {
          errorToast("Error<br/>Please enter the correct Start date")
          setIsLoading(false)
          return
        }

        const current = moment().unix()
        if (current > curEndDate) {
          errorToast("Error<br/>End date must not be in the past")
          setIsLoading(false)
          return
        }

        const postParams = {
          act: "autorespond",
          mode: "write",
          data: JSON.stringify({
            text: base64_encode(data.text),
            timestamp: curEndDate,
            startdate: curStartDate,
          }),
        }
        const getParam = "_autorespond=1"
        const res = await postMailToHtml5(postParams, getParam)
        if (res.success) {
          // getAutoReplyData()
          setIsSet(true)
          setFData((prev) => ({
            ...prev,
            minDate: formatTimestampToDate(curEndDate, fData.strFormat),
            minStartDate: formatTimestampToDate(curStartDate, fData.strFormat),
          }))
          successToast()
        }
      } catch (err) {
        errorToast()
      }
    } else {
      // Delete
      try {
        const postParams = {
          act: "autorespond",
          mode: "delete",
        }
        const getParam = "_autorespond=1"
        const res = await postMailToHtml5(postParams, getParam)
        if (res.success) {
          setIsSet(false)
          setData({
            ...data,
            text: "",
            timestamp: 0,
          })
          setIsSet(false)
          successToast()
        }
      } catch (err) {
        errorToast()
      }
    }
    setIsLoading(false)
  }

  const renderHeaderContent = useMemo(() => {
    return (
      <>
        <span
          dangerouslySetInnerHTML={{
            __html: isSet
              ? t("mail.mail_set_autorespond_usemsg")
              : t("mail.mail_set_autorespond_nomsg"),
          }}
        />
        <br />
        <span
          dangerouslySetInnerHTML={{
            __html: isSet
              ? ["[", t("mail.mail_log_start_date"), ": ", fData.minStartDate, "]"].join("")
              : t("mail.mail_set_autorespond_endmsg"),
          }}
        />
        <br />
        <span
          dangerouslySetInnerHTML={{
            __html: isSet
              ? ["[", t("mail.mail_set_autorespond_endtime"), ": ", fData.minDate, "]"].join("")
              : "",
          }}
        />
      </>
    )
  }, [isSet, fData.minStartDate, fData.minDate])

  return (
    <>
      {/* --- Header --- */}
      <MainHeader currentTitleMenu={t(routeConfig?.keyTitle)} />
      <Tooltip content={renderHeaderContent} />
      <div className={`w-100 h-100 overflow-hidden overflow-y-auto`}>
        <ToggleSwitch
          title={t("mail.mail_preference_autorespond")}
          col="9"
          checked={data.isAuto === 1}
          onChange={(checked) => setData({ ...data, isAuto: checked ? 1 : 0 })}
        />

        {data.isAuto === 1 && (
          <Collapse
            // isOpen={switchValue}
            isOpen={data.isAuto === 1}
            className="position-relative d-flex flex-column gap-3"
          >
            {isLoading && (
              <div className="auto-reply-loading">
                <Loading />
              </div>
            )}
            <Row>
              <Label htmlFor="taskName" className="col-form-label col-lg-3">
                {t("mail.mail_log_start_date")}
              </Label>
              <Col lg="9">
                <InputGroup>
                  <HanDatePicker
                    id="strStartDate"
                    className="form-control"
                    value={
                      data.strStartDate
                        ? moment(data.strStartDate).toDate()
                        : moment().hour(0).minute(0).second(0).millisecond(0).toDate() // start of day
                    }
                    onChange={(date) => setData({ ...data, strStartDate: date })}
                    timeIntervals={1}
                    enableTime
                    timeFormat="HH:mm"
                    dateFormat={strFormat}
                    minDate={new Date(fData.minStartDate)}
                    iconClass={"mdi mdi-clock-outline"}
                  />
                </InputGroup>
              </Col>
            </Row>
            <Row>
              <Label htmlFor="taskName" className="col-form-label col-lg-3">
                {t("mail.mail_set_autorespond_setlimit")}
              </Label>
              <Col lg="9">
                <InputGroup>
                  <HanDatePicker
                    id="strDate"
                    className="form-control"
                    value={
                      data.strDate
                        ? moment(data.strDate).toDate()
                        : moment().hour(23).minute(59).second(59).millisecond(999).toDate() // end of day
                    }
                    onChange={(date) => setData({ ...data, strDate: date })}
                    timeIntervals={1}
                    enableTime
                    timeFormat="HH:mm"
                    dateFormat={strFormat}
                    minDate={new Date(fData.minDate)}
                    iconClass={"mdi mdi-clock-outline"}
                  />
                </InputGroup>
              </Col>
            </Row>
            <Row className={``}>
              <BaseTextArea
                col={9}
                title={t("common.feedback_message")}
                value={data.text}
                onChange={(e) => setData({ ...data, text: e.target.value })}
              />
            </Row>
          </Collapse>
        )}

        {/* --- Footer --- */}
        <div className="d-flex justify-content-center">
          <BaseButton color="primary" onClick={() => handleSaveSettings(data)} loading={isLoading}>
            {t("mail.mail_set_autosplit_save")}
          </BaseButton>
        </div>
      </div>
    </>
  )
}

export default VacationAutoReply
