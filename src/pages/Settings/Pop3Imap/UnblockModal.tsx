// @ts-nocheck
import { BaseButton, BaseModal } from "components/Common"
import { Headers, emailPost } from "helpers/email_api_helper"
import { useCustomToast } from "hooks/useCustomToast"
import { URL_CHECK_SECURITY_PASS } from "modules/mail/settings/urls"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Col, Input, Row } from "reactstrap"
import { URL_SMTP_POP3_IMAP_UNBLOCK } from "../../../modules/mail/settings/urls"

const UnblockModal = ({ type, isOpen, onClose }) => {
  const { t } = useTranslation()
  const { errorToast } = useCustomToast()

  const [step, setStep] = useState(1)
  const [securityPassword, setSecurityPassword] = useState("")
  const [usePassword, setUsePassword] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({
    securityPassword: false,
    wrongPassword: false,
    newPassword: false,
  })

  const renderBody = () => {
    return (
      <div className="d-flex flex-column gap-2">
        <Row>
          <Col xs={3} className="col-form-label">
            {t("mail.mail_identification")}
          </Col>
          <Col xs={9} className="d-flex flex-column gap-2">
            <div className="d-flex flex-column gap-2">
              <div className="d-flex gap-3">
                <Input
                  type="password"
                  value={securityPassword}
                  disabled={step === 2}
                  onChange={(e) => setSecurityPassword(e.target.value)}
                  onKeyDown={onKeyDown}
                />
                <BaseButton
                  color="primary"
                  onClick={() => checkPassword()}
                  disabled={loading || step === 2}
                >
                  {t("mail.holiday_req_file_okbtn")}
                </BaseButton>
              </div>
              {errors.securityPassword && (
                <span className="text-danger">{t("mail.mail_set_pop3_secu_password_false")}</span>
              )}
              {errors.wrongPassword && (
                <span className="text-danger">{t("mail.mail_password_is_wrong")}</span>
              )}
              {step === 2 && <span className="han-color-success">{t("mail.mail_confirmed")}</span>}
            </div>
            <span dangerouslySetInnerHTML={{ __html: t("mail.mail_identification_msg") }}></span>
          </Col>
        </Row>
        {step === 2 && (
          <Row>
            <Col xs={3} className="col-form-label">
              {t("common.hragent_new_password")}
            </Col>
            <Col xs={9} className="d-flex flex-column gap-2">
              {usePassword && (
                <span dangerouslySetInnerHTML={{ __html: t("mail.mail_new_password_msg") }}></span>
              )}
              {!usePassword && (
                <>
                  <Input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <span>{t("mail.mail_to_unblock_enter_a_new_password_and_click_ok")}</span>
                  <span className="text-danger">{t("mail.mail_service_activation_msg5")}</span>
                </>
              )}
            </Col>
          </Row>
        )}
      </div>
    )
  }

  const onKeyDown = (e) => {
    if (e?.keyCode === 13) {
      checkPassword()
    }
  }

  const onUnblock = async () => {
    let params = ""
    if (!usePassword) {
      if (newPassword.trim() === "") {
        setErrors((prev) => ({ ...prev, newPassword: true }))
        return
      }
      params = {}
      params.npasswd = newPassword
    }
    setErrors((prev) => ({ ...prev, newPassword: false }))
    try {
      setLoading(true)
      const url = [URL_SMTP_POP3_IMAP_UNBLOCK, type].join("/")
      const res = await emailPost(url, params, Headers)
      if (res.success) {
        onClose && onClose()
      } else {
        errorToast(res?.msg)
      }
    } catch (error) {
      errorToast()
    } finally {
      setLoading(false)
    }
  }

  const checkPassword = async () => {
    if (securityPassword.trim() === "") {
      setErrors((prev) => ({ ...prev, securityPassword: true, wrongPassword: false }))
      return false
    }
    const params = {
      secupasswd: securityPassword,
    }
    try {
      setLoading(true)
      const res = await emailPost(URL_CHECK_SECURITY_PASS, params, Headers)
      if (res?.success) {
        setUsePassword(res?.usehbpasswd)
        if (!res?.issecupass) {
          setErrors((prev) => ({ ...prev, wrongPassword: true, securityPassword: false }))
        } else {
          setErrors((prev) => ({ ...prev, wrongPassword: false, securityPassword: false }))
          setStep(2)
        }
      } else {
        errorToast(res?.msg)
      }
    } catch (error) {
      errorToast()
    } finally {
      setLoading(false)
    }
  }

  return (
    <BaseModal
      size="lg"
      open={isOpen}
      toggle={onClose}
      id="mail-modal-unblock"
      renderHeader={t("mail.unblock")}
      renderBody={renderBody}
      renderFooter={
        <>
          <BaseButton outline color="grey" onClick={onClose}>
            {t("common.common_btn_close")}
          </BaseButton>
          <BaseButton color="primary" onClick={onUnblock} loading={loading} disabled={step === 1}>
            {t("common.common_btn_save")}
          </BaseButton>
        </>
      }
    />
  )
}

export default UnblockModal
