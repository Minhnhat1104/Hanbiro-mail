// @ts-nocheck
import withRouter from "components/Common/withRouter"
import useDevice from "hooks/useDevice"
import queryString from "query-string"
import React, { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { Button } from "reactstrap"
import { setIsBackToList } from "store/mailList/actions"
import useMenu from "utils/useMenu"

function BackButton(props) {
  const { router, classNames } = props
  const { t } = useTranslation()
  // Button back to previous list page
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { isMobile } = useDevice()

  const queryParams = useSelector((state) => state.QueryParams.query)
  const prevMenu = useSelector((state) => state.viewMode.accessMenu)
  // const currentMenu = useSelector((state) => state.viewMode.currentMenu)

  const { basicMenus, folderMenus, shareMenus } = useMenu()
  const [title, setTitle] = useState("Inbox")
  // Get all title of menu
  const allTitle = useMemo(() => {
    let obj = {}
    let allMenu = [...basicMenus, ...folderMenus, ...shareMenus]
    allMenu.map((menu) => {
      obj[menu.key] = menu.name
    })
    return obj
  }, [basicMenus, folderMenus, shareMenus])

  // Set title for each menu
  useEffect(() => {
    let title = ""
    if (allTitle[router?.params?.menu]) {
      title = allTitle[router?.params?.menu]
    }
    if (router?.params?.menu == "all") {
      title = t("mail.mail_all_mailboxes")
    }
    setTitle(title)
  }, [router?.params?.menu, allTitle])

  const handleNavigate = () => {
    const path = `/mail/list/${
      prevMenu ? prevMenu?.key : router?.params?.menu
    }?${queryString.stringify(queryParams)}`
    navigate(path)
    dispatch(setIsBackToList(true))
  }

  return (
    <Button
      onClick={handleNavigate}
      outline
      color="grey"
      className={`d-flex px-2 py-1 btn-action ${classNames}`}
      style={{ height: "fit-content" }}
    >
      <i className="mdi mdi-arrow-left font-size-14"></i>
      {/* <p className="m-0 page-title px-2">{title}</p> */}
    </Button>
  )
}

export default withRouter(BackButton)
