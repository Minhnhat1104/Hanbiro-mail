// @ts-nocheck
import { Headers, emailGet, emailPost } from "helpers/email_api_helper"

const URL_TRANSLATOR_GET_LIST = "ngw/translator/get_list"
const URL_TRANSLATOR_SAVE = "ngw/translator/save"

export const useTranslatorAPI = () => {
  const getLanguageList = async (params) => {
    return emailGet(URL_TRANSLATOR_GET_LIST, params, Headers)
  }

  const translatorSave = async (params) => {
    return emailPost(URL_TRANSLATOR_SAVE, params, Headers)
  }

  return { getLanguageList, translatorSave }
}
