// @ts-nocheck
// React
import React, { useContext, useEffect, useState } from "react"

// Third-party
import { useTranslation } from "react-i18next"
import {
  Input,
  Button,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
} from "reactstrap"

// Project
import { MailContext } from "pages/Detail"
import SentMailList from "./SentMailList"
import { BaseButton } from "components/Common"
import { URL_CANCEL_SEND } from "modules/mail/common/urls"
import { useCustomToast } from "hooks/useCustomToast"
import { Headers, emailPost } from "helpers/email_api_helper"
import useDevice from "hooks/useDevice"

const SentMail = ({ isHideButtonText, handleActionModal = () => {} }) => {
  const { t } = useTranslation()
  const { mail } = useContext(MailContext)
  const { successToast, errorToast } = useCustomToast()
  const { isMobile } = useDevice()

  const [openList, setOpenList] = useState(true)
  const [mailListState, setMailListState] = useState({
    readed: 0,
    tot: 0,
    canceled: 0,
    fail: 0,
    unread: 0,
    data: [],
  })

  const [checkedIds, setCheckedIds] = useState([]) // checked item list - not list all
  const [isCheckedAll, setIsCheckedAll] = useState(false) // state for check all

  useEffect(() => {
    if (mail?.receive_data?.data?.length > 0) {
      setMailListState(mail?.receive_data)
    }
  }, [mail])

  // Handle check all
  const handleCheckAllChange = () => {
    setIsCheckedAll(!isCheckedAll) // Set state for check all
    setCheckedIds(
      isCheckedAll
        ? []
        : mailListState.data?.filter((item) => item.getbakid)?.map((item) => item.getbakid),
    ) // Set state list for checked list
  }

  // Handle check one
  const handleCheckOneChange = (item) => {
    const newChecked = checkedIds.includes(item)
      ? checkedIds.filter((v) => v !== item) // Remove item if existed
      : [...checkedIds, item] // Add item if not existed
    const isCheckedAll =
      newChecked.length ===
      mailListState.data?.filter((item) => item.getbakid)?.map((item) => item.getbakid).length // Check if all item checked
    setIsCheckedAll(isCheckedAll) // Set state for check all
    setCheckedIds(newChecked) // Set state list for checked item list
  }

  // Config render checkbox for header table
  const renderCheckBox = (value) => {
    return (
      <Input
        type="checkbox"
        checked={value === "checkedAll" ? isCheckedAll : value ? checkedIds.includes(value) : false}
        onClick={() => {
          if (value === "checkedAll") handleCheckAllChange()
          else handleCheckOneChange(value)
        }}
        onChange={() => {}}
        id={value}
        disabled={value === "checkedAll" ? false : !value}
        className={value ? "cursor-pointer" : "cursor-default"}
      />
    )
  }

  // Handle cancel sending with list
  const handleCancelSending = async () => {
    const listIds = [...checkedIds]

    if (listIds?.length > 0) {
      try {
        const res = await emailPost(
          URL_CANCEL_SEND,
          {
            delids: listIds?.join(","),
            block: true,
          },
          Headers,
        )
        successToast()
        const newList = mailListState?.data?.map((mail) => {
          const foundId = listIds?.find((id) => mail.getbakid === id)
          if (foundId) {
            return { ...mail, state: "d", getbakid: "" }
          }
          return mail
        })
        setMailListState({
          ...mailListState,
          data: newList,
          canceled: mailListState.canceled + 1,
          unread: mailListState.unread - 1,
        })

        const allIds = mailListState.data
          ?.filter((item) => item.getbakid)
          ?.map((item) => item.getbakid)
        if (listIds?.length === allIds?.length) {
          handleCheckAllChange()
        }
      } catch (err) {
        errorToast()
      }
    }
  }

  return (
    <>
      <div className="mt-2 d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center gap-3">
          {renderCheckBox("checkedAll")}
          <div
            className="d-flex align-items-center gap-1 cursor-pointer"
            onClick={() => setOpenList(!openList)}
          >
            <h6 className="mb-0 han-body2 han-fw-medium han-text-secondary">
              {t("mail.mail_receipts_canceled_label")} ({mailListState?.tot})
            </h6>
            <Button
              className="p-0 border-0 bg-transparent font-size-17 text-muted"
              onClick={() => {}}
            >
              <i className={`han-text-secondary mdi mdi-chevron-${openList ? "up" : "down"}`}></i>
            </Button>
          </div>
        </div>
        <div className="d-flex align-items-center gap-2">
          <BaseButton
            outline
            icon="mdi mdi-cancel"
            className="py-1 px-2 font-size-14"
            color="primary"
            onClick={handleCancelSending}
            disabled={checkedIds.length === 0}
          >
            {!isMobile && !isHideButtonText && t("mail.mail_recall_email")}
          </BaseButton>
          <UncontrolledDropdown className="title-flag-btn">
            <DropdownToggle color="primary" outline className="py-1 px-2 font-size-14">
              <i className="mdi mdi-filter"></i>{" "}
              {!isMobile && !isHideButtonText && t("mail.asset_status")}
            </DropdownToggle>
            <DropdownMenu className="dropdown-menu-end">
              <DropdownItem className="px-3 text-muted" onClick={() => {}}>
                {t("mail.mail_select_checkbox_read")} ({mailListState?.readed})
              </DropdownItem>
              <DropdownItem className="px-3 text-muted" onClick={() => {}}>
                {t("mail.mail_secure_recall")} ({mailListState?.canceled})
              </DropdownItem>
              <DropdownItem className="px-3 text-muted" onClick={() => {}}>
                {t("common.mail_unread_label")} ({mailListState?.unread})
              </DropdownItem>
              <DropdownItem className="px-3 text-muted" onClick={() => {}}>
                {t("common.mail_sent_fail")} ({mailListState?.fail})
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </div>
      </div>

      {openList && (
        <SentMailList
          mailListState={mailListState}
          setMailListState={setMailListState}
          onActionModal={handleActionModal}
          renderCheckBox={renderCheckBox}
        />
      )}
    </>
  )
}

export default SentMail
