// @ts-nocheck
import { BaseButtonDropdown } from "components/Common"
import React from "react"

const AiAction = ({
  date,
  lang,
  disabled,
  options,
  onCopy,
  className = "",
  showLangButton = true,
}) => {
  return (
    <div
      className={`ai-header-right d-flex flex-column justify-content-between align-items-end gap-2 ${className}`}
    >
      <div className="d-flex align-items-center gap-2">
        <span className="han-text-secondary">{lang}</span>
        <i onClick={onCopy} className="btn btn-ai-action btn-copy bx bx-copy font-size-16" />
        {options && showLangButton && (
          <BaseButtonDropdown
            end={true}
            classDropdownToggle="btn-ai-action btn-translate"
            icon="fa fa-angle-down font-size-14"
            iconClassName="ms-2"
            content={<i className="mdi mdi-translate" />}
            options={options}
          />
        )}
      </div>
      {date && <span className="ai-sub-title">{date}</span>}
    </div>
  )
}

export default AiAction
