// @ts-nocheck
import i18n from "i18next"
import detector from "i18next-browser-languagedetector"
import { initReactI18next } from "react-i18next"

import translationENG from "./constants/locales/en.json"
import translationKO from "./constants/locales/ko.json"
import translationVI from "./constants/locales/vi.json"

const HANBIRO_LANG = "hanbiro-lang"

// the translations
const resources = {
  en: {
    translation: translationENG,
  },
  ko: {
    translation: translationKO,
  },
  vi: {
    translation: translationVI,
  },
}

const language = localStorage.getItem(HANBIRO_LANG)
if (!language) {
  localStorage.setItem(HANBIRO_LANG, "en")
}

i18n
  .use(detector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: localStorage.getItem(HANBIRO_LANG) || "en",
    fallbackLng: "en", // use en if detected lng is not available

    // keySeparator: false, // we do not use keys in form messages.welcome

    // interpolation: {
    //   escapeValue: false, // react already safes from xss
    // },
  })

export default i18n
