// @ts-nocheck
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

export const setSplitMode = (data) => {
  return {
    type: SET_SPLIT_MODE,
    payload: data,
  }
}

export const setHideFilterToolbar = (data) => {
  return {
    type: SET_HIDE_FILTER_TOOLBAR,
    payload: data,
  }
}

export const setIframeMode = (data) => {
  return {
    type: SET_IFRAME_MODE,
    payload: data,
  }
}

export const setLoadingPage = (data) => {
  return {
    type: SET_LOADING_PAGE,
    payload: data,
  }
}

export const setRefreshList = (data) => {
  return {
    type: SET_REFRESH_LIST,
    payload: data,
  }
}

export const setCurrentMenu = (data) => {
  return {
    type: SET_CURRENT_MENU,
    payload: data,
  }
}

export const setAccessMenu = (data) => {
  return {
    type: SET_ACCESS_MENU,
    payload: data,
  }
}

export const setShowSidebar = (data) => {
  return {
    type: SET_SHOW_SIDEBAR,
    payload: data,
  }
}

export const setResetFilter = (data) => {
  return {
    type: SET_RESET_FILTER,
    payload: data,
  }
}
