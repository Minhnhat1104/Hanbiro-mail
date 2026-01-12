// @ts-nocheck
import { generateUUID } from "components/Common/Attachment/HanModalClouddisk/utils"
import { composeDisplayModeOptions } from "components/Common/ComposeMail/ComposeCenter"
import {
  OPEN_COMPOSE_MAIL,
  CLOSE_COMPOSE_MAIL,
  OPEN_ORG_MODAL,
  CLOSE_ORG_MODAL,
  EXPAND_COMPOSE_MODAL,
  UPDATE_COMPOSE_DATA,
  UPDATE_LOCAL_COMPOSE_MODE,
  FORCE_UPDATE_COMPOSE_DATA,
} from "store/composeMail/actionTypes"

export const composeDataDefaults = {
  id: "",
  mid: "",
  modeType: "",
  composeMode: "", // expand - collapse - minimize
  uuids: undefined,
  shareId: undefined,
  toAddress: undefined,
  selectedMails: undefined,
  titleCompose: undefined,
  listMail: undefined,
}
// expandComposeId: "",
// expandComposeId: "",
export const initialState = {
  composeMails: {
    localComposeMode: "",
    data: [],
  },
  showOrgModal: {
    show: false,
    type: "to", // to || cc || bcc > Type of selected tab
  },
}

const addNewComposeMail = (data, payload) => {
  const nData = [...data].map((item) => ({
    ...item,
    composeMode: composeDisplayModeOptions.MINIMIZE,
  }))
  nData.unshift({ ...payload, id: generateUUID() })
  return nData
}

const updateComposeMode = (data, payload) => {
  const nData = [...data].map((item) => {
    if (item.id === payload.id) {
      return { ...item, ...payload }
    } else {
      if (payload.composeMode !== composeDisplayModeOptions.MINIMIZE) {
        return { ...item, composeMode: composeDisplayModeOptions.MINIMIZE }
      } else {
        return item
      }
    }
  })
  return nData
}

const removeComposeMail = (data, id) => {
  return [...data].filter((d) => d.id !== id)
}

const compose = (state = initialState, action) => {
  switch (action.type) {
    case OPEN_COMPOSE_MAIL:
      return {
        ...state,
        composeMails: {
          ...state.composeMails,
          data: addNewComposeMail(state.composeMails.data, action.payload),
        },
      }
    case UPDATE_COMPOSE_DATA:
      return {
        ...state,
        composeMails: {
          ...state.composeMails,
          data: updateComposeMode(state.composeMails.data, action.payload),
        },
      }
    case UPDATE_LOCAL_COMPOSE_MODE:
      return {
        ...state,
        composeMails: {
          ...state.composeMails,
          localComposeMode: action.payload,
        },
      }
    case CLOSE_COMPOSE_MAIL:
      return {
        ...state,
        composeMails: {
          ...state.composeMails,
          data: removeComposeMail(state.composeMails.data, action.payload),
        },
      }
    case FORCE_UPDATE_COMPOSE_DATA:
      return {
        ...state,
        composeMails: {
          ...state.composeMails,
          data: action.payload,
        },
      }
    case OPEN_ORG_MODAL:
      return {
        ...state,
        showOrgModal: {
          show: true,
          type: action?.payload?.type || "to",
          composeId: action?.payload?.composeId || "",
        },
      }
    case CLOSE_ORG_MODAL:
      return {
        ...state,
        showOrgModal: {
          show: false,
          type: action?.payload || "to",
        },
      }
    case EXPAND_COMPOSE_MODAL:
      return {
        ...state,
        expandComposeMail: action.payload,
      }
    default:
      // return state
      return { ...state }
  }
}

export default compose
