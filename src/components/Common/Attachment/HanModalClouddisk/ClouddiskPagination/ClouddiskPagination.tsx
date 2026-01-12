// @ts-nocheck
import BaseButton from "components/Common/BaseButton"
import React from "react"
import "./style.scss"
import { useTranslation } from "react-i18next"
const ClouddiskPagination = ({
  onNextHandle,
  onPrevHandle,
  pagination: { totalItems, limit, page },
}) => {
  const { t } = useTranslation()
  return (
    <div className="w-100 d-flex justify-content-between align-items-center clouddisk-pagination mt-auto">
      <span>{`${t("mail.mail_total")}: ${totalItems ?? 0}`}</span>
      <div className="d-flex clouddisk-pagination__buttons">
        <BaseButton
          outline
          disabled={page <= 1}
          iconClassName={page <= 1 ? "cursor-not-allowed" : ""}
          icon={"bx bx-chevron-left fs-3"}
          className={"clouddisk-pagination__button py-1 px-3"}
          onClick={() => onPrevHandle?.()}
        ></BaseButton>
        <BaseButton
          outline
          disabled={limit * page >= totalItems}
          iconClassName={limit * page >= totalItems ? "cursor-not-allowed" : ""}
          icon={"bx bx-chevron-right fs-3"}
          className={"clouddisk-pagination__button py-1 px-3"}
          onClick={() => onNextHandle?.()}
        ></BaseButton>
      </div>
    </div>
  )
}

export default ClouddiskPagination
