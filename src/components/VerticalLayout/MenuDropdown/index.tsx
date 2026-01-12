// @ts-nocheck
import React, { useState, useEffect } from "react"
import classnames from "classnames"
import { Input } from "reactstrap"
import { t } from "i18next"
import MenuDropdownRow from "./MenuDropdownRow"
import { useDispatch, useSelector } from "react-redux"
import { setShareMenus } from "store/emailConfig/actions"
import { selectFolderMenus } from "store/emailConfig/selectors"
import { useParams } from "react-router-dom"
import { isArray, isFunction } from "lodash"

import "./styles.scss"
import { setCountFolderMenu } from "utils/sidebar"

const MenuDropdown = ({
  menus,
  menu = {},
  navURL = "list",
  main_index = "0",
  isParent = false,
  isChildren = false,
  initExpand = false,
  type = "",
  icon = "",
  isSearch = false,
  iconCustom = "",
  apiGetSubMenu = () => {},
  isAdmin,
  apiReturnGetField,
  currentMenuKey = false,
  paddingLeft = 0,
  isShareMenu = false,
  callbackUpdateList,
}) => {
  const dispatch = useDispatch()
  const { menu: subMenu } = useParams()

  // redux state
  const currentMenu = useSelector((state) => state.viewMode.currentMenu)
  const sidebarCount = useSelector((state) => state.Socket.sidebarCount)
  const folderMenus = useSelector(selectFolderMenus)
  const [isExpand, setIsExpand] = useState(initExpand)
  const [subMenus = [], setSubMenus] = useState(menus)
  const [checkLoadApi, setCheckLoadApi] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [searchText, setSearchText] = useState("")

  let keyName = menu?.key?.replace(/\./g, "")
  if (!keyName && menu?.keyTitle) {
    keyName = menu?.keyTitle?.replace(/\./g, "")
  }

  useEffect(() => {
    if (initExpand && isArray(menus) && menus.length > 0) {
      setIsExpand(true)
    } else {
      setIsExpand(false)
      setCheckLoadApi(false)
    }
    if (!searchText.trim()) {
      setSubMenus(menus)
    }
  }, [menus])

  const handleClick = () => {
    setIsExpand(!isExpand)
    if (!checkLoadApi && (subMenus?.length == 0 || typeof subMenus === "boolean")) {
      setIsLoading(true)
      setCheckLoadApi(true)

      apiGetSubMenu({ root: menu.key, isopen: "yes" }).then((res) => {
        setSubMenus(res?.[apiReturnGetField] ?? [])
        isFunction(callbackUpdateList) && callbackUpdateList(menu, res?.[apiReturnGetField] ?? [])
        if (isShareMenu) {
          dispatch(setShareMenus(res?.[apiReturnGetField] ?? []))
        }
        setIsLoading(false)
      })
    }
  }

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      const value = e.target.value
      if (value.trim() === "") {
        setSubMenus(menus)
        return
      } else {
        apiGetSubMenu &&
          apiGetSubMenu({
            root: menu.key || "source",
            keyword: value,
            isopen: "yes",
          }).then((res) => {
            setIsLoading(false)
            if (res?.[apiReturnGetField]?.length > 0) {
              // let menuData = []
              // res?.[apiReturnGetField]?.forEach((item) => {
              //   const findMenus = folderMenus.filter((m) => m.name === item.name)
              //   menuData = menuData.concat(findMenus)
              // })
              let nCount = []
              sidebarCount?.forEach((item) => {
                nCount[item[0]] = item[1]
              })
              const nMenu = setCountFolderMenu(res?.[apiReturnGetField], nCount)
              setSubMenus(nMenu)
            } else {
              setSubMenus([])
            }
          })
      }
    }
  }

  return (
    <>
      <li
        className={classnames("nav-item", {
          // "mm-active": checkActiveSub(menu, currentMenuKey),
        })}
      >
        <MenuDropdownRow
          menu={menu}
          navURL={navURL}
          index={keyName + main_index}
          keyName={keyName}
          icon={icon}
          showIcon={isParent ? true : false}
          showCollapse={true}
          isLoading={isLoading}
          iconCollapse={isExpand ? "fas fa-chevron-down" : "fas fa-chevron-right"}
          handleClick={handleClick}
          iconCustom={iconCustom}
          isAdmin={isAdmin ?? (type == "admin" || type == "setting" ? true : false)}
          isChildren={isChildren}
          initExpand={initExpand}
          startIcon={menu?.icon}
        />
      </li>
      <ul
        className={classnames("ps-2 sub-menu", { "mm-show": isExpand })}
        style={{ paddingLeft: paddingLeft }}
      >
        {isSearch && (
          <div className={"input-search"}>
            <input
              className={`han-h4 han-fw-regular han-text-secondary form-control search-folder`}
              onKeyDown={onKeyDown}
              placeholder={t("common.common_search")}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>
        )}
        {subMenus &&
          typeof subMenus !== "boolean" &&
          subMenus.length != 0 &&
          subMenus.map((menu, index) => {
            return menu?.children?.length > 0 || menu?.hasChildren ? (
              <MenuDropdown
                menu={menu}
                navURL={navURL}
                index={keyName + "_" + main_index + "_" + index}
                type={type}
                icon={icon}
                menus={menu?.children}
                apiGetSubMenu={apiGetSubMenu}
                isChildren={true}
                isParent={true}
                isAdmin={isAdmin}
                apiReturnGetField={apiReturnGetField}
                currentMenuKey={currentMenuKey}
                key={index}
                initExpand={initExpand}
                paddingLeft={paddingLeft + 15}
                callbackUpdateList={callbackUpdateList}
              />
            ) : (
              <li
                key={index}
                className={`nav-item ${
                  menu?.key && menu.key === currentMenu?.key ? "mm-active" : ""
                }`}
              >
                <MenuDropdownRow
                  menu={menu}
                  navURL={navURL}
                  index={keyName + "_" + index}
                  showIcon={true}
                  icon={icon}
                  isAdmin={
                    isAdmin ??
                    (type == "admin" || type == "setting" || type == "settings" ? true : false)
                  }
                  isChildren={true}
                  currentMenuKey={currentMenuKey}
                />
              </li>
            )
          })}
      </ul>
    </>
  )
}

export default MenuDropdown
