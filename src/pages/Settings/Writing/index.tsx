// @ts-nocheck
// React
import React, { useEffect, useState } from "react"

// Third-party
import { useTranslation } from "react-i18next"
import { Card, Row, Col, FormGroup, Label } from "reactstrap"
import Select from "react-select"

// Project
import Title from "components/SettingAdmin/Title/index"
import BaseButton from "components/Common/BaseButton"
import InputSelect from "components/SettingAdmin/Inputselectwriting/index"
import Inputname from "components/SettingAdmin/Inputwriting/index"
import Inputnumber from "components/SettingAdmin/Inputnumber/index"
import { useCustomToast } from "hooks/useCustomToast"
import { Headers, emailGet, emailPost } from "helpers/email_api_helper"
import { URL_WRITE } from "modules/mail/settings/urls"
import { EMAIL_SMTP } from "modules/mail/compose/urls"
import Loading from "components/Common/Loading"
import BaseButtonTooltip from "components/Common/BaseButtonTooltip"
import MainHeader from "pages/SettingMain/MainHeader"
import Toolbar from "../../SettingMain/Toolbar"

const Writing = (props) => {
  const { routeConfig } = props
  const { t } = useTranslation()
  const { successToast, errorToast } = useCustomToast()

  // State
  const [isLoading, setIsLoading] = useState(false)
  const [name, setName] = useState("")
  const [replyTo, setReplyTo] = useState("")
  const [defaultReplyTo, setDefaultReplyTo] = useState({ label: "", value: "" })
  const [optionDefaultReplyTo, setOptionDefaultReplyTo] = useState([])
  const [delaySent, setDelaySent] = useState({ label: "", value: "" })
  const [preview, setPreview] = useState({ label: "", value: "" })
  const [forwardMe, setForwardMe] = useState({ label: "", value: "" })
  const [cipherCount, setCipherCount] = useState(0)
  const [cipherDay, setCipherDay] = useState(0)
  const [deleteDraft, setDeleteDraft] = useState({ label: "", value: "" })
  const [defaultEmail, setDefaultEmail] = useState("")

  // Handle find option of Delay Sent, Forward Me, Delete Draft
  const handleFoundOption = (optionGroup = [], data = "") => {
    if (data === "") return { label: "", value: "" }
    else {
      const foundOption = optionGroup?.find((option) => {
        return option?.options.some((item) => item.value === data)
      })
      if (foundOption) {
        const { label, value } = foundOption.options.find((item) => item.value === data)
        return { label, value }
      } else return { label: "", value: "" }
    }
  }

  // Handle find option of Preview
  const handleFoundOptionPreview = (optionGroup = [], data = "") => {
    if (data === "n") return handleFoundOption(optionGroup, "no")
    else return handleFoundOption(optionGroup, data)
  }

  const getWriteSetting = async () => {
    try {
      const res = await emailGet(URL_WRITE)
      if (Object.keys(res).length > 0) {
        setDefaultEmail(res.defaultemail)
        // Name
        setName(res.name)

        // Reply To
        setReplyTo(res.replyto)

        // Delay Sent
        setDelaySent(handleFoundOption(optionDelaySent, res.delaysent))

        // Preview
        setPreview(handleFoundOptionPreview(optionPreview, res.preview))

        // Forward Me
        setForwardMe(handleFoundOption(optionForwardMe, res.forwardme))

        // Cipher Count
        setCipherCount(res.ciphercount)

        // Cipher Day
        setCipherDay(res.cipherday)

        // Delete Draft
        setDeleteDraft(handleFoundOption(optionDeleteDraft, res.tmpdelete))
      }
    } catch (err) {
      errorToast()
    }
  }

  const getSentMailList = async () => {
    try {
      const res = await emailGet(EMAIL_SMTP)
      if (res.success) {
        const newOptions = [{ label: "", value: "" }]
        if (res?.default) {
          newOptions.push({
            label: res.default,
            value: res.default,
          })
        }
        if (res?.data?.length > 0) {
          res.data.forEach((item) => {
            newOptions.push({
              label: item,
              value: item,
            })
          })
        }
        setOptionDefaultReplyTo(newOptions)
      }
    } catch (err) {
      errorToast()
    }
  }

  const fetchData = async () => {
    setIsLoading(true)
    await getWriteSetting()
    await getSentMailList()
    setIsLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    // Default Reply To
    if (optionDefaultReplyTo.length > 0 && defaultEmail) {
      const value = optionDefaultReplyTo.find((item) => item.value.includes(defaultEmail))
      setDefaultReplyTo(value)
    }
  }, [optionDefaultReplyTo])

  const optionDelaySent = [
    {
      options: [
        { label: t("common.common_no_msg"), value: "no" },
        { label: "1", value: "1m" },
        { label: "2", value: "2m" },
        { label: "3", value: "3m" },
        { label: "4", value: "4m" },
        { label: "5", value: "5m" },
        { label: "10", value: "10m" },
        { label: "15", value: "15m" },
        { label: "20", value: "20m" },
      ],
    },
  ]

  const optionPreview = [
    {
      options: [
        {
          label: t("mail.mail_write_setting_preview_no"),
          value: "no",
          // value: "n", // no
        },
        {
          label: t("mail.mail_write_setting_preview_all"),
          value: "all",
          // value: "a", // all
        },
        {
          label: t("mail.mail_write_setting_preview_important"),
          value: "important",
          // value: "f", // important
        },
      ],
    },
  ]

  const optionForwardMe = [
    {
      options: [
        {
          label: t("mail.mail_write_setting_forwardme_no"),
          value: "no",
        },
        {
          label: t("mail.mail_write_setting_forward_me"),
          value: "forward",
        },
        {
          label: t("mail.mail_write_just_bcc"),
          value: "hideforward",
        },
      ],
    },
  ]

  const optionDeleteDraft = [
    {
      options: [
        {
          label: t("mail.mail_write_setting_tmpdelete_no"),
          value: "no",
        },
        {
          label: t("mail.mail_write_setting_tmpdelete_yes"),
          value: "yes",
        },
      ],
    },
  ]

  // Handle save settings
  const handleSaveSettings = async (
    name,
    replyTo,
    defaultReplyTo,
    delaySent,
    preview,
    forwardMe,
    cipherCount,
    cipherDay,
    deleteDraft,
  ) => {
    setIsLoading(true)
    try {
      const params = {
        name: name,
        replyto: replyTo,
        defaultemail: defaultReplyTo.value,
        delaysent: delaySent.value,
        preview: preview.value,
        forwardme: forwardMe.value,
        ciphercount: cipherCount,
        cipherday: cipherDay,
        tmpdelete: deleteDraft.value,
      }
      const res = await emailPost(URL_WRITE, params, Headers)
      if (res.success) {
        successToast()
        // fetchData()
        setIsLoading(false)
      }
    } catch (err) {
      errorToast()
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* --- Header --- */}
      <MainHeader currentTitleMenu={t(routeConfig?.keyTitle)} />
      <Toolbar
        end={
          <BaseButtonTooltip
            color="grey"
            title={t("common.org_refresh")}
            id="refresh-writing"
            iconClassName="me-0"
            icon="mdi mdi-refresh"
            className="btn-action"
            onClick={fetchData}
            loading={isLoading}
            style={{ width: "38px", height: "38px" }}
          />
        }
      />
      <div className={`w-100 h-100 overflow-hidden overflow-y-auto`}>
        {isLoading ? (
          <div className="position-relative">
            <Loading />
          </div>
        ) : (
          <div
            className="scroll-box"
            style={{ maxHeight: "calc(100vh - 260px)", overflowX: "hidden" }}
          >
            <Inputname
              title={t("common.faq_name")}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {/* <Inputname
              title={t("common.mail_set_userinfo_replyemail")}
              value={replyTo}
              onChange={(e) => setReplyTo(e.target.value)}
            /> */}
            <InputSelect
              title={t("mail.mail_write_setting_default_reply_to")}
              optionGroup={optionDefaultReplyTo}
              value={defaultReplyTo}
              onChange={(value) => setDefaultReplyTo(value)}
            />
            <Row>
              <Col lg="12">
                <FormGroup className="d-flex align-items-center" row>
                  <Label htmlFor="delay-sent" className="col-form-label col-lg-3">
                    {t("mail.mail_write_setting_delayed_sent")} ({t("common.common_minute")})
                  </Label>
                  <Col lg="9" className="d-flex align-items-center gap-1">
                    <Select
                      value={delaySent}
                      onChange={(value) => setDelaySent(value)}
                      options={optionDelaySent}
                      className="select2-selection w-100 han-h5 han-fw-400 han-text-secondary"
                      maxMenuHeight={190}
                    />
                  </Col>
                </FormGroup>
              </Col>
            </Row>
            <InputSelect
              title={t("mail.mail_write_setting_preview_before_sent")}
              optionGroup={optionPreview}
              value={preview}
              onChange={(value) => setPreview(value)}
            />
            <InputSelect
              title={t("mail.mail_write_setting_forward_to_me")}
              optionGroup={optionForwardMe}
              value={forwardMe}
              onChange={(value) => setForwardMe(value)}
            />
            <Inputnumber
              title={t("mail.mail_write_setting_cipher_openable_count")}
              value={cipherCount}
              onChange={(e) => setCipherCount(e.target.value)}
            />
            <Inputnumber
              title={t("mail.mail_write_setting_cipher_expiration_days")}
              value={cipherDay}
              onChange={(e) => setCipherDay(e.target.value)}
            />
            <InputSelect
              title={t("mail.mail_write_setting_delete_from_draft_after_sending")}
              optionGroup={optionDeleteDraft}
              value={deleteDraft}
              onChange={(value) => setDeleteDraft(value)}
            />
          </div>
        )}

        {/* --- Footer --- */}
        <BaseButton
          color="primary"
          className="my-0 mx-auto"
          onClick={() =>
            handleSaveSettings(
              name,
              replyTo,
              defaultReplyTo,
              delaySent,
              preview,
              forwardMe,
              cipherCount,
              cipherDay,
              deleteDraft,
            )
          }
          loading={isLoading}
        >
          {t("mail.mail_set_autosplit_save")}
        </BaseButton>
      </div>
    </>
  )
}
export default Writing
