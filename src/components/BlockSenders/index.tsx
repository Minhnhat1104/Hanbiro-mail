// @ts-nocheck
// React
import React, { useContext, useState } from "react"

// Third-party
import { useTranslation } from "react-i18next"

// Project
import { BaseButton, BaseModal } from "components/Common"
import BaseInput from "components/SettingAdmin/Inputwriting"
import { formatEmailFrom } from "utils"
import { useCustomToast } from "hooks/useCustomToast"
import { postMailToHtml5 } from "modules/mail/common/api"
import { MailContext } from "pages/Detail"

import "./style.scss"

const BlockSenders = ({ handleClose = () => {} }) => {
  const { t } = useTranslation()
  const { mail } = useContext(MailContext)
  const { successToast, errorToast } = useCustomToast()

  const { emailRegex, emailFromArr } = formatEmailFrom(mail?.from)

  const [isLoading, setIsLoading] = useState(false)

  let email = ""
  if (emailRegex) {
    email = emailRegex
  } else {
    if (emailFromArr?.length > 0) {
      if (emailFromArr[0] !== "") email = emailFromArr[1]
      else email = emailFromArr[2]?.split("&lt;")?.[1]?.replace(/&gt;/g, "")
    }
  }

  // Handle save
  const handleSave = async (email) => {
    setIsLoading(true)
    try {
      const postParams = {
        act: "bans",
        mode: "write",
        data: email,
      }
      const res = await postMailToHtml5(postParams)
      if (res.success === "1") {
        successToast()
        handleClose()
      }
      setIsLoading(false)
    } catch (err) {
      errorToast()
      setIsLoading(false)
    }
  }

  return (
    <BaseModal
      isOpen={true}
      size="md"
      toggle={handleClose}
      renderHeader={() => <>{t("mail.mail_list_bans")}</>}
      renderBody={() => (
        <BaseInput
          title={t("mail.mail_forward_email_address")}
          value={email}
          disabled={true}
          formClass="mb-0"
        />
      )}
      renderFooter={() => (
        <>
          <BaseButton color="primary" onClick={() => handleSave(email)} loading={isLoading}>
            {t("common.common_btn_save")}
          </BaseButton>
          <BaseButton outline color="grey" onClick={handleClose} loading={isLoading}>
            {t("common.common_btn_close")}
          </BaseButton>
        </>
      )}
      footerClass="d-flex align-items-center justify-content-center"
      centered
    />
  )
}

export default BlockSenders
