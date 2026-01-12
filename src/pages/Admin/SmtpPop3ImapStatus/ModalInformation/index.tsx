// @ts-nocheck
// React
import React, { useEffect, useState, useMemo } from "react"
import { useTranslation } from "react-i18next"

// Third-party
import { Label, Col, Row } from "reactstrap"

// Project
import { BaseModal } from "components/Common"
import BaseTable from "components/Common/BaseTable/index"

import { emailGet } from "helpers/email_api_helper"
import { SMTP_POP3_IMAP_BLOCK_INFO } from "modules/mail/admin/url"

const ModalInformation = (props) => {
  const { isOpen, toggleModal, selectedData, countryCode } = props
  const { type, item } = selectedData
  const information = item?.[type]
  const { t } = useTranslation()
  const [response, setResponse] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        // emailGet
        const res = await emailGet(
          [SMTP_POP3_IMAP_BLOCK_INFO, type, information?.blockid ?? "0"].join("/"),
        )
        setResponse(res)
      } catch (err) {
        console.log("error messenger", err)
      }
    }
    fetchData()
  }, [])

  const headerModal = () => {
    return <>{t("mail.mail_check_blocking_details")}</>
  }
  const bodyModal = () => {
    return (
      <>
        <Row>
          <Label className="col-form-label col-lg-3">{t("mail.mail_account_information")}</Label>
          <Col className="col-form-label" lg="9" style={{ color: "initial" }}>
            {item.id} ({response?.email})
          </Col>
        </Row>

        <Row>
          <Label className="col-form-label col-lg-3">{t("mail.mail_autosetting_name_n")}</Label>
          <Col className="col-form-label" lg="9" style={{ color: "initial" }}>
            {item.name}
          </Col>
        </Row>

        <Row>
          <Label className="col-form-label col-lg-3">{t("mail.mail_service_name")}</Label>
          <Col className="col-form-label" lg="9" style={{ color: "initial" }}>
            {response?.servicename?.toUpperCase()}
          </Col>
        </Row>

        <Row>
          <Label className="col-form-label col-lg-3">{t("mail.mail_reason_for_blocking")}</Label>
          <Col className="col-form-label" lg="9" style={{ color: "initial" }}>
            {response?.blockreason}
          </Col>
        </Row>

        <Row>
          <Label className="col-form-label col-lg-3">{t("mail.mail_block_date_and_time")}</Label>
          <Col className="col-form-label" lg="9" style={{ color: "initial" }}>
            {response?.createat}
          </Col>
        </Row>

        {rows.length > 0 && (
          <Row>
            <Label className="col-form-label col-lg-3">{t("mail.mail_failure_log")}</Label>
          </Row>
        )}

        {rows.length > 0 && <BaseTable heads={heads} rows={rows} />}
      </>
    )
  }
  const footerModal = () => {
    return <></>
  }

  const heads = useMemo(() => {
    return [
      {
        content: t("common.calendar_calendar_date_msg"),
      },
      {
        content: "IP",
      },
      {
        content: t("mail.country"),
      },
      {
        content: t("mail.mail_password"),
      },
    ]
  }, [])

  const rows = useMemo(() => {
    if (response?.authlog) {
      const rowsData = Object.values(response?.authlog).map((item) => ({
        class: "align-middle",
        columns: [
          {
            content: <div>{item?.createat}</div>,
          },
          {
            content: <div>{item?.ip}</div>,
          },
          {
            content: <div>{countryCode?.[item?.ccode] ?? item?.ccode}</div>,
          },
          {
            content: <div>{item?.passwd}</div>,
          },
        ],
      }))
      return rowsData
    }
    return []
  }, [response?.authlog])

  return (
    <BaseModal
      isOpen={isOpen}
      toggle={toggleModal}
      renderHeader={headerModal}
      renderBody={bodyModal}
      renderFooter={footerModal}
    />
  )
}
export default ModalInformation
