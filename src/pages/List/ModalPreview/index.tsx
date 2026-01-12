// @ts-nocheck
import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { BaseModal, BaseButton } from "components/Common"
import { getEmailPreview } from "modules/mail/list/api"
import HanIconFile from "components/Common/Attachment/HanIconFile"
import { getExtensionFile } from "utils"
import { BASE_URL } from "helpers/email_api_helper"
import "./styles.scss"
import { Dialog } from "components/Common/Dialog"
import { FilePreview } from "components/Common/Attachment/FilePreview"
import Loading from "components/Common/Loading"
import HanTooltip from "components/Common/HanTooltip"
import { moveToCloudDisk } from "modules/mail/common/api"
import { useCustomToast } from "hooks/useCustomToast"
import { URL_GET_EMAIL_PREVIEW } from "modules/mail/list/urls"
import { shareboxHelper } from "components/Common/ComposeMail"

const ModalPreview = ({
  isOpen,
  setIsOpen,
  menu,
  currentMid,
  setCurrentMid,
  currentAcl,
  onCallbackDelete,
}) => {
  const { t } = useTranslation()
  const { successToast, errorToast } = useCustomToast()

  const isSecureMenu = menu === "Secure"
  const isShareMenu = menu.indexOf("HBShare_") === 0 ? true : false

  // state
  const [previewContent, setPreviewContent] = useState("")
  const [previewData, setPreviewData] = useState({})
  const [actionModal, setActionModal] = useState({
    isOpen: false,
    title: "Action Modal",
    content: "Are you sure you want to continue?",
    buttons: [],
    centered: true,
  })
  const [previewFile, setPreviewFile] = useState({})
  const [loading, setLoading] = useState(false)
  const [loadingCloud, setLoadingCloud] = useState({
    file: "",
    isLoading: false,
  })

  useEffect(() => {
    if (currentMid != "") {
      setIsOpen(true)
      setLoading(true)
      let arr = menu.split("_")
      const acl = arr[arr.length - 1]
      const url = [URL_GET_EMAIL_PREVIEW, acl, currentMid, menu].join(["/"])
      getEmailPreview(url).then((res) => {
        setLoading(false)
        setPreviewData(res)
      })
    } else {
      setIsOpen(false)
    }
  }, [currentMid, menu])

  useEffect(() => {
    if (previewData) {
      let nContent = previewData?.memo
      if (isSecureMenu && previewData?.memo == "Content-Type: text/plain; charset=UTF-8 None") {
        nContent = t("mail.mail_secure_mail_password")
      }
      setPreviewContent(nContent)
    }
  }, [previewData])

  const toggle = () => {
    setIsOpen(!isOpen)
    setCurrentMid("")
  }

  // modal confirm
  const handleActionModal = (type = "Action Modal", actionCallback, ...args) => {
    setActionModal({
      ...actionModal,
      isOpen: true,
      title: type,
      buttons: [
        {
          text: t("mail.mail_view_continue_msg"),
          onClick: () => {
            actionCallback?.(...args)
            setActionModal({ ...actionModal, isOpen: false })
          },
          color: "primary",
        },
        {
          text: t("common.common_cancel"),
          onClick: () => {
            setActionModal({ ...actionModal, isOpen: false })
          },
        },
      ],
    })
  }

  // Handle download a file
  const handleDownloadFile = (fileLink) => {
    if (fileLink) {
      const url = [BASE_URL, fileLink, isShareMenu ? menu : ""].join("")
      const win = window.open(url, "_blank")
      if (win && typeof win.focus !== "undefined") {
        win.focus()
      }
    }
    return
  }

  const handlePreviewFile = (file) => {
    if (!file) return
    setPreviewFile({
      ...previewFile,
      isOpen: true,
      isLocalFile: false,
      file: file,
      isShareMenu,
    })
  }

  const handleMovetoCloudDisk = (file) => {
    if (!file) return
    const params = {
      act: "moveCloud",
      filename: file.name,
      mid: currentMid,
      acl: currentAcl,
      charset: "utf8",
      count: 0,
      set_password: "",
      securekey: "",
      mii: "",
      shareid: isShareMenu ? menu : "",
    }
    setLoadingCloud({ file: file.name, isLoading: true })
    moveToCloudDisk(params)
      .then((res) => {
        if (res.success === "1") {
          successToast(t("mail.task_journal_saved_to_webdisk"))
        } else {
          if (isShareMenu) {
            errorToast(t("mail.mail_no_permission"))
          } else {
            errorToast()
          }
        }
      })
      .catch((err) => {
        errorToast(err)
      })
      .finally(() => {
        // setCurrentMid("")
        // setIsOpen(false)
        setLoadingCloud({ file: file.name, isLoading: false })
      })
  }

  const handleDownloadAllZip = () => {
    let _passToPrint = ""
    let strLink =
      "/cgi-bin/NEW/dn.do?action=multi&acl=" +
      menu +
      "&mid=" +
      currentMid +
      "&tmpname=" +
      previewData.fileresult.tmpName
    if (menu == "Secure") {
      strLink += "&set_password=" + _passToPrint
    }
    if (shareboxHelper.isSharebox(menu)) {
      strLink += "&shareid=" + shareboxHelper.shareboxParser(menu).shareid
    }
    const url = window.location.protocol + "//" + window.location.hostname + strLink
    const win = window.open(url, "_blank")
    win.focus()
  }

  const isFileReview = (file) => {
    return isNotShareViewEml(file) && (file.preview !== "" || file.preview2 !== "" ? true : false)
  }

  const isNotShareViewEml = (file) => {
    try {
      if (!shareboxHelper.isSharebox(menu)) return true
      const preview = file.preview2
      if (preview.indexOf("/email/emlview") === 0) return false
      return true
    } catch (error) {
      return true
    }
  }

  const getThumbnail = (file) => {
    if (file.thumbnail) {
      let strLink = ""
      if (shareboxHelper.isSharebox(menu)) {
        strLink = "shareid=" + shareboxHelper.shareboxParser(menu).shareid
      }
      return `${BASE_URL}${strLink ? file.thumbnail.replace("shareid=", strLink) : file.thumbnail}`
    }
    return ""
  }

  return (
    <BaseModal
      modalClass="list-preview"
      isOpen={isOpen}
      toggle={toggle}
      renderHeader={() => {
        return <span>{t("common.board_office_preview_msg")}</span>
      }}
      renderBody={() => {
        return (
          <div className="position-relative">
            {loading && <Loading className={"p-0"} />}
            <div
              className="text-muted mb-3"
              dangerouslySetInnerHTML={{ __html: previewContent }}
              style={{ wordWrap: "break-word" }}
            />
            <>
              {previewData?.fileresult?.filehash &&
                previewData?.fileresult?.filehash?.length > 0 && (
                  <p>
                    {`${t("common.approval_draft_attachfile")} (${
                      previewData?.fileresult?.fileinfo?.totcount
                    } ${t("common.common_files")}, ${previewData?.fileresult?.fileinfo?.totsize})`}
                    <i
                      onClick={() => handleDownloadAllZip()}
                      className="mdi mdi-zip-box cursor-pointer"
                    ></i>
                  </p>
                )}
              <div className="list-attachment custom-scroll pe-1">
                {previewData?.fileresult?.filehash &&
                  previewData?.fileresult?.filehash?.length > 0 &&
                  previewData?.fileresult?.filehash.map((file) => {
                    const extension = getExtensionFile(file.name)
                    return (
                      <div key={file.link} className="file-item border rounded p-2 mb-2">
                        <div className="file-ex-img me-1 h-100 overflow-hidden">
                          {extension === "jpg" ||
                          extension === "png" ||
                          extension === "jpeg" ||
                          extension === "gif" ||
                          extension === "bmp" ? (
                            <img src={getThumbnail(file)} alt="" />
                          ) : (
                            <HanIconFile extension={extension} />
                          )}
                        </div>
                        <div className="file-info">
                          <span className="file-name">{file.name}</span>
                          <span className="">{file.filesize}</span>
                        </div>
                        <div className="d-flex">
                          {/* download */}
                          <HanTooltip placement="top" overlay={t("common.board_download_msg")}>
                            <i
                              onClick={() =>
                                handleActionModal(
                                  t("common.board_download_msg"),
                                  handleDownloadFile,
                                  file.link,
                                )
                              }
                              className={`bx bxs-download font-size-16 me-3 ${
                                file.link ? "cursor-pointer" : "cursor-not-allow"
                              } `}
                            />
                          </HanTooltip>
                          {/* move to clouddisk */}
                          <HanTooltip placement="top" overlay={t("common.board_webdisk_add_msg")}>
                            {loadingCloud.isLoading && file?.name === loadingCloud.file ? (
                              <i className={`bx bx-loader bx-spin font-size-16 me-3`} />
                            ) : (
                              <i
                                onClick={() => handleMovetoCloudDisk(file)}
                                className="bx bx-cloud-upload font-size-18 me-3 cursor-pointer"
                              />
                            )}
                          </HanTooltip>
                          {/* preview */}
                          {isFileReview(file) && (
                            <HanTooltip
                              placement="top"
                              overlay={t("common.board_office_preview_msg")}
                            >
                              <i
                                onClick={() => handlePreviewFile(file)}
                                className="bx bx-search font-size-16 cursor-pointer"
                              />
                            </HanTooltip>
                          )}
                        </div>
                      </div>
                    )
                  })}
              </div>
            </>
            {actionModal.isOpen && <Dialog {...actionModal} />}
            {previewFile.isOpen && (
              <FilePreview
                {...previewFile}
                handleClose={() => {
                  setPreviewFile({ isOpen: false })
                }}
                menu={menu}
              />
            )}
          </div>
        )
      }}
      renderFooter={() => {
        return (
          <span className={"d-flex w-100 justify-content-center"}>
            <BaseButton outline color={"secondary"} onClick={toggle}>
              {t("common.common_btn_close")}
            </BaseButton>
          </span>
        )
      }}
      size={"md"}
    />
  )
}

export default ModalPreview
