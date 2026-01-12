// @ts-nocheck
import { URL_GET_CONFIG, URL_LOGIN_IN, URL_POST_PERSONAL_SETTING } from "./urls"

import { get, post } from "helpers/api_helper"
import { getBaseUrl } from "utils"

export const login = (params, host) => {
  return post(URL_LOGIN_IN, params, {}, "json", {
    baseURL: getBaseUrl(host) + "/ngw",
  })
}

export const getConfig = params => {
  return get(URL_GET_CONFIG, params)
}

export const postPersonalSetting = params => {
  return post(URL_POST_PERSONAL_SETTING, params)
}
