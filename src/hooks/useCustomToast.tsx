// @ts-nocheck
import {
  DEVELOP_EMAIL_MESSAGE,
  ERROR_EMAIL_MESSAGE,
  SUCCESS_EMAIL_MESSAGE,
} from "constants/setting"
import { useTranslation } from "react-i18next"
import { toast } from "react-toastify"

export const useCustomToast = () => {
  const { t } = useTranslation()

  const toastOptions = {
    hideProgressBar: true,
    autoClose: 2000,
  }

  const successToast = (message = SUCCESS_EMAIL_MESSAGE, appearance = "success") => {
    toast.success(<span dangerouslySetInnerHTML={{ __html: t(message) }}></span>, toastOptions)
  }

  const errorToast = (message = ERROR_EMAIL_MESSAGE, appearance = "error") => {
    toast.error(<span dangerouslySetInnerHTML={{ __html: t(message) }}></span>, toastOptions)
  }

  const devToast = (message = DEVELOP_EMAIL_MESSAGE, appearance = "info") => {
    toast.info(message, toastOptions)
  }

  return { successToast, errorToast, devToast }
}
