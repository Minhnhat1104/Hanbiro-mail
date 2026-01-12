// @ts-nocheck
import { Menu, MenuItem, MenuList, Popover } from "@mui/material"
import BaseButton from "components/Common/BaseButton"
import useDevice from "hooks/useDevice"
import React, { useRef, useState } from "react"
import { useTranslation } from "react-i18next"

const ComposeSend = ({
  isLoading,
  isSending,
  onComposeMail,
  onClickReservation,
  onClickSaveDraft,
  onClickPreview,
}) => {
  const { t } = useTranslation()
  const sendRef = useRef(null)
  const { isMobile } = useDevice()
  const [isOpen, setIsOpen] = useState(false)

  const onClose = () => {
    setIsOpen(false)
  }

  return (
    <div className="compose-send d-flex">
      <BaseButton
        color="primary"
        className={`compose-send-send ${isMobile ? "" : "px-4"}`}
        onClick={() => {
          onComposeMail && onComposeMail()
        }}
        loading={isLoading || isSending}
      >
        {isMobile ? <i className="mdi mdi-send" /> : <>{t("common.mail_write_send")}</>}
      </BaseButton>

      <BaseButton
        buttonRef={sendRef}
        color="primary"
        className="compose-send-dropdown"
        onClick={() => setIsOpen(true)}
        disabled={isLoading || isSending}
      >
        <i className="bx bxs-down-arrow font-size-10"></i>
      </BaseButton>

      <Popover
        id={"compose-send-dropdown"}
        open={isOpen}
        onClose={onClose}
        anchorEl={sendRef.current}
        elevation={1}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        sx={{ mb: 0.25, "& .MuiPaper-root": { minWidth: 150 } }}
      >
        <MenuList>
          <MenuItem
            className="d-flex gap-2 font-size-14"
            onClick={() => {
              onClickReservation && onClickReservation()
              onClose()
            }}
          >
            <i className="mdi mdi-timer" /> {t("mail.mail_secure_type_reservation")}
          </MenuItem>
          <MenuItem
            className="d-flex gap-2 font-size-14"
            onClick={() => {
              onClickSaveDraft && onClickSaveDraft()
              onClose()
            }}
          >
            <i className="mdi mdi-content-save" /> {t("mail.mail_write_savetemp")}
          </MenuItem>

          <MenuItem
            className="d-flex gap-2 font-size-14"
            onClick={() => {
              onClickPreview && onClickPreview()
              onClose()
            }}
          >
            <i className="mdi mdi-eye" /> {t("common.board_office_preview_msg")}
          </MenuItem>
        </MenuList>
      </Popover>
    </div>
  )
}

export default ComposeSend
