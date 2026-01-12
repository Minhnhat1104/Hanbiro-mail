// @ts-nocheck
import { BaseButton, BaseModal } from "components/Common"
import React from "react"
import { useTranslation } from "react-i18next"

const ResetPasswordModal = ({ isOpen, onClose, onResetPass, isLoading }) => {
  const { t } = useTranslation()

  return (
    <BaseModal
      open={isOpen}
      toggle={onClose}
      size="md"
      renderHeader={() => <>{t("mail.mail_set_pop3_reissue_password")}</>}
      renderBody={() => (
        <div className="d-flex flex-column gap-2 text-danger">
          <span
            dangerouslySetInnerHTML={{ __html: t("mail.mail_app_password_reissue_msg") }}
          ></span>
          <span>{t("mail.mail_do_you_want_to_continue")}</span>
        </div>
      )}
      renderFooter={() => (
        <>
          <BaseButton onClick={onClose} color="grey" outline>
            {t("common.common_cancel")}
          </BaseButton>
          <BaseButton onClick={onResetPass} color="primary" loading={isLoading}>
            {t("common.common_confirm")}
          </BaseButton>
        </>
      )}
    />
  )
}

export default ResetPasswordModal
