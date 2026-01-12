// @ts-nocheck
import {
  SET_SOCKET_COUNT,
  SET_SOCKET_DATA,
  SET_SIDEBAR_COUNT,
  SET_SOCKET_MENU_DATA,
} from "./actionTypes"

const initialState = {
  count: 0,
  data: null,
  sidebarCount: null,
  menuData: null,
}

const socket = (state = initialState, action) => {
  switch (action.type) {
    case SET_SOCKET_COUNT:
      if (action.payload === 1) {
        state = {
          ...state,
          count: state.count + 1,
        }
      } else {
        state = {
          ...state,
          count: 0,
        }
      }
      break
    case SET_SOCKET_DATA:
      state = {
        ...state,
        data: action.payload,
      }
      break
    case SET_SIDEBAR_COUNT:
      state = {
        ...state,
        sidebarCount: action.payload,
      }
      break
    case SET_SOCKET_MENU_DATA:
      state = {
        ...state,
        menuData: action.payload,
      }
      break
    default:
      break
  }

  return state
}

export default socket
