// @ts-nocheck
import classnames from "classnames"
import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { Badge, DropdownItem, Input, Spinner } from "reactstrap"

import { BaseButton, BaseButtonDropdown, BaseIcon, NoData } from "components/Common"
import { formatSize } from "utils"

import classNames from "classnames"
import ComposeMail from "components/Common/ComposeMail"
import { ModalConfirm } from "components/Common/Modal"
import HanTooltip from "components/Common/HanTooltip"
import { getStatusPermit } from ".."
import ModalPreview from "../ModalPreview"
import "./styles.scss"
import { useDispatch, useSelector } from "react-redux"
import { formatDateInMobile, formatDateListMail } from "../ListItem"
import { setCurrentAcl, setIsSecureView, setIsViewFromList } from "store/mailDetail/actions"
import useDevice from "hooks/useDevice"
import MailAddressDropdown from "components/MailAddressDropdown"
import { showCipherIcon, showSentSecuStatus } from "../utils"
import AddressAction from "../AddressAction"
import AISelectButton from "components/AIModal/AiSelectButton"

const SplitItem = (props) => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const {
    menu,
    language,
    router,
    listMail,
    handleSelect,
    selectedMails,
    loading,
    onSetImportant,
    onMarkRead,
    onDelete,
    setConfirmData,
    onRefresh,
    onComposeTo,
    onSearchAddress,
    onAddContact,
    onBlockAddress,
    onAutoSortMailtoFolder,
    onChangeCount,
    onChangeUnread,
    onCancelSending,
    onForward,
    onCancelSendLater,
    shareData,
    onOpenNewWindow,
    handleCopyToClipboard,
    setAiData,
  } = props

  const { isMobile } = useDevice()

  const isReceiptsMenu = menu === "Receive"
  const isShareMenu = menu?.indexOf("HBShare_") === 0 ? true : false
  const isSecureMenu = menu === "Secure"

  // redux
  const dispatch = useDispatch()
  const userConfig = useSelector((state) => state.Config.userConfig)
  const llmConfig = useSelector((state) => state.EmailConfig?.llmConfig)

  const [currentMid, setCurrentMid] = useState("")
  const [openPreviewModal, setOpenPreviewModal] = useState(false)
  const [confirmModalData, setConfirmModalData] = useState({
    open: false,
    mid: "",
  })
  const [showPopover, setShowPopover] = useState(false)
  const [showHoverButton, setShowHoverButton] = useState("")

  useEffect(() => {
    setCurrentMid("")
  }, [menu])

  const checkIsNew = (obj) => {
    return obj.isnew
  }

  const generateUrlViewDetail = (acl, id) => {
    return `/mail/list/${menu}/${id}${router.location.search}`
  }

  const handleGenerateUrlViewDetail = (acl, id, secsig) => {
    dispatch(setCurrentAcl(isShareMenu ? menu : acl))
    dispatch(setIsSecureView(secsig))
    dispatch(setIsViewFromList(true))
    navigate(generateUrlViewDetail(acl, id))
  }

  // const openNewWindow = (acl, mid) => {
  //   const passwordToPrint = false
  //   const url = ["/email/mailprint", acl, mid, passwordToPrint, "true"].join(
  //     "/"
  //   )
  //   window.open(
  //     `${url}${isShareMenu ? "?shareid=" + menu : ""}`,
  //     "_blank",
  //     "width=1150,height=749,scrollbars=1,resizable=1"
  //   )
  // }

  const handleCancelSendLater = (menu, mid) => {
    setConfirmModalData({ open: true, mid: mid })
  }

  return loading && listMail.length == 0 ? (
    <div className="d-flex justify-content-center align-items-center w-100 h-100">
      <Spinner color="primary" style={{ width: "2rem", height: "2rem" }} />
    </div>
  ) : listMail.length > 0 ? (
    <>
      <ul className={classnames("split-view p-0 mb-0", { loading: loading })}>
        {listMail.map((mail, index) => {
          const isNew = checkIsNew(mail)
          const isSelectMail = mail?.mid === router?.params?.mid
          // if (isSelectMail && isNew) {
          //   onChangeCount && onChangeCount("minus", 1)
          //   onChangeUnread && onChangeUnread(index, 0)
          // }
          return (
            <li
              key={mail.mid}
              className={`split-mail-item pt-1 pb-2 px-2 w-100 ${isSelectMail ? "selected" : ""} ${
                isMobile && index < listMail?.length - 1 ? "border-bottom border-bottom-1" : ""
              } ${showHoverButton === mail.mid ? "han-bg-color-light-grey" : ""}`}
              onMouseEnter={() => setShowHoverButton(mail.mid)}
              onMouseLeave={() => setShowHoverButton("")}
            >
              {/* header */}
              <div className="header-split w-100 d-flex align-items-center justify-content-between">
                <div className="left-content d-flex align-items-center">
                  <Input
                    className="checkbox-wrapper-mail m-0 border-1 me-3"
                    type="checkbox"
                    value={mail.mid}
                    id={mail.mid}
                    name="emailcheckbox"
                    onChange={(e) => e.target.value}
                    onClick={(e) => handleSelect(e.target.value, mail?.timeuuid)}
                    checked={selectedMails.includes(mail.mid)}
                  />

                  {!isReceiptsMenu && (
                    <>
                      {mail.isimportant ? (
                        <BaseIcon
                          icon={"fas fa-star"}
                          className={"star-toggle text-warning cursor-pointer"}
                          onClick={() => onSetImportant(false, mail.acl, mail.mid)}
                        />
                      ) : (
                        <BaseIcon
                          icon={"far fa-star"}
                          className={"star-toggle"}
                          onClick={() => onSetImportant(true, mail.acl, mail.mid)}
                        />
                      )}
                    </>
                  )}

                  {mail?.sendlater && mail.sendlater.issendlater ? (
                    <span className="ms-2">
                      {mail.sendlater.sendlater_status == "c" ? (
                        <i className="mdi mdi-cancel color-red font-size-16"></i>
                      ) : null}
                      {mail.sendlater.sendlater_status == "n" ? (
                        <i className="mdi mdi-alpha-n-box color-orange font-size-16"></i>
                      ) : null}
                      {mail.sendlater.sendlater_status == "s" ? (
                        <i className="mdi mdi-check-bold color-green font-size-16"></i>
                      ) : null}
                    </span>
                  ) : mail.delay && mail.delay != "no" ? (
                    <span className="ms-2">
                      {mail.delay == "cancel" ? (
                        <i className="mdi mdi-cancel color-red font-size-16"></i>
                      ) : null}
                      {mail.delay == "wait" ? (
                        <i className="mdi mdi-alpha-n-box color-orange font-size-16"></i>
                      ) : null}
                      {mail.delay == "success" ? (
                        <i className="mdi mdi-check-bold color-green font-size-16"></i>
                      ) : null}
                    </span>
                  ) : null}

                  {/* Mail address action */}
                  {/* <BaseButtonDropdown
                    iconClassName={"me-0"}
                    classDropdown={"sender"}
                    classContent={`han-h5 ${
                      isNew ? "han-fw-bold" : "han-fw-regular"
                    } han-text-secondary`}
                    content={mail.from_name || mail.from_addr}
                    showChevron={false}
                    classDropdownToggle={"btn-no-active"}
                  >
                    <DropdownItem
                      onClick={() => handleCopyToClipboard(mail.from_addr)}
                      className="d-flex gap-2 align-items-center"
                    >
                      <BaseIcon icon={"bx bx-copy"} />
                      {t("mail.mail_copy_email_address")}
                    </DropdownItem>
                    <DropdownItem
                      onClick={() => onComposeTo && onComposeTo(mail)}
                      className="d-flex gap-2 align-items-center"
                    >
                      <BaseIcon icon={"bx bx-mail-send"} />
                      {t("mail.mail_menu_write")}
                    </DropdownItem>
                    <DropdownItem
                      onClick={() => onSearchAddress && onSearchAddress("f", mail)}
                      className="d-flex gap-2 align-items-center"
                    >
                      <BaseIcon icon={"bx bx-search"} />
                      {t("mail.mail_view_search_by_from_address")}
                    </DropdownItem>
                    <DropdownItem
                      onClick={() => onSearchAddress && onSearchAddress("t", mail)}
                      className="d-flex gap-2 align-items-center"
                    >
                      <BaseIcon icon={"bx bx-search"} />
                      {t("mail.mail_view_search_by_to_address")}
                    </DropdownItem>
                    <DropdownItem
                      className="d-flex gap-2 align-items-center"
                      onClick={() =>
                        onAddContact &&
                        onAddContact({
                          open: true,
                          data: mail.from_addr,
                        })
                      }
                    >
                      <BaseIcon icon={"bx bxs-contact"} />
                      {t("mail.mail_view_addaddress")}
                    </DropdownItem>
                    <DropdownItem
                      className="d-flex gap-2 align-items-center"
                      onClick={() =>
                        onBlockAddress &&
                        onBlockAddress({
                          open: true,
                          data: mail.from_addr,
                        })
                      }
                    >
                      <BaseIcon icon={"bx bx-block"} />
                      {t("mail.mail_set_bans_bans")}
                    </DropdownItem>
                    <DropdownItem
                      className="d-flex gap-2 align-items-center"
                      onClick={() =>
                        onAutoSortMailtoFolder &&
                        onAutoSortMailtoFolder({
                          open: true,
                          data: mail,
                        })
                      }
                    >
                      <BaseIcon icon={"bx bx-sort"} />
                      {t("mail.mail_view_autosplit")}
                    </DropdownItem>
                  </BaseButtonDropdown> */}
                  <AddressAction
                    mail={mail}
                    titleClass={`mail-from han-h5 ${
                      isNew ? "han-fw-bold" : "han-fw-regular"
                    } han-text-secondary`}
                    title={mail.from_name || mail.from_addr}
                    action={{
                      onComposeTo: () => onComposeTo(mail),
                      onAddContact,
                      onBlockAddress,
                      onSearchAddress: (type) => onSearchAddress(type, mail),
                      onAutoSortMailtoFolder: () =>
                        onAutoSortMailtoFolder({ open: true, data: mail }),
                    }}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                  />
                </div>

                {/* header right */}
                <div
                  className={`header-right d-flex align-items-center ${isNew ? "unread" : ""} ${
                    isReceiptsMenu ? "justify-content-end" : ""
                  }`}
                >
                  {/* approval mail */}
                  <div className="approval-mail me-3" style={{ left: "-100px" }}>
                    {menu === "Sent" && getStatusPermit(mail?.secu_state, t)}
                  </div>
                  <div className="size-date d-flex">
                    {!isReceiptsMenu && (
                      <div className="size me-2">
                        <span className={"icon me-1"}>
                          {mail.is_file != "0" && <BaseIcon icon={"fas fa-paperclip"} />}
                        </span>
                        {/* {formatSize(mail.size)} */}
                      </div>
                    )}
                    {isReceiptsMenu ? (
                      <div className={`date han-text-secondary ${isNew ? "unread" : ""}`}>
                        {mail?.htime}
                      </div>
                    ) : (
                      <div className="date han-text-secondary">
                        {formatDateListMail(mail, userConfig)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* content */}
              <div className="ms-4 position-relative">
                <div className={"subject d-flex align-items-center"}>
                  <span className={"info"}>
                    {mail?.security_info?.hasinfo && (
                      <BaseIcon className="mdi mdi-alert color-red " />
                    )}
                    {(mail.sigmsg == 2 || mail.sigmsg == 5) && (
                      <BaseIcon className="mdi mdi-reply color-blue" />
                    )}
                    {mail?.sendlater?.issendlater && (
                      <BaseIcon className="mdi mdi-clock color-pink" />
                    )}
                  </span>
                  <span className={`flags ${mail.boxname != "" ? "" : "no-width"}`}>
                    {mail.boxname != "" && (
                      // <Badge className={"color-white me-1"} color="primary">
                      //   {mail.boxname}
                      // </Badge>
                      <span className="han-h6 han-fw-semibold badge han-badge-primary px-2 py-1 me-1">
                        {mail.boxname}
                      </span>
                    )}
                  </span>
                  {/* Show cipher icon */}
                  {showCipherIcon(mail)}
                  {/* Show sent secu status */}
                  {showSentSecuStatus(mail)}
                  {/* receipts menu */}
                  {isReceiptsMenu && mail?.getbackstr && (
                    <span
                      className={`cancel-sending text-nowrap ${
                        mail?.getbackstate === "complete" ? "complete" : "cursor-pointer"
                      } ${language === "ko" ? "" : "large-text"}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        if (mail?.getbackstate === "complete") return
                        onCancelSending && onCancelSending(mail)
                      }}
                    >
                      {mail?.getbackstr}
                    </span>
                  )}
                  {mail.groupcount > 0 && (
                    <span
                      className={`color-red ${isNew ? "han-fw-bold" : "han-fw-regular"}`}
                    >{`(${mail.groupcount})`}</span>
                  )}
                  <span
                    className={`han-h5 ${
                      isNew ? "han-fw-bold" : "han-fw-regular"
                    } han-text-primary subject-mail text-truncate 
                      ${isReceiptsMenu && mail?.getbackstate ? "resize-width" : ""}
                      ${isReceiptsMenu ? "receive-menu" : ""}`}
                    dangerouslySetInnerHTML={{
                      __html: isReceiptsMenu
                        ? mail?.stripsubject
                        : mail.subject || t("mail.mail_summary_msg"),
                    }}
                    onClick={(e) => {
                      if (isNew) {
                        onChangeCount && onChangeCount("minus", 1)
                        onChangeUnread && onChangeUnread(index, isNew ? 0 : 1)
                      }
                      if (mail.mid === router?.params?.mid && isNew) {
                        onMarkRead(true, mail.mid, false)
                      } else {
                        handleGenerateUrlViewDetail(mail.acl, mail.mid, mail?.secsig)
                      }
                    }}
                  ></span>
                  {mail.vsstatus != "" && <span className={"color-red"}>{mail.vsstatus}</span>}
                </div>
              </div>
              {/* hover action button */}
              {showHoverButton === mail.mid && (
                <div className="quick-action-mail">
                  {/* AI - translate - summary */}
                  {llmConfig && llmConfig?.showAI && (
                    <AISelectButton
                      isHoverButton
                      onClose={() => setShowHoverButton(false)}
                      setAiData={(data) => {
                        setAiData({
                          ...data,
                          data: [mail],
                        })
                      }}
                    />
                  )}

                  {mail?.sendlater?.issendlater && mail?.sendlater?.sendlater_status === "n" && (
                    <HanTooltip placement="top" overlay={t("common.admin_cancel_msg")}>
                      <BaseButton
                        outline
                        className={"btn-outline-grey"}
                        icon={"fas fas fa-undo"}
                        type="button"
                        iconClassName={"me-0"}
                        onClick={() => handleCancelSendLater(mail.acl, mail.mid)}
                      />
                    </HanTooltip>
                  )}
                  {/* Open in new window */}
                  {!isSecureMenu && (
                    <HanTooltip placement="top" overlay={t("mail.mail_open_window")}>
                      <BaseButton
                        outline
                        icon={"fas fas fa-external-link-alt"}
                        className={`btn-outline-grey`}
                        type="button"
                        iconClassName={"me-0"}
                        onClick={() => onOpenNewWindow && onOpenNewWindow(mail.acl, mail.mid)}
                      />
                    </HanTooltip>
                  )}
                  {!isReceiptsMenu && (
                    <>
                      {/* preview */}
                      <HanTooltip placement="top" overlay={t("common.board_office_preview_msg")}>
                        <BaseButton
                          outline
                          icon={"fas fa-search"}
                          className={`btn-outline-grey`}
                          type="button"
                          iconClassName={"me-0"}
                          onClick={() => {
                            setCurrentMid(mail.mid)
                            setOpenPreviewModal(true)
                          }}
                        />
                      </HanTooltip>
                      {/* Forward */}
                      {((shareData.isShareMail &&
                        shareData.shareInfo?.sharepermission?.includes("s")) ||
                        !shareData.isShareMail) &&
                        !isSecureMenu && (
                          <HanTooltip placement="top" overlay={t("common.mail_view_forward")}>
                            <BaseButton
                              outline
                              icon={"fas fa-share"}
                              className={`btn-outline-grey`}
                              type="button"
                              iconClassName={"me-0"}
                              onClick={() => {
                                setCurrentMid(mail.mid)
                                onForward && onForward(mail)
                              }}
                            />
                          </HanTooltip>
                        )}
                    </>
                  )}
                  {/* delete */}
                  {!isShareMenu && (
                    <HanTooltip placement="top" overlay={t("common.mail_view_trash")}>
                      <BaseButton
                        outline
                        icon={"fas fa-trash-alt"}
                        className={`btn-outline-grey`}
                        type="button"
                        iconClassName={"me-0"}
                        onClick={() =>
                          menu != "Trash"
                            ? onDelete(mail.mid)
                            : setConfirmData({
                                open: true,
                                type: "delete",
                                mid: mail.mid,
                              })
                        }
                      />
                    </HanTooltip>
                  )}
                  {/* Mark as read/unread */}
                  <HanTooltip
                    placement="top"
                    overlay={
                      mail.isnew ? t("common.mail_list_toread") : t("mail.mail_list_tounread")
                    }
                  >
                    <BaseButton
                      outline
                      icon={mail.isnew ? "mdi mdi-eye-off" : "mdi mdi-eye"}
                      className={"btn-outline-grey fs-5 py-0"}
                      iconClassName={"me-0"}
                      onClick={() => {
                        // if (!isNew && mail.mid === router?.params?.mid) {
                        //   onChangeUnread && onChangeUnread(index, isNew ? 0 : 1)
                        // } else {
                        // }
                        onMarkRead(mail.isnew, mail.mid)
                      }}
                    />
                  </HanTooltip>
                </div>
              )}
            </li>
          )
        })}
      </ul>
      {openPreviewModal && (
        <ModalPreview
          isOpen={openPreviewModal}
          setIsOpen={setOpenPreviewModal}
          menu={menu}
          currentMid={currentMid}
          setCurrentMid={setCurrentMid}
          onCallbackDelete={() => {
            if (menu != "Trash") {
              onDelete(currentMid)
              setCurrentMid("")
            } else {
              setConfirmData({
                open: true,
                type: "delete",
                mid: currentMid,
              })
            }
          }}
        />
      )}
      {confirmModalData.open && (
        <ModalConfirm
          // loading={loading}
          isOpen={confirmModalData.open}
          toggle={() => setConfirmModalData({ open: false, mid: "" })}
          onClick={() => {
            onCancelSendLater && onCancelSendLater(confirmModalData.mid)
            setConfirmModalData({ open: false, mid: "" })
          }}
          keyHeader={"common.whisper_cancel_sending"}
          keyBody={"common.whisper_are_you_sure"}
        />
      )}
    </>
  ) : (
    <NoData />
  )
}

export default SplitItem
