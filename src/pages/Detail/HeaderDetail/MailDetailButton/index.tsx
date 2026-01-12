// @ts-nocheck
// React
import React, { useContext, useEffect, useMemo, useRef, useState } from "react"

// Third-party
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap"
import { useTranslation } from "react-i18next"

// Project
import BaseButtonTooltip from "components/Common/BaseButtonTooltip"
import { useCustomToast } from "hooks/useCustomToast"
import { MailContext } from "pages/Detail"
import useGroupwareMenu from "utils/useGroupwareMenu"
import { postToHelpDesk } from "modules/mail/common/api"
import { URL_EMAIL_PRINT } from "modules/mail/common/urls"
import { BaseButton } from "components/Common"
import { useNavigate } from "react-router-dom"
import ModalNewProject from "../ModalNewProject"
import ModalAddEvent from "../ModalAddEvent"
import ModalWriteTodo from "../ModalWriteTodo"
import { useSelector } from "react-redux"
import { onSharePermission } from "utils"
import { DetailNewWindowContext } from "pages/Detail/DetailForNewWindow"
import useDevice from "hooks/useDevice"
import Select from "react-select"

import "./styles.scss"
import AISelectButton from "components/AIModal/AiSelectButton"

const modalType = {
  project: "project",
  calendar: "calendar",
  todo: "todo",
}

const MailDetailButton = ({
  handleActionModal,
  handleResendModal,
  handleEditModal,
  handleReplyModal,
  handleReplyAllModal,
  handleForwardModal,
  handleEmlForwardModal,
  handleReportHackingMailModal,
  handleMarkAsUnread,
  handleSaveMail,
  handleDeleteMail,
  handleReportSpam,
  handleNotSpam,
  handleShowHeader,
  handleShowShareBox,
  handleBlockSender,
  handleAddToContactList,
  handleImmediateSending,
  handleFlag,
  handleMove,
  isSplitMode,
  secretPass,
  handleCancelSendLater,
  isNewWindow,
  isShareMenu,
  important,
  handleMarkAsImportant,
  setAiData,
}) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { isMobile, isDesktop } = useDevice()

  const composeMails = useSelector((state) => state.ComposeMail.composeMails)

  const {
    menu: menuParams,
    mail,
    mid,
  } = useContext(isNewWindow ? DetailNewWindowContext : MailContext)

  const userData = useSelector((state) => state.Config?.userConfig?.user_data)
  const langList = useSelector((state) => state.EmailConfig?.langList)
  const llmConfig = useSelector((state) => state.EmailConfig?.llmConfig)

  const { successToast, errorToast, devToast } = useCustomToast()
  const { useHelpDesk, useNewProject, useTodo, useCalendar } = useGroupwareMenu()

  const [modalData, setModalData] = useState({
    open: false,
    type: "",
  })

  const menu = useMemo(() => {
    return menuParams === "all" ? mail?.acl : menuParams
  }, [menuParams, mail])

  const isHideMoreButton = useMemo(() => {
    return menu === "Receive" || menu === "Secure"
  }, [])

  const handleKeyDown = (e) => {
    e.preventDefault()
    e.stopPropagation()
    console.log(`Blocked: ${e.key}`)
  }

  const isShowDelete = !mail?.isshare
  const isShowMove = !mail?.isshare
  const isShowReplyForward =
    (mail?.isshare && mail?.shareinfo?.sharepermission?.includes("s")) || !mail?.isshare
  const isReSend = menu === "Sent" || mail?.acl === "Sent"
  const isCancelSending = mail?.sendlater?.issendlater && mail?.sendlater?.sendlater_status == "n"

  const onWriteHelpDesk = () => {
    postToHelpDesk({
      menu: menu,
      mid: mid,
    })
      .then((res) => {
        if (res.success == true) {
          successToast(t("common.alert_success_msg"))
        }
      })
      .catch((err) => {
        errorToast(err)
      })
  }

  /**
   * @description Handle action when clicking print button
   * @param {*} acl
   * @param {*} mid
   * @returns {void}
   */
  const handlePrintMail = (acl, mid) => {
    const passwordToPrint = secretPass ? secretPass : false
    const arr = menu.split("_")
    const nAcl = isShareMenu ? arr[arr.length - 1] : acl
    const url = [URL_EMAIL_PRINT, nAcl, mid, passwordToPrint].join("/")
    window.open(
      `${url}${isShareMenu ? "?shareid=" + menu : ""}`,
      "_blank",
      "width=1150,height=749,scrollbars=1,resizable=1",
    )
  }

  const handleNextPrevMail = (type = "next") => {
    const searchParams = location.search.trim()
    navigate(
      type === "next"
        ? `${["/mail/list", mail?.prenextinfo?.nextinfo?.mailbox ?? menu, mail?.nextmail].join(
            "/",
          )}${searchParams}`
        : `${["/mail/list", mail?.prenextinfo?.preinfo?.mailbox ?? menu, mail?.prevmail].join(
            "/",
          )}${searchParams}`,
    )
  }

  const handleOpenModal = (type) => {
    setModalData({
      open: true,
      type: type,
    })
  }

  return (
    <div
      id="mail-detail-buttons"
      className={`d-flex align-items-center gap-2 ${isSplitMode ? "justify-content-end" : ""}`}
    >
      {/* share info */}
      {isDesktop && !isSplitMode && mail?.isshare && (
        <div className="d-flex align-items-center">
          <span title="Sharer">{userData?.title || userData?.id}</span> |{" "}
          <span>
            {t("mail.mail_permission_to")}{" "}
            <b>{onSharePermission(mail?.isshare, mail?.shareinfo)}</b>
          </span>
        </div>
      )}

      {/* Button */}
      <div className="d-flex align-items-center">
        {/* Report hacking mail */}
        {mail && mail.hasOwnProperty("canhack") && mail.canhack && (
          <BaseButtonTooltip
            outline
            title={t("mail.mail_hacking_report")}
            id="report-hacking"
            className={`btn-outline-grey btn-action-icon ms-2 px-2 py-0 font-size-15`}
            onClick={handleReportHackingMailModal}
            icon="fas fa-bug"
            iconClassName="me-0"
          />
        )}

        {!isHideMoreButton && (
          <>
            {menu === "Spam" ? (
              <>
                {/* Not Spam */}
                <BaseButtonTooltip
                  outline
                  title={t("mail.mail_button_report_no_spam")}
                  id="reportham"
                  className={`btn-outline-grey btn-action-icon px-2 py-0 font-size-17`}
                  onClick={() =>
                    handleActionModal(
                      t("mail.mail_button_report_no_spam"),
                      handleNotSpam,
                      mail?.acl,
                      mid,
                    )
                  }
                  icon="mdi mdi-cancel"
                  iconClassName="me-0"
                />

                {/* Block Sender(s) */}
                <BaseButtonTooltip
                  outline
                  title={t("mail.mail_list_bans")}
                  id="bans"
                  className={`btn-outline-grey btn-action-icon px-2 py-0 font-size-17`}
                  onClick={handleBlockSender}
                  icon="mdi mdi-minus-circle"
                  iconClassName="me-0"
                />
              </>
            ) : (
              <>
                {/* reply */}
                <BaseButton
                  outline
                  color={"primary"}
                  className="text-btn mx-1"
                  onClick={handleReplyModal}
                  disabled={composeMails?.data?.length > 9}
                  textClassName=""
                >
                  <i className="mdi mdi-reply"></i> {t("mail.mail_view_reply")}
                </BaseButton>
                {/* reply all */}
                <BaseButton
                  outline
                  color={"primary"}
                  className="text-btn me-1"
                  onClick={handleReplyAllModal}
                  disabled={composeMails?.data?.length > 9}
                  textClassName=""
                >
                  <i className="mdi mdi-reply-all"></i> {t("mail.mail_view_allreply")}
                </BaseButton>
                {/* forward */}
                <BaseButton
                  outline
                  color={"primary"}
                  className="text-btn me-1"
                  textClassName=""
                  onClick={handleForwardModal}
                  disabled={composeMails?.data?.length > 9}
                >
                  <i className="mdi mdi-share"></i> {t("common.mail_view_forward")}
                </BaseButton>

                {/* AI */}
                {llmConfig && llmConfig?.showAI && (
                  <AISelectButton
                    isNewWindow={isNewWindow}
                    langList={langList}
                    setAiData={(val) => setAiData({ ...val, data: { mid: mid }, mail })}
                  />
                )}

                {/* Edit */}
                {menu === "Temp" && (
                  <BaseButtonTooltip
                    outline
                    title={t("mail.mail_set_mailbox_modify")}
                    id="edit"
                    className={`btn-outline-grey btn-action-icon px-2 py-0 font-size-17`}
                    onClick={handleEditModal}
                    icon="mdi mdi-pencil"
                    iconClassName="me-0"
                  />
                )}

                {/* Resend */}
                {isReSend && (
                  <BaseButtonTooltip
                    outline
                    title={t("mail.mail_view_resend")}
                    id="resubmit"
                    className={`btn-outline-grey btn-action-icon px-2 py-0 font-size-17`}
                    onClick={() => handleResendModal(isShareMenu && menu)}
                    icon="mdi mdi-arrow-left"
                    iconClassName="me-0"
                  />
                )}

                {/* Immediately Sending */}
                {mail?.isent && (
                  <BaseButtonTooltip
                    outline
                    title={t("mail.mail_immediate_sending")}
                    id="immediateSend"
                    className={`btn-outline-grey btn-action-icon px-2 py-0 font-size-17`}
                    onClick={() => handleImmediateSending()}
                    icon="mdi mdi-send"
                    iconClassName="me-0"
                  />
                )}
              </>
            )}
          </>
        )}

        {!isHideMoreButton && !isNewWindow && (
          <>
            {/* Up */}
            <BaseButton
              // title={t("mail.mail_view_next")}
              outline
              id="next-mail"
              icon={`fa fa-chevron-up`}
              onClick={() => mail?.nextmail && handleNextPrevMail()}
              iconClassName="me-0"
              className={`btn-outline-grey btn-action-icon px-2 py-0 font-size-17 ${
                mail?.nextmail ? "cursor-pointer" : "cursor-not-allowed"
              }`}
              disabled={!mail?.nextmail}
            />

            {/* Down */}
            <BaseButton
              // title={t("mail.mail_view_prev")}
              outline
              id="prev-mail"
              icon={`fa fa-chevron-down`}
              onClick={() => mail?.prevmail && handleNextPrevMail("prev")}
              iconClassName="me-0"
              className={`btn-outline-grey btn-action-icon px-2 py-0 font-size-17 ${
                mail?.prevmail ? "cursor-pointer" : "cursor-not-allowed"
              }`}
              disabled={!mail?.prevmail}
            />
          </>
        )}

        {/* Important */}
        {isMobile && (
          <>
            {important?.value ? (
              <BaseButtonTooltip
                outline
                id="star"
                placement={isSplitMode ? "left" : "top"}
                title={t("mail.mail_select_checkbox_important")}
                icon="mdi mdi-star"
                className={`btn-outline-grey btn-action-icon px-2 font-size-18`}
                iconClassName="me-0 text-warning"
                onClick={() =>
                  handleMarkAsImportant && handleMarkAsImportant(false, mail?.acl, mid)
                }
              />
            ) : (
              <BaseButtonTooltip
                outline
                id="star"
                placement={isSplitMode ? "left" : "top"}
                title={t("mail.mail_select_checkbox_important")}
                icon="mdi mdi-star"
                className={`btn-outline-grey btn-action-icon px-2 font-size-18`}
                iconClassName="me-0"
                onClick={() => handleMarkAsImportant && handleMarkAsImportant(true, mail?.acl, mid)}
              />
            )}
          </>
        )}

        {/* AI */}
        {isHideMoreButton && llmConfig && llmConfig?.showAI && (
          <AISelectButton
            isNewWindow={isNewWindow}
            langList={langList}
            setAiData={(val) => setAiData({ ...val, data: { mid: mid }, mail })}
          />
        )}

        {/* print */}
        {isDesktop && (
          <BaseButtonTooltip
            outline
            className={`btn-outline-grey btn-action-icon px-2 py-0 font-size-17`}
            title={t("common.mail_print_msg")}
            id="print-mail"
            icon="mdi mdi-printer"
            iconClassName={"me-0"}
            onClick={() => handlePrintMail(mail?.acl, mid)}
          />
        )}

        {isShowDelete && (
          <BaseButtonTooltip
            outline
            className={`btn-outline-grey btn-action-icon px-2 py-0 font-size-17`}
            title={t("common.common_delete")}
            id="delete-mail"
            icon="mdi mdi-trash-can"
            iconClassName={"me-0"}
            onClick={() => handleDeleteMail(mail?.acl, mid)}
          />
        )}

        {/* More Function */}
        {!isHideMoreButton && (
          <UncontrolledDropdown className="title-flag-btn">
            <DropdownToggle className="p-0 border-0 bg-transparent font-size-16 text-muted">
              <BaseButtonTooltip
                outline
                title={t("common.common_list_more")}
                id="more"
                className={`btn-outline-grey btn-action-icon px-2 py-0 font-size-16 text-muted`}
                iconClassName="me-0"
                icon="mdi mdi-dots-vertical"
                tag="div"
              />
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-end" onKeyDown={handleKeyDown}>
              {isCancelSending && (
                <DropdownItem className="px-3 text-muted" onClick={() => handleCancelSendLater()}>
                  <i className="mdi mdi-email-remove me-2" />
                  {`${t("common.whisper_cancel_sending")} (${t("common.whisper_send_later")})`}
                </DropdownItem>
              )}

              {/* Mark as Unread */}
              <DropdownItem
                className="px-3 text-muted"
                onClick={() => handleMarkAsUnread(mail?.acl, mid)}
              >
                <i className="mdi mdi-eye me-2" />
                {t("mail.mail_list_tounread")}
              </DropdownItem>

              {/* Eml forward */}
              {isShowReplyForward && (
                <DropdownItem className="px-3 text-muted" onClick={handleEmlForwardModal}>
                  <i className="mdi mdi-share me-2" />
                  {t("mail.mail_eml_forward")}
                </DropdownItem>
              )}

              {/* Move */}
              {isShowMove && (
                <DropdownItem className="px-3 text-muted" onClick={() => handleMove("move")}>
                  <i className="mdi mdi-folder me-2" />
                  {t("common.common_move")}
                </DropdownItem>
              )}

              {/* Save */}
              <DropdownItem
                className="px-3 text-muted"
                onClick={() => handleSaveMail(mail?.acl, mid)}
              >
                <i className="mdi mdi-download me-2" />
                {t("mail.mail_view_save")}
              </DropdownItem>

              {/* Menu Draft */}
              {menu === "Temp" ? (
                <>
                  {/* Show Original */}
                  <DropdownItem
                    className="px-3 text-muted"
                    onClick={() => handleShowHeader("orgview")}
                  >
                    <i className="mdi mdi-file-document me-2" />
                    {t("mail.mail_view_orgview")}
                  </DropdownItem>

                  {/* Add Flag */}
                  <DropdownItem
                    className="px-3 text-muted"
                    onClick={() => handleFlag("add", mail?.acl, mid)}
                  >
                    <i className="mdi mdi-flag me-2" />
                    {t("mail.mail_list_setflag")}
                  </DropdownItem>

                  {/* Remove Flag */}
                  <DropdownItem
                    className="px-3 text-muted"
                    onClick={() => handleFlag("remove", mail?.acl, mid)}
                  >
                    <i className="mdi mdi-flag-off me-2" />
                    {t("mail.mail_list_setunflag")}
                  </DropdownItem>

                  {/* Add to Contact List */}
                  <DropdownItem className="px-3 text-muted" onClick={handleAddToContactList}>
                    <i className="mdi mdi-contacts me-2" />
                    {t("mail.mail_view_addaddress")}
                  </DropdownItem>
                </>
              ) : (
                // Show Header
                <DropdownItem
                  className="px-3 text-muted"
                  onClick={() => handleShowHeader("orgheader")}
                >
                  <i className="mdi mdi-file-document me-2" />
                  {t("mail.mail_show_header")}
                </DropdownItem>
              )}

              {/* Not Menu Spam */}
              {menu !== "Spam" && (
                <>
                  {/* Report Spam */}
                  {!isShareMenu && (
                    <DropdownItem
                      className="px-3 text-muted"
                      onClick={() =>
                        handleActionModal(
                          t("mail.mail_list_reportspam"),
                          handleReportSpam,
                          mail?.acl,
                          mid,
                        )
                      }
                    >
                      <i className="mdi mdi-alert-circle me-2" />
                      {t("mail.mail_list_reportspam")}
                    </DropdownItem>
                  )}

                  {/* Copy to Share Box */}
                  {!isNewWindow && !isShareMenu && (
                    <DropdownItem className="px-3 text-muted" onClick={handleShowShareBox}>
                      <i className="mdi mdi-content-copy me-2" />
                      {t("mail.mail_share_copy_to_sharebox")}
                    </DropdownItem>
                  )}

                  {/* Write Add new event */}
                  {useCalendar && !isNewWindow && (
                    <DropdownItem
                      className="px-3 text-muted"
                      onClick={() => {
                        handleOpenModal(modalType.calendar)
                      }}
                    >
                      <i className="mdi mdi-calendar-plus me-2" />
                      {t("common.common_new_event_calendar")}
                    </DropdownItem>
                  )}

                  {/* Write a work */}
                  {useNewProject && !isNewWindow && (
                    <DropdownItem
                      className="px-3 text-muted"
                      onClick={() => {
                        handleOpenModal(modalType.project)
                      }}
                    >
                      <i className="hanbiro-ico-co-manage me-2" />
                      {t("common.project_task_write_work")}
                    </DropdownItem>
                  )}

                  {/* Write Todo */}
                  {useTodo && !isNewWindow && (
                    <DropdownItem
                      className="px-3 text-muted"
                      onClick={() => {
                        handleOpenModal(modalType.todo)
                      }}
                    >
                      <i className="hanbiro-icon-todo me-2" />
                      {t("common.todo_todo_write_msg")}
                    </DropdownItem>
                  )}

                  {/* Write Help Desk */}
                  {useHelpDesk && !isNewWindow && (
                    <DropdownItem className="px-3 text-muted" onClick={() => onWriteHelpDesk()}>
                      <i className="mdi mdi-help-circle me-2" />
                      {t("common.mail_write_help_desk")}
                    </DropdownItem>
                  )}
                </>
              )}

              {/* Delete */}
              {/* {isShowDelete && (
              <DropdownItem
                className="px-3 text-muted"
                onClick={() => handleDeleteMail(mail?.acl, mid)}
              >
                <i className="mdi mdi-delete me-2" />
                {t("common.common_delete")}
              </DropdownItem>
            )} */}
            </DropdownMenu>
          </UncontrolledDropdown>
        )}
        {modalData.type === modalType.project && modalData.open && (
          <ModalNewProject
            open={modalData.open}
            handleClose={() => setModalData({ ...modalData, open: !modalData.open })}
          />
        )}
        {modalData.type === modalType.calendar && modalData.open && (
          <ModalAddEvent
            open={modalData.open}
            handleClose={() => setModalData({ ...modalData, open: !modalData.open })}
          />
        )}
        {modalData.type === modalType.todo && modalData.open && (
          <ModalWriteTodo
            open={modalData.open}
            handleClose={() => setModalData({ ...modalData, open: !modalData.open })}
          />
        )}
      </div>
    </div>
  )
}

export default MailDetailButton
