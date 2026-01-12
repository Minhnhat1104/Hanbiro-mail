// @ts-nocheck
import React from "react"
import { NavLink } from "react-router-dom"
import { useTranslation } from "react-i18next"
import BaseIcon from "components/Common/BaseIcon"
import "./menu-dropdown.scss"

const MenuContent = ({ showIcon, icon, menu }) => {
  const { t } = useTranslation()
  return (
    <>
      {showIcon && icon && <BaseIcon icon={icon} />}
      <span className="d-flex align-items-center">
        <span className="tx-13 tx-medium">
          {menu?.name ?? t(menu.keyTitle)}
        </span>
        {menu.new != 0 && (
          <span className="mg-l-10 badge badge-warning">{menu.new}</span>
        )}
      </span>
    </>
  )
}

const formatLink = (navURL, menu) => {
  let url = `/mail/${navURL}/${menu.key}`
  return url
}

const MenuDropdownRow = (props) => {
  const {
    menu,
    navURL = "list",
    showIcon = true,
    icon = "",
    iconCollapse = "",
    isLoading = false,
    showCollapse = false,
    handleClick,
    isAdmin = false,
    isChildren = false,
    initExpand = false,
    paddingLeftDropDownRow = 0,
  } = props
  const { t } = useTranslation()
  let urlAdmin = ""
  if (isAdmin) {
    urlAdmin = menu.path
    if (urlAdmin && urlAdmin?.indexOf(":") != -1) {
      let arrUrl = urlAdmin.split("/")
      arrUrl.splice(-1, 1)
      urlAdmin = arrUrl.join("/")
    }
  }

  return (
    <div
      className={`menu-dropdown-row w-100 d-flex align-items-center justify-content-between${initExpand ? " parent-active" : ""}`}>
      {!isAdmin ? (
        !menu?.disabled ? (
          <NavLink
            to={formatLink(navURL, menu)}
            className={`nav-link d-flex w-100 align-items-center ${
              isChildren ? "pd-l-10-f pd-8-f pd-l-10" : ""
            }`}
          >
            <MenuContent showIcon={showIcon} icon={icon} menu={menu} />
          </NavLink>
        ) : (
          <div
            className={`cursor-pointer nav-link d-flex align-items-center ${
              initExpand ? "parent-active" : ""
            } ${isChildren ? "pd-l-10" : ""}`}
            onClick={handleClick}
          >
            <MenuContent showIcon={showIcon} icon={icon} menu={menu} />
          </div>
        )
      ) : menu?.disabled ? (
        <div
          className={`nav-link d-flex align-items-center cursor-pointer overflow-hidden${initExpand ? " parent-active" : ""}${isChildren ? "" : " children"}`}
          onClick={handleClick}
        >
          {showIcon && icon && <BaseIcon icon={icon} />}
          <span
            className="d-inline-block han-h4 han-fw-regular overflow-hidden"
            style={{ textOverflow: "ellipsis", whiteSpace: "nowrap" }}
          >
            {menu?.name ?? t(menu.keyTitle)}
          </span>
        </div>
      ) : (
        <NavLink
          to={urlAdmin}
          className={`nav-link d-flex w-100 align-items-center${isChildren ? "" : " children"}`}
          style={{ paddingLeft: paddingLeftDropDownRow }}
        >
          {showIcon && icon && <BaseIcon icon={icon} />}
          <span
            className="d-inline-block han-h4 han-fw-regular overflow-hidden"
            style={{ textOverflow: "ellipsis", whiteSpace: "nowrap" }}
          >
            {menu?.name ?? t(menu.keyTitle)}
          </span>
        </NavLink>
      )}
      {showCollapse &&
        (isLoading ? (
          <div className="spinner-border spinner-border-sm" role="status" />
        ) : (
          <BaseIcon icon={iconCollapse} onClick={handleClick} />
        ))}
    </div>
  )
}

export default MenuDropdownRow
