// @ts-nocheck

import Loading from 'components/Common/Loading'
import React from 'react'

const LoadingPage = () => {
  return (
    <div className="w-100 p-5" style={{ height: "calc(100vh - 180px)" }}>
      <div className="position-absolute top-50 start-50 translate-middle">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    </div>
  )
}

export default LoadingPage