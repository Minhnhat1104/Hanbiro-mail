// @ts-nocheck
import io from "socket.io-client"
import moment from "moment/moment"
import { t } from "i18next"
import { concat, isEmpty, isUndefined } from "lodash"

export const setBaseHost = (host) => {
  localStorage.setItem("host", host)
}

export const getBaseUrl = (defaultHost = "") => {
  const locationInfo = window.location
  const { host, hostname } = locationInfo
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
      const baseUrlArr = process.env.REACT_APP_BASE_URL?.split("/")
      if (baseUrlArr) {
        return "https://" + baseUrlArr?.[2]
      } else {
        return "https://vndev.hanbiro.com"
      }
    }
  } else {
    const data = defaultHost ? defaultHost : localStorage.getItem("host") || host
    const dataArr = data?.split("/")
    return "https://" + dataArr?.[0]
  }
}

export const getBaseHost = (defaultHost) => {
  const data = defaultHost ?? localStorage.getItem("host")
  return "https://" + data
}

export const getGroupwareUrl = () => {
  let locationInfo = window.location
  const { hostname } = locationInfo
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    if (!process.env.NODE_ENV || process.env.NODE_ENV === "development") {
      return process.env.REACT_APP_BASE_URL
    } else {
      return getBaseHost("global3.hanbiro.com") + "/ngw"
    }
  } else {
    if (window.location !== window.parent.location) {
      locationInfo = window.parent.location
    }
    const { hostname, protocol } = locationInfo
    const absPath = "/ngw"
    let apiUrl = [protocol, "//", hostname, absPath].join("")

    return apiUrl
  }
}

let socketData

export const ServiceSocket = ({ userData = {} }) => {
  if (socketData !== undefined) {
    return socketData
  }
  let locationInfo = window.location
  const { hostname } = locationInfo
  let domainUser = hostname

  // console.log("connect socket ==> ", userData)

  // Check mode development
  if (hostname == "localhost" || hostname == "127.0.0.1") {
    domainUser = "global3.hanbiro.com"
  }

  let wsUrl = ""
  if (document.location.protocol == "https:") {
    wsUrl = "https://" + domainUser + ":" + 8082
    // wsUrl = "https://" + domainUser + ":" + 28388;
  } else {
    wsUrl = "http://" + domainUser + ":" + 8081
    // wsUrl = "http://" + domainUser + ":" + 2838;
  }

  const session = {}
  const socket = io.connect(wsUrl, {
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: "Infinity",
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    randomizationFactor: 0.5,
    forceNew: true,
  })

  socket.on("connect", function () {
    socket.emit("userinfo", {
      userid: userData.id,
      usercn: userData.cn,
      userno: userData.no,
      token: "",
    })
  })

  socketData = socket

  // Socket for counter
  // socket.on("disconnect", function() {});
  return socket
}

export const formatSize = (size) => {
  const i = Math.floor(Math.log(size) / Math.log(1024))
  return (size / Math.pow(1024, i)).toFixed(2) * 1 + " " + ["B", "KB", "MB", "GB", "TB"][i]
}
/**
 * Get extension of file
 * @param {*} fileName
 */
export const getExtensionFile = (fileName = "") => {
  return fileName.split(".").pop().toLowerCase()
}

/**
 * Format size of file
 * @param {*} size
 */
export const humanFileSize = (sizeValue = 0) => {
  const size = parseInt(sizeValue)
  if (!size) {
    return "0 KB"
  }
  const i = Math.floor(Math.log(size) / Math.log(1024))
  return (size / Math.pow(1024, i)).toFixed(2) * 1 + " " + ["B", "KB", "MB", "GB", "TB"][i]
}

export function formatFileSize(fileSize) {
  let size = 0
  if (!fileSize) {
    return ""
  }
  if (typeof fileSize === "string") {
    size = parseInt(fileSize)
  } else {
    size = fileSize
  }

  const units = ["B", "KB", "MB", "GB", "TB"]
  let unit = "B"
  for (let i = 0; i < units.length; i++) {
    if (size < 1024) {
      unit = units[i]
      break
    }
    size = size / 1024
  }
  return `${size.toFixed(2)} ${unit}`
}

export const getAvailableFolders = (
  commonMenus = [],
  folderMenus = [],
  menuKey = "",
  keyword = "",
) => {
  const patt = "",
    searchExp = "",
    availableFolders = [],
    hasKeyword = isUndefined(keyword) && keyword != ""
  if (hasKeyword) {
    searchExp = new RegExp(keyword.toLowerCase())
  }
  if (menuKey == "Maildir") {
    patt = "Storage,Temp,Sent"
  } else if (menuKey == "Storage") {
    patt = "Temp,Maildir,Sent"
  } else if (menuKey == "Sent") {
    patt = "Temp,Storage,Maildir"
  } else if (menuKey == "Temp") {
    patt = "Sent,Storage,Maildir"
  } else if (menuKey == "Folder") {
    patt = ""
  } else {
    patt = "Temp,Storage,Maildir,Sent"
  }

  if (commonMenus.length > 0) {
    commonMenus.map((item, idx) => {
      const patt2 = new RegExp(item.key + "")
      if (patt2.test(patt)) {
        if (hasKeyword) {
          if (searchExp.test(item.name.toLowerCase())) {
            availableFolders.push(item)
          }
        } else {
          availableFolders.push(item)
        }
      }
    })
  }
  availableFolders = concat(availableFolders, folderMenus)
  return availableFolders
}

export const getUserAvatarUrl = (cn, no, width = 35, height = 35) => {
  return (
    getGroupwareUrl() +
    `/org/user/photo/no/${no}/cn/${cn}?width=${width}&height=${height}&t=${Date.now()}`
  )
}

export const formatDateTime = (date, delayDays) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  const hour = String(date.getHours()).padStart(2, "0")
  const minute = String(date.getMinutes()).padStart(2, "0")

  const newDateTime = moment(`${year}/${month}/${day} ${hour}:${minute}`, "YYYY/MM/DD HH:mm")
    .add(delayDays, "days")
    .format("YYYY/MM/DD HH:mm")

  return newDateTime
}

export const formatEmailFrom = (mailFrom) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  let emailRegex = ""
  let emailFromArr = ""
  let emailFrom = ""
  if (mailFrom) {
    if (regex.test(mailFrom)) {
      // email: abc@abc.com
      emailRegex = mailFrom
      return { emailRegex, emailFromArr, emailFrom }
    } else {
      if (mailFrom?.includes("&lt;") && mailFrom?.includes("&gt;")) {
        // email: "ABC BCA" &lt;lamvt22@global.hanbiro.com&gt;
        emailFromArr = mailFrom.split(/"([^"]+)"/)
        if (emailFromArr.length == 1) {
          // email: ABC BCA &lt;mailer-daemon@googlemail.com&gt;
          emailFromArr = mailFrom.split(/&lt;([^"]+)&gt;/)
        }
        emailFrom = mailFrom.replace(/&lt;/g, "<").replace(/&gt;/g, ">")
        return { emailRegex, emailFromArr, emailFrom }
      }
      return { emailRegex, emailFromArr, emailFrom }
    }
  } else return { emailRegex, emailFromArr, emailFrom }
}

export const formatEmailTo = (mailTo = "", myEmail = "") => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  let emailRegex = ""
  let emailTo = ""
  let checkEmailTo = false // Check if emailTo is more than 1
  let emailToArr = []
  let emailToFormat = ""
  if (mailTo) {
    if (regex.test(mailTo)) {
      // email: abc@abc.com
      emailRegex = mailTo
      return { emailRegex, emailTo, checkEmailTo, emailToArr, emailToFormat }
    } else {
      // Format email => You and 1,2,... others
      if (mailTo?.split(",").length > 1) {
        checkEmailTo = true
        // Check if myEmail is in mailTo
        if (mailTo?.includes(myEmail)) {
          emailTo = [
            t("board.board_like_you_and"),
            mailTo?.split(",").length - 1,
            t("common.board_like_others"),
          ].join(" ")
        } else {
          emailTo = [mailTo?.split(",")?.[0], "and", mailTo?.split(",").length - 1, "others"].join(
            " ",
          )
        }
        emailToArr = mailTo?.split(",")
      } else {
        if (mailTo?.includes("&lt;") && mailTo?.includes("&gt;")) {
          // One email: "lamvt22" &lt;lamvt22@global.hanbiro.com&gt;
          emailTo = mailTo
          emailToFormat = mailTo?.replace(/&lt;/g, "<").replace(/&gt;/g, ">")
          emailToArr = mailTo.split(/"([^"]+)"/)
          if (emailToArr.length == 1) {
            // email: ABC BCA &lt;mailer-daemon@googlemail.com&gt;
            emailToArr = mailTo.split(/&lt;([^"]+)&gt;/)
          }
        } else {
          emailTo = mailTo
        }
      }
      return { emailRegex, emailTo, checkEmailTo, emailToArr, emailToFormat }
    }
  } else return { emailRegex, emailTo, checkEmailTo, emailToArr, emailToFormat }
}

export const finallyAddress = (emailRegex, emailArr) => {
  if (emailRegex) {
    return emailRegex?.replace("&lt;", "")?.replace("&gt;", "")?.trim()
  } else {
    const mailAddress =
      emailArr?.[0] !== ""
        ? emailArr?.[1] && !emailArr?.[2]
          ? emailArr?.[1]
          : emailArr?.[2]
        : emailArr?.[2]
        ? emailArr[2]
        : ""
    return mailAddress?.replace("&lt;", "")?.replace("&gt;", "")?.trim()
  }
}

export const extractEmailFromString = (str) => {
  // Regular expression pattern to match an email address
  const pattern = /[\w\.-]+@[\w\.-]+/

  // Find all matches of the pattern in the string
  const matches = str.match(pattern)

  // Return the first match (if any)
  if (matches && matches.length > 0) {
    return matches[0]
  } else {
    return null
  }
}

export const isVideoFile = (fileName) => {
  const fileExtension = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase()

  const videoExtensions = ["mp4", "webm", "ogg", "ogv", "m4v", "mov", "avi", "flv", "mkv"]

  return videoExtensions.includes(fileExtension)
}

export const utf8_encrypt = {
  _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
  _utf8_encode: function (string) {
    string = string.replace(/\r\n/g, "\n")
    let utftext = ""

    for (let n = 0; n < string.length; n++) {
      let c = string.charCodeAt(n)

      if (c < 128) {
        utftext += String.fromCharCode(c)
      } else if (c > 127 && c < 2048) {
        utftext += String.fromCharCode((c >> 6) | 192)
        utftext += String.fromCharCode((c & 63) | 128)
      } else {
        utftext += String.fromCharCode((c >> 12) | 224)
        utftext += String.fromCharCode(((c >> 6) & 63) | 128)
        utftext += String.fromCharCode((c & 63) | 128)
      }
    }

    return utftext
  },
  _utf8_decode: function (utftext) {
    let string = ""
    let i = 0
    let c = 0,
      c1 = 0,
      c2 = 0,
      c3 = 0

    while (i < utftext.length) {
      c = utftext.charCodeAt(i)

      if (c < 128) {
        string += String.fromCharCode(c)
        i++
      } else if (c > 191 && c < 224) {
        c2 = utftext.charCodeAt(i + 1)
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63))
        i += 2
      } else {
        c2 = utftext.charCodeAt(i + 1)
        c3 = utftext.charCodeAt(i + 2)
        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63))
        i += 3
      }
    }

    return string
  },
}

export const base64_encode = function (input) {
  if (!input) {
    input = ""
  }
  let output = ""
  let chr1, chr2, chr3, enc1, enc2, enc3, enc4
  let i = 0

  input = utf8_encrypt._utf8_encode(input)

  while (i < input.length) {
    chr1 = input.charCodeAt(i++)
    chr2 = input.charCodeAt(i++)
    chr3 = input.charCodeAt(i++)

    enc1 = chr1 >> 2
    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4)
    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6)
    enc4 = chr3 & 63

    if (isNaN(chr2)) {
      enc3 = enc4 = 64
    } else if (isNaN(chr3)) {
      enc4 = 64
    }

    output =
      output +
      utf8_encrypt._keyStr.charAt(enc1) +
      utf8_encrypt._keyStr.charAt(enc2) +
      utf8_encrypt._keyStr.charAt(enc3) +
      utf8_encrypt._keyStr.charAt(enc4)
  }

  return output
}

export const base64_decode = function (input) {
  let output = ""
  let chr1, chr2, chr3
  let enc1, enc2, enc3, enc4
  let i = 0

  input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "")

  while (i < input.length) {
    enc1 = utf8_encrypt._keyStr.indexOf(input.charAt(i++))
    enc2 = utf8_encrypt._keyStr.indexOf(input.charAt(i++))
    enc3 = utf8_encrypt._keyStr.indexOf(input.charAt(i++))
    enc4 = utf8_encrypt._keyStr.indexOf(input.charAt(i++))

    chr1 = (enc1 << 2) | (enc2 >> 4)
    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2)
    chr3 = ((enc3 & 3) << 6) | enc4

    output = output + String.fromCharCode(chr1)

    if (enc3 != 64) {
      output = output + String.fromCharCode(chr2)
    }
    if (enc4 != 64) {
      output = output + String.fromCharCode(chr3)
    }
  }

  output = utf8_encrypt._utf8_decode(output)

  return output
}

export const formatTimestampToDate = (timestamp, format = "MM/DD/YYYY") => {
  return moment.unix(timestamp).format(format)
}

export const vailForwardMail = (mails) => {
  /**
   * @author: H.Phuc <hoangphuc@hanbiro.vn> - @since: 2025-07-18
   * @ticket: GQ-320934
   * Check email regex same v2
   */
  const emailReg =
    /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))\.?@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
  const c = { status: true, mail: "" }
  if (mails.indexOf(",") < 0) {
    // if (!emailReg.test($.trim(mails)))
    if (!emailReg.test(mails.trim()))
      // return { status: false, mail: $.trim(mails) }
      return { status: false, mail: mails.trim(mails) }
  } else {
    const arr = mails.split(",")
    arr.forEach(function (entry) {
      // if (!emailReg.test($.trim(entry))) {
      if (!emailReg.test(entry.trim())) {
        c.status = false
        c.mail = entry
        return false
      }
    })
  }
  return c
}

export const handleCheckChangeArr = (oldArr = [], newArr = []) => {
  if (oldArr.length !== newArr.length) {
    return true
  } else {
    for (let i = 0; i < oldArr.length; i++) {
      if (oldArr[i] !== newArr[i]) {
        return true
      }
    }
  }
  return false
}

export const isObject = (obj) => {
  if (typeof obj === "object" && !Array.isArray(obj) && obj !== null) {
    return true
  }
  return false
}

export const onSharePermission = (isShare, shareInfo) => {
  const permissionStr = {
    r: t("mail.mail_read_mail"),
    w: t("mail.mail_shared_mail"),
    s: t("mail.mail_reply_forward"),
    rw: t("mail.mail_read_share"),
    rs: t("mail.mail_read_reply_forward"),
    ws: t("mail.mail_share_reply_forward"),
    rws: t("mail.mail_read_share_forward"),
    np: t("mail.mail_no_permission"),
  }

  if (isShare && shareInfo) {
    if (shareInfo?.sharepermission && typeof shareInfo?.sharepermission === "string") {
      return permissionStr[shareInfo.sharepermission]
    }
  }
  return t("mail.mail_no_permission")
}

export const isReadSharedMail = (shareInfo) => {
  if (isEmpty(shareInfo)) return true
  return shareInfo?.sharepermission.includes("r")
}

export const renderLanguage = (language_key, replaceData) => {
  const text = t(language_key) ?? ""
  Object.keys(replaceData).forEach(function (key) {
    text = text.replace(key, replaceData[key])
  })
  return text
}

export const isValidHostname = (hostname) => {
  const hostnameRegex = /^(?!:\/\/)([a-zA-Z0-9-_]{1,63}\.)+[a-zA-Z]{2,63}$/
  return hostnameRegex.test(hostname)
}

export const formatMailDateTime = (date, format) => {
  const currentData = moment()
  const newDateTime = moment(date, format)
  if (currentData.format("YYYY") === newDateTime.format("YYYY")) {
    if (
      currentData.format("MM") === newDateTime.format("MM") &&
      currentData.format("DD") === newDateTime.format("DD")
    ) {
      return newDateTime.format("HH:mm")
    } else {
      return newDateTime.format("MM/DD HH:mm")
    }
  }
  return newDateTime.format("YYYY/MM/DD HH:mm")
}

export const isBasicBox = (key) => {
  if (key == "Secure" && window.location.host == "tonymoly.com") return false
  const patt = "Maildir,Secure,Sent,Storage,External,Receive,Temp,Spam,Trash,Approval,Archives," // hide CSpam request Mr Jy Kim
  return patt.indexOf(key + ",") !== -1
}

export const validateStrictEmailFinal = (input) => {
  if (!input) return false
  const emailToCheck = input.trim()
  // 1. Extract email from angle brackets < > if present
  // Note: We capture the raw content inside the brackets without modification/sanitization.
  const match = input.match(/<([^>]+)>/)
  if (match) {
    emailToCheck = match[1]
  }
  // 2. STRICT REGEX PATTERN
  // Breakdown:
  // ^[a-zA-Z0-9._%+-]+@ : Local part (allows alphanumeric and specific special chars)
  // [a-zA-Z0-9]         : Domain MUST start with a letter or digit (No leading hyphens allowed)
  // (?:[a-zA-Z0-9-]*[a-zA-Z0-9])? : Middle part of domain can have hyphens, but must end with letter/digit
  // (?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)* : Handling subdomains (same logic as above)
  // \.[a-zA-Z]{2,}$     : Top-level domain (TLD) must be at least 2 letters and CANNOT end with a dot
  const strictRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/
  return strictRegex.test(emailToCheck)
}
