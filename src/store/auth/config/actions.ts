// @ts-nocheck
import {
  CHECK_COOKIES,
  CLEAR_CONFIG,
  GET_CONFIG,
  SAVE_MAIL_PERSONAL_SETTING,
  SET_GLOBAL_CONFIG,
  SET_MAIL_PERSONAL_SETTING,
  SET_PERSONAL_SETTING,
  SET_USER_CONFIG,
  SET_ALL_CONFIG
} from "store/auth/config/actionTypes"

export const setAllConfig = config => {
  return {
    type: SET_ALL_CONFIG,
    payload: config,
  }
}

export const setGlobalConfig = config => {
  return {
    type: SET_GLOBAL_CONFIG,
    payload: config,
  }
}

export const setUserConfig = config => {
  return {
    type: SET_USER_CONFIG,
    payload: config,
  }
}

export const setPersonalSetting = config => {
  return {
    type: SET_PERSONAL_SETTING,
    payload: config,
  }
}

export const getConfig = () => {
  return {
    type: GET_CONFIG,
  }
}

export const saveMailPersonalSetting = payload => {
  return {
    type: SAVE_MAIL_PERSONAL_SETTING,
    payload: payload,
  }
}

export const setMailPersonalSetting = payload => {
  return {
    type: SET_MAIL_PERSONAL_SETTING,
    payload: payload,
  }
}

export const clearConfig = () => {
  return {
    type: CLEAR_CONFIG,
  }
}