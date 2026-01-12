// @ts-nocheck
// React
import React from "react"

// Third-party
import { Row } from "reactstrap"

// Project
import { getExtensionFile } from "utils"

import GridMode from "./GridMode"
import ListMode from "./ListMode"

import "../style.scss"
import { getFilePermission } from "./utils"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"

const AttachmentMailList = ({
  mailList = [],
  gridMode = true,
  isChangeAttView,
  onActionModal = null,
  onDownload = null,
  onPreview = null,
  onDelete = null,
  canSaveCloudDisk = false,
  onSaveCloudDisk = null,
}) => {
  const { menu } = useParams()
  const config = useSelector((state) => state.Config)

  return (
    <>
      {gridMode ? (
        <div className="attachment-list d-flex flex-row gap-2 align-items-center w-100 overflow-hidden overflow-x-auto">
          {mailList.length > 0 &&
            mailList.map((item, index) => {
              const extension = getExtensionFile(item.name)
              return (
                <React.Fragment key={item.ii ?? index}>
                  <GridMode
                    item={item}
                    extension={extension}
                    onDownload={onDownload}
                    onPreview={onPreview}
                    isChangeAttView={isChangeAttView}
                    isShowButton={getFilePermission(item, config, menu)}
                  />
                </React.Fragment>
              )
            })}
        </div>
      ) : (
        <Row className="attachment-list">
          {mailList.length > 0 &&
            mailList.map((item, index) => {
              const extension = getExtensionFile(item.name)
              return (
                <React.Fragment key={item.ii ?? index}>
                  <ListMode
                    item={item}
                    extension={extension}
                    onActionModal={onActionModal}
                    onDownload={onDownload}
                    onPreview={onPreview}
                    onDelete={onDelete}
                    canSaveCloudDisk={canSaveCloudDisk}
                    onSaveCloudDisk={onSaveCloudDisk}
                    isShowButton={getFilePermission(item, config, menu)}
                  />
                </React.Fragment>
              )
            })}
        </Row>
      )}
    </>
  )
}

export default AttachmentMailList
