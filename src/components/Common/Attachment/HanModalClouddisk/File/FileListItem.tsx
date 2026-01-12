// @ts-nocheck
import React from "react"
import ContextMenu from "../ContextMenu"
import HanIconFile from "../../HanIconFile"
import classnames from "classnames"
import "./styles.scss"
import { Input } from "reactstrap"

const FileListItem = ({
  name = "",
  extension = "",
  size = "",
  author = "",
  isChoosed = false,
  isViewDetail = false,
  isDownload = true,
  isCopyTo = false,
  isMoveTo = false,
  isRename = true,
  isDelete = true,
  onToggleCheck = () => {},
  onDownload = () => {},
  onDelete = () => {},
  onRename = () => {},
  progress = 0,
  isUpload = false,
  isContextMenu = true,
  isAccessChoose = true,
}) => {
  const progressValue = parseInt(progress)

  return (
    <div
      className={classnames(
        "d-flex file-list-item align-items-center",
        isChoosed ? "choosed-item" : "",
      )}
      onClick={(e) => {
        e.preventDefault()
        onToggleCheck()
      }}
    >
      {/* select box */}
      <Input
        type="checkbox"
        name=""
        id=""
        checked={isChoosed}
        onClick={(e) => {
          e.stopPropagation()
          onToggleCheck()
        }}
        onChange={() => {}}
      />

      {/* file info */}
      <div className="file-list-item__info d-flex align-items-center px-2">
        <div className="file-list-item__content d-flex align-items-center">
          <div
            className="file-list-item__icon me-2"
            onClick={(e) => {
              e.preventDefault()
              onToggleCheck()
            }}
          >
            <HanIconFile extension={extension} padding="p-0" />
          </div>
          <div className="file-list-item__name">
            <h6 className="m-0 han-body2 han-fw-medium text-truncate">{name}</h6>
          </div>
        </div>
        <span className="file-list-item__size d-inline-block han-h6 han-text-secondary">
          {size}
        </span>
        {isUpload ? (
          <div className="progress ht-5 mg-t-5">
            <div
              className={`progress-bar progress-bar-striped bg-success`}
              style={{
                width: `${progressValue}%`,
              }}
              role="progressbar"
              aria-valuenow={progressValue}
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
        ) : null}
      </div>

      {/* context menu */}
      {isContextMenu && (
        <ContextMenu
          type="list"
          isViewDetail={isViewDetail}
          isDownload={isDownload}
          isCopyTo={isCopyTo}
          isMoveTo={isMoveTo}
          isRename={isRename}
          isDelete={isDelete}
          onDownload={onDownload}
          onDelete={onDelete}
          onRename={onRename}
        />
      )}
    </div>
  )
}

export default FileListItem
