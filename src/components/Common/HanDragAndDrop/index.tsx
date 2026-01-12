// @ts-nocheck
import React, { useMemo } from "react"
import { useDropzone } from "react-dropzone"
import HanIcon from "../Attachment/HanIcon"
import "./styles.scss"
import BaseIcon from "components/Common/BaseIcon"
import { useTranslation } from "react-i18next"
import { humanFileSize } from "utils"
import { Upload, UploadCloud } from "react-feather"
const baseStyle = {
  flex: "1 1 100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 4,
  borderColor: "var(--bs-border-color",
  borderStyle: "dashed",
  backgroundColor: "white",
  color: "var(--han-text-primary)",
  outline: "none",
  transition: "border .24s ease-in-out",
  height: 65,
}
const customStyle = {
  flex: "1 1 100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "10px",
  borderWidth: 1.5,
  borderRadius: 4,
  borderColor: "var(--bs-border-color",
  borderStyle: "dashed",
  backgroundColor: "white",
  color: "var(--han-text-primary)",
  outline: "none",
  transition: "border .24s ease-in-out",
}

const focusedStyle = {
  borderColor: "var(--bs-primary)",
  borderWidth: 2,
}

const acceptStyle = {
  borderColor: "var(--bs-primary)",
  borderWidth: 2,
}

const rejectStyle = {
  borderColor: "var(--bs-primary)",
  borderWidth: 2,
}

function HanDragAndDrop({
  onDrop,
  custom = false,
  mode = "PC",
  handleOpenClouddisk = () => {},
  maxSize,
}) {
  const { getRootProps, getInputProps, isFocused, isDragActive, isDragAccept, isDragReject } =
    useDropzone({
      onDrop: onDrop,
    })
  const { t } = useTranslation()

  const style = useMemo(
    () => ({
      ...(custom ? customStyle : baseStyle),
      ...(isDragActive ? focusedStyle : {}),
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragReject, isDragAccept],
  )

  return (
    <>
      {mode == "PC" ? (
        <div className={`han-drap-drop ${custom ? "han-drap-drop-custom-padding" : ""}`}>
          <div
            {...getRootProps({ style })}
            className="han-drap-drop-wrapper h-100 justify-content-center"
          >
            <input {...getInputProps()} />
            <div className="d-flex flex-column align-items-center h-100 justify-content-center">
              <UploadCloud strokeWidth={2} color="var(--bs-grey)" />
              <span className="han-h6 han-fw-regular han-text-primary" style={{ marginLeft: 4 }}>
                {t("common.common_drag_to_upload_msg")}
              </span>
              {maxSize && (
                <div className="d-flex gap-1">
                  <span className="han-h6 han-fw-regular han-text-primary">
                    {t("admin.admin_analysis_usage_setting_max_upload_size")}
                  </span>
                  <span className="han-h6 han-fw-semibold">
                    {maxSize ? humanFileSize(maxSize) : ""}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div
          className={`han-drap-drop ${custom ? "han-drap-drop-custom-padding" : ""}`}
          onClick={() => handleOpenClouddisk()}
        >
          <div
            {...getRootProps({ style })}
            onClick={() => {}}
            className="han-drap-drop-wrapper h-100"
          >
            <input {...getInputProps()} />
            <div className="d-flex flex-column gap-1 align-items-center h-100 justify-content-center">
              <UploadCloud strokeWidth={2} color="var(--bs-grey)" />
              <span className="han-h6 han-fw-semibold" style={{ marginLeft: 4 }}>
                {t("common.common_select_file_from_clouddisk_msg")}
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default HanDragAndDrop
