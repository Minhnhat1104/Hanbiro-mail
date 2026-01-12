// @ts-nocheck
import classnames from "classnames"
import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { Input, Spinner } from "reactstrap"

import { BaseButton, BaseIcon, NoData } from "components/Common"
import { formatSize } from "utils"

import HanTooltip from "components/Common/HanTooltip"
import { ModalConfirm } from "components/Common/Modal"
import useDevice from "hooks/useDevice"
import { useDispatch, useSelector } from "react-redux"
import { setCurrentAcl, setIsSecureView, setIsViewFromList } from "store/mailDetail/actions"
import { getStatusPermit } from ".."
import AddressAction from "../AddressAction"
import ModalPreview from "../ModalPreview"
import { showCipherIcon, showSentSecuStatus } from "../utils"
import AISelectButton from "components/AIModal/AiSelectButton"

export const formatDateListMail = (item, config) => {
  if (item.date != "") return item.date
  if (typeof item.timestamp === "undefined") return ""
  let getDate = new Date((parseInt(item.timestamp) + 32400) * 1000)
  let year = getDate.getUTCFullYear()
  let month = (getDate.getUTCMonth() + 1).toString()
  if (month.length === 1) month = "0" + month
  let date = getDate.getUTCDate().toString()
  if (date.length === 1) date = "0" + date
  let hour = getDate.getUTCHours().toString()
  if (hour.length === 1) hour = "0" + hour
  let min = getDate.getUTCMinutes().toString()
  if (min.length === 1) min = "0" + min
  return (
    config?.date_format.replace("Y", year).replace("m", month).replace("d", date) +
    " " +
    hour +
    ":" +
    min
  )
  // const nTimestamp = (parseInt(item.timestamp) + 32400) * 1000
  // return moment.utc(nTimestamp).format(getDateTimeFormat(config).toUpperCase())
}

const ListItem = (props) => {
  const {
    menu,
    language,
    listMail,
    handleSelect,
    selectedMails,
    loading,
    onSetImportant,
    onMarkRead,
    onDelete,
    onForward,
    setConfirmData,
    onComposeTo,
    onSearchAddress,
    onAddContact,
    onBlockAddress,
    onAutoSortMailtoFolder,
    onCancelSendLater,
    onCancelSending,
    shareData,
    onOpenNewWindow,
    handleCopyToClipboard,
    setAiData,
    useInside,
  } = props

  const { t } = useTranslation()
  const navigate = useNavigate()
  const { isDesktop } = useDevice()

  const dispatch = useDispatch()
  const userConfig = useSelector((state) => state.Config.userConfig)
  const llmConfig = useSelector((state) => state.EmailConfig?.llmConfig)

  const listRef = useRef(null)

  const [showHoverButton, setShowHoverButton] = useState("")
  const [currentMid, setCurrentMid] = useState("")
  const [mailAcl, setMailAcl] = useState("")
  const [openPreviewModal, setOpenPreviewModal] = useState(false)
  const [confirmModalData, setConfirmModalData] = useState({
    open: false,
    mid: "",
  })

  const isReceiptsMenu = menu === "Receive"
  const isShareMenu = menu?.indexOf("HBShare_") === 0 ? true : false
  const isSecureMenu = menu === "Secure"
  const isSentMenu = menu === "Sent"

  useEffect(() => {
    listRef?.current?.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    })
  }, [menu, listMail])

  useEffect(() => {
    setCurrentMid("")
  }, [menu])

  const checkIsNew = (obj) => {
    return obj.isnew
  }

  const generateUrlViewDetail = (acl, id) => {
    return `/mail/list/${menu}/${id}`
  }

  const handleGenerateUrlViewDetail = (acl, id, secsig) => {
    dispatch(setCurrentAcl(isShareMenu ? menu : acl))
    dispatch(setIsSecureView(secsig))
    dispatch(setIsViewFromList(true))
    navigate(generateUrlViewDetail(acl, id))
  }

  return loading && listMail.length === 0 ? (
    <div className="d-flex justify-content-center align-items-center w-100 h-100">
      <Spinner color="primary" style={{ width: "2rem", height: "2rem" }} />
    </div>
  ) : listMail.length > 0 ? (
    <>
      <ul ref={listRef} className={classnames("message-list h-100", { loading: loading })}>
        {listMail.map((mail, index) => {
          const isNew = checkIsNew(mail)
          const key =
            mail?.timestamp && mail?.timeuuid
              ? `${mail.timestamp}-${mail.timeuuid}`
              : mail?.dummy || index
          return (
            <li
              key={key}
              className={`mail-item px-2 ${
                showHoverButton === mail.mid ? "han-bg-color-light-grey" : ""
              }`}
              onMouseEnter={() => setShowHoverButton(mail.mid)}
              onMouseLeave={() => setShowHoverButton("")}
            >
              {/* left content */}
              <div className="col-mail col-mail-1 left-content h-100 d-flex align-items-center">
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

                {/* address action */}
                <AddressAction
                  mail={mail}
                  title={mail.from_name || mail.from_addr}
                  titleClass={`han-h5 ${isNew ? "han-fw-bold" : "han-fw-regular"} han-text-primary`}
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
              {/* center content */}
              <div
                className={`col-mail col-mail-2 d-flex justify-content-between center-content flex-grow-1`}
              >
                {/* mail info */}
                <div className={`d-flex justify-content-start align-items-center w-80`}>
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
                  <div
                    role={`button`}
                    className={`position-relative text-truncate d-flex align-items-center hover-underline ${
                      menu === "Sent" ? "list-width" : ""
                    }`}
                    onClick={() => {
                      handleGenerateUrlViewDetail(mail.acl, mail.mid, mail?.secsig)
                    }}
                  >
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
                    {useInside && mail?.isinside === false && (
                      <span className={`mail-badge`}>
                        <span
                          className={classnames(
                            "han-h6 han-fw-semibold badge han-badge-error px-2 py-1 me-1",
                            { "mail-badge-new": isNew },
                          )}
                        >
                          {t("mail.mail_external")}
                        </span>
                      </span>
                    )}

                    {/* Show cipher icon */}
                    {showCipherIcon(mail)}
                    {/* Show sent secu status */}
                    {showSentSecuStatus(mail)}
                    {/* receipts menu cancel sending*/}
                    {isReceiptsMenu && mail?.getbackstate && (
                      <span
                        className={`cancel-sending ${
                          mail?.getbackstate === "complete" ? "complete" : ""
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
                      } han-text-primary`}
                      dangerouslySetInnerHTML={{
                        __html: isReceiptsMenu
                          ? mail?.stripsubject
                          : mail.subject || t("mail.mail_summary_msg"),
                      }}
                    />
                    {mail.vsstatus != "" && <span className={"color-red"}>{mail.vsstatus}</span>}
                  </div>
                </div>

                {/* quick action button */}
                {showHoverButton === mail.mid && (
                  <div className="quick-action-mail">
                    <div className={`d-flex px-2 gap-1 justify-content-end align-items-center`}>
                      {/* AI - translate - summary */}
                      {llmConfig && llmConfig.showAI && (
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
                      {mail?.sendlater?.issendlater &&
                        mail?.sendlater?.sendlater_status === "n" && (
                          <HanTooltip placement="top" overlay={t("common.admin_cancel_msg")}>
                            <BaseButton
                              outline
                              className={"btn-outline-grey"}
                              icon={"fas fas fa-undo"}
                              type="button"
                              iconClassName={"me-0"}
                              onClick={() => setConfirmModalData({ open: true, mid: mail.mid })}
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
                          <HanTooltip
                            placement="top"
                            overlay={t("common.board_office_preview_msg")}
                          >
                            <BaseButton
                              outline
                              icon={"fas fa-search"}
                              className={`btn-outline-grey`}
                              type="button"
                              iconClassName={"me-0"}
                              onClick={() => {
                                setCurrentMid(mail?.mid)
                                setMailAcl(mail?.acl)
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
                                    onForward && onForward(mail)
                                    setCurrentMid(mail.mid)
                                  }}
                                />
                              </HanTooltip>
                            )}
                        </>
                      )}
                      {/* delete */}
                      {!isShareMenu && (
                        <HanTooltip placement="top" overlay={t("mail.mail_list_maildelete")}>
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
                          onClick={() => onMarkRead(mail.isnew, mail.mid)}
                        />
                      </HanTooltip>
                    </div>
                  </div>
                )}

                {/* approval mail */}
                {menu === "Sent" && getStatusPermit(mail?.secu_state, t)}
              </div>

              {/* right content */}
              {/* <div className="col-mail right-content position-relative">
              </div> */}
              {/* attachment icon */}
              <span className={"list-att-icon"}>
                {mail.is_file != "0" && <BaseIcon icon={"fas fa-paperclip"} />}
              </span>
              {/* size */}
              <div
                className={`col-mail col-mail-3 han-h5 ${
                  isNew ? "han-fw-bold" : "han-fw-regular"
                } han-text-primary list-right`}
              >
                {isReceiptsMenu && (
                  <span className="list-date">{formatDateListMail(mail, userConfig)}</span>
                )}
                {isDesktop && (
                  <span className="list-size text-truncate">{formatSize(mail.size)}</span>
                )}
                {/* date */}
                {isReceiptsMenu ? (
                  <span
                    className="list-date htime"
                    style={{
                      flex: 1,
                      minWidth: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {mail?.htime}
                  </span>
                ) : (
                  <span
                    className="list-date"
                    style={{
                      flex: 1,
                      minWidth: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {formatDateListMail(mail, userConfig)}
                  </span>
                )}
              </div>
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
          currentAcl={mailAcl}
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

export default ListItem
