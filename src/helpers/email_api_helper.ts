// @ts-nocheck
import {
  get as apiGet,
  post as apiPost,
  del as apiDelete,
  put as apiPut,
  patch as apiPatch,
} from "./api_helper"
import { getBaseUrl } from "utils"

export const BASE_URL = getBaseUrl()

const Headers = {
  "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
}

const formDataUrlencoded = body => {
  let url = []
  Object.keys(body).forEach(key => {
    if (key == "mid") {
      const mids = body[key]
      if (typeof mids != "string") {
        Object.keys(mids).forEach(keyMid => {
          url.push(key + "=" + mids[keyMid])
        })
      } else {
        url.push(key + "=" + mids)
      }
    } else {
      url.push(key + "=" + body[key])
    }
  })
  return url.join("&")
}

const emailGet = (
  endPoint,
  payload = {},
  headers = {},
  responseType = "json",
) => {
  return apiGet(endPoint, payload, headers, responseType, {
    isApiMail: true,
  })
}

const emailPost = (endPoint, payload = {}, headers = {}, responseType = "json") => {
  return apiPost(endPoint, payload, headers, responseType, {
    isApiMail: true,
  })
}

const emailDelete = (
  endPoint,
  payload = {},
  headers = {},
  responseType = "json",
) => {
  return apiDelete(endPoint, payload, headers, responseType, {
    isApiMail: true,
  })
}

const emailPut = (
  endPoint,
  payload = {},
  headers = {},
  responseType = "json",
) => {
  return apiPut(endPoint, payload, headers, responseType, {
    isApiMail: true,
  })
}

const emailPatch = (
  endPoint,
  payload = {},
  headers = {},
  responseType = "json",
) => {
  return apiPatch(endPoint, payload, headers, responseType, {
    isApiMail: true,
  })
}

export {
  emailGet,
  emailPost,
  emailDelete,
  emailPut,
  emailPatch,
  Headers,
  formDataUrlencoded,
}
