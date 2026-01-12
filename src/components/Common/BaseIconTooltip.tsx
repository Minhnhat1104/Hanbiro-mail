// @ts-nocheck
import React from "react"

import { UncontrolledTooltip } from "reactstrap"

import BaseIcon from "components/Common/BaseIcon"

const BaseIconTooltip = ({
  title = "Tooltip title",
  id = "tooltip-id",
  placement = "top",
  ...props
}) => {
  return (
    <>
      <BaseIcon id={id} {...props} />
      <UncontrolledTooltip placement={placement} target={id} trigger="hover click">
        <span className="han-h6">{title}</span>
      </UncontrolledTooltip>
    </>
  )
}

export default BaseIconTooltip
