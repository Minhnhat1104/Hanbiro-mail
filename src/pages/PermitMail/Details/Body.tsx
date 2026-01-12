// @ts-nocheck
import { FilePreview } from "components/Common/Attachment/FilePreview"
import BaseTable from "components/Common/BaseTable"
import { useCustomToast } from "hooks/useCustomToast"
import React, { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap"
import { formatEmailFrom, formatEmailTo } from "utils"
import { viewState } from "."
import HanTooltip from "components/Common/HanTooltip"
import { BaseButton, BaseIcon, BaseModal } from "components/Common"
import AttachmentMail from "components/AttachmentMail"
import MailInfo from "./MailInfo"
import { useSelector } from "react-redux"

const Body = ({ mail, handlePermitMail }) => {
  const { t } = useTranslation()
  const { menu, mid: midKey } = useParams()
  const mid = midKey.split("_")[1]
  const { successToast, errorToast } = useCustomToast()

  const isIframeMode = useSelector((state) => state.viewMode.isIframeMode)

  // State
  const [previewFile, setPreviewFile] = useState({})
  const [previewApproval, setPreviewApproval] = useState(false)
  const [showMore, setShowMore] = useState({
    type: "to",
    open: false,
    data: null,
  })
  const handleShowMore = (type, data) => {
    setShowMore((prev) => ({
      type,
      open: !prev.open,
      data,
    }))
  }

  const onPreviewHandle = (file) => {
    setPreviewFile({
      ...previewFile,
      isOpen: true,
      isLocalFile: false,
      file: file,
    })
  }

  // Format "From" information
  const { emailRegex: emailFromRegex, emailFromArr } = formatEmailFrom(mail?.from)

  // Format "To" information
  const { emailRegex: emailToRegex, emailTo, checkEmailTo } = formatEmailTo(mail?.to, mail?.myeamil)
  // Format "CC" information
  const {
    emailRegex: emailCCRegex,
    emailTo: emailCC,
    checkEmailTo: checkEmailCC,
  } = formatEmailTo(mail?.cc, mail?.myeamil)

  // Format "BCC" information
  const {
    emailRegex: emailBCCRegex,
    emailTo: emailBCC,
    checkEmailTo: checkEmailBCC,
  } = formatEmailTo(mail?.bcc, mail?.myeamil)

  const getStatus = (status) => {
    return t(viewState[status])
  }

  const getTags = (user) => {
    let mailStatus = ""
    let statusColor = ""
    switch (user.state) {
      case "a":
        mailStatus = "Approved"
        statusColor = "success"
        break
      case "d":
        mailStatus = "Reject"
        statusColor = "danger"
        break
      default:
        mailStatus = "New"
        statusColor = "primary"
        break
    }

    return <span className={`bg-${statusColor} rounded-1 text-white px-2`}>{mailStatus}</span>
  }

  const headerTable = useMemo(() => {
    return [
      {
        content: t("mail.mail_admin_spam_manager_status"),
      },
      {
        content: t("mail.mail_reason"),
      },
      {
        content: t("mail.mail_sent_user"),
      },
      {
        content: t("mail.mail_admin_mid_permitter"),
      },
      {
        content: t("mail.mail_final_approver"),
      },
      {
        content: t("mail.mail_permitted_date"),
      },
      // {
      //   content: t("common.main_approval_menu"),
      // },
    ]
  }, [])

  const rowsTable = useMemo(() => {
    return [
      {
        columns: [
          {
            className: "align-middle",
            content: <div>{getStatus(mail?.approval?.state)}</div>,
          },
          {
            className: "align-middle",
            content: <div>{mail?.approval.deny_reason}</div>,
          },
          {
            className: "align-middle",
            content: <div>{mail?.approval.userid}</div>,
          },
          {
            className: "align-middle",
            content: (
              <div>
                {mail?.approval.mseculist.map((item) => (
                  <div key={item.userid} className="my-1">
                    {getTags(item)}
                    <span className="ms-2">{item.username}</span>
                  </div>
                ))}
              </div>
            ),
          },
          {
            className: "align-middle",
            content: <div>{mail?.approval.approved_user}</div>,
          },
          {
            className: "align-middle",
            content: <div>{mail?.approval.approved_date}</div>,
          },
          // {
          //   className: "align-middle",
          //   content: (
          //     <>
          //       {mail?.approval.approved_date === "" && (
          //         <div className="d-flex align-items-center justify-content-center">
          //           {/* Permit */}
          //           <HanTooltip placement="top" overlay={t("mail.mail_secure_allow_btn")}>
          //             <BaseIcon
          //               className="han-color-success me-3"
          //               icon="mdi mdi-check font-size-22"
          //               onClick={() => handlePermitMail && handlePermitMail("allow")}
          //             />
          //           </HanTooltip>
          //
          //           {/* Deny */}
          //           <HanTooltip placement="top" overlay={t("mail.mail_secure_deny_btn")}>
          //             <BaseIcon
          //               style={{ height: "33px" }}
          //               className="han-color-error d-flex align-items-center"
          //               icon="fa fa-ban fw-semibold font-size-18"
          //               onClick={() => handlePermitMail && handlePermitMail("deny")}
          //             />
          //           </HanTooltip>
          //         </div>
          //       )}
          //     </>
          //   ),
          // },
        ],
      },
    ]
  }, [mail])

  return (
    <>
      <MailInfo
        mail={mail}
        showMore={showMore}
        handleShowMore={handleShowMore}
        handlePermitMail={handlePermitMail}
        handlePreviewApproval={setPreviewApproval}
      />

      {/* Attachment File with Grid mode */}
      {mail?.file?.length > 0 && (
        <AttachmentMail
          gridMode={true}
          isOpen={true}
          mailPermit={mail}
          onPreviewHandle={onPreviewHandle}
          // handleActionModal={handleActionModal}
        />
      )}

      <div
        className="text-muted my-2 overflow-x-hidden overflow-y-scroll"
        dangerouslySetInnerHTML={{ __html: mail?.contents }}
        style={{ height: `calc(100vh - 260px ${isIframeMode ? " - 65px" : " - 5px"})` }}
      />

      {/* Attachment File with List mode */}
      {mail?.file?.length > 0 && (
        <AttachmentMail
          onPreviewHandle={onPreviewHandle}
          gridMode={false}
          isOpen={true}
          mailPermit={mail}
          // handleActionModal={handleActionModal}
        />
      )}

      {/* Preview file modal */}
      <FilePreview
        {...previewFile}
        handleClose={() => {
          setPreviewFile({ isOpen: false })
        }}
      />

      {previewApproval && (
        <BaseModal
          isOpen={previewApproval}
          size="auto"
          modalClass="base-file-preview-modal"
          bodyClass="base-file-preview-modal-scroll"
          contentClass="auto-size-modal"
          toggle={() => setPreviewApproval(false)}
          renderHeader={() => <>{t("common.board_office_preview_msg")}</>}
          renderBody={() => (
            <>
              <div className="w-100 overflow-y-auto">
                <BaseTable heads={headerTable} rows={rowsTable} />
              </div>
            </>
          )}
        />
      )}
    </>
  )
}

export default Body
