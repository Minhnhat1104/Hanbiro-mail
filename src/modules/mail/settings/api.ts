// @ts-nocheck
import { AUTO_MOVE_MAIL_BOX, EXTERNAL_MAIL_POP, EXTERNAL_MAIL_SMTP, FOLDER_LIST, MAILBOX_LIST, PRE_SERVER_LIST, SHARE_BOX_LIST, UPLOAD_EML, URL_POST_AUTO_MOVE_AUTO_SPLIT, USERS_SET_SHARE, USERS_SHARE } from "./urls"

import {
  emailGet,
  emailPost,
  Headers,
  formDataUrlencoded,
  emailPatch,
  emailDelete,
  emailPut,
} from "helpers/email_api_helper"

export const postAutoSortExistingMailData = params => {
  return emailPost(
    URL_POST_AUTO_MOVE_AUTO_SPLIT,
    formDataUrlencoded(params),
    Headers
  )
}

// Folder
export const getMailbox = () => {
  return emailGet(MAILBOX_LIST, {}, Headers)
}
export const getUsersShare = (boxId) => {
  return emailGet(`${USERS_SHARE}/${boxId}`, {}, Headers)
}
export const postUsersShare = (params) => {
  return emailPost(USERS_SHARE, params, Headers)
}
export const postSetShare = (params) => {
  return emailPost(`${USERS_SET_SHARE}/${params}`, {}, Headers)
}
export const backupMailbox = (params) => {
  return emailPost(USERS_SHARE, params, Headers)
}
export const emptyMailBox = (params) => {
  return emailPost(AUTO_MOVE_MAIL_BOX, params, Headers)
}
export const uploadEml = (params) => {
  return emailPost(UPLOAD_EML, params, Headers)
}
export const getFolders = (params) => {
  return emailGet(FOLDER_LIST, params, Headers)
}
export const createFolders = (params) => {
  return emailPost(FOLDER_LIST, params, Headers)
}
export const updateFolders = (params) => {
  // return emailPut(FOLDER_LIST, params, Headers)
  return emailPatch(FOLDER_LIST, params, Headers)
}
export const deleteFolders = (params) => {
  return emailDelete(FOLDER_LIST, params, Headers)
}
export const getShareBoxList = () => {
  return emailGet(SHARE_BOX_LIST, {}, Headers)
}

// Mail Fetching
export const getPreServerList = (mode) => {
  return emailGet(`${PRE_SERVER_LIST}/${mode}`, {}, Headers)
}
export const updateExternalMailPop = (params) => {
  return emailPost(EXTERNAL_MAIL_POP, params, Headers)
}
export const updateExternalMailSmtp = (params) => {
  return emailPost(EXTERNAL_MAIL_SMTP, params, Headers)
}
export const getExternalMailPop = () => {
  return emailGet(EXTERNAL_MAIL_POP, {}, Headers)
}
export const getExternalMailSmtp = () => {
  return emailGet(EXTERNAL_MAIL_SMTP, {}, Headers)
}