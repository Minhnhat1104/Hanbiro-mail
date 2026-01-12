// @ts-nocheck
// React
import React, { useEffect, useState } from "react"

// Third-party
import classnames from "classnames"
import { Card, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap"
import { useTranslation } from "react-i18next"

// Project
import BaseButtonTooltip from "components/Common/BaseButtonTooltip"
import { Title } from "components/SettingAdmin"
import { emailGet } from "helpers/email_api_helper"
import { useCustomToast } from "hooks/useCustomToast"
import { URL_SPAM_REPORT } from "modules/mail/settings/urls"
import { URL_GET_EMAIL_LIST } from "modules/mail/list/urls"
import { postMailToHtml5 } from "modules/mail/common/api"

import SpamFilter from "./SpamFilter"
import SpamReport from "./SpamReport"

import "components/SettingAdmin/Tabs/style.css"
import "./style.scss"
import MainHeader from "pages/SettingMain/MainHeader"

const SpamSettings = (props) => {
  const { routeConfig } = props
  const { t } = useTranslation()
  const { errorToast } = useCustomToast()

  const [activeTab, setActiveTab] = useState("1")
  const handleChangeTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab)
    }
  }

  const [isOpen, setIsOpen] = useState(false)
  const handleModal = () => setIsOpen(!isOpen)

  const [filterData, setFilterData] = useState({
    msgShow: false,
    msg: "",
    typeSpam: "usemanagerdb",
    numWhiteList: 0,
  })
  const [spamReportData, setSpamReportData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const getList = async (data) => {
    // mailTohtml5.do -> act: whitelistmanage | mode: list | data: undefined
    try {
      const postParams = {
        act: "whitelistmanage",
        mode: "list",
        data: JSON.stringify(data),
      }
      const res = await postMailToHtml5(postParams)
      setFilterData((prev) => ({ ...prev, numWhiteList: res?.total }))
    } catch (err) {
      errorToast()
    }
  }

  const getStatus = async () => {
    // mailTohtml5.do -> act: spam | mode: status
    try {
      const postParams = { act: "spam", mode: "status" }
      const res = await postMailToHtml5(postParams)

      const newData = { ...res }

      if (res.spam_count != "100" && res.spam_count != "") {
        newData.rate = res?.spam_count * 1
      }

      if (res.spam_count == "100") {
        // whitelist
        newData.msgShow = true
        newData.msg = "<span>Receive mail from addreses registered to the Whitelist only.</span>"
        newData.typeSpam = "justwhite"
      } else if (res.spam_count == "") {
        // spam off
        newData.msgShow = true
        newData.msg =
          "<span style='color: red;'>No spam filter running. Please activate an option for protection.</span>"
        newData.typeSpam = "spamoff"
      } else if (res.user_db == "1") {
        // newuserdb
        newData.typeSpam = "newuserdb"
      } else {
        // usemanagerdb
        newData.typeSpam = "usemanagerdb"
      }

      setFilterData((prev) => ({ ...prev, ...newData }))
    } catch (err) {
      errorToast()
    }
  }

  const getRate = async () => {
    // mailTohtml5.do -> act: spam | mode: read_rate
    try {
      const postParams = {
        act: "spam",
        mode: "read_rate",
      }
      const res = await postMailToHtml5(postParams)

      if (res?.success === "1") {
        setFilterData((prev) => ({ ...prev, rate: res?.rate * 1 }))
      }
    } catch (err) {
      errorToast()
    }
  }

  const getListCSpamadd = async () => {
    // Get -> /email/list/CSpamadd
    setFilterData((prev) => ({ ...prev, disableUseManagerDb: false }))
    try {
      const res = await emailGet([URL_GET_EMAIL_LIST, "CSpamadd"].join("/"))

      if (res.hasOwnProperty("iscspam") && res?.iscspam == false) {
        setFilterData((prev) => ({ ...prev, disableUseManagerDb: true }))
      } else {
        setFilterData((prev) => ({ ...prev, disableUseManagerDb: false }))
      }
    } catch (err) {
      errorToast()
    }
  }

  const getSpamReport = async () => {
    // Get -> /email/spamreport
    setIsLoading(true)
    try {
      const res = await emailGet(URL_SPAM_REPORT)

      if (res.hasOwnProperty("data")) {
        const newData = { ...res?.data }
        newData.isuse = newData?.isuse.toString()
        newData.repeat = parseInt(newData?.repeat)
        newData.maxemail = parseInt(newData?.maxemail)
        setSpamReportData((prev) => ({
          ...prev,
          ...newData,
        }))
        setIsLoading(false)
      }
    } catch (err) {
      errorToast()
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getList()
    getStatus()
    getRate()
    getListCSpamadd()
    getSpamReport()
  }, [])

  const smtpOptions = [
    { value: "y", title: t("mail.mail_set_pop3_use") },
    { value: "n", title: t("mail.mail_spam_settings_disable") },
  ]

  const spamFilter = [
    { value: "usemanagerdb", title: t("common.mail_set_spam_admindb") },
    { value: "newuserdb", title: t("mail.mail_set_spam_makedb") },
    { value: "justwhite", title: t("mail.mail_set_spam_white") },
    { value: "spamoff", title: t("common.mail_set_spam_stop") },
  ]

  return (
    <>
      <MainHeader />
      <div className={`w-100 h-100 overflow-hidden`}>
        <Nav tabs className="spam-tab border-0 position-relative">
          <NavItem
            active={activeTab === "1"}
            className="cursor-pointer"
            onClick={() => handleChangeTab("1")}
          >
            {t("mail.mail_spam_settings_spam_filter")}
          </NavItem>
          <NavItem
            active={activeTab === "2"}
            className="cursor-pointer"
            onClick={() => handleChangeTab("2")}
          >
            {t("mail.mail_spam_settings_spam_report")}
          </NavItem>
          {activeTab === "2" && (
            <BaseButtonTooltip
              title={t("common.org_refresh")}
              id="refresh-whitelist"
              color="grey"
              className="btn-action h-100 px-2 position-absolute end-0"
              iconClassName="m-0"
              icon="mdi mdi-refresh"
              onClick={getSpamReport}
              loading={isLoading}
              style={{ width: "38px", height: "38px" }}
            />
          )}
        </Nav>
        <TabContent activeTab={activeTab} className={`mt-2`}>
          <TabPane tabId="1">
            <SpamFilter
              data={filterData}
              handleModal={handleModal}
              spamFilter={spamFilter}
              isOpen={isOpen}
              getRate={getRate}
            />
          </TabPane>
          <TabPane tabId="2">
            <SpamReport
              data={spamReportData}
              smtpOptions={smtpOptions}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          </TabPane>
        </TabContent>
      </div>
    </>
  )
}
export default SpamSettings
