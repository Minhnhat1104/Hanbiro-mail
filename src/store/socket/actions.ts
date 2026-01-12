// @ts-nocheck
import {
  SET_SIDEBAR_COUNT,
  SET_SIDEBAR_FOLDER_KEYWORD,
  SET_SOCKET_COUNT,
  SET_SOCKET_DATA,
  SET_SOCKET_MENU_DATA,
} from "./actionTypes"

export const setSocketCount = data => {
  return {
    type: SET_SOCKET_COUNT,
    payload: data,
  }
}
export const setSocketData = data => {
  return {
    type: SET_SOCKET_DATA,
    payload: data,
  }
}
export const setSidebarCount = data => {
  return {
    type: SET_SIDEBAR_COUNT,
    payload: data,
  }
}
export const setSocketMenuData = data => {
  return {
    type: SET_SOCKET_MENU_DATA,
    payload: data,
  }
}
export const setSidebarFolderKeyword = data => {
  return {
    type: SET_SIDEBAR_FOLDER_KEYWORD,
    payload: data,
  }
}
