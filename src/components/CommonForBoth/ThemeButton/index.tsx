// @ts-nocheck
import React, { useEffect } from "react"
import PropTypes from "prop-types"

import { connect } from "react-redux"
import { Button } from "reactstrap"
import Select from "react-select"

import { THEME_OPTIONS, THEME_SIDEBAR_OPTIONS, THEME_STORAGE_KEY } from "constants/theme"
import useLocalStorage from "hooks/useLocalStorage"
import {
  changeLayout,
  changeLayoutMode,
  changeLayoutWidth,
  changePreloader,
  changeSidebarTheme,
  changeSidebarThemeImage,
  changeSidebarType,
  // changeThemeMode,
  changeTopbarTheme,
  showRightSidebarAction,
} from "store/actions"

import "./theme-button.scss"

const ThemeButton = (props) => {
  const [themeMode, setThemeMode] = useLocalStorage(THEME_STORAGE_KEY.theme, THEME_OPTIONS[0].value)
  const [sidebarMode, setThemeModeSidebar] = useLocalStorage(
    THEME_STORAGE_KEY.sidebar,
    THEME_SIDEBAR_OPTIONS[0].value,
  )

  // Handle change sidebar
  const onChangeSidebarTheme = (themeMode) => {
    setThemeModeSidebar(themeMode.value)
    if (document.body) {
      document.body.setAttribute(THEME_STORAGE_KEY.sidebar, themeMode.value)
    }
  }

  // Handle change theme
  const onChangeTheme = (themeMode) => {
    setThemeMode(themeMode.value)
    if (document.body) {
      document.body.setAttribute("data-theme-mode", themeMode.value)
    }
  }

  useEffect(() => {
    if (sidebarMode) {
      onChangeSidebarTheme(
        THEME_SIDEBAR_OPTIONS.find((option) => option.value === sidebarMode) ||
          THEME_SIDEBAR_OPTIONS[0],
      )
    } else {
      onChangeSidebarTheme(THEME_SIDEBAR_OPTIONS[0])
    }
  }, [sidebarMode])

  useEffect(() => {
    if (themeMode) {
      onChangeTheme(THEME_OPTIONS.find((option) => option.value === themeMode) || THEME_OPTIONS[0])
    } else {
      onChangeTheme(THEME_OPTIONS[0])
    }
  }, [themeMode])

  return (
    <React.Fragment>
      {/* Example 1 */}
      {/* <div className="radio-toolbar">
        <input
          type="radio"
          id="radioThemeLight"
          name="radioTheme"
          value={themeModeTypes.LIGHT}
          checked={props.themeModeType === themeModeTypes.LIGHT}
          onChange={e => {
            if (e.target.checked) {
              // props.changeTopbarTheme(e.target.value)
              // props.changeSidebarTheme(e.target.value)
              // props.changeLayoutMode(e.target.value)
              props.changeThemeMode(e.target.value)
            }
          }}
        />
        <label className="me-1" htmlFor="radioThemeLight">
          Light
        </label>
        <input
          type="radio"
          id="radioThemeDark"
          name="radioTheme"
          value={themeModeTypes.DARK}
          checked={props.themeModeType === themeModeTypes.DARK}
          onChange={e => {
            if (e.target.checked) {
              // props.changeTopbarTheme(e.target.value)
              // props.changeSidebarTheme(e.target.value)
              // props.changeLayoutMode(e.target.value)
              props.changeThemeMode(e.target.value)
            }
          }}
        />
        <label className="me-1" htmlFor="radioThemeDark">
          Dark
        </label>
      </div> */}

      {/* Sidebar Example 2 */}
      <Select
        className="select2-selection me-2"
        options={THEME_SIDEBAR_OPTIONS}
        value={THEME_SIDEBAR_OPTIONS.find((option) => option.value === sidebarMode)}
        onChange={(newValue) => onChangeSidebarTheme(newValue)}
        styles={{
          menu: (base) => ({
            ...base,
            backgroundColor: "white!important",
          }),
        }}
      />

      {/* Example 2 */}
      <Select
        className="select2-selection"
        options={THEME_OPTIONS}
        value={THEME_OPTIONS.find((option) => option.value === themeMode)}
        onChange={(newValue) => onChangeTheme(newValue)}
        styles={{
          menu: (base) => ({
            ...base,
            backgroundColor: "white!important",
          }),
        }}
      />
    </React.Fragment>
  )
}

ThemeButton.propTypes = {
  changeLayout: PropTypes.func,
  changeLayoutWidth: PropTypes.func,
  changePreloader: PropTypes.func,
  changeSidebarTheme: PropTypes.func,
  changeSidebarThemeImage: PropTypes.func,
  changeSidebarType: PropTypes.func,
  changeTopbarTheme: PropTypes.func,
  isPreloader: PropTypes.any,
  layoutType: PropTypes.any,
  layoutModeType: PropTypes.any,
  // themeModeType: PropTypes.any,
  changeLayoutMode: PropTypes.func,
  layoutWidth: PropTypes.any,
  leftSideBarTheme: PropTypes.any,
  leftSideBarThemeImage: PropTypes.any,
  leftSideBarType: PropTypes.any,
  showRightSidebarAction: PropTypes.func,
  topbarTheme: PropTypes.any,
  onClose: PropTypes.func,
}

const mapStateToProps = (state) => {
  return { ...state.Layout }
}

export default connect(mapStateToProps, {
  changeLayout,
  changeLayoutMode,
  // changeThemeMode,
  changeSidebarTheme,
  changeSidebarThemeImage,
  changeSidebarType,
  changeLayoutWidth,
  changeTopbarTheme,
  changePreloader,
  showRightSidebarAction,
})(ThemeButton)
