// @ts-nocheck
import {
  SET_CURRENT_ACL,
  SET_IS_DETAIL_VIEW,
  SET_IS_PERMIT_DETAIL_VIEW,
  SET_IS_SECURE_VIEW,
  SET_IS_VIEW_FROM_LIST,
} from "./actionTypes"

const initialState = {
  currentAcl: "",
  isDetailView: false,
  isPermitDetailView: false,
  isSecureView: false,
  isViewFromList: false,
}

const QueryParams = (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENT_ACL:
      state = {
        ...state,
        currentAcl: action.payload,
      }
      break
    case SET_IS_DETAIL_VIEW:
      state = {
        ...state,
        isDetailView: action.payload,
      }
      break
    case SET_IS_PERMIT_DETAIL_VIEW:
      state = {
        ...state,
        isPermitDetailView: action.payload,
      }
      break
    case SET_IS_SECURE_VIEW:
      state = {
        ...state,
        isSecureView: action.payload,
      }
      break
    case SET_IS_VIEW_FROM_LIST:
      state = {
        ...state,
        isViewFromList: action.payload,
      }
      break
    default:
      break
  }

  return { ...state } // Should: "return {...state}" instead of "return state" > Because "return {...state}" will give more accurate results than "return state"
}

export default QueryParams
