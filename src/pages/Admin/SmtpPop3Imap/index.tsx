// @ts-nocheck
import { useEffect, useState } from "react"

import { useTranslation } from "react-i18next"
import { Nav, NavItem, TabContent, TabPane } from "reactstrap"
import { useCustomToast } from "hooks/useCustomToast"
import { get } from "helpers/api_helper"
import { URL_GET_COUNTRY_CODE } from "modules/mail/settings/urls"
import { USER_IP_COUNTRY_CODE } from "modules/mail/admin/url"

import MainHeader from "pages/SettingMain/MainHeader"
import IP from "./IP"
import WhiteIP from "./WhiteIP"
import Country from "./Country"
import "./style.scss"

const SmtpPop3Imap = (props) => {
  const { routeConfig } = props
  const { t } = useTranslation()
  const { errorToast } = useCustomToast()
  const [activeTab, setActiveTab] = useState("ip")
  const [countryCode, setCountryCode] = useState({})
  const [userInfo, setUserInfo] = useState({})

  // get Country Code
  const getCountryCode = async () => {
    try {
      const res = await get(URL_GET_COUNTRY_CODE, {}, Headers, undefined, {
        isApiMail: false,
      })

      if (res?.success) {
        let countryCode = {}
        res?.rows?.forEach(function (country) {
          countryCode[country.code] = country.name
        })
        setCountryCode(countryCode)
      } else {
        errorToast()
      }
    } catch (err) {
      errorToast()
    }
  }

  const getUserCountryCode = async () => {
    try {
      const res = await get(USER_IP_COUNTRY_CODE, {}, Headers, undefined, {
        isApiMail: false,
      })

      if (res?.success) {
        setUserInfo(res.rows)
      }
    } catch (err) {}
  }

  useEffect(() => {
    getCountryCode()
    getUserCountryCode()
  }, [])

  const handleChangeTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab)
    }
  }

  return (
    <>
      {/* --- Header --- */}
      <MainHeader currentTitleMenu={routeConfig?.keyTitle} />
      <div className={`w-100 h-100 overflow-y-auto`}>
        <Nav tabs className="nav-container border-0">
          <NavItem
            active={activeTab === "ip"}
            className={"cursor-pointer"}
            onClick={() => {
              handleChangeTab("ip")
            }}
          >
            {t("mail.mail_unblock_ip")}
          </NavItem>
          <NavItem
            active={activeTab === "white-ip"}
            className={"cursor-pointer"}
            onClick={() => {
              handleChangeTab("white-ip")
            }}
          >
            {t("mail.mail_white_ip_management")}
          </NavItem>
          <NavItem
            active={activeTab === "country"}
            className={"cursor-pointer"}
            onClick={() => {
              handleChangeTab("country")
            }}
          >
            {t("mail.mail_access_country_management")}
          </NavItem>
          <NavItem
            active={activeTab === "block-country"}
            className={"cursor-pointer"}
            onClick={() => {
              handleChangeTab("block-country")
            }}
          >
            {t("mail.mail_blocked_country_management")}
          </NavItem>
        </Nav>
        <TabContent activeTab={activeTab} className="mt-2">
          {/* --- Content POP3 --- */}
          <TabPane tabId="ip">
            <IP countryCode={countryCode} />
          </TabPane>

          {/* --- Content IMAP --- */}
          <TabPane tabId="white-ip">
            <WhiteIP />
          </TabPane>

          {/* --- Content IMAP --- */}
          <TabPane tabId="country">
            <Country type={"white"} countryCode={countryCode} userInfo={userInfo} />
          </TabPane>
          {/* --- Content Password --- */}
          <TabPane tabId="block-country">
            <Country type={"block"} countryCode={countryCode} userInfo={userInfo} />
          </TabPane>
        </TabContent>
      </div>
    </>
  )
}

export default SmtpPop3Imap
