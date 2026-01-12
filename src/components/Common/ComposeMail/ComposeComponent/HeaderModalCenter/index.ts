// @ts-nocheck
// React
import useDevice from "hooks/useDevice"
import React from "react"

// Third-party
import { useTranslation } from "react-i18next"

const HeaderModalCenter = ({
  title,
  handleMinimize,
  isCollapseMode,
  handleExpand,
  handleClose,
}) => {
  const { t } = useTranslation()
  const { isMobile } = useDevice()

  return (
    <div className="w-100 d-flex justify-content-between align-items-center">
      {t(title)}

      <div className="text-muted">
        {/* Minimize Mode */}

        {!isMobile && (
          <button className="btn btn-sm btn-outline py-0 border-0" onClick={handleMinimize}>
            <i className="mdi mdi-window-minimize text-muted font-size-18"></i>
          </button>
        )}

        {/* Expand or Collapse Mode */}
        {!isMobile && (
          <button className="btn btn-sm btn-outline py-0 border-0" onClick={handleExpand}>
            {isCollapseMode ? (
              <i className="mdi mdi-arrow-expand text-muted font-size-18"></i>
            ) : (
              <i className="mdi mdi-arrow-collapse text-muted font-size-18"></i>
            )}
          </button>
        )}

        {isCollapseMode && (
          <button className="btn btn-sm btn-outline py-0 border-0" onClick={handleClose}>
            <i className="mdi mdi-close text-muted font-size-18"></i>
          </button>
        )}
      </div>
    </div>
  )
}

export default HeaderModalCenter
