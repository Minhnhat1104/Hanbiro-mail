// @ts-nocheck
import React from "react"
import { setShowSidebar } from "store/viewMode/actions"
import { useSelector } from "react-redux"
import useDevice from "hooks/useDevice"
import { BaseButton } from "components/Common"

const Title = ({ name }) => {
  const { isTablet, isMobile, isVerticalTablet, isDesktop } = useDevice()
  const isIframeMode = useSelector((state) => state.viewMode.isIframeMode)

  // const toggleSidebar = () => {
  //   dispatch(setShowSidebar(!isShowSidebar))
  // }

  return (
    <div className={`d-flex align-items-center`}>
      <div className="han-h2 han-text-primary text-nowrap">{name}</div>
    </div>
  )
}

export default Title
