// @ts-nocheck
// React
import React, { useContext, useMemo } from "react"

// Third-party
import { useTranslation } from "react-i18next"
import { Col } from "reactstrap"

// Project
import HanIconFile from "components/Common/Attachment/HanIconFile"
import BaseIconTooltip from "components/Common/BaseIconTooltip"
import { MailContext } from "pages/Detail"
import BaseButtonTooltip from "../../../Common/BaseButtonTooltip"

const ListMode = ({
  item = {},
  extension = "",
  onActionModal = null,
  onDownload = null,
  onPreview = null,
  onDelete = null,
  canSaveCloudDisk = false,
  onSaveCloudDisk = null,
  isShowButton = {
    download: true,
    preview: true,
    delete: true,
    clouddisk: true,
  },
}) => {
  const { t } = useTranslation()
  const { mail, mid } = useContext(MailContext)

  const isPreview = useMemo(() => {
    return !!(item?.preview?.trim() || item?.preview2?.trim() || item?.preview3?.trim())
  }, [item])

  return (
    <Col xs={12} className="att-list-item d-flex align-items-center justify-content-between gap-2">
      <span
        className="h-100 text-truncate"
        type="button"
        onClick={() => isShowButton.download && onDownload && onDownload(item.link)}
      >
        <HanIconFile extension={extension} />
        <span className="att-name mb-0 han-body2 han-fw-regular han-text-primary">
          {item.name}
        </span>{" "}
        <span className="mb-0 han-h6 han-fw-regular han-text-secondary">({item.filesize})</span>
      </span>

      <div className="d-flex align-items-center gap-2 mx-2">
        {isShowButton?.clouddisk && canSaveCloudDisk && (
          <BaseButtonTooltip
            outline
            title={t("common.board_webdisk_add_msg")}
            className={`btn-outline-grey btn-action-icon px-2 py-0`}
            icon="mdi mdi-content-save-plus font-size-16"
            onClick={() => onSaveCloudDisk(item.link)}
          />
        )}

        {isShowButton.download && (
          <BaseButtonTooltip
            outline
            title={t("common.board_download_msg")}
            className={`btn-outline-grey btn-action-icon px-2 py-0`}
            icon="mdi mdi-download font-size-16"
            onClick={() => onDownload && onDownload(item.link)}
          />
        )}
        {isShowButton.preview && isPreview && (
          <BaseButtonTooltip
            outline
            title={t("common.board_office_preview_msg")}
            className={`btn-outline-grey btn-action-icon px-2 py-0 ${
              isPreview ? "" : "cursor-not-allowed"
            }`}
            icon="mdi mdi-magnify font-size-16"
            onClick={(e) => {
              if (e) {
                e.stopPropagation()
                e.preventDefault()
              }
              isPreview ? onPreview(item) : null
            }}
          />
        )}
        {isShowButton.delete && (
          <BaseButtonTooltip
            outline
            title={t("common.board_del_msg")}
            className={`btn-outline-grey btn-action-icon px-2 py-0`}
            icon="mdi mdi-trash-can font-size-16"
            onClick={() =>
              onActionModal(t("common.board_del_msg"), onDelete, mail.acl, mid, item.ii)
            }
          />
        )}
      </div>
    </Col>
  )
}

export default ListMode
