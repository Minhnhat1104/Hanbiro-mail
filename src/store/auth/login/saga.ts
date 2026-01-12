// @ts-nocheck
import { call, put, takeEvery, takeLatest } from "redux-saga/effects"

// Login Redux States
import { CHECK_COOKIES, LOGIN_USER, LOGOUT_USER, REQUIRE_OTP, SOCIAL_LOGIN } from "./actionTypes"
import { apiError, loginSuccess, logoutUserSuccess } from "./actions"
import { getConfig } from "store/auth/config/actions"
import { login } from "modules/auth/api"

//Include Both Helper File with needed methods
import { getFirebaseBackend } from "../../../helpers/firebase_helper"
import { postSocialLogin } from "../../../helpers/fakebackend_helper"

import { SETTING_URL_FIRST_PAGE } from "constants/setting"
import Cookies from "universal-cookie"

const fireBaseBackend = getFirebaseBackend()

const cookies = new Cookies()

function* onLogin({ payload: { user, history } }) {
  try {
    // if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
    //   const response = yield call(
    //     fireBaseBackend.onLogin,
    //     user.email,
    //     user.password
    //   )
    //   yield put(loginSuccess(response))
    // } else if (process.env.REACT_APP_DEFAULTAUTH === "jwt") {
    //   const response = yield call(postJwtLogin, {
    //     email: user.email,
    //     password: user.password,
    //   })
    //   localStorage.setItem("authUser", JSON.stringify(response))
    //   yield put(loginSuccess(response))
    // } else if (process.env.REACT_APP_DEFAULTAUTH === "fake") {
    //   const response = yield call(postFakeLogin, {
    //     email: user.email,
    //     password: user.password,
    //   })
    //   localStorage.setItem("authUser", JSON.stringify(response))
    //   yield put(loginSuccess(response))
    // }

    let params = {
      gw_id: user.id,
      gw_pass: user.password,
      auto_save_id: 1,
    }
    if (user?.code) {
      params.code = user?.code
    }

    const response = yield call(login, params, user?.host)
    if (response.success) {
      localStorage.setItem("auth.token", response.jwt)
      yield put(loginSuccess(response))

      cookies.set("hmail_key", response.hmail_key);
      cookies.set("HANBIRO_GW", response.session);

      yield put(getConfig())
      history(SETTING_URL_FIRST_PAGE)
    } else {
      if (response?.code && response.code === "otp") {
        yield put({ type: REQUIRE_OTP })
      } else {
        yield put(apiError(response.msg))
      }
    }

    // yield put(loginSuccess(response))
  } catch (error) {
    console.log("error ==> ", error)
    yield put(apiError(error.message))
  }
}

function* logoutUser({ payload: { history } }) {
  try {
    localStorage.removeItem("token")
    localStorage.removeItem("host")

    const cookieOptions = {
      path: "/",
    }
    cookies.remove("hmail_key", cookieOptions)
    cookies.remove("HANBIRO_GW", cookieOptions)

    yield put(logoutUserSuccess())
    history("/login")
  } catch (error) {
    yield put(apiError(error))
  }
}

function* socialLogin({ payload: { data, history, type } }) {
  try {
    if (process.env.REACT_APP_DEFAULTAUTH === "firebase") {
      const fireBaseBackend = getFirebaseBackend()
      const response = yield call(fireBaseBackend.socialLoginUser, data, type)
      localStorage.setItem("authUser", JSON.stringify(response))
      yield put(loginSuccess(response))
    } else {
      const response = yield call(postSocialLogin, data)
      localStorage.setItem("authUser", JSON.stringify(response))
      yield put(loginSuccess(response))
    }
    history("/dashboard")
  } catch (error) {
    yield put(apiError(error))
  }
}

function* onCheckCookies({ payload: { history } }) {
  history(SETTING_URL_FIRST_PAGE)
  if (cookies.get("HANBIRO_GW") && cookies.get("hmail_key")) { // Already logged in from somewhere
    yield put(loginSuccess())
    yield put(getConfig())
    history("/")
  } else {
    yield put(logoutUserSuccess())
    history("/login")
  }
}

function* authSaga() {
  yield takeEvery(LOGIN_USER, onLogin)
  yield takeLatest(SOCIAL_LOGIN, socialLogin)
  yield takeEvery(LOGOUT_USER, logoutUser)
  // yield takeLatest(CHECK_COOKIES, onCheckCookies)
}

export default authSaga
