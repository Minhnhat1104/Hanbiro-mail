// @ts-nocheck
import { useTranslation } from "react-i18next"
const DivError = ({ data }) => {
  const { t } = useTranslation()
  return (
    <div className="w-100 d-flex text-danger han-fw-semibold  mb-1">
      {t("common.addrbook_email_format_error_msg")} [{data.join(",")}]
    </div>
  )
}
export default DivError
