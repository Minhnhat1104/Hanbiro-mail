// @ts-nocheck
// React
import React, { useContext } from "react"

// Third-party
import { useTranslation } from "react-i18next"

// Project
import BaseTable from "components/Common/BaseTable"
import { MailContext } from "pages/Detail"

const viewState = {
  n: "mail.mail_list_newmail",
  a: "mail.mail_secure_allow",
  d: "mail.mail_secure_deny",
  r: "mail.mail_secure_recall",
  u: "mail.mail_secure_auto_allow",
  p: "mail.mail_secure_predecessor_permitted",
  m: "mail.mail_interim_approval_in_progress",
  z: "mail.mail_interim_approval_decline",
  t: "mail.mail_interim_approval_complete",
}

const mseculistState = {
  n: "mail.mail_retired_forward_new",
  d: "mail.org_login_deny",
  u: "mail.mail_approved",
}

const ApprovalInformation = props => {
  const { t } = useTranslation()
  const { mail } = useContext(MailContext)

  // Config header for table
  const heads = [
    { content: t("mail.asset_status") },
    { content: t("mail.mail_reason") },
    { content: t("mail.mail_sent_user") },
    { content: t("mail.mail_mid_approver") },
    { content: t("mail.mail_final_permitter") },
    { content: t("mail.mail_permitted_date") },
  ]

  // Config data row for table
  const rows = [
    {
      class: "align-middle",
      columns: [
        { content: t(viewState[mail.approval.state]) },
        { content: mail.approval.deny_reason },
        { content: mail.approval.userid },
        {
          content: (
            <>
              {mail?.approval.mseculist?.map((item, index) => (
                <div key={index}>
                  {item?.username} ({item?.userid}) {t(mseculistState[item?.state])}
                </div>
              ))}
            </>
          ),
        },
        { content: mail.approval.approved_user },
        { content: mail.approval.approved_date },
      ],
    },
  ]

  return (
    <div className="mt-2">
      <BaseTable heads={heads} rows={rows} />
    </div>
  )
}

export default ApprovalInformation
