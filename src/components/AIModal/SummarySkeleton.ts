// @ts-nocheck
import React from "react"

const SummarySkeleton = ({
  type = "summary",
  first = false,
  className = "",
  count = 1,
  show = true,
}) => {
  return (
    <div
      className={`${className} ai-skeleton d-${
        show ? "flex flex-grow-1" : "none"
      } w-100 flex-column justify-content-center align-items-start overflow-y-hidden`}
    >
      {/* Header skeleton */}
      {first && (
        <div className="ai-header-placeholder w-100 d-flex justify-content-between align-items-start mb-3">
          <div className="w-100 placeholder-glow d-flex flex-column gap-1">
            <span className="placeholder placeholder-lg col-12"></span>
            <span className="placeholder col-8"></span>
            <span className="placeholder col-8"></span>
          </div>
          <div className="w-100 d-flex flex-column align-items-end gap-2">
            <div className="w-100 placeholder-glow placeholder-lg d-flex justify-content-end">
              <span className="placeholder col-2"></span>
            </div>
            <div className="w-100 placeholder-glow d-flex justify-content-end">
              <span className="placeholder col-4"></span>
            </div>
          </div>
        </div>
      )}

      {/* content section skeleton */}
      {type === "summary" ? (
        <div className="ai-translate-content-placeholder w-100 p-3">
          <div className="ai-purpose-placeholder w-100 mb-2">
            <div className="placeholder-glow mb-1">
              <span className="placeholder col-6"></span>
            </div>
            <div className="placeholder-glow ms-3">
              <span className="bullet placeholder me-2"></span>
              <span className="placeholder col-11"></span>
            </div>
          </div>
          <div className="w-100">
            <div className="placeholder-glow mb-1">
              <span className="placeholder col-6"></span>
            </div>
            <div className="placeholder-glow d-flex flex-column mb-2 gap-1 ms-3">
              <div className="d-flex align-items-center">
                <span className="bullet placeholder me-2"></span>
                <span className="placeholder col-11"></span>
              </div>
              <div className="d-flex align-items-center">
                <span className="bullet placeholder me-2"></span>
                <span className="placeholder col-11"></span>
              </div>
              {!first && (
                <div className="d-flex align-items-center">
                  <span className="bullet placeholder me-2"></span>
                  <span className="placeholder col-11"></span>
                </div>
              )}
            </div>
          </div>
          {first && (
            <div className="w-100">
              <div className="placeholder-glow mb-1">
                <span className="placeholder col-6"></span>
              </div>
              <div className="placeholder-glow d-flex flex-column mb-2 gap-1 ms-3">
                <div className="d-flex align-items-center">
                  <span className="bullet placeholder me-2"></span>
                  <span className="placeholder col-11"></span>
                </div>
                <div className="d-flex align-items-center">
                  <span className="bullet placeholder me-2"></span>
                  <span className="placeholder col-11"></span>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="ai-translate-content-placeholder w-100 placeholder-glow d-flex flex-column my-1 gap-2 p-4 mt-3">
          <span className="placeholder col-12"></span>
          <span className="placeholder col-12"></span>
          <span className="placeholder col-12"></span>
          <span className="placeholder col-12"></span>
          <span className="placeholder col-12"></span>
          <span className="placeholder col-12"></span>
          {/* <span className="placeholder col-12"></span>
          <span className="placeholder col-12"></span>
          <span className="placeholder col-12"></span>
          <span className="placeholder col-12"></span>
          <span className="placeholder col-12"></span> */}
        </div>
      )}
    </div>
  )
}

export default SummarySkeleton
