// @ts-nocheck
import { MailContext } from "pages/Detail"
import React, { useContext } from "react"
import { useTranslation } from "react-i18next"
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap"

const CountryFlag = ({ showCountry, toggle }) => {
  const { t } = useTranslation()
  const { mail } = useContext(MailContext)

  return (
    <Dropdown className="country-flag" isOpen={showCountry} toggle={toggle}>
      <DropdownToggle className="p-0 border-0 bg-transparent font-size-17">
        {mail?.geoip?.country_code ? (
          <div className={`flag-icon flag-icon-${mail?.geoip?.country_code} rounded-circle`} />
        ) : mail?.geoip?.isprivate ? (
          <span
            size="small"
            className="btn btn-outline-primary py-0 rounded-pill d-flex gap-2"
            tag="div"
          >
            {t("mail.mail_view_private_msg")}
          </span>
        ) : (
          <span size="small" className="btn btn-outline-primary py-0 rounded-pill d-flex gap-2">
            {t("mail.mail_view_public_msg")}
          </span>
        )}
      </DropdownToggle>
      <DropdownMenu>
        <DropdownItem>
          <span className="text-muted">{t("common.org_pri_contry_type")}: </span>
          {/* <span className="text-dark">
                {mail?.geoip?.country_name ? mail?.geoip?.country_name : "-"}
              </span> */}
          <span className="text-dark">
            {mail?.geoip?.country_code ? mail?.geoip?.country_code : "-"}
          </span>
        </DropdownItem>
        <DropdownItem>
          <span className="text-muted">{t("common.profile_login_history_ip")}: </span>
          <span className="text-dark">
            {mail?.remoteip ? mail?.remoteip : "-"} (
            {mail?.geoip?.isprivate
              ? t("mail.mail_view_private_msg")
              : t("mail.mail_view_public_msg")}
            )
          </span>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}

export default CountryFlag
