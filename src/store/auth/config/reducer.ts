// @ts-nocheck
import {
  CLEAR_CONFIG,
  SET_GLOBAL_CONFIG,
  SET_USER_CONFIG,
  SET_PERSONAL_SETTING,
  SET_MAIL_PERSONAL_SETTING,
  SET_ALL_CONFIG
} from "store/auth/config/actionTypes"

const initialState = {
  allConfig: null,
  globalConfig: null,
  personalSetting: null,
  userConfig: null,
}

const config = (state = initialState, action) => {
  switch (action.type) {
    case SET_ALL_CONFIG:
      state = {
        ...state,
        allConfig: action.payload,
      }
      break
    case SET_GLOBAL_CONFIG:
      state = {
        ...state,
        globalConfig: action.payload,
      }
      break
    case SET_USER_CONFIG:
      state = {
        ...state,
        userConfig: action.payload,
      }
      break
    case SET_PERSONAL_SETTING:
      state = {
        ...state,
        personalSetting: action.payload,
      }
      break
    case SET_MAIL_PERSONAL_SETTING:
      let newSetting = {}
      newSetting[action.payload.type] = action.payload.value
      return {
        ...state,
        personalSetting: {
          ...state.personalSetting,
          mail: Object.assign({}, state.personalSetting.mail, newSetting),
        },
      }
      break
    case CLEAR_CONFIG:
      state = {
        ...initialState,
      }
      break
  }

  return state
}

export default config
