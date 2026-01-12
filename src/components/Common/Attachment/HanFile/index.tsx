// @ts-nocheck
import HanIcon from "../HanIcon"
import HanIconFile from "../HanIconFile"
import HanProgress from "../HanProgress"
import React from "react"
import "./styles.scss"
import BaseButton from "components/Common/BaseButton"
import BaseIcon from "components/Common/BaseIcon"

function index({
  extension = "",
  name = "",
  size = "",
  progress = 0,
  onDelete = null,
  hideProgress = false,
  onDownload = null,
  onPreview = null,
  buttonDisplay = {
    preview: false,
    delete:true,
    download:true
  }
}) {
  return (
    <div className="new-mail-han-file">
      <div className={"view-item-file"}>
        <div className="view-icon-file">
          <HanIconFile extension={extension} />
        </div>

        <div style={{ flex: 1, paddingLeft: 8, paddingRight: 8 }}>
          <div style={{ marginBottom: 0, display: "flex" }}>
            <span
              href="#"
              className="link-02 container-text-more text-more-flex han-h6 han-fw-regular han-text-primary"
              onClick={e => {}}
            >
              {name}
            </span>
          </div>
          <span className={"d-block han-h6 han-fw-regular han-text-secondary"}>{size}</span>
        </div>
        <div className="d-flex ps-3 gap-1">
          {buttonDisplay.preview && <BaseButton className="bg-transparent p-1 border-0" onClick={() => onPreview?.()}>
            <BaseIcon className={"bx bx-search-alt file-icon"} />
          </BaseButton>}
          {buttonDisplay.download && <BaseButton type="button" className="bg-transparent p-1 border-0" onClick={(e) => {
            e.preventDefault()
            onDownload?.()}}>
            <BaseIcon className={"bx bxs-download file-icon"} />
          </BaseButton>}
          {buttonDisplay.delete && <BaseButton className="bg-transparent p-1 border-0" onClick={() => onDelete?.()}>
            <BaseIcon className={"bx bxs-trash file-icon"} />
          </BaseButton>}
        </div>
        {/* {!hideProgress && <HanProgress progress={progress} />} */}
        {/* {!hideDelete && (
          <div
            className="view-btn-close"
            onClick={() => {
              onDelete && onDelete()
            }}
          >
            <HanIcon name="XCircle" size={24} />
          </div>
        )} */}
      </div>
    </div>
  )
}

export default index
