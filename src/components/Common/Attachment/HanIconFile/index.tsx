// @ts-nocheck
import React, { lazy } from "react"
import { FILES2 } from "./icons"
import "./styles.scss"

function HanIconFile({ extension = "", className, padding = "p-1" }) {
  const renderIcon = () => {
    switch (extension.toLowerCase()) {
      case "avi":
        return FILES2["avi"]
      case "css":
        return FILES2["css"]
      case "doc":
      case "docx":
      case "word":
        return FILES2["doc"]
      case "html":
        return FILES2["html"]
      case "jpg":
      case "jpeg":
      case "gif":
      case "image":
        return FILES2["jpg"]
      case "mp4":
      case "flv":
      case "mov":
      case "video":
        return FILES2["mp4"]
      case "mp3":
        return FILES2["mp3"]
      case "pdf":
        return FILES2["pdf"]
      case "png":
        return FILES2["png"]
      case "ppt":
      case "pptx":
      case "powerpoint":
        return FILES2["ppt"]
      case "txt":
        return FILES2["txt"]
      case "wav":
        return FILES2["wav"]
      case "xls":
      case "XLS":
      case "xlsx":
      case "excel":
        return FILES2["xls"]
      case "zip":
      case "archive":
        return FILES2["zip"]
      case "default":
        return FILES2["etc"]
      default:
        return FILES2["etc"]
    }
  }

  return (
    <span
      className={`att-icon d-inline-block ${padding} ${
        className ? className : "co-manage-han-icon-file"
      }`}
    >
      {renderIcon()}
    </span>
  )
}

export default HanIconFile
