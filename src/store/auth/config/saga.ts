// @ts-nocheck
import { call, put, takeEvery, takeLatest } from "redux-saga/effects"

import { getConfig, postPersonalSetting } from "modules/auth/api"

import { GET_CONFIG, SAVE_MAIL_PERSONAL_SETTING, } from "store/auth/config/actionTypes"
import { setAllConfig, setGlobalConfig, setMailPersonalSetting, setPersonalSetting, setUserConfig, } from "store/auth/config/actions"

function* onGetConfig() {
  const params = {
    im_not_app: 1,
  }

  const response = yield call(getConfig, params)
  yield put(setAllConfig(response.rows))
  yield put(setGlobalConfig(response.rows.global_config))
  yield put(setUserConfig(response.rows.user_config))
  yield put(setPersonalSetting(response.rows.personal_setting))
}

function* onSavPersonalSetting(action) {
  const result = yield call(postPersonalSetting, {
    ...action.payload,
    category: "mail",
  })

  if (result?.success) {
    yield put(setMailPersonalSetting(action.payload))
  }

}

function* configSaga() {
  yield takeEvery(GET_CONFIG, onGetConfig)
  yield takeLatest(SAVE_MAIL_PERSONAL_SETTING, onSavPersonalSetting)
}

export default configSaga
