// @ts-nocheck
import * as api from "helpers/api_helper"
import { URL_GET_FOLDER, URL_GET_FORM } from "modules/mail/common/urls"

export const optimizeDepartments = (departments = []) => {
  const departmentModel = departments.map(item => {
    let itemNew = {
      ...item,
      isFolder: item.isFolder || item.type == "folder",
      key: item.key || item.id,
      isLazy: item.isLazy || item.leaf == false,
      title: item.title || item.text || item.name,
    }
    if (itemNew.children) {
      itemNew.children = optimizeDepartments(itemNew.children)
    }
    return itemNew
  })
  return departmentModel
}

export const CONFIG_TYPE = {
  department: {
    init: {
      params: ({ keyword = "" }) => ({
        keyword: keyword,
        pop_select_form: true,
      }),
      api: params => {
        return api.get("admin/approval/tree_form", params)
      },
    },
    expand: {
      params: ({ idURL = "", keyword = "" }) => {
        return {
          pop_select_form: true,
        }
      },
      api: params => {
        return api.get("admin/approval/tree_form", params)
      },
    },
    user: {
      params: (params = {}) => params,
      api: params => {
        return api.get(URL_GET_FORM, params)
      },
    },
  },
}

export const ORG_CONFIG_SELECT_FORM = {
  category: {
    init: {
      params: ({ keyword = "" }) => ({
        keyword: keyword,
        pop_select_form: true,
      }),
      api: params => {
        return api.get("admin/approval/tree_form", params)
      },
    },
    expand: {
      params: ({ idURL = "", keyword = "" }) => {
        return {
          category: idURL,
        }
      },
      api: params => {
        return api.get("approval/approval/common_form", params)
      },
    },
    user: {
      params: (params = {}) => params,
      api: params => {
        return api.get(URL_GET_FORM, params)
      },
    },
  },
}

export const getEmail = item => {
  const name = item.username || item.title
  const email = item.email
  return `${name} <${email}>`
}
