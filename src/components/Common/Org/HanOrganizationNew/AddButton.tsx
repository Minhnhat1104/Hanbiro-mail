// @ts-nocheck
import BaseButton from "components/Common/BaseButton"
import React from "react"
import { useTranslation } from "react-i18next"

const AddButton = ({ onGetAddUsers, typeSelection, loading }) => {
  const { t } = useTranslation()
  return (
    <BaseButton
      color="primary"
      title={t("common.resource_add")}
      onClick={() => onGetAddUsers && onGetAddUsers(typeSelection)}
      loading={loading}
      icon="bx bx-plus"
      iconPosition="left"
      iconClassName="me-2"
      className={"px-3"}
    >
      {t("mail.mail_retired_add")}
    </BaseButton>
  )
}

export default AddButton
