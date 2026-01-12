// @ts-nocheck
import React from "react"
import { useTranslation } from "react-i18next"
import { BaseButton, BaseModal } from "components/Common"

const ModalAlert = ({
  modal = true,
  handleClose = () => {},
  titleHeader = "common.alert_error_msg",
  titleBody = "common.alert_plz_input_data",
}) => {
  const { t } = useTranslation()

  return (
    <BaseModal
      isOpen={modal}
      toggle={handleClose}
      size="sm"
      renderHeader={() => <>{t(titleHeader)}</>}
      renderBody={() => <>{t(titleBody)}</>}
      renderFooter={() => (
        <BaseButton color="grey" className={"btn-action"} onClick={handleClose}>
          {t("mail.project_close_msg")}
        </BaseButton>
      )}
      footerClass="d-flex align-items-center justify-content-center"
    />
  )
}

export default ModalAlert
