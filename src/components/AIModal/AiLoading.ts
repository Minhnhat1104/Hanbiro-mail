// @ts-nocheck
import React from "react"
import { useTranslation } from "react-i18next"

const AiLoading = () => {
  const { t } = useTranslation()
  return <div className="blink">{t("common.common_ai_in_progress")}</div>
}

export default AiLoading
