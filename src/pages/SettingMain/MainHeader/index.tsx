// @ts-nocheck
import React from "react"
import { useDispatch, useSelector } from "react-redux"
import { useTranslation } from "react-i18next"

import useDevice from "hooks/useDevice"
import { Title } from "components/SettingAdmin"
import { BaseButton } from "components/Common"
import { setShowSidebar } from "store/viewMode/actions"

const MainHeader = (props) => {
  const {currentTitleMenu, rightHeader, className} = props

  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { isTablet, isMobile } = useDevice()

  const isIframeMode = useSelector((state) => state.viewMode.isIframeMode)
  const isShowSidebar = useSelector((state) => state.viewMode.isShowSidebar)
  const currentMenu = useSelector((state) => state.viewMode.currentMenu)

  const toggleSidebar = () => {
    dispatch(setShowSidebar(!isShowSidebar))
  }

  return (
    <div className={`d-flex justify-content-between align-items-center mb-2${className ? " " + className : ""}`}>
      <div className={`d-flex align-items-center justify-content-start gap-2`}>
        {isIframeMode && (isTablet || isMobile) && (
          <BaseButton
            outline
            type="button"
            onClick={() => {
              toggleSidebar()
            }}
            className="d-flex px-2 py-1 btn-action"
            id="vertical-menu-btn"
          >
            <i className="fa fa-fw fa-bars" />
          </BaseButton>
        )}
        <Title name={t(currentTitleMenu) || t(currentMenu.title)} />
      </div>
      <div className={`d-flex align-items-center justify-content-end`}>
        {rightHeader}
      </div>
    </div>
  )
}

export default MainHeader