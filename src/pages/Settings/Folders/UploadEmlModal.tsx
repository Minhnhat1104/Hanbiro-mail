// @ts-nocheck
import React, { useRef } from "react"
import { useTranslation } from "react-i18next"
import { BaseButton, BaseModal } from "components/Common"
import { HanAttachment } from "components/Common/Attachment"

const UploadEmlModal = ({ isOpen, toggle, onClick, loading }) => {
  const { t } = useTranslation()
  const attachmentRef = useRef()

  const onAttachmentsChange = (data) => {}

  const handleSave = async () => {
    const fileUploads = await attachmentRef.current?.uploadAndGetFiles()
    const uploadId = attachmentRef.current?.getUuid()
    onClick && onClick(fileUploads, uploadId)
  }

  return (
    <BaseModal
      centered
      size={"lg"}
      isOpen={isOpen}
      toggle={toggle}
      renderHeader={() => {
        return <span>{t("mail.mail_folder_upload_title")}</span>
      }}
      renderBody={() => {
        return (
          <>
            <HanAttachment
              fileAccepted={["eml", "zip"]}
              onAttachmentsChange={onAttachmentsChange}
              ref={attachmentRef}
            />
          </>
        )
      }}
      renderFooter={() => {
        return (
          <span className="w-100 d-flex justify-content-end">
            <BaseButton
              icon={"bx bx-save font-size-16 me-2"}
              color={"primary"}
              loading={loading}
              className={"btn-primary me-2"}
              onClick={handleSave}
            >
              {t("common.common_btn_save")}
            </BaseButton>
            <BaseButton
              outline
              color={"grey"}
              icon={"bx bx-x"}
              iconClassName="font-size-16 me-2"
              onClick={toggle}
            >
              {t("common.common_close_msg")}
            </BaseButton>
          </span>
        )
      }}
    />
  )
}
export default UploadEmlModal
