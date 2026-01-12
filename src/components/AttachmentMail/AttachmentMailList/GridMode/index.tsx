// @ts-nocheck
// React
import React, { useState } from "react"

// Third-party
import { useTranslation } from "react-i18next"
import { Card, Col } from "reactstrap"

// Project
import HanIconFile from "components/Common/Attachment/HanIconFile"
import BaseIconTooltip from "components/Common/BaseIconTooltip"
import { getBaseUrl } from "utils"

import loadingImg from "./loading.gif"
import HanTooltip from "components/Common/HanTooltip"

const GridMode = ({
  item = {},
  extension = "",
  isChangeAttView = false,
  onDownload = null,
  onPreview = null,
  isShowButton = {
    download: true,
    preview: true,
  },
}) => {
  const { t } = useTranslation()

  return (
    <div
      className={"attachment align-items-center cursor-pointer"}
      onClick={() => isShowButton.download && onDownload && onDownload(item.link)}
    >
      <div className="d-flex w-100 h-100 align-items-center justify-content-start gap-2">
        <div className="attachment-img h-100 align-items-center">
          <HanIconFile extension={extension} padding={"p-0"} />
        </div>
        <div className="attachment-info flex-grow-1 d-flex flex-column gap-1">
          <HanTooltip placement="top" overlay={item.name}>
            <span className="attachment-name mb-0 text-truncate han-body2 han-fw-regular">
              {item.name}
            </span>
          </HanTooltip>
          <div className="attachment-size d-flex align-items-end justify-content-between gap-2 mb-0 font-size-11">
            <span className="han-h6 han-fw-regular han-text-secondary">{item.filesize}</span>
            <div className="attachment-buttons">
              {isShowButton.download && (
                <BaseIconTooltip
                  title={t("common.board_download_msg")}
                  id={`attachment-download-${item.ii}`}
                  icon="mdi mdi-download"
                  className="font-size-18 attachment-icon-item attachment-icon-hover attachment-icon-download"
                  onClick={(e) => {
                    e.stopPropagation()
                    onDownload(item.link)
                  }}
                />
              )}
              {isShowButton.preview && (
                <BaseIconTooltip
                  title={t("common.board_office_preview_msg")}
                  id={`attachment-preview-${item.ii}`}
                  icon="mdi mdi-magnify"
                  className={`font-size-18 attachment-icon-item attachment-icon-preview ${
                    item?.preview || item?.preview2 || item?.preview3
                      ? "attachment-icon-hover"
                      : "cursor-not-allowed"
                  }`}
                  onClick={(e) => {
                    if (e) {
                      e.stopPropagation()
                      e.preventDefault()
                    }
                    item?.preview || item?.preview2 || item?.preview3 ? onPreview(item) : null
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GridMode
