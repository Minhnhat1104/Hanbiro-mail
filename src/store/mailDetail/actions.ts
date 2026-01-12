// @ts-nocheck
import {
  SET_CURRENT_ACL,
  SET_IS_DETAIL_VIEW,
  SET_IS_PERMIT_DETAIL_VIEW,
  SET_IS_SECURE_VIEW,
  SET_IS_VIEW_FROM_LIST,
} from "./actionTypes"

export const setCurrentAcl = (data) => {
  return {
    type: SET_CURRENT_ACL,
    payload: data,
  }
}

export const setIsDetailView = (data) => {
  return {
    type: SET_IS_DETAIL_VIEW,
    payload: data,
  }
}

export const setIsPermitDetailView = (data) => {
  return {
    type: SET_IS_PERMIT_DETAIL_VIEW,
    payload: data,
  }
}

export const setIsSecureView = (data) => {
  return {
    type: SET_IS_SECURE_VIEW,
    payload: data,
  }
}

export const setIsViewFromList = (data) => {
  return {
    type: SET_IS_VIEW_FROM_LIST,
    payload: data,
  }
}
