// @ts-nocheck
import React, { useRef, useState } from "react"
import BaseIcon from "components/Common/BaseIcon"
import useClickOutside from "utils/useOutsideDetect"
import { useTranslation } from "react-i18next"

function index({
  type = "folder",
  isViewDetail = false,
  isDownload = true,
  isCopyTo = false,
  isMoveTo = false,
  isRename = false,
  isDelete = true,
  onViewDetail = () => {},
  onDownload = () => {},
  onCopyTo = () => {},
  onMoveTo = () => {},
  onRename = () => {},
  onDelete = () => {},
}) {
  const { t } = useTranslation()
  const [toggle, setToggle] = useState(false)
  const contextMenuRef = useRef()
  useClickOutside(contextMenuRef, () => {
    setToggle(false)
  })
  return (
    <div
      className={type === "folder" ? "dropdown-file" : "context-dropdown-file"}
      ref={contextMenuRef}
    >
      <div
        className="dropdown-link"
        onClick={(e) => {
          e.stopPropagation()
          setToggle(!toggle)
        }}
        data-toggle="dropdown"
        data-popper-placement="left-start"
      >
        <BaseIcon className="bx bx-dots-vertical-rounded fs-3" />
      </div>
      <div
        className="dropdown-menu dropdown-menu-right"
        style={{ display: toggle ? "block" : "none" }}
      >
        {isViewDetail && (
          <a
            href="#modalViewDetails"
            data-toggle="modal"
            className="dropdown-item details"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onViewDetail()
            }}
          >
            {/* <HanIcon name="Info" /> */}
            {t("mail.mail_signature_view_detail")}
          </a>
        )}

        {isDownload && (
          <a
            href=""
            className="dropdown-item download"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()

              onDownload()
            }}
          >
            {/* <HanIcon name="Download" /> */}
            {t("common.approval_main_download")}
          </a>
        )}

        {isCopyTo && (
          <a
            href="#modalCopy"
            data-toggle="modal"
            className="dropdown-item copy"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()

              onCopyTo()
            }}
          >
            {/* <HanIcon name="Copy" /> */}
            Copy to
          </a>
        )}

        {isMoveTo && (
          <a
            href="#modalMove"
            data-toggle="modal"
            className="dropdown-item move"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()

              onMoveTo()
            }}
          >
            {/* <HanIcon name="Folder" /> */}
            Move to
          </a>
        )}

        {isRename && (
          <a
            href="#"
            className="dropdown-item rename"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()

              onRename()
            }}
          >
            {/* <HanIcon name="Edit" /> */}
            {t("common.bookmark_rename")}
          </a>
        )}

        {isDelete && (
          <a
            href="#"
            className="dropdown-item delete"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()

              onDelete()
            }}
          >
            {/* <HanIcon name="Trash" /> */}
            {t("common.common_delete")}
          </a>
        )}
      </div>
    </div>
  )
}

export default index
