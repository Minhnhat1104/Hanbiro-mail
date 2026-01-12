// @ts-nocheck
import React from "react"
import HanFile from "components/Common/Attachment/HanFile"
import { useTranslation } from "react-i18next"
import ListMode from "components/AttachmentMail/AttachmentMailList/ListMode"
import moment from "moment"
import { getExtensionFile, humanFileSize } from "utils"
import { Divider } from "@mui/material"

const ComposePreviewAttachment = ({ attachments, filesCloudDisk }) => {
  const { t } = useTranslation()
  return (
    <div className="d-flex flex-column py-3 px-2 gap-2">
      <Divider />
      {Object.keys(attachments).length > 0 && (
        <div className="mt-1">
          <h6>{t("common.board_attach_msg")}</h6>
          {Object.keys(attachments).length > 0 && (
            <div className="d-flex flex-column">
              {Object.keys(attachments).map(key => {
                const file = attachments[key]
                const previewSupport = [
                  "png",
                  "jpg",
                  "jpeg",
                  "gif",
                  "bmp",
                  "pdf",
                ]
                return (
                  <ListMode
                    key={key}
                    extension={file.ext_file}
                    item={{ ...file, name: file?.orgname }}
                    isShowButton={{
                      download: false,
                      preview: false,
                      delete: false,
                    }}
                  />
                )
              })}
            </div>
          )}
        </div>
      )}

      {filesCloudDisk.length > 0 && (
        <div className="mb-1">
          <h6 className="">{t("common.upload_from_clouddisk")}</h6>
          <div className="d-flex flex-column">
            {filesCloudDisk.map((file, index) => {
              const expire = moment(file.expire).format("MM/DD/YYYY")
              const nameFile = `${file.name} (${expire}, ${file.download})`
              return (
                <ListMode
                  key={index}
                  extension={getExtensionFile(file.name)}
                  item={{
                    ...file,
                    filesize: humanFileSize(file.size),
                    name: nameFile,
                  }}
                  isShowButton={{
                    download: false,
                    preview: false,
                    delete: false,
                  }}
                />
              )
            })}
          </div>
        </div>
      )}
      <Divider />
    </div>
  )
}

export default ComposePreviewAttachment
