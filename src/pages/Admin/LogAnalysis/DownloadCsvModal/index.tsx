// @ts-nocheck
import { BaseButton, BaseModal } from "components/Common"
import { getWriteForm } from "components/Common/Form/WriteField/utils"
import { FormikProvider, useFormik } from "formik"
import React, { Suspense, useState } from "react"
import { useTranslation } from "react-i18next"
import writeConfig from "../config/DownloadCsvModal"
import * as keyNames from "../config/keyNames"
import WriteField from "components/Common/Form/WriteField"
import { useCustomToast } from "hooks/useCustomToast"
import { Row } from "reactstrap"

import * as Yup from "yup"
import { finalizeParams } from "./payload"
import { getDateFormat } from "utils/dateTimeFormat"
import { useSelector } from "react-redux"
import moment from "moment"

const emailPattern =
  /^([a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4})(\s*,\s*[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4})*$/

const DownloadCsvModal = (props) => {
  const { isOpen, onClose } = props
  const { errorToast, successToast } = useCustomToast()
  const { t } = useTranslation()

  const userGeneralConfigValue = useSelector((state) => state?.Config?.userConfig)
  const userDateFormat = getDateFormat(userGeneralConfigValue, "/", "MUI")
  const dateFormat = userDateFormat || "MM/DD/YYYY"

  const [isLoading, setIsLoading] = useState(false)

  const layoutFields = [
    keyNames.ADMIN_LOG_DOWNLOAD_CSV_START_DATE,
    keyNames.ADMIN_LOG_DOWNLOAD_CSV_END_DATE,
    keyNames.ADMIN_LOG_DOWNLOAD_CSV_FROM_ADDR,
    keyNames.ADMIN_LOG_DOWNLOAD_CSV_TO_ADDR,
    keyNames.ADMIN_LOG_DOWNLOAD_CSV_TYPE,
    keyNames.ADMIN_LOG_DOWNLOAD_CSV_RESULT,
  ]

  const { fields, defaultValues, getParams } = getWriteForm(layoutFields, writeConfig)

  const formik = useFormik({
    // enableReinitialize : use this flag when initial values needs to be changed
    enableReinitialize: true,
    initialValues: defaultValues,
    validateOnBlur: true,

    validationSchema: Yup.object({
      fromaddr: Yup.string()
        .trim()
        .matches(emailPattern, t("common.addrbook_email_format_error_msg")),
      toaddr: Yup.string()
        .trim()
        .matches(emailPattern, t("common.addrbook_email_format_error_msg")),
    }),
    onSubmit: (values) => {
      const parsedParams = {
        ...finalizeParams(getParams(values)),
        startdate: moment(values.startdate).format(dateFormat) + " 00:00:00",
        enddate: moment(values.enddate).format(dateFormat) + " 23:59:59",
      }
      const params = new URLSearchParams(parsedParams)
      const url = process.env.NODE_ENV !== 'development' 
      ? [
        window.location.protocol + "//" + window.location.hostname,
        "email/log2/downlogtocsv",
      ].join("/")
      : [
        window.location.protocol + "//" + 'global3.hanbiro.com',
        "email/log2/downlogtocsv",
      ].join("/")
      window.open(url + "?" + params.toString(), "_blank")

      onClose?.()
    },
  })

  const { errors, handleSubmit } = formik

  const renderHeader = () => t("mail.mail_download_csv")

  const renderBody = () => {
    return (
      <FormikProvider value={formik}>
        <Suspense fallback={<></>}>
          <form onSubmit={handleSubmit}>
            <span className="mb-1 han-h4 han-text-secondary han-fw-medium">
              {t("mail.mail_log_search_date")}
            </span>
            <Row className="gy-2">
              {fields.map((_field) => {
                if (
                  _field.keyName === keyNames.ADMIN_LOG_DOWNLOAD_CSV_FROM_ADDR ||
                  _field.keyName === keyNames.ADMIN_LOG_DOWNLOAD_CSV_TO_ADDR
                ) {
                  return (
                    <>
                      <WriteField
                        key={_field.keyName}
                        item={_field}
                        errors={errors}
                        keyName={_field.keyName}
                        isHorizontal={false}
                      />
                      <span className="han-text-secondary">
                        {t("mail.mail_multiple_entries_can_be_entered_with_commas")}
                      </span>
                    </>
                  )
                } else {
                  return (
                    <WriteField
                      key={_field.keyName}
                      item={_field}
                      errors={errors}
                      keyName={_field.keyName}
                      isHorizontal={false}
                    />
                  )
                }
              })}
            </Row>
          </form>
        </Suspense>
      </FormikProvider>
    )
  }

  const renderFooter = () => (
    <div className="w-100 d-flex justify-content-center">
      <div className="d-flex gap-2">
        <BaseButton disabled={isLoading} color="grey" className={"btn-action"} onClick={onClose}>
          {t("common.common_cancel")}
        </BaseButton>
        <BaseButton
          disabled={isLoading}
          loading={isLoading}
          type="submit"
          color="primary"
          className={""}
          onClick={handleSubmit}
        >
          {t("common.approval_main_download")}
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
      modalClass="download-csv-modal"
    />
  )
}

export default DownloadCsvModal
