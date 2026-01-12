// @ts-nocheck
import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import { Label, Col, Row, Input } from "reactstrap"

import { renderLanguage } from "utils"
import { BaseModal, BaseButton } from "components/Common"
import OrgAutoComplete from "components/SettingAdmin/OrgAutoComplete"

const ModalInactive = (props) => {
  const { isOpen, toggleModal, selectedData, handleUpdateInactive } = props
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
    handleUpdateInactive(postData)
  }

  const headerModal = () => {
    return <>{t("mail.mail_disable_service")}</>
  }

  const bodyModal = () => {
    return (
      <>
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
          <Label className="col-form-label col-lg-3">{t("mail.mail_administrator_blocking")}</Label>
          <Col className="col-form-label d-flex" lg="9" style={{ color: "initial" }}>
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
                {t("common.common_say_yes_msg")}
              </Label>
            </Col>
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
                {t("common.common_say_no_msg")}
              </Label>
            </Col>
          </Col>
        </Row>

        <Row>
          <Label className="col-form-label col-lg-3"></Label>
          <Col className="col-form-label pt-0" lg="9" style={{ color: "initial" }}>
            <div
              className={"text-secondary"}
              dangerouslySetInnerHTML={{
                __html: renderLanguage("mail.mail_disable_service_msg1", { red: "color-red" }),
              }}
            />
          </Col>
        </Row>

        {dataUpdate.isManagerUnblock == "n" && (
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

            <Label className="col-form-label col-lg-3"></Label>
            <Col className="col-form-label pt-0" lg="9" style={{ color: "initial" }}>
              <div
                className={"text-secondary"}
                dangerouslySetInnerHTML={{
                  __html: renderLanguage("mail.mail_disable_service_msg2", { red: "color-red" }),
                }}
              />
            </Col>
          </Row>
        )}

        <Row>
          <Label className="col-form-label col-lg-3">
            {t("mail.mail_including_blocked_accounts")}
          </Label>
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
                {t("mail.mail_not_included")}
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
                {t("mail.mail_admin_include")}
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
export default ModalInactive
