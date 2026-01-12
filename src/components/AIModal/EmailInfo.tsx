// @ts-nocheck
import React from "react"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { formatEmailFrom, formatEmailTo } from "utils"

const EmailInfo = ({ subject, mail }) => {
  const { t } = useTranslation()
  const myEmailGlobal = useSelector((state) => state.Config.userConfig.user_data.email) // email data from state redux

  // Format "From" information
  const { emailRegex: emailFromRegex, emailFromArr } = formatEmailFrom(mail?.from)
  // Format "To" information
  const {
    emailRegex: emailToRegex,
    emailTo,
    checkEmailTo,
    emailToArr,
  } = formatEmailTo(mail?.to, mail?.myeamil ?? myEmailGlobal)

  // Format "CC" information
  const {
    emailRegex: emailCCRegex,
    emailTo: emailCC,
    checkEmailTo: checkEmailCC,
    emailToArr: emailCCArr,
  } = formatEmailTo(mail?.cc, mail?.myeamil ?? myEmailGlobal)
  return (
    <div className="ai-user-info d-flex flex-column">
      <span
        className="font-size-15 han-fw-semibold"
        dangerouslySetInnerHTML={{
          __html: subject ? subject : mail?.subject || "",
        }}
      ></span>
      <div className="ai-sub-title">
        {/* From */}
        <div className="d-flex gap-2 align-items-center" style={{ height: 22 }}>
          <div style={{ minWidth: 55 }} className="d-flex justify-content-between">
            <span>{t("mail.mail_write_from")}</span>
            <span>{":"}</span>
          </div>
          {emailFromRegex ? (
            <span
              className="text-truncate"
              style={{ maxWidth: 450 }}
              dangerouslySetInnerHTML={{ __html: emailFromRegex }}
            ></span>
          ) : (
            <>
              {emailFromArr?.[0] !== ""
                ? emailFromArr[0]
                  ? emailFromArr[0]
                  : "-"
                : emailFromArr[1]
                ? emailFromArr[1]
                : "-"}
              <span
                className="text-truncate"
                style={{ maxWidth: 450 }}
                dangerouslySetInnerHTML={{
                  __html:
                    emailFromArr?.[0] !== ""
                      ? emailFromArr[1]
                        ? "&lt;" + emailFromArr[1] + "&gt;"
                        : "-"
                      : emailFromArr[2]
                      ? emailFromArr[2]
                      : "-",
                }}
              />
            </>
          )}
        </div>

        {/* To */}
        <div className={`d-flex gap-2 align-items-center`} style={{ height: 22 }}>
          <div style={{ minWidth: 55 }} className="d-flex justify-content-between">
            <span>{t("common.main_mail_to")}</span>
            <span>{":"}</span>
          </div>
          <span
            className="text-truncate"
            style={{ maxWidth: 450 }}
            dangerouslySetInnerHTML={{ __html: emailToRegex ? emailToRegex : emailTo || "" }}
          />
        </div>

        {/* CC */}
        {mail?.cc && (
          <div className={`d-flex gap-2 align-items-center`} style={{ height: 22 }}>
            <div style={{ minWidth: 55 }} className="d-flex justify-content-between text-truncate">
              <span>{t("common.main_mail_cc")}</span>
              <span>{":"}</span>
            </div>
            <span
              className="text-truncate"
              style={{ maxWidth: 450 }}
              dangerouslySetInnerHTML={{ __html: emailCCRegex ? emailCCRegex : emailCC || "" }}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default EmailInfo
