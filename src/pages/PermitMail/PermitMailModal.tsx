// @ts-nocheck
import { BaseButton, BaseModal } from "components/Common"
import React, { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Input, Label } from "reactstrap"

function PermitMailModal(props) {
  const { dataPermitModal, isPredecessor = false, onPermitMail, setToggle, loadingPermit } = props
  const { open, type } = dataPermitModal
  const { t } = useTranslation()

  const [mforce, setMforce] = useState(false)
  const [reasonReject, setReasonReject] = useState("")

  const renderHeader = useMemo(() => {
    return (
      <header>
        {t(
          type === "allow"
            ? "mail.mail_secure_permit_confirm_title"
            : "mail.mail_secure_deny_reason",
        )}
      </header>
    )
  }, [])

  const renderBody = useMemo(() => {
    return (
      <>
        {type === "allow" ? (
          <div>
            <h6>{t("mail.mail_secure_ask_approve_msg")}</h6>
            {isPredecessor && (
              <div className="d-flex align-items-center ms-3 py-3">
                <Input
                  className="checkbox-wrapper-mail m-0 border-1 me-3"
                  type="checkbox"
                  id={"predecessor"}
                  onChange={() => {}}
                  onClick={(e) => setMforce((prev) => !prev)}
                  checked={mforce}
                />
                <Label htmlFor={"predecessor"} className="toggle" />
                <span className="cursor-pointer" onClick={() => setMforce((prev) => !prev)}>
                  {t("mail.mail_secure_predecessor_permit")}
                </span>
              </div>
            )}
          </div>
        ) : (
          <Input
            type="textarea"
            rows={5}
            value={reasonReject}
            onChange={(e) => setReasonReject(e.target.value)}
          />
        )}
      </>
    )
  }, [reasonReject, mforce, isPredecessor, type])

  const renderFooter = useMemo(() => {
    return (
      <div className="d-flex ">
        {type === "allow" ? (
          <BaseButton
            className={"me-2"}
            icon="mdi mdi-check me-2"
            color="primary"
            loading={loadingPermit}
            onClick={() => {
              onPermitMail && onPermitMail("allow", mforce ? "y" : "n")
            }}
          >
            {t("mail.mail_secure_permit_confirm_title")}
          </BaseButton>
        ) : (
          <BaseButton
            className={"me-2"}
            icon="fa fa-ban fw-semibold me-2"
            color="danger"
            loading={loadingPermit}
            onClick={() => {
              onPermitMail && onPermitMail("deny", mforce ? "y" : "n", reasonReject)
            }}
          >
            {t("mail.mail_secure_deny_btn")}
          </BaseButton>
        )}
        <BaseButton
          icon="mdi mdi-close me-2"
          color="grey"
          outline
          onClick={() =>
            setToggle((prev) => ({
              ...prev,
              open: false,
            }))
          }
        >
          {t("common.common_btn_close")}
        </BaseButton>
      </div>
    )
  }, [onPermitMail, mforce, reasonReject, loadingPermit, type])

  return (
    <BaseModal
      // size="sm"
      modalClass="permit-modal"
      open={open}
      toggle={() =>
        setToggle((prev) => ({
          ...prev,
          open: false,
        }))
      }
      renderHeader={() => renderHeader}
      renderBody={() => renderBody}
      renderFooter={() => renderFooter}
    />
  )
}

export default PermitMailModal
