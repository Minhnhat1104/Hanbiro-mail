// @ts-nocheck
// React
import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

// Third-party
import { Col, FormGroup, Input, Label } from "reactstrap"

// Project
import BaseIcon from "components/Common/BaseIcon"
import BaseButton from "components/Common/BaseButton"
import { BaseModal } from "components/Common"
import { OrgSelectModal } from "components/Common/Org"
import IdAutoComplete from "components/SettingAdmin/IdAutoComplete"
import "../style.css"
import OrgAutoComplete from "components/SettingAdmin/OrgAutoComplete"
import { tabOptions } from "components/Common/Org/GroupwareOrgModal"

const FormSharingMailbox = (props) => {
  const { isOpen, onToggle, itemUpdate, handleUpdate } = props
  const { t } = useTranslation()

  const [user, setUser] = useState({})

  // State for Update
  const [open, setOpen] = useState(false)
  const [emails, setEmails] = useState({ selected: {} })

  useEffect(() => {
    if (itemUpdate?.id) {
      const data = itemUpdate?.userids.map((v) => ({
        id: v.userid,
        username: v.username,
        groupname: v.groupname,
        position: v.posname,
      }))
      const objectEmails = {}
      for (const item of data) {
        objectEmails[item.id] = item
      }
      setEmails({ selected: objectEmails })
    }
  }, [])

  // Form Update Sharing Mailbox
  const headerModal = () => {
    return <span>{t("mail.admin_share_retired_mail")}</span>
  }

  const bodyModal = () => {
    return (
      <div>
        <IdAutoComplete
          user={user}
          setUser={setUser}
          title={t("mail.mail_retired_users")}
          idUpdate={itemUpdate?.id}
        />

        <FormGroup row>
          <div className="col-form-label col-lg-3">
            <div className="d-flex align-items-center">
              <Label htmlFor="taskname">{t("mail.mail_admin_spam_manager_users")}</Label>
              <BaseButton
                outline
                color="secondary"
                className={"btn-outline-grey me-1 border-1 mx-2 py-1 px-2"}
                type="button"
                onClick={() => {
                  setOpen(true)
                }}
              >
                <BaseIcon icon={"mdi mdi-lan font-size-18"} />
              </BaseButton>
            </div>
          </div>
          <Col lg="9" className="d-flex align-items-center">
            <OrgAutoComplete emails={emails} setEmails={setEmails} />
          </Col>
        </FormGroup>
      </div>
    )
  }

  const footerModal = () => {
    return (
      <span className="d-flex w-100 justify-content-center">
        <BaseButton
          color={"primary"}
          className="mx-1"
          onClick={() => {
            const updateData = Object.values(emails?.selected)
            handleUpdate(user?.id, updateData)
          }}
        >
          {t("common.common_btn_save")}
        </BaseButton>
        <BaseButton outline color={"grey"} className="mx-1" onClick={onToggle}>
          {t("common.common_cancel")}
        </BaseButton>
      </span>
    )
  }

  return (
    <>
      <BaseModal
        isOpen={isOpen}
        toggle={onToggle}
        renderHeader={headerModal}
        renderBody={bodyModal}
        renderFooter={footerModal}
        centered={true}
      />

      {open && (
        <OrgSelectModal
          title={t("common.main_orgtree")}
          setOpen={setOpen}
          emails={emails}
          open={open}
          orgTabOption={tabOptions}
          setEmails={setEmails}
          onSave={(emails) => {
            // const dataArray = Object.values(emails?.selected)
          }}
          handleClose={() => setOpen(false)}
        />
      )}
    </>
  )
}

export default FormSharingMailbox
