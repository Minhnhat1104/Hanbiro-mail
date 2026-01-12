// @ts-nocheck
import {
  URL_GET_EMAIL_CONFIG,
  URL_GET_FOLDER,
  URL_GET_SHARE_MAILBOX,
  URL_GET_EXT_MENU,
  URL_GET_DISABLE_LIST,
  URL_MAIL_TO_HTML5,
  URL_EMAIL_SPAM,
  URL_POST_TO_HELP_DESK,
  URL_GET_LANG_LIST,
  URL_GET_EXCLUDE_LIST,
  URL_GET_LLM_CONFIG,
} from "./urls"

import {
  emailGet,
  emailPost,
  Headers,
  formDataUrlencoded,
  emailPut,
} from "helpers/email_api_helper"

export const getEmailConfig = () => {
  return emailGet(URL_GET_EMAIL_CONFIG)
}

export const getEmailFolder = (params) => {
  return emailGet(URL_GET_FOLDER, params)
}

export const getEmailShareBox = (params) => {
  return emailGet(URL_GET_SHARE_MAILBOX, params)
}

export const getExtMenu = (params) => {
  return emailGet(URL_GET_EXT_MENU, params)
}

export const getLLMConfig = (params) => {
  return emailGet(URL_GET_LLM_CONFIG, params)
}

export const getDisableList = (params) => {
  return emailGet(URL_GET_DISABLE_LIST, params)
}

export const postMailToHtml5 = (postParams, getParam = "") => {
  let url = URL_MAIL_TO_HTML5
  if (getParam != "") {
    url += "?" + getParam
  }
  return emailPost(url, formDataUrlencoded(postParams), Headers)
}
export const putPriorApproval = (url, putParams, getParam = "") => {
  // let url = URL_MAIL_TO_HTML5
  if (getParam != "") {
    url += "?" + getParam
  }
  return emailPut(url, putParams, Headers)
}

export const postEmailFolder = (postParams) => {
  return emailPost(URL_GET_FOLDER, formDataUrlencoded(postParams), Headers)
}

export const postEmailSpam = (postParams) => {
  return emailPost(URL_EMAIL_SPAM, formDataUrlencoded(postParams), Headers)
}

export const moveToCloudDisk = (params) => {
  return emailGet(URL_MAIL_TO_HTML5, params, Headers)
}

export const postToHelpDesk = (params) => {
  let url = [URL_POST_TO_HELP_DESK, params.menu, params.mid].join("/")
  return emailPut(url, {}, Headers)
}

export const getEmailLangList = () => {
  return emailGet(URL_GET_LANG_LIST)
}

export const getEmailExcludeList = () => {
  return emailGet(URL_GET_EXCLUDE_LIST)
}

export const postEmailExcludeList = (postParams) => {
  return emailPost(URL_GET_EXCLUDE_LIST, formDataUrlencoded(postParams), Headers)
}
