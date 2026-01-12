// @ts-nocheck
import {
  IS_BACK_TO_LIST,
  SET_PERMIT_QUERY_PARAMS,
  SET_QUERY_PARAMS,
  SET_SEARCH_KEYWORK,
  TRIGGER_PRINT_MODAL,
} from "./actionTypes"

const initialState = {
  query: {},
  permitQuery: {},
  isBackToList: false,
  searchKeywork: "",
  openPrintModal: false,
}

const QueryParams = (state = initialState, action) => {
  switch (action.type) {
    case SET_QUERY_PARAMS:
      state = {
        ...state,
        query: action.payload,
      }
      break
    case SET_PERMIT_QUERY_PARAMS:
      state = {
        ...state,
        permitQuery: action.payload,
      }
      break
    case IS_BACK_TO_LIST:
      state = {
        ...state,
        isBackToList: action.payload,
      }
      break
    case SET_SEARCH_KEYWORK:
      state = {
        ...state,
        searchKeywork: action.payload,
      }
      break
    case TRIGGER_PRINT_MODAL:
      state = {
        ...state,
        openPrintModal: action.payload,
      }
      break
    default:
      break
  }

  return { ...state } // Should: "return {...state}" instead of "return state" > Because "return {...state}" will give more accurate results than "return state"
}

export default QueryParams
