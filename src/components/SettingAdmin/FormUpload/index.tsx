// @ts-nocheck
// React
import React, { createRef } from "react"

// Third-party
import { Row, Col, Card, Form } from "reactstrap"
import Dropzone from "react-dropzone"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"

// Project
import { BaseButton } from "components/Common"

const FormUpload = ({ selectedFiles, setSelectedFiles, accept, multiple }) => {
  const { t } = useTranslation()

  /**
   * Formats the size
   */
  const formatBytes = (bytes = 0, decimals = 2) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
  }

  // Handle add file
  const handleAcceptedFiles = (files = []) => {
    files.map(file =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    )
    setSelectedFiles(files)
  }

  const dropzoneRef = createRef()
  // Handle change file
  const handleChange = () => {
    if (dropzoneRef.current) {
      dropzoneRef.current.open()
    }
  }

  // Handle remove file
  const handleDelete = () => setSelectedFiles([])

  return (
    <>
      <Form>
        <Dropzone
          ref={dropzoneRef}
          onDrop={acceptedFiles => {
            handleAcceptedFiles(acceptedFiles)
          }}
          accept={accept}
          multiple={multiple}
        >
          {({ getRootProps, getInputProps }) => (
            <div className="dropzone">
              <div className="dz-message needsclick mt-2" {...getRootProps()}>
                <input {...getInputProps()} />
                <div className="mb-3">
                  <i className="display-4 text-muted bx bxs-cloud-upload" />
                </div>
                <h4>{t("common.profile_select_image_for_upload")}</h4>
              </div>
            </div>
          )}
        </Dropzone>
        <div className="dropzone-previews mt-3" id="file-previews">
          {selectedFiles.map((f, i) => {
            return (
              <Card
                className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                key={i + "-file"}
              >
                <div className="p-2">
                  <Row className="align-items-center">
                    <Col className="col-auto">
                      <img
                        data-dz-thumbnail=""
                        height="80"
                        className="avatar-sm rounded bg-light"
                        alt={f.name}
                        src={f.preview}
                      />
                    </Col>
                    <Col className="d-flex align-items-center justify-content-between">
                      <div>
                        {" "}
                        <Link to="#" className="text-muted font-weight-bold">
                          {f.name}
                        </Link>
                        <p className="mb-0">
                          <strong>{f.formattedSize}</strong>
                        </p>
                      </div>
                      <div className="d-flex gap-2">
                        <BaseButton color="primary" onClick={handleChange}>
                          Change
                        </BaseButton>
                        <BaseButton color="danger" onClick={handleDelete}>
                          Delete
                        </BaseButton>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Card>
            )
          })}
        </div>
      </Form>
    </>
  )
}

export default FormUpload
