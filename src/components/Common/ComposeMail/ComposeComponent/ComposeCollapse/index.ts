// @ts-nocheck
import React from "react"

const ComposeCollapse = ({ isMinimize, renderHeader, renderBody, renderFooter }) => {
  return (
    <div className={`compose-collapse-mode bg-white gap-2 ${isMinimize ? "d-none" : ""}`}>
      <div className="compose-expand-header p-2 ps-3 compose-header">{renderHeader()}</div>
      <div className="compose-expand-body px-3 flex-grow-1 overflow-auto">{renderBody()}</div>
      <div className="compose-expand-footer p-3">{renderFooter()}</div>
    </div>
  )
}

export default ComposeCollapse
