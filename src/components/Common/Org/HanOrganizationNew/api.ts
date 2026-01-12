// @ts-nocheck
import * as api from "../../../../helpers/api_helper"
const URL_GET_ORG = "org/tree/org"
const URL_GET_ORG_USER = "org/tree/user"
const URL_GET_ORG_POSITION = "org/tree/pos_org"
const URL_GET_ORG_POSITION_EXPEND = "org/tree/get_pos"
const URL_GET_ORG_ALIAS = "org/tree/alias_org"
const URL_GET_CONTACT = "addrbook/tree/all/org"
const URL_GET_CONTACT_EXPEND = "addrbook/tree/index/type/comp/folder"

export const onGetOrg = (params = {}) => {
  let url = URL_GET_ORG
  if (params.idURL) {
    url = url + "/" + params.idURL
  }
  return api.get(url, params)
}

export const onGetOrgUser = (params = {}) => {
  let url = URL_GET_ORG_USER
  if (params.idURL) {
    url = url + "/" + params.idURL
  }
  return api.get(url, params)
}

export const onGetOrgPosition = (params = {}) => {
  let url = URL_GET_ORG_POSITION
  // if (params.department) {
  //   url = url + "/" + params.department;
  // }
  // if (params.id) {
  //   const [cn] = params.id.split("_");
  //   url = url + "/" + cn;
  // }
  if (params.idURL) {
    url = url + "/" + params.idURL
  }
  return api.get(url, params)
}

export const onGetOrgPositionExpend = (params = {}) => {
  let url = URL_GET_ORG_POSITION_EXPEND

  // if (params.id) {
  //   const [cn] = params.split("_");
  //   url = url + "/" + cn;
  // }
  if (params.idURL) {
    url = url + "/" + params.idURL
  }
  return api.get(url, params)
}

export const onGetOrgAlias = (params = {}) => {
  let url = URL_GET_ORG_ALIAS
  if (params.idURL) {
    url = url + "/" + params.idURL
  }
  return api.get(url, params).then((res) => {
    const resNew = { ...res }
    resNew.rows = [res.rows]
    return resNew
  })
}

export const onGetContact = (params = {}) => {
  let url = URL_GET_CONTACT
  if (params.idURL) {
    url = url + "/" + params.idURL
  }
  return api.get(url, params)
}

export const onGetContactExpand = (params = {}) => {
  let url = URL_GET_CONTACT_EXPEND
  if (params.idURL) {
    url = url + "/" + params.idURL
  }
  return api.get(url, params)
}
