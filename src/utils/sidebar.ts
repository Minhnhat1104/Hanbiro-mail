import { isArray, isEmpty } from "lodash"

export const formatAdminMenu = (AdminRoutes, extMenus, interfaceConfig) => {
  let newAdminMenus: any[] = []
  if (interfaceConfig?.mail_secure == "1") {
    newAdminMenus.push({
      keyTitle: "mail.mail_admin_permit_mailbox",
      path: "/mail/admin/approval-mailbox",
      disabled: true,
      children: [AdminRoutes[0], AdminRoutes[1]],
    })
  }

  let aliasAccountMenu: any = {
    keyTitle: "mail.mail_alias",
    path: "mail/admin/alias-account",
    disabled: true,
    children: [],
  }

  let forwardMenu: any = {
    keyTitle: "mail.mail_write_setting_forward",
    path: "/mail/admin/forward",
    disabled: true,
    children: [],
  }

  let blockMenu: any = {
    keyTitle: "mail.blocked_list",
    path: "/mail/admin/block",
    disabled: true,
    children: [],
  }

  let smtpPop3ImapMenu: any = {
    keyTitle: "mail.mail_smtp_pop3_imap_management",
    path: "/mail/admin/smtp-pop3-imap",
    disabled: true,
    children: [],
  }

  AdminRoutes?.map((menu) => {
    if (menu?.checkDisable) {
      if (
        (menu?.checkDisable == "hide_forwarding" && interfaceConfig?.mail_hideforward) ||
        (menu?.checkDisable == "hacking_mail_report" && extMenus?.canhack)
      ) {
        newAdminMenus.push(menu)
      }
      if (menu?.checkDisable === "alias_account_menu") {
        aliasAccountMenu.children.push(menu)
      }
      if (menu?.checkDisable === "forward_menu") {
        forwardMenu.children.push(menu)
      }
      if (menu?.checkDisable === "block_menu") {
        blockMenu.children.push(menu)
      }
      if (menu?.checkDisable === "smtp_pop3_imap") {
        smtpPop3ImapMenu.children.push(menu)
      }
    } else {
      newAdminMenus.push(menu)
    }
  })
  newAdminMenus.push(aliasAccountMenu)
  newAdminMenus.push(forwardMenu)
  newAdminMenus.push(blockMenu)
  newAdminMenus.push(smtpPop3ImapMenu)
  return newAdminMenus
}

export const formatSettingMenu = (SettingRoutes, extMenus, disableList) => {
  let newSettingMenus: any[] = []
  SettingRoutes?.map((menu) => {
    if (menu?.checkDisable) {
      let check = isDisableSetting(disableList, menu?.checkDisable)
      // if (
      //   !check &&
      //   ((menu?.checkDisable == "fetchingmail" && extMenus.isext) ||
      //     (menu?.checkDisable == "forwarding" && extMenus.isforward))
      // )
      newSettingMenus.push(menu)
    } else {
      newSettingMenus.push(menu)
    }
  })
  return newSettingMenus
}

export const isDisableSetting = (disableList, menu) => {
  return disableList && disableList.length > 0 && disableList.indexOf(menu) !== -1
}

export const updateFolderMenus = (list, menu, subMenu) => {
  if (!isArray(list)) return []
  let result: any[] = []
  list.forEach((folder) => {
    if (folder?.key === menu?.key) {
      result.push({
        ...folder,
        children: subMenu?.map((sub) => ({ ...sub, value: sub?.key, label: sub?.name })),
      })
    } else {
      if (!isEmpty(folder?.children)) {
        result.push({ ...folder, children: updateFolderMenus(folder?.children, menu, subMenu) })
      } else {
        result.push(folder)
      }
    }
  })
  return result
}

export const setCountFolderMenu = (list, newCount) => {
  let nFolders: any[] = []
  list?.forEach((folder) => {
    if (folder?.children) {
      nFolders.push({
        ...folder,
        new: newCount[folder?.key],
        children: setCountFolderMenu(folder?.children, newCount),
      })
    } else {
      nFolders.push({ ...folder, new: newCount[folder?.key] })
    }
  })
  return nFolders
}
