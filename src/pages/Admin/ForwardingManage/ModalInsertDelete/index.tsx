// @ts-nocheck
// React
import React, { useEffect, useState, useMemo } from "react"
import { useTranslation } from "react-i18next"

// Third-party
import { Input, Label, FormGroup, Col } from "reactstrap"

// Project
import BaseButton from "components/Common/BaseButton"
import { BaseModal } from "components/Common"

const ModalInsertDelete = (props) => {
  const { isOpen, toggleModal, itemUpdate, handleInsertDelete, loading = false } = props
  const { t } = useTranslation()

  const [email, setEmail] = useState("")
  const [isSave, setIsSave] = useState("y")
  const [isInsert, setIsInsert] = useState(true)

  useEffect(() => {
    if (itemUpdate?.email) {
      setIsInsert(false)
      setEmail(itemUpdate?.email)
    } else {
      setIsInsert(true)
    }
  }, [itemUpdate])

  const insertMsg = useMemo(() => {
    let msg = t(
      "mail.mail_please_enter_your_available_emails_one_by_one_forwarding_will_start_automatically_when_set",
    )
    return msg.replace("red", "color-red")
  }, [])

  const bodyModal = () => {
    return (
      <>
        <Col className="mb-0">
          <Label lg="4" className="col-form-label">
            {t("mail.mail_settings_user")}
          </Label>
          <Label lg="8" className="fw-bold">
            {itemUpdate?.id} ({itemUpdate?.name})
          </Label>
        </Col>
        <Col className="mb-1">
          <Label lg="12" className="col-form-label">
            {isInsert
              ? t("mail.mail_please_enter_a_new_forwarding_email_address")
              : t("mail.mail_would_you_like_to_delete_the_email_from_forwarding")}
          </Label>
          <Col lg="12">
            <Input
              type="text"
              value={email}
              className="form-control"
              placeholder={t("mail.mail_email_address")}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!isInsert}
            />
            {isInsert && (
              <div
                className="alert alert-warning fade show mt-2 mb-0"
                dangerouslySetInnerHTML={{
                  __html: insertMsg,
                }}
              />
            )}
          </Col>
        </Col>
        {isInsert && (
          <Col className="mb-1">
            <Label lg="12" className="col-form-label pb-0">
              {t("mail.mail_save_and_forward_mail")}
            </Label>
            <Col lg="12">
              <Label lg="6">
                <Input
                  type="radio"
                  checked={isSave === "y"}
                  onChange={() => {}}
                  onClick={() => setIsSave("y")}
                />{" "}
                {t("mail.mail_set_forward_action3")}
              </Label>

              <Label lg="6">
                <Input
                  type="radio"
                  checked={isSave === "n"}
                  onChange={() => {}}
                  onClick={() => setIsSave("n")}
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
        )}
      </>
    )
  }

  const headerModal = () => {
    return (
      <>
        {isInsert
          ? t("mail.mail_forwarding_address_settings")
          : t("mail.mail_delete_forwarding_address")}
      </>
    )
  }

  const footerModal = () => {
    return (
      <>
        <div className="action-form">
          <BaseButton
            color={"primary"}
            type="button"
            onClick={() => {
              let dataUpdate = {
                id: itemUpdate?.id,
                email: email,
                isInsert: isInsert,
              }

              if (isInsert) {
                dataUpdate.isSave = isSave
              }

              if (itemUpdate?.isDetail) {
                dataUpdate.isDetail = true
              }

              handleInsertDelete && handleInsertDelete(dataUpdate)
            }}
            disabled={email === ""}
            loading={loading}
          >
            {t("mail.mail_view_save")}
          </BaseButton>
          <BaseButton
            outline
            color={"grey"}
            data-bs-target="#secondmodal"
            onClick={toggleModal}
            type="button"
          >
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

export default ModalInsertDelete
