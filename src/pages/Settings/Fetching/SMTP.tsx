// @ts-nocheck
import React, { useEffect, useMemo, useState } from "react"
import { BaseButton, NoData, Pagination } from "components/Common"
import BaseTable from "components/Common/BaseTable"
import { Card, Col, FormGroup, Input, Label, Row } from "reactstrap"
import SelectHost from "./SelectHost"
import { useTranslation } from "react-i18next"
import { useFormik } from "formik"
import { getExternalMailSmtp, getPreServerList } from "modules/mail/settings/api"
import HanTooltip from "components/Common/HanTooltip"

const optionPort = [{ label: "465", value: "465" }]

const SMTP = (props) => {
  const { onSubmit, loading } = props
  const { t } = useTranslation()
  const [serverList, setServerList] = useState([])
  const [extMail, setExtMail] = useState({})

  const headers = [
    {
      content: t("mail.mail_fetching_host") + "/" + t("mail.mail_fetching_port"),
    },
    {
      content: "SSL",
    },
    {
      content: t("common.faq_user_ID"),
    },
    {
      content: t("mail.mail_fetching_select_reply_address"),
    },
    {
      content: t("mail.mail_admin_spam_manager_action"),
    },
  ]

  const rows = [{ class: "test", columns: [] }]

  const optionHost = useMemo(() => {
    const option = { label: "Select...", value: "" }
    if (serverList && serverList.length > 0) {
      let servers = serverList.map((item) => {
        return {
          label: item.server,
          value: item.host,
          server: item.server,
        }
      })
      servers.push(option)
      return servers
    } else {
      return []
    }
  }, [serverList])

  useEffect(() => {
    getServerList()
    getExternalMailList()
  }, [])

  const getServerList = () => {
    getPreServerList("smtp").then((res) => {
      if (res.success) {
        let cusServer = []
        for (const key in res.data) {
          cusServer.push({
            server: key,
            ...res.data[key],
          })
        }
        setServerList(cusServer)
      }
    })
  }

  const getExternalMailList = () => {
    getExternalMailSmtp().then((res) => {
      if (res.success) {
        setExtMail(res.rows)
      }
    })
  }

  const formik = useFormik({
    initialValues: {
      server: "",
      host: "",
      userid: "",
      username: "",
      passwd: "",
      port: "465",
      isssl: true,
      replyto: "me",
      isdefault: "y",
    },
    onSubmit: (values) => onSubmit && onSubmit(values),
  })

  const onChangePage = () => {}

  const onRefresh = () => {}

  return (
    <Card className="mb-0">
      {/* Host */}
      <form onSubmit={formik.handleSubmit}>
        <FormGroup row>
          <Label className="col-form-label col-lg-3">{t("mail.mail_fetching_host")}</Label>
          <Col lg="9">
            <Row>
              <Col md={6} className="pr-0">
                <SelectHost
                  name="host"
                  value={formik.values.host}
                  onChange={(data) => {
                    formik.setFieldValue("host", data.value)
                    formik.setFieldValue("server", data.server)
                  }}
                  options={optionHost}
                  className="select2-selection"
                />
              </Col>
              <Col md={6} className="pl-0">
                <Input readOnly value={formik.values.host} type="text" className="form-control" />
              </Col>
            </Row>
          </Col>
        </FormGroup>
        {/* ID */}
        <FormGroup row>
          <Label className="col-form-label col-lg-3">{t("mail.mail_fetching_id")}</Label>
          <Col lg="9">
            <Row>
              <Col md={6} className="pr-0">
                <Input
                  type="text"
                  name="username"
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  className="form-control"
                  placeholder={`${t("mail.mail_autosetting_name_n")}`}
                />
              </Col>
              <Col md={6} className="pl-0">
                <Input
                  type="text"
                  name="userid"
                  value={formik.values.userid}
                  onChange={formik.handleChange}
                  className="form-control"
                  placeholder={`${t("mail.mail_secure_User_ID")}`}
                />
              </Col>
            </Row>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label className="col-form-label col-lg-3">{t("mail.mail_fetching_password")}</Label>
          <Col lg="9">
            <Input
              type="password"
              name="passwd"
              value={formik.values.passwd}
              onChange={formik.handleChange}
              className="form-control"
            />
          </Col>
        </FormGroup>
        {/* port */}
        <FormGroup row>
          <Label className="col-form-label col-lg-3">{t("mail.mail_fetching_port")}</Label>
          <Col lg="9">
            <Row>
              <Col md={12} className="pr-0">
                <SelectHost
                  name="port"
                  value={formik.values.port}
                  onChange={(data) => formik.setFieldValue("port", data.value)}
                  options={optionPort}
                  className="select2-selection"
                />
              </Col>
              <Col md={12} className="pl-0 mt-2">
                <div className="d-flex justify-content-lef">
                  <Input
                    id="isssl"
                    name="isssl"
                    type="checkbox"
                    checked={formik.values.isssl}
                    onChange={formik.handleChange}
                  />
                  <div className="ms-1">{t("mail.mail_fetching_use_ssl")}</div>
                </div>
              </Col>
            </Row>
          </Col>
        </FormGroup>
        {/* Select 'from' address */}
        <FormGroup row>
          <Label className="col-form-label col-lg-3">
            {t("mail.mail_fetching_select_reply_address")}
          </Label>
          <Col lg="9" className="st-fet-radio d-flex align-items-center">
            <div>
              <Label check className="me-4">
                <Input
                  type="radio"
                  name="replyto"
                  value={"me"}
                  onChange={formik.handleChange}
                  className="me-1"
                  checked={formik.values.replyto === "me"}
                />
                {t("mail.mail_fetching_my_self")}
              </Label>
              <Label check>
                <Input
                  type="radio"
                  name="replyto"
                  value={"host"}
                  onChange={formik.handleChange}
                  className="me-1"
                  checked={formik.values.replyto === "host"}
                />
                {t("mail.mail_fetching_setup_email")}
              </Label>
            </div>
          </Col>
        </FormGroup>
        {/* Set as default 'from' address */}
        <FormGroup row>
          <Label className="col-form-label col-lg-3">
            {t("mail.mail_fetching_set_as_default_from_address")}
          </Label>
          <Col lg="9" className="st-fet-radio d-flex align-items-center">
            <div>
              <Label check className="me-4">
                <Input
                  type="radio"
                  name="isdefault"
                  value={"y"}
                  onChange={formik.handleChange}
                  checked={formik.values.isdefault === "y"}
                  className="me-1"
                />
                {t("common.common_yes_msg")}
              </Label>
              <Label check>
                <Input
                  type="radio"
                  name="isdefault"
                  value={"n"}
                  onChange={formik.handleChange}
                  checked={formik.values.isdefault === "n"}
                  className="me-1"
                />
                {t("mail.mail_write_setting_tmpdelete_no")}
              </Label>
            </div>
          </Col>
        </FormGroup>
        <div className="d-flex justify-content-center">
          <BaseButton
            type="submit"
            color={"primary"}
            className="me-2"
            // icon="bx bx-save"
            // loading={loading}
          >
            {t("mail.mail_set_autosplit_save")}
          </BaseButton>
          <BaseButton color={"grey"} className={"btn-action"} onClick={formik.resetForm}>
            {t("mail.project_reset_msg")}
          </BaseButton>
        </div>
      </form>

      <div className="d-flex justify-content-end mb-2">
        <HanTooltip placement="top" overlay={t("common.org_refresh")}>
          <BaseButton
            color={"grey"}
            className={"btn-action fs-5 h-100"}
            icon={"mdi mdi-refresh"}
            iconClassName={"me-0"}
            onClick={() => onRefresh()}
            style={{ width: "38px", height: "38px" }}
          />
        </HanTooltip>
      </div>

      {/* table */}
      <BaseTable heads={headers} rows={rows} tableClass={`m-0`} />
      {extMail && extMail.length > 0 ? (
        <Pagination total={1} pageSize={1} initialPage={1} onChangePage={onChangePage} />
      ) : (
        <NoData />
      )}
    </Card>
  )
}

export default SMTP
