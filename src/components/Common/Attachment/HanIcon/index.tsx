// @ts-nocheck
import React from "react";
import * as Icon from "react-feather";
import classnames from "classnames";
import "./styles.scss";

function index({ name = "Camera", size = 16, ...attrs }) {
  const Component = Icon[name];

  if (!Component) {
    return null;
  }

  return (
    <Component
      {...attrs}
      className={classnames("common-han-icon", attrs.className)}
      size={size}
    />
  );
}

export default index;
