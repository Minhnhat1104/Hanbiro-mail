// @ts-nocheck
// React
import React, { useContext, useState, useMemo } from "react"

// Third-party
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"

// Project
import { emailDelete, emailGet } from "helpers/email_api_helper"
import AttachmentMailList from "./AttachmentMailList"
import { useCustomToast } from "hooks/useCustomToast"
import { MailContext } from "pages/Detail"
import { URL_DEL_ATTACH } from "modules/mail/common/urls"
import { useParams } from "react-router-dom"
import { shareboxHelper } from "components/Common/ComposeMail"
import { selectMenuConfig } from "store/auth/config/selectors"
import useDevice from "hooks/useDevice"
import { BaseIcon, BaseButton } from "components/Common"
import { DetailNewWindowContext } from "pages/Detail/DetailForNewWindow"

const GRID_MODE_FILE_SIZE = 6
const LIST_MODE_FILE_SIZE = 4

const AttachmentMail = ({
  initMail,
  gridMode = true,
  isOpen = false,
  isChangeAttView,
  handleActionModal = () => {},
  onPreviewHandle = () => {},
  onDeleteFile = () => {},
  mailPermit = {},
  securePassword,
  isNewWindow,
  ...props
}) => {
  const menuConfig = useSelector(selectMenuConfig)
  const { mail: mailContext, mid } = useContext(isNewWindow ? DetailNewWindowContext : MailContext)
  const { t } = useTranslation()
  const [openList, setOpenList] = useState(isOpen)
  const { successToast, errorToast } = useCustomToast()
  const { isMobile } = useDevice()
  const urlParams = useParams()

  const mail = initMail || mailContext || mailPermit // Get mail data

  const isSpam = mail?.acl === "Spam"

  const canSaveCloudDisk = useMemo(() => {
    const checkCloudDisk = menuConfig.filter((menu) => menu.name === "disk")
    return checkCloudDisk.length > 0 && !isSpam ? true : false
  }, [menuConfig, isSpam])

  // Handle download all files
  const handleBulkDownload = (acl, mid, tmpname, event) => {
    if (event) {
      event.stopPropagation()
      event.preventDefault()
    }

    let strLink =
      "/cgi-bin/NEW/dn.do?action=multi" + "&acl=" + acl + "&mid=" + mid + "&tmpname=" + tmpname

    if (acl === "Secure") {
      strLink += "&set_password=" + securePassword
    }

    const shareboxParsedMenu = shareboxHelper?.shareboxParser(urlParams?.menu ?? "")
    if (shareboxParsedMenu?.isShare) {
      strLink += "&shareid=" + shareboxParsedMenu?.shareid
    }

    const url = window.location.protocol + "//" + window.location.hostname + strLink
    const win = window.open(url, "_blank")
    win.focus()
  }

  // Handle download a file
  const handleDownloadFile = (fileLink) => {
    if (fileLink) {
      const url = window.location.protocol + "//" + window.location.hostname + fileLink
      const win = window.open(url, "_blank")
      if (win && typeof win.focus !== "undefined") {
        win.focus()
      }
    }
    return
  }

  // Handle preview a file
  const handlePreviewFile = async (filePreview) => {
    onPreviewHandle?.(filePreview)
  }

  // Handle delete a file
  const handleDeleteFile = async (acl, mid, ii) => {
    try {
      const res = await emailDelete([URL_DEL_ATTACH, acl, mid, ii].join("/"))
      if (res.success) {
        successToast()
      }
    } catch (err) {
      errorToast()
    }
  }

  const onSaveCloudDisk = async (link) => {
    try {
      var url = link.replace("dn.do?action=download", "mailTohtml5.do?act=moveCloud")
      const res = await emailGet(url)
      if (res && res.success) {
        successToast(t("common.alert_success_msg"))
      } else {
        errorToast(t("mail.mail_alert_spam_settings_title_fail"))
      }
    } catch (err) {
      errorToast()
    }
  }

  return (
    <>
      <div className="d-flex align-items-center cursor-pointer mt-1">
        <div
          className={`d-flex align-items-center ${gridMode && "attachment-divider"}`}
          onClick={() => setOpenList(!openList)}
        >
          <span className="mb-0 han-body2 han-text-secondary">
            {t("common.board_attach_msg")} ({mail?.file?.length} {t("common.common_files")},{" "}
            {mail?.fileinfo?.totsize})
          </span>
          <BaseButton className="p-0 border-0 bg-transparent font-size-17 text-muted">
            <i className={`mdi mdi-chevron-${openList ? "up" : "down"}`}></i>
          </BaseButton>
        </div>
        {!isSpam && mail?.file?.length > 1 && (
          <>
            {gridMode && (
              <BaseButton
                outline
                color="primary"
                size="sm"
                className={`align-items-center mx-3 rounded-2`}
                onClick={(event) =>
                  handleBulkDownload(mail?.acl, mid ?? mail?.spamId, mail?.tmpname, event)
                }
              >
                <div className="d-flex align-items-center gap-1">
                  <i className="mdi mdi-download"></i>
                  {!isMobile && (
                    <span className="han-body2 han-fw-medium">
                      {t("common.bulk_download_label")}
                    </span>
                  )}
                </div>
              </BaseButton>
            )}
            {!gridMode && (
              <BaseIcon
                onClick={(event) =>
                  handleBulkDownload(mail?.acl, mid ?? mail?.spamId, mail?.tmpname, event)
                }
                className="mdi mdi-download cursor-pointer"
              />
            )}
          </>
        )}
      </div>

      {/* Attachment List */}
      {openList && (
        <div
          className={`mt-2 ${
            gridMode
              ? mail?.file?.length > GRID_MODE_FILE_SIZE
                ? "attachment-scroll"
                : ""
              : mail?.file?.length > LIST_MODE_FILE_SIZE
              ? "attachment-scroll"
              : ""
          }`}
        >
          <AttachmentMailList
            mailList={mail?.file ?? []}
            gridMode={gridMode}
            isChangeAttView={isChangeAttView}
            onActionModal={handleActionModal}
            onDownload={handleDownloadFile}
            onPreview={handlePreviewFile}
            onDelete={handleDeleteFile}
            canSaveCloudDisk={canSaveCloudDisk}
            onSaveCloudDisk={onSaveCloudDisk}
            {...props}
          />
        </div>
      )}
    </>
  )
}

export default AttachmentMail
