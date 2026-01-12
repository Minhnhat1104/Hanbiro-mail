// @ts-nocheck
import { BaseButton, BaseModal } from "components/Common"
import { getFolderAddContact } from "modules/mail/list/api"
import React, { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Input } from "reactstrap"
import Select, { components } from "react-select"
import { isEmpty } from "lodash"

const AddContactModal = ({ isOpen, data, toggle, onAddContact }) => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [contactList, setContactList] = useState([])
  const [contactSelected, setContactSelected] = useState({})
  const [contactName, setContactName] = useState(data)
  const [importantContact, setImportantContact] = useState(false)

  useEffect(() => {
    setLoading(true)
    getFolderAddContact()
      .then((res) => {
        if (res.success) {
          setContactList(res.row)
          setContactSelected({
            value: res.default_folder?.id,
            label: res.default_folder?.name,
          })
        }
      })
      .catch((err) => {
        console.log("err:", err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const optionContacts = useMemo(() => {
    if (!isEmpty(contactList)) {
      let result = []
      contactList.forEach((item) => {
        result.push({
          label: item?.name,
          options: Array.isArray(item?.children)
            ? item?.children.map((item) => ({
                value: item.id,
                label: item.name,
              }))
            : [],
        })
      })
      return result
    }
  }, [contactList])

  const renderBody = useMemo(() => {
    return (
      <div className="d-flex flex-column">
        <div className="mb-3">
          <p>{t("common.addrbook_folder_msg")}</p>
          <Select
            value={contactSelected}
            options={optionContacts}
            components={{ Menu }}
            onChange={setContactSelected}
            menuPosition="fixed"
            styles={{
              menu: (base) => ({
                ...base,
                backgroundColor: "white!important",
              }),
              option: (styles) => ({
                ...styles,
                paddingLeft: "30px",
              }),
            }}
          />
        </div>
        <div className="mb-3">
          <p>{t("mail.mail_admin_name")}</p>
          <Input value={contactName} onChange={(e) => setContactName(e.target.value)} />
        </div>
        <div className="mb-3">
          <p>{t("mail.mail_email_address")}</p>
          <Input value={data} disabled />
        </div>
        <div className="">
          <p className="mb-2">{t("mail.mail_addrbook_important")}</p>
          <div className="form-check cursor-default form-switch form-switch-lg mb-3 d-flex flex-column">
            <input
              type="checkbox"
              className="form-check-input"
              defaultChecked={importantContact}
              onClick={(e) => setImportantContact(e.target.checked)}
            />
          </div>
        </div>
      </div>
    )
  }, [optionContacts, data, contactSelected, contactName, importantContact])

  return (
    <BaseModal
      size="md"
      isOpen={isOpen}
      toggle={toggle}
      renderHeader={() => {
        return <span>{t("mail.addrbook_add_address_msg")}</span>
      }}
      renderBody={renderBody}
      renderFooter={() => {
        return (
          <span className={"w-100 d-flex justify-content-end"}>
            <BaseButton
              color="primary"
              className={"mx-2"}
              onClick={() => {
                setLoading(true)
                onAddContact &&
                  onAddContact({
                    id: contactSelected.value,
                    name: contactName,
                    email: data,
                    important: importantContact ? "1" : "0",
                  })
              }}
              icon="bx bx-save me-2"
              loading={loading}
            >
              {t("common.common_btn_save")}
            </BaseButton>
            <BaseButton outline color="grey" icon="bx bx-x me-2" onClick={toggle}>
              {t("common.common_btn_close")}
            </BaseButton>
          </span>
        )
      }}
    />
  )
}

export default AddContactModal

const Menu = (props) => {
  return (
    <>
      <components.Menu {...props}>{props.children}</components.Menu>
    </>
  )
}
