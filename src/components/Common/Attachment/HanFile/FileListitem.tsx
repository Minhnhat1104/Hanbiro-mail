// @ts-nocheck
import { Download, Search, Trash2, UploadCloud } from "react-feather"

import { useTheme } from "@mui/material"

import HanTooltip from "components/Common/HanTooltip"
import HanIconFile from "../HanIconFile"
import { useTranslation } from "react-i18next"
import "./styles.scss"
import LinearWithMiddleLabel from "components/Common/Loading/LinearWithLabel"
import { Col, Row } from "reactstrap"

const FileListItem = (props) => {
  const {
    extension = "",
    name = "",
    expireInfo = "",
    size = "",
    progress = 0,
    onDelete = null,
    hideProgress = false,
    onDownload = null,
    onPreview = null,
    onUploadCloudDisk,
    buttonDisplay = {
      preview: false,
      delete: true,
      download: true,
      cloudDisk: false,
    },
    mode = "PC",
    isCloudDiskModal = false, // Check if it is Select files from CloudDisk Modal or not
  } = props

  const { t } = useTranslation()

  return (
    <div className="w-100">
      <Row className="w-100" noGutters>
        <Col xs={mode !== "PC" ? 11 : 9}>
          <div className="d-flex align-items-center gap-1 w-100">
            <div className="">
              <HanIconFile extension={extension} padding="p-0" />
            </div>
            <div
              className="d-flex"
              style={{
                width: "calc(100% - 20px)",
              }}
            >
              <div
                onClick={(e) => {
                  e.preventDefault()
                }}
                className="text-truncate"
                style={{
                  maxWidth: "calc(100% - 100px)",
                }}
              >
                {name}
                {expireInfo !== "" && ` (${expireInfo})`}
              </div>
              <div className="han-text-secondary" style={{ maxWidth: 100 }}>{`(${size})`}</div>
            </div>
          </div>
        </Col>

        <Col xs={mode !== "PC" ? 1 : 3} className="d-flex gap-2 justify-content-end">
          {!hideProgress && progress !== undefined && (
            <LinearWithMiddleLabel
              value={typeof progress === "number" ? progress : 0}
              containerSx={{
                flexGrow: 1,
              }}
              sx={{
                borderRadius: 10,
                height: 14,
                "& .MuiLinearProgress-bar": {
                  borderRadius: 0,
                },
              }}
            />
          )}
          <div className="d-flex justify-content-end align-items-center gap-2">
            {buttonDisplay.download && (
              <HanTooltip overlay={t("common.board_download_msg")} placement="top">
                <Download
                  size={16}
                  strokeWidth={2}
                  className="han-color-grey cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault()
                    onDownload && onDownload()
                  }}
                />
              </HanTooltip>
            )}
            {buttonDisplay.cloudDisk && (
              <HanTooltip overlay={t("common.board_webdisk_add_msg")} placement="top">
                <UploadCloud
                  size={16}
                  strokeWidth={2}
                  className="han-color-grey cursor-pointer"
                  onClick={() => onUploadCloudDisk && onUploadCloudDisk()}
                />
              </HanTooltip>
            )}
            {buttonDisplay.preview && (
              <HanTooltip overlay={t("common.board_office_preview_msg")} placement="top">
                <Search
                  size={16}
                  strokeWidth={2}
                  onClick={() => onPreview && onPreview()}
                  className="han-color-grey cursor-pointer"
                />
              </HanTooltip>
            )}
            {buttonDisplay.delete && (
              <HanTooltip overlay={t("common.common_delete_msg")} placement="top">
                <Trash2
                  size={16}
                  strokeWidth={2}
                  onClick={() => onDelete && onDelete()}
                  className="han-color-grey cursor-pointer"
                />
              </HanTooltip>
            )}
          </div>
        </Col>
      </Row>
    </div>
  )
}

export default FileListItem
