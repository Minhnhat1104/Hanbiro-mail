// @ts-nocheck
import classnames from "classnames"
import { BaseIcon } from "components/Common"
import HanTooltip from "components/Common/HanTooltip"
import useDevice from "hooks/useDevice"
import { isEqual } from "lodash"
import { initFilterOptions } from "pages/List/FilterToolbar"
import queryString from "query-string"
import { useMemo, useRef } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate, useParams } from "react-router-dom"
import { selectUserMailSetting } from "store/auth/config/selectors"
import { setPermitQueryParams, setQueryParams } from "store/mailList/actions"
import {
  setAccessMenu,
  setCurrentMenu,
  setRefreshList,
  setResetFilter,
  setShowSidebar,
} from "store/viewMode/actions"
import "./style.scss"

const MenuRow = (props) => {
  const { menu, router, toggleConfirmEmpty } = props
  const navigate = useNavigate()
  const { t } = useTranslation()
  const routeParams = useParams()

  const { isMobile, isVerticalTablet } = useDevice()

  const navLinkRef = useRef()

  // redux state
  const dispatch = useDispatch()
  const currentMenu = useSelector((state) => state.viewMode.currentMenu)
  const userMailSetting = useSelector(selectUserMailSetting)
  const isShowSidebar = useSelector((state) => state.viewMode.isShowSidebar)
  const queryParams = useSelector((state) => state.QueryParams.query)
  const permitQueryParams = useSelector((state) => state.QueryParams.permitQuery)
  const isDetailView = useSelector((state) => state.mailDetail.isDetailView)

  const limit = useMemo(() => {
    return userMailSetting?.items_per_page ?? 20
  }, [userMailSetting?.items_per_page])

  const initFilter = useMemo(() => {
    const isSearchBox = !["Secure", "Receive", "Spam"].includes(menu?.key)
    return {
      acl: menu.key,
      act: "maillist",
      mailsort: "date",
      sortkind: "0",
      timemode: "mobile",
      viewcont: `0,${limit}`,
      ...(isSearchBox ? { searchbox: menu.key } : {}),
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

  const formatLink = (menu) => {
    let url = `/mail/list/${menu.key}?${queryString.stringify(
      menu.key === "Approval" ? initPermitFilterToolbar : initFilter,
    )}`

    return url
  }

  const handleReceiptsMenu = (e) => {
    e.stopPropagation()
    const nFilter = {
      ...initFilter,
      acl: "Receive",
    }
    delete nFilter.searchbox

    const url = `/mail/list/Receive?${queryString.stringify(nFilter)}`

    if (routeParams?.menu === "Receive") {
      if (isEqual(queryParams, nFilter)) {
        if (isDetailView) {
          navigate(url)
        } else {
          dispatch(setRefreshList(true))
        }
      } else {
        navigate(url)
        dispatch(setQueryParams(nFilter))
      }
    } else {
      dispatch(
        setCurrentMenu({
          key: "Receive",
          title: t("mail.mail_menu_receipts"),
        }),
      )
      dispatch(
        setAccessMenu({
          key: "Receive",
          title: t("mail.mail_menu_receipts"),
        }),
      )
      navigate(url)
      dispatch(setQueryParams(nFilter))

      if ((isMobile || isVerticalTablet) && isShowSidebar) {
        dispatch(setShowSidebar(false))
      }
    }
  }

  return (
    <li
      key={menu.key}
      className={classnames("position-relative mail-menu cursor-pointer", {
        "mm-active": menu.key === currentMenu?.key,
        "d-flex justify-content-between align-items-center":
          menu.key == "Trash" || menu.key == "Sent",
      })}
      onClick={() => navLinkRef?.current?.click()}
      style={{ maxHeight: 33, minHeight: 33 }}
    >
      <Link
        ref={navLinkRef}
        className={`han-h4 ${
          menu.key === currentMenu?.key ? "han-fw-medium" : "han-fw-regular"
        } han-fw-regular d-flex justify-content-between align-items-center nav-link sidebar-text-color
        `}
        to={formatLink(menu)}
        key={"link-" + menu.key}
        onClick={(e) => {
          e.stopPropagation()
          dispatch(setResetFilter(true))
          dispatch(
            setAccessMenu({
              key: menu?.key,
              title: menu?.name || t(menu?.keyTitle),
            }),
          )
          if (currentMenu?.key && menu?.key && currentMenu.key === menu.key) {
            if (
              isEqual(
                menu.key === "Approval" ? permitQueryParams : queryParams,
                menu.key === "Approval" ? initPermitFilterToolbar : initFilter,
              )
            ) {
              dispatch(setRefreshList(true))
            } else {
              dispatch(
                menu?.key === "Approval"
                  ? setPermitQueryParams(initPermitFilterToolbar)
                  : setQueryParams(initFilter),
              )
            }
          } else {
            dispatch(
              setCurrentMenu({
                key: menu?.key,
                title: menu?.name || t(menu?.keyTitle),
              }),
            )
            dispatch(
              menu.key === "Approval"
                ? setPermitQueryParams(initPermitFilterToolbar)
                : setQueryParams(initFilter),
            )
          }

          if ((isMobile || isVerticalTablet) && isShowSidebar) {
            dispatch(setShowSidebar(false))
          }
        }}
      >
        <div>
          <BaseIcon
            icon={menu?.icon ?? "mdi mdi-email-outline"}
            className={"me-0 pb-0"}
            style={{ color: "inherit" }}
          />{" "}
          {menu.name ?? props.t(menu?.keyTitle)}
        </div>
        {menu.new != "0" && menu.key != "Trash" && (
          <span className="font-size-11 badge han-badge-primary mt-0 me-1">{menu.new}</span>
        )}
      </Link>
      {menu.key == "Sent" && (
        <HanTooltip placement="top" overlay={t("mail.mail_menu_receipts")}>
          <BaseIcon
            icon={"mdi mdi-email-check-outline"}
            className={classnames("btn-receipts-menu", {
              "mm-active": currentMenu?.key === "Receive",
            })}
            onClick={handleReceiptsMenu}
          />
        </HanTooltip>
      )}
      {menu.key == "Trash" && (
        <BaseIcon
          icon={"mdi mdi-trash-can-outline color-red"}
          className={"btn-empty-trash"}
          onClick={toggleConfirmEmpty}
        />
      )}
    </li>
  )
}

export default MenuRow
