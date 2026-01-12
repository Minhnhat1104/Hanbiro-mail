// @ts-nocheck
import { Input } from "reactstrap"
import * as components from "../components"
import * as keyNames from "../keyNames"

const writeConfig = {
  [keyNames.KEY_NAME_LANGUAGE_MENU]: {
    languageKey: "common.translator_key",
    Component: components.AddSelectLangKey,
    defaultValue: { menu: "none", key: "" },
    componentProps: {
      isCustomComponent: true,
    },
  },
  [keyNames.KEY_NAME_LANGUAGE_ENGLISH]: {
    languageKey: "English",
    Component: components.CustomInput,
    defaultValue: "",
    componentProps: {
      icon: "flag-icon flag-icon-us",
    },
  },
  [keyNames.KEY_NAME_LANGUAGE_VIETNAMESE]: {
    languageKey: "Vietnam",
    Component: components.CustomInput,
    defaultValue: "",
    componentProps: {
      icon: "flag-icon flag-icon-vn",
    },
  },
  [keyNames.KEY_NAME_LANGUAGE_KOREAN]: {
    languageKey: "Korean",
    Component: components.CustomInput,
    defaultValue: "",
    componentProps: {
      icon: "flag-icon flag-icon-kr",
    },
  },
  [keyNames.KEY_NAME_LANGUAGE_JAPAN]: {
    languageKey: "Japan",
    Component: components.CustomInput,
    defaultValue: "",
    componentProps: {
      icon: "flag-icon flag-icon-jp",
    },
  },
  [keyNames.KEY_NAME_LANGUAGE_CHINA_CH]: {
    languageKey: "China(ch)",
    Component: components.CustomInput,
    defaultValue: "",
    componentProps: {
      icon: "flag-icon flag-icon-cn",
    },
  },
  [keyNames.KEY_NAME_LANGUAGE_CHINA_ZH]: {
    languageKey: "China(zh)",
    Component: components.CustomInput,
    defaultValue: "",
    componentProps: {
      icon: "flag-icon flag-icon-cn",
    },
  },
  [keyNames.KEY_NAME_LANGUAGE_DEUTSCH]: {
    languageKey: "Deutsch",
    Component: components.CustomInput,
    defaultValue: "",
    componentProps: {
      icon: "flag-icon flag-icon-de",
    },
  },
  [keyNames.KEY_NAME_LANGUAGE_ESPANOL]: {
    languageKey: "Español",
    Component: components.CustomInput,
    defaultValue: "",
    componentProps: {
      icon: "flag-icon flag-icon-es",
    },
  },
  [keyNames.KEY_NAME_LANGUAGE_INDONESIA]: {
    languageKey: "Bahasa Indonesia",
    Component: components.CustomInput,
    defaultValue: "",
    componentProps: {
      icon: "flag-icon flag-icon-id",
    },
  },
  [keyNames.KEY_NAME_LANGUAGE_PORTUGUESE]: {
    languageKey: "Portuguese",
    Component: components.CustomInput,
    defaultValue: "",
    componentProps: {
      icon: "flag-icon flag-icon-pt",
    },
  },
  [keyNames.KEY_NAME_LANGUAGE_THAI]: {
    languageKey: "Thai",
    Component: components.CustomInput,
    defaultValue: "",
    componentProps: {
      icon: "flag-icon flag-icon-th",
    },
  },
  [keyNames.KEY_NAME_LANGUAGE_RUSSIAN]: {
    languageKey: "Russian",
    Component: components.CustomInput,
    defaultValue: "",
    componentProps: {
      icon: "flag-icon flag-icon-ru",
    },
  },
  [keyNames.KEY_NAME_LANGUAGE_DESCRIPTION]: {
    languageKey: "common.common_description",
    Component: Input,
    defaultValue: "",
    componentProps: {
      type: "textarea",
      rows: 4,
    },
  },
}

export default writeConfig
