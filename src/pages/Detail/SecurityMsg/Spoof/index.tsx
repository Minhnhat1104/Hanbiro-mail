// @ts-nocheck
import React from "react"
import { useTranslation } from "react-i18next"

const Spoof = ({ data }) => {
  const { t } = useTranslation()
  return (
    <div className="font-size-13 w-100 alert alert-error spoof">
      <div class="title">
        <i class="fa fa-bell s" aria-hidden="true"></i> {t("mail.mail_beware_of_phishing_emails")}
      </div>
      <div>
        <span>{t("mail.mail_sender_address")}:</span>
        <span className="han-fw-bold">{data.sender}</span>
        <i class="fa fa-times" aria-hidden="true"></i>
      </div>
      <div>
        <span>{t("mail.mail_legitimate_address")}:</span>
        <span className="han-fw-bold">{data.target}</span>
        <i class="fa fa-check" aria-hidden="true"></i>
      </div>
      <div>{t("mail.mail_this_email_may_have_spoofed_the_legitimate_address")}</div>
    </div>
  )
}

export default Spoof
