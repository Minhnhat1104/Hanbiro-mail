// @ts-nocheck
// React
import React, { useEffect, useState, useMemo } from "react"
import { useTranslation } from "react-i18next"

// Third-party
import { Input, Label, Col } from "reactstrap"

// Project
import BaseButton from "components/Common/BaseButton"
import { BaseModal, BaseIcon } from "components/Common"

const ModalSetSetting = (props) => {
  const { isOpen, toggleModal, itemUpdate, handleSetSetting, loading = false } = props
  const { t } = useTranslation()

  const [users, setUsers] = useState({})
  const [isSave, setIsSave] = useState(true)
  const [isClear, setIsClear] = useState(false)

  useEffect(() => {
    setUsers(itemUpdate)
  }, [itemUpdate])

  const onDeleteUser = (user) => {
    let newUsers = { ...users }
    delete newUsers[user.id]
    setUsers(newUsers)
  }

  const cancelMsg = useMemo(() => {
    let msg = t("mail.mail_used_to_cancel_forwarding_settings_all_at_once")
    return msg.replace("red", "color-red")
  }, [])

  const renderUser = function (user) {
    var text = user?.id
    if (user?.name != "" || user?.posname != "") {
      text += " ("
      if (user?.name != "") text += user?.name
      if (user?.name != "" && user?.posname != "") text += "/"
      if (user?.posname != "") text += user?.posname
      text += ")"
    }
    return text
  }

  const bodyModal = () => {
    return (
      <>
        <Col className="mb-0">
          <Label lg="12" className="col-form-label">
            {t("mail.mail_settings_user")}
          </Label>
          <Col lg="12" className="d-flex flex-wrap gap-1">
            {Object?.keys(users)?.length > 0 &&
              Object?.keys(users)?.map((idx) => {
                let user = users[idx]
                return (
                  <span
                    key={idx}
                    className={`rounded h-auto py-2 px-2 gap-2 han-bg-color-primary-lighter han-color-primary-dark`}
                    style={{ minHeight: "28px", width: "fit-content" }}
                  >
                    {renderUser(user)}
                    <BaseIcon
                      className={"color-red"}
                      icon={"mdi mdi-window-close"}
                      onClick={() => {
                        onDeleteUser(user)
                      }}
                    />
                  </span>
                )
              })}

            {Object?.keys(users)?.length === 0 && <div>{t("common.nodata_msg")}</div>}
          </Col>
        </Col>
        <Col className="mb-0">
          <Label lg="6" className="col-form-label">
            {t("mail.mail_bulk_release")}
          </Label>
          <Label lg="6">
            <Input
              type="checkbox"
              checked={isClear}
              onChange={() => {}}
              onClick={() => setIsClear(!isClear)}
            />{" "}
            {t("mail.mail_clear")}
          </Label>
        </Col>
        <div
          className="alert alert-warning fade show mb-0"
          dangerouslySetInnerHTML={{
            __html: cancelMsg,
          }}
        />
        <Col className="mb-1">
          <Label lg="12" className="col-form-label">
            {t("mail.mail_save_and_forward_mail")}
          </Label>
          <Col lg="12">
            <Label lg="6">
              <Input
                type="radio"
                checked={isSave}
                onChange={() => {}}
                onClick={() => setIsSave(true)}
              />{" "}
              {t("mail.mail_set_forward_action3")}
            </Label>

            <Label lg="6">
              <Input
                type="radio"
                checked={!isSave}
                onChange={() => {}}
                onClick={() => setIsSave(false)}
              />{" "}
              {t("mail.mail_without_storage")}
            </Label>
            <div
              className="alert alert-warning fade show"
              dangerouslySetInnerHTML={{
                __html: t("mail.mail_choose_whether_to_save_incoming_mail_when_forwarding_it"),
              }}
            />
          </Col>
        </Col>
      </>
    )
  }

  const headerModal = () => {
    return <>{t("mail.mail_forwarding_batch_settings")}</>
  }

  const footerModal = () => {
    return (
      <>
        <div className="action-form">
          <BaseButton
            color={"primary"}
            type="button"
            onClick={() => {
              let userIds = Object?.keys(users)?.map((key) => {
                return key
              })
              let dataUpdate = {
                isunforward: isClear,
                issave: isSave,
                userids: userIds.join(","),
              }
              handleSetSetting && handleSetSetting(dataUpdate)
            }}
            disabled={Object?.keys(users)?.length === 0}
            loading={loading}
          >
            {t("mail.mail_view_save")}
          </BaseButton>
          <BaseButton color={"secondary"} onClick={toggleModal} type="button">
            {t("mail.mail_write_discard")}
          </BaseButton>
        </div>
      </>
    )
  }

  return (
    <BaseModal
      size={"md"}
      isOpen={isOpen}
      toggle={toggleModal}
      renderHeader={headerModal}
      renderBody={bodyModal}
      renderFooter={footerModal}
    />
  )
}

export default ModalSetSetting
