// @ts-nocheck
import { useState, useEffect } from "react"

const useDeviceNavigator = () => {
  const [deviceInfo, setDeviceInfo] = useState({
    userAgent: "",
    platform: "",
    isMobile: false,
    isTablet: false,
    isDesktop: false,
  })

  useEffect(() => {
    const userAgent = navigator.userAgent
    const platform = navigator.platform
    const isMobile = /Mobi|Android/i.test(userAgent)
    const isTablet = /Tablet|iPad/i.test(userAgent)
    const isDesktop = !isMobile && !isTablet

    setDeviceInfo({
      userAgent,
      platform,
      isMobile,
      isTablet,
      isDesktop,
    })
  }, [])

  return deviceInfo
}

export default useDeviceNavigator
