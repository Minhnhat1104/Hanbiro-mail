// @ts-nocheck
import BaseButton from "components/Common/BaseButton"
import { default as BaseIcon, default as HanIcon } from "components/Common/BaseIcon"
import BaseModal from "components/Common/BaseModal"
import HanDatePicker from "components/Common/HanDatePicker"
import { useCustomToast } from "hooks/useCustomToast"
import useDevice from "hooks/useDevice"
import moment from "moment"
import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { Button, Col, Row } from "reactstrap"
import FileListItem from "../HanFile/FileListitem"
import { ClouddiskUpload } from "./ClouddiskUpload"
import FilterSearch from "./FilterSearch"
import CreateFolderInline from "./Folder/CreateFolderInline"
import LevelFolder from "./LevelFolder"
import { Search } from "./Search"
import TabUpload from "./TabUpload"
import Tabs from "./Tabs"
import { ClouddiskView } from "./View"
import * as api from "./api"
import "./dashforge.filemgr.css"
import useClouddisk from "./hook/useClouddisk"
import useRemoteFile from "./hook/useRemoteFile"
import "./styles.scss"
import { humanFileSize } from "./utils"
import { getExtensionFile } from "utils"

function index({
  isShowTitle = true,
  onChange = () => {},
  files = [],
  setFiles = () => {},
  setOpenClouddisk,
  buttonComponent = null,
  isOpen = false,
  className = "",
  buttonClassName = "",
}) {
  const { t } = useTranslation()
  const { isMobile, isTablet } = useDevice()
  const { downloadFiles } = useRemoteFile()
  const { successToast, errorToast } = useCustomToast()
  const {
    currentFolderId,
    data,
    fileChoosed,
    fileChoosedArr,
    filterChoosed,
    firstLoading,
    foldersMenu,
    isCreateFolder,
    keyword,
    loading,
    pagination,
    tabs,
    tabChoosed,
    viewMode,
    typeSearchChoosed,
    onRemoveAll,
    changeViewMode,
    goToPage,
    onChangeTab,
    onChangeFilterSearch,
    onCreateFolder,
    onGetFilesSearch,
    onOpenFolder,
    onPressMenu,
    onRefresh,
    onSearch,
    onToggleCheck,
    setKeyword,
    toggleCreateNewFolder,
    setTypeSearchChoosed,
  } = useClouddisk()

  const [expiredDate, setExpiredDate] = useState(() => moment().add(1, "month").toDate())
  const [downloadCount, setDownloadCount] = useState(100)
  const [saving, setSaving] = useState(false)
  const clouddiskUploadRef = useRef(null)
  const [amountUploadClouddiskAttachments, setAmountUploadClouddiskAttachments] = useState(0)

  // side effect
  useEffect(() => {
    if (isMobile) {
      changeViewMode && changeViewMode("list")
    }
  }, [isMobile])

  const getDataWithType = (type) => {
    let dataNew = []
    if (data.files && data.files.length > 0) {
      dataNew = data.files.filter((item) => item.type == type)
    }

    return dataNew
  }

  const onChangeTypeSearch = (type) => {
    setTypeSearchChoosed(type)
  }

  const onGetLinkFile = () => {
    setSaving(true)
    const filesParam = fileChoosedArr.map((key) => {
      const file = fileChoosed[key]
      return {
        id: file.id,
        name: file.name,
        count: downloadCount,
        expire: moment(expiredDate, "MM/DD/YYYY").unix(),
      }
    })
    const params = {
      mode: "set",
      files: JSON.stringify(filesParam),
    }
    api.getLinkFiles(params).then((res) => {
      if (res.success) {
        // onChange(res.data);
        const filesLink = res.data.map((file) => ({
          ...file,
          // id: file.link,
          name: file.name,
          expire: expiredDate,
          download: downloadCount,
          size: file.size,
          isCloudDisk: true,
        }))
        const filesNew = files.concat(filesLink)
        setFiles(filesNew)
        onChange(filesLink)
      } else {
        errorToast(res?.msg ?? t("common.alert_update_query_error"))
      }
      setSaving(false)
      setOpenClouddisk(false)
      onRemoveAll()
    })
  }

  const renderModalTitle = () => t("common.common_select_file_from_clouddisk_msg")

  const renderLoading = () => {
    return (
      <div
        className={`position-absolute z-3 d-flex w-100 h-100 justify-content-center align-items-center pd-20`}
      >
        <div className="spinner-border han-color-primary" role="status">
          <span className="sr-only"></span>
        </div>
      </div>
    )
  }

  const renderFormSetting = () => {
    return (
      <div className="view-form-setting">
        <span className="han-h4 view-form-setting__header">
          {t("mail.mail_set_pop3_expiry_date")}
        </span>
        <div className="mt-3 view-form-setting__content d-flex flex-column gap-2">
          <div className="d-flex align-items-center mg-t-10">
            <span className="han-h5 han-fw-medium han-text-secondary wd-200 view-form-setting__label">
              {t("mail.mail_clouddisk_max_count")}
            </span>
            <div className="input-group mg-b-10">
              <input
                type="number"
                className="form-control"
                placeholder="0"
                aria-label="Recipient's username"
                aria-describedby="basic-addon2"
                min="0"
                value={downloadCount}
                onChange={(e) => setDownloadCount(e.target.value)}
              />
            </div>
          </div>
          <div className="d-flex align-items-center mg-t-10 ">
            <span className="han-h5 han-fw-medium han-text-secondary view-form-setting__label">
              {t("mail.mail_set_pop3_expiry_date")}
            </span>
            <HanDatePicker
              value={expiredDate}
              onChange={(date) => setExpiredDate(date)}
              dateFormat="dd/MM/yyyy"
            />
          </div>
        </div>
      </div>
    )
  }

  const renderTab = () => {
    return (
      <>
        <div className="content-clouddisk d-flex flex-column gap-3">
          <div className="pd-10 pd-t-20 d-flex flex-wrap justify-content-between gap-3">
            <div className="d-flex gap-2">
              {/* <SearchType typeSearchChoosed={typeSearchChoosed} /> */}
              <Search
                keyword={keyword}
                setKeyword={setKeyword}
                onSearch={onSearch}
                typeSearchChoosed={typeSearchChoosed}
                onChangeTypeSearch={onChangeTypeSearch}
              />
              <BaseButton
                color="grey"
                className="btn-action"
                onClick={(e) => {
                  e.preventDefault()
                  onRefresh()
                }}
              >
                <HanIcon className="fas fa-sync-alt" />
              </BaseButton>
            </div>
            <div className="d-flex justify-content-end">
              <FilterSearch filterChoosed={filterChoosed} onChange={onChangeFilterSearch} />
              {tabChoosed?.access?.upload && (
                <>
                  {/* <ChooseFile onChange={onChangeChooseFile} /> */}
                  <Button
                    color="grey"
                    className="btn-action mg-l-10 d-flex align-items-center justify-content-center"
                    onClick={toggleCreateNewFolder}
                  >
                    <HanIcon className="bx bxs-folder-plus me-1" style={{ marginLeft: 4 }} />
                    {t("common.admin_folder_add_msg")}
                  </Button>
                </>
              )}
            </div>
          </div>
          {tabChoosed?.access?.upload && (
            <div className="d-flex flex-column gap-2">
              {isCreateFolder && (
                <CreateFolderInline
                  handleCreateFolder={(name) => {
                    onCreateFolder(name)
                  }}
                  handleCancel={() => {
                    toggleCreateNewFolder(false)
                  }}
                />
              )}
              <ClouddiskUpload
                ref={clouddiskUploadRef}
                onFilesChange={(att) =>
                  setAmountUploadClouddiskAttachments(Object.keys(att)?.length ?? 0)
                }
              />
            </div>
          )}

          <div className="container-clouddisk h-100 d-flex flex-1 overflow-x-hidden overflow-y-auto">
            <div className="position-relative pd-t-10 pd-l-25 pd-r-25 d-flex flex-column w-100 gap-3">
              <div className="container-clouddisk__header d-flex align-items-center justify-content-between rounded-2">
                <span className="ps-2">
                  <LevelFolder folders={foldersMenu} onPress={onPressMenu} />
                </span>
                <div className="d-flex gap-2 align-items-center">
                  {tabChoosed?.access?.upload && amountUploadClouddiskAttachments > 0 && (
                    <BaseButton
                      icon="bx bx-plus"
                      color="primary"
                      size="sm"
                      onClick={() => {
                        clouddiskUploadRef.current?.uploadFile(currentFolderId, {
                          reloadHandler: onRefresh,
                        })
                      }}
                    >
                      {t("mail.mail_set_pop3_add")}
                    </BaseButton>
                  )}
                  {!isMobile && (
                    <div className="clouddisk-view__mode d-flex overflow-hidden">
                      <BaseIcon
                        icon={"fa fa-list"}
                        className={`btn-view ${viewMode == "list" ? "active" : ""}`}
                        onClick={() => changeViewMode("list")}
                      />
                      <BaseIcon
                        icon={"bx bxs-grid-alt"}
                        className={`btn-view ${viewMode == "grid" ? "active" : ""}`}
                        onClick={() => changeViewMode("grid")}
                      />
                    </div>
                  )}
                </div>
              </div>
              {loading && renderLoading()}
              <ClouddiskView
                mode={viewMode}
                data={{
                  folders: getDataWithType("dir"),
                  files: getDataWithType("file"),
                }}
                metadata={{
                  fileChoosed,
                  pagination,
                }}
                metaAction={{
                  goToPage,
                  onToggleCheck,
                  onOpenFolder,
                  onRefresh,
                }}
              />
            </div>
          </div>
        </div>
      </>
    )
  }

  const renderModalContent = () => {
    if (firstLoading) {
      return renderLoading()
    }
    return (
      <div className="h-100 common-han-modal-clouddisk">
        <Row className={`d-flex gx-lg-3 gy-3 gy-lg-0 ${isMobile ? "" : "h-100"}`}>
          <Col xs={12} lg={7} className="left-content h-100 section__view ">
            <div className="h-100 d-flex flex-column gap-2 border rounded-2 p-3">
              <Tabs tabs={tabs} tabChoosed={tabChoosed} onChange={onChangeTab} />
              {tabChoosed.id != -1 ? renderTab() : <TabUpload />}
            </div>
          </Col>
          <Col xs={12} lg={5} className="h-100 right-content">
            <div className="h-100 d-flex flex-column gap-2 border rounded-2 p-3">
              <div className="d-flex justify-content-between">
                <div className="han-h4 py-2">{t("mail.mail_cloud_disk_selected_files")}</div>
                <BaseButton
                  outline
                  size="sm"
                  onClick={onRemoveAll}
                  className={"btn-action"}
                  icon={"mdi mdi-trash-can-outline font-size-18"}
                  iconClassName="me-0"
                />
              </div>
              <div className="content-clouddisk-right flex-1 flex-grow-1 overflow-y-auto overflow-x-hidden">
                <div className="h-100 d-flex flex-column gap-1">
                  {fileChoosedArr.length > 0 ? (
                    fileChoosedArr.map((key) => {
                      const item = fileChoosed[key]
                      return (
                        <div key={key} className="file-selected-item">
                          <FileListItem
                            extension={getExtensionFile(item.text)}
                            name={item.name}
                            size={humanFileSize(item.size)}
                            onDelete={() => onToggleCheck(item)}
                            hideProgress={true}
                            onDownload={() => {
                              downloadFiles(item.id)
                            }}
                          />
                        </div>
                      )
                    })
                  ) : (
                    <div className="h-100 d-flex justify-content-center align-items-center">
                      {t("common.alert_data_empty")}
                    </div>
                  )}
                </div>
              </div>
              {renderFormSetting()}
            </div>
          </Col>
        </Row>
      </div>
    )
  }

  const renderModalFooter = () => {
    return (
      <div className="w-100 d-flex justify-content-end gap-2">
        <BaseButton
          outline
          color="grey"
          onClick={() => {
            setOpenClouddisk(false)
            onRemoveAll()
          }}
        >
          {t("common.common_cancel")}
        </BaseButton>
        <BaseButton color="primary" onClick={onGetLinkFile} loading={saving}>
          {t("common.common_btn_save")}
        </BaseButton>
      </div>
    )
  }

  return (
    <div className={className}>
      <BaseModal
        size="xl"
        open={isOpen}
        fullScreenMode={false}
        modalClass={isTablet ? "modal-w-80" : ""}
        contentClassName="common-han-modal-root"
        renderHeader={renderModalTitle}
        renderBody={renderModalContent}
        renderFooter={renderModalFooter}
        id="clouddisk-modal"
        toggle={() => {
          setOpenClouddisk(false)
        }}
      />
    </div>
  )
}

export default index
