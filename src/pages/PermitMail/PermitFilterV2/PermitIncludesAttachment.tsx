// @ts-nocheck
import { colourStyles } from "components/Common/HanSelect"
import React from "react"
import { useTranslation } from "react-i18next"
import Select from "react-select"

const PermitIncludesAttachment = (props) => {
  const { type, filterOptions, onFilterChange } = props
  const { t } = useTranslation()

  const optionsStatus = [
    { label: t("mail.mail_secure_none"), value: "" },
    { label: t("mail.mail_permit_filter_yes"), value: "y" },
    { label: t("mail.mail_permit_filter_no"), value: "n" },
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

export default PermitIncludesAttachment
