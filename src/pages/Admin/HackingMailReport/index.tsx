// @ts-nocheck
import React, { useEffect, useState } from "react"
import { Card } from "reactstrap"
import { Title } from "components/SettingAdmin"
import { useTranslation } from "react-i18next"
import BaseButton from "components/Common/BaseButton"
import Tooltip from "components/SettingAdmin/Tooltip"
import LabelText from "components/SettingAdmin/InputWithLabel"
import {
  Headers,
  emailDelete,
  emailGet,
  emailPost,
} from "helpers/email_api_helper"
import { useCustomToast } from "hooks/useCustomToast"
import {
  getHackingMails,
  removeHackingMails,
  updateHackingMails,
} from "modules/mail/admin/api"
import MainHeader from "pages/SettingMain/MainHeader"

const HackingMailReport = props => {
  const { routeConfig } = props
  const { t } = useTranslation()
  const { successToast, errorToast } = useCustomToast()

  const [oldEmails, setOldEmails] = useState([])
  const [newEmails, setNewEmails] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await getHackingMails()
      if (res.success) {
        setOldEmails(res.ids)
        setNewEmails(res.ids)
      } else {
        throw new Error(res.msg)
      }
    } catch (err) {
      errorToast(err)
    }
    setLoading(false)
  }

  const handleEmailChange = (index, e) => {
    const updatedEmails = [...newEmails]
    updatedEmails[index] = e.target.value
    setNewEmails(updatedEmails)
  }
  const handleRemoveEmail = index => {
    const updatedEmails = [...newEmails]
    removeHackingMail(updatedEmails[index])
  }

  const removeHackingMail = async mail => {
    const params = {
      mails: mail,
    }
    const res = await removeHackingMails(params)
    res.success ? setNewEmails(res.mails) : errorToast(res.msg)
  }

  const handleSave = async () => {
    setLoading(true)
    try {
      const value = newEmails.filter(item => item !== "").join(",")
      const params = {
        mails: value,
      }
      const result = oldEmails.filter(item => !newEmails.includes(item))
      if (result.length > 0) {
        const paramsDelete = result.join(",")
        removeHackingMail(paramsDelete)
      }
      const res = await updateHackingMails(params)
      if (res.success) {
        fetchData()
      } else {
        throw new Error(res.msg)
      }
      if (result.length > 0) {
      }
      // successToast()
    } catch (err) {
      errorToast(err)
    }
    setLoading(false)
  }

  const renderedEmails = Array.from({ length: 5 }, (_, index) => {
    const emailValue = index < newEmails.length ? newEmails[index] : ""
    return (
      <LabelText
        key={index}
        title={`${t("mail.mail_email_address")} ${index + 1}`}
        col={10}
        type="email"
        iconColor={"text-secondary"}
        icon={"mdi mdi-window-close"}
        value={emailValue}
        onChange={e => {
          handleEmailChange(index, e)
        }}
        onClick={() => {
          handleRemoveEmail(index)
        }}
      />
    )
  })
  return (
    <Card className="py-3 px-5 border-0">
      <MainHeader currentTitleMenu={routeConfig?.keyTitle} />
      <Tooltip
        content={`${t("mail.mail_report_recipient_settings")} (${t(
          "mail.mail_up_to_5_can_be_entered"
        )})`}
      />
      {/* Render Emails */}
      {renderedEmails}

      <div className="action-form">
        <BaseButton
          color={"primary"}
          type="button"
          onClick={handleSave}
          icon="bx bx-save"
          loading={loading}
        >
          {t("mail.mail_set_autosplit_save")}
        </BaseButton>
        <BaseButton
          color={"secondary"}
          type="button"
          onClick={() => {
            fetchData()
          }}
          loading={loading}
          icon="bx bx-reset"
        >
          {t("mail.project_reset_msg")}
        </BaseButton>
      </div>
    </Card>
  )
}

export default HackingMailReport
