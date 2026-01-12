// @ts-nocheck
// React
import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"

// Project
import BaseButton from "components/Common/BaseButton"
import { BaseModal } from "components/Common"
import Inputname from "components/SettingAdmin/Inputwriting/index"
import { emailGet } from "helpers/email_api_helper"
import { useCustomToast } from "hooks/useCustomToast"
import { DKIM_MANAGEMENT } from "modules/mail/admin/url"

const DetailDKIM = props => {
  const { isOpen, toggleForm, detailItem } = props
  const { t } = useTranslation()
  const { successToast } = useCustomToast()

  const [data, setData] = useState()

  // State Loading

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await emailGet(
          `${DKIM_MANAGEMENT}/detail/${detailItem?.selector}/${detailItem?.domain}`
        )
        setData(res?.data)
      } catch (err) {
        console.log("error messenger", err)
      }
    }

    fetchData()
  }, [])

  // handle Copy Text for BIND
  const onCopy = () => {
    navigator.clipboard
      .writeText(data["bind text"])
      // .writeText("helloo")
      .then(() => {
        successToast("Text copied to clipboard!")
      })
      .catch(error => {
        console.error("Failed to copy text:", error)
      })
  }

  const headerModal = () => {
    return <>{t("mail.mail_dkim_information")}</>
  }
  const bodyModal = props => {
    return (
      <>
        <Inputname
          title={t("mail.mail_spam_manager_reportdate")}
          value={data?.date}
          disabled
        />
        <Inputname
          title={t("mail.mail_dkim_selector")}
          value={data?.selector}
          disabled
        />
        <Inputname
          title={t("mail.mail_admin_receive_domain")}
          value={data?.domain}
          disabled
        />
        <Inputname
          id="copy-text"
          title={t("mail.mail_dkim_text_for_bind")}
          value={data && data["bind text"]}
          type="textarea"
          disabled
          style={{ height: "120px" }}
          onCopy={onCopy}
        />
      </>
    )
  }
  const footerModal = () => {
    return (
      <>
        <div className="action-form">
          <BaseButton color={"secondary"} type="button" onClick={toggleForm}>
            {t("common.common_close_msg")}
          </BaseButton>
        </div>
      </>
    )
  }

  return (
    <>
      <BaseModal
        isOpen={isOpen}
        toggle={toggleForm}
        renderHeader={headerModal}
        renderBody={bodyModal}
        renderFooter={footerModal}
      />
    </>
  )
}

export default DetailDKIM
