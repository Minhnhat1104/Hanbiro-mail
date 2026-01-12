// @ts-nocheck
// React
import React from "react"

// Third-party
import { useTranslation } from "react-i18next"

// Project
import { BaseButton, BaseModal } from "components/Common"

const PreviewModal = ({ previewData = {}, handleClose = () => {} }) => {
  const { t } = useTranslation()

  return (
    <BaseModal
      open={previewData.open}
      toggle={handleClose}
      size="xl"
      renderHeader={() => <div>{t("common.board_office_preview_msg")}</div>}
      renderBody={() => <div dangerouslySetInnerHTML={{ __html: previewData.item?.contents }} />}
      renderFooter={() => (
        <BaseButton type="button" color="grey" outline onClick={handleClose}>
          {t("common.common_close_msg")}
        </BaseButton>
      )}
      footerClass="d-flex align-items-center justify-content-center"
      // bodyClass="scroll-box"
    />
  )
}

export default PreviewModal
