// @ts-nocheck
import { BaseButton } from "components/Common"
import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { Input, Label } from "reactstrap"

const Manager = ({ value, onChange }) => {
  const { t } = useTranslation()

  const [newName, setNewName] = useState(value ?? "")

  const handleSave = () => {
    onChange && onChange({ type: "manager", value: newName })
  }
  const handleReset = () => {
    setNewName("")
    onChange && onChange({ type: "manager", value: "" })
  }

  const onKeyDown = (e) => {
    if (e.keyCode === 13) {
      onChange && onChange({ type: "manager", value: newName })
    }
  }

  return (
    <div className="d-flex flex-column gap-3">
      <div className="han-fw-semibold han-text-secondary">{t("mail.mail_secure_filter")}</div>
      <Input
        value={newName}
        onKeyDown={onKeyDown}
        onChange={(e) => setNewName(e?.target?.value)}
        placeholder={`Manager ID`}
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

const User = ({ value, onChange }) => {
  const { t } = useTranslation()

  const [newName, setNewName] = useState(value ?? "")

  const handleSave = () => {
    onChange && onChange({ type: "user", value: newName })
  }
  const handleReset = () => {
    setNewName("")
    onChange && onChange({ type: "user", value: "" })
  }

  const onKeyDown = (e) => {
    if (e.keyCode === 13) {
      onChange && onChange({ type: "user", value: newName })
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

const infoOptions = [
  { value: "toinside", label: "mail.mail_receive_mail_opt" },
  { value: "tooutside", label: "mail.mail_to_outside" },
  { value: "isfile", label: "mail.mail_include_attachment_opt" },
]
const Info = ({ value, onChange, options = infoOptions }) => {
  const { t } = useTranslation()

  const [selected, setSelected] = useState(value ?? [])

  const handleSave = () => {
    onChange && onChange({ type: "info", value: selected })
  }
  const handleReset = () => {
    setSelected([])
    onChange && onChange({ type: "info", value: undefined })
  }

  const onKeyDown = (e) => {
    if (e.keyCode === 13) {
      onChange && onChange({ type: "info", value: selected })
    }
  }

  const handleSelectInfo = (e, value) => {
    if (e?.target?.checked) {
      const nValue = [...selected]
      nValue.push(value)
      setSelected(nValue)
    } else {
      const nValue = [...selected].filter((v) => v !== value)
      setSelected(nValue)
    }
  }

  return (
    <div className="d-flex flex-column gap-3">
      <div className="han-fw-semibold han-text-secondary">{t("mail.mail_secure_filter")}</div>
      <div className="d-flex flex-column">
        {options.map((opt, index) => (
          <div key={opt.value} className="d-flex gap-2">
            <Input
              type="checkbox"
              id={`filter-info-${index}`}
              name="filter-info"
              checked={selected.includes(opt.value)}
              onKeyDown={onKeyDown}
              onChange={(e) => handleSelectInfo(e, opt.value)}
              placeholder={`${t("mail.mail_fetching_id")} (${t("mail.mailadmin_username")})`}
            />
            <Label className="cursor-pointer" htmlFor={`filter-info-${index}`}>
              {t(opt.label)}
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

export default { manager: Manager, user: User, info: Info }
