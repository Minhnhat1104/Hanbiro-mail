// @ts-nocheck
import React, { useState, useEffect, useMemo } from "react"
import { DropdownItem, Row, Col, Input, Label, Button } from "reactstrap"
import Select from "react-select"
import { useTranslation } from "react-i18next"
import { BaseButton, BaseButtonDropdown } from "components/Common"
import classNames from "classnames"
import { numberOptions } from "constants/init/mail"
import HanTooltip from "components/Common/HanTooltip"
import HanIconFile from "components/Common/Attachment/HanIconFile"
import { FILES } from "components/Common/Attachment/HanIconFile/icons"
import { useDispatch, useSelector } from "react-redux"
import { setSplitMode } from "store/viewMode/actions"
import SelectUsersModal from "pages/Settings/Folders/SelectUsersModal"
import { selectUserMailSetting } from "store/auth/config/selectors"
import ComposeMail from "components/Common/ComposeMail"
import { useLocation, useSearchParams } from "react-router-dom"
import useDevice from "hooks/useDevice"
import { isArray, isEmpty } from "lodash"
import { postSetShare, postUsersShare } from "modules/mail/settings/api"
import { useCustomToast } from "hooks/useCustomToast"

const EmailToolbar = (props) => {
  const {
    menu,
    info,
    attr,
    onDelete,
    onMarkRead,
    onSetImportantAll,
    onToggleMove,
    onSelectDataType,
    selectedMails,
    onRefresh,
    setConfirmData,
    onChangeSetting,
    onFilterChange,
    isSplitMode,
    loading,
  } = props
  const { t } = useTranslation()
  const location = useLocation()
  const { successToast, errorToast } = useCustomToast()

  const { isDesktop } = useDevice()

  // redux
  const dispatch = useDispatch()
  const userMailSetting = useSelector(selectUserMailSetting)
  const queryParams = useSelector((state) => state.QueryParams.query)

  const [searchParams, setSearchParams] = useSearchParams()
  const [openShareModal, setOpenShareModal] = useState(false)
  const [openForwardModal, setOpenForwardModal] = useState(false)
  const [composeProps, setComposeProps] = useState({})
  const [shareLoading, setShareLoading] = useState(false)

  const isReceiptsMenu = menu === "Receive"
  const isDisable = selectedMails?.length == 0 ? true : false
  const isShareMenu = menu.indexOf("HBShare_") === 0 ? true : false
  const isSecureMenu = menu === "Secure"

  const options = [
    {
      value: 1,
      title: t("mail.mail_select_checkbox_all"),
      onClick: () => {
        onSelectDataType("all")
      },
    },
    {
      value: 2,
      title: t("mail.mail_select_checkbox_uncheck_all"),
      onClick: () => {
        onSelectDataType("none")
      },
    },
    {
      value: 3,
      title: t("mail.mail_select_checkbox_read"),
      onClick: () => {
        onSelectDataType("read")
      },
    },
    {
      value: 4,
      title: t("mail.mail_select_checkbox_unread"),
      onClick: () => {
        onSelectDataType("unread")
      },
    },
    ...(isReceiptsMenu
      ? []
      : [
          {
            value: 5,
            title: t("mail.mail_select_checkbox_important"),
            onClick: () => {
              onSelectDataType("important")
            },
          },
          {
            value: 6,
            title: t("mail.mail_select_checkbox_not_important"),
            onClick: () => {
              onSelectDataType("not_important")
            },
          },
        ]),
  ]

  const moreOptions = [
    {
      title: t("common.mail_view_forward"),
      onClick: () => onForward(),
      icon: "fas fa-share",
      iconClassName: "me-1",
    },
    {
      title: t("mail.mail_report_hacking_mail"),
      onClick: () => onReportHackingMail(),
      icon: "fas fa-bug",
      iconClassName: "me-1",
    },
    {
      title: t("mail.mail_list_maildelete"),
      onClick: () => handleDeleteMail(),
      icon: "fas fa-trash-alt",
      iconClassName: "me-1",
    },
  ]

  const handleDeleteMail = () => {
    if (menu != "Trash") {
      onDelete()
    } else {
      setConfirmData({
        open: true,
        type: "delete",
      })
    }
  }

  const handleChangeStatus = () => {
    const params = Object.fromEntries(searchParams.entries())
    if (!params?.msgsig) {
      setSearchParams({ ...params, msgsig: "new" })
    } else {
      onRefresh && onRefresh()
    }
  }

  const handleChangeViewMode = () => {
    dispatch(setSplitMode(!isSplitMode))
    onChangeSetting("list_pane_type", isSplitMode ? "hidden" : "right")
  }

  const handleShareUsers = (users) => {
    if (isArray(users) && !isEmpty(users)) {
      const userIds = users
        .map((user) => {
          return `${user.userid}:${user.permissions}`
        })
        .join(",")
      const params = {
        userids: userIds,
        boxid: menu,
      }
      setShareLoading(true)
      postSetShare(`${menu}/y`).then(() => {})
      postUsersShare(params).then((res) => {
        if (res.success) {
          successToast()
        } else {
          errorToast()
        }
        setShareLoading(false)
        setOpenShareModal(false)
      })
    } else {
      setShareLoading(true)
      postSetShare(`${menu}/n`).then((res) => {
        setShareLoading(false)
        setOpenShareModal(false)
      })
    }
  }

  const onForward = () => {
    setComposeProps({
      titleCompose: "common.mail_view_forward",
      handleClose: () => setOpenForwardModal(false),
      mid: selectedMails[0],
      modeType: "forward",
    })
    setOpenForwardModal(true)
  }

  const onReportHackingMail = () => {
    setComposeProps({
      handleClose: () => setOpenForwardModal(false),
      mid: selectedMails[0],
      modeType: "hacking",
    })
    setOpenForwardModal(true)
  }

  return (
    <React.Fragment>
      <div className={`mail-toolbar pt-0 ${isSplitMode ? "ps-3 pe-3" : ""}`}>
        <div className="d-flex justify-content-between position-relative">
          {isSplitMode && (isReceiptsMenu || isDisable) && (
            <div className={"un-read-mail"} onClick={handleChangeStatus}>
              <span className={"new color-white background-blue"}>N</span>
              <span className={"color-dark fw-semibold text ms-2"}>
                {info.countNew.new}{" "}
                {info.countNew.total != 0 && <span>/ {info.countNew.total}</span>}
              </span>
            </div>
          )}
          {!isSplitMode && (
            <div className={"un-read-mail"} onClick={handleChangeStatus}>
              <span className={"new color-white background-blue"}>N</span>
              <span className={"color-dark fw-semibold text ms-2"}>
                {info.countNew.new}{" "}
                {info.countNew.total != 0 && <span>/ {info.countNew.total}</span>}
              </span>
            </div>
          )}

          <div className=" d-flex align-items-center justify-content-between w-100">
            <div className="left-toolbar btn-toolbar align-items-center" role="toolbar">
              <Input
                type="checkbox"
                className="checkbox-wrapper-mail m-0 border-1 me-2"
                checked={info.isSelectAll}
                onChange={(e) => {}}
                onClick={(e) => onSelectDataType()}
              />

              {/* select options */}
              <HanTooltip
                placement="top"
                overlay={t("project.project_select_option")}
                trigger={["hover", "click"]}
              >
                <div>
                  <BaseButtonDropdown
                    options={options}
                    iconClassName={"me-0"}
                    classDropdown={"dropdown-all"}
                    classDropdownToggle={"btn-no-active"}
                  />
                </div>
              </HanTooltip>

              {(!isSplitMode || !isDisable) && !isReceiptsMenu && !isSecureMenu ? (
                <>
                  {!isShareMenu && menu != "Spam" && (
                    <HanTooltip placement="top" overlay={t("mail.mail_list_reportspam")}>
                      <BaseButton
                        outline
                        className={"py-0 fs-5"}
                        icon={"mdi mdi-alert-circle"}
                        iconClassName={"me-0"}
                        onClick={() =>
                          setConfirmData({
                            open: true,
                            type: "spam",
                          })
                        }
                        disabled={isDisable}
                      />
                    </HanTooltip>
                  )}
                  {menu == "Spam" && (
                    <HanTooltip placement="top" overlay={t("mail.mail_button_report_no_spam")}>
                      <Button
                        outline
                        className={"py-0 fs-5 d-flex align-items-center"}
                        onClick={() =>
                          setConfirmData({
                            open: true,
                            type: "nospam",
                          })
                        }
                        disabled={isDisable}
                      >
                        {FILES.notSpam}
                      </Button>
                    </HanTooltip>
                  )}
                  {/* Mark read/unread */}
                  {!info.isUnreadAll && !info.isBothAll && (
                    <HanTooltip placement="top" overlay={t("mail.mail_list_tounread")}>
                      <BaseButton
                        outline
                        className={"py-0 fs-4"}
                        icon={"mdi mdi-eye"}
                        iconClassName={"me-0"}
                        onClick={() => onMarkRead(false)}
                        disabled={isDisable}
                      />
                    </HanTooltip>
                  )}
                  {info.isUnreadAll && !info.isBothAll && (
                    <HanTooltip placement="top" overlay={t("common.mail_list_toread")}>
                      <BaseButton
                        outline
                        className={"py-0 fs-4"}
                        icon={"mdi mdi-eye-off"}
                        iconClassName={"me-0"}
                        onClick={() => onMarkRead(true)}
                        disabled={isDisable}
                      />
                    </HanTooltip>
                  )}
                  {info.isBothAll && (
                    <>
                      <HanTooltip placement="top" overlay={t("common.mail_list_toread")}>
                        <BaseButton
                          outline
                          className={"py-0 fs-4"}
                          icon={"mdi mdi-eye-off"}
                          iconClassName={"me-0"}
                          onClick={() => onMarkRead(true)}
                          disabled={isDisable}
                        />
                      </HanTooltip>
                      <HanTooltip placement="top" overlay={t("mail.mail_list_tounread")}>
                        <BaseButton
                          outline
                          className={"py-0 fs-4"}
                          icon={"mdi mdi-eye"}
                          iconClassName={"me-0"}
                          onClick={() => onMarkRead(false)}
                          disabled={isDisable}
                        />
                      </HanTooltip>
                    </>
                  )}
                  {/* move to folder */}
                  {!isShareMenu && (
                    <HanTooltip placement="top" overlay={t("common.common_move")}>
                      <BaseButton
                        outline
                        className={"py-0 fs-4"}
                        icon={"mdi mdi-folder"}
                        iconClassName={"me-0"}
                        onClick={onToggleMove}
                        disabled={isDisable}
                      />
                    </HanTooltip>
                  )}

                  {/* share copy */}
                  {isShareMenu && (
                    <HanTooltip placement="top" overlay={t("common.action_copy")}>
                      <BaseButton
                        outline
                        className={" py-0 fs-5"}
                        icon={"mdi mdi-content-copy"}
                        iconClassName={"me-0"}
                        onClick={onToggleMove}
                        disabled={isDisable}
                      />
                    </HanTooltip>
                  )}
                  {/* favorite */}
                  <HanTooltip placement="top" overlay={t("common.common_messenger_favorite")}>
                    <BaseButton
                      outline
                      className={"py-0"}
                      icon={"fas fa-star"}
                      iconClassName={classNames("me-0", {
                        "text-warning": info.isImportantAll,
                      })}
                      onClick={() => onSetImportantAll()}
                    />
                  </HanTooltip>
                </>
              ) : (
                <>
                  {((isReceiptsMenu && !isShareMenu) || isSecureMenu) && (
                    // delete
                    <HanTooltip placement="top" overlay={t("mail.mail_list_maildelete")}>
                      <BaseButton
                        outline
                        className={"py-0"}
                        icon={"fas fa-trash-alt"}
                        iconClassName={"me-0"}
                        disabled={isDisable}
                        onClick={handleDeleteMail}
                      />
                    </HanTooltip>
                  )}
                </>
              )}

              {/* forward */}
              {isSplitMode && isShareMenu && !isDisable && !isSecureMenu && (
                <HanTooltip placement="top" overlay={t("common.mail_view_forward")}>
                  <BaseButton
                    outline
                    className={"py-0"}
                    icon={"fas fa-share"}
                    iconClassName={"me-0"}
                    onClick={onForward}
                    disabled={isDisable}
                  />
                </HanTooltip>
              )}

              {isSplitMode && !isDisable && !isReceiptsMenu && !isShareMenu && !isSecureMenu && (
                <HanTooltip placement="top" overlay={"More Options"} trigger={["hover", "click"]}>
                  <div>
                    <BaseButtonDropdown
                      icon="fas fa-ellipsis-h"
                      options={moreOptions}
                      iconClassName={"me-0"}
                      classDropdownToggle={"btn-no-active"}
                      stopPropagation
                    />
                  </div>
                </HanTooltip>
              )}

              {!isSplitMode && !isReceiptsMenu && (
                <>
                  {/* forward */}
                  <HanTooltip placement="top" overlay={t("common.mail_view_forward")}>
                    <BaseButton
                      outline
                      className={"py-0"}
                      icon={"fas fa-share"}
                      iconClassName={"me-0"}
                      onClick={onForward}
                      disabled={isDisable}
                    />
                  </HanTooltip>
                  {/* Report hacking mail */}
                  {!isShareMenu && (
                    <HanTooltip placement="top" overlay={t("mail.mail_report_hacking_mail")}>
                      <BaseButton
                        outline
                        className={"py-0"}
                        icon={"fas fa-bug"}
                        iconClassName={"me-0"}
                        onClick={onReportHackingMail}
                        disabled={isDisable}
                      />
                    </HanTooltip>
                  )}
                  {/* delete */}
                  {!isShareMenu && (
                    <HanTooltip placement="top" overlay={t("mail.mail_list_maildelete")}>
                      <BaseButton
                        outline
                        className={"py-0"}
                        icon={"fas fa-trash-alt"}
                        iconClassName={"me-0"}
                        disabled={isDisable}
                        onClick={handleDeleteMail}
                      />
                    </HanTooltip>
                  )}
                </>
              )}
            </div>

            <div className="right-toolbar gap-1">
              {/* right toolbar */}
              {/* share */}
              {!["all", "Receive", "Secure"].includes(menu) && !isShareMenu && (
                <HanTooltip
                  placement="top"
                  overlay={t("mail.mail_folder_setting_share_button")}
                  trigger="hover"
                >
                  <BaseButton
                    outline
                    color={""}
                    className={"me-1 btn-share"}
                    iconClassName="me-0"
                    icon={"mdi mdi-share-variant"}
                    style={{ width: isSplitMode ? "38px" : "auto" }}
                    onClick={() => setOpenShareModal(true)}
                  >
                    {/* {isSplitMode ? "" : t("mail.mail_folder_setting_share_button")} */}
                  </BaseButton>
                </HanTooltip>
              )}

              {/* refresh */}
              <HanTooltip placement="top" overlay={t("common.org_refresh")}></HanTooltip>

              {/* Split mode */}
              {isDesktop && (
                <HanTooltip
                  placement="top"
                  overlay={`${isSplitMode ? t("mail.mail_list_mode") : t("mail.mail_split_mode")}`}
                >
                  <BaseButton
                    outline
                    color={""}
                    className={"me-1 py-0 fs-5 border-1"}
                    icon={`mdi ${isSplitMode ? "mdi-view-list" : "mdi-view-split-vertical"}`}
                    iconClassName={"me-0"}
                    onClick={handleChangeViewMode}
                  />
                </HanTooltip>
              )}
              {/* select number item */}
              {/* <HanTooltip
                placement="top"
                overlay={t("common.common_list_number")}
                trigger={["hover", "click"]}
              >
                <div>
                  <BaseButtonDropdown
                    classDropdownToggle={"btn-outline border-1"}
                    iconClassName={"me-0"}
                  >
                    {numberOptions && numberOptions.length > 0 && numberOptions.map((option, i) => (
                      <React.Fragment key={i}>
                        <DropdownItem
                          className={`w-100 ${userMailSetting?.items_per_page == option.value ? "active-option" : ""}`}
                          onClick={(e) => {
                            e.stopPropagation()
                            onChangeSetting("items_per_page", option.value)
                          }}
                        >
                          {option.label}
                        </DropdownItem>
                      </React.Fragment>

                    ))}
                  </BaseButtonDropdown>
                </div>
              </HanTooltip> */}
            </div>
          </div>
        </div>
      </div>

      {openShareModal && (
        <SelectUsersModal
          isOpen={openShareModal}
          toggleModal={setOpenShareModal}
          boxId={menu}
          loading={shareLoading}
          onPermission={handleShareUsers}
        />
      )}
      {openForwardModal && <ComposeMail {...composeProps} />}
    </React.Fragment>
  )
}

export default EmailToolbar
