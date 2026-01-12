// @ts-nocheck
import React, { useState } from "react"
import ContextMenu from "../ContextMenu"
import HanIconFile from "../../HanIconFile"
import classnames from "classnames"
import "./styles.scss"
import BaseIcon from "components/Common/BaseIcon"
import { Row, Col } from "reactstrap"

function index({
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
}) {
  const progressValue = parseInt(progress)
  const [isShown, setIsShown] = useState(false)
  return (
    <Col xs={12} md={6} lg={4} className="">
      <div
        className="modal-clouddisk-file"
        onMouseEnter={() => isAccessChoose && setIsShown(true)}
        onMouseLeave={() => isAccessChoose && setIsShown(false)}
      >
        {Boolean(isShown || isChoosed) && (
          <div
            className={classnames("file-view-check", isChoosed ? "file-view-check-active" : "")}
            onClick={(e) => {
              e.preventDefault()
              isAccessChoose && onToggleCheck()
            }}
          >
            <BaseIcon className="bx bx-check" />
          </div>
        )}
        <div
          className={classnames(
            "card card-file h-100 flex-column justify-content-between",
            isChoosed ? "choosed-item" : "",
          )}
        >
          {isContextMenu && (
            <ContextMenu
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
          <div
            className="card-file-thumb tx-primary cursor-pointer"
            onClick={(e) => {
              e.preventDefault()
              onToggleCheck()
            }}
          >
            <HanIconFile extension={extension} />
          </div>
          <div
            className="card-body cursor-pointer"
            onClick={(e) => {
              e.preventDefault()
              onToggleCheck()
            }}
          >
            <div className="w-100 han-body2 han-fw-medium han-text-primary link-02 text-truncate">
              {name}
            </div>
            <p className="han-h6">{author}</p>
            <span className="han-h6 han-text-secondary">{size}</span>
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
        </div>
      </div>
    </Col>
  )
}

export default index
