// @ts-nocheck
import {
  GET_EMAIL_CONFIG,
  SET_EMAIL_CONFIG,
  SET_SHARE_MENU,
  GET_EMAIL_LANG_LIST,
  GET_EMAIL_EXCLUDE_LIST,
  SET_EMAIL_EXCLUDE_LIST,
} from "store/emailConfig/actionTypes"

export const getEmailConfig = (config) => {
  return {
    type: GET_EMAIL_CONFIG,
    payload: config,
  }
}

export const setEmailConfig = (config) => {
  return {
    type: SET_EMAIL_CONFIG,
    payload: config,
  }
}

export const setShareMenus = (config) => {
  return {
    type: SET_SHARE_MENU,
    payload: config,
  }
}

export const getEmailLangList = (config) => {
  return {
    type: GET_EMAIL_LANG_LIST,
    payload: config,
  }
}

export const getEmailExcludeList = (config) => {
  return {
    type: GET_EMAIL_EXCLUDE_LIST,
    payload: config,
  }
}

export const postEmailExclude = (payload = {}, callback) => {
  return {
    type: SET_EMAIL_EXCLUDE_LIST,
    payload: payload,
    callback: callback,
  }
}
