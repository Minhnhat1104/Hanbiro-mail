// @ts-nocheck
import { shareboxHelper } from "components/Common/ComposeMail"

export const fileActionPermission = {
  isDisabled: function (action, menu) {
    return menu === "Spam" && ["save-cloud", "download", "preview"].indexOf(action) !== -1
  },
  // Allow review or not
  isFileReview: function (fileObject, menu) {
    return (
      isNotShareViewEml(fileObject, menu) &&
      (fileObject.preview != "" || fileObject.preview2 != "" ? true : false)
    )
  },

  isDeleteFn: function (fileObject, isShareMenu) {
    return !isShareMenu && fileObject.isremove === "Y"
  },
}

const isNotShareViewEml = (file, menu) => {
  try {
    const isShareBox = shareboxHelper.isSharebox(menu)
    if (!isShareBox) return true
    const preview = file.preview2
    if (preview.indexOf("/email/emlview") == 0) return false
    return true
  } catch (error) {
    return true
  }
}

const isDisabledFeatures = (domain, userData, menu_list) => {
  const _customers = {
    "crownchang.co.kr": ["save-cloud", "download", "preview"],
    "global.hanbiro.com": [],
  }

  const _ipBlocked = {
    "211.63.161.255": ["download"],
  }
  const isInArray = function (value, array) {
    return array.indexOf(value) > -1
  }

  const isIpDisabled = function (hide_ip, userData) {
    hide_ip = hide_ip.split(".")
    const ip_address = userData.ip_address
    return ip_address.split(".").map(function (i, index) {
      if (i == hide_ip[index] && index < 3) return true
      if (index == 3 && i < 256) return true

      return false
    })
  }

  const menuService = {
    service: (menu, menu_list = []) => {
      return !!menu_list.find((item) => item.name === menu)
    },
  }

  function call(domain, userData, menu_list) {
    return function (feature) {
      if (feature == "save-cloud" && menuService && !menuService.service("disk", menu_list)) {
        return true
      }

      if (_customers[domain] && isInArray(feature, _customers[domain])) {
        return true
      }

      let _checkIP = false
      for (const [ip, obj] of Object.entries(_ipBlocked)) {
        if (obj.includes(feature) && !isIpDisabled(ip, userData).includes(false)) {
          _checkIP = true
          break
        }
      }

      return _checkIP
    }
  }

  return call(domain, userData, menu_list)
}

export const getFilePermission = (file, config, menu) => {
  const menu_list = config?.allConfig?.menu_list
  const userData = config?.userConfig
  const domain = userData?.session_host

  const isShareMenu = menu?.includes("HBShare_")

  const isDownload =
    !isDisabledFeatures(domain, userData, menu_list)("download") &&
    !fileActionPermission.isDisabled("download", menu)

  const isDelete = fileActionPermission.isDeleteFn(file, isShareMenu)

  const saveCloud =
    !isDisabledFeatures(domain, userData, menu_list)("save-cloud") &&
    !fileActionPermission.isDisabled("save-cloud", menu)

  const isPreview =
    fileActionPermission.isFileReview(file, menu) &&
    !isDisabledFeatures(domain, userData, menu_list)("preview") &&
    !fileActionPermission.isDisabled("preview", menu)

  return {
    download: isDownload,
    delete: isDelete,
    preview: isPreview,
    clouddisk: saveCloud,
  }
}
