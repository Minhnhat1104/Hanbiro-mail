// @ts-nocheck
import { BaseButtonDropdown } from "components/Common"
import React, { useEffect, useState } from "react"
import "react-datepicker/dist/react-datepicker.css"
import { useTranslation } from "react-i18next"
import { DropdownItem, Input } from "reactstrap"
import "./styles.scss"
import useDevice from "hooks/useDevice"
import { useSelector } from "react-redux"

const optionsStatus = [
  { title: "mail.mail_all_mailboxes", value: "" },
  { title: "mail.mail_status_include_attachments", value: "isfile" },
  { title: "mail.mail_status_unread_mail", value: "new" },
  { title: "mail.mail_status_important_mail", value: "flag" },
]
export const getInitFilterStatus = (queryParams) => {
  if (queryParams?.["isfile"] && queryParams["isfile"] !== "") {
    return "isfile"
  } else if (queryParams?.["msgsig"] && queryParams["msgsig"] !== "") {
    return queryParams["msgsig"]
  }
  return ""
}

const MailStatus = (props) => {
  const { menu, onFilterChange, isReset, setIsReset, isMobileFilter } = props
  const { t } = useTranslation()

  const { isMobile } = useDevice()

  // redux state
  const queryParams = useSelector((state) => state.QueryParams.query)

  const [mailStatus, setMailStatus] = useState(() => getInitFilterStatus(queryParams))

  useEffect(() => {
    if (isReset) {
      setMailStatus("")
      setIsReset && setIsReset(false)
    }
  }, [isReset])

  const handleChangeStatus = (data) => {
    setMailStatus(data)
    if (data === "isfile") {
      onFilterChange && onFilterChange("status", "isfile", "true")
    } else {
      onFilterChange && onFilterChange("status", "msgsig", data)
    }
  }

  return (
    <BaseButtonDropdown
      content={t("mail.admin_mail_secure_approve_state")}
      classContent={`han-h5 han-fw-regular han-text-primary`}
      classDropdownMenu={""}
      // classDropdownToggle={"btn-no-active"}
      direction={isMobileFilter ? (!isMobile ? "left" : "down") : "down"}
      icon={`fas fa-chevron-${isMobileFilter ? "right" : "down"} text-secondary`}
    >
      {optionsStatus &&
        optionsStatus.length > 0 &&
        optionsStatus.map((item, index) => (
          <React.Fragment key={index}>
            <DropdownItem className={"w-100"} onClick={() => handleChangeStatus(item.value)}>
              <div className="form-check form-check-end">
                <Input
                  className="form-check-input"
                  id={`status-${index}`}
                  type="checkbox"
                  defaultChecked={item.value === mailStatus}
                  name="status"
                />
                <label className="han-h5 han-fw-regular han-text-primary form-check-label" htmlFor={`status-${index}`}>
                  {t(item.title)}
                </label>
              </div>
            </DropdownItem>
          </React.Fragment>
        ))}
    </BaseButtonDropdown>
  )
}

export default MailStatus
