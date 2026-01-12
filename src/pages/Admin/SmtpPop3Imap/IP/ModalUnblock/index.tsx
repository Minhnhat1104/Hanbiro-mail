// @ts-nocheck
import React from "react"
import { useTranslation } from "react-i18next"
import { Row } from "reactstrap"
import { BaseModal, BaseButton } from "components/Common"
const ModalUnblock = (props) => {
  const { isOpen, toggleModal, saveUnlock } = props
  const { t } = useTranslation()

  const headerModal = () => {
    return <>{t("mail.unblock")}</>
  }

  const bodyModal = () => {
    return (
      <>
        <Row>
          <div
            dangerouslySetInnerHTML={{
              __html: t("mail.mail_admin_pop3_imap_mail_unblock_msg"),
            }}
          />

          <div className={"color-red"}>{t("mail.mail_do_processed")}</div>
        </Row>
      </>
    )
  }
  const footerModal = () => {
    return (
      <span className="d-flex w-100 justify-content-center">
        <BaseButton
          color={"primary"}
          className="mx-1"
          onClick={() => {
            saveUnlock()
          }}
        >
          {t("common.main_confirm_msg")}
        </BaseButton>
        <BaseButton color={"secondary"} className="mx-1" onClick={toggleModal}>
          {t("common.common_cancel")}
        </BaseButton>
      </span>
    )
  }

  return (
    <BaseModal
      size={"md"}
      isOpen={isOpen}
      toggle={toggleModal}
      renderHeader={headerModal}
      renderBody={bodyModal}
      renderFooter={footerModal}
    />
  )
}

export default ModalUnblock
