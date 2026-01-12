// @ts-nocheck
import {
  IS_BACK_TO_LIST,
  SET_PERMIT_QUERY_PARAMS,
  SET_QUERY_PARAMS,
  SET_SEARCH_KEYWORK,
  TRIGGER_PRINT_MODAL,
} from "./actionTypes"

export const setQueryParams = (data) => {
  return {
    type: SET_QUERY_PARAMS,
    payload: data,
  }
}

export const setPermitQueryParams = (data) => {
  return {
    type: SET_PERMIT_QUERY_PARAMS,
    payload: data,
  }
}

export const setIsBackToList = (data) => {
  return {
    type: IS_BACK_TO_LIST,
    payload: data,
  }
}

export const setSearchKeywork = (data) => {
  return {
    type: SET_SEARCH_KEYWORK,
    payload: data,
  }
}

export const triggerPrintModal = (data) => {
  return {
    type: TRIGGER_PRINT_MODAL,
    payload: data,
  }
}
