// @ts-nocheck
// React
import { useEffect, useState } from "react"

// Third-party
import { useTranslation } from "react-i18next"
import { Col, Row } from "reactstrap"

// Project
import { BaseButton } from "components/Common"
import Loading from "components/Common/Loading"
import BaseInput from "components/SettingAdmin/Inputselectwriting"
import { Headers, emailGet, emailPost } from "helpers/email_api_helper"
import { useCustomToast } from "hooks/useCustomToast"
import { URL_SMTP_BOXLIST, URL_SMTP_IMAP } from "modules/mail/settings/urls"
import MailProgramSetupGuide from "../MailProgramSetupGuide"
import RadioGroup from "../RadioGroup"
import { isEmpty } from "lodash"
import BlockInformation from "../BlockInformation"

const IMAP = ({ activeTab, countryCode, isRefresh, setIsRefresh }) => {
  const { t } = useTranslation()
  const { successToast, errorToast } = useCustomToast()

  const [imapInfo, setImapInfo] = useState(0)
  const [oldImapInfo, setOldImapInfo] = useState(0)
  const [disableServiceInfo, setDisableServiceInfo] = useState([])
  const [boxList, setBoxList] = useState(null)
  const [optionsMailBox, setOptionsMailBox] = useState([])
  const [selectedMailBox, setSelectedMailBox] = useState([
    { key: "Spam", value: "Spam", label: "Spam" },
  ])
  const [information, setInformation] = useState(null)
  const [isError, setIsError] = useState(false)

  const [imapboxsize, setImapboxsize] = useState(0)

  const smtpOptions = [
    { value: 2, title: t("mail.mail_set_pop3_use") },
    { value: 1, title: t("mail.mail_set_pop3_notuse") },
  ]

  const folderRestrictions = [
    { value: 1000, title: "1000" },
    { value: 2000, title: "2000" },
    { value: 3000, title: "3000" },
    { value: 0, title: "5000" }, // GQ-333089
  ]

  useEffect(() => {
    if (isRefresh && activeTab === "2") {
      getInitData()
    }
  }, [isRefresh, activeTab])

  useEffect(() => {
    if (boxList && Object.entries(boxList).length) {
      const newBoxList = Object.entries(boxList).map(([key, value]) => ({
        key: key,
        value: value,
        label: value,
      }))
      setOptionsMailBox(newBoxList)
    }
  }, [boxList])

  useEffect(() => {
    if (isError && !isEmpty(selectedMailBox)) {
      setIsError(false)
    }
  }, [selectedMailBox])

  const getInitData = async () => {
    await getBoxList()
    await getimapInfoData()
    setIsRefresh(false)
  }

  // SMTP
  const getimapInfoData = async () => {
    try {
      const res = await emailGet(URL_SMTP_IMAP, {}, Headers)
      if (res?.success) {
        // Handle data input
        setImapInfo(res?.enabled?.enabled)
        setOldImapInfo(res?.enabled?.enabled)
        setDisableServiceInfo(res?.enabled?.disableserviceinfo)

        if (res.service_info.length > 0) {
          setInformation(res.service_info)

          res.service_info.forEach((service) => {
            setImapboxsize(service.imapboxsize)

            if (service.name == "imap") {
              if (
                service.imapdisableboxs &&
                typeof service.imapdisableboxs === "object" &&
                Object.keys(service.imapdisableboxs).length > 0
              ) {
                let mailboxes = []
                Object.keys(service.imapdisableboxs).forEach((mailKey) => {
                  const nMailbox = {
                    key: mailKey,
                    value: service.imapdisableboxs[mailKey],
                    label: service.imapdisableboxs[mailKey],
                  }
                  if (nMailbox) {
                    mailboxes.push(nMailbox)
                  }
                })
                setSelectedMailBox(mailboxes)
              }
            }
          })
        } else {
          setInformation(null)
        }
      }
    } catch (err) {
      console.log("err:", err)
      errorToast()
    }
  }

  // get box list
  const getBoxList = async () => {
    try {
      const res = await emailGet(URL_SMTP_BOXLIST, {}, Headers)
      if (res?.success) {
        // Handle data input
        setBoxList(res?.boxlist)
      }
    } catch (error) {
      errorToast()
    }
  }

  // Handle save settings
  const handleSave = async () => {
    if (isEmpty(selectedMailBox)) {
      setIsError(true)
      return
    }
    const params = {
      ...(imapInfo === 2
        ? {
            issue: true,
            imapdisableboxs: "Spam",
            imapboxsize,
          }
        : {
            isuse: imapInfo === 1 ? false : true,
            popenableboxs: "Spam",
            imapboxsize: 1000,
          }),
    }

    try {
      const res = await emailPost(URL_SMTP_IMAP, params, Headers)
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
    getimapInfoData()
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
        {(imapInfo === 3 || imapInfo === 4) && (
          <BlockInformation
            type={"IMAP"}
            issue={imapInfo}
            data={disableServiceInfo}
            countryCode={countryCode}
          />
        )}

        {/* Enable / Disable */}
        {/* (imapInfo === 1 || imapInfo === 2) */}
        {(imapInfo === 1 || imapInfo === 2) && (
          <div className="d-flex flex-column gap-3">
            {/* --- Content --- */}
            <div>
              {/* Use SMTP/IMAP */}
              <Row>
                <Col xs={12}>
                  <RadioGroup
                    value={imapInfo}
                    name="smtp-imap"
                    options={smtpOptions}
                    title={t("mail.mail_use_smtp_pop3")?.replace("POP3", "IMAP")}
                    onChange={(e, value) => setImapInfo(value)}
                    radioGroupClass="ml-negative-2"
                  />
                </Col>
              </Row>

              {imapInfo === 1 && disableServiceInfo.length > 0 && (
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
                  {t("mail.mail_use_smtp_pop3_msg")}
                </Col>
              </Row>

              {imapInfo === 2 && (
                <>
                  {/* issue 2 */}
                  <Row>
                    <Col xs={12} lg={3}></Col>
                    <Col xs={12} lg={9} className="text-danger">
                      {t("mail.mail_issue_2_msg")}
                    </Col>
                  </Row>

                  {/* Select IMAP-excluded mailboxes - GQ-333089 */}
                  {/* <Row className="mt-3 gx-0 align-items-center">
                    <Col xs={12} lg={3} className="col-form-label">
                      {t("mail.mail_select_imap_excluded_mailboxes")}
                    </Col>
                    <Col xs={12} lg={9} className="text-danger">
                      <BaseInput
                        optionGroup={optionsMailBox}
                        value={selectedMailBox}
                        onChange={(data) => setSelectedMailBox(data)}
                        isMulti={true}
                        maxMenuHeight={200}
                        col={12}
                        formClass={"mb-0"}
                      />
                      {isError && (
                        <span className="text-danger mt-1">{t("common.alert_data_empty")}</span>
                      )}
                    </Col>
                  </Row> */}

                  {/* IMAP folder restrictions */}
                  <Row className="mt-3">
                    <Col xs={12}>
                      <RadioGroup
                        radioColumn={2}
                        value={imapboxsize}
                        name="smtp-imap-box-size"
                        options={folderRestrictions}
                        title={t("mail.mail_imap_folder_restrictions")}
                        onChange={(e, value) => setImapboxsize(value)}
                        radioGroupClass="ml-negative-2"
                      />
                    </Col>
                  </Row>

                  {/* issue 2 */}
                  <Row>
                    <Col xs={12} lg={3}></Col>
                    <Col xs={12} lg={9} className="han-text-secondary">
                      <span
                        dangerouslySetInnerHTML={{ __html: t("mail.mail_is_smtp_issue_2_msg") }}
                      ></span>
                    </Col>
                  </Row>
                </>
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
      {imapInfo === 2 && oldImapInfo === 2 && (
        <MailProgramSetupGuide t={t} information={information} />
      )}
    </div>
  )
}

export default IMAP
