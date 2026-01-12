// @ts-nocheck
// React
import React, { useContext } from "react"

// Third-party
import { useTranslation } from "react-i18next"
import { Button } from "reactstrap"

// Project
import { MailContext } from ".."
import { BaseButton } from "components/Common"
import { useSelector } from "react-redux"

const FooterDetail = ({ handleReplyModal, handleReplyAllModal, handleForwardModal }) => {
  const { t } = useTranslation()
  const { menu } = useContext(MailContext)

  const composeMails = useSelector((state) => state.ComposeMail.composeMails)

  return (
    <>
      {menu !== "Spam" && (
        <div className="d-flex justify-content-start gap-3 pb-2 pt-3 content-view-footer">
          <BaseButton
            color={"primary"}
            className="han-h4 han-fw-semibold"
            onClick={handleReplyModal}
            disabled={composeMails?.data?.length > 9}
          >
            <i className="mdi mdi-reply"></i> {t("mail.mail_view_reply")}
          </BaseButton>
          <BaseButton
            color={"primary"}
            className="han-h4 han-fw-semibold"
            onClick={handleReplyAllModal}
            disabled={composeMails?.data?.length > 9}
          >
            <i className="mdi mdi-reply-all"></i> {t("mail.mail_view_allreply")}
          </BaseButton>
          <BaseButton
            color={"primary"}
            className="han-h4 han-fw-semibold"
            onClick={handleForwardModal}
            disabled={composeMails?.data?.length > 9}
          >
            <i className="mdi mdi-share"></i> {t("common.mail_view_forward")}
          </BaseButton>
        </div>
      )}
    </>
  )
}

export default FooterDetail
