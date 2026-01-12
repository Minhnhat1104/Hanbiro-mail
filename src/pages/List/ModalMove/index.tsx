// @ts-nocheck
import classnames from "classnames"
import { BaseButton, BaseModal, SearchInput, TreeFolders } from "components/Common"
import { getEmailFolder, postEmailFolder, postMailToHtml5 } from "modules/mail/common/api"
import { postAutoSortExistingMailData } from "modules/mail/settings/api"
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch } from "react-redux"
import { Col, Input, Row } from "reactstrap"
import { extractEmailFromString, getAvailableFolders } from "utils"
import useMenu from "utils/useMenu"

import { Headers, emailPost } from "helpers/email_api_helper"
import { useCustomToast } from "hooks/useCustomToast"
import { getEmailConfig } from "store/emailConfig/actions"
import { useNavigate } from "react-router-dom"
import { isEmpty, isUndefined } from "lodash"
import useDevice from "hooks/useDevice"

const initialData = {
  folderData: {
    isError: false,
    value: "",
  },
}

const ModalMove = ({
  isOpen,
  type = "move",
  toggle = () => {},
  keyHeader = "common.common_move",
  menuKey = "",
  selectedMails = [],
  onResetList = () => {},
  listMail,
  mid,
  mail,
}) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { basicMenus, folderMenus } = useMenu()
  const { successToast, errorToast } = useCustomToast()
  const { isMobile } = useDevice()

  const [folderChoose, setFolderChoose] = useState({})
  const [keyword, setKeyword] = useState("")
  const [loading, setLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [searchData, setSearchData] = useState([])
  const [isCreateFolder, setIsCreateFolder] = useState(false)
  const [folderData, setFolderData] = useState(initialData["folderData"])
  const [isOpenAutoSort, setIsOpenAutoSort] = useState(false)
  const [isReceiveMailMove, setIsReceiveMailMove] = useState(false)

  const defaultMenus = useMemo(() => {
    return getAvailableFolders(basicMenus, folderMenus, menuKey)
  }, [basicMenus, folderMenus, menuKey])

  useEffect(() => {
    if (isOpen) {
      setFolderChoose({})
    }
  }, [isOpen])

  const handleClick = (folder) => {
    setFolderChoose(folder)
  }

  const searchFolders = (folders, keyword) => {
    const nKeyword = keyword.trim().toLowerCase()
    let nFolder = []
    folders.forEach((menu) => {
      if (menu.name.toLowerCase().includes(nKeyword)) {
        nFolder.push(menu)
      }
      if (menu?.children && menu?.children?.length > 0) {
        const child = searchFolders(menu.children, keyword)
        nFolder = [...nFolder, ...child]
      }
    })
    return nFolder
  }

  const onSubmitKeyword = async (searchKeyword) => {
    setKeyword(searchKeyword)
    if (searchKeyword.trim() != "") {
      setLoading(true)
      const params = {
        keyword: searchKeyword.trim(),
        reverse: 0,
        root: "source",
      }
      const res = await getEmailFolder(params)
      if (!isEmpty(res?.mailbox)) {
        setSearchData(res?.mailbox)
        setLoading(false)
      } else {
        const nFolders = searchFolders(defaultMenus, searchKeyword.trim())
        setSearchData(nFolders)
        setLoading(false)
      }
    } else {
      setSearchData([])
    }
  }

  const onCreateFolder = () => {
    if (folderData?.value.trim() == "") {
      setFolderData({ ...folderData, isError: true })
      return false
    }

    const params = {
      root: "",
      name: folderData?.value,
    }

    postEmailFolder(params).then((res) => {
      if (res?.mailbox?.result == "success") {
        setFolderData(initialData["folderData"])
        setIsCreateFolder(false)
        dispatch(getEmailConfig({ noExt: true, noDisableList: true }))
      }
    })
  }

  const toggleAutoSort = () => {
    setIsOpenAutoSort(!isOpenAutoSort)
  }

  const onSaveMove = async () => {
    setIsSaving(true)
    if (type === "move") {
      const params = {
        acl: menuKey,
        act: "mailmove",
        moveDir: folderChoose.key,
        mid: !isEmpty(selectedMails) ? selectedMails : mid,
      }
      postMailToHtml5(params, "movemail=1")
        .then((res) => {
          if (res.success == "1") {
            onResetList()
            toggle()
            if (isEmpty(selectedMails)) {
              navigate(`/mail/list/${menuKey}`)
            }
          }
        })
        .finally(() => {
          setIsSaving(false)
        })
    } else {
      const urlCopyShare = "/email/share/tobox"
      const params = {
        toboxid: folderChoose.key,
        toboxname: "",
        mids: selectedMails.join(","),
        shareid: menuKey,
      }
      // try {
      const res = await emailPost(urlCopyShare, params, Headers)
      setIsSaving(false)
      if (res?.success) {
        onResetList()
        toggle()
        successToast(res?.msg)
      } else {
        errorToast(res?.msg)
      }
      // } catch (error) {
      //   errorToast("Failed")
      // }
    }
  }

  const onSaveAutoSort = () => {
    setIsSaving(true)
    if (listMail) {
      let fromEmails = []
      let fromAddr = ""
      listMail.map((mail) => {
        if (selectedMails.indexOf(mail.mid) !== -1) {
          fromAddr = $.trim(mail.from_addr)
          if (fromEmails.indexOf(fromAddr) === -1) {
            fromEmails.push(fromAddr)
          }
        }
      })

      let count = 0
      fromEmails.map((email) => {
        postMailToHtml5(
          {
            act: "autosplit",
            mode: "insert",
            data: JSON.stringify({
              frommailbox: menuKey,
              fromaddr: email,
              mailbox: folderChoose.key,
            }),
          },
          "_autosplit=1",
        ).then(() => {
          count++
          if (count == fromEmails.length) {
            if (!isReceiveMailMove) {
              setIsSaving(false)
              onResetList()
              toggle()
            } else {
              postAutoSortExistingMailData({
                frommailbox: menuKey,
                fromaddr: fromEmails.join(","),
                mailbox: folderChoose.key,
                tomailbox: folderChoose.key,
              }).then(() => {
                setIsSaving(false)
                onResetList()
                toggle()
                toggleAutoSort()
                navigate(`/mail/list/${menuKey}`)
              })
            }
          }
        })
      })
    } else {
      if (!mail) return
      const fromAddress = extractEmailFromString(mail?.from)
      postMailToHtml5(
        {
          act: "autosplit",
          mode: "insert",
          data: JSON.stringify({
            frommailbox: menuKey,
            fromaddr: fromAddress,
            mailbox: folderChoose.key,
          }),
        },
        "_autosplit=1",
      ).then((res) => {
        if (res?.success) {
          if (!isReceiveMailMove) {
            setIsSaving(false)
            onResetList()
            toggle()
          } else {
            postAutoSortExistingMailData({
              frommailbox: menuKey,
              fromaddr: fromAddress,
              mailbox: folderChoose.key,
              tomailbox: folderChoose.key,
            }).then(() => {
              setIsSaving(false)
              onResetList()
              toggle()
              toggleAutoSort()
              navigate(`/mail/list/${menuKey}`)
            })
          }
        }
      })
    }
  }

  return (
    <>
      <BaseModal
        isOpen={isOpen}
        toggle={toggle}
        renderHeader={() => {
          return <span>{t(keyHeader)}</span>
        }}
        renderBody={() => {
          return (
            <div className="d-flex flex-column gap-3">
              <div className="w-100 d-flex gap-2 justify-content-between align-items-center">
                <SearchInput
                  className="ps-0 w-auto"
                  keyword={keyword}
                  setKeyword={setKeyword}
                  onSubmit={onSubmitKeyword}
                />
                <BaseButton
                  color="white"
                  icon={"mdi mdi-folder-upload"}
                  iconClassName={isMobile ? "me-0" : ""}
                  className={"btn-outline-primary"}
                  onClick={() => setIsCreateFolder(!isCreateFolder)}
                >
                  {isMobile ? "" : t("common.admin_folder_add_msg")}
                </BaseButton>
              </div>
              {isCreateFolder && (
                <div className={"d-flex"}>
                  <input
                    type="text"
                    className={classnames("form-control", {
                      "is-invalid": folderData?.isError,
                    })}
                    placeholder={t("mail.project_item_name_msg")}
                    value={folderData?.value}
                    onChange={(e) => setFolderData({ ...folderData, value: e.target.value })}
                  />
                  <BaseButton
                    color="white"
                    icon={"mdi mdi-check font-size-20"}
                    iconClassName="me-0"
                    className={"btn-no-active fs-5 color-green"}
                    onClick={onCreateFolder}
                  />
                </div>
              )}
              <TreeFolders
                className="p-0 m-0"
                folders={keyword != "" ? searchData : defaultMenus}
                onClick={handleClick}
                folderChoose={folderChoose}
                loading={loading}
              />
            </div>
          )
        }}
        renderFooter={() => {
          return (
            <span className={"d-flex w-100 justify-content-center"}>
              <BaseButton outline className={"btn-outline-grey"} onClick={toggle}>
                {t("common.common_btn_close")}
              </BaseButton>
              <BaseButton
                color={"primary"}
                className={"mx-2"}
                onClick={onSaveMove}
                disabled={!folderChoose?.key}
                loading={isSaving}
              >
                {t("common.common_btn_save")}
              </BaseButton>
              {type === "move" && (
                <BaseButton
                  outline
                  color={"grey"}
                  icon={"mdi mdi-chevron-right"}
                  onClick={toggleAutoSort}
                  disabled={!folderChoose?.key}
                  loading={isSaving}
                >
                  {t("mail.mail_view_continue_msg")}
                </BaseButton>
              )}
            </span>
          )
        }}
        size={"md"}
      />
      {isOpenAutoSort && (
        <BaseModal
          isOpen={isOpenAutoSort}
          toggle={toggleAutoSort}
          renderHeader={() => {
            return <span>Create Auto-Sort</span>
          }}
          renderBody={() => {
            return (
              <div>
                {t("mail.mail_continue_confirm_1")}{" "}
                <span className={"fw-bold"}>{folderChoose.name}</span>{" "}
                {t("mail.mail_continue_confirm_2")}
                <div className={"mt-2"}>
                  <span className="lbl">
                    <Input
                      className="form-check-input me-1"
                      type="checkbox"
                      checked={isReceiveMailMove}
                      onChange={() => {}} // Do not remove
                      onClick={() => {
                        setIsReceiveMailMove(!isReceiveMailMove)
                      }}
                      disabled={isSaving}
                    />
                    {t("mail.mail_continue_confirm_check")}
                  </span>
                </div>
              </div>
            )
          }}
          renderFooter={() => {
            return (
              <span className={"d-flex w-100 justify-content-center"}>
                <BaseButton outline className={"btn-outline-grey"} onClick={toggleAutoSort}>
                  {t("common.common_btn_close")}
                </BaseButton>
                <BaseButton
                  color="primary"
                  className={"mx-2"}
                  onClick={() => onSaveAutoSort()}
                  disabled={!folderChoose?.key}
                  loading={isSaving}
                >
                  {t("common.common_btn_save")}
                </BaseButton>
              </span>
            )
          }}
          size={"sm"}
        />
      )}
    </>
  )
}
export default ModalMove
