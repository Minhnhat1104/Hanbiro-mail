// @ts-nocheck
import React from "react"

import "./styles.scss"

function UserItem({ name = "", onDelete = () => {}, selected = false }) {
  return (
    <div
      className="mail-user-item"
      style={{
        cursor: "pointer",
      }}
    >
      <div
        className={`py-2 item-user align-items-center bd mg-r-4 mg-b-4 ${
          selected ? "selected" : ""
        }`}
      >
        <span className="mg-r-8 wd-100p text-truncate">{name}</span>
      </div>
    </div>
  )
}

export default UserItem
