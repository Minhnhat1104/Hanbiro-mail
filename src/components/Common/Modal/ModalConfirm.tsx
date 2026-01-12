// @ts-nocheck
import React from "react"
import { useTranslation } from "react-i18next"
import { BaseButton, BaseModal } from "components/Common"

const ModalConfirm = ({
  isOpen,
  toggle,
  onClick,
  loading,
  keyHeader = "common.common_delete",
  keyBody = "common.approval_config_warn_delete",
}) => {
  const { t } = useTranslation()
  return (
    <BaseModal
      isOpen={isOpen}
      toggle={toggle}
      renderHeader={() => {
        return <span>{t(keyHeader)}</span>
      }}
      renderBody={() => {
        return <span>{t(keyBody)}</span>
      }}
      renderFooter={() => {
        return (
          <span className="w-100 d-flex justify-content-end">
            <BaseButton
              icon={"bx bx-check"}
              iconClassName="font-size-16 me-2"
              color={"primary"}
              loading={loading}
              className={"btn-primary me-2"}
              onClick={() => onClick && onClick()}
            >
              {t("common.common_confirm")}
            </BaseButton>
            <BaseButton
              outline
              color="grey"
              icon={"bx bx-x"}
              iconClassName="font-size-16 me-2"
              onClick={toggle}
            >
              {t("common.common_close_msg")}
            </BaseButton>
          </span>
        )
      }}
      size={"xs"}
    />
  )
}
export default ModalConfirm
