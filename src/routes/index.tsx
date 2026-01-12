// @ts-nocheck
import React, { lazy } from "react"

import { Navigate } from "react-router-dom"

import { SETTING_URL_FIRST_PAGE } from "../constants/setting"

// Authentication related pages
import Login from "../pages/Authentication/Login"

import Logout from "../pages/Authentication/Logout"
import Register from "../pages/Authentication/Register"
import ForgetPwd from "../pages/Authentication/ForgetPassword"

// Email
import List from "../pages/List/index"
import Detail from "../pages/Detail/index"

export const RoutePaths = {
  // Common
  // CommonList: "/mail/list/:menu?/",
  // CommonDetail: "/mail/list/:menu/:mid",
  // CommonMain: "/mail/list/:menu?/:mid?",
  CommonMain: "/mail/list/:menu?/*",
  // PermitMail: "/mail/list/:menu/:page/:linenum/:sortkey/:sorttype/:simplesearch",
  // Settings
  SettingWriting: "/mail/setting/writing",
  SettingSignature: "/mail/setting/signature",
  SettingAutoSort: "/mail/setting/auto-sort",
  SettingVacationAutoReply: "/mail/setting/auto-reply",
  SettingBlockedAddresses: "/mail/setting/block-addresses",
  SettingSpamSettings: "/mail/setting/spam",
  SettingFolders: "/mail/setting/folders",
  SettingForwarding: "/mail/setting/forwarding",
  SettingWhiteList: "/mail/setting/white-list",
  SettingPop3Imap: "/mail/setting/pop3imap",
  SettingAlias: "/mail/setting/alias",
  SettingAutoComplete: "/mail/setting/auto-complete",
  SettingFetching: "/mail/setting/fetching",
  // Admin
  AdminApprovalPolicy: "/mail/admin/manager",
  AdminPriorApproval: "/mail/admin/auto-permit-condition",
  AdminCreateAliasAccount: "/mail/admin/create-alias-account",
  AdminEditAliasAccount: "/mail/admin/alias/:id",
  AdminAliasDomain: "/mail/admin/alias-domain",
  AdminHideForwarding: "/mail/admin/hide-forwarding",
  AdminSpamManager: "/mail/admin/spam-manager",
  AdminSharingResigneeMailbox: "/mail/admin/retired-mailbox",
  AdminAliasAccounts: "/mail/admin/manage-alias",
  AdminInternalUsers: "/mail/admin/user-setting",
  AdminSignature: "/mail/admin/signature",
  AdminLogAnalysis: "/mail/admin/log-analysis",
  AdminSentRestriction: "/mail/admin/sent-limit",
  AdminDKIMManagement: "/mail/admin/dkim",
  AdminForwardingResigneeMail: "/mail/admin/retired-forward",
  AdminBlockedAccount: "/mail/admin/unblock_email",
  AdminBlockedIPAddress: "/mail/admin/unblock_ip",
  AdminHackingMailReport: "/mail/admin/hacking-mail-report",
  AdminSmtpPop3Imap: "/mail/admin/smtp-pop3-imap/:tab?",
  AdminSmtpPop3ImapStatus: "/mail/admin/smtp-pop3-imap-status",
  AdminForwardingManage: "/mail/admin/forwarding-manage",
  // options
  OpenNewWindow: "/clone-writer/:menu/:mid",
}

const CommonRoutes = [
  // {
  //   path: RoutePaths.CommonList,
  //   component: lazy(() => import("../pages/List/index")),
  // },
  // {
  //   path: RoutePaths.CommonDetail,
  //   component: lazy(() => import("../pages/Detail/index")),
  // },
  {
    path: RoutePaths.CommonMain,
    component: lazy(() => import("../pages/Main/index")),
  },
  // {
  //   path: RoutePaths.PermitMail,
  //   component: lazy(() => import("../pages/PermitMail/index")),
  // }
]

export const SettingRoutes = [
  {
    path: RoutePaths.SettingWriting,
    component: lazy(() => import("../pages/Settings/Writing/index")),
    keyTitle: "mail.mail_write_setting_title",
  },
  {
    path: RoutePaths.SettingSignature,
    component: lazy(() => import("../pages/Settings/Signature/index")),
    keyTitle: "mail.mail_preference_signature",
  },
  {
    path: RoutePaths.SettingAutoSort,
    component: lazy(() => import("../pages/Settings/AutoSort/index")),
    keyTitle: "mail.mail_preference_autosplit",
  },
  {
    path: RoutePaths.SettingVacationAutoReply,
    component: lazy(() => import("../pages/Settings/VacationAutoReply/index")),
    keyTitle: "mail.mail_preference_autorespond",
  },
  {
    path: RoutePaths.SettingBlockedAddresses,
    component: lazy(() => import("../pages/Settings/BlockedAddresses/index")),
    keyTitle: "common.mail_preference_bans",
  },
  {
    path: RoutePaths.SettingSpamSettings,
    component: lazy(() => import("../pages/Settings/SpamSettings/index")),
    keyTitle: "mail.mail_preference_spam",
  },
  {
    path: RoutePaths.SettingFolders,
    component: lazy(() => import("../pages/Settings/Folders/index")),
    keyTitle: "mail.mail_preference_mailbox",
  },
  {
    path: RoutePaths.SettingForwarding,
    component: lazy(() => import("../pages/Settings/Forwarding/index")),
    keyTitle: "mail.mail_preference_forward",
  },
  {
    path: RoutePaths.SettingWhiteList,
    component: lazy(() => import("../pages/Settings/WhiteList/index")),
    keyTitle: "common.mail_preference_whitelist",
  },
  {
    path: RoutePaths.SettingPop3Imap,
    component: lazy(() => import("../pages/Settings/Pop3Imap/index")),
    keyTitle: "mail.mail_preference_smtp_pop3_imap",
    // checkDisable: "pop3imap",
  },
  {
    path: RoutePaths.SettingAlias,
    component: lazy(() => import("../pages/Settings/Alias/index")),
    keyTitle: "mail.mailadmin_aliasuseredit",
  },
  {
    path: RoutePaths.SettingAutoComplete,
    component: lazy(() => import("../pages/Settings/AutoComplete/index")),
    keyTitle: "mail.mail_preference_auto_complete_setting",
  },
  {
    path: RoutePaths.SettingFetching,
    component: lazy(() => import("../pages/Settings/Fetching/index")),
    keyTitle: "mail.mail_preference_pop3",
    checkDisable: "fetchingmail",
  },
]

export const AdminRoutes = [
  {
    path: RoutePaths.AdminApprovalPolicy,
    component: lazy(() => import("../pages/Admin/ApprovalPolicy/index")),
    keyTitle: "mail.mail_admin_permit_policy",
    checkDisable: "approval_mailbox",
  },
  {
    path: RoutePaths.AdminPriorApproval,
    component: lazy(() => import("../pages/Admin/PriorApproval/index")),
    keyTitle: "mail.mail_prior_permit",
    checkDisable: "approval_mailbox",
  },
  {
    path: RoutePaths.AdminCreateAliasAccount,
    component: lazy(() => import("../pages/Admin/CreateAliasAccount/index")),
    keyTitle: "mail.mailadmin_aliasuseradd",
    checkDisable: "alias_account_menu",
  },
  {
    path: RoutePaths.AdminAliasAccounts,
    component: lazy(() => import("../pages/Admin/AliasAccounts/index")),
    keyTitle: "admin.mailadmin_aliasuseredit",
    checkDisable: "alias_account_menu",
  },
  {
    path: RoutePaths.AdminAliasDomain,
    component: lazy(() => import("../pages/Admin/AliasDomain/index")),
    keyTitle: "mail.alias_domains",
  },
  {
    path: RoutePaths.AdminSpamManager,
    component: lazy(() => import("../pages/Admin/SpamManager/index")),
    keyTitle: "mail.mail_admin_spam_manager",
  },
  {
    path: RoutePaths.AdminSharingResigneeMailbox,
    component: lazy(() => import("../pages/Admin/SharingResigneeMailbox/index")),
    keyTitle: "mail.admin_share_retired_mail",
  },
  {
    path: RoutePaths.AdminInternalUsers,
    component: lazy(() => import("../pages/Admin/InternalUsers/index")),
    keyTitle: "mail.mail_internal_users",
  },
  {
    path: RoutePaths.AdminSignature,
    component: lazy(() => import("../pages/Admin/Signature/index")),
    keyTitle: "mail.mail_preference_signature",
  },
  {
    path: RoutePaths.AdminLogAnalysis,
    component: lazy(() => import("../pages/Admin/LogAnalysis/index")),
    keyTitle: "mail.mail_log_analysis",
  },
  {
    path: RoutePaths.AdminSentRestriction,
    component: lazy(() => import("../pages/Admin/SentRestriction/index")),
    keyTitle: "mail.mail_sent_limit",
  },
  {
    path: RoutePaths.AdminDKIMManagement,
    component: lazy(() => import("../pages/Admin/DKIMManagement/index")),
    keyTitle: "mail.mail_dkim_name",
  },
  {
    path: RoutePaths.AdminHideForwarding,
    component: lazy(() => import("../pages/Admin/HideForwarding/index")),
    keyTitle: "mail.mail_hide_forwarding",
    checkDisable: "forward_menu",
  },
  {
    path: RoutePaths.AdminForwardingResigneeMail,
    component: lazy(() => import("../pages/Admin/ForwardingResigneeMail/index")),
    keyTitle: "mail.mail_retired_forward_title",
    checkDisable: "forward_menu",
  },
  {
    path: RoutePaths.AdminBlockedAccount,
    component: lazy(() => import("../pages/Admin/BlockedAccount/index")),
    keyTitle: "mail.blocked_account",
    checkDisable: "block_menu",
  },
  {
    path: RoutePaths.AdminBlockedIPAddress,
    component: lazy(() => import("../pages/Admin/BlockedIPAddress/index")),
    keyTitle: "mail.blocked_ip",
    checkDisable: "block_menu",
  },
  {
    path: RoutePaths.AdminHackingMailReport,
    component: lazy(() => import("../pages/Admin/HackingMailReport/index")),
    keyTitle: "mail.mail_hacking_mail_report",
    checkDisable: "hacking_mail_report",
  },
  {
    path: RoutePaths.AdminForwardingManage,
    component: lazy(() => import("../pages/Admin/ForwardingManage/index")),
    keyTitle: "mail.mail_forwarding_management",
    checkDisable: "forward_menu",
  },
  {
    path: RoutePaths.AdminEditAliasAccount,
    component: lazy(() => import("../pages/Admin/CreateAliasAccount/index")),
    keyTitle: "mail.mailadmin_aliasuseradd",
    checkDisable: true,
  },
  {
    path: RoutePaths.AdminSmtpPop3ImapStatus,
    component: lazy(() => import("../pages/Admin/SmtpPop3ImapStatus/index")),
    keyTitle: "mail.mail_user_status_management",
    checkDisable: "smtp_pop3_imap",
  },
  {
    path: RoutePaths.AdminSmtpPop3Imap,
    component: lazy(() => import("../pages/Admin/SmtpPop3Imap/index")),
    keyTitle: "mail.mail_ip_blocking_permission_management",
    checkDisable: "smtp_pop3_imap",
  },
]

const authProtectedRoutes = [
  // this route should be at the end of all other routes
  {
    path: "/",
    exact: true,
    component: <Navigate to={SETTING_URL_FIRST_PAGE} />,
    // component: lazy(() => import("../pages/Main/index"))
  },
]

const lazyProtectedRoutes = [...CommonRoutes, ...SettingRoutes, ...AdminRoutes]

const routesForNewWindow = [
  {
    path: RoutePaths.OpenNewWindow,
    component: lazy(() => import("../pages/Detail/DetailForNewWindow")),
  },
]

const publicRoutes = [
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },
  { path: "/forgot-password", component: <ForgetPwd /> },
  { path: "/register", component: <Register /> },
]

export { authProtectedRoutes, publicRoutes, lazyProtectedRoutes, routesForNewWindow }
