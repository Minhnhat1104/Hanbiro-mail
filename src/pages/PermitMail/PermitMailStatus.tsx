// @ts-nocheck
import { List, ListItemButton, Popover } from "@mui/material"
import { BaseButtonDropdown, BaseIcon } from "components/Common"
import queryString from "query-string"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { DropdownItem, Input } from "reactstrap"

const optionsStatus = [
  { label: "mail.all", value: "" },
  { label: "mail.mail_list_newmail", value: "n" },
  { label: "mail.mail_secure_allow", value: "a" },
  { label: "mail.mail_secure_deny", value: "d" },
  { label: "mail.mail_secure_recall", value: "r" },
  { label: "mail.mail_secure_auto_allow", value: "u" },
  { label: "mail.mail_interim_approval_in_progress", value: "m" },
  { label: "mail.mail_interim_approval_decline", value: "z" },
  { label: "mail.mail_interim_approval_complete", value: "t" },
]

const initFilterStatus = (params) => {
  return optionsStatus.find((item) => item.value === (params?.state || ""))?.value
}

const PermitMailStatus = (props) => {
  const { menu, onFilterChange, isReset, setIsReset, direction, isMobileFilter } = props
  const { t } = useTranslation()

  const statusRef = useRef()

  const query = useMemo(() => {
    return queryString.parse(location.search)
  }, [location.search])

  const [openStatus, setOpenStatus] = useState(false)
  const [mailStatus, setMailStatus] = useState(() => initFilterStatus(query))

  // useEffect(() => {
  //   setMailStatus("n")
  // }, [menu])

  useEffect(() => {
    if (isReset) {
      setMailStatus("n")
      setIsReset && setIsReset(false)
    }
  }, [isReset])

  const handleChangeStatus = (data) => {
    setMailStatus(data)
    onFilterChange && onFilterChange("status", data)
    isMobileFilter && setOpenStatus(false)
  }

  return (
    <>
      {isMobileFilter ? (
        <>
          <div
            ref={statusRef}
            className={"p-2 d-flex justify-content-between align-items-center w-100"}
            onClick={() => setOpenStatus((prev) => !prev)}
          >
            {t("mail.admin_mail_secure_approve_state")}
            <BaseIcon
              icon={`fas fa-chevron-${openStatus ? "down" : "right"} text-secondary`}
              className={"ms-1"}
            />
          </div>
          <Popover
            id={`sort-popover`}
            open={openStatus}
            onClose={() => setOpenStatus((prev) => !prev)}
            anchorEl={statusRef.current}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            sx={{
              "& .MuiPopover-paper": {
                p: 0.5,
                boxShadow:
                  "0px 10px 13px -6px rgba(0,0,0,0.2),0px 20px 100px 3px rgba(0,0,0,0.14),0px 8px 200px 7px rgba(0,0,0,0.12)",
              },
            }}
          >
            <List
              component="nav"
              sx={{
                p: 0,
                width: 200,
                borderRadius: 0.5,
              }}
            >
              {optionsStatus &&
                optionsStatus.length > 0 &&
                optionsStatus.map((item, index) => (
                  <React.Fragment key={index}>
                    <ListItemButton
                      className={"w-100"}
                      onClick={() => handleChangeStatus(item.value)}
                    >
                      <div className="form-check form-check-end">
                        <Input
                          className="form-check-input"
                          id={`status-${index}`}
                          type="checkbox"
                          defaultChecked={item.value === mailStatus}
                          name="status"
                        />
                        <label className="form-check-label" htmlFor={`status-${index}`}>
                          {t(item.label)}
                        </label>
                      </div>
                    </ListItemButton>
                  </React.Fragment>
                ))}
            </List>
          </Popover>
        </>
      ) : (
        <BaseButtonDropdown
          content={t("mail.admin_mail_secure_approve_state")}
          classDropdownMenu={""}
          // classDropdownToggle={"btn-no-active"}
          direction={direction}
        >
          {optionsStatus &&
            optionsStatus.length > 0 &&
            optionsStatus.map((item, index) => (
              <React.Fragment key={item.label}>
                <DropdownItem className={""} onClick={() => handleChangeStatus(item.value)}>
                  <div className="form-check form-check-end">
                    <input
                      className="form-check-input"
                      id={`status-${index}`}
                      type="checkbox"
                      defaultChecked={item.value === mailStatus}
                      name="status"
                    />
                    <label className="form-check-label" htmlFor={`status-${index}`}>
                      {t(item.label)}
                    </label>
                  </div>
                </DropdownItem>
              </React.Fragment>
            ))}
        </BaseButtonDropdown>
      )}
    </>
  )
}

export default PermitMailStatus
