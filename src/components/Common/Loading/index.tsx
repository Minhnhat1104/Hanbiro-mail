// @ts-nocheck
import React from "react"

const Loading = ({ className = "p-5" }) => {
  return (
    <div className={className}>
      <div className="position-absolute top-50 start-50 translate-middle">
        <div className="spinner-border han-color-primary" role="status"></div>
      </div>
    </div>
  )
}

export default Loading
