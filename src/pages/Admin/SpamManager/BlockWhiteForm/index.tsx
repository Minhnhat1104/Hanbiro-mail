// @ts-nocheck
// React
import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

// Third-party
import { Col, FormGroup, Input, Label } from "reactstrap"

// Project
import BaseButton from "components/Common/BaseButton"
import InputSelect from "components/SettingAdmin/Inputselectwriting/index"
import Inputname from "components/SettingAdmin/Inputwriting/index"
import { BaseModal } from "components/Common"
import { Headers, emailPost } from "helpers/email_api_helper"
import { useCustomToast } from "hooks/useCustomToast"
import { SPAM_MANAGER_FILTER_STATUS } from "modules/mail/admin/url"
import "components/SettingAdmin/Tabs/style.css"

const optionGroup = [
  {
    options: [
      {
        label: "Email",
        value: "email",
      },
      {
        label: "Domain",
        value: "domain",
      },
    ],
  },
]

const BlockWhiteForm = (props) => {
  const { headerTitle, isOpen, toggleModal, formSpam, setFormSpam } = props
  const { t } = useTranslation()
  const { successToast, errorToast } = useCustomToast()

  const initFormSpam = {
    type: "", // email/domain or ip
    mode: "", // block or white (b or w)
    data: "",
    isfrop: "n", // Permanent Delete (y or n)
  }

  // Block email
  const [selectedGroup, setSelectedGroup] = useState(null)

  useEffect(() => {
    if (formSpam) {
      const value =
        formSpam.type === "email" ? optionGroup[0]?.options[0] : optionGroup[0]?.options[1]
      setSelectedGroup(value)
    }
  }, [formSpam])

  function handleSelectGroup(selectedGroup) {
    setSelectedGroup(selectedGroup)
  }

  const headerModal = () => {
    return <div>{headerTitle}</div>
  }

  const bodyModalEmail = () => {
    return (
      <>
        <div>
          <InputSelect
            title={t("mail.mail_cspam_type")}
            optionGroup={optionGroup}
            onChange={(s) => {
              handleSelectGroup(s)
              setFormSpam({ ...formSpam, type: s.value })
            }}
            value={selectedGroup}
            stylesSelect={{ backgroundColor: "white" }}
          />
          <Inputname
            title={t("mail.mail_spam_manager_data")}
            value={formSpam?.data}
            onChange={(e) => {
              const value = e.target.value
              setFormSpam({ ...formSpam, data: value })
            }}
          />

          {formSpam?.mode === "b" && (
            <FormGroup row>
              <Label htmlFor="taskname" className="col-form-label col-lg-3">
                {t("mail.mail_silently_drop")}
              </Label>
              <Col lg="9" className="d-flex align-items-center">
                <div className="me-3">
                  <Label check>
                    <Input
                      type="radio"
                      name="radio1"
                      value="y"
                      checked={formSpam?.isfrop === "y"}
                      onClick={(e) => {
                        setFormSpam({ ...formSpam, isfrop: e.target.value })
                      }}
                      onChange={() => {}}
                    />{" "}
                    {t("common.common_yes_msg")}
                  </Label>
                </div>
                <div className="me-3">
                  <Label check>
                    <Input
                      type="radio"
                      name="radio1"
                      value="n"
                      checked={formSpam?.isfrop === "n"}
                      onClick={(e) => {
                        setFormSpam({ ...formSpam, isfrop: e.target.value })
                      }}
                      onChange={() => {}}
                    />{" "}
                    {t("common.common_no_msg")}
                  </Label>
                </div>
              </Col>
            </FormGroup>
          )}
        </div>
      </>
    )
  }

  // Form ip
  const bodyModalIp = () => {
    return (
      <div>
        <Inputname
          title="Data"
          value={formSpam?.data}
          onChange={(e) => {
            const value = e.target.value
            setFormSpam({ ...formSpam, data: value })
          }}
        />

        {formSpam?.mode === "b" && (
          <FormGroup row>
            <Label htmlFor="taskname" className="col-form-label col-lg-3">
              {t("mail.mail_silently_drop")}
            </Label>
            <Col lg="9" className="d-flex align-items-center">
              <div className="me-3">
                <Label check>
                  <Input
                    type="radio"
                    name="radio1"
                    value="y"
                    checked={formSpam?.isfrop === "y"}
                    onClick={(e) => {
                      setFormSpam({ ...formSpam, isfrop: e.target.value })
                    }}
                    onChange={() => {}}
                  />{" "}
                  {t("common.common_yes_msg")}
                </Label>
              </div>
              <div className="me-3">
                <Label check>
                  <Input
                    type="radio"
                    name="radio1"
                    value="n"
                    checked={formSpam?.isfrop === "n"}
                    onClick={(e) => {
                      setFormSpam({ ...formSpam, isfrop: e.target.value })
                    }}
                    onChange={() => {}}
                  />{" "}
                  {t("common.common_no_msg")}
                </Label>
              </div>
            </Col>
          </FormGroup>
        )}
      </div>
    )
  }

  // Form ip
  const bodyModalSubject = () => {
    return (
      <div>
        <Inputname
          title={t("mail.mail_cspam_subject")}
          value={formSpam?.subject}
          onChange={(e) => {
            const value = e.target.value
            setFormSpam({ ...formSpam, subject: value })
          }}
        />
        <Inputname
          title={t("mail.mail_cspam_spam_from")}
          value={formSpam?.from}
          onChange={(e) => {
            const value = e.target.value
            setFormSpam({ ...formSpam, from: value })
          }}
        />
        <Inputname
          title={t("mail.mail_cspam_spam_to")}
          value={formSpam?.to}
          onChange={(e) => {
            const value = e.target.value
            setFormSpam({ ...formSpam, to: value })
          }}
        />
        <FormGroup row>
          <Label htmlFor="taskname" className="col-form-label col-lg-3">
            {t("mail.mail_silently_drop")}
          </Label>
          <Col lg="9" className="d-flex align-items-center">
            <div className="me-3">
              <Label check>
                <Input
                  type="radio"
                  name="radio1"
                  value="y"
                  checked={formSpam?.isfrop === "y"}
                  onClick={(e) => {
                    setFormSpam({ ...formSpam, isfrop: e.target.value })
                  }}
                  onChange={() => {}}
                />{" "}
                {t("common.common_yes_msg")}
              </Label>
            </div>
            <div className="me-3">
              <Label check>
                <Input
                  type="radio"
                  name="radio1"
                  value="n"
                  checked={formSpam?.isfrop === "n"}
                  onClick={(e) => {
                    setFormSpam({ ...formSpam, isfrop: e.target.value })
                  }}
                  onChange={() => {}}
                />{" "}
                {t("common.common_no_msg")}
              </Label>
            </div>
          </Col>
        </FormGroup>
      </div>
    )
  }

  const footerModal = () => {
    return (
      <>
        <div className="action-form">
          <BaseButton color={"primary"} type="button" onClick={handleUpdateFrom}>
            {t("common.admin_save_msg")}
          </BaseButton>
          <BaseButton color={"secondary"} type="button" onClick={() => setFormSpam(initFormSpam)}>
            {t("common.admin_cancel_msg")}
          </BaseButton>
        </div>
      </>
    )
  }

  const handleUpdateFrom = async () => {
    try {
      const params = formSpam
      const res = await emailPost(
        `${SPAM_MANAGER_FILTER_STATUS}/${formSpam?.type}`,
        params,
        Headers,
      )
      if (res?.success) {
        successToast(res?.msg)
        // setRefetch(true)
      } else {
        errorToast(res?.msg)
      }
      setFormSpam(initFormSpam)
    } catch (err) {
      console.log("error messenger", err)
      errorToast()
    }
  }

  return (
    <>
      {/* Form update Email/IP */}
      <BaseModal
        isOpen={isOpen}
        toggle={toggleModal}
        renderHeader={headerModal}
        renderBody={
          formSpam.type === "ip"
            ? bodyModalIp
            : formSpam.type === "email" || formSpam.type === "domain"
            ? bodyModalEmail
            : bodyModalSubject
        }
        renderFooter={footerModal}
      />
    </>
  )
}

export default BlockWhiteForm
