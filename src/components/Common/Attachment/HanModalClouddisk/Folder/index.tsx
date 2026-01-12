// @ts-nocheck
import React from "react"
import ContextMenu from "../ContextMenu"
import classnames from "classnames"
import "./style.scss"
import BaseIcon from "components/Common/BaseIcon"
import { Row, Col } from "reactstrap"

function index({
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
    <Col xs={12} md={6} lg={4} className="">
      <div
        className="card media media-folder card-folder cursor-pointer mb-0"
        onClick={(e) => {
          e.preventDefault()
          onOpen()
        }}
      >
        <div
          className={classnames(
            "h-100 d-flex flex-column justify-content-between",
            isChoosed ? "choosed-item" : "",
          )}
        >
          <div className="folder-icon-wrapper">
            <svg
              aria-hidden="true"
              focusable="false"
              data-prefix="fas"
              data-icon="folder"
              className="fa-folder"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 512 512"
            >
              <path
                fill="#FA8C16"
                d="M464 128H272l-64-64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V176c0-26.51-21.49-48-48-48z"
              ></path>
            </svg>
          </div>

          <div className="media-body container-text-more pt-3">
            <h6 className="text-more-flex han-h6">
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
            <span className="text-more-flex han-h6 han-text-secondary">{description}</span>
          </div>
          <ContextMenu isRename onDownload={onDownload} onDelete={onDelete} onRename={onRename} />
        </div>
      </div>
    </Col>
  )
}

export default index
