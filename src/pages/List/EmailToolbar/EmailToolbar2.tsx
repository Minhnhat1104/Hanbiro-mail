// @ts-nocheck
import { Divider } from "@mui/material"
import classNames from "classnames"
import { BaseButton, BaseButtonDropdown, BaseIcon } from "components/Common"
import { FILES } from "components/Common/Attachment/HanIconFile/icons"
import HanTooltip from "components/Common/HanTooltip"
import { useCustomToast } from "hooks/useCustomToast"
import useDevice from "hooks/useDevice"
import { isArray, isEmpty, isEqual } from "lodash"
import { postMailToHtml5 } from "modules/mail/common/api"
import { postSetShare, postUsersShare } from "modules/mail/settings/api"
import SelectUsersModal from "pages/Settings/Folders/SelectUsersModal"
import React, { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { useSearchParams } from "react-router-dom"
import { Button, Input } from "reactstrap"
import { selectUserMailSetting } from "store/auth/config/selectors"
import { openComposeMail } from "store/composeMail/actions"
import { composeDataDefaults } from "store/composeMail/reducer"
import { setQueryParams, triggerPrintModal } from "store/mailList/actions"
import { setSplitMode } from "store/viewMode/actions"
import { onSharePermission } from "utils"
import FilterToolbarV2 from "../FilterToolbar/FilterToolbarV2"
import FilterStatus from "./FilterStatus"
import MobileSearch from "./MobileSearch"
import ExcludedMailboxModal from "./ExcludedMailboxModal"
import AISelectButton from "components/AIModal/AiSelectButton"
import { emailGet, Headers } from "helpers/email_api_helper"
import AIModal from "components/AIModal"

const EmailToolbar2 = (props) => {
  const {
    menu,
    info,
    attr,
    uuids,
    emlLimit,
    onDelete,
    onMarkRead,
    onSetImportantAll,
    onToggleMove,
    onSelectDataType,
    isSpamManager,
    selectedMails,
    onRefresh,
    setConfirmData,
    onChangeSetting,
    isSplitMode,
    loading,
    listMail,
    shareData,
    isCanHack,
    isHidePageInfo,
    setSelectedMails,
    setUuids,
    onResend,
    onUpdateLocalViewStatus,
  } = props
  const { t } = useTranslation()
  const { successToast, errorToast } = useCustomToast()

  const { isDesktop, isMobile } = useDevice()

  // redux
  const dispatch = useDispatch()
  const userMailSetting = useSelector(selectUserMailSetting)
  const queryParams = useSelector((state) => state.QueryParams.query)
  const userData = useSelector((state) => state.Config?.userConfig?.user_data)
  // const llmConfig = useSelector((state) => state.EmailConfig?.llmConfig)
  const composeMails = useSelector((state) => state.ComposeMail.composeMails)
  const composeDisplayMode = composeMails.localComposeMode

  const [showSearchInputMobile, setShowSearchInputMobile] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const [openShareModal, setOpenShareModal] = useState(false)
  const [openForwardModal, setOpenForwardModal] = useState(false)
  const [openExcludedMailboxModal, setOpenExcludedMailboxModal] = useState(false)
  // const [composeProps, setComposeProps] = useState({})
  const [shareLoading, setShareLoading] = useState(false)

  // const [aiLangList, setAiLangList] = useState([])
  // const [aiData, setAiData] = useState({ open: false, type: "", data: [] })

  const isReceiptsMenu = menu === "Receive"
  const isDisable = selectedMails?.length === 0 ? true : false
  const isOnlyOneSelected = selectedMails?.length === 1 ? true : false
  const isShareMenu = menu?.indexOf("HBShare_") === 0 ? true : false
  const isSecureMenu = menu === "Secure"
  const isSpamMenu = menu === "Spam"
  const isSentMenu = menu === "Sent"

  const limit = useMemo(() => {
    return userMailSetting?.items_per_page ?? 20
  }, [userMailSetting?.items_per_page])

  const initFilter = useMemo(() => {
    return {
      acl: menu,
      act: "maillist",
      mailsort: "date",
      sortkind: "0",
      timemode: "mobile",
      viewcont: `0,${limit}`,
    }
  }, [limit, menu])

  const isShowResetButton = !isEqual(queryParams, initFilter)

  useEffect(() => {
    setShowSearchInputMobile(false)
    setUuids([])
    setSelectedMails([])
  }, [menu])

  // useEffect(() => {
  //   getAiLangList()
  // }, [])

  // const getAiLangList = async () => {
  //   const res = await emailGet("email/ai/langlist", {}, Headers)
  //   if (res.success) {
  //     const list = Object.keys(res.list).map((key) => ({
  //       value: key,
  //       label: res.list[key]?.name || "",
  //     }))
  //     setAiLangList(list)
  //   }
  // }

  const isCheckedAll = useMemo(() => {
    return !isEmpty(selectedMails) && listMail.every((mail) => selectedMails?.includes(mail.mid))
  }, [listMail, selectedMails])

  const getShowButtons = (type) => {
    if (isSplitMode) {
      switch (type) {
        case "spamManager":
          return !isDisable && !isSpamMenu && !isShareMenu && isSpamManager && !isReceiptsMenu
        case "spam":
          return !isDisable && !isSpamMenu && !isSecureMenu && !isShareMenu && !isSpamManager
        case "notspam":
          // case "block":
          return !isDisable && isSpamMenu
        case "unread":
          return (
            !isDisable &&
            !isReceiptsMenu &&
            !isSecureMenu &&
            ((!info.isBothAll && !info.isUnreadAll) || info.isBothAll)
          )
        case "read":
          return (
            !isDisable && !isReceiptsMenu && !isSecureMenu && (info.isUnreadAll || info.isBothAll)
          )
        case "move":
          return !isDisable && !isReceiptsMenu && !isSecureMenu && !isShareMenu
        case "copy":
          return !isDisable && isShareMenu
        case "favorites":
          return !isDisable && !isReceiptsMenu && !isSecureMenu
        case "delete":
          return !isDisable && !isShareMenu
        case "more":
          return !isDisable && !isReceiptsMenu && !isSecureMenu && getShowMoreButton()
        case "resend":
          return selectedMails?.length === 1 && isSentMenu
        default:
          return false
      }
    } else {
      switch (type) {
        case "spamManager":
          return !isDisable && !isSpamMenu && !isShareMenu && isSpamManager && !isReceiptsMenu
        case "spam":
          return !isDisable && !isSpamMenu && !isSecureMenu && !isShareMenu && !isSpamManager
        case "notspam":
          return isSpamMenu
        case "unread":
          return (
            !isReceiptsMenu &&
            !isSecureMenu &&
            ((!info.isBothAll && !info.isUnreadAll) || info.isBothAll)
          )
        case "read":
          return !isReceiptsMenu && !isSecureMenu && (info.isUnreadAll || info.isBothAll)
        case "block":
          return isSpamMenu && !isDisable
        case "move":
          return !isReceiptsMenu && !isSecureMenu && !isShareMenu
        case "copy":
          return isShareMenu
        case "favorites":
          return !isReceiptsMenu && !isSecureMenu
        case "forward":
          return !isReceiptsMenu && !isSecureMenu
        case "emlForward":
          return !isReceiptsMenu && !isSecureMenu && isOnlyOneSelected
        case "hacking":
          // return !isShareMenu && !isSecureMenu
          return isCanHack && !isDisable
        case "delete":
          return !isShareMenu
        case "resend":
          return selectedMails?.length === 1 && isSentMenu
        case "more":
          return false
        default:
          return false
      }
    }
  }

  const getShowMoreButton = () => {
    return moreOptions.some((option) => option.isShow)
  }

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
    ...(isMobile
      ? [
          {
            value: 7,
            title: t("mail.mail_list_reportspam"),
            isShow: getShowButtons("spam") && !isDisable,
            onClick: () => {
              setConfirmData({
                open: true,
                type: "spam",
              })
            },
          },
          {
            value: 8,
            title: t("mail.mail_button_report_no_spam"),
            isShow: getShowButtons("notspam") && !isDisable,
            onClick: () => {
              setConfirmData({
                open: true,
                type: "nospam",
              })
            },
          },
          {
            value: 9,
            title: t("common.mail_list_toread"),
            isShow: getShowButtons("read") && !isDisable,
            onClick: () => onMarkRead(true),
          },
          {
            value: 10,
            title: t("mail.mail_list_tounread"),
            isShow: getShowButtons("unread") && !isDisable,
            onClick: () => onMarkRead(false),
          },
          {
            value: 11,
            title: t("mail.mail_list_bans"),
            isShow: getShowButtons("block") && !isDisable,
            onClick: () => onBlockSender(),
          },
          {
            value: 12,
            title: t("common.common_move"),
            isShow: getShowButtons("move") && !isDisable,
            onClick: () => onToggleMove && onToggleMove("move"),
          },
          {
            value: 13,
            title: t("common.action_copy"),
            isShow: getShowButtons("copy") && !isDisable,
            onClick: () => onToggleMove && onToggleMove("copy"),
          },
          {
            value: 14,
            title: t("common.common_messenger_favorite"),
            isShow: getShowButtons("favorites"),
            onClick: () => onSetImportantAll(),
          },
          {
            value: 15,
            title: t("common.mail_view_forward"),
            isShow:
              ((shareData.isShareMail && shareData.shareInfo?.sharepermission?.includes("s")) ||
                !shareData.isShareMail) &&
              getShowButtons("forward") &&
              !isDisable,
            onClick: () => onForward(),
          },
          {
            value: 16,
            title: t("mail.mail_eml_forward"),
            isShow:
              ((shareData.isShareMail && shareData.shareInfo?.sharepermission?.includes("s")) ||
                !shareData.isShareMail) &&
              isOnlyOneSelected &&
              getShowButtons("emlForward"),
            onClick: () => onEmlForward(),
          },
          {
            value: 17,
            title: t("mail.mail_report_hacking_mail"),
            isShow: getShowButtons("hacking") && !isDisable,
            onClick: () => onReportHackingMail(),
          },
          {
            value: 18,
            title: t("mail.mail_list_maildelete"),
            isShow: getShowButtons("delete") && !isDisable,
            onClick: () => handleDeleteMail(),
          },
        ]
      : []),
  ]

  const moreOptions = [
    ...(isHidePageInfo
      ? [
          {
            title: t("common.mail_list_toread"),
            onClick: () => onMarkRead(true),
            icon: "mdi mdi-eye",
            iconClassName: "me-1",
            isShow: getShowButtons("read"),
          },
          {
            title: t("mail.mail_list_tounread"),
            onClick: () => onMarkRead(false),
            icon: "mdi mdi-eye-off",
            iconClassName: "me-1",
            isShow: getShowButtons("unread"),
          },
          {
            title: t("mail.mail_list_bans"),
            onClick: () => onBlockSender(),
            icon: "mdi mdi-minus-circle",
            iconClassName: "me-1",
            isShow: getShowButtons("block"),
          },
          {
            title: t("common.common_move"),
            onClick: () => onToggleMove && onToggleMove("move"),
            icon: "mdi mdi-folder",
            iconClassName: "me-1",
            isShow: getShowButtons("move"),
          },
          {
            title: t("common.action_copy"),
            onClick: () => onToggleMove && onToggleMove("copy"),
            icon: "mdi mdi-content-copy",
            iconClassName: "me-1",
            isShow: getShowButtons("copy"),
          },
          {
            title: t("common.common_messenger_favorite"),
            onClick: () => onSetImportantAll(),
            icon: "fas fa-star",
            iconClassName: classNames("me-1", {
              "text-warning": info.isImportantAll,
            }),
          },
        ]
      : []),

    {
      title: t("common.mail_view_forward"),
      onClick: () => onForward(),
      icon: "fas fa-share",
      iconClassName: "me-1",
      isShow:
        (shareData.isShareMail && shareData.shareInfo?.sharepermission?.includes("s")) ||
        !shareData.isShareMail,
    },
    {
      title: t("mail.mail_eml_forward"),
      onClick: () => onEmlForward(),
      icon: "fas fa-share",
      iconClassName: "me-1",
      isShow:
        isOnlyOneSelected &&
        ((shareData.isShareMail && shareData.shareInfo?.sharepermission?.includes("s")) ||
          !shareData.isShareMail),
    },
    {
      title: t("mail.mail_report_hacking_mail"),
      onClick: () => onReportHackingMail(),
      icon: "fas fa-bug",
      iconClassName: "me-1",
      isShow: isCanHack,
    },
    {
      title: t("mail.mail_list_bans"),
      onClick: () => onBlockSender(),
      icon: "mdi mdi-minus-circle",
      iconClassName: "me-1",
      isShow: isSpamMenu && !isDisable,
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
    if (
      !queryParams?.msgsig ||
      (typeof queryParams?.msgsig === "string" && queryParams?.msgsig !== "new")
    ) {
      dispatch(setQueryParams({ ...queryParams, viewcont: `0,${limit}`, msgsig: "new" }))
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
    if (selectedMails.length > emlLimit) {
      errorToast(t("mail.mail_forward_limit_msg").replace("limit_number", emlLimit))
      return
    }
    // setComposeProps({
    //   titleCompose: "common.mail_view_forward",
    //   handleClose: () => setOpenForwardModal(false),
    //   mid: selectedMails[0],
    //   uuids: uuids?.length > 1 ? uuids : undefined,
    //   modeType: "forward",
    // })
    // setOpenForwardModal(true)
    const composeData = {
      ...composeDataDefaults,
      id: `compose-mail-${composeMails.data.length}`,
      composeMode: composeDisplayMode,
      titleCompose: "common.mail_view_forward",
      mid: selectedMails[0],
      uuids: uuids?.length > 1 ? uuids : undefined,
      modeType: "forward",
    }
    dispatch(openComposeMail(composeData))
  }

  const onEmlForward = () => {
    // setComposeProps({
    //   titleCompose: "mail.mail_eml_forward",
    //   handleClose: () => setOpenForwardModal(false),
    //   mid: selectedMails[0],
    //   uuids: uuids,
    //   modeType: "forward",
    // })
    // setOpenForwardModal(true)
    const composeData = {
      ...composeDataDefaults,
      id: `compose-mail-${composeMails.data.length}`,
      composeMode: composeDisplayMode,
      titleCompose: "mail.mail_eml_forward",
      mid: selectedMails[0],
      uuids: uuids,
      modeType: "eml-forward",
    }
    dispatch(openComposeMail(composeData))
  }

  const onReportHackingMail = () => {
    // setComposeProps({
    //   handleClose: () => setOpenForwardModal(false),
    //   mid: selectedMails,
    //   modeType: "hacking",
    //   ...(uuids.length > 0 && { uuids: uuids.join(",") }),
    // })
    // setOpenForwardModal(true)
    const composeData = {
      ...composeDataDefaults,
      id: `compose-mail-${composeMails.data.length}`,
      composeMode: composeDisplayMode,
      mid: selectedMails,
      modeType: "hacking",
      ...(uuids.length > 0 && { uuids: uuids.join(",") }),
    }
    dispatch(openComposeMail(composeData))
  }

  const onBlockSender = () => {
    if (selectedMails.length <= 0) return
    const data = listMail.filter((item) => selectedMails.includes(item.mid))
    let blockArr = []
    if (data.length > 0) {
      data.forEach((item) => {
        const params = {
          act: "bans",
          mode: "write",
          data: item?.addr ?? item?.from_addr,
        }
        const blockSender = () => postMailToHtml5(params)
        blockArr.push(blockSender())
      })
    }
    Promise.all(blockArr).then((res) => {
      successToast()
    })
  }

  // const handleUpdateViewStatus = (mail) => {
  //   if (mail?.isnew != 0) {
  //     onMarkRead && onMarkRead(true, mail?.mid, false, false)
  //     onUpdateLocalViewStatus && onUpdateLocalViewStatus(mail?.mid)
  //   }
  // }

  return (
    <React.Fragment>
      <div className={`mail-toolbar ${isMobile ? "mobile" : "py-0"}`}>
        <div className="mail-toolbar-content d-flex position-relative align-items-center justify-content-between w-100">
          {/* left toolbar */}
          <div className="left-toolbar btn-toolbar ps-2 align-items-center" role="toolbar">
            <Input
              type="checkbox"
              className="checkbox-wrapper-mail m-0 border-1"
              checked={isCheckedAll}
              onChange={(e) => {}}
              onClick={(e) => (e.target.checked ? onSelectDataType() : onSelectDataType("none"))}
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
                  classDropdown={"dropdown-all ps-2"}
                  classDropdownToggle={"btn-no-active"}
                />
              </div>
            </HanTooltip>

            {/* unread count */}
            {!(isSplitMode && !isDisable) && (
              <div className={"un-read-mail"} onClick={handleChangeStatus}>
                <span className={"new color-white bg-primary"}>N</span>
                <span className={"han-h5 han-fw-semibold han-text-primary ms-2"}>
                  {info.countNew.new}{" "}
                  {info.countNew.total != 0 && <span>/ {info.countNew.total}</span>}
                </span>
              </div>
            )}

            {!isSplitMode && !isMobile && (
              <Divider flexItem orientation="vertical" sx={{ ml: 2, mr: 1 }} />
            )}

            {/* Buttons */}
            {!isMobile && (
              <div className={`d-flex gap-1`}>
                {/* set spam manager */}
                {getShowButtons("spamManager") && (
                  <HanTooltip placement="top" overlay={t("mail.mail_list_reportspam")}>
                    <BaseButton
                      outline
                      className={"btn-outline-grey btn-action-icon py-0 fs-5"}
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

                {/* set spam */}
                {getShowButtons("spam") && (
                  <HanTooltip placement="top" overlay={t("mail.mail_list_reportspam")}>
                    <BaseButton
                      outline
                      className={"btn-outline-grey btn-action-icon py-0 fs-5"}
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

                {/* un spam */}
                {getShowButtons("notspam") && (
                  <HanTooltip placement="top" overlay={t("mail.mail_button_report_no_spam")}>
                    <Button
                      outline
                      className={
                        "btn-outline-grey btn-action-icon p-0 align-items-center justify-content-center"
                      }
                      onClick={() => setConfirmData({ open: true, type: "nospam" })}
                      disabled={isDisable}
                    >
                      {FILES.notSpam}
                    </Button>
                  </HanTooltip>
                )}

                {/* Mark Read */}
                {getShowButtons("read") && !isHidePageInfo && (
                  <HanTooltip placement="top" overlay={t("common.mail_list_toread")}>
                    <BaseButton
                      outline
                      className={"btn-outline-grey btn-action-icon py-0 fs-4"}
                      icon={"mdi mdi-eye-off"}
                      iconClassName={"me-0"}
                      onClick={() => onMarkRead(true)}
                      disabled={isDisable}
                    />
                  </HanTooltip>
                )}
                {/* Mark Unread */}
                {getShowButtons("unread") && !isHidePageInfo && (
                  <HanTooltip placement="top" overlay={t("mail.mail_list_tounread")}>
                    <BaseButton
                      outline
                      className={"btn-outline-grey btn-action-icon py-0 fs-4"}
                      icon={"mdi mdi-eye"}
                      iconClassName={"me-0"}
                      onClick={() => onMarkRead(false)}
                      disabled={isDisable}
                    />
                  </HanTooltip>
                )}
                {/* Block sender */}
                {getShowButtons("block") && !isHidePageInfo && (
                  <HanTooltip placement="top" overlay={t("mail.mail_list_bans")}>
                    <BaseButton
                      outline
                      className={"btn-outline-grey btn-action-icon py-0 fs-4"}
                      icon={"mdi mdi-minus-circle"}
                      iconClassName={"me-0"}
                      onClick={() => onBlockSender()}
                      disabled={isDisable}
                    />
                  </HanTooltip>
                )}
                {/* move to folder */}
                {getShowButtons("move") && !isHidePageInfo && (
                  <HanTooltip placement="top" overlay={t("common.common_move")}>
                    <BaseButton
                      outline
                      className={"btn-outline-grey btn-action-icon py-0 fs-4"}
                      icon={"mdi mdi-folder"}
                      iconClassName={"me-0"}
                      onClick={() => onToggleMove && onToggleMove("move")}
                      disabled={isDisable}
                    />
                  </HanTooltip>
                )}
                {/* copy mail */}
                {getShowButtons("copy") && !isHidePageInfo && (
                  <HanTooltip placement="top" overlay={t("common.action_copy")}>
                    <BaseButton
                      outline
                      className={"btn-outline-grey btn-action-icon py-0 fs-5"}
                      icon={"mdi mdi-content-copy"}
                      iconClassName={"me-0"}
                      onClick={() => onToggleMove && onToggleMove("copy")}
                      disabled={isDisable}
                    />
                  </HanTooltip>
                )}

                {getShowButtons("resend") && (
                  <HanTooltip placement="top" overlay={t("mail.mail_view_resend")}>
                    <BaseButton
                      outline
                      className={"btn-outline-grey btn-action-icon py-0 fs-5"}
                      icon={"fa fa-arrow-left"}
                      iconClassName={"me-0"}
                      onClick={() => onResend && onResend(isShareMenu && menu)}
                      disabled={isDisable}
                    />
                  </HanTooltip>
                )}

                {/* favorite */}
                {/* {getShowButtons("favorites") && !isHidePageInfo && (
                  <HanTooltip placement="top" overlay={t("common.common_messenger_favorite")}>
                    <BaseButton
                      outline
                      className={"btn-outline-grey btn-action-icon py-0"}
                      icon={"fas fa-star"}
                      iconClassName={classNames("me-0", {
                        "text-warning": info.isImportantAll,
                      })}
                      onClick={() => onSetImportantAll()}
                      disabled={isDisable}
                    />
                  </HanTooltip>
                )} */}
                {/* forward */}
                {((shareData.isShareMail && shareData.shareInfo?.sharepermission?.includes("s")) ||
                  !shareData.isShareMail) &&
                  getShowButtons("forward") &&
                  !isHidePageInfo && (
                    <>
                      <HanTooltip placement="top" overlay={t("common.mail_view_forward")}>
                        <BaseButton
                          outline
                          className={"btn-outline-grey btn-action-icon py-0"}
                          icon={"fas fa-share"}
                          iconClassName={"me-0"}
                          onClick={onForward}
                          disabled={isDisable}
                        />
                      </HanTooltip>

                      {isOnlyOneSelected && (
                        <HanTooltip placement="top" overlay={t("mail.mail_eml_forward")}>
                          <BaseButton
                            outline
                            className={"btn-outline-grey btn-action-icon py-0"}
                            icon={"fas fa-share"}
                            iconClassName={"me-0"}
                            onClick={onEmlForward}
                            disabled={isDisable}
                          />
                        </HanTooltip>
                      )}
                    </>
                  )}
                {/* Report hacking mail */}
                {getShowButtons("hacking") && !isHidePageInfo && (
                  <HanTooltip placement="top" overlay={t("mail.mail_report_hacking_mail")}>
                    <BaseButton
                      outline
                      className={"btn-outline-grey btn-action-icon py-0"}
                      icon={"fas fa-bug"}
                      iconClassName={"me-0"}
                      onClick={onReportHackingMail}
                      disabled={isDisable}
                    />
                  </HanTooltip>
                )}

                {/* delete */}
                {getShowButtons("delete") && (
                  <HanTooltip placement="top" overlay={t("mail.mail_list_maildelete")}>
                    <BaseButton
                      outline
                      className={"btn-outline-grey btn-action-icon py-0 font-size-17"}
                      icon={`mdi mdi-trash-can`}
                      iconClassName={"me-0"}
                      disabled={isDisable}
                      onClick={handleDeleteMail}
                    />
                  </HanTooltip>
                )}

                {/* more button */}
                {getShowButtons("more") && (
                  <HanTooltip placement="top" overlay={"More Options"} trigger={["hover", "click"]}>
                    <div>
                      <BaseButtonDropdown
                        icon="fas fa-ellipsis-h"
                        options={moreOptions}
                        iconClassName={"me-0"}
                        classDropdownToggle={"btn-no-active btn-action han-color-grey"}
                        stopPropagation
                      />
                    </div>
                  </HanTooltip>
                )}
              </div>
            )}
          </div>

          {/* right toolbar */}
          {isMobile ? (
            <div className="right-toolbar-mobile px-2">
              {/* filter status */}
              <FilterStatus
                handleClickExcludedMailbox={() =>
                  setOpenExcludedMailboxModal(!openExcludedMailboxModal)
                }
              />

              {/* AI - translate - summary */}
              {/* {!isDisable && llmConfig && llmConfig?.showAI && (
                <AISelectButton
                  isSplitMode={isSplitMode}
                  setAiData={(data) => {
                    const nData = selectedMails?.map(
                      (item, index) => listMail?.find((mail) => mail?.mid === item) || {},
                    )
                    setAiData({ ...data, data: nData, title: t("mail.ai_list_summary") })
                  }}
                />
              )} */}

              {/* share */}
              {!["all", "Receive", "Secure"].includes(menu) && !isShareMenu && (
                <BaseButton
                  outline
                  color={""}
                  className={"btn-share px-1"}
                  iconClassName="me-0"
                  icon={"mdi mdi-share-variant han-text-secondary font-size-18"}
                  style={{ width: "auto" }}
                  onClick={(e) => {
                    e.stopPropagation()
                    setOpenShareModal(true)
                  }}
                ></BaseButton>
              )}
              {/* Search */}
              <BaseIcon
                icon={"mdi mdi-magnify font-size-22 han-text-secondary p-1"}
                onClick={() => setShowSearchInputMobile(true)}
              />
              {/* mobile search */}
              <div
                className={`mobile-search-input px-2 ${showSearchInputMobile ? "show" : "hide"}`}
              >
                <BaseIcon
                  icon={"mdi mdi-chevron-left pe-2 font-size-22 han-text-secondary"}
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowSearchInputMobile(false)
                  }}
                />

                {/* search input */}
                <MobileSearch
                  className={""}
                  initialData={searchParams.get("keyword") ?? ""}
                  onSubmit={(keywork) => {
                    const nParams = {
                      ...queryParams,
                      keyword: keywork,
                      viewcont: `0,${limit}`,
                      searchfild: !!queryParams?.searchfild ? queryParams?.searchfild : "all",
                    }
                    dispatch(setQueryParams(nParams))
                  }}
                  iconClass={isSecureMenu || isReceiptsMenu ? "me-2" : ""}
                />

                {/* filter button */}
                <FilterToolbarV2 />
              </div>
            </div>
          ) : (
            <div className="right-toolbar gap-2">
              {/* Permission of Shared Folder */}
              {!isSplitMode && shareData.isShareMail && (
                <div className="permission">
                  <span title="Sharer">{userData?.title || userData?.id}</span> |{" "}
                  <span>
                    {t("mail.mail_permission_to")}{" "}
                    <b>{onSharePermission(shareData.isShareMail, shareData.shareInfo)}</b>
                  </span>
                </div>
              )}

              {/* reset filter */}
              {isShowResetButton && (isSecureMenu || isReceiptsMenu) && (
                <HanTooltip placement="top" overlay={t("common.admin_reset_msg")}>
                  <BaseButton
                    color={`grey`}
                    className={"btn-action py-0 fs-5"}
                    icon={"bx bx-reset"}
                    iconClassName={"me-0"}
                    onClick={() => dispatch(setQueryParams(initFilter))}
                  />
                </HanTooltip>
              )}

              {/* filter status */}
              <FilterStatus
                pageLimit={limit}
                handleClickExcludedMailbox={() =>
                  setOpenExcludedMailboxModal(!openExcludedMailboxModal)
                }
              />

              {/* AI - translate - summary */}
              {/* {!isDisable && llmConfig && llmConfig?.showAI && (
                <AISelectButton
                  isSplitMode={isSplitMode}
                  setAiData={(data) => {
                    const nData = selectedMails?.map(
                      (item, index) => listMail?.find((mail) => mail?.mid === item) || {},
                    )
                    setAiData({ ...data, data: nData, title: t("mail.ai_list_summary") })
                  }}
                />
              )} */}

              {/* share */}
              {!["all", "Receive", "Secure"].includes(menu) && !isShareMenu && (
                <HanTooltip
                  placement="top"
                  overlay={t("mail.mail_folder_setting_share_button")}
                  trigger="hover"
                >
                  <BaseButton
                    color={"grey"}
                    className={"btn-action btn-share"}
                    icon={"mdi mdi-share-variant"}
                    iconClassName="me-0"
                    onClick={() => setOpenShareModal(true)}
                  ></BaseButton>
                </HanTooltip>
              )}

              {/* Print */}
              <HanTooltip placement="top" overlay={t("common.mail_print_msg")}>
                <BaseButton
                  color={`grey`}
                  className={`btn-action py-0 fs-5`}
                  icon={"bx bx-printer"}
                  iconClassName={``}
                  iconPosition={`right`}
                  onClick={() => dispatch(triggerPrintModal(true))}
                />
              </HanTooltip>

              {/* Split mode */}
              {isDesktop && (
                <HanTooltip
                  placement="top"
                  overlay={`${isSplitMode ? t("mail.mail_list_mode") : t("mail.mail_split_mode")}`}
                >
                  <BaseButton
                    color={`grey`}
                    className={`btn-action py-0 fs-5`}
                    icon={`mdi ${
                      isSplitMode ? "mdi-view-list-outline" : "mdi-view-split-vertical"
                    }`}
                    iconClassName={``}
                    iconPosition={`right`}
                    onClick={handleChangeViewMode}
                  />
                </HanTooltip>
              )}
            </div>
          )}
        </div>
        {/* </div> */}
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

      {openExcludedMailboxModal && (
        <ExcludedMailboxModal
          open={openExcludedMailboxModal}
          onClose={() => setOpenExcludedMailboxModal(false)}
          refreshList={() => {
            onRefresh && onRefresh()
          }}
        />
      )}

      {/* {aiData.open && (
        <AIModal
          open={aiData.open}
          aiData={aiData}
          onClose={() => {
            setAiData({ open: false, type: "", data: [] })
            setSelectedMails([])
          }}
          onFinishSummary={handleUpdateViewStatus}
        />
      )} */}

      {/* {openForwardModal && (
        <ComposeMail {...composeProps} selectedMails={selectedMails} listMail={listMail} />
      )} */}
    </React.Fragment>
  )
}

export default EmailToolbar2
