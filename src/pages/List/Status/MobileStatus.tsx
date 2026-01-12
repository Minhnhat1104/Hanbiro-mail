// @ts-nocheck
import { List, ListItemButton, Popover } from "@mui/material"
import { BaseIcon } from "components/Common"
import React, { useEffect, useRef, useState } from "react"
import "react-datepicker/dist/react-datepicker.css"
import { useTranslation } from "react-i18next"
import { Input } from "reactstrap"
import "./styles.scss"
import { getInitFilterStatus } from "."
import { useSelector } from "react-redux"

const optionsStatus = [
  { title: "mail.mail_all_mailboxes", value: "" },
  { title: "mail.mail_status_include_attachments", value: "isfile" },
  { title: "mail.mail_status_unread_mail", value: "new" },
  { title: "mail.mail_status_important_mail", value: "flag" },
]

const MobileStatus = (props) => {
  const { menu, onFilterChange, isReset, setIsReset } = props
  const { t } = useTranslation()

  // redux state
  const queryParams = useSelector((state) => state.QueryParams.query)

  const statusRef = useRef()

  const [openStatus, setOpenStatus] = useState(false)
  const [mailStatus, setMailStatus] = useState(() => getInitFilterStatus(queryParams))

  // useEffect(() => {
  //   setMailStatus("")
  // }, [menu])

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
    setOpenStatus(false)
  }

  return (
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
                <ListItemButton className={"w-100"} onClick={() => handleChangeStatus(item.value)}>
                  <div className="form-check form-check-end">
                    <Input
                      className="form-check-input"
                      id={`status-${index}`}
                      type="checkbox"
                      defaultChecked={item.value === mailStatus}
                      name="status"
                    />
                    <label className="form-check-label" htmlFor={`status-${index}`}>
                      {t(item.title)}
                    </label>
                  </div>
                </ListItemButton>
              </React.Fragment>
            ))}
        </List>
      </Popover>
    </>
  )
}

export default MobileStatus
