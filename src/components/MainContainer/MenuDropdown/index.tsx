// @ts-nocheck
import React, { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { Input } from "reactstrap"
import MenuDropdownRow from "./MenuDropdownRow"
import "./menu-dropdown.scss"
import { t } from "i18next"

const MenuDropdown = (props) => {
  const {
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
    currentMenuKey,
    paddingLeftDropDownRow = 6,
  } = props
  const [isExpand, setIsExpand] = useState(initExpand)
  const [subMenus = [], setSubMenus] = useState(menus)
  const [checkLoadApi, setCheckLoadApi] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  let keyName = menu?.key?.replace(/\./g, "")
  if (!keyName && menu?.keyTitle) {
    keyName = menu?.keyTitle?.replace(/\./g, "")
  }

  const setInitExpandChild = (item) => {
    const location = useLocation()
    if (location?.pathname?.indexOf(item.path) != -1) return true
    return false
  }

  useEffect(() => {
    setSubMenus(menus)
  }, [menus])

  const handleClick = () => {
    setIsExpand(!isExpand)
    if (!checkLoadApi && (subMenus?.length == 0 || typeof subMenus === "boolean")) {
      setIsLoading(true)
      setCheckLoadApi(true)

      apiGetSubMenu({ root: menu.key, isopen: "yes" }).then((res) => {
        setSubMenus(res?.[apiReturnGetField] ?? [])
        setIsLoading(false)
      })
    }
  }

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      const value = e.target.value
      apiGetSubMenu &&
        apiGetSubMenu({
          root: menu.key,
          keyword: value,
          isopen: "yes",
        }).then((res) => {
          setSubMenus(res?.[apiReturnGetField] ?? [])
          setIsLoading(false)
        })
    }
  }

  // if (menu?.children?.length > 0 && currentMenuKey) {
  //   menu?.children?.map(subMenu => {
  //     if (subMenu.key == currentMenuKey) initExpandTree = true
  //   })
  // }

  return (
    <div className={`${isParent ? "menu-dropdown nav-tabs-custom" : ""}`}>
      <MenuDropdownRow
        menu={menu}
        navURL={navURL}
        index={keyName + main_index}
        keyName={keyName}
        icon={icon}
        showIcon={isParent}
        showCollapse={true}
        isLoading={isLoading}
        iconCollapse={isExpand ? "fas fa-chevron-down" : "fas fa-chevron-right"}
        handleClick={handleClick}
        iconCustom={iconCustom}
        isAdmin={isAdmin ?? (type === "admin" || type === "setting")}
        isChildren={isChildren}
        initExpand={initExpand}
      />

      <ul className={`collapse menu-collapse ms-2${isExpand ? " show" : ""}`} id={keyName}>
        {isSearch && (
          <li className={"nav-item"}>
            <Input onKeyDown={onKeyDown} placeholder={t("common.common_search")} />
          </li>
        )}
        {subMenus &&
          typeof subMenus !== "boolean" &&
          subMenus.length !== 0 &&
          subMenus.map((menu, index) => {
            return (
              <li key={index} className={"nav-item mt-1"}>
                {menu?.children?.length > 0 ? (
                  <MenuDropdown
                    menu={menu}
                    showIcon={false}
                    index={keyName + "_" + main_index + "_" + index}
                    type={type}
                    menus={menu?.children}
                    apiGetSubMenu={apiGetSubMenu}
                    isChildren={true}
                    isAdmin={isAdmin}
                    apiReturnGetField={apiReturnGetField}
                    currentMenuKey={currentMenuKey}
                    paddingLeftDropDownRow={paddingLeftDropDownRow + 6}
                  />
                ) : (
                  <MenuDropdownRow
                    menu={menu}
                    navURL={navURL}
                    index={keyName + "_" + index}
                    showIcon={false}
                    isAdmin={
                      isAdmin ?? (type === "admin" || type === "setting" || type === "settings")
                    }
                    isChildren={true}
                    initExpand={initExpand}
                    paddingLeftDropDownRow={paddingLeftDropDownRow}
                  />
                )}
              </li>
            )
          })}
      </ul>
    </div>
  )
}

export default MenuDropdown
