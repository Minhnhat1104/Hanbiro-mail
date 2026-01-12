// @ts-nocheck
import { Input } from "reactstrap"
import * as components from "../components"
import * as keyNames from "../keyNames"
import { t } from "i18next"
import moment from "moment"
import { downloadStatus, downloadType } from "./constants"

const writeConfig = {
  [keyNames.ADMIN_LOG_DOWNLOAD_CSV_START_DATE]: {
    hideTitle: true,
    columns: 2,
    Component: components.MuiDattePicker,
    componentProps: { isCustomComponent: true },
    defaultValue: moment(new Date()).add(-7, "day").toDate(),
  },
  [keyNames.ADMIN_LOG_DOWNLOAD_CSV_END_DATE]: {
    hideTitle: true,
    columns: 2,
    Component: components.MuiDattePicker,
    componentProps: { isCustomComponent: true },
    defaultValue: moment(new Date()).toDate(),
  },
  [keyNames.ADMIN_LOG_DOWNLOAD_CSV_FROM_ADDR]: {
    languageKey: "mail.mail_enter_sending_address",
    Component: Input,
    componentProps: {
      placeholder: t("mail.mail_email"),
    },
    defaultValue: "",
    parseParam: (data) => {
      if(!data) return []
      return data?.split(",")?.map(item => item?.trim())
    }
  },
  [keyNames.ADMIN_LOG_DOWNLOAD_CSV_TO_ADDR]: {
    languageKey: "mail.mail_enter_recipient_address",
    Component: Input,
    componentProps: {
      placeholder: t("mail.mail_email"),
    },
    defaultValue: "",
    parseParam: (data) => {
      if(!data) return []
      return data?.split(",")?.map(item => item?.trim())
    }
  },
  [keyNames.ADMIN_LOG_DOWNLOAD_CSV_TYPE]: {
    languageKey: "mail.mail_type",
    Component: components.CheckboxGroup,
    componentProps: {
      options: downloadType,
      isCustomComponent: true,
    },
    defaultValue: downloadType,
    parseParam: (data) => {
      if(!data) return []
      return data?.map(item => item?.value)
    }
  },
  [keyNames.ADMIN_LOG_DOWNLOAD_CSV_RESULT]: {
    languageKey: "mail.mail_incoming_outgoing_results",
    Component: components.CheckboxGroup,
    componentProps: {
      options: downloadStatus,
      isCustomComponent: true,
    },
    defaultValue: downloadStatus,
    parseParam: (data) => {
      if(!data) return []
      return data?.map(item => item?.value)
    }
  },
}
export default writeConfig
