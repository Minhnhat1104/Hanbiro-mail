// @ts-nocheck
import { EMAIL_SIGNATURE_INFO, EMAIL_WRITE, EMAIL_WRITEFORM, LETTER_TEMPLATES, SET_PREVIEW_MODE } from "./urls"

import { post } from "helpers/api_helper"
import { emailGet, emailPost, Headers } from "helpers/email_api_helper"

export const writeEmail = params => {
  let url = EMAIL_WRITE + params.mailbox

  if (params.mailid) {
    url += `/${params.mailid}`
  }

  if (params.preview === "y") {
    url += "/?is_preview=1"
  }

  return emailPost(url, params, Headers)
}

export const setPreviewMode = mode => {
  const query = `?mode=${mode}`
  return emailPost(SET_PREVIEW_MODE + query, null, Headers)
}

export const getSignatureInfo = params => {
  return emailGet(EMAIL_SIGNATURE_INFO, params, Headers)
}

export const getSignatureDetail = sigName => {
  let url = ''
  if (sigName === "default") {
    url = [EMAIL_WRITEFORM, "default"].join("/")
  } else {
    url = [EMAIL_WRITEFORM, "select", sigName, "?ic=1"].join("/")
  }

  return emailGet(url, null, Headers)
}

export const getLetterTemplates = (params) => {
  return post(LETTER_TEMPLATES, params, Headers)
}
