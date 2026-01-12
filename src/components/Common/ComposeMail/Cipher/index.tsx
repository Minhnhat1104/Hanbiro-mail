// @ts-nocheck
import React, { useContext, useState } from "react"
import { useTranslation } from "react-i18next"
import { Input, Label } from "reactstrap"

import { ComposeContext } from "components/Common/ComposeMail/index"

const Cipher = (props) => {
  const { t } = useTranslation()
  const {
    handleChangeCipher,
    cpassword,
    cpasswordHint,
    secuOpenLimit,
    secuDayLimit,
    isPassGuide,
    isSecu2r,
  } = useContext(ComposeContext)

  const [enableStop, setEnableStop] = useState(true)

  return (
    <>
      <div className="d-flex align-items-center gap-2">
        <div className="compose-fields d-flex gap-2 align-items-center w-50">
          <Label className="mb-0" htmlFor="password">
            {t("mail.mail_cipher_password")}
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            className="form-control border-0 flex-grow-1 w-auto"
            placeholder={""}
            autoComplete="off"
            value={cpassword}
            onChange={(e) => {
              handleChangeCipher("password", e.target.value)
            }}
          />
        </div>
        <div className="compose-fields d-flex gap-2 align-items-center w-50">
          <Label className="mb-0" htmlFor="password-hint">
            {t("mail.mail_cipher_password_hint")}
          </Label>
          <Input
            id="password-hint"
            name="password-hint"
            type="text"
            className="form-control border-0 flex-grow-1 w-auto"
            placeholder={""}
            autoComplete="off"
            value={cpasswordHint}
            onChange={(e) => {
              handleChangeCipher("passwordHint", e.target.value)
            }}
          />
        </div>
      </div>
      <p className="my-2">{t("mail.mail_write_securealert1")}</p>
      <div className="d-flex align-items-center gap-2">
        <div className="compose-fields d-flex gap-2 align-items-center w-50">
          <Label className="mb-0" htmlFor="openable-count">
            {t("mail.mail_cipher_openable_count")}
          </Label>
          <Input
            id="openable-count"
            name="openable-count"
            type="number"
            className="form-control border-0 flex-grow-1 w-auto"
            autoComplete="off"
            placeholder={"example"}
            disabled={!isSecu2r}
            value={secuOpenLimit}
            onChange={(e) => {
              handleChangeCipher("openLimit", e.target.value)
            }}
          />
        </div>
        <div className="compose-fields d-flex gap-2 align-items-center w-50">
          <Label className="mb-0" htmlFor="expiration-days">
            {t("mail.mail_cipher_expiration_days")}
          </Label>
          <Input
            id="expiration-days"
            name="expiration-days"
            type="number"
            className="form-control border-0 flex-grow-1 w-auto"
            autoComplete="off"
            placeholder={"example"}
            disabled={!isSecu2r}
            value={secuDayLimit}
            onChange={(e) => {
              handleChangeCipher("dayLimit", e.target.value)
            }}
          />
        </div>
      </div>
      <div className="d-flex align-items-center gap-3 mt-2">
        <div className="d-flex align-items-center gap-1">
          <Input
            type="checkbox"
            id="show-password"
            className="mt-0"
            checked={isPassGuide}
            onChange={(e) => {
              handleChangeCipher("passGuide", e.target.checked)
            }}
          />
          <Label htmlFor="show-password" className="mb-0">
            {t("mail.mail_cipher_password_mail_body")}
          </Label>
        </div>
        <div className="d-flex align-items-center gap-1">
          <Input
            type="checkbox"
            id="enable-stop"
            className="mt-0"
            checked={isSecu2r}
            onChange={(e) => {
              handleChangeCipher("secu2r", e.target.checked)
            }}
          />
          <Label htmlFor="enable-stop" className="mb-0">
            {t("mail.mail_cipher_enable_to_stop")}
          </Label>
        </div>
      </div>
    </>
  )
}

export default Cipher
