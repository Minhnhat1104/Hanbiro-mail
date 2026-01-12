// @ts-nocheck
import React, { useState } from "react"

import { useTranslation } from "react-i18next"
import moment from "moment"

import { Dialog } from "components/Common/Dialog"
import useDevice from "hooks/useDevice"
import * as Utils from "utils"

import "./style.scss"
import { FilePreview } from "../FilePreview"
import HanFile from "../HanFile"
import FileListItem from "../HanFile/FileListitem"

function HanUploadFileContent({
  attachments = {},
  setAttachments = () => {},
  defaultAttachments = {},
  setDefaultAttachments = () => {},
  filesCloudDisk = {},
  setFilesCloudDisk = () => {},
  hideDelete = false,
  className = "",
  progress,
  style = {},
}) {
  const { t } = useTranslation()
  const { isMobile } = useDevice()

  // State
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState({
    isOpen: false,
    title: t("mail.mail_set_mailbox_delete"),
    content: t("common.approval_config_warn_delete"),
    buttons: [],
    centered: true,
  })
  const [previewFile, setPreviewFile] = useState({})

  const onDeleteFile = (file) => {
    let attachmentsNew = { ...attachments }
    delete attachmentsNew[file.fseq]
    setAttachments(attachmentsNew)
  }

  const deleteConfirmDialogPop = (deleteCallback, ...args) => {
    setDeleteConfirmDialog({
      ...deleteConfirmDialog,
      isOpen: true,
      buttons: [
        {
          text: t("mail.mail_write_discard"),
          onClick: () => {
            setDeleteConfirmDialog({ ...deleteConfirmDialog, isOpen: false })
          },
          color: "grey",
          isOutline: true,
        },
        {
          text: t("mail.mail_set_mailbox_delete"),
          onClick: () => {
            deleteCallback?.(...args)
            setDeleteConfirmDialog({ ...deleteConfirmDialog, isOpen: false })
          },
          color: "primary",
        },
      ],
    })
  }

  const onDeleteDefaultFile = (file) => {
    let attachmentsNew = { ...defaultAttachments }
    delete attachmentsNew[file.fseq]
    setDefaultAttachments(attachmentsNew)
  }

  const onPreviewHandle = (file) => {
    setPreviewFile({
      ...previewFile,
      isOpen: true,
      isLocalFile: true,
      file: file,
    })
  }

  const onDowloadClick = (file) => {
    const element = document.createElement("a")
    element.href = URL.createObjectURL(file.file)
    element.download = file.orgname
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const onDeleteFileLink = (index) => {
    let newFilesCloudDisk = [...filesCloudDisk]
    newFilesCloudDisk.splice(index, 1)

    setFilesCloudDisk(newFilesCloudDisk)
  }

  return (
    <div className={`pd-t-10 mail-upload-file ${className}`} style={style}>
      {Object.keys(defaultAttachments).length > 0 && (
        <div className="list-file ">
          {Object.keys(defaultAttachments).map((key) => {
            const file = defaultAttachments[key]
            return (
              <div key={key} className={`col-${isMobile ? "12" : "6"} p-0`}>
                <FileListItem
                  extension={file.ext_file}
                  name={file.orgname}
                  size={file.filesize}
                  onDelete={() => {
                    deleteConfirmDialogPop(onDeleteDefaultFile, file)
                  }}
                  buttonDisplay={{
                    preview: false,
                    delete: true,
                    download: false,
                    cloudDisk: false,
                  }}
                />
              </div>
            )
          })}
        </div>
      )}

      {Object.keys(attachments).length > 0 && (
        <div>
          {filesCloudDisk.length > 0 && (
            <span className="han-h5 fw-semibold">{t("common.upload_from_pc")}</span>
          )}
          <div
            className={`list-file d-flex justify-content-start py-0 gap-1 flex-wrap ${
              isMobile ? "flex-column" : "flex-row"
            }`}
          >
            {Object.keys(attachments).map((key) => {
              const file = {
                ...attachments[key],
                progress: progress?.[attachments[key]?.orgname],
              }
              const previewSupport = ["png", "jpg", "jpeg", "gif", "bmp", "pdf"]
              return (
                <div key={key} className={`col-12`}>
                  <FileListItem
                    extension={file.ext_file}
                    name={file.orgname}
                    size={file.filesize}
                    onDownload={() => onDowloadClick(file)}
                    onPreview={() => onPreviewHandle(file)}
                    onDelete={() => deleteConfirmDialogPop(onDeleteFile, file)}
                    progress={file.progress}
                    buttonDisplay={{
                      preview: previewSupport.includes(file.ext_file),
                      delete: true,
                      download: false,
                      cloudDisk: false,
                    }}
                  />
                </div>
              )
            })}
          </div>
        </div>
      )}

      {filesCloudDisk.length > 0 && (
        <div>
          {Object.keys(attachments).length > 0 && (
            <span className="han-h5 fw-semibold">{t("common.upload_from_clouddisk")}</span>
          )}
          <div
            className={`list-file d-flex justify-content-start gap-1 flex-wrap ${
              isMobile ? "flex-column" : "flex-row"
            }`}
          >
            {filesCloudDisk.map((file, index) => {
              const expire = moment(file.expire).format("MM/DD/YYYY")
              const nameFile = `${file.name} (${expire}, ${file.download})`
              return (
                <div key={index} className={`col-12`}>
                  <FileListItem
                    hideProgress
                    name={nameFile}
                    extension={Utils.getExtensionFile(file.name)}
                    size={Utils.humanFileSize(file.size)}
                    onDownload={() => onDowloadClick(file)}
                    onPreview={() => onPreviewHandle(file)}
                    onDelete={() => deleteConfirmDialogPop(onDeleteFileLink, index)}
                    buttonDisplay={{
                      preview: false,
                      delete: true,
                      download: false,
                      cloudDisk: false,
                    }}
                  />
                </div>
              )
            })}
          </div>
        </div>
      )}

      <Dialog {...deleteConfirmDialog} />

      <FilePreview
        {...previewFile}
        handleClose={() => {
          setPreviewFile({ isOpen: false })
        }}
      />
    </div>
  )
}

export default HanUploadFileContent
