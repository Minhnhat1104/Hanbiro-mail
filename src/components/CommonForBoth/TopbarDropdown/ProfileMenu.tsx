// @ts-nocheck
import React, { useState, useEffect, useMemo, useTransition } from "react"
import PropTypes from "prop-types"
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap"

//i18n
import { useTranslation, withTranslation } from "react-i18next"
// Redux
import { connect, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import withRouter from "components/Common/withRouter"

// users
import user1 from "../../../assets/images/users/avatar-1.jpg"
import { getUserAvatarUrl } from "utils"
import useCommon from "utils/useCommon"

const ProfileMenu = (props) => {
  const { isIframeMode } = props
  // Declare a new state variable, which we'll call "menu"
  const userData = useSelector((state) => state.Config?.userConfig?.user_data)
  const navigate = useNavigate()
  const { isAdminMenu, interfaceConfig } = useCommon()
  const [menu, setMenu] = useState(false)
  const username = useMemo(() => {
    return userData?.email || userData?.id
  }, [userData])
  const avatarUrl = useMemo(() => {
    if (userData?.cn && userData?.no) return getUserAvatarUrl(userData.cn, userData.no)
  }, [userData])

  // const navigateSettings = () => {
  //   navigate("/mail/setting/writing")
  // }

  // const navigateAdminSettings = () => {
  //   navigate("/mail/admin/create-alias-account")
  // }
  return (
    <React.Fragment>
      <Dropdown isOpen={menu} toggle={() => setMenu(!menu)} className="d-inline-block">
        <DropdownToggle
          className="btn header-item d-flex align-items-center"
          id="page-header-user-dropdown"
          tag="button"
        >
          {isIframeMode ? (
            <div className="d-flex align-items-center">
              <i className="mdi mdi-cog-outline font-size-16 align-middle me-1" />
              <span>{props.t("mail.mail_menu_preference")}</span>
            </div>
          ) : (
            <>
              <img
                className="rounded-circle header-profile-user"
                src={avatarUrl}
                alt="Header Avatar"
              />
              <div className="d-flex flex-column justify-content-start text-start">
                <span className="d-none d-xl-inline-block ms-2 me-1 " style={{ fontSize: "11px" }}>
                  {userData?.basedept}
                </span>
                <span className="d-none d-xl-inline-block ms-2 me-1 ">
                  {userData?.name}&#x20;{userData?.basepos}
                </span>
                <span className="d-none d-xl-inline-block ms-2 me-1" style={{ fontSize: "11px" }}>
                  {userData?.email}
                </span>
              </div>
              <i className="mdi mdi-chevron-down d-none d-xl-inline-block" />
            </>
          )}
        </DropdownToggle>
        <DropdownMenu className="dropdown-menu-end">
          {/* <DropdownItem onClick={navigateSettings}>
            <i className="mdi mdi-cog-outline font-size-16 align-middle me-1" />
            <span>{props.t("mail.mail_menu_preference")}</span>
          </DropdownItem>
          {isAdminMenu &&
            <DropdownItem onClick={navigateAdminSettings}>
              <i className="mdi mdi-account-cog-outline font-size-16 align-middle me-1" />
              <span>{props.t("common.board_admin_menu_text")}</span>
            </DropdownItem>
          } */}
          {!isIframeMode && (
            <>
              {/* <div className="dropdown-divider" /> */}
              <Link to="/logout" className="dropdown-item">
                <i className="bx bx-power-off font-size-16 align-middle me-1 text-danger" />
                <span>{props.t("common.main_logout_menu")}</span>
              </Link>
            </>
          )}
        </DropdownMenu>
      </Dropdown>
    </React.Fragment>
  )
}

ProfileMenu.propTypes = {
  success: PropTypes.any,
  t: PropTypes.any,
}

const mapStatetoProps = (state) => {
  const { error, success } = state.Profile
  return { error, success }
}

export default withRouter(connect(mapStatetoProps, {})(withTranslation()(ProfileMenu)))
