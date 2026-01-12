// @ts-nocheck
import React from "react"
import HanIconFile from "components/Common/Attachment/HanIconFile"
import { useTranslation } from "react-i18next"
import BaseIconTooltip from "components/Common/BaseIconTooltip"
import { getExtensionFile } from "utils"

import "./style.scss"

const AttachmentForward = ({ fileList = [], onDeleteFile = () => {} }) => {
  const { t } = useTranslation()
  return (
    <div className={`mb-2 ${fileList && fileList.length > 5 && "list-scroll"}`}>
      {fileList.map(item => {
        const extension = getExtensionFile(item.name)
        return (
          <div
            key={item.ii}
            className="d-flex align-items-center justify-content-between"
          >
            <div className="d-flex align-items-center gap-2 mb-1">
              <HanIconFile extension={extension} />
              <h6 className="mb-0">{item.name}</h6>
            </div>
            <div className="d-flex align-items-center gap-3 mx-4">
              <BaseIconTooltip
                title={t("common.board_del_msg")}
                id={`forward-delete-${item.ii}`}
                icon="mdi mdi-delete"
                className="fs-5"
                onClick={() => onDeleteFile(item)}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default AttachmentForward
