// @ts-nocheck
// React
import React, { useMemo } from "react"
import { useTranslation } from "react-i18next"

// Third-party
import { Label, Col } from "reactstrap"

// Project
import BaseButton from "components/Common/BaseButton"
import { BaseModal, BaseIcon } from "components/Common"

const ModalForwardDetail = (props) => {
  const { isOpen, toggleModal, item, setDeleteData } = props
  const { t } = useTranslation()

  const bodyModal = () => {
    return (
      <>
        <Col className="mb-0">
          <Label lg="4" className="col-form-label">
            {t("mail.mail_settings_user")}
          </Label>
          <Label lg="8" className="fw-bold">
            {item?.id} ({item?.name})
          </Label>
        </Col>
        <Col className="mb-0">
          <Label lg="12" className="col-form-label">
            {t("mail.mail_forwarding_address")}
          </Label>
        </Col>
        <div className={`w-100 h-100 overflow-hidden`} style={{ lineHeight: "3" }}>
          {item?.forwardlist?.map((email, idx) => {
            return (
              <span
                key={idx}
                className={`rounded h-auto mx-1 py-2 px-2 gap-2 han-bg-color-primary-lighter han-color-primary-dark`}
                style={{ minHeight: "28px", width: "fit-content" }}
              >
                {email}
                <BaseIcon
                  className={"color-red ms-1"}
                  icon={"mdi mdi-window-close"}
                  onClick={() => {
                    setDeleteData && setDeleteData(email)
                  }}
                />
              </span>
            )
          })}
        </div>
      </>
    )
  }

  const headerModal = useMemo(() => {
    return <>{t("common.addrbook_addr_detail_msg")}</>
  }, [])

  const footerModal = useMemo(() => {
    return (
      <div className="action-form">
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
    )
  }, [])

  return (
    <BaseModal
      size={"lg"}
      isOpen={isOpen}
      toggle={toggleModal}
      renderHeader={headerModal}
      renderBody={bodyModal}
      renderFooter={footerModal}
    />
  )
}

export default ModalForwardDetail
