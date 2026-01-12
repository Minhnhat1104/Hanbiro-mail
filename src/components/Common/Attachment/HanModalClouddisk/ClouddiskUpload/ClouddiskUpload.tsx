// @ts-nocheck
import HanDragAndDrop from "components/Common/HanDragAndDrop"
import React, { useEffect, useImperativeHandle, forwardRef, useState } from "react"
import HanUploadFileContent from "../../HanUploadFileContent"
import * as Utils from "../utils"
import useRemoteFile from "../hook/useRemoteFile"

const ClouddiskUploadComponent = ({ onFilesChange = (att) => {} }, ref) => {
  const [att, setAtt] = React.useState({})
  const [onLoading, setOnLoading] = useState(false)
  const [progress, setProgress] = useState(null)

  const { uploadFile: UploadFileHandler } = useRemoteFile()

  useImperativeHandle(
    ref,
    () => ({
      uploadFile(parentId, { reloadHandler = () => {} }) {
        setOnLoading(true)
        return UploadFileHandler({
          files: att,
          parentId: parentId,
          onUploadProgress: onUploadProgressCallback,
        })
          .then((results) => {
            const failedUploadFiles = []
            results?.forEach((result) => {
              if (!result.success) {
                failedUploadFiles.push(result?.data?.name)
              }
            })
            const newAtt = { ...att }
            Object.keys(newAtt).forEach((key) => {
              if (!failedUploadFiles.includes(newAtt[key].orgname)) {
                delete newAtt[key]
              }
            })
            setAtt(newAtt)
            setOnLoading(false)
            reloadHandler?.()
          })
          .finally(() => {
            setOnLoading(false)
          })
      },
    }),
    [att, onLoading],
  )

  useEffect(() => {
    onFilesChange(att)
  }, [att])

  // Handle to get progress when uploading
  const onUploadProgressCallback = (progressEvent, param) => {
    if (progressEvent && progressEvent?.progress) {
      const percent = Math.round(progressEvent?.progress * 100)
      Object.values(att).forEach((item) => {
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

  return (
    <div className="position-relative d-flex flex-column gap-2">
      <HanDragAndDrop
        custom
        onDrop={(files) => {
          const timeStamp = new Date().getTime()
          let acceptedFilesNew = {}
          files.forEach((file, index) => {
            const key = timeStamp + index
            acceptedFilesNew[key] = {
              fseq: key,
              orgname: file.name,
              filesize: Utils.humanFileSize(file.size),
              ext_file: Utils.getExtensionFile(file.name),
              uploading: true,
              progress: 0,
              file: file,
            }
          })
          setAtt({
            ...att,
            ...acceptedFilesNew,
          })
        }}
      />
      {Object.keys(att).length > 0 && (
        <HanUploadFileContent
          attachments={att}
          setAttachments={setAtt}
          style={{ maxHeight: 200, overflowY: "auto", overflowX: "hidden" }}
          isLoading={onLoading}
          progress={progress}
        />
      )}
      {/* {onLoading && (
        <div className="d-flex wd-100p justify-content-center align-items-center pd-20 ht-300 position-absolute top-0 left-0 w-100 h-100 bg-dark bg-opacity-50">
          <div
            className="spinner-border han-color-primary border-white"
            style={{
              borderRightColor: "transparent ",
            }}
            role="status"
          >
            <span className="sr-only"></span>
          </div>
        </div>
      )} */}
    </div>
  )
}
export default forwardRef(ClouddiskUploadComponent)
