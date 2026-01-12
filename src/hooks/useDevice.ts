// @ts-nocheck
import { useMediaQuery, useTheme } from "@mui/material"

const useDevice = () => {
  const theme = useTheme()

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "lg"))
  const isDesktop = useMediaQuery(theme.breakpoints.up("lg"))
  const isVerticalTablet = useMediaQuery(theme.breakpoints.between("sm", "md"))

  return { isMobile, isTablet, isDesktop, isVerticalTablet }
}

export default useDevice
