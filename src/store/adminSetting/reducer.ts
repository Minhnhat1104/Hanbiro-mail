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

const initialState = {
  spamManager: {
    spam: null,
    unspam: null,
    filter: {
      ip: null,
      domain: null,
      email: null,
      subject: null,
      file: null,
    },
  },
  restriction: {
    domain: null,
    file: null,
  },
}

const adminSpam = (state = initialState, action) => {
  switch (action.type) {
    case SET_ADMIN_SPAM:
      state = {
        ...state,
        spamManager: {
          ...state.spamManager,
          spam: action.payload,
        },
      }
      break
    case SET_ADMIN_UNSPAM:
      state = {
        ...state,
        spamManager: {
          ...state.spamManager,
          unspam: action.payload,
        },
      }
      break
    case SET_ADMIN_SPAM_FILTER_IP:
      state = {
        ...state,
        spamManager: {
          ...state.spamManager,
          filter: {
            ...state.spamManager.filter,
            ip: action.payload,
          },
        },
      }
      break
    case SET_ADMIN_SPAM_FILTER_DOMAIN:
      state = {
        ...state,
        spamManager: {
          ...state.spamManager,
          filter: {
            ...state.spamManager.filter,
            domain: action.payload,
          },
        },
      }
      break
    case SET_ADMIN_SPAM_FILTER_EMAIL:
      state = {
        ...state,
        spamManager: {
          ...state.spamManager,
          filter: {
            ...state.spamManager.filter,
            email: action.payload,
          },
        },
      }
      break
    case SET_ADMIN_SPAM_FILTER_SUBJECT:
      state = {
        ...state,
        spamManager: {
          ...state.spamManager,
          filter: {
            ...state.spamManager.filter,
            subject: action.payload,
          },
        },
      }
      break
    case SET_ADMIN_SPAM_FILTER_FILE:
      state = {
        ...state,
        spamManager: {
          ...state.spamManager,
          filter: {
            ...state.spamManager.filter,
            file: action.payload,
          },
        },
      }
      break
    case SET_ADMIN_RESTRICTION_DOMAIN:
      state = {
        ...state,
        restriction: {
          ...state.restriction,
          domain: action.payload,
        },
      }
      break
    case SET_ADMIN_RESTRICTION_FILE:
      state = {
        ...state,
        restriction: {
          ...state.restriction,
          file: action.payload,
        },
      }
      break
    case SET_CLEAR_STATE_SPAM:
      state = initialState
      break
  }

  return state
}

export default adminSpam
