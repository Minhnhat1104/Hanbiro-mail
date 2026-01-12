// @ts-nocheck
import { getBaseUrl } from "utils"
import * as API_BASE from "../../../../helpers/api_helper"
import { isDevelopment } from "./utils"
const URLS = {
  menus: "/cloud/api/get.php",
  search: "/cloud/api/find.php",
  getLinkFiles: "/cloud/api/link.php",
  upload: isDevelopment ? "/cloud/api/upload.php" : "/cgi-bin/cloudUpload.cgi",
  createFolder: "/cloud/api/mkdir.php",
  delete: "/cloud/api/del.php",
  updateFolder: "/cloud/api/property.php",
}

export const getMenus = (params) => API_BASE.get(getBaseUrl() + URLS.menus, params)
export const getFiles = (params) => API_BASE.get(getBaseUrl() + URLS.menus, params)
export const searchFile = (params) => API_BASE.get(getBaseUrl() + URLS.search, params)
export const getLinkFiles = (params) => API_BASE.get(getBaseUrl() + URLS.getLinkFiles, params)
export const upload = (params, onUploadProgress) =>
  // API_BASE.postWithPercent(URLS.upload, params, {}, null, onUploadProgress)
  API_BASE.post(
    getBaseUrl() + URLS.upload,
    params,
    { "Content-Type": "multipart/form-data" },
    null,
    {
      onUploadProgress: (progressEvent) => {
        onUploadProgress && onUploadProgress(progressEvent, params)
      },
    },
  )

export const createFolder = (params) =>
  API_BASE.post(getBaseUrl() + URLS.createFolder, params, {
    "Content-Type": "multipart/form-data",
  })
export const deleteFile = (params) => {
  let path = getBaseUrl() + URLS.delete
  const { type, isAdmin, ...attrs } = params
  if (type) {
    path += "?do=" + type
  }
  if (isAdmin) {
    path += "&admin=y"
  }
  if (attrs.id) {
    path += "&id=" + attrs.id
  }
  const formData = new FormData()
  for (const key of Object.keys(attrs)) {
    formData.append(key, attrs[key])
  }
  return API_BASE.post(path, params)
}

export const updateFolder = (params) => {
  let path = getBaseUrl() + URLS.updateFolder
  const { type, isAdmin, ...attrs } = params
  if (type) {
    path += "?type=" + type
  }
  if (isAdmin) {
    path += "&admin=y"
  }
  const formData = new FormData()
  for (const key of Object.keys(attrs)) {
    formData.append(key, attrs[key])
  }
  return API_BASE.post(
    path,
    formData,
    {
      "Content-Type": "multipart/form-data",
    },
    null,
  )
}
