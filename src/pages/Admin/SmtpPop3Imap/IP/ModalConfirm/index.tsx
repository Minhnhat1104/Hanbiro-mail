// @ts-nocheck
import React, { useEffect, useState, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { Row, Label, Col } from "reactstrap"
import { BaseModal, BaseButton } from "components/Common"
import BaseTable from "components/Common/BaseTable/index"

import { emailGet } from "helpers/email_api_helper"
import { SMTP_POP3_IMAP_IP_BLOCK_INFO, SMTP_POP3_IMAP_IP_UNBLOCK } from "modules/mail/admin/url"
import ModalUnblock from "../ModalUnblock"

const ModalConfirm = (props) => {
  const { isOpen, toggleModal, selectedData, countryCode, saveUnlock } = props
  const { t } = useTranslation()
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [response, setResponse] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await emailGet(
          [SMTP_POP3_IMAP_IP_BLOCK_INFO, selectedData?.remoteip, selectedData?.blocktype].join("/"),
        )
        setResponse(res)
      } catch (err) {
        console.log("error messenger", err)
      }
    }
    fetchData()
  }, [selectedData])

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
    if (response?.blocklist) {
      const rowsData = Object.values(response?.blocklist).map((item) => ({
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
  }, [response])

  const headerModal = () => {
    return <>{t("mail.mail_block_date_and_time")}</>
  }

  const bodyModal = () => {
    return (
      <>
        <Row>
          <Label className="col-form-label col-lg-3">{t("mail.mail_cspam_ip_address")}</Label>
          <Col className="col-form-label" lg="6" style={{ color: "initial" }}>
            {response?.ipaddr}
          </Col>
          <Col lg="3">
            <BaseButton
              className={"float-end"}
              color={"primary"}
              onClick={() => setIsOpenModal(true)}
            >
              {t("mail.unblock")}
            </BaseButton>
          </Col>
        </Row>

        <Row>
          <Label className="col-form-label col-lg-3">{t("mail.mail_country_code")}</Label>
          <Col className="col-form-label" lg="9" style={{ color: "initial" }}>
            {selectedData?.countrycode}
          </Col>
        </Row>

        <Row>
          <Label className="col-form-label col-lg-3">{t("mail.mail_block_date_and_time")}</Label>
          <Col className="col-form-label" lg="9" style={{ color: "initial" }}>
            {selectedData?.createat}
          </Col>
        </Row>

        <Row>
          <Label className="col-form-label col-lg-3">{t("mail.mail_reason_for_blocking")}</Label>
          <Col className="col-form-label" lg="9" style={{ color: "initial" }}>
            {selectedData?.blockreason}
          </Col>
        </Row>

        {rows.length > 0 && (
          <Row>
            <Label className="col-form-label col-lg-3">{t("mail.mail_failure_log")}</Label>
          </Row>
        )}

        {rows.length > 0 && <BaseTable heads={heads} rows={rows} />}

        {isOpenModal && (
          <ModalUnblock
            isOpen={isOpenModal}
            toggleModal={() => setIsOpenModal(false)}
            saveUnlock={saveUnlock}
          />
        )}
      </>
    )
  }
  const footerModal = () => {
    return <></>
  }

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

export default ModalConfirm
