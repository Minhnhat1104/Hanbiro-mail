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
import { isBoolean, isEmpty } from "lodash"
import { URL_SMTP_BOXLIST, URL_SMTP_POP3, FOLDER_LIST } from "modules/mail/settings/urls"
import MailProgramSetupGuide from "../MailProgramSetupGuide"
import RadioGroup from "../RadioGroup"
import BlockInformation, { renderLanguage } from "../BlockInformation"
import { isBasicBox } from "utils"

const POP3 = ({ activeTab, countryCode, isRefresh, setIsRefresh }) => {
  const { t } = useTranslation()
  const { successToast, errorToast } = useCustomToast()

  const [pop3Info, setPop3Info] = useState(0)
  const [oldPop3Info, setOldPop3Info] = useState(0)
  const [disableServiceInfo, setDisableServiceInfo] = useState([])
  const [boxList, setBoxList] = useState(null)
  const [folderList, setFolderList] = useState([])
  const [optionsMailBox, setOptionsMailBox] = useState([])
  const [selectedMailBox, setSelectedMailBox] = useState([
    { key: "Maildir", value: "Inbox", label: "Inbox" },
  ])
  const [information, setInformation] = useState(null)
  const [isError, setIsError] = useState(false)

  const [poprangenow, setPoprangenow] = useState("n")
  const [poppdeletesync, setPoppdeletesync] = useState("n")
  const [autotrashdelete, setAutotrashdelete] = useState("n")
  const [poprangedate, setPoprangedate] = useState("")

  const smtpOptions = [
    { value: 2, title: t("mail.mail_set_pop3_use") },
    { value: 1, title: t("mail.mail_set_pop3_notuse") },
  ]

  const coverageOptions = [
    { value: "n", title: t("mail.mail_received_including_previously_received_emails") },
    { value: "y", title: t("mail.mail_from_now_on_only_incoming_emails_will_be_accepted") },
  ]

  const coverageDateOptions = [
    { value: "1d", title: renderLanguage("mail.mail_xxx_day_ago", { xxx: "1" }, t) },
    { value: "3d", title: renderLanguage("mail.mail_xxx_day_ago", { xxx: "3", day: "days" }, t) },
    { value: "1w", title: renderLanguage("mail.mail_xxx_week_ago", { xxx: "1" }, t) },
    {
      value: "3w",
      title: renderLanguage("mail.mail_xxx_week_ago", { xxx: "3", week: "weeks" }, t),
    },
    { value: "1m", title: renderLanguage("mail.mail_xxx_month_ago", { xxx: "1" }, t) },
  ]

  const originalOptions = [
    { value: "n", title: t("mail.mail_keep_the_original_in_hanbiro_mail") },
    { value: "y", title: t("mail.mail_move_to_recycle_bin_according_to_mail_program_settings") },
  ]

  const autoRecycleOptions = [
    { value: "n", title: t("mail.mail_disable_automatic_deletion") },
    {
      value: "y",
      title: t("mail.mail_automatically_delete_emails_older_than_30_days_from_the_trash"),
    },
  ]

  useEffect(() => {
    if (isRefresh && activeTab === "1") {
      getInitData()
    }
  }, [isRefresh])

  useEffect(() => {
    if (boxList && Object.entries(boxList).length) {
      let newOptions = []
      let advancedFolderObj = {}

      Object.keys(boxList).forEach((menuKey) => {
        if (isBasicBox(menuKey)) {
          newOptions.push({
            key: menuKey,
            value: boxList[menuKey],
            label: boxList[menuKey],
          })
        } else {
          advancedFolderObj[menuKey] = boxList[menuKey]
        }
      })

      if (Object.keys(advancedFolderObj)?.length > 0 && folderList?.length > 0) {
        folderList.forEach((item) => {
          const menuKey = item.id
          delete advancedFolderObj[menuKey]
          newOptions.push({
            key: menuKey,
            value: item.name,
            label: item.name,
          })
        })

        Object.entries(advancedFolderObj).forEach(([menuKey, name]) => {
          if (name.includes("/")) {
            newOptions.push({
              key: menuKey,
              value: name,
              label: name,
            })
          }
        })
      }

      setOptionsMailBox(newOptions)
    }
  }, [boxList, folderList])

  useEffect(() => {
    if (isError && !isEmpty(selectedMailBox)) {
      setIsError(false)
    }
  }, [selectedMailBox])

  const getInitData = async () => {
    await getBoxList()
    await getFolderList()
    await getPop3InfoData()
    setIsRefresh(false)
  }

  // SMTP
  const getPop3InfoData = async () => {
    try {
      const res = await emailGet(URL_SMTP_POP3, {}, Headers)
      if (res?.success) {
        // Handle data input
        setPop3Info(res?.enabled?.enabled)
        setOldPop3Info(res?.enabled?.enabled)
        setDisableServiceInfo(res?.enabled?.disableserviceinfo)

        if (res.service_info.length > 0) {
          setInformation(res.service_info)

          res.service_info.forEach((service) => {
            if (service.name == "pop3") {
              const nPoprangenow =
                service.poprangenow == "true"
                  ? "y"
                  : service.poprangenow == "false"
                  ? "n"
                  : service.poprangenow
              setPoprangenow(nPoprangenow)
              setPoppdeletesync(
                isBoolean(service.poppdeletesync) && service.poppdeletesync ? "y" : "n",
              )
              setAutotrashdelete(
                isBoolean(service.autotrashdelete) && service.autotrashdelete ? "y" : "n",
              )
              setPoprangedate(service.poprangedate)
              if (
                service.popenableboxs &&
                typeof service.popenableboxs === "object" &&
                Object.keys(service.popenableboxs).length > 0
              ) {
                let mailboxes = []
                Object.keys(service.popenableboxs).forEach((mailKey) => {
                  const nMailbox = {
                    key: mailKey,
                    value: service.popenableboxs[mailKey],
                    label: service.popenableboxs[mailKey],
                  }
                  if (nMailbox) {
                    mailboxes.push(nMailbox)
                  }
                })
                setSelectedMailBox(mailboxes)
              }
            }
          })
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

  // get folder list
  const getFolderList = async () => {
    try {
      const res = await emailGet(
        FOLDER_LIST,
        {
          reverse: "0",
          root: "source",
        },
        Headers,
      )
      if (res?.mailbox) {
        setFolderList(res?.mailbox)
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
      ...(pop3Info === 2
        ? {
            issue: true,
            popenableboxs: selectedMailBox.map((s) => s.key)?.join(","),
            poprangenow: poprangenow === "y" ? true : poprangenow === "n" ? false : poprangenow,
            popdeletesync: poppdeletesync === "y" ? true : false,
            autotrashdelete: autotrashdelete === "y" ? true : false,
          }
        : {
            isuse: pop3Info === 1 ? false : true,
            popenableboxs: optionsMailBox[0]?.key,
            poprangenow: true,
            popdeletesync: true,
            autotrashdelete: true,
          }),
    }

    try {
      const res = await emailPost(URL_SMTP_POP3, params, Headers)
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
    getPop3InfoData()
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
        {(pop3Info === 3 || pop3Info === 4) && (
          <BlockInformation
            type={"POP3"}
            issue={pop3Info}
            data={disableServiceInfo}
            countryCode={countryCode}
          />
        )}

        {/* Enable / Disable */}
        {(pop3Info === 1 || pop3Info === 2) && (
          <div className="d-flex flex-column gap-3">
            {/* --- Content --- */}
            <div>
              {/* Use SMTP/POP3 */}
              <Row>
                <Col xs={12}>
                  <RadioGroup
                    title={t("mail.mail_use_smtp_pop3")}
                    options={smtpOptions}
                    value={pop3Info}
                    onChange={(e, value) => setPop3Info(value)}
                    name="smtp-pop3"
                    radioGroupClass="ml-negative-2"
                  />
                </Col>
              </Row>

              {pop3Info === 1 && disableServiceInfo.length > 0 && (
                <Row>
                  <Col xs={12} lg={3} className="p-0"></Col>
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
                <Col xs={12} lg={3} className="p-0"></Col>
                <Col xs={12} lg={9} className="han-text-secondary">
                  {t("mail.mail_use_smtp_pop3_msg")}
                </Col>
              </Row>

              {pop3Info === 2 && (
                <>
                  {/* issue 2 */}
                  <Row>
                    <Col xs={12} lg={3} className="p-0"></Col>
                    <Col xs={12} lg={9} className="text-danger">
                      {t("mail.mail_issue_2_msg")}
                    </Col>
                  </Row>

                  {/* Select POP3 linked mailbox */}
                  <Row className="mt-3 gx-0 align-items-center">
                    <Col xs={12} lg={3} className="col-form-label">
                      {t("mail.mail_select_pop3_linked_mailbox")}
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
                  </Row>

                  {/* POP3 coverage */}
                  <Row className="mt-3">
                    <Col xs={12} className="d-flex flex-column gap-2">
                      <RadioGroup
                        title={t("mail.mail_pop3_coverage")}
                        options={coverageOptions}
                        value={poprangenow}
                        onChange={(e, value) => setPoprangenow(value)}
                        name="smtp-pop3-coverage"
                        radioGroupClass="ml-negative-2"
                      />

                      <RadioGroup
                        radioColumn={2}
                        options={coverageDateOptions}
                        value={poprangenow}
                        onChange={(e, value) => setPoprangenow(value)}
                        name="smtp-pop3-coverage"
                        radioGroupClass="ml-negative-2"
                      />

                      {poprangedate !== "" && poprangedate !== "all" && (
                        <Row>
                          <Col xs={12} lg={3} className="p-0"></Col>
                          <Col xs={12} lg={9} className="text-danger">
                            <span>
                              {renderLanguage(
                                "mail.mail_mail_received_after_xxx",
                                { xxx: poprangedate },
                                t,
                              )}
                            </span>
                          </Col>
                        </Row>
                      )}
                    </Col>
                  </Row>

                  {/* Save original */}
                  <Row className="mt-3">
                    <Col xs={12}>
                      <RadioGroup
                        title={t("mail.mail_save_original")}
                        options={originalOptions}
                        value={poppdeletesync}
                        onChange={(e, value) => setPoppdeletesync(value)}
                        name="smtp-pop3-original"
                        radioGroupClass="ml-negative-2"
                      />
                    </Col>
                  </Row>

                  {/* Automatic deletion of recycle bin */}
                  <Row className="mt-3">
                    <Col xs={12}>
                      <RadioGroup
                        title={t("mail.mail_automatic_deletion_of_recycle_bin_30_days")}
                        options={autoRecycleOptions}
                        value={autotrashdelete}
                        onChange={(e, value) => setAutotrashdelete(value)}
                        name="smtp-pop3-auto-recycle"
                        radioGroupClass="ml-negative-2"
                      />
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
      {pop3Info === 2 && oldPop3Info === 2 && (
        <MailProgramSetupGuide t={t} information={information} countryCode={countryCode} />
      )}
    </div>
  )
}

export default POP3
