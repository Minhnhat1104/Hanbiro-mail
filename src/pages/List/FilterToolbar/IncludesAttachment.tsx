// @ts-nocheck
import React from "react"
import { useTranslation } from "react-i18next"
import { Input, Label } from "reactstrap"

const IncludesAttachment = (props) => {
  const { type, filterOptions, onFilterChange } = props
  const { t } = useTranslation()

  return (
    <div className="d-flex align-items-center gap-2">
      <Input
        type="checkbox"
        id="has-attachment"
        checked={filterOptions?.[type] || false}
        onChange={(e) => {
          onFilterChange &&
            onFilterChange({ type, value: e.target.checked ? e.target.checked : undefined })
        }}
      />
      <Label className="cursor-pointer mb-0" htmlFor="has-attachment">
        {t("mail.mail_search_has_file")}
      </Label>
    </div>
  )
}

export default IncludesAttachment
