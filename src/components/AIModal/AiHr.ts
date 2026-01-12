// @ts-nocheck
import React from "react"

const AiHr = ({ type = "summary" }) => {
  return (
    <div
      className={`w-100 han-bg-color-light-grey my-${type === "summary" ? "3" : "4"}`}
      style={{ height: "1px" }}
    ></div>
  )
}

export default AiHr
