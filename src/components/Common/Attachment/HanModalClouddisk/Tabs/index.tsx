// @ts-nocheck
import React from "react"
// import { HanIcon } from "Groupware/components";
import classnames from "classnames"
import { useTranslation } from "react-i18next"
import { Nav, NavItem } from "reactstrap"
import "./styles.scss"

function index({ tabs = [], tabChoosed = {}, onChange = () => {} }) {
  const { t } = useTranslation()
  return (
    <Nav tabs className="clouddisk-tab" id="myTab5" role="tablist">
      {tabs.map((tab) => (
        <NavItem
          active={tabChoosed.id == tab.id}
          key={tab.id}
          className={`han-h4 nav-item nav-left-item ${tabChoosed.id == tab.id ? "active" : ""}`}
          onClick={() => {
            onChange(tab)
          }}
        >
          {t(tab.text)}
        </NavItem>
      ))}
    </Nav>
  )
}

export default index
