// @ts-nocheck
// React
import React, { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"

// Third-party
import { FormGroup, Label, Col, Input } from "reactstrap"

// Project
import InputSelect from "components/SettingAdmin/Inputselectwriting/index"
import BaseButton from "components/Common/BaseButton"
import { BaseModal } from "components/Common"
import { emailGet } from "helpers/email_api_helper"
import { DKIM_MANAGEMENT } from "modules/mail/admin/url"

const AddForm = props => {
  const { isOpen, toggleForm, handleUpdate } = props
  const { t } = useTranslation()
  const [selector, setSelector] = useState("")
  const [domain, setDomain] = useState({})
  const [domains, setDomains] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await emailGet(`${DKIM_MANAGEMENT}/info`)
        setSelector(res?.data?.selector)
        const domainList = res?.data?.domlist.map(v => ({ label: v, value: v }))
        setDomains(domainList)
      } catch (err) {
        // errorToast()
        console.log("error messenger", err)
      }
    }
    fetchData()
  }, [])

  const headerAddModal = () => {
    return <>{t("mail.mail_dkim_create")}</>
  }
  const bodyAddModal = props => {
    return (
      <>
        <FormGroup className="mb-4" row>
          <Label className="col-form-label col-lg-3">
            {t("mail.mail_dkim_selector")}
          </Label>
          <Col lg="9">
            <Input
              id="taskname"
              name="taskname"
              type="text"
              value={selector}
              className="form-control"
              placeholder={props?.note}
              onChange={e => setSelector(e.target.value)}
              invalid={selector === ""}
            />
          </Col>
        </FormGroup>
        <InputSelect
          title={t("mail.mail_admin_receive_domain")}
          optionGroup={domains}
          onChange={s => setDomain(s)}
          value={domain}
        />
      </>
    )
  }
  const footerAddModal = () => {
    return (
      <>
        <div className="action-form">
          <BaseButton
            color={"primary"}
            type="button"
            onClick={() => {
              if (selector != "") handleUpdate(selector, domain?.value)
            }}
          >
            {t("common.admin_save_msg")}
          </BaseButton>
          <BaseButton color={"secondary"} type="button" onClick={toggleForm}>
            {t("common.admin_cancel_msg")}
          </BaseButton>
        </div>
      </>
    )
  }

  return (
    <>
      <BaseModal
        isOpen={isOpen}
        toggle={toggleForm}
        renderHeader={headerAddModal}
        renderBody={bodyAddModal}
        renderFooter={footerAddModal}
      />
    </>
  )
}

export default AddForm
