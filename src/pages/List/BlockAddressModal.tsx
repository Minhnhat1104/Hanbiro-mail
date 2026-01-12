// @ts-nocheck
import { BaseButton, BaseModal } from "components/Common"
import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { Input } from "reactstrap"

const BlockAddressModal = ({ isOpen, data, toggle, onBlockAddress }) => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)

  return (
    <BaseModal
      isOpen={isOpen}
      toggle={() => toggle((prev) => ({ ...prev, open: false }))}
      renderHeader={() => {
        return <span>{t("mail.mail_set_bans_bans")}</span>
      }}
      renderBody={() => {
        return (
          <>
            <p>{t("mail.mail_email_address")}</p>
            <Input value={data} disabled />
          </>
        )
      }}
      renderFooter={() => {
        return (
          <span className={"w-100 d-flex justify-content-end"}>
            <BaseButton
              color="primary"
              className={"mx-2"}
              onClick={() => {
                setLoading(true)
                onBlockAddress && onBlockAddress(data)
              }}
              icon="bx bx-save me-2"
              loading={loading}
            >
              {t("common.common_btn_save")}
            </BaseButton>
            <BaseButton
              outline
              color="grey"
              icon="bx bx-x me-2"
              onClick={() => toggle((prev) => ({ ...prev, open: false }))}
            >
              {t("common.common_btn_close")}
            </BaseButton>
          </span>
        )
      }}
    />
  )
}

export default BlockAddressModal
