// @ts-nocheck
import React from "react"
import * as Utils from "../utils"
import { deleteFile, updateFolder as uploadFolderApi, upload } from "../api"

const useRemoteFile = (isAdmin = false) => {
  const downloadFiles = (id) => {
    if (Array.isArray(id)) {
      let mode = Utils.isIE() ? "" : "?mode=zip"
      if (isAdmin) {
        if (Utils.isIE()) {
          mode += "&admin=y"
        } else {
          mode = "?admin=y"
        }
      }

      let form = document.createElement("form")
      if (Utils.isIE()) form.target = "download"

      form.setAttribute("method", "post")
      form.setAttribute("action", "/cgi-bin/cloudDownload.cgi" + mode)
      let input = document.createElement("input")
      input.setAttribute("type", "hidden")
      input.setAttribute("name", "list")
      input.setAttribute("value", JSON.stringify(id))
      form.appendChild(input)
      document.body.appendChild(form)

      if (Utils.isIE()) {
        let windowFeatures =
          "width=1, height=1, status=0, toolbar=0, location=0, menubar=0, directories=0, resizable=0, scrollbars=0"
        let map = window.open("", "download", windowFeatures)
        if (map) {
          form.submit()
        } else {
          // alert(Cloud.languages.error, Cloud.languages.downloadPopup);
        }
      } else {
        form.submit()
      }

      form.parentNode.removeChild(form)
    } else {
      let path = Utils.getDomain() + ["/cgi-bin/cloudDownload.cgi"].join("") + "?id=" + id
      if (isAdmin) path += "&admin=y"
      if (Utils.isIE()) {
        window.open(path)
      } else {
        window.location = path
      }
    }
  }

  const deleteFiles = async function (id) {
    const params = {
      type: "trash",
      isAdmin: isAdmin,
      id: id,
    }
    return await deleteFile(params)
  }
  const updateFolder = async ({ id, folderName }) => {
    const params = {
      type: "set",
      isAdmin: isAdmin,
      id: id,
      name: folderName,
    }
    return await uploadFolderApi(params)
  }
  const uploadFile = async ({ parentId, files, onUploadProgress }) => {
    const result = await Promise.all(
      Object.keys(files)?.map((key) => {
        const formData = new FormData()
        formData.append("name", files[key].orgname)
        formData.append("file", files[key].file)
        formData.append("fkey", Utils.makeid())

        formData.append("parentId", parentId)
        return upload(formData, onUploadProgress)
      }),
    )
    return result
  }
  return {
    deleteFiles,
    downloadFiles,
    updateFolder,
    uploadFile,
  }
}

export default useRemoteFile
