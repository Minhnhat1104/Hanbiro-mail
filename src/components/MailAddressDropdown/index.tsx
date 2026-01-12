// @ts-nocheck
import { BaseButtonDropdown, BaseIcon } from "components/Common"
import { useCustomToast } from "hooks/useCustomToast"
import React from "react"
import { useTranslation } from "react-i18next"
import { DropdownItem } from "reactstrap"

const MailAddressDropdown = ({ action, mailAddress }) => {
  const { t } = useTranslation()
  const { successToast, errorToast } = useCustomToast()

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
    <BaseButtonDropdown
      iconClassName={"me-0"}
      classDropdown={"sender more-mail-address w-100 position-absolute start-0"}
      showChevron={false}
      classDropdownToggle={"btn-no-active"}
    >
      <DropdownItem onClick={() => handleCopy(mailAddress)} className="d-flex gap-2">
        <BaseIcon icon={"bx bx-copy"} /> {t("mail.mail_copy_email_address")}
      </DropdownItem>
      <DropdownItem
        onClick={() => action.onComposeTo && action.onComposeTo(mailAddress)}
        className="d-flex gap-2"
      >
        <BaseIcon icon={"bx bx-mail-send"} /> {t("mail.mail_menu_write")}
      </DropdownItem>
      <DropdownItem
        onClick={() => action.onSearchAddress && action.onSearchAddress("f", mailAddress)}
        className="d-flex gap-2"
      >
        <BaseIcon icon={"bx bx-search"} />
        {t("mail.mail_view_search_by_from_address")}
      </DropdownItem>
      <DropdownItem
        onClick={() => action.onSearchAddress && action.onSearchAddress("t", mailAddress)}
        className="d-flex gap-2"
      >
        <BaseIcon icon={"bx bx-search"} />
        {t("mail.mail_view_search_by_to_address")}
      </DropdownItem>
      <DropdownItem
        className="d-flex gap-2"
        onClick={() =>
          action.onAddContact &&
          action.onAddContact({
            open: true,
            data: mailAddress,
          })
        }
      >
        <BaseIcon icon={"bx bxs-contact"} />
        {t("mail.mail_view_addaddress")}
      </DropdownItem>
      <DropdownItem
        className="d-flex gap-2"
        onClick={() =>
          action.onBlockAddress &&
          action.onBlockAddress({
            open: true,
            data: mailAddress,
          })
        }
      >
        <BaseIcon icon={"bx bx-block"} />
        {t("mail.mail_view_bans")}
      </DropdownItem>
      <DropdownItem
        className="d-flex gap-2"
        onClick={() =>
          action.onAutoSortMailtoFolder &&
          action.onAutoSortMailtoFolder({
            open: true,
            data: mailAddress,
          })
        }
      >
        <BaseIcon icon={"bx bx-sort"} />
        {t("mail.mail_view_autosplit")}
      </DropdownItem>
    </BaseButtonDropdown>
  )
}

export default MailAddressDropdown
