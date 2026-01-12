// @ts-nocheck
// React
import React, { useState } from "react"

// Third-party
import { useTranslation } from "react-i18next"
import { Card, Input, Label, Col } from "reactstrap"

// Project
import BaseIconTooltip from "components/Common/BaseIconTooltip"
import { useCustomToast } from "hooks/useCustomToast"
import { URL_SIGNATURE, URL_SIGNATURE_INFO } from "modules/mail/settings/urls"
import { Headers, emailDelete, emailPut } from "helpers/email_api_helper"

const SignatureItem = ({
  item = {},
  index = 0,
  handleCheckSignature = () => {},
  handlePreviewModal = () => {},
  getSignatureList = () => {},
  handleEdit = (item) => {},
  handleActionModal = () => {},
}) => {
  const { t } = useTranslation()
  const { successToast, errorToast } = useCustomToast()
  const [hover, setHover] = useState({
    id: "",
    value: false,
  })

  // Handle delete a signature -> One
  const handleDeleteSignature = async (signature) => {
    try {
      let url = ""
      if (signature.type === "sigpic") url = [URL_SIGNATURE, "pic", signature?.uid].join("/")
      else url = [URL_SIGNATURE, "html", signature?.uid].join("/")
      const res = await emailDelete(url, {}, Headers)
      if (res.result) {
        successToast()
        getSignatureList()
      }
    } catch (err) {
      errorToast()
    }
  }

  // Handle Set/Remove as Default Signature -> One
  const handleSetDefaultSignature = async (signatureId) => {
    try {
      const res = await emailPut(
        URL_SIGNATURE_INFO,
        {
          dsig: signatureId,
        },
        Headers,
      )
      if (res.result) {
        successToast()
        getSignatureList()
      }
    } catch (err) {
      errorToast()
    }
  }

  // Handle Remove as Default Signature
  const handleRemoveDefaultSignature = async (signatureId) => {
    try {
      const res = await emailDelete(
        URL_SIGNATURE_INFO,
        {
          mode: "one",
          dsig: signatureId,
        },
        Headers,
      )
      if (res.result) {
        successToast()
        getSignatureList()
      }
    } catch (err) {
      errorToast()
    }
  }

  return (
    <Col
      xs={12}
      md={6}
      lg={4}
      xl={3}
      className={`d-flex justify-content-center p-0 pb-2${index % 4 === 0 ? "" : " pe-2"}`}
    >
      <Card
        className={`w-100 border rounded p-2 m-0 card-item position-relative ${
          item?.default && "card-item-used"
        }`}
        style={{ minHeight: 160 }}
        onMouseEnter={() => setHover({ id: item?.uid, value: true })}
        onMouseLeave={() => setHover({ id: item?.uid, value: false })}
      >
        <div className="w-100 card-check-title d-flex align-item-center gap-2 position-absolute z-3">
          <Input
            type="checkbox"
            id={item?.uid}
            className="cursor-pointer card-input"
            onChange={() => {}}
            onClick={(e) => handleCheckSignature(e, item)}
          />
          <Label
            htmlFor={item?.uid}
            className={`cursor-pointer ${item?.default ? "text-white" : "text-body"}`}
          >
            {item?.name}
          </Label>
        </div>
        <div
          className="overflow-hidden mt-4"
          dangerouslySetInnerHTML={{ __html: item?.contents }}
        />
        {hover?.id === item?.uid && hover?.value && (
          <div className="card-icon">
            <div className="d-flex gap-5 w-10 position-absolute top-50 start-50 translate-middle">
              <BaseIconTooltip
                title={t("common.board_office_preview_msg")}
                id={`preview-signature-${item?.uid}`}
                icon="mdi mdi-magnify"
                className="fs-2 card-icon-item card-icon-preview"
                onClick={() => handlePreviewModal(item)}
              />
              <BaseIconTooltip
                title={t("common.todo_edit_msg")}
                id={`edit-signature-${item?.uid}`}
                icon="mdi mdi-pencil-circle"
                className="fs-3 card-icon-item card-icon-edit"
                onClick={() => handleEdit(item)}
              />
              <BaseIconTooltip
                title={t("mail.mail_set_pop3_del")}
                id={`delete-signature-${item?.uid}`}
                icon="mdi mdi-delete"
                className="fs-3 card-icon-item card-icon-delete"
                onClick={() =>
                  handleActionModal(
                    t("common.alert_info_msg"),
                    t("mail.mail_menu_trashdel"),
                    handleDeleteSignature,
                    item,
                  )
                }
              />
              {item?.default ? (
                <BaseIconTooltip
                  title={t("mail.mail_signature_btn_remove_default")}
                  id={`default-signature-${item?.uid}`}
                  icon="mdi mdi-close-circle"
                  className="fs-3 card-icon-item card-icon-default"
                  onClick={() => handleRemoveDefaultSignature(item?.uid)}
                />
              ) : (
                <BaseIconTooltip
                  title={t("mail.mail_dkim_set_as_default")}
                  id={`default-signature-${item?.uid}`}
                  icon="mdi mdi-check-circle"
                  className="fs-3 card-icon-item card-icon-default"
                  onClick={() => handleSetDefaultSignature(item?.uid)}
                />
              )}
            </div>
          </div>
        )}
      </Card>
    </Col>
  )
}

export default SignatureItem
