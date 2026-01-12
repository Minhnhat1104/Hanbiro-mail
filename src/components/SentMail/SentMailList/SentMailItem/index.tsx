// @ts-nocheck
// React
import React, { useEffect, useState } from "react"

// Third-party
import { useTranslation } from "react-i18next"

// Project
import BaseButtonTooltip from "components/Common/BaseButtonTooltip"
import { useCustomToast } from "hooks/useCustomToast"
import { Headers, emailPost } from "helpers/email_api_helper"
import { URL_CANCEL_SEND } from "modules/mail/common/urls"
import useDevice from "hooks/useDevice"

const SentMailItem = ({
  index = 0,
  mail = {},
  mailListState = {},
  setMailListState,
  onActionModal = () => {},
  renderCheckBox = () => {},
}) => {
  const { t } = useTranslation()
  const { successToast, errorToast } = useCustomToast()
  const { isMobile } = useDevice()

  const [stateSending, setStateSending] = useState("")

  useEffect(() => {
    if (mail?.state) setStateSending(mail?.state)
  }, [mail])

  // Handle cancel sending with id
  const handleCancelSending = async (id) => {
    try {
      const res = await emailPost(
        URL_CANCEL_SEND,
        {
          delids: id,
          block: true,
        },
        Headers,
      )
      setStateSending("d")
      successToast()
      const newList = mailListState?.data?.map((mail) => {
        if (mail.getbakid === id) {
          return { ...mail, state: "d", getbakid: "" }
        }
        return mail
      })
      setMailListState({
        ...mailListState,
        data: newList,
        canceled: mailListState.canceled + 1,
        unread: mailListState.unread - 1,
      })
    } catch (err) {
      errorToast()
    }
  }

  return (
    <div
      className={`d-flex align-items-${isMobile ? "start" : "center"} justify-content-between mb-2`}
    >
      <div className={`d-flex align-items-${isMobile ? "start" : "center"} gap-3`}>
        {renderCheckBox(mail?.getbakid)}
        <div className="d-flex align-items-center justify-content-between gap-1">
          <span
            dangerouslySetInnerHTML={{
              __html: mail?.receive_user ?? "-",
            }}
          />
          {!isMobile && (
            <>
              {stateSending === "r" ? (
                <p className="mb-0 han-text-secondary">{mail?.receive_date ?? "-"}</p>
              ) : stateSending === "n" ? (
                <p className="mb-0 han-text-secondary">{t("common.mail_unread_label")}</p>
              ) : stateSending === "d" ? (
                <p className="mb-0 han-text-secondary">{t("mail.mail_secure_recall")}</p>
              ) : (
                <p className="mb-0 han-text-secondary">{t("mail.mail_sent_fail")}</p>
              )}
            </>
          )}
        </div>
      </div>

      <div className="d-flex gap-1 align-items-center">
        {isMobile && (
          <>
            {stateSending === "r" ? (
              <p className="mb-0 han-text-secondary">{mail?.receive_date ?? "-"}</p>
            ) : stateSending === "n" ? (
              <p className="mb-0 han-text-secondary">{t("common.mail_unread_label")}</p>
            ) : stateSending === "d" ? (
              <p className="mb-0 han-text-secondary">{t("mail.mail_secure_recall")}</p>
            ) : (
              <p className="mb-0 han-text-secondary">{t("mail.mail_sent_fail")}</p>
            )}
          </>
        )}
        {mail?.getbakid && (
          <BaseButtonTooltip
            title={t("common.whisper_cancel_sending")}
            id={`cancel-sending-${index}`}
            className="p-0 border-0 bg-transparent font-size-17 text-muted ms-2"
            onClick={() =>
              onActionModal(t("common.whisper_cancel_sending"), handleCancelSending, mail?.getbakid)
            }
            icon="mdi mdi-cancel"
          />
        )}
      </div>
    </div>
  )
}

export default SentMailItem
