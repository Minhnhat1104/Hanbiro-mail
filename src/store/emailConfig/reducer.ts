// @ts-nocheck
import { SET_EMAIL_CONFIG, SET_SHARE_MENU } from "store/emailConfig/actionTypes"

const initialState = {
  basicMenus: [],
  folderMenus: [],
  shareMenus: [],
  specialMenus: [],
  disableList: [],
  extMenus: {},
  llmConfig: {},
  allMenus: [],
  langList: [],
  excludeSearch: {
    isNew: "a",
    excludeMailbox: [], // array id
  },
}

const config = (state = initialState, action) => {
  switch (action.type) {
    case SET_EMAIL_CONFIG:
      state = {
        ...state,
        ...action.payload,
      }
      break
    case SET_SHARE_MENU:
      state = {
        ...state,
        shareMenus: action.payload,
      }
      break
    default:
      break
  }

  return state
}

export default config
