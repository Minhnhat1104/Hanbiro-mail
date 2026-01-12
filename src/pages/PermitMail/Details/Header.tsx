// @ts-nocheck
import BaseButtonTooltip from "components/Common/BaseButtonTooltip"
import { useTranslation } from "react-i18next"

const Header = ({ mail, important, handleMarkAsImportant }) => {
  const { t } = useTranslation()
  return (
    <div className="d-flex align-items-center mb-2 me-1">
      <h2 className="han-h2 han-text-primary m-0">{mail?.subject ?? ""}</h2>
      <div className="d-flex gap-1 align-items-center">
        {/* Important */}
        {important.important ? (
          <BaseButtonTooltip
            id="star"
            title={t("mail.mail_select_checkbox_important")}
            icon="mdi mdi-star"
            className="px-2 py-1 border-0 bg-transparent font-size-18 text-warning"
            iconClassName="me-0"
            onClick={() => handleMarkAsImportant(false)}
          />
        ) : (
          <BaseButtonTooltip
            id="star"
            title={t("mail.mail_select_checkbox_important")}
            icon="mdi mdi-star-outline"
            className="px-2 py-1 border-0 bg-transparent font-size-18 text-muted"
            iconClassName="me-0"
            onClick={() => handleMarkAsImportant(true)}
          />
        )}
      </div>
    </div>
  )
}

export default Header