// @ts-nocheck
import React from "react"
import { useTranslation } from "react-i18next"
import { Alert } from "reactstrap"
import Spoof from "./Spoof"
import "./styles.scss"

const SecurityMsg = ({ securityInfo, isSplitMode }) => {
  const { t } = useTranslation()

  const getSecurityMsg = (type) => {
    let result = ""
    switch (type) {
      case "isspoofmail":
        result = t("mail.mail_security_spoofing_msg")
          ?.replace("{{sender}}", securityInfo.isspoofmail.sender)
          ?.replace("{{target}}", securityInfo.isspoofmail.target)
        break
      case "isbayesian":
        if (!securityInfo.isbayesian.usemanagerdb) {
          result = t("mail.mail_security_usemanagerdb_msg_false")
        } else {
          result = t("mail.mail_security_usemanagerdb_msg_true")
        }
        break
      case "isspf":
        result = t("mail.mail_security_isspf_msg")?.replace(
          "{{senddomain}}",
          securityInfo.isspf.senddomain,
        )
        break
      case "isvirus":
        result = t("mail.mail_security_isvirus_msg")?.replace(
          "{{reason}}",
          securityInfo.isvirus.reason,
        )
        break
      case "isrbl":
        result = t("mail.mail_security_isrbl_msg")?.replace("{{reason}}", securityInfo.isrbl.reason)
        break
      case "isspicious":
        result = t("mail.mail_security_isspicious_msg")?.replace(
          "{{reason}}",
          securityInfo.isspicious.reason,
        )
        break
      default:
        break
    }

    return result
  }

  return (
    <div className="security-msg">
      {securityInfo &&
        Object.keys(securityInfo)?.map((key, index) => (
          <React.Fragment key={key}>
            {key !== "isencrypt" && key !== "isspoofmail" && securityInfo?.[key]?.result && (
              <Alert
                key={key}
                color="error"
                className="d-flex mb-2 mt-2 align-items-center gap-2 font-size-13 w-100"
              >
                <i className="mdi mdi-cancel"></i>
                {getSecurityMsg(key)}
              </Alert>
            )}
            {key !== "isencrypt" && key === "isspoofmail" && securityInfo?.[key]?.result && (
              <Spoof data={securityInfo?.[key]} />
            )}
          </React.Fragment>
        ))}
    </div>
  )
}

export default SecurityMsg
