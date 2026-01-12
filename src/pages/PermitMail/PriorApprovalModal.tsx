// @ts-nocheck
import React, { useMemo } from "react"
import { BaseButton, BaseModal } from "components/Common"
import PriorApproval from "pages/Admin/PriorApproval"
import { useTranslation } from "react-i18next"

function PriorApprovalModal(props) {
  const { isOpen, toggle } = props
  const { t } = useTranslation()

  const headerModal = useMemo(() => {
    return <header>{t("mail.mail_prior_permit")}</header>
  }, [])
  const bodyModal = useMemo(() => {
    return <PriorApproval />
  }, [])
  const footerModal = useMemo(() => {
    return (
      <div className="w-100 d-flex justify-content-end">
        <BaseButton
          color={"secondary"}
          onClick={() => toggle(false)}
          type="button"
        >
          {t("mail.project_close_msg")}
        </BaseButton>
      </div>
    )
  }, [])
  return (
    <BaseModal
      isOpen={isOpen}
      size="xl"
      toggle={() => toggle(false)}
      modalClass="approver-info"
      contentClass="h-100"
      bodyClass="approver-info-body overflow-y-auto hidden-scroll-box"
      renderHeader={headerModal}
      renderBody={bodyModal}
      renderFooter={footerModal}
    />
  )
}

export default PriorApprovalModal
