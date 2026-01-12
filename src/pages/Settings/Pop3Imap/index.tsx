// @ts-nocheck
// React
import { useEffect, useState } from "react"

// Third-party
import { useTranslation } from "react-i18next"
import { Card, Nav, NavItem, TabContent, TabPane } from "reactstrap"

// Project
import { Headers } from "helpers/email_api_helper"
import { useCustomToast } from "hooks/useCustomToast"

import { BaseButton } from "components/Common"
import HanTooltip from "components/Common/HanTooltip"
import "components/SettingAdmin/Tabs/style.css"
import { get } from "helpers/api_helper"
import { URL_GET_COUNTRY_CODE } from "modules/mail/settings/urls"
import MainHeader from "pages/SettingMain/MainHeader"
import IMAP from "./IMAP"
import POP3 from "./POP3"
import Password from "./Password"
import SMTP from "./SMTP"
import "./style.scss"
import Toolbar from "../../SettingMain/Toolbar"

const VacationAutoReply = (props) => {
  const { routeConfig } = props
  const { t } = useTranslation()
  const { errorToast } = useCustomToast()

  const [activeTab, setActiveTab] = useState("1")
  const [isRefresh, setIsRefresh] = useState(true)
  const [countryCode, setCountryCode] = useState(null)

  useEffect(() => {
    if (activeTab !== "4") {
      setIsRefresh(true)
    }
  }, [activeTab])

  const handleChangeTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab)
    }
  }

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

  // Handle fetch data
  const handleFetchData = () => {
    getCountryCode()
  }

  useEffect(() => {
    handleFetchData()
  }, [])

  return (
    <>
      {/* --- Header --- */}
      <MainHeader currentTitleMenu={t(routeConfig?.keyTitle)} />
      <Toolbar
        end={
          <HanTooltip placement="top" overlay={t("common.org_refresh")}>
            <BaseButton
              outline
              color="grey"
              className="btn-action px-2 py-1"
              id="refresh-pop3-imap"
              iconClassName="m-0"
              icon="mdi mdi-refresh"
              loadingClass="py-2 px-1"
              onClick={() => setIsRefresh(true)}
              loading={isRefresh}
              style={{ width: "38px", height: "38px" }}
            />
          </HanTooltip>
        }
      />

      <div className={`w-100 h-100 overflow-hidden`}>
        <Nav tabs className="pop3-imap-tab border-0 mb-2">
          <NavItem
            active={activeTab === "1"}
            className={"cursor-pointer"}
            onClick={() => {
              handleChangeTab("1")
            }}
          >
            SMTP/POP3
          </NavItem>
          <NavItem
            active={activeTab === "2"}
            className={"cursor-pointer"}
            onClick={() => {
              handleChangeTab("2")
            }}
          >
            SMTP/IMAP
          </NavItem>
          <NavItem
            active={activeTab === "3"}
            className={"cursor-pointer"}
            onClick={() => {
              handleChangeTab("3")
            }}
          >
            {t("mail.mail_smtp")}
          </NavItem>
          <NavItem
            active={activeTab === "4"}
            className={"cursor-pointer"}
            onClick={() => {
              handleChangeTab("4")
            }}
          >
            {t("mail.mail_app_password")}
          </NavItem>
        </Nav>
        <TabContent
          activeTab={activeTab}
          className={`w-100 overflow-y-auto overflow-x-hidden`}
          style={{ height: "calc(100% - 44px)" }}
        >
          {/* --- Content POP3 --- */}
          <TabPane tabId="1">
            <POP3
              activeTab={activeTab}
              isRefresh={isRefresh}
              setIsRefresh={setIsRefresh}
              countryCode={countryCode}
            />
          </TabPane>

          {/* --- Content IMAP --- */}
          <TabPane tabId="2">
            <IMAP
              activeTab={activeTab}
              isRefresh={isRefresh}
              setIsRefresh={setIsRefresh}
              countryCode={countryCode}
            />
          </TabPane>

          {/* --- Content IMAP --- */}
          <TabPane tabId="3">
            <SMTP
              activeTab={activeTab}
              isRefresh={isRefresh}
              setIsRefresh={setIsRefresh}
              countryCode={countryCode}
            />
          </TabPane>
          {/* --- Content Password --- */}
          <TabPane tabId="4">
            <Password
              activeTab={activeTab}
              isRefresh={isRefresh}
              setIsRefresh={setIsRefresh}
              countryCode={countryCode}
            />
          </TabPane>
        </TabContent>
      </div>
    </>
  )
}

export default VacationAutoReply
