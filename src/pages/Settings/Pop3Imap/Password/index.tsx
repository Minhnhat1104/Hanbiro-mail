// @ts-nocheck
import { BaseButton, BaseIcon } from "components/Common"
import Loading from "components/Common/Loading"
import { Headers, emailPost } from "helpers/email_api_helper"
import { useCustomToast } from "hooks/useCustomToast"
import { URL_APP_PASSWORD_RESET, URL_CHECK_APP_PASSWORD } from "modules/mail/settings/urls"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Col, Input, Row } from "reactstrap"
import "./styles.scss"
import HanTooltip from "components/Common/HanTooltip"
import ResetPasswordModal from "./ResetPasswordModal"

const Password = ({ isRefresh, setIsRefresh, activeTab }) => {
  const { t } = useTranslation()
  const { successToast, errorToast } = useCustomToast()

  const [step, setStep] = useState(1)
  const [openResetPassModal, setOpenResetPassModal] = useState(false)
  const [securityPassword, setSecurityPassword] = useState("")
  const [usePassword, setUsePassword] = useState(true)
  const [appPassword, setAppPassword] = useState("")
  const [appPasswordDate, setAppPasswordDate] = useState("")
  const [loading, setLoading] = useState(false)
  const [isResetLoading, setIsResetLoading] = useState(false)
  const [errors, setErrors] = useState({
    passwordRequire: false,
    wrongPassword: false,
  })

  useEffect(() => {
    if (isRefresh && activeTab === "4") {
      if (appPassword !== "" || securityPassword !== "") {
        onReset()
      }
      setIsRefresh(false)
    }
  }, [isRefresh])

  const onKeyDown = (e) => {
    if (e?.keyCode === 13) {
      checkAppPassword()
    }
  }

  const checkAppPassword = async () => {
    if (securityPassword.trim() === "") {
      setErrors((prev) => ({ ...prev, passwordRequire: true, wrongPassword: false }))
      return false
    }
    const params = {
      secupasswd: securityPassword,
    }
    try {
      setLoading(true)
      const res = await emailPost(URL_CHECK_APP_PASSWORD, params, Headers)
      if (res?.success) {
        setUsePassword(res?.usehbpasswd)
        if (!res?.issecupass) {
          setErrors((prev) => ({ ...prev, wrongPassword: true, passwordRequire: false }))
        } else {
          setErrors((prev) => ({ ...prev, wrongPassword: false, passwordRequire: false }))
          setStep(2)
          setAppPassword(res?.apppasswd)
          setAppPasswordDate(res?.setdate)
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

  const copyAppPasswordToClipBoard = () => {
    successToast(t("mail.mail_copy_to_clipboardCopied"))
    const html = appPassword
    // Create an iframe (isolated container) for the HTML
    let container = document.createElement("div")
    container.innerHTML = html
    // Hide element
    container.style.position = "fixed"
    container.style.pointerEvents = "none"
    container.style.opacity = 0
    // Mount the iframe to the DOM to make `contentWindow` available
    document.body.appendChild(container)
    // Copy to clipboard
    window.getSelection().removeAllRanges()
    let range = document.createRange()
    range.selectNode(container)
    window.getSelection().addRange(range)
    document.execCommand("copy")
    // Remove the iframe
    document.body.removeChild(container)
  }

  const resetAppPassword = async () => {
    try {
      setIsResetLoading(true)
      const res = await emailPost(URL_APP_PASSWORD_RESET, {}, Headers)
      if (res?.success) {
        setOpenResetPassModal(false)
        checkAppPassword()
      } else {
        errorToast(res?.msg)
      }
    } catch (error) {
      errorToast()
    } finally {
      setIsResetLoading(false)
    }
  }

  const onReset = () => {
    setStep(1)
    setAppPassword("")
    setUsePassword(true)
    setAppPasswordDate("")
    setSecurityPassword("")
    setErrors({
      passwordRequire: false,
      wrongPassword: false,
    })
  }

  return (
    <>
      {/* loading */}
      {isRefresh && (
        <div className="w-100 position-absolute top-0 start-0" style={{ height: "75vh" }}>
          <Loading />
        </div>
      )}

      {/* page content */}
      <div className="app-password-content py-2 d-flex flex-column gap-3">
        {/* Information */}
        <Row>
          <Col xs={12} lg={3} className="col-form-label">
            {t("mail.mail_what_is_an_app_password")}
          </Col>
          <Col xs={12} lg={9}>
            <div className="d-flex flex-column gap-1">
              {!usePassword && (
                <span
                  className="text-danger"
                  dangerouslySetInnerHTML={{ __html: t("mail.mail_what_is_an_app_password_msg1") }}
                ></span>
              )}
              <span
                className="what-is-app-password"
                dangerouslySetInnerHTML={{ __html: t("mail.mail_what_is_an_app_password_msg2") }}
              ></span>
            </div>
          </Col>
        </Row>

        {/* verify secure pass */}
        <Row>
          <Col xs={12} lg={3} className="col-form-label">
            {t("mail.mail_identification")}
          </Col>
          <Col xs={12} lg={9}>
            <div className="d-flex flex-column gap-2">
              <div className="row gap-3 gx-0">
                <div className="col-12 col-lg-9">
                  <Input
                    type="password"
                    value={securityPassword}
                    disabled={step === 2}
                    onChange={(e) => setSecurityPassword(e.target.value)}
                    onKeyDown={onKeyDown}
                  />
                </div>
                <div className="col-12 col-lg-2">
                  <BaseButton
                    color="primary"
                    onClick={() => checkAppPassword()}
                    disabled={loading || step === 2}
                  >
                    {t("mail.holiday_req_file_okbtn")}
                  </BaseButton>
                </div>
              </div>
              {errors.passwordRequire && (
                <span className="text-danger">{t("mail.mail_set_pop3_secu_password_false")}</span>
              )}
              {errors.wrongPassword && (
                <span className="text-danger">{t("mail.mail_password_is_wrong")}</span>
              )}
              {step === 2 && <span className="han-color-success">{t("mail.mail_confirmed")}</span>}
              {step !== 2 && (
                <span
                  dangerouslySetInnerHTML={{ __html: t("mail.mail_identification_msg") }}
                ></span>
              )}
            </div>
          </Col>
        </Row>

        {/* App password */}
        {step === 2 && (
          <Row className="mail-app-password">
            <Col xs={12} lg={3} className="col-form-label">
              {t("mail.mail_app_password")}
            </Col>
            <Col xs={12} lg={9}>
              <div className="d-flex flex-column gap-2">
                <div className="row gap-3 gx-0">
                  <div className="app-password-input col-12 col-lg-9">
                    <Input value={appPassword} disabled={true} />
                    <HanTooltip placement="top" overlay={t("common.action_copy")}>
                      <BaseIcon
                        icon="bx bx-copy"
                        className="font-size-18 han-text-secondary"
                        onClick={copyAppPasswordToClipBoard}
                      />
                    </HanTooltip>
                  </div>
                  <div className="col-12 col-lg-2">
                    <BaseButton color="primary" onClick={() => setOpenResetPassModal(true)}>
                      {t("mail.mail_set_pop3_reissue")}
                    </BaseButton>
                  </div>
                </div>

                {/* app pass date */}
                <span className="han-text-secondary">{`${t(
                  "mail.mail_date_of_issuance",
                )}: ${appPasswordDate}`}</span>
              </div>
            </Col>
          </Row>
        )}
      </div>

      {openResetPassModal && (
        <ResetPasswordModal
          isOpen={openResetPassModal}
          onClose={() => setOpenResetPassModal(false)}
          onResetPass={resetAppPassword}
          isLoading={isResetLoading}
        />
      )}
    </>
  )
}

export default Password
