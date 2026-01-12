// @ts-nocheck
// React
import React, { useContext } from "react"

// Third-party
import { useTranslation } from "react-i18next"
import { BaseButton } from "components/Common"

import { ComposeContext } from "components/Common/ComposeMail"
import useDevice from "hooks/useDevice"
import ComposeOptions from "../Body/ComposeOptions"
import ComposeSend from "./ComposeSend"

const ComposeFooter = ({ onClickAttachmentOption }) => {
  const { t } = useTranslation()
  const { isMobile } = useDevice()

  const {
    onComposeMail,
    isSending,
    isLoading,
    onClickPreview,
    onClickSaveDraft,
    onClickReservation,
    setAttachOptions,
  } = useContext(ComposeContext)

  return (
    <>
      <div className={`d-flex gap-3 align-items-center`}>
        <ComposeOptions onClickAttachmentOption={() => setAttachOptions((prev) => !prev)} />
        {/* <BaseButton color="primary" outline onClick={onClickReservation}>
          <i className="mdi mdi-timer" /> {!isMobile && t("mail.mail_secure_type_reservation")}
        </BaseButton>
        <BaseButton
          color="primary"
          outline
          onClick={onClickSaveDraft}
          loading={isLoading || isSending}
        >
          <i className="mdi mdi-content-save" /> {!isMobile && t("mail.mail_write_savetemp")}
        </BaseButton> */}
      </div>
      <div className="d-flex gap-3">
        {/* <BaseButton
          color="primary"
          outline
          loading={isLoading || isSending}
          onClick={onClickPreview}
        >
          {isMobile && <i className="mdi mdi-eye" />}{" "}
          {!isMobile && t("common.board_office_preview_msg")}
        </BaseButton> */}
        <ComposeSend
          isLoading={isLoading}
          isSending={isSending}
          onComposeMail={onComposeMail}
          onClickPreview={onClickPreview}
          onClickSaveDraft={onClickSaveDraft}
          onClickReservation={onClickReservation}
        />
      </div>
    </>
  )
}

export default ComposeFooter
