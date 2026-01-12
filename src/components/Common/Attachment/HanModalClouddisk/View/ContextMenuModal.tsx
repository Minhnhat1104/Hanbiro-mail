// @ts-nocheck
import BaseButton from "components/Common/BaseButton"
import BaseModal from "components/Common/BaseModal"

import React from "react"
import { useTranslation } from "react-i18next"

const ContextMenuModal = ({
  isOpen,
  handleClose = () => {},
  title = "",
  isLoading,
  renderBody = () => {},
  buttonActions: { onCancel = () => {}, onConfirm = () => {} } = {},
}) => {
  const { t } = useTranslation()

  const renderModalActionsFolder = () => {
    return (
      <>
        <BaseButton
          className="btn-white"
          icon={"X"}
          color="secondary"
          onClick={() => {
            onCancel()
          }}
        >
          {t("common.board_close_msg")}
        </BaseButton>
        <BaseButton
          className="btn-primary"
          icon={"Check"}
          color="primary"
          onClick={() => onConfirm()}
          loading={isLoading}
        >
          {t("common.board_confirm_msg")}
        </BaseButton>
      </>
    )
  }
  return (
    <BaseModal
      size="sm"
      isOpen={isOpen}
      toggle={() => handleClose?.()}
      contentClassName="common-han-modal-root"
      // actionClassName="bd-t"
      renderHeader={title}
      renderBody={renderBody}
      renderFooter={renderModalActionsFolder}
    />
  )
}

export default ContextMenuModal
