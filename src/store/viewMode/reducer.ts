// @ts-nocheck
import { menuAll } from "constants/sidebar"
import {
  SET_SPLIT_MODE,
  SET_HIDE_FILTER_TOOLBAR,
  SET_IFRAME_MODE,
  SET_LOADING_PAGE,
  SET_REFRESH_LIST,
  SET_CURRENT_MENU,
  SET_SHOW_SIDEBAR,
  SET_RESET_FILTER,
  SET_ACCESS_MENU,
} from "./actionTypes"

const initialState = {
  isSplitMode: false,
  isHideFilterToolbar: false,
  isIframeMode: false,
  isLoadingPage: false,
  isRefreshList: false,
  isShowSidebar: true,
  accessMenu: null,
  currentMenu: menuAll,
  isResetFilter: false,
}

const viewMode = (state = initialState, action) => {
  switch (action.type) {
    case SET_SPLIT_MODE:
      state = {
        ...state,
        isSplitMode: action.payload,
      }
      break
    case SET_HIDE_FILTER_TOOLBAR:
      state = {
        ...state,
        isHideFilterToolbar: action.payload,
      }
      break
    case SET_IFRAME_MODE:
      state = {
        ...state,
        isIframeMode: action.payload,
      }
      break
    case SET_LOADING_PAGE:
      state = {
        ...state,
        isLoadingPage: action.payload,
      }
      break
    case SET_REFRESH_LIST:
      state = {
        ...state,
        isRefreshList: action.payload,
      }
      break
    case SET_CURRENT_MENU:
      state = {
        ...state,
        currentMenu: action.payload,
      }
      break
    case SET_ACCESS_MENU:
      state = {
        ...state,
        accessMenu: action.payload,
      }
      break
    case SET_SHOW_SIDEBAR:
      state = {
        ...state,
        isShowSidebar: action.payload,
      }
      break
    case SET_RESET_FILTER:
      state = {
        ...state,
        isResetFilter: action.payload,
      }
      break
    default:
      break
  }

  return state
}

export default viewMode
