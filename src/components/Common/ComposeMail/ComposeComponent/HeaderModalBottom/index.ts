// @ts-nocheck
// React
import useDevice from "hooks/useDevice"
import React from "react"

// Third-party
import { useTranslation } from "react-i18next"

const HeaderModalBottom = ({
  composeId,
  title,
  handleMinimize,
  handleExpand,
  handleClose,
  totalCompose,
}) => {
  const { t } = useTranslation()
  const { isMobile, isTablet } = useDevice()

  return (
    <div
      className={`${composeId} d-flex position-relative align-items-center justify-content-between p-2 ps-3 rounded-top compose-modal-header-minimize`}
    >
      {totalCompose > (isTablet ? 2 : 3) && totalCompose - (isTablet ? 2 : 3) > 0 && (
        <div className="total-hidden-compose">{totalCompose - (isTablet ? 2 : 3)}</div>
      )}
      <h5 className="text-muted mb-0">{t(title)}</h5>
      <div className="text-muted">
        {/* Minimize Mode */}
        <button className="btn btn-sm btn-outline pb-0 border-0" onClick={handleMinimize}>
          <i className="mdi mdi-window-minimize text-muted font-size-18"></i>
        </button>

        {/* Expand or Collapse Mode */}
        {!isMobile && (
          <button className="btn btn-sm btn-outline pb-0 border-0" onClick={handleExpand}>
            <i className="mdi mdi-arrow-expand text-muted font-size-18"></i>
          </button>
        )}

        {/* Close */}
        <button className="btn btn-sm btn-outline pb-0 border-0" onClick={handleClose}>
          <i className="mdi mdi-close text-muted font-size-18"></i>
        </button>
      </div>
    </div>
  )
}

export default HeaderModalBottom
