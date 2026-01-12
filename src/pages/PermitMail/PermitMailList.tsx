// @ts-nocheck
import React from "react"

import { useNavigate } from "react-router-dom"
import { Input, Spinner } from "reactstrap"

import { NoData } from "components/Common"
import useDevice from "hooks/useDevice"
import { useTranslation } from "react-i18next"

const getMailStatusColor = (state) => {
  let mailStatus = ""
  let statusColor = ""

  if (state === "n") {
    mailStatus = "New"
    statusColor = "secondary"
  } else if (state === "u") {
    mailStatus = "Auto Approval"
    statusColor = "primary"
  } else if (state === "a") {
    mailStatus = "Done"
    statusColor = "success"
  } else if (state === "d") {
    mailStatus = "Reject"
    statusColor = "danger"
  } else {
    mailStatus = "Progressing"
    statusColor = "warning"
  }

  return { mailStatus, statusColor }
}

const getStatusPermit = (state, approvalUsers, isDesktop) => {
  let limitedApprovalUsers = approvalUsers.slice(0, 2)

  if (approvalUsers.length > 2) {
    if (isDesktop) {
      limitedApprovalUsers.push({ username: "..." })
    } else {
      limitedApprovalUsers = approvalUsers.slice(0, 1)
      limitedApprovalUsers.push({ username: "..." })
    }
  }

  const approvalView = limitedApprovalUsers.map((item) => item.username).join(", ")
  const { mailStatus, statusColor } = getMailStatusColor(state)

  return (
    <span
      className={`text-${statusColor} d-flex w-100 ${approvalUsers.length === 0 ? "d-none" : ""}`}
    >
      <span className="text-nowrap">{approvalView}</span>
      <span className={`text-${statusColor}`}>{`(${mailStatus})`}</span>
    </span>
  )
}

const getDate = (mail) => {
  const { statusColor } = getMailStatusColor(mail.state)

  return (
    <span>
      {mail.datetime}{" "}
      {mail?.approved_date != "" && (
        <span className={`text-${statusColor}`}>({mail?.approved_date})</span>
      )}
    </span>
  )
}

function PermitMailList({ loading, list, mailSelected, handleSelectMail }) {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { isDesktop, isMobile } = useDevice()

  // handler
  const handleGenerateUrlViewDetail = (msg_uuid, uuid) => {
    navigate(`/mail/list/Approval/${msg_uuid}_${uuid}`)
  }

  return (
    <div className="permit-mail-wrapper">
      {loading && list.length === 0 ? (
        <div className="d-flex justify-content-center align-items-center w-100 h-100">
          <Spinner color="primary" style={{ width: "2rem", height: "2rem" }} />
        </div>
      ) : (
        <div className={`permit-mail-list ${loading ? "loading" : ""}`}>
          {list.map((mail, index) => (
            <React.Fragment key={mail.uuid}>
              {isMobile ? (
                <div
                  className="d-flex flex-column px-2 pb-1 pt-2 border-bottom"
                  onPointerEnter={() => {
                    handleGenerateUrlViewDetail(mail.msg_uuid, mail.uuid)
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <Input
                      className="checkbox-wrapper-mail m-0 border-1 me-3"
                      type="checkbox"
                      id={mail.uuid}
                      value={mail.uuid}
                      onChange={() => {}}
                      onClick={(e) => handleSelectMail(e.target.value)}
                      checked={mailSelected.includes(mail.uuid)}
                    />
                    {/* status */}
                    {getStatusPermit(mail.mstate, mail.mseculist, isDesktop)}
                    {getStatusPermit(mail.state, [{ username: mail.approved_user }], isDesktop)}
                  </div>
                  <div className="d-flex justify-content-between py-2">
                    {/* subject */}
                    <div
                      className={`mail-subject ${
                        mail?.state === "n" ? "fw-bolder" : ""
                      } text-truncate`}
                      style={{ maxWidth: "200px" }}
                      onClick={() => {
                        handleGenerateUrlViewDetail(mail.msg_uuid, mail.uuid)
                      }}
                    >
                      <span
                        className={"subject-detail text-truncate"}
                        dangerouslySetInnerHTML={{
                          __html: mail.subject || t("mail.mail_summary_msg"),
                        }}
                      />
                    </div>
                    {/* date */}
                    <div className="mail-date">
                      <span>{mail.datetime}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="permit-item">
                  <Input
                    className="checkbox-wrapper-mail m-0 border-1 me-3"
                    type="checkbox"
                    id={mail.uuid}
                    value={mail.uuid}
                    onChange={() => {}}
                    onClick={(e) => handleSelectMail(e.target.value)}
                    checked={mailSelected.includes(mail.uuid)}
                  />

                  {/* sender */}
                  <div className="mail-sender">
                    <span className="text-truncate">{mail.userid}</span>
                  </div>

                  {/* subject */}
                  <div
                    className={`mail-subject ${
                      mail?.state === "n" ? "fw-bolder" : ""
                    } text-truncate`}
                    style={{ maxWidth: "200px" }}
                    onClick={() => {
                      handleGenerateUrlViewDetail(mail.msg_uuid, mail.uuid)
                    }}
                  >
                    <span
                      className={"subject-detail text-truncate"}
                      dangerouslySetInnerHTML={{
                        __html: mail.subject || t("mail.mail_summary_msg"),
                      }}
                    />
                  </div>

                  {/* status */}
                  <span className="mail-status text-truncate">
                    {getStatusPermit(mail.mstate, mail.mseculist, isDesktop)}
                  </span>
                  <span className="mail-status text-truncate">
                    {getStatusPermit(mail.state, [{ username: mail.approved_user }], isDesktop)}
                  </span>

                  {/* date */}
                  <div className="mail-date">{getDate(mail)}</div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      )}
      {list.length === 0 && <NoData />}
    </div>
  )
}

export default PermitMailList
