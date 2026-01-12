// @ts-nocheck
import { emailDelete, emailGet, emailPost, Headers } from "helpers/email_api_helper"
import { HACKING_MAIL } from "./url"


export const getHackingMails = () => {
  return emailGet(HACKING_MAIL, {}, Headers)
}
export const updateHackingMails = (params) => {
  return emailPost(HACKING_MAIL, params, Headers)
}
export const removeHackingMails = (params) => {
  return emailDelete(HACKING_MAIL, params, Headers)
}