// @ts-nocheck
import { useCustomToast } from "hooks/useCustomToast"
import { isArray, isEmpty } from "lodash"
import { useCallback, useContext, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import * as Utils from "../../../../utils"
import HanDragAndDrop from "../../HanDragAndDrop"
import HanModalClouddisk from "../HanModalClouddisk"
import { humanFileSize } from "../HanModalClouddisk/utils"
import { ComposeContext } from "components/Common/ComposeMail"

const HanUploadFileButton = ({
  attachments = {},
  setAttachments = () => {},
  filesCloudDisk = [],
  setFilesCloudDisk = () => {},
  hideDelete = false,
  className = "",
  mode = "PC",
  fileAccepted = [],
  maxSize = 50,
}) => {
  const { t } = useTranslation()
  const { successToast, errorToast } = useCustomToast()
  const [files, setFiles] = useState([])
  const { extensionNotAllowStr } = useContext(ComposeContext)

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (!isArray(acceptedFiles)) return
      if (!checkFilesAccepted(acceptedFiles, fileAccepted)) {
        errorToast(t("common.upload_invalid_filetype"))
        return
      }
      let nAcceptedFiles = [...acceptedFiles]
      let acFilesSize = 0

      // check file not allow from server
      nAcceptedFiles = checkFilesNotAllow(acceptedFiles, extensionNotAllowStr)

      if (!isEmpty(attachments)) {
        const totalSize = Object.values(attachments).reduce(
          (acc, file) => acc + file?.file?.size,
          0,
        )
        acFilesSize = acFilesSize + totalSize
      }

      if (nAcceptedFiles.length > 0) {
        nAcceptedFiles = nAcceptedFiles.filter((item) => {
          if (maxSize && item?.size > maxSize) {
            errorToast(`${t("project.project_error_file_too_large")}: ${item?.name}`)
            return false
          } else {
            return true
          }
        })

        acFilesSize = acFilesSize + nAcceptedFiles.reduce((acc, file) => acc + file?.size, 0)

        if (maxSize && acFilesSize > maxSize) {
          errorToast(
            t("common.common_uploader_total_files_size_error_msg").replace(
              "%d",
              `${humanFileSize(maxSize)}mb`,
            ),
          )

          let count = 0
          nAcceptedFiles = nAcceptedFiles.reverse().filter((item) => {
            if (acFilesSize - item?.size > maxSize) {
              acFilesSize = acFilesSize - item.size
              return false
            } else {
              if (count > 0) {
                return true
              } else {
                acFilesSize = acFilesSize - item.size
                count += 1
                return false
              }
            }
          })
        }
      }

      setFiles(nAcceptedFiles)
    },
    [maxSize, attachments],
  )

  const handleGetFileCloudDisk = (files) => {
    if (!checkFilesAccepted(files)) {
      errorToast(`Please only select files: ${fileAccepted.join("/")}`)
      return
    }
    setFilesCloudDisk && setFilesCloudDisk(files)
  }

  const checkFilesAccepted = (acceptedFiles) => {
    if (fileAccepted.length > 0) {
      for (let i = 0; i < acceptedFiles.length; i++) {
        const fileNameArr = acceptedFiles[i]?.name.split(".")
        const extFile = fileNameArr[fileNameArr.length - 1]
        if (!fileAccepted.includes(extFile)) {
          return false
        }
      }
      return true
    } else {
      return true
    }
  }

  const checkFilesNotAllow = (files, notAllows) => {
    let result = [...files]
    const indexNotAllow = []
    if (notAllows.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const fileNameArr = files[i]?.name.split(".")
        const extFile = fileNameArr[fileNameArr.length - 1]
        if (notAllows.includes(extFile)) {
          indexNotAllow.push(i)
        }
      }
    }
    if (indexNotAllow.length > 0) {
      result = result.filter((_, index) => !indexNotAllow.includes(index))
      errorToast(t("common.common_deny_upload"))
    }
    return result
  }

  const [openClouddisk, setOpenClouddisk] = useState(false)

  useEffect(() => {
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
    setAttachments({
      ...attachments,
      ...acceptedFilesNew,
    })
  }, [files])

  return (
    <div className={`row ${className} ht-100p`}>
      <div className="">
        <HanDragAndDrop
          onDrop={onDrop}
          custom={true}
          mode={mode}
          handleOpenClouddisk={() => {
            setOpenClouddisk(true)
          }}
          maxSize={maxSize}
        />
      </div>
      {openClouddisk && (
        <HanModalClouddisk
          files={filesCloudDisk}
          isOpen={openClouddisk}
          setOpenClouddisk={setOpenClouddisk}
          setFiles={(files) => handleGetFileCloudDisk(files)}
          // className={`custom-clouddisk`}
          buttonClassName={`custom-clouddisk-buttons`}
        />
      )}
    </div>
  )
}

export default HanUploadFileButton
