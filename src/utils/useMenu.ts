// @ts-nocheck
import {
  selectBasicMenus,
  selectFolderMenus,
  selectSpecialMenus,
  selectExtMenus,
  selectDisableList,
  selectShareMenus,
  selectAllMenus,
} from "store/emailConfig/selectors"
import { useSelector } from "react-redux"
function useMenu() {
  const basicMenus = useSelector(selectBasicMenus)
  const folderMenus = useSelector(selectFolderMenus)
  const specialMenus = useSelector(selectSpecialMenus)
  const extMenus = useSelector(selectExtMenus)
  const disableList = useSelector(selectDisableList)
  const shareMenus = useSelector(selectShareMenus)
  const allMenus = useSelector(selectAllMenus)
  // let extMenus = []
  // let disableList = []
  return {
    basicMenus,
    folderMenus,
    specialMenus,
    extMenus,
    disableList,
    shareMenus: shareMenus ?? [],
    allMenus,
  }
}

export default useMenu
