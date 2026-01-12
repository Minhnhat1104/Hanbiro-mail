// @ts-nocheck
import React, { useEffect, useMemo, useState } from "react"
import { BaseButton, BaseModal, NoData } from "components/Common"
import { useTranslation } from "react-i18next"
import { emailGet } from "helpers/email_api_helper"
import BaseTable from "components/Common/BaseTable"
import { Input } from "reactstrap"

const SenderModal = ({ isOpen, onClose, onSave }) => {
  const { t } = useTranslation()

  const [users, setUsers] = useState([])
  const [checkedIds, setCheckedIds] = useState([])
  const [isCheckedAll, setIsCheckedAll] = useState(false)

  useEffect(() => {
    const getPermitUsers = async () => {
      try {
        const res = await emailGet("email/secu/permitusers")
        if (res?.success && res?.rows?.length > 0) {
          setUsers(res.rows)
        }
      } catch (err) {}
    }

    getPermitUsers()
  }, [])

  // Handle select
  const handleSelect = (value) => {
    const newChecked = checkedIds.includes(value)
      ? checkedIds.filter((v) => v !== value)
      : [...checkedIds, value]

    const isCheckedAll = newChecked.length === users.length
    setIsCheckedAll(isCheckedAll)
    setCheckedIds(newChecked)
  }

  // Handle select all
  const handleSelectAll = () => {
    setIsCheckedAll(!isCheckedAll)
    setCheckedIds(isCheckedAll ? [] : users.map((item) => item?.id) || [])
  }

  // Handle check box
  const handleCheckbox = (value) => {
    const isChecked = checkedIds.includes(value) || false
    const checkAll = value === "checkedAll"
    return (
      <Input
        aria-label="Checkbox for following text input"
        type="checkbox"
        checked={checkAll ? isCheckedAll : isChecked}
        onClick={() => {
          if (checkAll) handleSelectAll()
          else handleSelect(value)
        }}
        onChange={() => {}}
      />
    )
  }

  const headerModal = useMemo(() => {
    return <header>{t("mail.mail_send_user")}</header>
  }, [])

  const bodyModal = useMemo(() => {
    const heads = [
      {
        content: handleCheckbox("checkedAll"),
      },
      {
        content: t("mail.mail_send_user"),
      },
    ]

    const rows = users.map((item) => ({
      class: "align-middle",
      columns: [
        {
          content: handleCheckbox(item?.id),
        },
        {
          content: `${item?.groupname} / ${item?.name}`,
        },
      ],
    }))

    return (
      <>
        <BaseTable heads={heads} rows={rows} />
        {users.length === 0 && <NoData />}
      </>
    )
  }, [users, checkedIds, isCheckedAll])

  const footerModal = useMemo(() => {
    return (
      <div className="btn-form-action-approval">
        <BaseButton
          color={"primary"}
          className="me-2"
          type="button"
          onClick={() => {
            const newUsers = users.filter((item) => checkedIds.includes(item?.id))
            onSave(newUsers)
            onClose()
          }}
        >
          {t("mail.mail_view_save")}
        </BaseButton>
        <BaseButton color={"secondary"} type="button" onClick={onClose}>
          {t("mail.project_close_msg")}
        </BaseButton>
      </div>
    )
  }, [users, checkedIds, isCheckedAll])

  return (
    <BaseModal
      isOpen={isOpen}
      size="sm"
      toggle={onClose}
      contentClass="h-100"
      bodyClass="overflow-y-auto hidden-scroll-box"
      renderHeader={headerModal}
      renderBody={bodyModal}
      renderFooter={footerModal}
    />
  )
}

export default SenderModal
