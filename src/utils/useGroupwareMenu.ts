// @ts-nocheck
import { selectMenuConfig } from "store/auth/config/selectors"
import { useMemo, useState } from "react"
import { useSelector } from "react-redux"

function useGroupwareMenu() {
  const menuConfig = useSelector(selectMenuConfig)
  const [useHelpDesk, setUseHelpDesk] = useState(false)
  const [useNewProject, setUseNewProject] = useState(false)
  const [useTodo, setUseTodo] = useState(false)
  const [useCalendar, setUseCalendar] = useState(false)

  useMemo(() => {
    menuConfig.map((menu) => {
      if (menu.name === "helpdesk") setUseHelpDesk(true)
      if (menu.name === "projectnew") setUseNewProject(true)
      if (menu.name === "todo") setUseTodo(true)
      if (menu.name === "calendar" || menu.name === "calendarnew") setUseCalendar(true)
    })
  }, [menuConfig])

  const checkMenuAvailable = (menuKey) => {
    return menuConfig.some((menu) => menu.name === menuKey)
  }

  return {
    useHelpDesk,
    useNewProject,
    useTodo,
    useCalendar,
    checkMenuAvailable,
  }
}

export default useGroupwareMenu
