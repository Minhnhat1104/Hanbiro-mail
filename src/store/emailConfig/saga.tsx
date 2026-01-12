// @ts-nocheck
import { call, put, takeEvery } from "redux-saga/effects"

import {
  getEmailConfig,
  getExtMenu,
  getDisableList,
  postEmailFolder,
  getEmailFolder,
  getEmailLangList,
  getEmailExcludeList,
  postEmailExcludeList,
  getLLMConfig,
} from "modules/mail/common/api"

import { URL_GET_EXCLUDE_LIST } from "modules/mail/common/urls"

import {
  GET_EMAIL_CONFIG,
  GET_EMAIL_LANG_LIST,
  GET_EMAIL_EXCLUDE_LIST,
  SET_EMAIL_EXCLUDE_LIST,
} from "store/emailConfig/actionTypes"
import { setEmailConfig } from "store/emailConfig/actions"
import { isNaN } from "lodash"

const isBasicBox = (key) => {
  if (key == "Secure" && window.location.host == "tonymoly.com") return false
  const patt = "Maildir,Secure,Sent,Storage,External,Receive,Temp,Spam,Trash,Approval,Archives," // hide CSpam request Mr Jy Kim
  return patt.indexOf(key + ",") !== -1
}

function recursion(folderMenus, parentName = "") {
  const tree = []
  Object.keys(folderMenus).map((key) => {
    let menu = folderMenus[key]
    if (menu && menu["parentName"] == parentName) {
      let menuFolder = menu
      delete folderMenus[key]
      let children = recursion(folderMenus, menu["name"])
      if (children.length > 0) {
        menuFolder.children = children
      }
      tree.push(menuFolder)
    }
  })
  return tree
}

/* Format menu */
const formatMenus = (menus, folderMenus) => {
  let check = false
  let mainMenus = []
  // let folderMenus = []
  let childrenFolderName = {}
  let specialMenus = {}
  const menuIcon = {
    Maildir: "mdi mdi-email-fast-outline",
    Secure: "mdi mdi-email-lock-outline",
    Storage: "mdi mdi-email-multiple-outline",
    Sent: "mdi mdi-email-arrow-right-outline",
    External: "mdi mdi-link-variant-plus",
    Temp: "mdi mdi-email-alert-outline",
    Spam: "mdi mdi-email-remove-outline",
    Trash: "mdi mdi-delete-outline",
  }

  menus.map((item) => {
    let menu = { ...item }
    if (isBasicBox(menu.key)) {
      if (menuIcon?.[menu.key]) {
        menu.icon = menuIcon?.[menu.key]
      }
      mainMenus.push(menu)
    } else {
      check = isNaN(parseFloat(menu.key))
      if (!check) {
        let check = menu.name.split("/")
        if (check.length > 1) {
          check.reverse()
          menu.name = check[0]
          menu.parentName = check[1].trim()
          childrenFolderName[menu.key] = menu
        } else {
          menu.parentName = ""
          childrenFolderName[menu.key] = menu
        }
      } else {
        specialMenus[menu.key] = menu
      }
    }
  })

  // folderMenus = recursion(childrenFolderName)

  // if (!isEmpty(res) && isArray(res?.mailbox)) {
  //   folderMenus = res?.mailbox
  // }

  return {
    basicMenus: mainMenus,
    folderMenus: folderMenus,
    specialMenus: specialMenus,
    allMenus: menus,
  }
}

function* onGetEmailConfig(action) {
  const { payload } = action
  const params = {
    root: "source",
    isopen: "yes",
  }
  const response = yield call(getEmailConfig)
  const res = yield call(() => getEmailFolder(params))
  const menus = formatMenus(response?.mailbox ?? [], res?.mailbox ?? [])
  yield put(setEmailConfig(menus))

  if (!payload?.noExt) {
    const extResponse = yield call(getExtMenu)
    yield put(
      setEmailConfig({
        extMenus: extResponse,
      }),
    )

    /**
     * @author: H.Phuc <hoangphuc@hanbiro.vn> - @since: 2025-06-24
     * @ticket: GQ-313666
     * Check enable LLM config
     */
    try {
      const llmConfigResponse = yield call(getLLMConfig)
      let { llmconfig } = llmConfigResponse
      llmconfig.showAI = false
      if (llmConfigResponse.success) {
        llmconfig.showAI = extResponse?.isllm && llmconfig?.enable == "1"
      }
      yield put(
        setEmailConfig({
          llmConfig: llmconfig ?? {},
        }),
      )
    } catch (error) {
      console.log("error", error)
      yield put(
        setEmailConfig({
          llmConfig: {
            showAI: extResponse?.isllm,
          },
        }),
      )
    }
  }

  if (!payload?.noDisableList) {
    const disableListResponse = yield call(getDisableList)
    yield put(
      setEmailConfig({
        disableList: disableListResponse.disablelist,
      }),
    )
  }
}

function* onGetEmailLangList() {
  try {
    const response = yield call(getEmailLangList)
    if (response.success) {
      let langList = []
      Object.keys(response.list).map((langKey) => {
        let langData = response.list[langKey]
        langList.push({
          value: langKey,
          label: langData.name,
        })
      })
      yield put(
        setEmailConfig({
          langList: langList,
        }),
      )
    }
  } catch (error) {
    console.log(error)
  }
}

function* onGetEmailExcludeList() {
  try {
    const response = yield call(getEmailExcludeList)
    if (response.success) {
      let arr = []
      response?.row?.map((mailbox) => {
        arr.push(mailbox.id)
      })
      let excludeSearch = {
        isNew: response.isnew,
        excludeMailbox: arr,
      }
      yield put(
        setEmailConfig({
          excludeSearch: excludeSearch,
        }),
      )
    }
  } catch (error) {
    console.log(error)
  }
}

function* onPostEmailExclude(action) {
  try {
    const { payload, callback } = action
    const response = yield call(postEmailExcludeList, payload)
    if (response.success) {
      let excludeSearch = {
        isNew: payload.isnew,
        excludeMailbox: payload.boxs.split(","),
      }
      yield put(
        setEmailConfig({
          excludeSearch: excludeSearch,
        }),
      )
    }
    if (callback) {
      action.callback(response)
    }
  } catch (error) {
    console.log(error)
  }
}

function* configSaga() {
  yield takeEvery(GET_EMAIL_CONFIG, onGetEmailConfig)
  yield takeEvery(GET_EMAIL_LANG_LIST, onGetEmailLangList)
  yield takeEvery(GET_EMAIL_EXCLUDE_LIST, onGetEmailExcludeList)
  yield takeEvery(SET_EMAIL_EXCLUDE_LIST, onPostEmailExclude)
}

export default configSaga
