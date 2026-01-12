// @ts-nocheck
import React from "react"

import { UncontrolledTooltip } from "reactstrap"

import BaseButton from "components/Common/BaseButton"
import BaseIcon from "components/Common/BaseIcon"
import HanTooltip from "./HanTooltip"

const BaseButtonTooltip = ({
  title = "Tooltip title",
  id = "tooltip-id",
  placement = "top",
  ...props
}) => {
  return (
    <>
      <HanTooltip placement={placement} trigger="hover" overlay={title}>
        <BaseButton {...props}>
          {/* {props?.loading && props?.icon && <BaseIcon icon={props?.icon} />} */}
        </BaseButton>
      </HanTooltip>
      {/* <UncontrolledTooltip  target={id} trigger="hover click">
        {title}
      </UncontrolledTooltip> */}
    </>
  )
}

export default BaseButtonTooltip
