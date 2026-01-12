// @ts-nocheck
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"

import { BaseButton, BaseModal } from "components/Common/index"
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap"
import { selectUserData } from "store/auth/config/selectors"

import useDevice from "hooks/useDevice"
import { isEmpty } from "lodash"
import { getUserAvatarUrl } from "utils"
import ComposePreviewAttachment from "./ComposePreviewAttachment"

const ComposePreviewModal = ({
  show,
  // setShow,
  handleClose,
  mailPreview,
  onSend,
  loading,
  files,
}) => {
  const { t } = useTranslation()
  const userData = useSelector(selectUserData)
  const { isTablet } = useDevice()

  const [showOthersTo, setShowOthersTo] = useState(false)
  const [showOthersCc, setShowOthersCc] = useState(false)
  const [showOthersBcc, setShowOthersBcc] = useState(false)

  const toValue = useMemo(() => {
    if (mailPreview && mailPreview.to) {
      return mailPreview.to.split(",")
    }

    return []
  }, [mailPreview])

  const ccValue = useMemo(() => {
    if (mailPreview && mailPreview.cc) {
      return mailPreview.cc.split(",")
    }

    return []
  }, [mailPreview])

  const bccValue = useMemo(() => {
    if (mailPreview && mailPreview.bcc) {
      return mailPreview.bcc.split(",")
    }

    return []
  }, [mailPreview])

  const renderHeader = () => {
    return <>{t("mail.mail_menu_write")}</>
  }

  const renderOneReceiver = (title, value) => {
    return (
      <DropdownToggle tag="div">
        <span
          dangerouslySetInnerHTML={{
            __html: `${title}: ${value && value[0] ? value[0] : ""}`,
          }}
        />
      </DropdownToggle>
    )
  }

  const renderMultipleReceivers = (title, value) => {
    return (
      <>
        <DropdownToggle tag="div" className="cursor-pointer d-flex align-items-center gap-2">
          <span
            dangerouslySetInnerHTML={{
              __html: `${title}: ${value[0]} and ${value.length - 1} others`,
            }}
          />
          <i className="fas fa-chevron-down"></i>
        </DropdownToggle>

        <DropdownMenu className="">
          {value &&
            value
              .slice(1)
              .map((_v) => <DropdownItem key={_v} dangerouslySetInnerHTML={{ __html: _v }} />)}
        </DropdownMenu>
      </>
    )
  }

  const renderBody = () => {
    return (
      <>
        <div className="han-h3 mb-3">{mailPreview?.subject}</div>

        <div className="d-flex gap-2">
          <img
            className="rounded-circle header-profile-user"
            src={getUserAvatarUrl(userData?.cn, userData?.no)}
            alt="user profile avatar"
          />

          <div className="d-flex flex-column gap-2">
            {/* from */}
            <div className="" dangerouslySetInnerHTML={{ __html: mailPreview?.from }} />

            {/* to */}
            <Dropdown
              isOpen={showOthersTo}
              toggle={() => {
                if (toValue && toValue.length > 0 && !showOthersTo) {
                  setShowOthersTo(true)

                  return
                }

                setShowOthersTo(false)
              }}
              className="d-inline-block"
            >
              {toValue.length <= 1 && renderOneReceiver(t("common.mail_write_to"), toValue)}
              {toValue.length > 1 && renderMultipleReceivers(t("common.mail_write_to"), toValue)}
            </Dropdown>

            {/* cc */}
            <Dropdown
              isOpen={showOthersCc}
              toggle={() => {
                if (ccValue && ccValue.length > 0 && !showOthersCc) {
                  setShowOthersCc(true)

                  return
                }

                setShowOthersCc(false)
              }}
              className="d-inline-block"
            >
              {ccValue.length <= 1 && renderOneReceiver(t("common.main_mail_cc"), ccValue)}
              {ccValue.length > 1 && renderMultipleReceivers(t("common.main_mail_cc"), ccValue)}
            </Dropdown>

            {/* bcc */}
            <Dropdown
              isOpen={showOthersBcc}
              toggle={() => {
                if (bccValue && bccValue.length > 0 && !showOthersBcc) {
                  setShowOthersBcc(true)

                  return
                }

                setShowOthersBcc(false)
              }}
              className="d-inline-block"
            >
              {bccValue.length <= 1 && renderOneReceiver(t("common.main_mail_bcc"), bccValue)}
              {bccValue.length > 1 && renderMultipleReceivers(t("common.main_mail_bcc"), bccValue)}
            </Dropdown>
          </div>
        </div>

        {/* attachments */}
        {files && (!isEmpty(files?.attachments) || !isEmpty(files?.filesCloudDisk)) && (
          <ComposePreviewAttachment
            attachments={files?.attachments}
            filesCloudDisk={files?.filesCloudDisk}
          />
        )}

        <div
          className="mail-preview-content mt-3 w-100 overflow-x-auto"
          dangerouslySetInnerHTML={{ __html: mailPreview?.contents }}
        ></div>
      </>
    )
  }

  const renderFooter = () => {
    return (
      <div className="w-100 d-flex justify-content-center gap-2">
        <BaseButton outline color="grey" loading={loading} onClick={handleClose}>
          {t("common.common_cancel")}
        </BaseButton>
        <BaseButton
          loading={loading}
          color="primary"
          onClick={() => {
            onSend()
          }}
        >
          {t("common.mail_write_send")}
        </BaseButton>
      </div>
    )
  }

  return (
    <>
      <BaseModal
        open={show}
        size={"xl"}
        centered
        // bodyClass="scroll-box"
        modalClass={isTablet ? "modal-w-80" : ""}
        toggle={handleClose}
        renderHeader={renderHeader}
        renderBody={renderBody}
        renderFooter={renderFooter}
      />
    </>
  )
}

export default ComposePreviewModal
