// @ts-nocheck
import React from "react";
import Tooltip from "rc-tooltip";
import "rc-tooltip/assets/bootstrap.css";
import PropTypes from "prop-types"

import "./styles.scss";

function HanTooltip(props) {
  const {
    children,
    placement,
    overlay,
    overlayClassName,
    trigger,
    onVisibleChange,
    arrowContent,
    afterVisibleChange,
    destroyTooltipOnHide
  } = props;

  let option = {
    placement,
    mouseEnterDelay: 0.2,
    mouseLeaveDelay: 0,
    trigger,
    overlay,
    overlayClassName,
    arrowContent,
    afterVisibleChange,
    destroyTooltipOnHide,
  };

  if (props.hasOwnProperty('visible')) {
    option.visible = props.visible;
  }

  const clickOption = {
    ...option,
    onVisibleChange,
    arrowContent
  };

  return (
    <Tooltip {...(trigger === "click" ? clickOption : option)}>
      {children}
    </Tooltip>

  );
}
HanTooltip.propTypes = {
  children: PropTypes.node,
  placement: PropTypes.string,
  overlayClassName: PropTypes.string,
  overlay: PropTypes.node,
  trigger: PropTypes.string,
  className: PropTypes.string
};

HanTooltip.defaultProps = {
  children: null,
  placement: "right",
  overlayClassName: "",
  overlay: null,
  trigger: "hover",
  className: ""
};
export default HanTooltip;
