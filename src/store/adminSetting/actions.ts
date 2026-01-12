// @ts-nocheck
import {
  SET_ADMIN_RESTRICTION_DOMAIN,
  SET_ADMIN_RESTRICTION_FILE,
  SET_ADMIN_SPAM,
  SET_ADMIN_SPAM_FILTER_DOMAIN,
  SET_ADMIN_SPAM_FILTER_EMAIL,
  SET_ADMIN_SPAM_FILTER_FILE,
  SET_ADMIN_SPAM_FILTER_IP,
  SET_ADMIN_SPAM_FILTER_SUBJECT,
  SET_ADMIN_UNSPAM,
  SET_CLEAR_STATE_SPAM,
} from "store/adminSetting/actionTypes"

export const setAdminSpamConfig = config => {
  return {
    type: SET_ADMIN_SPAM,
    payload: config,
  }
}

export const setAdminUnSpamConfig = config => {
  return {
    type: SET_ADMIN_UNSPAM,
    payload: config,
  }
}

export const setSpamFilterIPConfig = config => {
  return {
    type: SET_ADMIN_SPAM_FILTER_IP,
    payload: config,
  }
}

export const setSpamFilterDomainConfig = config => {
  return {
    type: SET_ADMIN_SPAM_FILTER_DOMAIN,
    payload: config,
  }
}

export const setSpamFilterEmailConfig = config => {
  return {
    type: SET_ADMIN_SPAM_FILTER_EMAIL,
    payload: config,
  }
}

export const setSpamFilterSubjectConfig = config => {
  return {
    type: SET_ADMIN_SPAM_FILTER_SUBJECT,
    payload: config,
  }
}

export const setSpamFilterFileConfig = config => {
  return {
    type: SET_ADMIN_SPAM_FILTER_FILE,
    payload: config,
  }
}

export const setRestrictionDomainConfig = config => {
  return {
    type: SET_ADMIN_RESTRICTION_DOMAIN,
    payload: config,
  }
}

export const setRestrictionFileConfig = config => {
  return {
    type: SET_ADMIN_RESTRICTION_FILE,
    payload: config,
  }
}

export const setClearSpamConfig = config => {
  return {
    type: SET_CLEAR_STATE_SPAM,
    payload: config,
  }
}
