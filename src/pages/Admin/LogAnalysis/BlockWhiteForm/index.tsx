// @ts-nocheck
// React
import React, { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

// Third-party
import { Col, FormGroup, Input, Label } from "reactstrap"

// Project
import BaseButton from "components/Common/BaseButton"
import BaseInput from "components/SettingAdmin/Inputwriting/index"
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

const BlockWhiteForm = props => {
  const { headerTitle, isOpen, toggleModal, formSpam, setFormSpam } = props
  const { t } = useTranslation()
  const { successToast, errorToast } = useCustomToast()

  const initFormSpam = {
    type: "", // email/domain or ip
    mode: "", // block or white (b or w)
    data: "",
    isdrop: "n",
  }

  // Block email
  const [selectedGroup, setSelectedGroup] = useState(null)

  useEffect(() => {
    if (formSpam) {
      const value =
        formSpam.type === "email" || formSpam.type === "domain"
          ? optionGroup[0]?.options[0]
          : optionGroup[0]?.options[1]
      setSelectedGroup(value)
    }
  }, [formSpam])

  function handleSelectGroup(selectedGroup) {
    setSelectedGroup(selectedGroup)
  }

  const headerModal = () => {
    return <div>{headerTitle}</div>
  }

  const blockRadio = useMemo(() => {
    return (
      <FormGroup key={`allow-block`} row>
        <Label htmlFor="taskname" className="col-form-label col-lg-3">
          {t("mail.mail_select_allow_block")}
        </Label>
        <Col lg="9" className="d-flex flex-column gap-1">
          <div className="d-flex align-items-center gap-3">
            <Label check>
              <Input
                type="radio"
                name="allow_block"
                value="w"
                checked={formSpam?.mode === "w"}
                onClick={e => {
                  setFormSpam({ ...formSpam, mode: e.target.value })
                }}
                onChange={() => {
                }}
              />
              {" "}
              {t("mail.mail_white")}
            </Label>
            <Label check>
              <Input
                type="radio"
                name="allow_block"
                value="b"
                checked={formSpam?.mode === "b"}
                onClick={e => {
                  setFormSpam({ ...formSpam, mode: e.target.value })
                }}
                onChange={() => {
                }}
              />
              {" "}
              {t("mail.mail_block")}
            </Label>
          </div>
          <div className="han-color-grey"
               dangerouslySetInnerHTML={{ __html: t("mail.mail_email_domain_block_allow_msg1") }}></div>
        </Col>
      </FormGroup>
    )
  }, [formSpam])

  const spamRadio = useMemo(() => {
    return (
      <FormGroup key={`spam`} row>
        <Label htmlFor="taskname" className="col-form-label col-lg-3">
          {t("mail.mail_select_whether_to_receive_when_blocked")}
        </Label>
        <Col lg="9" className="d-flex flex-column gap-1">
          <div className="d-flex align-items-center gap-3">
            <Label check>
              <Input
                type="radio"
                name="spam"
                value="n"
                checked={formSpam?.isdrop === "n"}
                onClick={e => {
                  setFormSpam({ ...formSpam, isdrop: e.target.value })
                }}
                onChange={() => {
                }}
              />
              {" "}
              {t("mail.mail_received_in_spam_box")}
            </Label>
            <Label check>
              <Input
                type="radio"
                name="spam"
                value="y"
                checked={formSpam?.isdrop === "y"}
                onClick={e => {
                  setFormSpam({ ...formSpam, isdrop: e.target.value })
                }}
                onChange={() => {
                }}
              />
              {" "}
              {t("mail.mail_prefer_not_to_receive")}
            </Label>
          </div>
          <div className="han-color-error"
               dangerouslySetInnerHTML={{ __html: t("mail.mail_email_domain_block_allow_msg3") }}></div>
        </Col>
      </FormGroup>
    )
  }, [formSpam])

  // Form ip
  const bodyModalIp = () => {
    return (
      <div>
        <BaseInput
          title="Data"
          value={formSpam?.data}
          onChange={e => {
            const value = e.target.value
            setFormSpam({ ...formSpam, data: value })
          }}
          formText={"abc"}
        />
        {blockRadio}
        {formSpam?.mode === "b" && (
          spamRadio
        )}
      </div>
    )
  }

  // Form subject
  const bodyModalSubject = () => {
    return (
      <div>
        <BaseInput
          title={t("mail.mail_cspam_subject")}
          value={formSpam?.subject}
          onChange={e => {
            const value = e.target.value
            setFormSpam({ ...formSpam, subject: value })
          }}
          formText={t("mail.mail_please_set_the_wordsentence_to_register_as_a_keyword")}
        />
        <BaseInput
          title={t("mail.mail_cspam_spam_from")}
          value={formSpam?.from}
          onChange={e => {
            const value = e.target.value
            setFormSpam({ ...formSpam, from: value })
          }}
          formText={t("mail.mail_modal_subject_block_msg3")}
        />
        <BaseInput
          title={t("mail.mail_cspam_spam_to")}
          value={formSpam?.to}
          onChange={e => {
            const value = e.target.value
            setFormSpam({ ...formSpam, to: value })
          }}
          formText={t("mail.mail_modal_subject_block_msg4")}
        />
        {spamRadio}
      </div>
    )
  }

  // Form email/domain block/allow
  const bodyModalEmail = () => {
    return (
      <div>
        <BaseInput
          title={t("mail.mail_email")}
          value={formSpam?.data}
          onChange={e => {
            const value = e.target.value
            setFormSpam({ ...formSpam, data: value })
          }}
        />
        {/*<InputSelect*/}
        {/*  title={t("mail.mail_cspam_type")}*/}
        {/*  optionGroup={optionGroup}*/}
        {/*  onChange={s => {*/}
        {/*    handleSelectGroup(s)*/}
        {/*    setFormSpam({ ...formSpam, type: s.value })*/}
        {/*  }}*/}
        {/*  value={selectedGroup}*/}
        {/*  stylesSelect={{ backgroundColor: "white" }}*/}
        {/*/>*/}
        <FormGroup key={`email-domain`} row>
          <Label htmlFor="taskname" className="col-form-label col-lg-3">
            {t("mail.mail_cspam_type")}
          </Label>
          <Col lg="9" className="d-flex flex-column gap-1">
            <div className="d-flex align-items-center gap-3">
              <Label check>
                <Input
                  type="radio"
                  name="email_domain"
                  value="email"
                  checked={formSpam?.type === "email"}
                  onClick={e => {
                    setFormSpam({ ...formSpam, type: e.target.value })
                  }}
                  onChange={() => {
                  }}
                />
                {" "}
                {t("mail.mail_email")}
              </Label>
              <Label check>
                <Input
                  type="radio"
                  name="email_domain"
                  value="domain"
                  checked={formSpam?.type === "domain"}
                  onClick={e => {
                    setFormSpam({ ...formSpam, type: e.target.value })
                  }}
                  onChange={() => {
                  }}
                />
                {" "}
                {t("mail.mail_admin_receive_domain")}
              </Label>
            </div>
            <div className="han-color-grey"
                 dangerouslySetInnerHTML={{ __html: t("mail.mail_email_domain_block_allow_msg2") }}></div>
          </Col>
        </FormGroup>
        {blockRadio}
        {spamRadio}
      </div>
    )
  }

  const footerModal = () => {
    return (
      <>
        <div className="action-form">
          <BaseButton
            color={"primary"}
            type="button"
            onClick={handleUpdateFrom}
          >
            {t("common.admin_save_msg")}
          </BaseButton>
          <BaseButton
            color={"grey"}
            className={"btn-action"}
            type="button"
            onClick={() => setFormSpam(initFormSpam)}
          >
            {t("common.admin_cancel_msg")}
          </BaseButton>
        </div>
      </>
    )
  }

  const handleUpdateFrom = async () => {
    try {
      const params = formSpam
      const res = await emailPost(`${SPAM_MANAGER_FILTER_STATUS}/${formSpam?.type}`, params, Headers)
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
          formSpam.type === "ip" ? bodyModalIp : (
            formSpam.type === "email" || formSpam.type === "domain" ? bodyModalEmail :
              bodyModalSubject
          )
        }
        renderFooter={footerModal}
      />
    </>
  )
}

export default BlockWhiteForm
