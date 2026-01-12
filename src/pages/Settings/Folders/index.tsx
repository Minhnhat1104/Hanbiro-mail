// @ts-nocheck
import React, { useEffect, useMemo, useRef, useState } from "react"
import classnames from "classnames"
import "../../../components/SettingAdmin/Tabs/style.css"
import UploadEmlModal from "./UploadEmlModal"
import { Card, CardBody, Col, Nav, NavItem, NavLink, Row, TabContent, TabPane } from "reactstrap"
import Tooltip from "components/SettingAdmin/Tooltip"
import BaseIcon from "components/Common/BaseIcon"
import BaseTable from "components/Common/BaseTable"
import { Title } from "components/SettingAdmin"
import { useTranslation } from "react-i18next"
import "./styles.scss"
import {
  emptyMailBox,
  getFolders,
  getMailbox,
  getShareBoxList,
  postSetShare,
  postUsersShare,
  uploadEml,
} from "modules/mail/settings/api"
import SelectUsersModal from "./SelectUsersModal"
import { useCustomToast } from "hooks/useCustomToast"
import { isArray, isEmpty } from "lodash"
import { BASE_URL } from "helpers/email_api_helper"
import HanTooltip from "components/Common/HanTooltip"
import { BACKUP_MAIL_BOX } from "modules/mail/settings/urls"
import { ModalConfirm } from "components/Common/Modal"
import AddFolder from "./AddFolder"
import LoadingPage from "./LoadingPage"
import { getListEmail } from "modules/mail/list/api"
import useDevice from "hooks/useDevice"
import MobileButton from "./MobileButton"
import MainHeader from "pages/SettingMain/MainHeader"

const Folders = (props) => {
  const { routeConfig } = props
  const { t } = useTranslation()
  const { isMobile } = useDevice()

  const [activeTab, setactiveTab] = useState("1")
  const [openModal, setOpenModal] = useState(false)
  const [openModalConfirm, setOpenModalConfirm] = useState(false)
  const [openModalUploadEml, setOpenModalUploadEml] = useState(false)
  const [mailbox, setMailbox] = useState([])
  const [shareBox, setShareBox] = useState([])
  const [loading, setLoading] = useState(false)
  const [boxId, setBoxId] = useState("")
  const { successToast, errorToast } = useCustomToast()

  const folderTreeRef = useRef(null)

  useEffect(() => {
    getListMailBox()
    getShareBox()
  }, [])

  const getListMailBox = () => {
    setLoading(true)
    getMailbox().then((res) => {
      setLoading(false)
      if (res.mailbox) {
        setMailbox(res.mailbox)
      }
    })
  }

  const getShareBox = () => {
    getShareBoxList().then((res) => {
      if (res.mailbox) {
        setShareBox(res.mailbox)
      }
    })
  }

  const toggle = (tab) => {
    if (activeTab !== tab) {
      setactiveTab(tab)
    }
  }

  const refresh = (isShare = true) => {
    getListMailBox()
    folderTreeRef.current?.getUserShareList(isShare)
  }

  // handlers
  const handleShareUsers = (users) => {
    if (isArray(users) && !isEmpty(users)) {
      const userIds = users
        .map((user) => {
          return `${user.userid}:${user.permissions}`
        })
        .join(",")
      const params = {
        userids: userIds,
        boxid: boxId,
      }
      setLoading(true)
      postSetShare(`${boxId}/y`).then(() => {
      })
      postUsersShare(params).then((res) => {
        if (res.success) {
          successToast()
        } else {
          errorToast()
        }
        setLoading(false)
        setOpenModal(false)
        refresh()
      })
    } else {
      setLoading(true)
      postSetShare(`${boxId}/n`).then((res) => {
        setLoading(false)
        setOpenModal(false)
        refresh(false)
      })
    }
  }

  const handleDownloadBackupMailbox = (act = "mailboxmanage", mode = "backupbox", data) => {
    const url = `${BASE_URL}/${BACKUP_MAIL_BOX}?act=${act}&mode=${mode}&data=${data}`
    const win = window.open(url, "_blank")
    if (win && typeof win.focus !== "undefined") {
      win.focus()
    }
  }

  const handleDownloadSharedMailbox = (key) => {
    const params = {
      acl: "Maildir",
      act: "maillist",
      shareid: key,
      viewcont: "0,5",
    }
    getListEmail(params)
      .then((res) => {
        if (res && res?.shareinfo?.sharepermission?.indexOf("w") !== -1) {
          handleDownloadBackupMailbox(undefined, undefined, key)
        } else {
          errorToast(t("mail.mail_no_permission"))
        }
      })
      .catch(() => {
        errorToast()
      })
  }

  const onEmptyMailbox = () => {
    if (boxId) {
      const params = {
        searchfild: "all",
        isfile: "false",
        rcommand: "alldelete",
        searchbox: boxId,
      }
      setLoading(true)
      emptyMailBox(params).then((res) => {
        if (res.success) {
          successToast()
        } else {
          errorToast()
        }
        setLoading(false)
        setOpenModalConfirm(false)
        refresh()
      })
    }
  }

  const onUploadEml = (fileData, uploadId) => {
    const { attachments, filesCloudDisk } = fileData
    let nfilesCloudDisk = []
    if (filesCloudDisk.length > 0) {
      nfilesCloudDisk = filesCloudDisk.map((file) => {
        let nFile = { ...file }
        nFile.id = file.link
        delete nFile.isCloudDisk
        delete nFile.path
        delete nFile.link
        return nFile
      })
    }
    const params = {
      uploadid: uploadId,
      mailboxid: boxId,
      webdisk: nfilesCloudDisk.length > 0 ? JSON.stringify(nfilesCloudDisk) : [],
    }
    setLoading(true)
    uploadEml(params).then((res) => {
      if (res.success) {
        successToast()
        setOpenModalUploadEml(false)
      } else {
        errorToast()
      }
      setLoading(false)
      setTimeout(() => {
        folderTreeRef.current?.refreshFolderList()
      }, 5000)
    })
  }

  // table
  const mailboxHeaders = [
    {
      class: isMobile ? "w-auto" : "w-50 han-h4 han-text-secondary",
      content: t("mail.mail_mobile_mbox"),
    },
    {
      content: (
        <div className="text-nowrap han-h4 han-text-secondary">
          <span>{t("mail.mail_new_total")}</span>
          <span> / </span>
          <span>{t("mail.mail_list_sort_size")}</span>
        </div>
      ),
    },
    {
      content: (
        <p className="w-100 m-0 text-center han-h4 han-text-secondary">
          {t("mail.mail_folder_setting_share_button")}
        </p>
      ),
    },
    { content: "" },
  ]

  const mailboxRows = useMemo(() => {
    if (mailbox && mailbox.length > 0) {
      return mailbox.map((item) => {
        return {
          class: "mailbox-item",
          columns: [
            {
              content: (
                <div className="d-flex align-items-center text-nowrap han-text-primary">
                  {item.name}
                  {item.isshare && (
                    <BaseIcon
                      className="han-color-primary ms-1"
                      icon={"mdi mdi-share-variant font-size-18 font-size-18"}
                    />
                  )}
                </div>
              ),
            },
            {
              content: (
                <div className="d-flex align-items-center text-nowrap han-text-primary">
                  <span className="align-middle">
                    <span className="han-color-primary fw-bold">{item.new}</span>
                    {` / ${item.total} / ${item.size}`}
                  </span>
                </div>
              ),
            },
            {
              content: (
                <>
                  {item.canshare && (
                    <BaseIcon
                      onClick={() => {
                        setBoxId(item.key)
                        setOpenModal(true)
                      }}
                      className="color-green"
                      icon={"mdi mdi-pencil-box-outline font-size-18"}
                    />
                  )}
                </>
              ),
            },
            {
              className: isMobile ? "px-0" : "text-start",
              content: isMobile ? (
                <MobileButton
                  item={item}
                  setBoxId={setBoxId}
                  setOpenModalConfirm={setOpenModalConfirm}
                  setOpenModalUploadEml={setOpenModalUploadEml}
                  handleDownloadBackupMailbox={handleDownloadBackupMailbox}
                />
              ) : (
                <div className="icon-action">
                  {item.key !== "Trash" && (
                    <HanTooltip placement="top" overlay={t("mail.mail_set_mailbox_clear")}>
                      <BaseIcon
                        className="color-red me-1"
                        icon={"mdi mdi-trash-can-outline font-size-18"}
                        onClick={() => {
                          setBoxId(item.key)
                          setOpenModalConfirm(true)
                        }}
                      />
                    </HanTooltip>
                  )}

                  {item.canshare && (
                    <HanTooltip placement="top" overlay={t("mail.mail_folder_settings_upload_eml")}>
                      <BaseIcon
                        className="han-color-grey me-1"
                        icon={"mdi mdi-upload font-size-18"}
                        onClick={() => {
                          setBoxId(item.key)
                          setOpenModalUploadEml(true)
                        }}
                      />
                    </HanTooltip>
                  )}

                  <HanTooltip placement="top" overlay={t("mail.mail_set_mailbox_backup")}>
                    <BaseIcon
                      className="han-color-grey"
                      icon={"mdi mdi-download font-size-18"}
                      onClick={() => handleDownloadBackupMailbox(undefined, undefined, item.key)}
                    />
                  </HanTooltip>
                </div>
              ),
            },
          ],
        }
      })
    }
  }, [mailbox])

  const shareBoxHeaders = [
    { content: t("mail.mail_mobile_mbox") },
    { content: t("mail.mail_new_total") },
    { content: "" },
  ]

  const shareBoxRows = useMemo(() => {
    if (shareBox && shareBox.length > 0) {
      return shareBox.map((item) => {
        return {
          class: "test",
          columns: [
            // { content: <input type="checkbox" className="form-check-input" /> },
            {
              content: item.name,
            },
            { content: <span>{`${item.new} / ${item.total}`}</span> },
            {
              content: (
                <div className="icon-action">
                  <BaseIcon
                    className="color-blue"
                    icon={"mdi mdi-download font-size-18"}
                    onClick={() => handleDownloadSharedMailbox(item.key)}
                  />
                </div>
              ),
            },
          ],
        }
      })
    }
  }, [shareBox])

  return (
    <>
      <MainHeader currentTitleMenu={t(routeConfig?.keyTitle)} />
      <div className={`w-100 h-100 overflow-hidden`}>
        {loading && <LoadingPage />}
        {mailbox.length > 0 && (
          <>
            <Nav tabs className={`folder-tab border-0 mb-2`}>
              <NavItem
                active={activeTab === "1"}
                className="cursor-pointer"
                onClick={() => {
                  toggle("1")
                }}
              >
                {t("mail.mail_folder_setting_basic_setting")}
              </NavItem>
              <NavItem
                active={activeTab === "2"}
                className="cursor-pointer"
                onClick={() => {
                  toggle("2")
                }}
              >
                {t("mail.mail_folder_setting_share_setting")}
              </NavItem>
            </Nav>

            <TabContent activeTab={activeTab} className={`w-100 overflow-x-hidden overflow-y-auto`} style={{height: "calc(100% - 44px)"}}>
              {/* Mailbox */}
              <TabPane tabId="1">
                <Tooltip
                  content={
                    <div>
                      <span dangerouslySetInnerHTML={{ __html: t("mail.mail_set_mailbox_msg1") }}></span>
                      <br />
                      <span dangerouslySetInnerHTML={{ __html: t("mail.mail_set_mailbox_msg2") }}></span>
                    </div>
                  }
                />
                {/* Mailbox table */}
                <div className="w-100 overflow-x-auto mb-2">
                  <BaseTable heads={mailboxHeaders} rows={mailboxRows} tableClass="mb-0" />
                </div>

                {/* Add folder */}
                <AddFolder
                  ref={folderTreeRef}
                  setOpenModal={setOpenModal}
                  setBoxId={setBoxId}
                  onAction={{
                    onUploadEml,
                    setOpenModalConfirm,
                    setOpenModalUploadEml,
                    handleDownloadBackupMailbox,
                  }}
                />
              </TabPane>

              {/* Share box list */}
              <TabPane tabId="2">
                <BaseTable heads={shareBoxHeaders} rows={shareBoxRows} />
              </TabPane>
            </TabContent>
          </>
        )}

        {/* modal select users */}
        {openModal && (
          <SelectUsersModal
            boxId={boxId}
            isOpen={openModal}
            loading={loading}
            toggleModal={setOpenModal}
            onPermission={handleShareUsers}
          />
        )}
        {openModalConfirm && (
          <ModalConfirm
            isOpen={openModalConfirm}
            toggle={() => setOpenModalConfirm((prev) => !prev)}
            onClick={onEmptyMailbox}
            loading={loading}
            keyHeader="common.alert_info_msg"
            keyBody="mail.mail_set_mailbox_confirmdel"
          />
        )}
        {openModalUploadEml && (
          <UploadEmlModal
            isOpen={openModalUploadEml}
            toggle={() => setOpenModalUploadEml((prev) => !prev)}
            onClick={onUploadEml}
            loading={loading}
          />
        )}
      </div>
    </>
  )
}

export default Folders
