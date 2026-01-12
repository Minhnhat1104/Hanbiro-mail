// @ts-nocheck
import { post } from "helpers/api_helper"
import React from "react"
const url = {
  uploadFile: "/common/upload2",
}

const useAttachment = () => {
  const uploadFileGroupware = async ({ file, orgname, fseq }, uuid, uploadProgressCallback) => {
    const uploadUrl = `${url.uploadFile}?id=${uuid}&a=${1}?id=o_${fseq}`
    const formData = new FormData()
    formData.append("file", file)
    formData.append("name", orgname)
    formData.append("chunk", 0)
    formData.append("chunks", 1)
    formData.append("act", "fileupload")
    const res = await post(
      uploadUrl,
      formData,
      {
        "Content-Type": "multipart/form-data",
      },
      null,
      {
        onUploadProgress: (postProgress) => {
          uploadProgressCallback && uploadProgressCallback(postProgress, formData)
        },
      },
    )
    if (res.sucess) {
    } else {
      // TODO handle error
    }
    return res
  }
  return { uploadFileGroupware }
}

export default useAttachment
