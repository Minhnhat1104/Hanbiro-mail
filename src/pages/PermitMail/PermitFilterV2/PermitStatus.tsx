// @ts-nocheck
import { colourStyles } from "components/Common/HanSelect"
import React from "react"
import { useTranslation } from "react-i18next"
import Select from "react-select"

const PermitStatus = (props) => {
  const { type, filterOptions, onFilterChange } = props
  const { t } = useTranslation()

  const optionsStatus = [
    { label: t("mail.all"), value: "" },
    { label: t("mail.mail_list_newmail"), value: "n" },
    { label: t("mail.mail_secure_allow"), value: "a" },
    { label: t("mail.mail_secure_deny"), value: "d" },
    { label: t("mail.mail_secure_recall"), value: "r" },
    { label: t("mail.mail_secure_auto_allow"), value: "u" },
    { label: t("mail.mail_interim_approval_in_progress"), value: "m" },
    { label: t("mail.mail_interim_approval_decline"), value: "z" },
    { label: t("mail.mail_interim_approval_complete"), value: "t" },
  ]

  const handleChangeStatus = (data) => {
    onFilterChange && onFilterChange({ type, value: data.value })
  }

  return (
    <Select
      value={optionsStatus.find((item) => item.value === filterOptions?.[type]) || optionsStatus[0]}
      options={optionsStatus}
      onChange={handleChangeStatus}
      menuPosition="fixed"
      styles={colourStyles}
    />
  )
}

export default PermitStatus
