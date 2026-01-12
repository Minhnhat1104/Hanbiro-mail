// @ts-nocheck
import * as keyNames from "./config/keyNames"

const finalizeParams = (params) => {
  let newParams = {
    system: "client",
    id: params?.id || "",
    menu: params?.menu?.menu,
    key_lang: params?.menu?.key,
    description: params?.description || "",
    "languages[en]": params?.[keyNames.KEY_NAME_LANGUAGE_ENGLISH] || "",
    "languages[vi]": params?.[keyNames.KEY_NAME_LANGUAGE_VIETNAMESE] || "",
    "languages[ko]": params?.[keyNames.KEY_NAME_LANGUAGE_KOREAN] || "",
    "languages[jp]": params?.[keyNames.KEY_NAME_LANGUAGE_JAPAN] || "",
    "languages[ch]": params?.[keyNames.KEY_NAME_LANGUAGE_CHINA_CH] || "",
    "languages[zh]": params?.[keyNames.KEY_NAME_LANGUAGE_CHINA_ZH] || "",
    "languages[de]": params?.[keyNames.KEY_NAME_LANGUAGE_DEUTSCH] || "",
    "languages[es]": params?.[keyNames.KEY_NAME_LANGUAGE_ESPANOL] || "",
    "languages[id]": params?.[keyNames.KEY_NAME_LANGUAGE_INDONESIA] || "",
    "languages[pt]": params?.[keyNames.KEY_NAME_LANGUAGE_PORTUGUESE] || "",
    "languages[th]": params?.[keyNames.KEY_NAME_LANGUAGE_THAI] || "",
    "languages[ru]": params?.[keyNames.KEY_NAME_LANGUAGE_RUSSIAN] || "",
  }

  return newParams
}

export default finalizeParams
