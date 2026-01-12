// @ts-nocheck
import { combineReducers } from "redux"

// Front
import Layout from "./layout/reducer"

// Authentication
import Login from "./auth/login/reducer"
import Account from "./auth/register/reducer"
import ForgetPassword from "./auth/forgetpwd/reducer"
import Profile from "./auth/profile/reducer"
import Config from "./auth/config/reducer"
import EmailConfig from "./emailConfig/reducer"
import ComposeMail from "./composeMail/reducer"
import AdminSetting from "./adminSetting/reducer"
import Socket from "./socket/reducer"
import viewMode from "./viewMode/reducer"
import QueryParams from "./mailList/reducer"
import mailDetail from "./mailDetail/reducer"

const rootReducer = combineReducers({
  // public
  Layout,
  Login,
  Account,
  ForgetPassword,
  Profile,
  Config,
  EmailConfig,
  ComposeMail,
  AdminSetting,
  Socket,
  viewMode,
  QueryParams,
  mailDetail,
})

export default rootReducer
