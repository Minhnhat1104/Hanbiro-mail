// @ts-nocheck
// React
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from "react"

// Third-party
import { useTranslation } from "react-i18next"

// Project
import HanUploadFileButton from "../HanUploadFileButton"
import HanUploadFileContent from "../HanUploadFileContent"
import { generateUUID } from "../HanModalClouddisk/utils"
import useAttachment from "./useAttachment"
import BaseButton from "components/Common/BaseButton"

import "./style.scss"
import { useSelector } from "react-redux"
import { formatFileSize } from "utils"
import { Nav, NavItem } from "reactstrap"
import { isEmpty, isEqual } from "lodash"

const HanAttachment = (
  {
    value,
    onAttachmentsChange = ({ attachments: {}, filesCloudDisk: [] }) => {},
    fileAccepted = [],
    maxSize = 50,
  },
  ref,
) => {
  const { t } = useTranslation()

  const globalConfig = useSelector((state) => state.Config.globalConfig)

  const [attachments, setAttachments] = useState({})
  const [filesCloudDisk, setFilesCloudDisk] = useState([])
  const [maxUpload, setMaxUpload] = useState(maxSize)
  const [progress, setProgress] = useState(null)

  const uuid = useMemo(() => `mail_${generateUUID()}`, [])
  const { uploadFileGroupware } = useAttachment()

  // Handle to get progress when uploading
  const onUploadProgressCallback = (progressEvent, param) => {
    if (progressEvent && progressEvent?.progress) {
      const percent = Math.round(progressEvent?.progress * 100)
      Object.values(attachments).forEach((item) => {
        const { orgname } = item
        if (param.get("name") === orgname) {
          setProgress((prevProgress) => ({
            ...prevProgress,
            [orgname]: percent,
          }))
        }
      })
    }
  }

  useImperativeHandle(
    ref,
    () => {
      return {
        getFiles: () => {
          return { attachments, filesCloudDisk }
        },
        uploadAndGetFiles: async () => {
          const resultUpload = []
          const attachmentsArray = Object.values(attachments)
          for (const item of attachmentsArray) {
            const data = await uploadFileGroupware(item, uuid, onUploadProgressCallback)
            resultUpload.push(data)
          }
          return { attachments: resultUpload, filesCloudDisk }
        },
        getUuid: () => uuid,
      }
    },
    [attachments, filesCloudDisk, uuid, onUploadProgressCallback],
  )

  const totalSelectedPCFilesSize = useMemo(() => {
    return Object.values(attachments).reduce((acc, file) => acc + file?.file?.size, 0)
  }, [attachments])

  useEffect(() => {
    if (!isEmpty(value)) {
      if (!isEqual(value.attachments, attachments)) setAttachments(value.attachments)
      if (!isEqual(value.filesCloudDisk, filesCloudDisk)) setFilesCloudDisk(value.filesCloudDisk)
    }
  }, [value])

  useEffect(() => {
    const maxUploadSetting = globalConfig?.upload_setting?.max_upload
    // maxUploadSetting is in MB => convert to bytes
    maxUploadSetting && setMaxUpload(maxUploadSetting * 1024 * 1024)
  }, [globalConfig])

  useEffect(() => {
    if (!isEmpty(attachments) || !isEmpty(filesCloudDisk))
      onAttachmentsChange && onAttachmentsChange({ attachments, filesCloudDisk })
  }, [attachments, filesCloudDisk])

  const [mode, setMode] = useState("PC") //prototype "PC" | "Cloudisk"

  return (
    <div className="attachment-section">
      <Nav tabs className="attachment-tab border-0 position-relative mb-2">
        <NavItem active={mode === "PC"} className="cursor-pointer" onClick={() => setMode("PC")}>
          {t("common.upload_from_pc")}
        </NavItem>
        <NavItem
          active={mode === "Cloudisk"}
          className="cursor-pointer"
          onClick={() => setMode("Cloudisk")}
        >
          {t("common.upload_from_clouddisk")}
        </NavItem>
        {/* size upload */}
        <div className="size-upload d-flex justify-content-end position-absolute">
          <span className="han-h5 han-fw-medium">{`${
            totalSelectedPCFilesSize ? formatFileSize(totalSelectedPCFilesSize) : "0 B"
          } / ${maxUpload ? formatFileSize(maxUpload) : "0 B"}`}</span>
        </div>
      </Nav>

      <HanUploadFileButton
        setFilesCloudDisk={(files) => {
          setFilesCloudDisk([...filesCloudDisk, ...files])
        }}
        setAttachments={(att) => setAttachments((prev) => ({ ...prev, ...att }))}
        mode={mode}
        fileAccepted={fileAccepted}
        maxSize={maxUpload}
        attachments={attachments}
      />
      {(!isEmpty(attachments) || !isEmpty(filesCloudDisk)) && (
        <HanUploadFileContent
          attachments={attachments}
          setAttachments={setAttachments}
          filesCloudDisk={filesCloudDisk}
          setFilesCloudDisk={setFilesCloudDisk}
          progress={progress}
        />
      )}
    </div>
  )
}

export default forwardRef(HanAttachment)
