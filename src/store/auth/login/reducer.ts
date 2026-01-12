// @ts-nocheck
import { API_ERROR, LOGIN_SUCCESS, LOGIN_USER, LOGOUT_USER, LOGOUT_USER_SUCCESS, REQUIRE_OTP } from "./actionTypes"

const initialState = {
  error: "",
  isLoggedIn: false,
  loading: false,
  requireOTP: false
}

const login = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER:
      state = {
        ...state,
        loading: true,
        error: ""
      }
      break
    case REQUIRE_OTP:
      state = {
        ...state,
        requireOTP: true,
        loading: false
      }
      break
    case LOGIN_SUCCESS:
      state = {
        ...state,
        loading: false,
        isLoggedIn: true,
        isUserLogout: false,
        requireOTP: false
      }
      break
    case LOGOUT_USER:
      state = { ...state, error: "", requireOTP: false }
      break
    case LOGOUT_USER_SUCCESS:
      state = { ...state, isUserLogout: true, isLoggedIn: false, requireOTP: false }
      break
    case API_ERROR:
      state = { ...state, error: action.payload, loading: false, isUserLogout: false, }
      break
    default:
      state = { ...state }
      break
  }
  return state
}

export default login
