// @ts-nocheck
import React, { Suspense, useEffect, useState } from "react"
import BaseModal from "../../BaseModal"
import { useTranslation } from "react-i18next"
import { FormikProvider, useFormik } from "formik"
import * as Yup from "yup"
import BaseButton from "../../BaseButton"
import CustomInput from "./CustomInput"
import { getWriteForm } from "components/Common/Form/WriteField/utils"
import writeConfig from "../config/WriteFields"
import * as keyNames from "../config/keyNames"
import WriteField from "components/Common/Form/WriteField"
import finalizeParams from "../payload"
import { useTranslatorAPI } from "../hooks/useTranslatorAPI"
import { useCustomToast } from "hooks/useCustomToast"

const initFormData = {
  system: "client",
  id: "",
  menu: { menu: "none", key: "" },
  key_lang: "",
  description: "",
  en: "",
  vi: "",
  ko: "",
  jp: "",
  ch: "",
  zh: "",
  de: "",
  es: "",
  id_code: "",
  pt: "",
  th: "",
  ph: "",
  ru: "",
}

const modifyEditValue = (values = initFormData, mode) => {
  return {
    system: values?.system,
    id: mode === "copy" ? "0" : (values?.id || ""),
    menu: {
      menu: values?.menu || "none",
      key: values?.key_lang || "",
    },
    description: values?.description,
    en: values?.["en_code"],
    vi: values?.["vi_code"],
    ko: values?.["ko_code"],
    jp: values?.["jp_code"],
    ch: values?.["ch_code"],
    zh: values?.["zh_code"],
    de: values?.["de_code"],
    es: values?.["es_code"],
    id_code: values?.["id_code"],
    pt: values?.["pt_code"],
    th: values?.["th_code"],
    ph: values?.["ph_code"],
    ru: values?.["ru_code"],
  }
}

const AddLangModal = (props) => {
  const { isOpen = false, onClose, editData, mode, onRefetch } = props
  const { errorToast, successToast } = useCustomToast()

  const { t } = useTranslation()

  const [isLoading, setIsLoading] = useState(false)
  const [langData, setLangData] = useState(editData || null)

  useEffect(() => {
    if (editData) {
      setLangData(modifyEditValue(editData, mode))
    }
  }, [editData])

  const layoutFields = [
    keyNames.KEY_NAME_LANGUAGE_MENU,
    keyNames.KEY_NAME_LANGUAGE_ENGLISH,
    keyNames.KEY_NAME_LANGUAGE_KOREAN,
    keyNames.KEY_NAME_LANGUAGE_JAPAN,
    keyNames.KEY_NAME_LANGUAGE_CHINA_CH,
    keyNames.KEY_NAME_LANGUAGE_CHINA_ZH,
    keyNames.KEY_NAME_LANGUAGE_VIETNAMESE,
    keyNames.KEY_NAME_LANGUAGE_DEUTSCH,
    keyNames.KEY_NAME_LANGUAGE_ESPANOL,
    keyNames.KEY_NAME_LANGUAGE_INDONESIA,
    keyNames.KEY_NAME_LANGUAGE_PORTUGUESE,
    keyNames.KEY_NAME_LANGUAGE_THAI,
    keyNames.KEY_NAME_LANGUAGE_RUSSIAN,
    keyNames.KEY_NAME_LANGUAGE_DESCRIPTION,
  ]

  const { fields, defaultValues, getParams } = getWriteForm(layoutFields, writeConfig)

  const { translatorSave } = useTranslatorAPI()

  const formik = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,
    initialValues: langData ? langData : defaultValues,
    onSubmit: (values) => {
      const parsedParams = finalizeParams(getParams(values))
      // console.log("parsedParams:", parsedParams)
      setIsLoading(true)
      translatorSave(parsedParams).then(res => {
        if (res?.success) {
          successToast()
          onClose()
          mode !== "add" && onRefetch()
        } else {
          errorToast(res?.msg?.menu)
        }
      }).catch(err => {
        errorToast()
      }).finally(() => {
        setIsLoading(false)
      })
    },
  })

  const { errors, setErrors, values, handleReset, setFieldValue, handleSubmit } = formik

  const renderHeader = () => t("common.translator_box")

  const renderBody = () => {
    return (
      <FormikProvider value={formik}>
        <Suspense fallback={<></>}>
          <form onSubmit={handleSubmit}>
            <div className="d-flex flex-column gap-2">
              {fields.map((_field) => (
                <WriteField
                  key={_field.keyName}
                  item={_field}
                  errors={errors}
                  keyName={_field.keyName}
                  disabled={_field.keyName === keyNames.KEY_NAME_LANGUAGE_MENU && mode === "edit"}
                />
              ))}
            </div>
          </form>
        </Suspense>
      </FormikProvider>
    )
  }

  const renderFooter = () => (
    <div className="w-100 d-flex justify-content-between">
      <BaseButton disabled={isLoading} color="grey" className={"btn-action"} onClick={handleReset}>
        {t("common.common_reset")}
      </BaseButton>
      <div className="d-flex gap-2">
        <BaseButton disabled={isLoading} color="grey" className={"btn-action"} onClick={onClose}>
          {t("common.common_cancel")}
        </BaseButton>
        <BaseButton disabled={isLoading} loading={isLoading} type="submit" color="primary" className={""} onClick={handleSubmit}>
          {t("common.board_save")}
        </BaseButton>
      </div>
    </div>
  )

  return (
    <BaseModal
      open={isOpen}
      toggle={onClose}
      renderHeader={renderHeader}
      renderBody={renderBody}
      renderFooter={renderFooter}
      modalClass="add-lang-modal"
    />
  )
}

export default AddLangModal
