// @ts-nocheck
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"

import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { Card, Container } from "reactstrap"

import BaseButtonTooltip from "components/Common/BaseButtonTooltip"
import ComposeMail from "components/Common/ComposeMail"
import withRouter from "components/Common/withRouter"
import { isObject } from "utils"
import useMenu from "utils/useMenu"

import {
  closeComposeMail,
  forceUpdateComposeData,
  updateLocalComposeMode,
} from "store/composeMail/actions"
import {
  getEmailConfig,
  getEmailExcludeList,
  getEmailLangList,
  setEmailConfig,
} from "store/emailConfig/actions"

import {
  composeDisplayModeOptions,
  LOCALSTORAGE_COMPOSE_DISPLAY_MODE,
} from "components/Common/ComposeMail/ComposeCenter"
import { menuAll } from "constants/sidebar"
import { THEME_OPTIONS, THEME_SIDEBAR_OPTIONS, THEME_STORAGE_KEY } from "constants/theme"
import useDevice from "hooks/useDevice"
import useLocalStorage from "hooks/useLocalStorage"
import { differenceWith, isEqual } from "lodash"
import queryString from "query-string"
import { setSidebarCount, setSocketCount, setSocketData, setSocketMenuData } from "store/actions"
import { selectUserData, selectUserMailSetting } from "store/auth/config/selectors"
import { setIsDetailView } from "store/mailDetail/actions"
import { setQueryParams } from "store/mailList/actions"
import { setAccessMenu, setCurrentMenu } from "store/viewMode/actions"
import { socket } from "utils/serviceSocket"
import { setCountFolderMenu } from "utils/sidebar"
import i18n from "../../i18n"
import "./style.scss"

const HANBIRO_LANG = "hanbiro-lang"

const MainContainer = (props) => {
  const { routeType, router } = props

  const dispatch = useDispatch()
  const { t } = useTranslation()

  const { isTablet, isMobile } = useDevice()
  const { allMenus, shareMenus } = useMenu()

  // redux state
  const userData = useSelector(selectUserData)
  const isLoggedIn = useSelector((state) => state.Login.isLoggedIn)
  const newMailData = useSelector((state) => state.Socket.data)
  const isIframeMode = useSelector((state) => state.viewMode.isIframeMode)
  const composeMails = useSelector((state) => state.ComposeMail.composeMails)
  const sidebarCount = useSelector((state) => state.Socket.sidebarCount)
  const emailConfig = useSelector((state) => state.EmailConfig)
  const isDetailView = useSelector((state) => state.mailDetail.isDetailView)
  const userLang = useSelector((state) => state.Config?.userConfig?.lang)
  const isSplitMode = useSelector((state) => state.viewMode.isSplitMode)
  const userMailSetting = useSelector(selectUserMailSetting)
  const emailConfigRef = useRef(emailConfig)

  const [themeMode, setThemeMode] = useLocalStorage(THEME_STORAGE_KEY.theme, THEME_OPTIONS[0].value)
  const [sidebarMode, setSidebarMode] = useLocalStorage(
    THEME_STORAGE_KEY.sidebar,
    THEME_SIDEBAR_OPTIONS[0].value,
  )
  const [hanbiroLang, setHanbiroLang] = useLocalStorage(HANBIRO_LANG, "en")
  const [composeDisplayMode, setComposeDisplayMode] = useLocalStorage(
    LOCALSTORAGE_COMPOSE_DISPLAY_MODE,
    composeDisplayModeOptions.EXPAND,
  )

  const limit = useMemo(() => {
    return userMailSetting?.items_per_page ?? 20
  }, [userMailSetting?.items_per_page])

  const initFilter = useMemo(() => {
    const isSearchBox = !["Secure", "Receive", "Spam"].includes(router?.params?.menu)
    return {
      acl: router?.params?.menu,
      act: "maillist",
      mailsort: "date",
      sortkind: "0",
      timemode: "mobile",
      viewcont: `0,${limit}`,
      ...(isSearchBox ? { searchbox: router?.params?.menu } : {}),
    }
  }, [limit, router?.params?.menu])

  useEffect(() => {
    if (isMobile && composeMails?.data?.length > 0) {
      const nComposeData = composeMails.data.filter(
        (item) => item.composeMode !== composeDisplayModeOptions.MINIMIZE,
      )
      if (nComposeData.length > 0) {
        dispatch(
          forceUpdateComposeData([
            { ...nComposeData[0], composeMode: composeDisplayModeOptions.EXPAND },
          ]),
        )
      } else {
        dispatch(
          forceUpdateComposeData([
            { ...composeMails.data[0], composeMode: composeDisplayModeOptions.EXPAND },
          ]),
        )
      }
    }
  }, [isMobile])

  useEffect(() => {
    if (isDetailView) {
      dispatch(setIsDetailView(false))
    }
    dispatch(updateLocalComposeMode(composeDisplayMode))
  }, [])

  useEffect(() => {
    if (location.search) {
      const searchParams = queryString.parse(location.search)
      dispatch(setQueryParams(searchParams))
    }

    dispatch(getEmailConfig())
    dispatch(getEmailExcludeList())
  }, [])

  useEffect(() => {
    console.log(" emailConfig?.extMenus?.isllm:", emailConfig?.extMenus)
    if (emailConfig?.extMenus?.isllm) {
      dispatch(getEmailLangList())
    }
  }, [emailConfig?.extMenus?.isllm])

  useEffect(() => {
    if (router?.params?.menu) {
      const menuItem = [...allMenus, ...shareMenus]?.find(
        (item) => item?.key === router?.params?.menu,
      )
      dispatch(
        !!menuItem
          ? setCurrentMenu({
              key: menuItem.key,
              title: menuItem.name,
            })
          : setCurrentMenu(menuAll),
      )
      if (isSplitMode) {
        if (!location.search) {
          dispatch(setQueryParams(initFilter))
        }
      }
    }
  }, [router?.params?.menu])

  useEffect(() => {
    if (router?.params?.menu) {
      const menuItem = [...allMenus, ...shareMenus]?.find(
        (item) => item?.key === router?.params?.menu,
      )
      dispatch(
        !!menuItem
          ? setAccessMenu({
              key: menuItem.key,
              title: menuItem.name,
            })
          : setAccessMenu(menuAll),
      )
    }
  }, [])

  useEffect(() => {
    emailConfigRef.current = emailConfig
  }, [emailConfig])

  useEffect(() => {
    if (isIframeMode) {
      i18n.changeLanguage(userLang)
      setHanbiroLang(userLang)
    }
  }, [userLang])

  useEffect(() => {
    if (sidebarCount) {
      updateMenuCount(sidebarCount)
    }
  }, [sidebarCount])

  // State for button to the top
  const [goToTop, setGoToTop] = useState(false)
  const handleToTop = () => {
    setGoToTop(window.scrollY >= 350)
  }
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" }) // Scroll to top with smooth animation
  }
  useEffect(() => {
    window.addEventListener("scroll", handleToTop)
    return () => {
      window.removeEventListener("scroll", handleToTop)
    }
  }, [])

  // socket count
  const onUpdateMailSidebar = (res, emailConfig) => {
    const count = res?.detail?.mail
    if (!isEqual(count, sidebarCount)) {
      let getMenuChange = differenceWith(count, sidebarCount, isEqual)
      if (getMenuChange.length > 0) {
        getMenuChange = getMenuChange[0]
        let menuChange = emailConfig?.allMenus?.filter((menu) => menu.key === getMenuChange[0])
        dispatch(setSocketMenuData(menuChange?.[0] ?? null))
      }

      dispatch(setSidebarCount(count))
      // updateMenuCount(count)
    }
  }

  const updateMenuCount = (count) => {
    let nCount = {}
    count?.forEach((item) => {
      nCount[item[0]] = item[1]
    })
    const nBasicMenus = emailConfig?.basicMenus?.map((menu) => ({
      ...menu,
      new: nCount[menu?.key],
    }))
    const nFolderMenus = setCountFolderMenu(emailConfig?.folderMenus, nCount)
    const nShareMenus = emailConfig?.shareMenus?.map((menu) => ({
      ...menu,
      new: nCount[menu?.key],
    }))
    dispatch(
      setEmailConfig({
        ...emailConfig,
        basicMenus: nBasicMenus,
        folderMenus: nFolderMenus,
        shareMenus: nShareMenus,
      }),
    )
  }

  const onConnect = (res) => {
    console.log("new alarm ==> ", res)
    if (res?.menu === "mail" && newMailData?.docuId !== res.docuId) {
      dispatch(setSocketData(res))
      dispatch(setSocketCount(1))
    }
  }

  const handleNewCount2 = useCallback(
    (res) => {
      onUpdateMailSidebar(res, emailConfigRef.current)
    },
    [emailConfigRef.current],
  )

  useEffect(() => {
    if (!userData?.id) return

    socket.connect()

    const onSocketConnect = () => {
      socket.emit("userinfo", {
        userid: userData?.id,
        usercn: userData?.cn,
        userno: userData?.no,
        token: "",
      })
      console.log("Socket connected!")
    }

    socket.on("connect", onSocketConnect)

    return () => {
      socket.off("connect", onSocketConnect)
      socket.disconnect()
    }
  }, [userData?.id])

  useEffect(() => {
    socket.on("newAlarm", onConnect)
    socket.on("newcount2", handleNewCount2)

    return () => {
      console.log("clean up function")
      socket.off("newAlarm", onConnect)
      socket.off("newcount2", handleNewCount2)
    }
  }, [])

  const allTitle = useMemo(() => {
    let obj = {}
    let allMenu = [...emailConfig?.basicMenus, ...emailConfig?.folderMenus]
    allMenu.map((menu) => {
      obj[menu.key] = menu.name
    })

    return obj
  }, [emailConfig?.basicMenus, emailConfig?.folderMenus])
  const [title, setTitle] = useState("Inbox")

  // Handle close Compose Mail Modal
  const handleCloseComposeMail = (composeId) => {
    dispatch(closeComposeMail(composeId))
  }

  // Handle change sidebar theme
  const onChangeSidebarMode = (sidebarMode) => {
    setSidebarMode(sidebarMode.value)
    if (document.body) {
      document.body.setAttribute(THEME_STORAGE_KEY.sidebar, sidebarMode.value)
    }
  }

  useEffect(() => {
    if (isIframeMode) {
      if (sidebarMode) {
        onChangeSidebarMode(
          THEME_SIDEBAR_OPTIONS.find((option) => option.value === sidebarMode) ||
            THEME_SIDEBAR_OPTIONS[0],
        )
      } else {
        onChangeSidebarMode(THEME_SIDEBAR_OPTIONS[0])
      }
    }
  }, [sidebarMode])

  // Handle change theme
  const onChangeTheme = (themeMode) => {
    setThemeMode(themeMode.value)
    if (document.body) {
      document.body.setAttribute("data-theme-mode", themeMode.value)
    }
  }

  useEffect(() => {
    if (isIframeMode) {
      if (themeMode) {
        onChangeTheme(
          THEME_OPTIONS.find((option) => option.value === themeMode) || THEME_OPTIONS[0],
        )
      } else {
        onChangeTheme(THEME_OPTIONS[0])
      }
    }
  }, [themeMode])

  useEffect(() => {
    let title = ""
    if (allTitle[router?.params?.menu]) title = allTitle[router?.params?.menu]
    if (router?.params?.menu == "all") {
      title = t("mail.mail_all_mailboxes")
    }

    //meta title
    document.title = title
    setTitle(title)
  }, [router?.params?.menu, allTitle])

  useEffect(() => {
    let wrappers = document.querySelectorAll(".compose-mail-wrapper")

    if (wrappers.length >= 2) {
      let last = wrappers[wrappers.length - 1]
      let secondLast = wrappers[wrappers.length - 2]

      if (!last.querySelector(".compose-modal-minimize")) {
        let target = secondLast.querySelector(".compose-modal-minimize .total-hidden-compose")
        if (target) {
          target.style.display = "flex"
        }
      } else {
        let targetLast = last.querySelector(".compose-modal-minimize .total-hidden-compose")
        if (targetLast) {
          targetLast.style.display = "flex"
        }
        let targetSecond = secondLast.querySelector(".compose-modal-minimize .total-hidden-compose")
        if (targetSecond) {
          targetSecond.style.display = "none"
        }
      }
    }
  }, [composeMails?.data])

  return (
    <React.Fragment>
      <div
        className={`${
          isMobile
            ? isDetailView
              ? "page-content-mobile pt-0"
              : "page-content-mobile"
            : "page-content"
        } 
        ${isIframeMode ? "pt-0" : ""}
        ${
          isObject(router?.params) && Object.keys(router?.params)?.length > 0
            ? "vh-100" // for list mail and view mail
            : "vh-100" // for settings and admin
        }`}
      >
        <Container fluid className="h-100 px-0">
          <div className="h-100">
            {/* Render Email SideBar */}
            {routeType !== "list" ? (
              <div
                className={`list-type overflow-x-hidden${
                  routeType !== "list" && (isTablet || isMobile) ? " overflow-y-auto" : ""
                }`}
              >
                {isMobile || isTablet ? (
                  <div className="card-wrapper h-100">
                    <Card className={"card p-3 border-0 overflow-hidden"}>{props.children}</Card>
                  </div>
                ) : (
                  <Card className={"card p-3 border-0 overflow-hidden"}>{props.children}</Card>
                )}
              </div>
            ) : (
              <div className={`list-type overflow-x-hidden`}>
                {isMobile || isTablet ? (
                  <div className="card-wrapper h-100">{props.children}</div>
                ) : (
                  <>{props.children}</>
                )}
              </div>
            )}
          </div>
        </Container>

        {/* --- Compose Mail --- */}
        <div className="multiple-compose-mail">
          {composeMails.data?.length > 0 &&
            composeMails.data
              .filter((_, index) => index < (isTablet ? 2 : 3))
              .map((compose) => (
                <ComposeMail
                  key={compose.id}
                  composeId={compose.id}
                  handleClose={() => handleCloseComposeMail(compose.id)}
                  mid={compose.mid}
                  modeType={compose.modeType}
                  composeMode={compose.composeMode}
                  titleCompose={compose.titleCompose}
                  uuids={compose.uuids}
                  shareId={compose.shareId}
                  selectedMails={compose.selectedMails}
                  toAddress={compose.toAddress}
                  listMail={compose.listMail}
                />
              ))}
        </div>

        {goToTop && (
          <BaseButtonTooltip
            title={t("mail.mail_signature_top")}
            id="go-to-top-button"
            className="go-to-top-button border-0 bg-transparent text-muted py-1 px-2"
            iconClassName="me-0 fs-1"
            icon="mdi mdi-arrow-up-bold-circle"
            onClick={scrollToTop}
          />
        )}
      </div>
    </React.Fragment>
  )
}

export default withRouter(MainContainer)
