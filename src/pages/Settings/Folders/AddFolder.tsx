// @ts-nocheck
import { BaseButton } from "components/Common"
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { Card, Col, FormGroup, Input, Label } from "reactstrap"
import TreeFolders from "./TreeFolders"
import { isEmpty } from "lodash"
import { useCustomToast } from "hooks/useCustomToast"
import {
  createFolders,
  updateFolders,
  deleteFolders,
  getUsersShare,
  getFolders,
} from "modules/mail/settings/api"
import Collapse from "@mui/material/Collapse"
import SelectFolder from "./SelectFolder"
import { permissionOptions } from "constants/settings/folders"
import { useDispatch } from "react-redux"
import { getEmailConfig } from "store/emailConfig/actions"

const AddFolder = ({ setOpenModal, setBoxId, onAction, onScrollPage }, ref) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [isOpen, setIsOpen] = useState(true)
  const [isExpand, setIsExpand] = useState(false)
  const [folders, setFolders] = useState([])
  const [folderSelected, setFolderSelected] = useState(null)
  const [folderSelectedToCreate, setFolderSelectedToCreate] = useState(null)
  console.log("folderSelectedToCreate:", folderSelectedToCreate)
  const [folderSelectedToUpdate, setFolderSelectedToUpdate] = useState(null)
  console.log("folderSelectedToUpdate:", folderSelectedToUpdate)
  const [newFolderName, setNewFolderName] = useState("")
  const [loading, setLoading] = useState(false)
  const [shareUsers, setShareUsers] = useState([])
  const [isLoadingShareUsers, setIsLoadingShareUsers] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const { successToast, errorToast } = useCustomToast()

  const saveRef = useRef()
  const selectFolderRef = useRef()

  useImperativeHandle(
    ref,
    () => {
      return {
        refreshFolderList: () => getFolderList(),
        getUserShareList: (isShare) => getUserShareList(folderSelected, isShare),
      }
    },
    [folderSelected],
  )

  useEffect(() => {
    // isExpand && resetForm()
    setTimeout(() => {
      if (saveRef?.current) {
        isExpand && saveRef.current?.scrollIntoView({ behavior: "smooth" })
      }
    }, 500)
  }, [isExpand])

  useEffect(() => {
    if (folderSelected && folderSelected?.name) {
      setNewFolderName(folderSelected?.name)
    }
  }, [folderSelected])

  useEffect(() => {
    getFolderList()
  }, [])

  const getFolderList = () => {
    const params = {
      reverse: "0",
      root: "source",
    }
    getFolders(params).then((res) => {
      setFolders(res.mailbox)
    })
  }

  const getUserShareList = (folder = folderSelected, isShare = true) => {
    if (!isShare) {
      setShareUsers([])
      return
    }
    getUsersShare(folder?.id).then((res) => {
      if (res.success) {
        setShareUsers(res.rows)
      }
      setIsLoadingShareUsers(false)
    })
  }

  const handleSelectFolder = (folder) => {
    if (folder && !isEmpty(folder)) {
      setBoxId(folder.id ?? folder.key)
      setFolderSelected(folder)
      handleSelectFolderToUpdateFolder(folder?.preid !== "-" ? folder?.preid : "")
      if (!isExpand) {
        setIsExpand(true)
      }
      if (folder?.isshare) {
        setIsLoadingShareUsers(true)
        // getUsersShare(folder.id).then(res => {
        //   if (res.success) {
        //     setShareUsers(res.rows)
        //   }
        //   setIsLoadingShareUsers(false)
        // })
        getUserShareList(folder)
      } else {
        if (!isEmpty(shareUsers)) {
          setShareUsers([])
        }
      }
    }
  }

  const handleSaveFolder = () => {
    if (isEmpty(folderSelected)) {
      let params = {}
      if (!isEmpty(folderSelectedToCreate)) {
        params = {
          root: folderSelectedToCreate.key ?? folderSelectedToCreate.id,
          name: newFolderName,
        }
      } else {
        params = {
          root: "source",
          name: newFolderName,
        }
      }
      setLoading(true)
      try {
        createFolders(params).then((res) => {
          if (res.mailbox.result === "success") {
            successToast()
            resetForm(true)
            setNewFolderName("")
          } else {
            throw new Error(res?.mailbox?.msg)
          }
        })
      } catch (error) {
        errorToast(error)
      }
      setLoading(false)
    } else {
      const params = {
        key: folderSelected?.key,
        boxkey: folderSelectedToUpdate?.key || "",
        name: newFolderName,
      }
      setLoading(true)
      try {
        updateFolders(params).then((res) => {
          if (res.mailbox.result === "success") {
            successToast()
            resetForm(true)
            setNewFolderName("")
            setFolderSelected(null)
          } else {
            errorToast(res?.mailbox?.msg)
          }
        })
      } catch (error) {
        errorToast(error)
      }
      setLoading(false)
    }
  }

  const onDeleteFolder = () => {
    if (isEmpty(folderSelected)) return
    const params = {
      key: folderSelected.key,
    }
    setLoading(true)
    deleteFolders(params).then((res) => {
      setLoading(false)
      if (res.mailbox.result === "success") {
        successToast()
        resetForm(true)
      } else {
        errorToast(res?.mailbox?.msg)
      }
    })
  }

  const resetForm = (isNew) => {
    setBoxId("")
    setIsLoaded(false)
    if (folderSelected) {
      setNewFolderName(folderSelected?.name)
      setFolderSelectedToCreate(null)
    } else {
      setNewFolderName("")
    }
    selectFolderRef.current?.resetSelectFolder()
    if (isNew) {
      getFolderList()
      dispatch(getEmailConfig())
    }
  }

  const handleSelectFolderToCreateFolder = (data) => {
    if (!isEmpty(data)) {
      setFolderSelectedToCreate(data)
      // setFolderSelected(null)
      // setFolderSelectedToUpdate(data)
    }
  }

  const handleSelectFolderToUpdateFolder = (data) => {
    if (!isEmpty(data)) {
      setFolderSelectedToUpdate(data)
    }
  }

  return (
    <>
      {/* Add folder */}
      <div className={`p-2 border rounded ${isExpand ? "mb-2" : ""}`}>
        <div className="d-flex justify-content-between align-items-center">
          <h3 className="han-text-primary">{t("mail.mail_menu_private")}</h3>
          <div>
            <BaseButton
              color={"primary"}
              icon={"mdi mdi-plus"}
              type="button"
              onClick={() => {
                if (newFolderName || folderSelected || folderSelectedToCreate) {
                  setNewFolderName("")
                  setFolderSelected(null)
                  setFolderSelectedToCreate(null)
                  setFolderSelectedToUpdate(null)
                } else {
                  setIsExpand(!isExpand)
                }
              }}
              style={{ height: "38px" }}
            >
              {t("mail.project_item_add_msg")}
            </BaseButton>
          </div>
        </div>
        <ul className="list-unstyled categories-list mb-0">
          <li>
            <div className="custom-accordion overflow-x-auto">
              <Link
                className="han-h4 han-fw-semibold han-text-primary ps-0 fw-medium py-1 d-flex align-items-center"
                onClick={() => setIsOpen(!isOpen)}
                to="#"
              >
                <i className={`mdi mdi-chevron-${isOpen ? "down" : "right"} font-size-16 me-1`} />
                <i
                  className={`mdi mdi-folder${isOpen ? "-open" : ""} icon-folder font-size-16 mx-1`}
                />
                {t("mail.mail_menu_private")}
              </Link>
              <Collapse in={isOpen}>
                <div className="card border-0 shadow-none ps-3 mb-0">
                  <div className="card-border"></div>
                  <TreeFolders
                    isLoaded={isLoaded}
                    folders={folders.filter((_folder) => _folder.preid === "-")} // Data folders list to display
                    className={""}
                    folderChoose={folderSelected}
                    onClick={handleSelectFolder}
                    onGetFoldersList={(list) => setFolders([...folders, ...list])} // Callback to get folders list when expanding folder
                  />
                </div>
              </Collapse>
            </div>
          </li>
        </ul>
      </div>

      <Collapse in={isExpand} className={`${isExpand ? "px-2 py-3" : ""} border rounded`}>
        <div className={`d-flex flex-wrap justify-content-between align-items-center mb-3`}>
          <h4 className="">{t("mail.mail_menu_private")}</h4>
          {folderSelected && !isEmpty(folderSelected) && (
            <div className="d-flex flex-wrap gap-3">
              <BaseButton
                loading={loading}
                color="grey"
                outline
                icon={"mdi mdi-download"}
                type="button"
                onClick={() =>
                  onAction.handleDownloadBackupMailbox?.(undefined, undefined, folderSelected.id)
                }
              >
                {t("mail.mail_set_mailbox_backup")}
              </BaseButton>
              <BaseButton
                loading={loading}
                color="grey"
                outline
                icon={"mdi mdi-upload"}
                type="button"
                onClick={() => onAction.setOpenModalUploadEml?.(true)}
              >
                {t("mail.mail_folder_settings_upload_eml")}
              </BaseButton>
              <BaseButton
                loading={loading}
                color="grey"
                outline
                icon={"mdi mdi-delete"}
                type="button"
                onClick={() => onAction.setOpenModalConfirm?.(true)}
              >
                {t("mail.mail_set_mailbox_clear")}
              </BaseButton>
              {folderSelected?.total == "0" && folderSelected?.key != "0_0" && (
                <BaseButton
                  loading={loading}
                  color="grey"
                  outline
                  icon={"mdi mdi-trash-can-outline"}
                  type="button"
                  onClick={onDeleteFolder}
                >
                  {t("mail.mail_set_mailbox_delete")}
                </BaseButton>
              )}
            </div>
          )}
        </div>

        {/* <BaseInput
          title={t("mail.project_item_name_msg")}
          note="Shared"
        ></BaseInput> */}
        <FormGroup row>
          <Label htmlFor="taskname" className="col-form-label col-lg-3">
            {t("mail.mail_menu_private")}
          </Label>
          <Col lg="9">
            <SelectFolder
              value={folderSelected}
              folders={folders}
              onCallbackFolder={
                isEmpty(folderSelected)
                  ? handleSelectFolderToCreateFolder
                  : handleSelectFolderToUpdateFolder
              }
              ref={selectFolderRef}
            />
          </Col>
        </FormGroup>

        <FormGroup row>
          <Label htmlFor="taskname" className="col-form-label col-lg-3">
            {t("mail.project_item_name_msg")}
          </Label>
          <Col lg="9">
            <Input
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
            />
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label htmlFor="taskname" className="col-form-label col-lg-3">
            {t("mail.mail_folder_setting_share_button")}
          </Label>
          <Col lg="9">
            <div className="d-flex align-items-center gap-1">
              <BaseButton
                outline
                color={"primary"}
                className={"btn-outline-primary"}
                icon={"mdi mdi-share-variant font-size-14"}
                disabled={!folderSelected || isEmpty(folderSelected)}
                onClick={() => {
                  setOpenModal(true)
                }}
                style={{ height: "38px" }}
              >
                {t("mail.mail_folder_setting_share_button")}{" "}
              </BaseButton>
              {isLoadingShareUsers && <div className="spinner-border text-primary" role="status" />}
            </div>
            {!isEmpty(shareUsers) && folderSelected && (
              <Card
                className="mt-3 mb-0 border rounded"
                style={{ height: "150px", overflowY: "auto" }}
              >
                {shareUsers.length > 0 &&
                  shareUsers.map((item) => (
                    <div
                      key={item.userid ?? item.timestamp}
                      className="d-flex justify-content-between align-items-center px-2 py-2"
                    >
                      <span>{`${item?.groupname ? `[${item.groupname}]` : ""} ${
                        item?.userid ?? ""
                      }`}</span>
                      <span>
                        {t(
                          permissionOptions.find((option) => option.value === item.permissions)
                            .label,
                        )}
                      </span>
                    </div>
                  ))}
              </Card>
            )}
          </Col>
        </FormGroup>
        <div className="d-flex justify-content-center align-items-center">
          <BaseButton
            buttonRef={saveRef}
            color={"primary"}
            className="me-2"
            type="button"
            onClick={handleSaveFolder}
            loading={loading}
          >
            {t("mail.mail_view_save")}
          </BaseButton>
          <BaseButton
            color={"grey"}
            type="button"
            className={"btn-action"}
            onClick={() =>
              resetForm(
                isEmpty(folderSelected) ? !!folderSelectedToCreate : !!folderSelectedToUpdate,
              )
            }
          >
            {t("mail.project_reset_msg")}
          </BaseButton>
        </div>
      </Collapse>
    </>
  )
}

export default forwardRef(AddFolder)
