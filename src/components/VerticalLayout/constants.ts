// @ts-nocheck
import { RoutePaths } from "routes"

export const initMenu = {
  share: {
    keyTitle: "mail.mail_shared_mail_boxes",
    path: "HBShare_",
    disabled: true,
  },
  folder: {
    keyTitle: "mail.mail_menu_private",
    disabled: true,
  },
  all: {
    key: "all",
    keyTitle: "mail.mail_all_mailboxes",
    new: 0,
  },
}

export const settingsMenu = [
  {
    key: "setting",
    keyTitle: "mail.mail_menu_preference",
    url: "/mail/setting/writing",
    icon: "mdi mdi-cog-outline",
  },
  {
    key: "admin",
    keyTitle: "common.board_admin_menu_text",
    url: "/mail/admin/signature",
    icon: "mdi mdi-account-cog-outline",
  },
]

export const tabletSettingMenus = [
  {
    keyTitle: "common.main_config_menu",
    url: "/mail/setting/writing",
    icon: "mdi mdi-cog-outline font-size-16 me-3",
    disabled: true,
  },
  {
    keyTitle: "common.board_admin_menu_text",
    url: "/mail/admin/signature",
    icon: "mdi mdi-account-cog-outline font-size-16 me-3",
    disabled: true,
  },
]

export const subSettingsMenu = [
  {
    key: "writing",
    keyTitle: "mail.mail_write_setting_title",
    url: RoutePaths.SettingWriting,
  },
  {
    key: "signature",
    keyTitle: "mail.mail_preference_signature",
    url: RoutePaths.SettingSignature,
  },
  {
    key: "auto-sort",
    keyTitle: "mail.mail_preference_autosplit",
    url: RoutePaths.SettingAutoSort,
  },
  {
    key: "auto-reply",
    keyTitle: "mail.mail_preference_autorespond",
    url: RoutePaths.SettingVacationAutoReply,
  },
  {
    key: "block-addresses",
    keyTitle: "common.mail_preference_bans",
    url: RoutePaths.SettingBlockedAddresses,
  },
  {
    key: "spam",
    keyTitle: "mail.mail_preference_spam",
    url: RoutePaths.SettingSpamSettings,
  },
  {
    key: "folders",
    keyTitle: "mail.mail_preference_mailbox",
    url: RoutePaths.SettingFolders,
  },
  {
    key: "forwarding",
    keyTitle: "mail.mail_preference_forward",
    url: RoutePaths.SettingForwarding,
  },
  {
    key: "white-list",
    keyTitle: "common.mail_preference_whitelist",
    url: RoutePaths.SettingWhiteList,
  },
  {
    key: "pop3imap",
    keyTitle: "mail.mail_preference_smtp_pop3_imap",
    url: RoutePaths.SettingPop3Imap,
  },
  {
    key: "alias",
    keyTitle: "mail.mailadmin_aliasuseredit",
    url: RoutePaths.SettingAlias,
  },
  {
    key: "auto-complete",
    keyTitle: "mail.mail_preference_auto_complete_setting",
    url: RoutePaths.SettingAutoComplete,
  },
  {
    key: "fetching",
    keyTitle: "mail.mail_preference_pop3",
    url: RoutePaths.SettingFetching,
    checkDisable: "fetchingmail",
  },
]

export const subAdminMenu = [
  {
    key: "manager",
    path: RoutePaths.AdminApprovalPolicy,
    keyTitle: "mail.mail_admin_permit_policy",
    checkDisable: "approval_mailbox",
  },
  {
    key: "auto-permit-condition",
    path: RoutePaths.AdminPriorApproval,
    keyTitle: "mail.mail_prior_permit",
    checkDisable: "approval_mailbox",
  },
  {
    key: "alias-domain",
    path: RoutePaths.AdminAliasDomain,
    keyTitle: "mail.alias_domains",
  },
  {
    key: "spam-manager",
    path: RoutePaths.AdminSpamManager,
    keyTitle: "mail.mail_admin_spam_manager",
  },
  {
    key: "retired-mailbox",
    path: RoutePaths.AdminSharingResigneeMailbox,
    keyTitle: "mail.admin_share_retired_mail",
  },
  {
    key: "create-alias-account",
    path: RoutePaths.AdminCreateAliasAccount,
    keyTitle: "mail.mailadmin_aliasuseradd",
    checkDisable: "alias_account_menu",
  },
  {
    key: "manage-alias",
    path: RoutePaths.AdminAliasAccounts,
    keyTitle: "admin.mailadmin_aliasuseredit",
    checkDisable: "alias_account_menu",
  },
  {
    key: "user-setting",
    path: RoutePaths.AdminInternalUsers,
    keyTitle: "mail.mail_internal_users",
  },
  {
    key: "signature",
    path: RoutePaths.AdminSignature,
    keyTitle: "mail.mail_preference_signature",
  },
  {
    key: "log-analysis",
    path: RoutePaths.AdminLogAnalysis,
    keyTitle: "mail.mail_log_analysis",
  },
  {
    key: "sent-limit",
    path: RoutePaths.AdminSentRestriction,
    keyTitle: "mail.mail_sent_limit",
  },
  {
    key: "dkim",
    path: RoutePaths.AdminDKIMManagement,
    keyTitle: "mail.mail_dkim_name",
  },
  {
    key: "hide-forwarding",
    path: RoutePaths.AdminHideForwarding,
    keyTitle: "mail.mail_hide_forwarding",
    checkDisable: "forward_menu",
  },
  {
    key: "retired-forward",
    path: RoutePaths.AdminForwardingResigneeMail,
    keyTitle: "mail.mail_retired_forward_title",
    checkDisable: "forward_menu",
  },
  {
    key: "unblock_email",
    path: RoutePaths.AdminBlockedAccount,
    keyTitle: "mail.blocked_account",
    checkDisable: "block_menu",
  },
  {
    key: "unblock_ip",
    path: RoutePaths.AdminBlockedIPAddress,
    keyTitle: "mail.blocked_ip",
    checkDisable: "block_menu",
  },
  {
    key: "hacking-mail-report",
    path: RoutePaths.AdminHackingMailReport,
    keyTitle: "mail.mail_hacking_mail_report",
    checkDisable: "hacking_mail_report",
  },
  {
    key: "alias",
    path: RoutePaths.AdminEditAliasAccount,
    keyTitle: "mail.mailadmin_aliasuseradd",
    checkDisable: true,
  },
  {
    key: "forwarding-manage",
    path: RoutePaths.AdminForwardingManage,
    keyTitle: "mail.mail_forwarding_management",
    checkDisable: "forward_menu",
  },
]
