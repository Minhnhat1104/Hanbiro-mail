// @ts-nocheck
import PropTypes from "prop-types"
import React, { useEffect, useMemo } from "react"

import { connect, useDispatch, useSelector } from "react-redux"
import { useParams, useSearchParams } from "react-router-dom"
// MetisMenu
// Reactstrap

// Import menuDropdown
import LanguageDropdown from "../CommonForBoth/TopbarDropdown/LanguageDropdown"
import ProfileMenu from "../CommonForBoth/TopbarDropdown/ProfileMenu"

//i18n
import { useTranslation, withTranslation } from "react-i18next"

// Redux Store
import { BaseIcon, SearchInput } from "components/Common"
import useDevice from "hooks/useDevice"
import FilterToolbar from "pages/List/FilterToolbar"
import BackButton from "pages/Main/BackButton"
import PermitFilterToolbar from "pages/PermitMail/PermitFilterToolbar"
import { setQueryParams, setSearchKeywork } from "store/mailList/actions"
import { setRefreshList, setShowSidebar } from "store/viewMode/actions"
import { changeSidebarType, showRightSidebarAction, toggleLeftmenu } from "../../store/actions"
import useLocalStorage from "hooks/useLocalStorage"
import { THEME_OPTIONS, themeModeTypes } from "constants/theme"
import ThemeButton from "components/CommonForBoth/ThemeButton"
import i18n from "../../i18n"

const Header = (props) => {
  const params = useParams()
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const { isTablet, isMobile, isVerticalTablet, isDesktop } = useDevice()

  const isMobileFilter = isMobile || isVerticalTablet

  // redux state
  const socketCount = useSelector((state) => state.Socket.count)
  const isIframeMode = useSelector((state) => state.viewMode.isIframeMode)
  const isSplitMode = useSelector((state) => state.viewMode.isSplitMode)
  const isShowSidebar = useSelector((state) => state.viewMode.isShowSidebar)
  const currentMenu = useSelector((state) => state.viewMode.currentMenu)
  const isDetailView = useSelector((state) => state.mailDetail.isDetailView)
  const isPermitDetailView = useSelector((state) => state.mailDetail.isPermitDetailView)
  const queryParams = useSelector((state) => state.QueryParams.query)

  const [searchParams, setSearchParams] = useSearchParams()

  // ----- Using for iframe > Start -----
  // const [themeMode, setThemeMode] = useLocalStorage("theme-mode", THEME_OPTIONS[0].value)

  // Handle change theme
  // const onChangeTheme = (themeMode) => {
  //   setThemeMode(themeMode.value)
  //   if (document.body) {
  //     document.body.setAttribute("data-theme-mode", themeMode.value)
  //   }
  // }
  //
  // useEffect(() => {
  //   if (isIframeMode) {
  //     if (themeMode) {
  //       onChangeTheme(
  //         THEME_OPTIONS.find((option) => option.value === themeMode) || THEME_OPTIONS[0],
  //       )
  //     } else {
  //       onChangeTheme(THEME_OPTIONS[0])
  //     }
  //   }
  // }, [themeMode])
  // ----- Using for iframe > End -----

  const isSettingPage = useMemo(() => {
    return isTablet || isMobile
      ? location.pathname.includes("/setting/") || location.pathname.includes("/admin/")
      : currentMenu?.key === "setting" || currentMenu?.key === "admin"
  }, [currentMenu])

  const menu = useMemo(() => {
    return params?.menu
  }, [params?.menu])

  const isHideFilterToolbar = useMemo(() => {
    return params?.["*"] !== ""
  }, [menu, params?.["*"]])

  const toggleSidebar = () => {
    dispatch(setShowSidebar(!isShowSidebar))
  }

  return (
    <React.Fragment>
      <header id="page-topbar">
        <div className="navbar-header">
          <div className="d-flex">
            {/* sidebar button */}
            {(isTablet || isMobile) && (
              <button
                type="button"
                onClick={() => {
                  toggleSidebar()
                }}
                className="btn btn-sm px-3 font-size-16 header-item "
                id="vertical-menu-btn"
              >
                <i className="fa fa-fw fa-bars" />
              </button>
            )}

            {/* page title */}
            {/*<div className="d-flex align-items-center">*/}
            {/*  /!* <span className={`ms-${!isDesktop ? "0" : "4"} fs-4 fw-semibold text-nowrap`}>*/}
            {/*    {currentMenu?.parentTitle ? t(currentMenu?.parentTitle) : t(currentMenu?.title)}*/}
            {/*  </span> *!/*/}
            {/*  <span*/}
            {/*    className={`han-h2 han-fw-semibold han-text-primary${isDesktop ? " ms-4" : ""}`}*/}
            {/*  >*/}
            {/*    {currentMenu?.parentTitle ? t(currentMenu?.parentTitle) : currentMenu?.title}*/}
            {/*  </span>*/}
            {/*  {(isDetailView || isPermitDetailView) && !isSplitMode ? <BackButton /> : null}*/}
            {/*</div>*/}
          </div>

          {/* filter and search */}
          {/* {menu === "Approval" && (
            <div
              className={`flex-grow-1 d-flex align-items-center ${
                isHideFilterToolbar
                  ? "justify-content-start"
                  : isVerticalTablet
                  ? "justify-content-end"
                  : "justify-content-center"
              }`}
            >
              {!isHideFilterToolbar && !isSettingPage ? (
                <>
                  {isVerticalTablet ? (
                    <div className="d-flex">
                      <SearchInput
                        className={""}
                        initialData={
                          searchParams.get("keyword") ??
                          searchParams.get("f") ??
                          searchParams.get("t") ??
                          searchParams.get("c")
                        }
                        onSubmit={(keywork) => {
                          dispatch(setSearchKeywork(keywork))
                        }}
                      />
                    </div>
                  ) : (
                    <>{!isMobile && <PermitFilterToolbar menu={menu} />}</>
                  )}
                </>
              ) : !isSettingPage ? (
                <BackButton />
              ) : null}
            </div>
          )} */}
          {/* {menu !== "Approval" && (
            <div
              className={`d-flex flex-grow-1 align-items-center ${
                isHideFilterToolbar
                  ? "justify-content-start"
                  : isVerticalTablet
                  ? "justify-content-end"
                  : "justify-content-center"
              }`}
            >
              {(isSplitMode || !isHideFilterToolbar) && !isSettingPage ? (
                <>
                  {isVerticalTablet ? (
                    <>
                      {menu === "Secure" || menu === "Receive" ? (
                        <FilterToolbar menu={menu} isOnlySearch={true} />
                      ) : (
                        <div className="d-flex">
                          <SearchInput
                            className={""}
                            initialData={
                              searchParams.get("keyword") ??
                              searchParams.get("f") ??
                              searchParams.get("t") ??
                              searchParams.get("c")
                            }
                            onSubmit={(keywork) => {
                              dispatch(setSearchKeywork(keywork))
                            }}
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <>{!isMobile && <FilterToolbar menu={menu} />}</>
                  )}
                </>
              ) : !isSettingPage ? (
                <BackButton />
              ) : null}
            </div>
          )} */}

          <div className="d-flex align-items-center gap-2">
            {/* search input */}
            {/*{!isMobile && (*/}
            {/*  <div className="d-flex">*/}
            {/*    <SearchInput*/}
            {/*      initialData={searchParams.get("keyword") ?? ""}*/}
            {/*      onSubmit={(keywork) => {*/}
            {/*        const nParams = {*/}
            {/*          ...queryParams,*/}
            {/*          keyword: keywork,*/}
            {/*          searchfild: !!queryParams?.searchfild ? queryParams?.searchfild : "all",*/}
            {/*        }*/}
            {/*        dispatch(setQueryParams(nParams))*/}
            {/*      }}*/}
            {/*    />*/}
            {/*  </div>*/}
            {/*)}*/}
            {/* theme setting */}
            {!isMobile && <div className="d-flex">{!isIframeMode && <ThemeButton />}</div>}

            {/* refresh */}
            {isMobile && (
              <BaseIcon
                icon={"mdi mdi-refresh px-3 font-size-24 text-secondary"}
                onClick={() => {
                  dispatch(setRefreshList(true))
                }}
              />
            )}
            {/* language */}
            {!isIframeMode && (
              <>
                <LanguageDropdown />
                {socketCount > 0 && (
                  <div className="d-flex align-items-center btn header-item noti-icon position-relative">
                    <i className="bx bx-bell bx-tada" />
                    <span className="badge bg-danger rounded-pill">{socketCount}</span>
                  </div>
                )}
              </>
            )}

            {/* profile */}
            {!isIframeMode && <ProfileMenu isIframeMode={isIframeMode} />}
          </div>
        </div>
      </header>
    </React.Fragment>
  )
}

Header.propTypes = {
  changeSidebarType: PropTypes.func,
  leftMenu: PropTypes.any,
  leftSideBarType: PropTypes.any,
  showRightSidebar: PropTypes.any,
  showRightSidebarAction: PropTypes.func,
  t: PropTypes.any,
  toggleLeftmenu: PropTypes.func,
}

const mapStatetoProps = (state) => {
  const { layoutType, showRightSidebar, leftMenu, leftSideBarType } = state.Layout
  return { layoutType, showRightSidebar, leftMenu, leftSideBarType }
}

export default connect(mapStatetoProps, {
  showRightSidebarAction,
  toggleLeftmenu,
  changeSidebarType,
})(withTranslation()(Header))
