// @ts-nocheck
import io from "socket.io-client"
import moment from "moment"

export const getIconForTab = (id = "") => {
  switch (id) {
    case "my":
      return "User"
    case "sync":
      return "UploadCloud"
    case "org":
      return "Users"
    case "share":
      return "Share2"
    default:
      return "Cloud"
  }
}

export const optimizeTabData = (tabs = []) => {
  if (!tabs || tabs.length == 0) {
    return []
  }
  return tabs.map(tab => ({
    ...tab,
    icon: getIconForTab(tab.id),
    text:
      tab.text === "My"
        ? "My Folder"
        : tab.text === "CloudFolder"
        ? "Cloud Folder"
        : tab.text,
  }))
}

export const getDescriptionFolder = (item = {}) => {
  const totalFolder = item?.count?.folder ?? 0
  const totalFile = item?.count?.file ?? 0
  let description = []
  // if (totalFolder != 0) {
  //   description.push(`${totalFolder} folders`);
  // }
  if (totalFile != 0) {
    if (totalFile == 1) {
      description.push(`${totalFile} file`)
    } else {
      description.push(`${totalFile} files`)
    }
  } else {
    description.push(`${totalFile} files`)
  }
  if (item.size != 0) {
    description.push(humanFileSize(item.size))
  }

  return description.join(", ")
}

/**
 * Format field with phone number
 * @param {*} field
 */
export const formatPhoneNumber = field => {
  if (!field) return field

  let numbers = field.replace(/\D/g, ""),
    char = { 0: "(+", 2: ") ", 6: " - " }
  field = ""
  for (let i = 0; i < numbers.length; i++) {
    field += (char[i] || "") + numbers[i]
  }

  return field
}

/**
 *
 * @param id
 * @param cb
 * @returns {Function}
 */
export const clickOutSide = (id, cb) => {
  let event = `click.${id}`,
    $id = `#${id}`,
    $document = $(document.iframe)
  setTimeout(() => {
    $document.off(event).on(event, e => {
      let $target = $(e.target)
      if (window.outerWidth <= 560) {
        $document.off(event)
      } else if (
        !$target.is($id) &&
        !$target.parents($id).length &&
        $.contains(document.iframe, e.target)
      ) {
        cb()
        $document.off(event)
      }
    })
  }, 200)

  return () => {
    $document.off(event)
  }
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
  var i = Math.floor(Math.log(size) / Math.log(1024))
  return (
    (size / Math.pow(1024, i)).toFixed(2) * 1 +
    " " +
    ["B", "KB", "MB", "GB", "TB"][i]
  )
}

/**
 * Format number width commas
 * @param {*} num
 */
export const numberWithCommas = num => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

/**
 * Check if app is run in an iframe
 */
export const isInIframe = () => {
  try {
    return window.self !== window.top
  } catch (e) {
    return true
  }
}

/**
 * Convert timestap to date
 * @param {*} timestamp
 * @param {*} format
 */
export const formatTimestampToDate = (timestamp, format = "MM/DD/YYYY") => {
  return moment.unix(timestamp).format(format)
}

/**
 * Remove path of base url (aaa/bbb/api/).
 * Because requests of bulk mail are absolute, from root level;
 */
// export function getBaseUrl() {
//   // develop environment.
//   if (
//     window.location.host === "192.168.10.10" ||
//     window.location.host === "127.0.0.1:8000"
//   ) {
//     return axios.defaults.baseURL.replace(
//       /\.[a-zA-Z]+\/([\w\/]*api\/)/,
//       function($0, $1) {
//         return $0.replace($1, "");
//       }
//     );
//   } else {
//     return window.location.protocol + "//" + window.location.host + "/";
//   }
// }

/**
 * Check is class component
 * @param {*} component
 */
export const isClassComponent = component => {
  return (
    typeof component === "function" && !!component.prototype.isReactComponent
  )
}

/**
 * Check function component in Reactjs
 * @param {*} component
 */
export const isFunctionComponent = component => {
  return (
    typeof component === "function" &&
    String(component).includes("return React.createElement")
  )
}

/**
 * Check component Reactjs
 * @param {*} component
 */
export const isReactComponent = component => {
  return isClassComponent(component) || isFunctionComponent(component)
}

/**
 * Get base url for service
 */
export const getBaseUrl = () => {
  let locationInfo = window.location
  const { hostname } = locationInfo
  if (hostname == "localhost" || hostname == "127.0.0.1") {
    return "https://global3.hanbiro.com/viet/comanage"
  } else {
    if (window.location != window.parent.location) {
      locationInfo = window.parent.location
    }
    const { hostname, protocol, pathname } = locationInfo
    let apiUrl = [protocol, "//", hostname].join("")

    return apiUrl
  }
}

/**
 * Get base url for service with 'ngw'
 */
export const getBaseUrlCommon = () => {
  let locationInfo = window.location
  const { hostname } = locationInfo
  if (hostname == "localhost" || hostname == "127.0.0.1") {
    return "https://global3.hanbiro.com/viet/comanage"
  } else {
    if (window.location != window.parent.location) {
      locationInfo = window.parent.location
    }
    const { hostname, protocol, pathname } = locationInfo
    let index = pathname.indexOf("/ngw/")
    let apiAbsUrl = "/ngw"
    if (index >= 0) {
      apiAbsUrl = pathname.substring(0, index + 4)
    }
    let apiUrl = [protocol, "//", hostname, apiAbsUrl].join("")

    return apiUrl
  }
}

export const getDomain = () => {
  let locationInfo = window.location
  const { hostname } = locationInfo
  if (hostname == "localhost" || hostname == "127.0.0.1") {
    return "https://global3.hanbiro.com"
  } else {
    if (window.location != window.parent.location) {
      locationInfo = window.parent.location
    }
    const { hostname, protocol, pathname } = locationInfo
    let apiUrl = [protocol, "//", hostname].join("")

    return apiUrl
  }
}

/**
 * Check mode development
 */
export const isDevelopment = process.env.NODE_ENV == "development"

/**
 * Get extension of file
 * @param {*} fileName
 */
export const getExtensionFile = (fileName = "") => {
  return fileName.split(".").pop().toLowerCase()
}

/**
 * Convert hex color to RGB color
 * @param {*} hex
 * @param {*} opacity
 */
export const hexToRgb = (hex, opacity = 1) => {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (result) {
    let RGBAObj = {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    }

    return `rgba( ${RGBAObj.r}, ${RGBAObj.g}, ${RGBAObj.b}, ${opacity})`
  }
}

/**
 * Create a UUID for upload file
 */
export const generateUUID = function () {
  var d = new Date().getTime()
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      var r = (d + Math.random() * 16) % 16 | 0
      d = Math.floor(d / 16)
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16)
    }
  )
  return uuid
}

/**
 * Service socket for groupware new
 * @param {*} param0
 */
export const ServiceSocket = ({ userData = {} }) => {
  let locationInfo = window.location
  const { hostname } = locationInfo
  let domainUser = hostname

  // Check mode development
  if (hostname == "localhost" || hostname == "127.0.0.1") {
    domainUser = "global3.hanbiro.com"
  }

  let wsUrl = ""
  if (document.location.protocol == "https:") {
    wsUrl = "https://" + domainUser + ":" + 8082
  } else {
    wsUrl = "http://" + domainUser + ":" + 8081
  }

  const session = {}
  var socket = io.connect(wsUrl, {
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
  // Socket for counter
  socket.on("disconnect", function () {})
  return socket
}

/**
 * Convert array to object
 * @param {*} data array data
 * @param {*} key string | array
 */
export const convertToObject = (data = [], key = "") => {
  let objectData = {}
  if (!data || data.length == 0 || !Array.isArray(data)) {
    return objectData
  }

  data.forEach(item => {
    let objectKey = ""
    if (Array.isArray(key)) {
      let arrayKey = []
      key.forEach(element => {
        arrayKey.push(item[element])
      })
      objectKey = arrayKey.join(":")
    } else {
      objectKey = item[key]
    }
    objectData[objectKey] = item
  })
  return objectData
}

export const validMail = mails => {
  var emailReg =
    /^[a-z0-9.!\#$%&\'*+-\/=?^_`{|}~]+@([0-9.]+|([^\s\'"<>@,;]+\.+[a-z]{2,6}))$/i
  var c = { status: true, mail: "" }
  if (mails.indexOf(",") < 0) {
    if (!emailReg.test($.trim(mails)))
      return { status: false, mail: $.trim(mails) }
  } else {
    var arr = mails.split(",")
    arr.forEach(function (entry) {
      if (!emailReg.test($.trim(entry))) {
        c.status = false
        c.mail = entry
        return false
      }
    })
  }
  return c
}

export const getPercentage = (total, number) => {
  if (total > 0) {
    return Math.round(number / (total / 100), 2)
  } else {
    return 0
  }
}

export const utf8_encrypt = {
  _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
  _utf8_encode: function (string) {
    string = string.replace(/\r\n/g, "\n")
    var utftext = ""

    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n)

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
    var string = ""
    var i = 0
    var c = 0,
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
        string += String.fromCharCode(
          ((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63)
        )
        i += 3
      }
    }

    return string
  },
}

export const base64_decode = function (input) {
  var output = ""
  var chr1, chr2, chr3
  var enc1, enc2, enc3, enc4
  var i = 0

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

export const isIE = () => {
  var ua = window.navigator.userAgent

  var old_ie = ua.indexOf("MSIE ")
  var new_ie = ua.indexOf("Trident/")

  if (old_ie > -1 || new_ie > -1) {
    return true
  }

  return false
}

export const makeid = () => {
  var text = ""
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

  for (var i = 0; i < 32; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length))

  return text
}

export const getCookie = cname => {
  var name = cname + "="
  var decodedCookie = decodeURIComponent(document.cookie)
  var ca = decodedCookie.split(";")
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i]
    while (c.charAt(0) == " ") {
      c = c.substring(1)
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length)
    }
  }
  return ""
}
