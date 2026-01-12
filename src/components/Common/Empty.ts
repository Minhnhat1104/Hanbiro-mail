// @ts-nocheck
import React from "react"
import { useTranslation } from "react-i18next"
const Empty = () => {
  const { t } = useTranslation()
  return (
    <div>
      <i className="mdi mdi-email-outline display-5"></i>
      <h4> {t("common.nodata_msg")} </h4>
    </div>
  )
}
export default Empty
