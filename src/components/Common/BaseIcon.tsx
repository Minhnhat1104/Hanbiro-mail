// @ts-nocheck
import PropsType from "prop-types"
import React from "react"
import classnames from "classnames"
const BaseIcon = ({ id = "", innerRef, icon, className, ...props }) => {
  return (
    <i
      id={id}
      ref={innerRef}
      className={classnames("cursor-pointer", className, icon)}
      {...props}
    />
  )
}

BaseIcon.propTypes = {
  className: PropsType.string,
  icon: PropsType.string,
}

export default BaseIcon
