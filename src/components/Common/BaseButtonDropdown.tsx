// @ts-nocheck
import React, { useState } from "react"
import classnames from "classnames"
import { ButtonDropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap"

import { BaseIcon } from "components/Common"

const BaseButtonDropdown = ({
  icon = "fas fa-chevron-down",
  showChevron = true,
  classDropdown = "",
  classDropdownToggle = "",
  classDropdownMenu = "",
  content,
  options,
  children,
  iconClassName = "ms-1",
  direction = "down",
  onClickToggle,
  classContent = "",
  styleToggle = {},
  end,
}) => {
  const [openDropdown, setOpenDropdown] = useState(false)
  const [active, setActive] = useState(0)
  return (
    <ButtonDropdown
      isOpen={openDropdown}
      toggle={(e) => {
        e.stopPropagation()
        setOpenDropdown(!openDropdown)
      }}
      className={classnames("base-button-dropdown", classDropdown)}
      direction={direction}
    >
      <DropdownToggle
        className={classnames("btn dropdown-toggle", classDropdownToggle)}
        tag="div"
        onClick={onClickToggle}
        style={styleToggle}
      >
        {content && <span className={classContent}>{content}</span>}
        {showChevron && <BaseIcon icon={icon} className={iconClassName} />}
      </DropdownToggle>
      <DropdownMenu className={classnames("", classDropdownMenu)} end={end}>
        {options &&
          options.length > 0 &&
          options.map((option, i) => {
            if (typeof option.isShow !== "undefined" && option.isShow) {
              return (
                <DropdownItem
                  key={i}
                  disabled={option.disabled}
                  active={option.value && active === option.value ? true : false}
                  onClick={(e) => {
                    option?.onClick()
                    setActive(option.value)
                  }}
                >
                  {option?.icon && (
                    <BaseIcon icon={option?.icon} className={option?.iconClassName || ""} />
                  )}
                  {option?.iconCustom && option?.iconCustom}
                  {option.title}
                </DropdownItem>
              )
            } else if (typeof option.isShow === "undefined") {
              return (
                <DropdownItem
                  key={i}
                  disabled={option.disabled}
                  active={option.value && active === option.value ? true : false}
                  onClick={(e) => {
                    option?.onClick()
                    setActive(option.value)
                  }}
                >
                  {option?.icon && (
                    <BaseIcon icon={option?.icon} className={option?.iconClassName || ""} />
                  )}
                  {option.title}
                </DropdownItem>
              )
            }
          })}

        {children}
      </DropdownMenu>
    </ButtonDropdown>
  )
}
export default BaseButtonDropdown
