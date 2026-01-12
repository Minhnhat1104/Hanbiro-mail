// @ts-nocheck
import classnames from "classnames"
import { Title } from "components/SettingAdmin"
import { useCustomToast } from "hooks/useCustomToast"
import { updateExternalMailPop, updateExternalMailSmtp } from "modules/mail/settings/api"
import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { Card, Col, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap"
import POP3 from "./POP3"
import SMTP from "./SMTP"
import "./styles.scss"
import MainHeader from "pages/SettingMain/MainHeader"

const Fetching = (props) => {
  const { routeConfig } = props
  const { t } = useTranslation()
  const [activeTab, setactiveTab] = useState("1")
  const { successToast, errorToast } = useCustomToast()
  const [loading, setLoading] = useState(false)

  const toggle = (tab) => {
    if (activeTab !== tab) {
      setactiveTab(tab)
    }
  }

  const onSubmitPOP3 = (formData) => {
    const params = {
      ...formData,
      isssl: formData.isssl ? "y" : "n",
    }
    setLoading(true)
    updateExternalMailPop(params).then((res) => {
      setLoading(false)
      if (res.success) {
        successToast()
      } else {
        errorToast(res.msg)
      }
    })
  }
  const onSubmitSMTP = (formData) => {
    const params = {
      ...formData,
      isssl: formData.isssl ? "y" : "n",
    }
    setLoading(true)
    updateExternalMailSmtp(params).then((res) => {
      setLoading(false)
      if (res.success) {
        successToast()
      } else {
        errorToast(res.msg)
      }
    })
  }

  return (
    <>
      <MainHeader currentTitleMenu={t(routeConfig?.keyTitle)} />
      <div className={`w-100 h-100 overflow-hidden`}>
        <Nav tabs className="fetching-tab border-0 mb-2">
          <NavItem
            active={activeTab === "1"}
            className={"cursor-pointer"}
            onClick={() => {
              toggle("1")
            }}
          >
            {t("mail.mail_preference_pop3_tab")}
          </NavItem>
          <NavItem
            active={activeTab === "2"}
            className={"cursor-pointer"}
            onClick={() => {
              toggle("2")
            }}
          >
            {t("mail.mail_smtp")}
          </NavItem>
        </Nav>
        <TabContent
          activeTab={activeTab}
          className={`w-100 overflow-y-auto`}
          style={{ height: "calc(100% - 44px)" }}
        >
          <TabPane tabId="1">
            <POP3 onSubmit={onSubmitPOP3} loading={loading} />
          </TabPane>
          <TabPane tabId="2">
            <SMTP onSubmit={onSubmitSMTP} loading={loading} />
          </TabPane>
        </TabContent>
      </div>
    </>
  )
}

export default Fetching
