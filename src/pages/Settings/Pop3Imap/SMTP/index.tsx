// @ts-nocheck
// React
import { useEffect, useState } from "react"

// Third-party
import { useTranslation } from "react-i18next"
import { Col, Row } from "reactstrap"

// Project
import { BaseButton } from "components/Common"
import Loading from "components/Common/Loading"
import { Headers, emailGet, emailPost } from "helpers/email_api_helper"
import { useCustomToast } from "hooks/useCustomToast"
import { isEmpty } from "lodash"
import { URL_SMTP_IMAP, URL_SMTP_SMTP } from "modules/mail/settings/urls"
import MailProgramSetupGuide from "../MailProgramSetupGuide"
import RadioGroup from "../RadioGroup"
import BlockInformation, { renderLanguage } from "../BlockInformation"

const SMTP = ({ activeTab, countryCode, isRefresh, setIsRefresh }) => {
  const { t } = useTranslation()
  const { successToast, errorToast } = useCustomToast()

  const [smtpInfo, setSmtpInfo] = useState(0)
  const [oldSmtpInfo, setOldSmtpInfo] = useState(0)
  const [disableServiceInfo, setDisableServiceInfo] = useState([])
  const [information, setInformation] = useState(null)

  const smtpOptions = [
    { value: 2, title: t("mail.mail_set_pop3_use") },
    { value: 1, title: t("mail.mail_set_pop3_notuse") },
  ]

  useEffect(() => {
    if (isRefresh && activeTab === "3") {
      getInitData()
    }
  }, [isRefresh, activeTab])

  const getInitData = async () => {
    await getSmtpInfoData()
    setIsRefresh(false)
  }

  // SMTP
  const getSmtpInfoData = async () => {
    try {
      const res = await emailGet(URL_SMTP_SMTP, {}, Headers)
      if (res?.success) {
        // Handle data input
        setSmtpInfo(res?.enabled?.enabled)
        setOldSmtpInfo(res?.enabled?.enabled)
        setDisableServiceInfo(res?.enabled?.disableserviceinfo)

        if (res.service_info.length > 0) {
          setInformation(res.service_info)
        } else {
          setInformation(null)
        }
      }
    } catch (err) {
      console.log("err:", err)
      errorToast()
    }
  }

  // Handle save settings
  const handleSave = async () => {
    const params = {
      ...(smtpInfo === 2
        ? {
            issue: true,
          }
        : {
            isuse: smtpInfo === 1 ? false : true,
          }),
    }

    try {
      const res = await emailPost(URL_SMTP_SMTP, params, Headers)
      if (res?.success) {
        successToast()
        handleReset()
      }
    } catch (err) {
      errorToast()
    }
  }

  // Handle reset settings
  const handleReset = () => {
    getSmtpInfoData()
  }

  return (
    <div className="d-flex flex-column gap-3">
      {/* loading */}
      {isRefresh && (
        <div className="w-100 position-absolute top-0 start-0" style={{ height: "75vh" }}>
          <Loading />
        </div>
      )}

      <div className="d-flex flex-column gap-3">
        {/* Block information */}
        {(smtpInfo === 3 || smtpInfo === 4) && (
          <BlockInformation
            type={"SMTP"}
            issue={smtpInfo}
            data={disableServiceInfo}
            countryCode={countryCode}
          />
        )}

        {/* Enable / Disable */}
        {(smtpInfo === 1 || smtpInfo === 2) && (
          <div className="d-flex flex-column gap-3">
            {/* --- Content --- */}
            <div>
              {/* Use SMTP */}
              <Row>
                <Col xs={12}>
                  <RadioGroup
                    value={smtpInfo}
                    name="smtp-smtp"
                    options={smtpOptions}
                    title={renderLanguage("mail.mail_use_xxx", { xxx: "SMTP" }, t)}
                    onChange={(e, value) => setSmtpInfo(value)}
                    radioGroupClass="ml-negative-2"
                  />
                </Col>
              </Row>

              {smtpInfo === 1 && disableServiceInfo.length > 0 && (
                <Row>
                  <Col xs={12} lg={3} className="p-0 m-0"></Col>
                  <Col xs={12} lg={9}>
                    <Row>
                      <Col xs={6}>{t("mail.mail_deactivate_service")}</Col>
                      <Col xs={6}>
                        {/* SMTP (Deactivation date and time : 03/09/2024 10:48:20) */}
                        {disableServiceInfo?.map((item) => (
                          <span key={item.name} className="d-inline-block">
                            <span className="text-uppercase">{item.name} </span>
                            <span>{`(${t("mail.mail_deactivation_date_and_time")} : ${
                              item?.date
                            })`}</span>
                          </span>
                        ))}
                      </Col>
                    </Row>
                  </Col>
                </Row>
              )}

              <Row>
                <Col xs={12} lg={3}></Col>
                <Col xs={12} lg={9} className="han-text-secondary">
                  {t("mail.mail_is_smtp_msg")}
                </Col>
              </Row>

              {smtpInfo === 2 && (
                <Row>
                  <Col xs={12} lg={3}></Col>
                  <Col xs={12} lg={9} className="text-danger">
                    {t("mail.mail_issue_2_msg")}
                  </Col>
                </Row>
              )}
            </div>
            {/* --- Footer --- */}
            <div className="d-flex justify-content-center gap-2">
              <BaseButton color="primary" onClick={handleSave}>
                {t("mail.mail_set_autosplit_save")}
              </BaseButton>
              <BaseButton className={"btn-action"} color="grey" onClick={handleReset}>
                {t("mail.project_reset_msg")}
              </BaseButton>
            </div>
          </div>
        )}
      </div>

      {/* Mail program setup guide */}
      {smtpInfo === 2 && oldSmtpInfo === 2 && (
        <MailProgramSetupGuide type={"smtp"} t={t} information={information} />
      )}
    </div>
  )
}

export default SMTP
