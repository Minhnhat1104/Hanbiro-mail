// @ts-nocheck
import React, { useRef } from "react"
import BaseIcon from "components/Common/BaseIcon"
import { getExtensionFile } from "../utils"

function index({ onChange = () => {}, disabled = false }) {
  const ref = useRef(null)
  const handleChange = event => {
    const fileUploaded = event.target.files
    const timestamp = new Date().getTime()
    const files = Object.keys(fileUploaded).map((key, index) => {
      const file = fileUploaded[key]
      return {
        id: timestamp + index,
        file: file,
        name: file.name,
        size: file.size,
        author: "",
        ext: getExtensionFile(file.name),
        type: "file",
      }
    })
    onChange(files)
  }

  const openChooseFile = () => {
    ref.current.click()
  }

  return (
    <>
      <button
        className="btn btn-primary mg-l-10"
        type="button"
        onClick={e => {
          e.preventDefault()
          openChooseFile()
        }}
        disabled={disabled}
      >
        Upload Files
        <BaseIcon name="bx bxs-file-plus" style={{ marginLeft: 4 }} />
      </button>
      <input
        multiple="multiple"
        type="file"
        ref={ref}
        onChange={handleChange}
        style={{ display: "none" }}
      />
    </>
  )
}

export default index
