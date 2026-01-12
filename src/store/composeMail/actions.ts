// @ts-nocheck
import {
  CLOSE_COMPOSE_MAIL,
  CLOSE_ORG_MODAL,
  EXPAND_COMPOSE_MODAL,
  FORCE_UPDATE_COMPOSE_DATA,
  OPEN_COMPOSE_MAIL,
  OPEN_ORG_MODAL,
  UPDATE_COMPOSE_DATA,
  UPDATE_LOCAL_COMPOSE_MODE,
} from "store/composeMail/actionTypes"

export const openComposeMail = (data) => {
  return {
    type: OPEN_COMPOSE_MAIL,
    payload: data,
  }
}

export const updateComposeMode = (data) => {
  return {
    type: UPDATE_COMPOSE_DATA,
    payload: data,
  }
}

export const forceUpdateComposeData = (data) => {
  return {
    type: FORCE_UPDATE_COMPOSE_DATA,
    payload: data,
  }
}

export const updateLocalComposeMode = (data) => {
  return {
    type: UPDATE_LOCAL_COMPOSE_MODE,
    payload: data,
  }
}

export const closeComposeMail = (data) => {
  return {
    type: CLOSE_COMPOSE_MAIL,
    payload: data,
  }
}

export const openOrgModal = (type, composeId) => {
  return {
    type: OPEN_ORG_MODAL,
    payload: { type, composeId },
  }
}

export const closeOrgModal = (type) => {
  return {
    type: CLOSE_ORG_MODAL,
    payload: type,
  }
}

export const expandComposeModal = (isExpand) => {
  return {
    type: EXPAND_COMPOSE_MODAL,
    payload: isExpand,
  }
}
