// @ts-nocheck
import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import { Label, Col, Row, Input } from "reactstrap"

import { renderLanguage } from "utils"
import { BaseModal, BaseButton } from "components/Common"
import OrgAutoComplete from "components/SettingAdmin/OrgAutoComplete"

const ModalActivation = (props) => {
  const { isAppPassword, isOpen, toggleModal, selectedData, handleUpdateActivation } = props
  const { t } = useTranslation()
  const [emails, setEmails] = useState({ selected: {} })
  const [dataUpdate, setDataUpdate] = useState({
    isSMTP: "y",
    isPop3: "n",
    isImap: "n",
    isBlockUserUnblock: "n",
    isManagerUnblock: "n",
    isSendMail: "n",
    newpasswd: "",
  })

  useEffect(() => {
    setEmails({ selected: selectedData })
  }, [selectedData])

  const handleCheckboxChange = (event, type) => {
    const isChecked = event.target.checked
    setDataUpdate((prev) => ({
      ...prev,
      [type]: isChecked ? "y" : "n",
    }))
  }

  const validateData = () => {
    console.log("2024-06-27 08:52:01---", emails, dataUpdate)

    var userIds = []
    Object.keys(emails.selected).forEach(function (i) {
      userIds.push(emails.selected[i].id)
    })
    var postData = {
      issmtp: dataUpdate.isSMTP == "y",
      ispop3: dataUpdate.isPop3 == "y",
      isimap: dataUpdate.isImap == "y",
      isblockuser_unblock: dataUpdate.isBlockUserUnblock == "y",
      ismanager_unblock: dataUpdate.isManagerUnblock == "y",
      issendmail: dataUpdate.isSendMail == "y",
      userids: userIds.join(","),
    }

    if (postData.isblockuser_unblock) {
      postData.newpasswd = dataUpdate.newpasswd
    }
    handleUpdateActivation(postData)
  }

  const headerModal = () => {
    return <>{t("mail.mail_service_activation")}</>
  }

  const bodyModal = () => {
    return (
      <>
        <Row>
          <Label className="col-form-label col-lg-3">{t("mail.mail_authentication_method")}</Label>
          <Col className="col-form-label" lg="9" style={{ color: "initial" }}>
            {isAppPassword ? t("mail.mail_app_password") : t("mail.mail_same_password_as_webmail")}
          </Col>
        </Row>

        <Row>
          <Label className="col-form-label col-lg-3">{t("mail.mail_applicable_user")}</Label>
          <Col className="col-form-label" lg="9" style={{ color: "initial" }}>
            <OrgAutoComplete
              emails={emails}
              setEmails={setEmails}
              showInput={false}
              canEdit={false}
            />
          </Col>
        </Row>

        <Row>
          <Label className="col-form-label col-lg-3">{t("mail.mail_service_selection")}</Label>
          <Col className="col-form-label d-flex" lg="9" style={{ color: "initial" }}>
            <Col lg="4">
              <Input
                aria-label="Checkbox for following text input"
                type="checkbox"
                className="me-1"
                checked={dataUpdate?.isSMTP === "y"}
                onClick={(e) => handleCheckboxChange(e, "isSMTP")}
                onChange={() => {}}
              />
              SMTP
            </Col>
            <Col lg="4">
              <Input
                aria-label="Checkbox for following text input"
                type="checkbox"
                className="me-1"
                checked={dataUpdate?.isPop3 === "y"}
                onClick={(e) => handleCheckboxChange(e, "isPop3")}
                onChange={() => {}}
              />
              POP3
            </Col>
            <Col lg="4">
              <Input
                aria-label="Checkbox for following text input"
                type="checkbox"
                className="me-1"
                checked={dataUpdate?.isImap === "y"}
                onClick={(e) => handleCheckboxChange(e, "isImap")}
                onChange={() => {}}
              />
              IMAP
            </Col>
          </Col>
        </Row>

        <Row>
          <Label className="col-form-label col-lg-3"></Label>
          <Col className="col-form-label pt-0" lg="9" style={{ color: "initial" }}>
            <div className={"text-secondary"}>{t("mail.mail_service_activation_msg1")}</div>
            {isAppPassword && (
              <div className={"text-secondary"}>{t("mail.mail_service_activation_msg2")}</div>
            )}
          </Col>
        </Row>

        <Row>
          <Label className="col-form-label col-lg-3">{t("mail.mail_block_account")}</Label>
          <Col className="col-form-label d-flex" lg="9" style={{ color: "initial" }}>
            <Col lg="4">
              <Label check>
                <Input
                  type="radio"
                  checked={dataUpdate?.isBlockUserUnblock === "n"}
                  onClick={() => {
                    setDataUpdate((prev) => ({ ...prev, isBlockUserUnblock: "n" }))
                  }}
                  onChange={() => {}}
                />{" "}
                {t("mail.mail_not_included")}
              </Label>
            </Col>
            <Col lg="4">
              <Label check>
                <Input
                  type="radio"
                  checked={dataUpdate?.isBlockUserUnblock === "y"}
                  onClick={() => {
                    setDataUpdate((prev) => ({ ...prev, isBlockUserUnblock: "y" }))
                  }}
                  onChange={() => {}}
                />{" "}
                {t("mail.mail_admin_include")}
              </Label>
            </Col>
          </Col>
        </Row>

        <Row>
          <Label className="col-form-label col-lg-3"></Label>
          <Col className="col-form-label pt-0" lg="9" style={{ color: "initial" }}>
            {isAppPassword && (
              <div
                className={"text-secondary"}
                dangerouslySetInnerHTML={{
                  __html: renderLanguage("mail.mail_service_activation_msg4", { red: "color-red" }),
                }}
              />
            )}

            {!isAppPassword && (
              <div className={"text-secondary"}>
                {t("mail.mail_service_activation_msg3")}
                <div
                  className={"text-secondary"}
                  dangerouslySetInnerHTML={{
                    __html: renderLanguage(
                      dataUpdate.isBlockUserUnblock == "n"
                        ? "mail.mail_password_will_be_reset"
                        : "mail.mail_password_is_initialized_msg",
                      {
                        red: "color-red",
                      },
                    ),
                  }}
                />
              </div>
            )}
          </Col>
        </Row>

        {!isAppPassword && dataUpdate.isBlockUserUnblock == "y" && (
          <Row>
            <Label className="col-form-label col-lg-3">{t("mail.mail_reset_password")}</Label>
            <Col className="col-form-label" lg="9" style={{ color: "initial" }}>
              <Input
                type="password"
                value={dataUpdate?.newpasswd}
                onChange={(e) => {
                  setDataUpdate((prev) => ({ ...prev, newpasswd: e.target.value }))
                }}
              />
              <div className={"text-secondary"}>{t("mail.mail_service_activation_msg5")}</div>
            </Col>
          </Row>
        )}

        <Row>
          <Label className="col-form-label col-lg-3">
            {t("mail.mail_administrator_blocking_setting")}
          </Label>
          <Col className="col-form-label d-flex" lg="9" style={{ color: "initial" }}>
            <Col lg="4">
              <Label check>
                <Input
                  type="radio"
                  checked={dataUpdate?.isManagerUnblock === "n"}
                  onClick={() => {
                    setDataUpdate((prev) => ({ ...prev, isManagerUnblock: "n" }))
                  }}
                  onChange={() => {}}
                />{" "}
                {t("mail.mail_not_included")}
              </Label>
            </Col>
            <Col lg="4">
              <Label check>
                <Input
                  type="radio"
                  checked={dataUpdate?.isManagerUnblock === "y"}
                  onClick={() => {
                    setDataUpdate((prev) => ({ ...prev, isManagerUnblock: "y" }))
                  }}
                  onChange={() => {}}
                />{" "}
                {t("mail.mail_admin_include")}
              </Label>
            </Col>
          </Col>
        </Row>

        {isAppPassword && (
          <Row>
            <Label className="col-form-label col-lg-3"></Label>
            <Col className="col-form-label pt-0 text-secondary" lg="9" style={{ color: "initial" }}>
              {t("mail.mail_service_activation_msg6")}
            </Col>
          </Row>
        )}

        <Row>
          <Label className="col-form-label col-lg-3">{t("mail.mail_send_information_email")}</Label>
          <Col className="col-form-label d-flex" lg="9" style={{ color: "initial" }}>
            <Col lg="4">
              <Label check>
                <Input
                  type="radio"
                  checked={dataUpdate?.isSendMail === "n"}
                  onClick={() => {
                    setDataUpdate((prev) => ({ ...prev, isSendMail: "n" }))
                  }}
                  onChange={() => {}}
                />{" "}
                {t("mail.mail_not_sent")}
              </Label>
            </Col>
            <Col lg="4">
              <Label check>
                <Input
                  type="radio"
                  checked={dataUpdate?.isSendMail === "y"}
                  onClick={() => {
                    setDataUpdate((prev) => ({ ...prev, isSendMail: "y" }))
                  }}
                  onChange={() => {}}
                />{" "}
                {t("common.common_send_msg")}
              </Label>
            </Col>
          </Col>
        </Row>
      </>
    )
  }

  const footerModal = () => {
    return (
      <span className="d-flex w-100 justify-content-center">
        <BaseButton
          color={"primary"}
          className="mx-1"
          onClick={() => {
            validateData()
          }}
          disabled={Object.keys(emails.selected).length == 0}
        >
          {t("common.common_btn_save")}
        </BaseButton>
        <BaseButton color={"secondary"} className="mx-1" onClick={toggleModal}>
          {t("common.common_cancel")}
        </BaseButton>
      </span>
    )
  }

  return (
    <BaseModal
      isOpen={isOpen}
      toggle={toggleModal}
      renderHeader={headerModal}
      renderBody={bodyModal}
      renderFooter={footerModal}
    />
  )
}
export default ModalActivation
