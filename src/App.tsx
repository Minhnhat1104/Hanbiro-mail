// @ts-nocheck
import PropTypes from "prop-types"
import React, { Suspense, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Route, Routes, useNavigate } from "react-router-dom"
import { loginSuccess, setSocketCount, setSocketData } from "store/actions"
import { getConfig } from "store/auth/config/actions"
import { layoutTypes } from "./constants/layout"
// Import socket service
import { isValidHostname, setBaseHost } from "utils"

// Import Routes all
import {
  authProtectedRoutes,
  lazyProtectedRoutes,
  publicRoutes,
  routesForNewWindow,
} from "./routes"

// Import all middleware
import Authmiddleware from "./routes/route"

// layouts Format
import NewWindowWrapper from "components/Common/NewWindowWrapper"
import TranslatorTool from "components/Common/TranslatorTool"
import { HAN_API_ERROR_MESSAGE } from "constants/api"
import { MAIL_REDUX_PERSIST_STORE } from "constants/setting"
import useLocalStorage from "hooks/useLocalStorage"
import { setIframeMode, setRefreshList } from "store/viewMode/actions"
import "toastr/build/toastr.min.css"
import Cookies from "universal-cookie"
import HorizontalLayout from "./components/HorizontalLayout"
import MainContainer from "./components/MainContainer"
import NonAuthLayout from "./components/NonAuthLayout"
import VerticalLayout from "./components/VerticalLayout"

const getLayout = (layoutType) => {
  let Layout = VerticalLayout
  switch (layoutType) {
    case layoutTypes.VERTICAL:
      Layout = VerticalLayout
      break
    case layoutTypes.HORIZONTAL:
      Layout = HorizontalLayout
      break
    default:
      break
  }
  return Layout
}

const RouteWithSidebar = ({ layout: Layout, route }) => {
  const { component: Component, ...rest } = route
  let routeType = "list"
  if (route?.path.indexOf("/setting") != -1) {
    routeType = "setting"
  } else if (route?.path.indexOf("/admin") != -1) {
    routeType = "admin"
  }

  return (
    <Authmiddleware>
      <Layout route={route}>
        <MainContainer routeType={routeType}>
          <Suspense>
            <Component routeConfig={rest} />
          </Suspense>
        </MainContainer>
      </Layout>
    </Authmiddleware>
  )
}

const App = () => {
  const dispatch = useDispatch()
  const history = useNavigate()

  const { layoutType } = useSelector((state) => ({
    layoutType: state.Layout.layoutType,
  }))
  const isLoggedIn = useSelector((state) => state.Login.isLoggedIn)
  const isIframeMode = useSelector((state) => state.viewMode.isIframeMode)

  const [apiErrorMessage, setApiErrorMessage] = useLocalStorage(HAN_API_ERROR_MESSAGE, null)

  const Layout = getLayout(layoutType)

  const [clickedText, setClickedText] = useState("")
  const [contextPosition, setContextPosition] = useState(null)

  const rootConfig = useSelector((state) => state.Config)
  const isTranslator = rootConfig?.globalConfig?.translator

  useEffect(() => {
    const handleClick = (event) => {
      event.preventDefault()
      let target = event.target
      if (
        !target.classList?.contains("language-popup") &&
        target.innerText &&
        isNaN(Number(target.innerText)) &&
        !target.classList.contains("MuiBadge-badge")
      ) {
        setClickedText(target.innerText || "")
        setContextPosition({ top: event.clientY, left: event.clientX })
      }
    }

    if (isTranslator) {
      window.addEventListener("contextmenu", handleClick)
    }

    return () => {
      if (isTranslator) {
        window.removeEventListener("contextmenu", handleClick)
      }
    }
  }, [rootConfig])

  // const onConnect = (res) => {
  //   console.log("socket res ==> ", res)
  //   if (res?.menu === "mail" && newMailData?.docuId !== res.docuId) {
  //     dispatch(setSocketData(res))
  //     dispatch(setSocketCount(1))
  //   }
  // }
  useEffect(() => {
    if (isLoggedIn) {
      dispatch(getConfig())
      apiErrorMessage && setApiErrorMessage(null)
    }
    checkIframeMode()
  }, [isLoggedIn])

  useEffect(() => {
    const host = localStorage.getItem("host")
    if (!host || !isValidHostname(host)) {
      setBaseHost(location.host)
    }

    const cookies = new Cookies()
    if (cookies.get("HANBIRO_GW") && cookies.get("hmail_key")) {
      dispatch(loginSuccess())
      // dispatch(getConfig())
    } else {
      history("/login")
    }

    // dispatch(checkCookies(history))
    dispatch(setSocketCount(0))
    dispatch(setSocketData(null))

    // clear redux perist store when reload page
    return () => {
      localStorage.removeItem(MAIL_REDUX_PERSIST_STORE)
    }
  }, [])

  // useEffect(() => {
  //   if (userData?.id) {
  //     const socket = ServiceSocket({ userData: userData })
  //     socket.off("newAlarm", onConnect).on("newAlarm", onConnect)
  //   }
  // }, [userData])

  useEffect(() => {
    if (isIframeMode) {
      window.parent.postMessage({ type: "iframeMailUrl", url: document.location.href }, "*")
    }
  }, [document.location.href])

  useEffect(() => {
    // Listen for messages from the parent window
    const messageHandler = (event) => {
      const receivedData = event.data
      if (receivedData?.type === "urlMailIframe") {
        history(receivedData?.url)
      }
      if (receivedData?.type === "newWinDowMess") {
        if (receivedData?.data?.refreshList) {
          dispatch(setRefreshList(true))
        }
      }
    }
    window.addEventListener("message", messageHandler)
    return () => {
      window.removeEventListener("message", messageHandler)
    }
  }, [])

  const checkIframeMode = () => {
    const isLoadedInIframe = window.frameElement !== null
    if (isLoadedInIframe) {
      dispatch(setIframeMode(true))
    } else {
      dispatch(setIframeMode(false))
    }
  }

  return (
    <React.Fragment>
      <Routes>
        {publicRoutes.map((route, idx) => (
          <Route
            path={route.path}
            element={<NonAuthLayout>{route.component}</NonAuthLayout>}
            key={idx}
            exact={true}
          />
        ))}

        {authProtectedRoutes.map((route, idx) => (
          <Route
            path={route.path}
            element={
              <Authmiddleware>
                <Layout>
                  <MainContainer>{route.component}</MainContainer>
                </Layout>
              </Authmiddleware>
            }
            key={idx}
            exact={true}
          />
        ))}
        {lazyProtectedRoutes.map((route, idx) => (
          <Route
            path={route.path}
            element={<RouteWithSidebar layout={Layout} route={route} />}
            key={idx}
            exact={true}
          />
        ))}

        {routesForNewWindow.map((route, idx) => (
          <Route
            path={route.path}
            element={
              <Authmiddleware>
                <NewWindowWrapper>
                  <Suspense>
                    <route.component />
                  </Suspense>
                </NewWindowWrapper>
              </Authmiddleware>
            }
            key={idx}
            exact={true}
          />
        ))}
      </Routes>
      {isTranslator && (
        <TranslatorTool
          text={clickedText}
          position={contextPosition}
          setContextPosition={setContextPosition}
        />
      )}
    </React.Fragment>
  )
}

App.propTypes = {
  layout: PropTypes.any,
}

export default App
