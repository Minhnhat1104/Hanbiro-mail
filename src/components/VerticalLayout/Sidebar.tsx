// @ts-nocheck
import PropTypes from "prop-types"
import React from "react"
import { connect, useDispatch, useSelector } from "react-redux"
import withRouter from "components/Common/withRouter"

//i18n
import { withTranslation } from "react-i18next"
import SidebarContent from "./SidebarContent"

import { Link } from "react-router-dom"

import logo from "../../assets/images/logo.svg"
import useDevice from "hooks/useDevice"
import { setQueryParams } from "store/mailList/actions"

const Sidebar = (props) => {
  const dispatch = useDispatch()
  const { isMobile } = useDevice()

  const isIframeMode = useSelector((state) => state.viewMode.isIframeMode)
  const isShowSidebar = useSelector((state) => state.viewMode.isShowSidebar)
  const isDetailView = useSelector((state) => state.mailDetail.isDetailView)

  return (
    <React.Fragment>
      <div
        className={`vertical-menu ${isShowSidebar ? "show-sidebar" : "hide-sidebar"} ${
          isIframeMode ? "pt-0" : ""
        } ${isMobile && isDetailView ? "top-0" : ""}`}
      >
        {!isIframeMode && (
          <div className="navbar-brand-box">
            <Link to="/" className="logo logo-dark" onClick={() => dispatch(setQueryParams(null))}>
              <span className="logo-sm">
                <img src={logo} alt="" height="22" />
              </span>
              <span className="logo-lg">
                <img src={logo} alt="" height="17" />
              </span>
            </Link>

            <Link to="/" className="logo logo-light">
              <span className="logo-sm">
                <img src={logo} alt="" height="22" />
              </span>
              <span className="logo-lg">
                <img src={logo} alt="" height="19" />
              </span>
            </Link>
          </div>
        )}
        <div data-simplebar className="h-100 sidebar-menu">
          {/* {props.type !== "condensed" ? <SidebarContent /> : <SidebarContent />} */}
          <SidebarContent />
        </div>
        <div className="sidebar-background"></div>
      </div>
    </React.Fragment>
  )
}

Sidebar.propTypes = {
  type: PropTypes.string,
}

const mapStatetoProps = (state) => {
  return {
    layout: state.Layout,
  }
}
export default connect(mapStatetoProps, {})(withRouter(withTranslation()(Sidebar)))
