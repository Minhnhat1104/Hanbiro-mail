// @ts-nocheck
import React from "react"
import ContextMenu from "../ContextMenu"
import BaseIcon from "components/Common/BaseIcon"

function FolderListItem({
  id = "",
  name = "",
  description = "",
  isChoosed = false,
  onOpen = () => {},
  onDownload = () => {},
  onDelete = () => {},
  onRename = () => {},
}) {
  return (
    <div className="d-flex justify-content-between folder-list-item align-items-center">
      <div className="d-flex gap-2 flex-grow-1 folder-list-item__icon">
        <div className="">
          <BaseIcon className={"bx bxs-folder fs-5"} />
        </div>
        <h6 className="text-more-flex">
          <a
            href=""
            className="link-02 han-body2 han-text-primary han-fw-medium"
            onClick={(e) => {
              e.preventDefault()
              onOpen()
            }}
          >
            {name}
          </a>
        </h6>
      </div>
      <div className="d-flex align-items-center">
        <span className="text-more-flex pe-1 han-h6 han-text-secondary">{description}</span>
        <ContextMenu
          type="list"
          isRename
          onDownload={onDownload}
          onDelete={onDelete}
          onRename={onRename}
        />
      </div>
    </div>
  )
}

export default FolderListItem
