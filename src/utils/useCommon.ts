// @ts-nocheck
import { selectUserConfig, selectGlobalConfig } from "store/auth/config/selectors"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"

function useCommon(menu = "mail") {
  const userData = useSelector(selectUserConfig)
  const globalConfig = useSelector(selectGlobalConfig)
  const [isAdminMenu, setIsAdminMenu] = useState(false)
  const [interfaceConfig, setInterfaceConfig] = useState({})

  useEffect(() => {
    const menuAdmin = userData?.menu_admin ?? []
    const menuAdminGlobal = userData?.menu_admin_global ?? false
    const isAdminMenuCondition = Boolean(
      (menuAdmin && menuAdmin.length > 0 && menuAdmin.indexOf(menu) >= 0) || menuAdminGlobal,
    )
    setIsAdminMenu(isAdminMenuCondition)
  }, [userData?.menu_admin, userData?.menu_admin_global])

  useEffect(() => {
    setInterfaceConfig(globalConfig?.interface)
  }, [globalConfig?.interface])

  return {
    isAdminMenu,
    interfaceConfig,
  }
}

export default useCommon
