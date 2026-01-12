// @ts-nocheck
import { get } from "helpers/api_helper"
import React, { useEffect, useRef, useState } from "react"
import "./style.scss"
import { Input } from "reactstrap"
import { getBaseUrl } from "utils"
import { useTranslation } from "react-i18next"

const AliasDomainSelect = ({ onSelectedDomainChange = (selected) => {}, value = [] }) => {
  const { t } = useTranslation()

  const [domains, setDomains] = useState([])
  const [selected, setSelected] = useState(value)

  const inputRef = useRef()

  useEffect(() => {
    const url = getBaseUrl() + "/email/aliasdomain"
    get(url).then((res) => {
      if (res.alldomains) {
        setDomains(res.alldomains)
      }
    })
  }, [])

  useEffect(() => {
    onSelectedDomainChange(selected)
  }, [selected])

  const handleChoose = (domain) => {
    setSelected(
      selected.includes(domain)
        ? selected.filter((item) => item !== domain)
        : [...selected, domain],
    )
  }

  return (
    <>
      <div className="d-flex justify-content-between w-100 alias-headline ">
        <h5>{t("mail.alias_select_domain")}</h5>
      </div>
      <div className="border-1 border d-flex flex-column p-2">
        {domains.map((domain) => {
          return (
            <a
              key={domain}
              style={{
                color: "#0066ff",
              }}
              className="border-1 border-primary d-flex align-items-center gap-1 p-2"
              onClick={(e) => {
                e.preventDefault()
                handleChoose(domain)
              }}
            >
              <Input
                key={domain}
                ref={inputRef}
                className="form-check-input alias-domain__checkbox mt-0 "
                style={{
                  pointerEvents: "none",
                }}
                type="checkbox"
                checked={selected.includes(domain)}
                value=""
                aria-label="Checkbox for following text input"
                onChange={() => {}}
              ></Input>
              <span style={{ marginLeft: 4 }}>{domain}</span>
            </a>
          )
        })}
      </div>
    </>
  )
}

export default AliasDomainSelect
