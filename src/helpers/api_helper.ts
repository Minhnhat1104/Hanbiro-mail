// @ts-nocheck
import axios from "axios"
import { HAN_API_ERROR_MESSAGE } from "constants/api"
import isEmpty from "lodash/isEmpty"
import merge from "lodash/merge"
import toastr from "toastr"
import { getBaseUrl, getGroupwareUrl } from "utils"
import accessToken from "./jwt-token-access/accessToken"

//pass new generated access token here
const token = accessToken

const axiosApi = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
  // baseURL: getGroupwareUrl(),
  withCredentials: true,
})

axiosApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")

  if (token) {
    // config.headers["Authorization"] = `Bearer ${token}`
  }
  if (config.isApiMail) {
    config.baseURL = getBaseUrl()
  } else {
    config.baseURL = getGroupwareUrl()
  }

  return config
})

axiosApi.interceptors.response.use(
  (response) => response,
  (error) => {
    const serverResponse = error?.response
    const errorStatus = serverResponse?.status

    switch (errorStatus) {
      case 401:
        const responseData = error.response.data
        if (typeof responseData === "string") {
          const parser = new DOMParser()
          const htmlResponse = parser.parseFromString(responseData, "text/html")
          const errorMessage = htmlResponse.getElementsByTagName("p")?.[0]?.innerHTML
          localStorage.setItem(HAN_API_ERROR_MESSAGE, errorMessage)
        }
        if (!responseData.success) {
          const message = responseData?.detail
          message && toastr.error(message)
        }

        localStorage.removeItem("host")
        localStorage.removeItem("token")
        // location.reload()
        if (process.env.NODE_ENV === "development") {
          window.location.href = `${location.origin}/login`
        } else {
          window.location.href = `${location.origin}/mailapp/login`
        }

        break

      case 0:
        toastr.error("Server Error")
        break
    }

    if (typeof errorStatus === "undefined") {
      toastr.error("Unexpected Error")
    }

    return Promise.reject(error)
  },
)

export async function get(
  endPoint,
  payload = {},
  headers = {},
  responseType = "json",
  customConfig = {},
) {
  let config = {
    method: "get",
    url: endPoint,
    params: payload,
    headers: headers,
    responseType: responseType,
  }
  if (!isEmpty(customConfig)) {
    merge(config, customConfig)
  }

  try {
    const response = await axiosApi(config)
    return Promise.resolve(response.data)
  } catch (error) {
    return Promise.reject(error)
  }
}

/**
 * Post Method
 *
 * @param {*} endPoint
 * @param {*} [payload={}]
 * @param {*} [headers={}]
 * @param {*} uniqueRequest
 * @returns
 * @memberof Api
 */
export async function post(
  endPoint,
  payload = {},
  headers = {},
  responseType = "json",
  customConfig = {},
) {
  let config = {
    method: "post",
    url: endPoint,
    data: payload,
    headers: headers,
    responseType: responseType,
  }
  if (!isEmpty(customConfig)) {
    merge(config, customConfig)
  }

  return axiosApi(config)
    .then((response) => {
      return Promise.resolve(response.data)
    })
    .catch((error) => {
      return Promise.reject(error)
    })
}

/**
 * Delete Method
 *
 * @param {*} endPoint
 * @param {*} [payload={}]
 * @param {*} [headers={}]
 * @param {*} uniqueRequest
 * @param {string} [responseType='json']
 * @returns
 * @memberof Api
 */
export async function del(
  endPoint,
  payload = {},
  headers = {},
  responseType = "json",
  customConfig = {},
) {
  let config = {
    method: "delete",
    url: endPoint,
    params: payload,
    headers: headers,
    responseType: responseType,
  }
  if (!isEmpty(customConfig)) {
    merge(config, customConfig)
  }

  try {
    const response = await axiosApi(config)
    return Promise.resolve(response.data)
  } catch (error) {
    return Promise.reject(error)
  }
}

/**
 * PUT Method
 *
 * @param {*} endPoint
 * @param {*} [payload={}]
 * @param {*} [headers={}]
 * @param {*} uniqueRequest
 * @param {string} [responseType='json']
 * @returns
 * @memberof Api
 */
export async function put(
  endPoint,
  payload = {},
  headers = {},
  responseType = "json",
  customConfig = {},
) {
  let config = {
    method: "put",
    url: endPoint,
    data: payload,
    headers: headers,
    responseType: responseType,
  }
  if (!isEmpty(customConfig)) {
    merge(config, customConfig)
  }

  try {
    const response = await axiosApi(config)
    return Promise.resolve(response.data)
  } catch (error) {
    return Promise.reject(error)
  }
}

export async function patch(
  endPoint,
  payload = {},
  headers = {},
  responseType = "json",
  customConfig = {},
) {
  let config = {
    method: "patch",
    url: endPoint,
    params: payload,
    headers: headers,
    responseType: responseType,
  }
  if (!isEmpty(customConfig)) {
    merge(config, customConfig)
  }

  try {
    const response = await axiosApi(config)
    return Promise.resolve(response.data)
  } catch (error) {
    return Promise.reject(error)
  }
}
