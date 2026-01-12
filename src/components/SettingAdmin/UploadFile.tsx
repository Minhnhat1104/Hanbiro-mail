// @ts-nocheck
import React, { useState } from "react";
import {
  Form
} from "reactstrap";
import Dropzone from "react-dropzone";


const FormUpload = () => {

  const [selectedFiles, setselectedFiles] = useState([]);

  function handleAcceptedFiles(files) {
    files.map(file =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    )
    setselectedFiles(files)
  }

  /**
   * Formats the size
   */
  function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
  }

  return (
    <>
      <Form>
        <Dropzone
          onDrop={acceptedFiles => {
            handleAcceptedFiles(acceptedFiles)
          }}
        >
          {({ getRootProps, getInputProps }) => (

            <div>
              <div style={{ background: "#F6F6F6", border: "1px dashed #CED4DA", height: "unset", padding: "4px 0px", borderRadius: "4px" }}>
                <div
                  className="dz-message needsclick mt-2"
                  {...getRootProps()}
                  style={{ padding: "unset" }}
                >
                  <input {...getInputProps()} />
                  <div  style={{ marginBottom: "unset", display: "flex", justifyContent: "center" }}>

                    <div style={{ margin: "auto 0" }}> <i className="display-4 text-muted bx bxs-cloud-upload" /></div>
                    <div style={{ margin: "auto 0" }}>
                      <span className="han-h6 han-fw-semibold">Drop files here or click to upload.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Dropzone>

      </Form>
    </>
  )
}

export default FormUpload
