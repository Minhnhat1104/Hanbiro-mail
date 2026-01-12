// @ts-nocheck
import { colourStyles } from "components/Common/HanSelect"
import React from "react"
import { useTranslation } from "react-i18next"
import Select from "react-select"

const Status = (props) => {
  const { type, filterOptions, onFilterChange } = props
  const { t } = useTranslation()

  const optionsStatus = [
    { label: t("common.common_none_msg"), value: "" },
    { label: t("mail.mail_status_unread_mail"), value: "new" },
    { label: t("mail.mail_status_important_mail"), value: "flag" },
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

export default Status
