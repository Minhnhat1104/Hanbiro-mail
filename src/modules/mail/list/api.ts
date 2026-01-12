// @ts-nocheck
import {
  URL_ADD_TO_CONTACT,
  URL_GET_EMAIL_LIST,
  URL_GET_EMAIL_PREVIEW,
  URL_GET_FOLDER_ADD_CONTACT,
  URL_PERMIT_APPROVER_INFO,
  URL_PERMIT_MAIL,
  URL_PERMIT_MAIL_DETAILS,
} from "./urls"
import { URL_MAIL_TO_HTML5 } from "modules/mail/common/urls"
import { emailGet, emailPost, emailPut, Headers } from "helpers/email_api_helper"
import { get, post } from "helpers/api_helper"
import { URL_POST_AUTO_MOVE_AUTO_SPLIT } from "../settings/urls"
import { size } from "lodash"
import config from "config"

export const getListEmail = (params) => {
  return emailGet(URL_GET_EMAIL_LIST, params)
}

export const postDeleteMail = (params) => {
  let url = URL_MAIL_TO_HTML5 + "?removemail=1"

  const { acl, mid, ...opt } = params
  let newParams = "acl=" + acl + "&act=maildel"

  if (typeof mid == "object" && mid.length > 0) {
    mid.map((item) => {
      newParams += "&mid=" + item
    })
  } else {
    newParams += "&mid=" + mid
  }

  return emailPost(url, newParams, Headers)
}
export const getEmailPreview = (url) => {
  return emailGet(url)
}
export const getPermitMailList = ({ page, linenum, sortkey, sorttype }, searchString) => {
  return emailGet(
    [URL_PERMIT_MAIL, page, linenum, sortkey, sorttype].join("/"),
    searchString,
    Headers,
  )
}
export const putPermitMail = ({ mode, uuids, mforce }, data) => {
  return emailPut([URL_PERMIT_MAIL, mode, uuids, mforce].join("/"), data, Headers)
}
export const getApproverInfo = (id) => {
  return emailGet([URL_PERMIT_APPROVER_INFO, id].join("/"), {}, Headers)
}
export const getPermitMailDetails = (msg_uuid, uuid) => {
  return emailGet([URL_PERMIT_MAIL_DETAILS, msg_uuid].join("/"), { ouuid: uuid }, Headers)
}
export const postBLockAddress = (params) => {
  return emailPost(URL_MAIL_TO_HTML5, params, Headers)
}
export const getFolderAddContact = () => {
  return get(URL_GET_FOLDER_ADD_CONTACT, {}, Headers, "json", {
    isApiMail: false,
  })
}
export const postAddContact = (params) => {
  return post(URL_ADD_TO_CONTACT, params, Headers, "json", { isApiMail: false })
}
export const postAutoSortMailToFolder = (params) => {
  return emailPost(URL_MAIL_TO_HTML5, params, Headers)
}
export const postAutoSplit = (params) => {
  return emailPost(URL_POST_AUTO_MOVE_AUTO_SPLIT, params, Headers)
}
export const getCancelSending = (params) => {
  return emailGet(URL_MAIL_TO_HTML5, params, Headers)
}
