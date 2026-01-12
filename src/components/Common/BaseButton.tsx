// @ts-nocheck
import PropsType from "prop-types"
import React from "react"
import classnames from "classnames"
import BaseIcon from "./BaseIcon"

import { Button } from "reactstrap"

const BaseButton = ({
  buttonRef,
  loading,
  icon,
  iconClassName = "",
  iconPosition = "left",
  textClassName = "han-h4 han-fw-semibold",
  children,
  className,
  hideChildrenOnLoading = false,
  type = "button",
  disabled,
  id = "",
  iconLoadingSmall = false,
  loadingClass = "",
  ...props
}) => {
  const classes = classnames("btn d-flex justify-content-center align-items-center", className)

  return (
    <>
      <Button
        innerRef={buttonRef}
        className={classes}
        disabled={loading || disabled}
        type={type}
        id={id}
        {...props}
      >
        {loading && (
          <i
            className={`bx bx-loader bx-spin font-size-${
              iconLoadingSmall ? "14" : "16"
            } align-middle ${children ? "me-1" : ""} ${loadingClass}`}
          ></i>
        )}
        {icon && !loading && iconPosition === "left" && (
          <BaseIcon
            icon={icon}
            className={`font-size-16 ${`${children ? "me-1" : ""} ${iconClassName}`}`}
          />
        )}
        {loading && hideChildrenOnLoading ? null : (
          <span className={`text-nowrap ${textClassName}`}>{children}</span>
        )}
        {icon && !loading && iconPosition === "right" && (
          <BaseIcon
            icon={icon}
            className={`font-size-16 ${`${children ? "ms-1" : ""} ${iconClassName}`}`}
          />
        )}
      </Button>
    </>
  )
}

BaseButton.propTypes = {
  loading: PropsType.bool,
}

export default BaseButton
