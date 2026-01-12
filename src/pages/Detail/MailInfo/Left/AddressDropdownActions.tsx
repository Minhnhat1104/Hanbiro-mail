// @ts-nocheck
import { MenuItem, MenuList, Popover, Typography } from "@mui/material"
import { BaseIcon } from "components/Common"
import { useCustomToast } from "hooks/useCustomToast"
import React, { useState } from "react"
import { useTranslation } from "react-i18next"

const AddressDropdownActions = (props) => {
  const {
    open,
    anchorEl,
    onClose,
    action,
    mailAddress,
    anchorOrigin = {
      vertical: "bottom",
      horizontal: "center",
    },
    transformOrigin = {
      vertical: "top",
      horizontal: "center",
    },
  } = props
  const { t } = useTranslation()
  const { successToast, errorToast } = useCustomToast()

  const handleClick = (callback) => {
    callback && callback()
    onClose && onClose()
  }

  // Handle copy text to clipboard
  const handleCopy = (text) => {
    if (text) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          successToast(t("mail.mail_copy_to_clipboardCopied"))
        })
        .catch((err) => {
          errorToast(["Error<br/>", err].join(""))
        })
    }
  }

  return (
    <Popover
      id="mail-address-pop-over"
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={anchorOrigin}
      transformOrigin={transformOrigin}
    >
      <MenuList>
        <MenuItem
          onClick={() => {
            handleCopy(mailAddress)
            onClose()
          }}
          sx={{ py: 1 }}
          className="han-h5 han-fw-medium"
        >
          <BaseIcon icon={"bx bx-copy font-size-14 me-2"} />
          {t("mail.mail_copy_email_address")}
        </MenuItem>
        <MenuItem
          className="han-h5 han-fw-medium"
          sx={{ py: 1 }}
          onClick={() => handleClick(() => action.onComposeTo && action.onComposeTo(mailAddress))}
        >
          <BaseIcon icon={"bx bx-mail-send font-size-14 me-2"} />
          {t("mail.mail_menu_write")}
        </MenuItem>
        <MenuItem
          className="han-h5 han-fw-medium"
          sx={{ py: 1 }}
          onClick={() =>
            handleClick(() => action.onSearchAddress && action.onSearchAddress("f", mailAddress))
          }
        >
          <BaseIcon icon={"bx bx-search font-size-14 me-2"} />
          {t("mail.mail_view_search_by_from_address")}
        </MenuItem>
        <MenuItem
          className="han-h5 han-fw-medium"
          sx={{ py: 1 }}
          onClick={() =>
            handleClick(() => action.onSearchAddress && action.onSearchAddress("t", mailAddress))
          }
        >
          <BaseIcon icon={"bx bx-search font-size-14 me-2"} />
          {t("mail.mail_view_search_by_to_address")}
        </MenuItem>
        <MenuItem
          className="han-h5 han-fw-medium"
          sx={{ py: 1 }}
          onClick={() =>
            handleClick(
              () =>
                action.onAddContact &&
                action.onAddContact({
                  open: true,
                  data: mailAddress,
                }),
            )
          }
        >
          <BaseIcon icon={"bx bxs-contact font-size-14 me-2"} />
          {t("mail.mail_view_addaddress")}
        </MenuItem>
        <MenuItem
          className="han-h5 han-fw-medium"
          sx={{ py: 1 }}
          onClick={() =>
            handleClick(
              () =>
                action.onBlockAddress &&
                action.onBlockAddress({
                  open: true,
                  data: mailAddress,
                }),
            )
          }
        >
          <BaseIcon icon={"bx bx-block font-size-14 me-2"} />
          {t("mail.mail_set_bans_bans")}
        </MenuItem>
        <MenuItem
          className="han-h5 han-fw-medium"
          sx={{ py: 1 }}
          onClick={() =>
            handleClick(
              () =>
                action.onAutoSortMailtoFolder &&
                action.onAutoSortMailtoFolder({
                  open: true,
                  data: mailAddress,
                }),
            )
          }
        >
          <BaseIcon icon={"bx bx-sort font-size-14 me-2"} />
          {t("mail.mail_view_autosplit")}
        </MenuItem>
      </MenuList>
    </Popover>
  )
}

export default AddressDropdownActions
