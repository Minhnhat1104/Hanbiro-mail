// @ts-nocheck
// React
import React from "react"

// Third-party
import { useTranslation } from "react-i18next"

// Project
import { BaseButton } from "components/Common"
import BaseButtonTooltip from "components/Common/BaseButtonTooltip"
import { useCustomToast } from "hooks/useCustomToast"
import {
  URL_SIGNATURE,
  URL_SIGNATURE_INFO,
  URL_SIGNATURE_USE_LINE,
} from "modules/mail/settings/urls"
import { Headers, emailDelete, emailPost, emailPut } from "helpers/email_api_helper"
import useDevice from "hooks/useDevice"
import HanTooltip from "components/Common/HanTooltip"

const SignatureToolbar = (props) => {
  const {
    loading = false,
    fData = {},
    checkData = {},
    useLine = false,
    handleAdd = () => {},
    handlePosition = () => {},
    getSignatureList = () => {},
    getSignatureUseLine = () => {},
  } = props
  const { t } = useTranslation()
  const { isMobile, isVerticalTablet } = useDevice()
  const { successToast, errorToast } = useCustomToast()

  // Handle Set as Default Signature -> Set with checked signature list
  const handleSetDefaultSignature = async (lists) => {
    let templateId = ""
    if (lists.length > 0) {
      templateId = lists?.join("|")
    } else return

    try {
      const res = await emailPut(
        URL_SIGNATURE_INFO,
        {
          dsig: templateId,
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

  // Handle Disable/Enable Use Line
  const handleChangeUseLine = async (type) => {
    try {
      const res = await emailPost([URL_SIGNATURE_USE_LINE, type].join("/"), {}, Headers)
      if (res) {
        successToast()
        getSignatureUseLine()
      }
    } catch (err) {
      errorToast()
    }
  }

  // Handle Remove Default Signature -> Remove with checked signature list
  const handleRemoveDefaultSignature = async (lists) => {
    let templateId = ""
    if (lists.length > 0) {
      templateId = lists.join("|")
    } else return

    try {
      const res = await emailDelete(
        URL_SIGNATURE_INFO,
        {
          mode: "one",
          dsig: templateId,
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

  // Handle Delete Signature -> Delete with checked signature list
  const handleDeleteSignature = async (lists) => {
    if (lists.length > 0) {
      try {
        const res = await emailDelete([URL_SIGNATURE, lists.join(",")].join("/"), {}, Headers)
        if (res) {
          successToast()
          getSignatureList()
        }
      } catch (err) {
        errorToast()
      }
    }
  }

  return (
    <div className={`d-flex flex-column mb-3 gap-2 ${isMobile ? "mt-2" : ""}`}>
      {!isMobile && (
        <div className="d-flex justify-content-end gap-2">
          {isVerticalTablet && (
            <>
              <BaseButton
                icon="mdi mdi-plus"
                iconClassName={isMobile ? "me-0" : ""}
                color="primary"
                onClick={handleAdd}
              >
                {isMobile ? "" : t("mail.mail_dkim_add")}
              </BaseButton>

              <div className="d-flex justify-content-end">
                <BaseButtonTooltip
                  id="refresh-signature"
                  title={t("common.org_refresh")}
                  icon="mdi mdi-refresh"
                  iconClassName="me-0"
                  className="btn-action"
                  color="grey"
                  outline
                  onClick={() => {
                    getSignatureList()
                    getSignatureUseLine()
                  }}
                  loading={loading}
                />
              </div>
            </>
          )}
        </div>
      )}
      <div
        className={`d-flex flex-wrap gap-2 align-items-end justify-content-${
          isMobile ? "start" : "between"
        }`}
      >
        <div className="d-flex flex-wrap justify-content-start gap-2">
          {!isVerticalTablet && (
            <BaseButton
              icon="mdi mdi-plus"
              iconClassName={isMobile ? "m-0" : "me-1"}
              color="primary"
              onClick={handleAdd}
              style={{ height: "38px" }}
            >
              {isMobile ? "" : t("mail.mail_dkim_add")}
            </BaseButton>
          )}
          <BaseButton
            outline
            icon="mdi mdi-check"
            iconClassName={isMobile ? "m-0" : "me-1"}
            color="primary"
            onClick={() => handleSetDefaultSignature(checkData.lists)}
            disabled={!(checkData.lists.length > 0)}
            style={{ height: "38px" }}
          >
            {isMobile ? "" : t("mail.mail_set_userinfo_defaultrecvmail")}
          </BaseButton>
          <BaseButton
            outline
            color="primary"
            icon="mdi mdi-sort-ascending"
            iconClassName={isMobile ? "m-0" : "me-1"}
            onClick={handlePosition}
            disabled={!fData.isDefault}
            style={{ height: "38px" }}
          >
            {isMobile ? "" : t("mail.mail_signature_btn_change_position")}
          </BaseButton>
          <BaseButton
            outline
            color="primary"
            icon="mdi mdi-code-tags"
            iconClassName={isMobile ? "m-0" : "me-1"}
            onClick={() => handleChangeUseLine(useLine ? "n" : "y")}
            style={{ height: "38px" }}
          >
            {useLine
              ? `${isMobile ? "" : t("mail.mail_sign_disable_useline")}`
              : `${isMobile ? "" : t("mail.mail_sign_enable_useline")}`}
          </BaseButton>
        </div>
        <div className="d-flex flex-wrap flex-column justify-content-end">
          <div className="d-flex align-items-center gap-2">
            <BaseButton
              outline
              color="danger"
              icon="mdi mdi-check"
              iconClassName={isMobile ? "m-0" : "me-1"}
              onClick={() => handleRemoveDefaultSignature(checkData.lists)}
              disabled={!(checkData.lists.length > 0)}
              style={{ height: "38px" }}
            >
              {isMobile ? "" : t("mail.mail_signature_btn_remove_default")}
            </BaseButton>
            <BaseButton
              color="danger"
              className=""
              icon="mdi mdi-trash-can-outline"
              iconClassName={isMobile ? "m-0" : "me-1"}
              onClick={() => handleDeleteSignature(checkData.lists)}
              disabled={!(checkData.lists.length > 0)}
              style={{ height: "38px" }}
            >
              {isMobile ? "" : t("mail.mail_set_pop3_del")}
            </BaseButton>
            {!isVerticalTablet && (
              <BaseButton
                color="grey"
                className="btn-action"
                icon="mdi mdi-refresh"
                iconClassName={isMobile ? "me-0" : ""}
                onClick={() => {
                  getSignatureList()
                  getSignatureUseLine()
                }}
                loading={loading}
                style={{ width: "38px", height: "38px" }}
              ></BaseButton>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignatureToolbar
