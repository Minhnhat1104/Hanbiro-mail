// @ts-nocheck
import classnames from "classnames"
import BaseIcon from "components/Common/BaseIcon"
import useDevice from "hooks/useDevice"
import { isEqual } from "lodash"
import queryString from "query-string"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { Link, useParams } from "react-router-dom"
import { selectUserMailSetting } from "store/auth/config/selectors"
import { setQueryParams } from "store/mailList/actions"
import {
  setAccessMenu,
  setCurrentMenu,
  setRefreshList,
  setShowSidebar,
} from "store/viewMode/actions"

const MenuContent = ({ showIcon, icon, menu, iconClassName = "" }) => {
  const { t } = useTranslation()
  const { menu: subMenu } = useParams()

  return (
    <>
      <span
        style={{ width: `calc(100% - ${menu?.new ? "36px" : "18px"})`, color: "inherit" }}
        className="d-flex align-items-center"
      >
        {showIcon && icon && (
          <BaseIcon icon={icon} className={`${iconClassName}`} style={{ color: "inherit" }} />
        )}
        <span className={`sub-menu-title text-truncate`} style={{ color: "inherit" }}>
          {menu?.name ?? t(menu.keyTitle)}
        </span>
      </span>
      {!!menu?.new && menu.new != "0" && (
        <span className={`font-size-11 han-fw-semibold badge han-badge-primary m-0 me-1`}>
          {menu.new}
        </span>
      )}
    </>
  )
}

const MenuDropdownRow = ({
  menu,
  navURL = "list",
  showIcon = true,
  icon = "",
  iconCollapse = "",
  isLoading = false,
  showCollapse = false,
  handleClick,
  isChildren = false,
  initExpand = false,
  currentMenuKey = false,
  startIcon,
}) => {
  // redux state
  const dispatch = useDispatch()
  const { t } = useTranslation()

  const { isMobile, isVerticalTablet } = useDevice()

  const currentMenu = useSelector((state) => state.viewMode.currentMenu)
  const userMailSetting = useSelector(selectUserMailSetting)
  const isShowSidbar = useSelector((state) => state.viewMode.isShowSidebar)
  const queryParams = useSelector((state) => state.QueryParams.query)

  const isSettingAndAdmin = navURL === "setting" || navURL === "admin"

  const limit = useMemo(() => {
    return userMailSetting?.items_per_page ?? 20
  }, [userMailSetting?.items_per_page])

  const initFilter = useMemo(() => {
    const isShareMenu = menu?.key?.includes("HBShare_")
    return {
      acl: menu.key,
      act: "maillist",
      mailsort: "date",
      sortkind: "0",
      timemode: "mobile",
      viewcont: `0,${limit}`,
      ...(isShareMenu ? {} : { searchbox: menu.key }),
    }
  }, [limit, menu.key])

  const initPermitFilterToolbar = useMemo(
    () => ({
      page: 1,
      linenum: limit,
      sortkey: "timestamp",
      sorttype: "desc",
      state: "n",
    }),
    [limit, menu],
  )

  const formatLink = (navURL, menu) => {
    let url = isSettingAndAdmin
      ? `/mail/${navURL}/${menu.key}`
      : `/mail/${navURL}/${menu.key}?${queryString.stringify(
          menu.key === "Approval" ? initPermitFilterToolbar : initFilter,
        )}`
    return url
  }

  const checkActiveSub = (menu, currentMenuKey) => {
    return currentMenuKey ? currentMenuKey === menu.key : currentMenu?.key === menu.key
  }

  return (
    <div
      className={`han-h4 ${
        menu?.key && menu.key === currentMenu?.key ? "han-fw-semibold mm-active" : "han-fw-regular"
      } menu-dropdown-row d-flex justify-content-between align-items-center`}
      onClick={(e) => {
        e.stopPropagation()
        dispatch(
          setAccessMenu({
            key: menu?.key,
            title: menu?.name || t(menu?.keyTitle),
          }),
        )
        if (currentMenu?.key && menu?.key && currentMenu.key === menu.key) {
          if (isEqual(queryParams, initFilter)) {
            dispatch(setRefreshList(true))
          } else {
            dispatch(setQueryParams(initFilter))
          }
        } else {
          dispatch(
            setCurrentMenu({
              key: menu?.key,
              title: menu?.name || t(menu?.keyTitle),
              parentTitle:
                navURL === "setting"
                  ? t("mail.mail_menu_preference")
                  : navURL === "admin"
                  ? t("common.board_admin_menu_text")
                  : "",
            }),
          )
          dispatch(setQueryParams(initFilter))
        }

        if ((isMobile || isVerticalTablet) && isShowSidbar & !showCollapse) {
          dispatch(setShowSidebar(false))
        }
      }}
    >
      {startIcon && <i className={startIcon}></i>}
      {!menu?.disabled ? (
        <Link
          to={formatLink(navURL, menu)}
          className={classnames(
            `nav-link d-block d-flex align-items-center justify-content-between`,
            {
              // "px-0 py-0": isChildren,
              // active: checkActiveSub(menu, currentMenuKey),
            },
            "sidebar-text-color",
          )}
          style={{ width: `calc(100% - ${showCollapse ? "24px" : "0px"}` }}
        >
          <MenuContent showIcon={showIcon} icon={icon} menu={menu} iconClassName="main-icon" />
        </Link>
      ) : (
        <div
          className={classnames(
            "cursor-pointer nav-link d-flex align-items-center",
            {
              "parent-active": initExpand,
              active: checkActiveSub(menu, currentMenuKey),
            },
            "sidebar-text-color",
          )}
          onClick={(e) => {
            e.stopPropagation()
            handleClick && handleClick()
          }}
          style={{ width: `calc(100% - ${showCollapse ? "24px" : "0px"}` }}
        >
          <MenuContent
            showIcon={menu?.children ? true : false}
            icon={icon}
            menu={menu}
            iconClassName={"main-icon"}
          />
        </div>
      )}
      {showCollapse && (
        <div className="me-2">
          {isLoading ? (
            <div className="spinner-border spinner-border-sm" role="status" />
          ) : (
            <BaseIcon
              icon={iconCollapse}
              onClick={(e) => {
                e.stopPropagation()
                handleClick && handleClick()
              }}
              className={"ms-1 han-text-secondary"}
            />
          )}
        </div>
      )}
    </div>
  )
}

export default MenuDropdownRow
