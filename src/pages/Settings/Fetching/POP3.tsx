// @ts-nocheck
import React, { useEffect, useMemo, useState } from "react"

import { useTranslation } from "react-i18next"
import { useFormik } from "formik"

import { BaseButton, NoData, Pagination } from "components/Common"
import BaseTable from "components/Common/BaseTable"
import { Card, Col, Collapse, FormGroup, Input, Label, Row } from "reactstrap"
import InputAdd from "components/SettingAdmin/AddInput/index"
import { getExternalMailPop, getPreServerList } from "modules/mail/settings/api"
import useMenu from "utils/useMenu"
import HanTooltip from "components/Common/HanTooltip"
import useDevice from "hooks/useDevice"

import SelectHost from "./SelectHost"

const optionPort = [{ label: "995", value: "995" }]

const POP3 = ({ onSubmit, loading }) => {
  const { t } = useTranslation()
  const { isMobile } = useDevice()

  const { basicMenus, folderMenus } = useMenu()

  // State
  const [serverList, setServerList] = useState([])
  const [extMail, setExtMail] = useState({})

  const optionHost = useMemo(() => {
    const option = { label: "Select...", value: "" }
    if (serverList && serverList.length > 0) {
      let servers = serverList.map((item) => {
        return {
          label: item.tonewboxname,
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

  const optionMailbox = useMemo(() => {
    const result = [{ label: "common.common_none_msg", value: "" }]
    if (basicMenus && basicMenus.length > 0) {
      const menu = [...basicMenus, ...folderMenus].map((item) => {
        return {
          label: item.name,
          value: item.key,
        }
      })
      return [...result, ...menu]
    } else {
      return []
    }
  }, [basicMenus])

  useEffect(() => {
    getServerList()
    getExternalMailList()
  }, [])

  const getServerList = () => {
    getPreServerList("pop").then((res) => {
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
    getExternalMailPop().then((res) => {
      if (res.success) {
        setExtMail(res.rows)
      }
    })
  }

  const onRefresh = () => {}

  const heads = [
    {
      content: t("mail.mail_fetching_host") + "/" + t("mail.mail_fetching_port"),
    },
    {
      content: "SSL",
    },
    {
      content: t("mail.mail_fetching_user_ID"),
    },
    {
      content: t("mail.mail_fetching_leave_original_mail_on_server"),
    },
    {
      content: t("mail.mail_fetching_to_classify_spam"),
    },
    {
      content: t("mail.mail_fetching_getting_automatically"),
    },
    {
      content: t("mail.mail_fetching_processing_like_regular_mail"),
    },
    {
      content: t("common.asset_action"),
    },
  ]
  const rows = [
    {
      class: "test",
      columns: [],
    },
  ]

  const formik = useFormik({
    initialValues: {
      server: "",
      host: "",
      userid: "",
      passwd: "",
      port: "995",
      isssl: true,
      isdel: "y",
      isnormal: "n",
      isspam: "n",
      isautoget: "n",
      toboxide: "",
      tonewboxname: "",
    },
    onSubmit: (values) => onSubmit && onSubmit(values),
  })

  const onChangePage = () => {}

  return (
    <Card className="mb-0">
      <form onSubmit={formik.handleSubmit}>
        <FormGroup row>
          <Label className="col-form-label col-lg-3">{t("mail.mail_fetching_host")}</Label>
          <Col lg="9">
            <Row>
              <Col xs={12} md={6} className="pr-0">
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
              <Col xs={12} md={6} className={`pl-0 ${isMobile ? "mt-2" : "mt-0"}`}>
                <Input readOnly value={formik.values.host} type="text" className="form-control" />
              </Col>
            </Row>
          </Col>
        </FormGroup>

        {/* id */}
        <FormGroup row>
          <Label className="col-form-label col-lg-3">{t("mail.mail_fetching_id")}</Label>
          <Col lg="9">
            <Input
              name="userid"
              value={formik.values.userid}
              onChange={formik.handleChange}
              placeholder={t("mail.mail_fetching_id")}
            />
          </Col>
        </FormGroup>

        {/* password */}
        <FormGroup row>
          <Label className="col-form-label col-lg-3">{t("mail.mail_fetching_password")}</Label>
          <Col lg="9">
            <Input
              type="password"
              name="passwd"
              value={formik.values.passwd}
              onChange={formik.handleChange}
              placeholder={t("mail.mail_fetching_password")}
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
                <div className="d-flex justify-content-left">
                  <Input
                    id="isssl"
                    name="isssl"
                    type="checkbox"
                    checked={formik.values.isssl}
                    onChange={formik.handleChange}
                  />
                  <label htmlFor="isssl" className="ms-1">
                    {t("mail.mail_fetching_use_ssl")}
                  </label>
                </div>
              </Col>
            </Row>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label className="col-form-label col-lg-3">
            {t("mail.mail_fetching_leave_original_mail_on_server")}
          </Label>
          <Col lg="9" className="d-flex align-items-center">
            <Row>
              <Col md={12} className="pr-0">
                <div>
                  <Label check className="me-4">
                    <Input
                      type="radio"
                      name="isdel"
                      value={"y"}
                      onChange={formik.handleChange}
                      checked={formik.values.isdel === "y"}
                      className="me-1"
                    />
                    {t("common.common_yes_msg")}
                  </Label>
                  <Label check>
                    <Input
                      type="radio"
                      name="isdel"
                      value={"n"}
                      onChange={formik.handleChange}
                      checked={formik.values.isdel === "n"}
                      className="me-1"
                    />
                    {t("mail.mail_write_setting_tmpdelete_no")}
                  </Label>
                </div>
              </Col>
            </Row>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label className="col-form-label col-lg-3">
            {t("mail.mail_fetching_processing_like_regular_mail")}
          </Label>
          <Col lg="9" className="st-fet-radio d-flex flex-column justify-content-start">
            <div>
              <Label check className="me-4">
                <Input
                  type="radio"
                  name="isnormal"
                  value={"y"}
                  onChange={formik.handleChange}
                  className="me-1"
                  checked={formik.values.isnormal === "y"}
                />
                {t("common.common_yes_msg")}
              </Label>
              <Label check>
                <Input
                  type="radio"
                  name="isnormal"
                  value={"n"}
                  onChange={formik.handleChange}
                  className="me-1"
                  checked={formik.values.isnormal === "n"}
                />
                {t("mail.mail_write_setting_tmpdelete_no")}
              </Label>
            </div>
            <div className="mt-1">{t("mail.mail_fetching_receive_in_feching_mail_msg")}</div>
            <Collapse isOpen={formik.values.isnormal === "y"}>
              <Card className="st-fet-card">
                <Row>
                  <Col md={6} className="pr-0">
                    <SelectHost
                      name="toboxide"
                      value={formik.values.toboxide}
                      onChange={(value) => formik.setFieldValue("toboxide", value)}
                      options={optionMailbox}
                      className="select2-selection"
                    />
                  </Col>
                  <Col md={6} className="pl-0">
                    <InputAdd
                      name="tonewboxname"
                      value={formik.values.tonewboxname}
                      onChange={formik.handleChange}
                      disabled={formik.values.toboxide !== ""}
                      title={t("mail.mail_fetching_new_box_name")}
                    />
                  </Col>
                </Row>
              </Card>
            </Collapse>
          </Col>
        </FormGroup>

        <FormGroup row>
          <Label className="col-form-label col-lg-3">
            {t("mail.mail_fetching_to_classify_spam")}
          </Label>
          <Col lg="9" className="st-fet-radio">
            <Row>
              <Col md={12} className="pr-0">
                <div>
                  <Label check className="me-4">
                    <Input
                      type="radio"
                      name="isspam"
                      value={"y"}
                      onChange={formik.handleChange}
                      className="me-1"
                      checked={formik.values.isspam === "y"}
                    />
                    {t("common.common_yes_msg")}
                  </Label>
                  <Label check>
                    <Input
                      type="radio"
                      name="isspam"
                      value={"n"}
                      onChange={formik.handleChange}
                      className="me-1"
                      checked={formik.values.isspam === "n"}
                    />
                    {t("mail.mail_write_setting_tmpdelete_no")}
                  </Label>
                </div>
                <div className="mt-1">{t("mail.mail_fetching_using_the_spam_db_msg")}</div>
              </Col>
            </Row>
          </Col>
        </FormGroup>
        <FormGroup row>
          <Label className="col-form-label col-lg-3">
            {t("mail.mail_fetching_getting_automatically")}
          </Label>
          <Col lg="9" className="st-fet-radio d-flex align-items-center">
            <div>
              <Label check className="me-4">
                <Input
                  type="radio"
                  name="isautoget"
                  value={"y"}
                  onChange={formik.handleChange}
                  className="me-1"
                  checked={formik.values.isautoget === "y"}
                />
                {t("common.common_yes_msg")}
              </Label>
              <Label check>
                <Input
                  type="radio"
                  name="isautoget"
                  value={"n"}
                  onChange={formik.handleChange}
                  className="me-1"
                  checked={formik.values.isautoget === "n"}
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
            // icon={"bx bx-save"}
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
            color="grey"
            className={"btn-action fs-5 h-100"}
            icon={"mdi mdi-refresh"}
            iconClassName={"me-0"}
            onClick={() => onRefresh()}
            style={{ width: "38px", height: "38px" }}
          />
        </HanTooltip>
      </div>

      {/* table */}
      <BaseTable heads={heads} rows={rows} tableClass={`m-0`} />
      {extMail && extMail.length > 0 ? (
        <Pagination total={1} pageSize={1} initialPage={1} onChangePage={onChangePage} />
      ) : (
        <NoData />
      )}
    </Card>
  )
}

export default POP3
