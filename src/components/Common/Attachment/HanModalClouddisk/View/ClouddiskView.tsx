// @ts-nocheck
import React, { useState } from "react"
import FileListItem from "../File/FileListItem"
import FolderListItem from "../Folder/FolderListItem"
import * as Utils from "../utils"
import File from "../File"
import Folder from "../Folder"
import ClouddiskPagination from "../ClouddiskPagination/ClouddiskPagination"
import { useTranslation } from "react-i18next"
import { ContextMenuModal } from "."
import useRemoteFile from "../hook/useRemoteFile"
import "./style.scss"
import NoData from "components/Common/NoData"
import { Row, Col } from "reactstrap"
import PaginationV2 from "components/Common/Pagination/PaginationV2"
import { getExtensionFile } from "utils"

const ClouddiskView = ({
  mode,
  data: { folders, files },
  metadata: { fileChoosed, pagination },
  metaAction: { goToPage, onToggleCheck, onOpenFolder, onRefresh },
}) => {
  const { t } = useTranslation()
  const [openCreateFolder, setOpenCreateFolder] = useState(false)
  const [dataModalEdit, setDataModalEdit] = useState({
    mode: "new",
    title: t("common.admin_folder_add_msg"),
  })
  const [folderName, setFolderName] = useState("")
  const [creating, setCreating] = useState(false)
  const { deleteFiles, downloadFiles, updateFolder } = useRemoteFile()
  const onStartUpdateFolder = ({ id = "", name = "" }) => {
    setDataModalEdit({
      mode: "edit",
      title: t("common.admin_folder_edit_msg"),
      id: id,
    })
    setOpenCreateFolder(true)
    setFolderName(name)
  }
  const onHandleSaveFolder = async () => {
    const res = await updateFolder({
      id: dataModalEdit.id,
      folderName: folderName,
    })
    if (res.success) {
      // displayAlert(res.success, res.msg)
      setCreating(false)
      onRefresh?.()
      setFolderName("")
      setOpenCreateFolder(false)
    } else {
      // TODO : notify
    }
  }

  const renderModalContentFolder = () => {
    return (
      <form className="pd-l-25 pd-r-25">
        <div className="form-group">
          <label htmlFor="formGroupExampleInput" className="d-block">
            {t("common.task_folder_name")}
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="Enter folder name"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
          />
        </div>
      </form>
    )
  }

  return (
    <div className="h-100 d-flex flex-column justify-content-between gap-3 flex-1">
      <Row
        className={`${mode === "grid" ? "g-3 clouddisk-grid-view" : "clouddisk-list-view py-0"}`}
      >
        {mode == "grid" ? (
          <>
            {folders.map((item, index) => (
              <Folder
                key={item.id}
                id={item.id}
                name={item.name}
                description={Utils.getDescriptionFolder(item)}
                onOpen={() => onOpenFolder(item)}
                onDownload={() => downloadFiles(item.id)}
                onDelete={async () => {
                  const res = await deleteFiles(item.id)
                  if (res.success) {
                    onRefresh?.()
                  } else {
                    //TODO: notify
                  }
                }}
                onRename={() => onStartUpdateFolder({ id: item.id, name: item.name })}
              />
            ))}
            {files.map((item, index) => (
              <File
                key={item.id}
                isChoosed={fileChoosed.hasOwnProperty(item.id)}
                name={item.name}
                extension={getExtensionFile(item.text)}
                size={Utils.humanFileSize(item.size)}
                author={item.author}
                onToggleCheck={() => onToggleCheck(item)}
                onDownload={() => downloadFiles(item.id)}
                onDelete={() =>
                  deleteFiles(item.id).finally(() => {
                    onRefresh?.()
                  })
                }
                onRename={() => onStartUpdateFolder({ id: item.id, name: item.name })}
              />
            ))}
          </>
        ) : (
          <>
            {folders.map((item, index) => (
              <FolderListItem
                key={item.id}
                id={item.id}
                name={item.name}
                description={Utils.getDescriptionFolder(item)}
                onOpen={() => onOpenFolder(item)}
                onDownload={() => downloadFiles(item.id)}
                onDelete={() => {
                  deleteFiles(item.id).finally(() => {
                    onRefresh?.()
                  })
                }}
                onRename={() => onStartUpdateFolder({ id: item.id, name: item.name })}
              />
            ))}
            {files.map((item, index) => (
              <FileListItem
                key={item.id}
                isChoosed={fileChoosed.hasOwnProperty(item.id)}
                name={item.name}
                extension={getExtensionFile(item.text)}
                size={Utils.humanFileSize(item.size)}
                author={item.author}
                onToggleCheck={() => onToggleCheck(item)}
                onDownload={() => downloadFiles(item.id)}
                onDelete={() => {
                  deleteFiles(item.id).finally(() => {
                    onRefresh?.()
                  })
                }}
                onRename={() => onStartUpdateFolder({ id: item.id, name: item.name })}
              />
            ))}
          </>
        )}

        <ContextMenuModal
          isOpen={openCreateFolder}
          title={dataModalEdit.title}
          isLoading={creating}
          handleClose={() => setOpenCreateFolder(false)}
          buttonActions={{
            onCancel: () => setOpenCreateFolder(false),
            onConfirm: onHandleSaveFolder,
          }}
          renderBody={renderModalContentFolder}
        />
      </Row>
      {pagination?.totalItems === 0 && <NoData />}
      {/* <ClouddiskPagination
        pagination={pagination}
        onPrevHandle={() => goToPage(pagination.page - 1)}
        onNextHandle={() => goToPage(pagination.page + 1)}
      /> */}
      <PaginationV2
        pageCount={pagination.totalItems}
        pageSize={pagination.limit}
        pageIndex={pagination.page}
        onChangePage={goToPage}
        hideRowPerPage={true}
        isNoPaddingX
        hideBorderTop
      />
    </div>
  )
}

export default ClouddiskView
