// @ts-nocheck
import { BaseButton } from "components/Common"
import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { Input, Label } from "reactstrap"

const Name = ({ value, onChange }) => {
  const { t } = useTranslation()

  const [newName, setNewName] = useState(value ?? "")

  const handleSave = () => {
    onChange && onChange({ type: "name", value: newName })
  }
  const handleReset = () => {
    setNewName("")
    onChange && onChange({ type: "name", value: "" })
  }

  const onKeyDown = (e) => {
    if (e.keyCode === 13) {
      onChange && onChange({ type: "name", value: newName })
    }
  }

  return (
    <div className="d-flex flex-column gap-3">
      <div className="han-fw-semibold han-text-secondary">{t("mail.mail_secure_filter")}</div>
      <Input
        value={newName}
        onKeyDown={onKeyDown}
        onChange={(e) => setNewName(e?.target?.value)}
        placeholder={`${t("mail.mail_fetching_id")} (${t("mail.mailadmin_username")})`}
      />
      <div className="d-flex gap-2 w-100 justify-content-center">
        <BaseButton
          size="sm"
          outline
          color="grey"
          icon={"mdi mdi-reload"}
          iconClassName="me-0"
          onClick={handleReset}
        />
        <BaseButton
          size="sm"
          color="primary"
          icon={"mdi mdi-check"}
          iconClassName="me-0"
          onClick={handleSave}
        />
      </div>
    </div>
  )
}

const Type = ({ value, onChange }) => {
  const { t } = useTranslation()

  const [newType, setNewType] = useState(value ?? "all")

  const typeOptions = [
    {
      value: "all",
      label: t("mail.mail_select_checkbox_all"),
    },
    {
      value: "user",
      label: t("mail.mail_admin_spam_manager_users"),
    },
    {
      value: "group",
      label: t("mail.mail_groups"),
    },
  ]

  const handleSave = () => {
    onChange && onChange({ type: "type", value: newType })
  }
  const handleReset = () => {
    setNewType("all")
    onChange && onChange({ type: "type", value: "all" })
  }

  const onKeyDown = (e) => {
    if (e.keyCode === 13) {
      onChange && onChange({ type: "type", value: newType })
    }
  }

  return (
    <div className="d-flex flex-column gap-3">
      <div className="han-fw-semibold han-text-secondary">{t("mail.mail_secure_filter")}</div>
      <div className="d-flex flex-column">
        {typeOptions.map((opt, index) => (
          <div key={opt.value} className="d-flex gap-2">
            <Input
              type="radio"
              id={`filter-type-${index}`}
              name="filter-type"
              value={opt.value}
              checked={newType === opt.value}
              onKeyDown={onKeyDown}
              onChange={(e) => setNewType(e?.target?.value)}
              placeholder={`${t("mail.mail_fetching_id")} (${t("mail.mailadmin_username")})`}
            />
            <Label className="cursor-pointer" htmlFor={`filter-type-${index}`}>
              {opt.label}
            </Label>
          </div>
        ))}
      </div>
      <div className="d-flex gap-2 w-100 justify-content-center">
        <BaseButton
          size="sm"
          outline
          color="grey"
          icon={"mdi mdi-reload"}
          iconClassName="me-0"
          onClick={handleReset}
        />
        <BaseButton
          size="sm"
          color="primary"
          icon={"mdi mdi-check"}
          iconClassName="me-0"
          onClick={handleSave}
        />
      </div>
    </div>
  )
}

const Domain = ({ value, onChange, allDomain }) => {
  const { t } = useTranslation()

  const [newDomain, setNewDomain] = useState(value ?? [])

  const handleSave = () => {
    onChange && onChange({ type: "domain", value: newDomain })
  }
  const handleReset = () => {
    setNewDomain([])
    onChange && onChange({ type: "domain", value: undefined })
  }

  const onKeyDown = (e) => {
    if (e.keyCode === 13) {
      onChange && onChange({ type: "domain", value: newDomain })
    }
  }

  const handleSelectDomain = (e, value) => {
    if (e?.target?.checked) {
      const nValue = [...newDomain]
      nValue.push(value)
      setNewDomain(nValue)
    } else {
      const nValue = [...newDomain].filter((v) => v !== value)
      setNewDomain(nValue)
    }
  }

  return (
    <div className="d-flex flex-column gap-3">
      <div className="han-fw-semibold han-text-secondary">{t("mail.mail_secure_filter")}</div>
      <div className="d-flex flex-column">
        {allDomain.map((opt, index) => (
          <div key={opt} className="d-flex gap-2">
            <Input
              type="checkbox"
              id={`filter-domain-${index}`}
              name="filter-domain"
              checked={newDomain.includes(opt)}
              onKeyDown={onKeyDown}
              onChange={(e) => handleSelectDomain(e, opt)}
              placeholder={`${t("mail.mail_fetching_id")} (${t("mail.mailadmin_username")})`}
            />
            <Label className="cursor-pointer" htmlFor={`filter-domain-${index}`}>
              {opt}
            </Label>
          </div>
        ))}
      </div>
      <div className="d-flex gap-2 w-100 justify-content-center">
        <BaseButton
          size="sm"
          outline
          color="grey"
          icon={"mdi mdi-reload"}
          iconClassName="me-0"
          onClick={handleReset}
        />
        <BaseButton
          size="sm"
          color="primary"
          icon={"mdi mdi-check"}
          iconClassName="me-0"
          onClick={handleSave}
        />
      </div>
    </div>
  )
}

export default { name: Name, type: Type, domain: Domain }
