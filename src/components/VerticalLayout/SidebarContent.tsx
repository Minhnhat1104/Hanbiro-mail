// @ts-nocheck
import { Divider } from "@mui/material"
import PropTypes from "prop-types"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import SimpleBar from "simplebar-react"

import withRouter from "components/Common/withRouter"
import { Link } from "react-router-dom"

import { useTranslation, withTranslation } from "react-i18next"

import { BaseButton, BaseIcon } from "components/Common"
import ModalConfirm from "components/Common/Modal/ModalConfirm"

import { getEmailFolder, getEmailShareBox, postMailToHtml5 } from "modules/mail/common/api"
import useCommon from "utils/useCommon"
import useMenu from "utils/useMenu"
import MenuDropdown from "./MenuDropdown"

import { openComposeMail } from "store/composeMail/actions"

import { composeDisplayModeOptions } from "components/Common/ComposeMail/ComposeCenter"
import { useCustomToast } from "hooks/useCustomToast"
import useDevice from "hooks/useDevice"
import { AdminRoutes, SettingRoutes } from "routes"
import { composeDataDefaults } from "store/composeMail/reducer"
import { setEmailConfig } from "store/emailConfig/actions"
import { setCurrentMenu, setRefreshList, setShowSidebar } from "store/viewMode/actions"
import { formatAdminMenu, formatSettingMenu, updateFolderMenus } from "utils/sidebar"
import { getCurrentVersion } from "utils/version"
import DownloadCode from "./DownloadCode"
import MenuRow from "./MenuRow"
import {
  initMenu,
  settingsMenu,
  subAdminMenu,
  subSettingsMenu,
  tabletSettingMenus,
} from "./constants"
import "./style.scss"

const SidebarContent = (props) => {
  const { router } = props
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { successToast, errorToast } = useCustomToast()

  const { isTablet, isMobile, isVerticalTablet } = useDevice()
  const { extMenus, disableList } = useMenu()
  const { isAdminMenu, interfaceConfig } = useCommon()

  const isIframeMode = useSelector((state) => state.viewMode.isIframeMode)
  const emailMenuConfig = useSelector((state) => state.EmailConfig)
  const composeMails = useSelector((state) => state.ComposeMail.composeMails)
  const composeDisplayMode = composeMails.localComposeMode

  const settingMenu = useMemo(() => {
    return formatSettingMenu(subSettingsMenu, extMenus, disableList)
  }, [SettingRoutes, extMenus, disableList])

  const adminMenu = useMemo(() => {
    return formatAdminMenu(subAdminMenu, extMenus, interfaceConfig)
  }, [AdminRoutes, extMenus, interfaceConfig])

  // redux state
  const currentMenu = useSelector((state) => state.viewMode.currentMenu)

  const [loading, setLoading] = useState(false)

  // Handle open compose mail modal
  const handleComposeMail = () => {
    dispatch(
      openComposeMail({
        ...composeDataDefaults,
        id: `compose-mail-${composeMails.data.length}`,
        composeMode: isMobile ? composeDisplayModeOptions.EXPAND : composeDisplayMode,
      }),
    )
    if (isMobile || isVerticalTablet) {
      dispatch(setShowSidebar(false))
    }
  }

  const sidebarRef = useRef(null)
  useEffect(() => {
    sidebarRef.current.recalculate()
  }, [])

  const { basicMenus, folderMenus } = useMenu()
  const [openConfirmEmpty, setOpenConfirmEmpty] = useState(false)
  const [folders, setFolders] = useState([])

  useEffect(() => {
    // if (!isEmpty(folderMenus) && !isEqual(folders, folderMenus)) {
    setFolders(folderMenus)
    // }
  }, [folderMenus])

  const toggleConfirmEmpty = () => setOpenConfirmEmpty(!openConfirmEmpty)

  const onEmptyTrash = () => {
    setLoading(true)
    const params = {
      act: "mailboxmanage",
      mode: "trashempty",
      mid: "-",
    }

    postMailToHtml5(params).then((res) => {
      setLoading(false)
      toggleConfirmEmpty()
      if (res.success == "1") {
        successToast("Empty Trash successfully")
        if (router?.params?.menu == "Trash") {
          dispatch(setRefreshList(true))
        }
      } else {
        errorToast("Empty Trash failed")
      }
    })
  }

  const handleNavigateSettings = (menu) => {
    dispatch(
      setCurrentMenu({
        key: menu?.key,
        title: t(menu?.keyTitle),
      }),
    )
  }

  const handleUpdateFolderMenus = (menu, subMenu) => {
    const nFolders = updateFolderMenus(folders, menu, subMenu)

    dispatch(setEmailConfig({ ...emailMenuConfig, folderMenus: nFolders }))
  }

  return (
    <React.Fragment>
      <SimpleBar id="sidebar-menu" className="overflow-hidden h-100" ref={sidebarRef}>
        <div className={"d-flex flex-column h-100"}>
          <div
            className={"d-flex align-items-center justify-content-center py-3 px-4"}
            style={{ maxHeight: "67px" }}
          >
            <BaseButton
              color={"primary"}
              className={"han-btn-compose w-100"}
              textClassName="han-h3 han-fw-bold"
              onClick={handleComposeMail}
              disabled={composeMails.data?.length > 9}
            >
              {props.t("mail.mail_menu_write")}
            </BaseButton>
          </div>
          <div
            className="sidebar-item d-flex flex-column flex-grow-1 p-0 px-2 scroll-box mh-100"
            style={{ height: `calc(100vh - 67px - ${isIframeMode ? "0px" : "55px"}) !important` }}
          >
            <ul className="metismenu list-unstyled" id="side-menu">
              <MenuRow menu={initMenu["all"]} router={router} {...props} />
              {basicMenus &&
                basicMenus?.length > 0 &&
                basicMenus?.map(
                  (menu) =>
                    // menu.key != "Approval" &&
                    menu.key != "Archives" &&
                    menu.key != "Receive" && (
                      <MenuRow
                        key={menu.key}
                        menu={menu}
                        router={router}
                        toggleConfirmEmpty={toggleConfirmEmpty}
                      />
                    ),
                )}

              <Divider
                variant="middle"
                sx={{
                  borderColor: "var(--sidebar-divider)",
                  pb: 2,
                  mb: 2,
                  ml: 1,
                  mr: 1,
                }}
              />

              {/* share and folder */}
              <MenuDropdown
                menu={initMenu["share"]}
                apiReturnGetField={"mailbox"}
                apiGetSubMenu={getEmailShareBox}
                icon={"mdi mdi-folder-account"}
                currentMenuKey={router?.params?.menu}
                isParent={true}
                isShareMenu={true}
              />
              <MenuDropdown
                menus={folders}
                menu={initMenu["folder"]}
                isParent={true}
                isSearch={true}
                apiGetSubMenu={getEmailFolder}
                initExpand={true}
                icon={"mdi mdi-folder-outline"}
                currentMenuKey={router?.params?.menu}
                apiReturnGetField={"mailbox"}
                callbackUpdateList={handleUpdateFolderMenus}
              />
            </ul>

            {/* settings and admin */}
            <Divider
              variant="middle"
              sx={{
                borderColor: "var(--sidebar-divider)",
                pb: 1,
                mb: 2,
                ml: 1,
                mr: 1,
              }}
            />

            {/* Setting & Admin */}

            <ul className="metismenu list-unstyled" id="setting-menu">
              <MenuDropdown
                isParent={true}
                navURL="setting"
                initExpand={false}
                menus={settingMenu}
                menu={tabletSettingMenus[0]}
              />
              {isAdminMenu && (
                <MenuDropdown
                  isParent={true}
                  navURL="admin"
                  initExpand={false}
                  menus={adminMenu}
                  menu={tabletSettingMenus[1]}
                />
              )}
            </ul>

            {/* app info */}
            <Divider
              variant="middle"
              sx={{
                borderColor: "var(--sidebar-divider)",
                pb: 1,
                mb: 2,
                ml: 1,
                mr: 1,
                mt: 1,
              }}
            />
            <DownloadCode />
            <div className="app-version pt-4 pb-5">
              <span className="ps-2 pb-3">Version {getCurrentVersion()}</span>
            </div>
          </div>
        </div>
        {openConfirmEmpty && (
          <ModalConfirm
            loading={loading}
            isOpen={openConfirmEmpty}
            toggle={toggleConfirmEmpty}
            onClick={() => {
              onEmptyTrash()
            }}
            keyHeader={"common.alert_info_msg"}
            keyBody={"mail.mail_menu_trashdel"}
          />
        )}
      </SimpleBar>
    </React.Fragment>
  )
}

SidebarContent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
}

export default withRouter(withTranslation()(SidebarContent))
