// @ts-nocheck
import React, { useEffect, useRef, useState } from "react"

const SummaryTab = ({ tabsData, defaultActive, setActiveTab }) => {
  const tabRefs = useRef([])
  const indicatorRef = useRef(null)

  useEffect(() => {
    const activeTab = tabRefs.current[defaultActive]
    if (activeTab && indicatorRef.current) {
      indicatorRef.current.style.width = `${activeTab.offsetWidth}px`
      indicatorRef.current.style.left = `${activeTab.offsetLeft}px`
    }
  }, [defaultActive])

  return (
    <>
      <div className="ai-tabs" id="customTabs">
        {tabsData.map((tab, index) => (
          <div
            key={tab.value}
            ref={(el) => (tabRefs.current[tab.value] = el)}
            className={`ai-tab-item ${defaultActive === tab.value ? "active font-weight-700" : ""}`}
            onClick={() => setActiveTab(tab.value)}
          >
            {tab.label}
          </div>
        ))}
        <div
          ref={indicatorRef}
          className="ai-tab-indicator"
          style={{ height: "2px", bottom: 0, transition: "all 0.3s ease-in-out" }}
        ></div>
      </div>
    </>
  )
}

export default SummaryTab
