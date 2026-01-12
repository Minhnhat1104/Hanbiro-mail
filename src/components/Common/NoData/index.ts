// @ts-nocheck
import React from "react"
import { useTranslation } from "react-i18next"

const NoData = props => {
  const { t } = useTranslation()
  return (
    <div className="align-items-center text-center p-4">
      <i className="mdi mdi-email-outline me-2 display-5"></i>
      <h4>{t("common.resource_nodata")}</h4>
    </div>
  )
}

export default NoData
