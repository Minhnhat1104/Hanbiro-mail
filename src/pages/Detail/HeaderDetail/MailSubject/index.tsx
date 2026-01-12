// @ts-nocheck
// React
import { useContext, useState } from "react"

// Third-party
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"

// Project
import BaseButtonTooltip from "components/Common/BaseButtonTooltip"
import { MailContext } from "pages/Detail"
import { DetailNewWindowContext } from "pages/Detail/DetailForNewWindow"
import { onSharePermission } from "utils"
import { BaseIcon } from "components/Common"
import useDevice from "hooks/useDevice"
import CountryFlag from "pages/Detail/MailInfo/Left/CountryFlag"

const MailSubject = (props) => {
  const { important, handleMarkAsImportant, isSplitMode, isNewWindow } = props
  const { menu, mid, mail } = useContext(isNewWindow ? DetailNewWindowContext : MailContext)
  const { t } = useTranslation()

  const { isTablet, isMobile } = useDevice()

  const userData = useSelector((state) => state.Config?.userConfig?.user_data)

  const [showCountry, setShowCountry] = useState(false)

  return (
    <div
      className={`d-flex ${isMobile && "gap-2"} ${
        isTablet ? "flex-nowrap" : "flex-wrap"
      } justify-content-between ${isSplitMode ? "w-100" : ""} 
      ${isSplitMode && mail?.isshare ? "flex-column align-items-start" : "align-items-center"} ${
        isMobile ? "mb-2" : ""
      }`}
    >
      <div className={`d-flex align-items-center gap-2 `}>
        {mail?.sendlater?.issendlater && <BaseIcon className="mdi mdi-clock color-pink" />}
        <h2
          className={`han-h2 han-text-primary m-0 ${
            isSplitMode && mail?.isshare ? "order-1 mb-3" : ""
          }`}
          style={{ ...(isTablet && { lineHeight: " 30px" }) }}
          dangerouslySetInnerHTML={{ __html: mail?.subject || t("mail.mail_summary_msg") }}
        />
      </div>
      <div
        className={`d-flex gap-1 align-items-center ${
          isSplitMode && mail?.isshare ? "order-0" : ""
        }`}
      >
        {isSplitMode && mail?.isshare && (
          <>
            <span title="Sharer">{userData.title || userData.id}</span> |{" "}
            <span>
              {t("mail.mail_permission_to")}{" "}
              <b>{onSharePermission(mail?.isshare, mail?.shareinfo)}</b>
            </span>
          </>
        )}
        {/* Important */}
        {!isMobile ? (
          <>
            {important?.value ? (
              <BaseButtonTooltip
                id="star"
                placement={isSplitMode ? "left" : "top"}
                title={t("mail.mail_select_checkbox_important")}
                icon="mdi mdi-star"
                className="px-2 border-0 bg-transparent font-size-18 text-warning"
                iconClassName="me-0"
                onClick={() =>
                  handleMarkAsImportant && handleMarkAsImportant(false, mail?.acl, mid)
                }
              />
            ) : (
              <BaseButtonTooltip
                id="star"
                placement={isSplitMode ? "left" : "top"}
                title={t("mail.mail_select_checkbox_important")}
                icon="mdi mdi-star-outline"
                className="px-2 border-0 bg-transparent font-size-18 text-muted"
                iconClassName="me-0"
                onClick={() => handleMarkAsImportant && handleMarkAsImportant(true, mail?.acl, mid)}
              />
            )}
          </>
        ) : (
          <CountryFlag showCountry={showCountry} toggle={() => setShowCountry(!showCountry)} />
        )}
      </div>
    </div>
  )
}

export default MailSubject
