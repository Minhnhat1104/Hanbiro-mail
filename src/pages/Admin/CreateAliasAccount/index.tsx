// @ts-nocheck
// React
import React, { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"

// Third-party
import {
  Row,
  Col,
  Card,
  Input,
  FormGroup,
  Label,
  InputGroup,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  ListGroupItem,
  ListGroup,
} from "reactstrap"

// Project
import { RoutePaths } from "routes"
import { Title } from "components/SettingAdmin"
import InputText from "components/SettingAdmin/Input/index"
import Tooltip from "components/SettingAdmin/Tooltip"
import BaseButton from "components/Common/BaseButton"
import { Headers, emailGet, emailPost } from "helpers/email_api_helper"
import { OrgSelectModal } from "components/Common/Org"
import { useCustomToast } from "hooks/useCustomToast"
import { BaseIcon, BaseModal } from "components/Common"
import {
  ALIAS_ACCOUNT_ADD,
  ALIAS_ACCOUNT_DETAIL,
  ALIAS_ACCOUNT_REMOVE,
  ALIAS_ACCOUNT_UPDATE,
  ALIAS_ACCOUNT_WRITE,
} from "modules/mail/admin/url"

import "./style.css"
import Loading from "components/Common/Loading"
import { setCurrentMenu } from "store/viewMode/actions"
import { tabOptions } from "components/Common/Org/GroupwareOrgModal"
import MainHeader from "pages/SettingMain/MainHeader"

const CreateAliasAccount = (props) => {
  const { routeConfig } = props
  const { id } = useParams()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { successToast, errorToast } = useCustomToast()

  const userLang = useSelector((state) => state.Config?.userConfig?.lang)
  const imageGuideAlias = `${
    process.env.NODE_ENV === "development" ? "https://vndev.hanbiro.com" : location.origin
  }/groupware/_template/default/mailadmin/images/${userLang == "vi" ? "en" : userLang}/alias01.gif`

  const [dataDomain, setDataDomain] = useState()
  const [domain, setDomain] = useState("")
  const [emails, setEmails] = useState({ selected: {} })
  const [oldData, setOldData] = useState({
    a_domain: "",
    name: "",
    alias: "",
    local_email: [],
  })
  const [updateData, setUpdateData] = useState({
    a_domain: "",
    name: "",
    alias: "",
    local_email: [],
  })
  const [open, setOpen] = useState(false)
  const [openError, setOpenError] = useState(false)
  const [valueError, setValueError] = useState("")
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const res = await emailGet(`ngw/admin/${ALIAS_ACCOUNT_WRITE}`)
        if (res?.success) {
          setDataDomain(res?.rows)
          // setDomain(res?.rows?.multi_domain ? res?.rows?.multi_domain[0].value : "")
          setDomain(res?.rows?.domain)
          setUpdateData({
            ...updateData,
            a_domain: res?.rows?.domain,
          })
        } else {
          errorToast(res?.msg)
        }
      } catch (err) {
        // errorToast()
        console.log("error messenger", err)
      } finally {
        setIsLoading(false)
      }

      if (id) {
        try {
          // setIsLoading(true)
          const params = {
            alias: id,
          }
          const res = await emailPost(`ngw/admin/${ALIAS_ACCOUNT_DETAIL}`, params, Headers)
          const newData = {
            a_domain: res?.rows?.alias_domain,
            name: res?.rows?.alias_name,
            alias: res?.rows?.alias_account,
            local_email: res?.rows?.user_list,
          }
          const usersObject = {}
          res?.rows?.user_list.forEach((user) => {
            usersObject[user.userid] = user
          })

          setEmails({ selected: usersObject })
          setUpdateData(newData)
          setOldData(newData)
          setIsLoading(false)
        } catch (err) {
          // errorToast()
          console.log("error messenger", err)
        }
      }
    }

    fetchData()
  }, [id])

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen)
  }

  const handleAddAccount = async () => {
    try {
      const params = {
        ...updateData,
        local_email: updateData.local_email.map((item) => `${item.cn}|${item.email}`).join(","),
      }
      const res = await emailPost(`ngw/admin/${ALIAS_ACCOUNT_ADD}`, params, Headers)

      if (res.success) {
        successToast()

        // reset text field
        setUpdateData({
          name: "",
          a_domain: domain,
          alias: "",
          local_email: [],
        })
        // setDomain(dataDomain?.multi_domain ? dataDomain?.multi_domain[0].value : "")
        setDomain(dataDomain?.domain)
      } else {
        // Error
        setOpenError(true)
        setValueError(res.msg)
      }
    } catch (err) {
      errorToast()
      console.log("error messenger", err)
    }
  }

  const handleUpdateAccount = async () => {
    try {
      const removeEmails = oldData.local_email.filter(
        (item1) => !updateData.local_email.some((item2) => item1.userid === item2.userid),
      )

      const addEmails = updateData.local_email.filter(
        (item1) => !oldData.local_email.some((item2) => item1.userid === item2.userid),
      )

      const handleEmails = async (emails, aliasPath) => {
        if (emails.length > 0) {
          const params = {}
          emails.forEach((item, index) => {
            params[`arglist[${index}][alias]`] = id
            params[`arglist[${index}][email]`] = `${item.cn}|${item.email}`
          })
          const res = await emailPost(`ngw/admin/${aliasPath}`, params, Headers)
        }
      }

      await handleEmails(removeEmails, ALIAS_ACCOUNT_REMOVE)
      await handleEmails(addEmails, ALIAS_ACCOUNT_UPDATE)

      successToast()
      navigate(RoutePaths.AdminAliasAccounts)
    } catch (err) {
      errorToast()
      console.log("error messenger", err)
    }
  }

  // Error Modal
  const headerModal = () => {
    return <div>{t("common.alert_error_msg")}</div>
  }
  const bodyModal = () => {
    return <div className="mb-4">{valueError}</div>
  }
  const footerModal = () => {
    return (
      <>
        <BaseButton
          className={"btn btn-secondary btn-block "}
          type="button"
          onClick={() => setOpenError(false)}
        >
          {t("common.common_btn_close")}
        </BaseButton>
      </>
    )
  }

  const rightHeader = useMemo(() => {
    return (
      <BaseButton
        color={`primary`}
        className={`btn-primary btn-sm`}
        icon={`mdi mdi-list-box-outline font-size-18`}
        iconClassName={`m-0`}
        onClick={() => {
          dispatch(
            setCurrentMenu({
              key: "manage-alias",
              title: t("mail.mailadmin_aliasuseredit"),
              parentTitle: t("common.board_admin_menu_text"),
            }),
          )
          navigate("/mail/admin/manage-alias")
        }}
      />
    )
  }, [])

  return (
    <>
      <MainHeader currentTitleMenu={routeConfig?.keyTitle} rightHeader={rightHeader} />
      <div className={`w-100 h-100 overflow-hidden overflow-y-auto`}>
        <div className={`d-flex flex-column`}>
          <InputText
            title={t("mail.mailadmin_username")}
            value={updateData?.name}
            onChange={(e) => {
              setUpdateData({ ...updateData, name: e.target.value })
            }}
            disabled={id}
          />

          <Col lg={`12`}>
            <FormGroup row>
              <Label htmlFor="taskname" className="col-form-label col-lg-2">
                {t("mail.common_aliasaccount")}
              </Label>
              <Col className="d-flex" lg="10">
                <InputGroup>
                  <Input
                    type="text"
                    className={`form-control ${id ? "cursor-not-allowed" : ""}`}
                    id="inlineFormInputGroupUsername"
                    value={updateData?.alias}
                    style={{
                      borderTopRightRadius: 0,
                      borderBottomRightRadius: 0,
                    }}
                    onChange={(e) => {
                      setUpdateData({ ...updateData, alias: e.target.value })
                    }}
                    disabled={id}
                  />
                </InputGroup>
                {dataDomain && (
                  <ButtonDropdown
                    direction="down"
                    isOpen={dropdownOpen}
                    toggle={toggleDropdown}
                    disabled={id}
                  >
                    <DropdownToggle
                      color="primary"
                      className={`${id ? "cursor-not-allowed" : ""}`}
                      caret
                      style={{
                        borderTopLeftRadius: 0,
                        borderBottomLeftRadius: 0,
                      }}
                      onChange={(e) => {
                        setDomain(e.target.value)
                      }}
                    >
                      {domain}
                    </DropdownToggle>
                    <DropdownMenu>
                      {dataDomain?.multi_domain &&
                        dataDomain?.multi_domain.map((item, index) => (
                          <DropdownItem
                            key={index}
                            onClick={() => {
                              setDomain(item?.value)
                              setUpdateData({
                                ...updateData,
                                a_domain: item?.value.substring(1),
                              })
                            }}
                          >
                            {item?.value}
                          </DropdownItem>
                        ))}
                    </DropdownMenu>
                  </ButtonDropdown>
                )}
              </Col>
            </FormGroup>
          </Col>

          <Row>
            <Col lg={`12`}>
              <FormGroup row className="mb-3 gy-2">
                <Col lg="2">
                  <div className="d-flex align-items-center">
                    <Label htmlFor="taskname" className="col-form-label me-2">
                      {t("mail.mailadmin_oldaccount")}
                    </Label>
                    <BaseButton
                      outline
                      color="grey"
                      className={"me-1 border-1"}
                      type="button"
                      onClick={() => {
                        setOpen(true)
                      }}
                      style={{ width: "28px", height: "28px" }}
                    >
                      <BaseIcon icon={"mdi mdi-lan"} />
                    </BaseButton>
                  </div>
                </Col>
                <Col lg="10">
                  <ListGroup
                    className="form-control p-0 overflow-y-auto"
                    style={{ height: "150px" }}
                  >
                    {updateData?.local_email.map((item, idx) => (
                      <ListGroupItem key={idx} className="d-flex justify-content-between">
                        <div>{item?.username}</div>
                        <BaseIcon
                          icon={"mdi mdi-window-close"}
                          className="me-1 color-red"
                          onClick={() => {
                            const newEmails = updateData?.local_email.filter(
                              (email) =>
                                email.userid !== item.userid || email?.userno !== item?.userno,
                            )
                            setUpdateData({
                              ...updateData,
                              local_email: newEmails,
                            })
                            const objectEmails = { ...emails.selected }
                            delete objectEmails[item?.key]
                            setEmails({ selected: objectEmails })
                          }}
                        />
                      </ListGroupItem>
                    ))}
                  </ListGroup>
                </Col>
              </FormGroup>
            </Col>
          </Row>
        </div>

        <div className="d-flex justify-content-center gap-2 mb-3">
          <BaseButton
            color={"primary"}
            className={"btn-block"}
            onClick={() => {
              if (id) {
                handleUpdateAccount()
              } else {
                handleAddAccount()
              }
              setEmails({ selected: {} })
            }}
          >
            {t("mail.mail_set_autosplit_save")}
          </BaseButton>
          <BaseButton
            outline
            color={"grey"}
            className={"btn-block"}
            type="button"
            onClick={() => {
              if (id) {
                setUpdateData(oldData)
                setDomain(oldData?.a_domain)
              } else {
                setUpdateData({
                  name: "",
                  a_domain: domain,
                  alias: "",
                  local_email: [],
                })
                // setDomain(dataDomain?.multi_domain ? dataDomain?.multi_domain[0].value : "")
                setDomain(dataDomain?.domain)
              }
              setEmails({ selected: {} })
            }}
          >
            {t("mail.project_reset_msg")}
          </BaseButton>
        </div>

        <Tooltip
          content={
            <>
              <span
                dangerouslySetInnerHTML={{ __html: t("mail.mailadmin_aliasuseraddmsg2") }}
              ></span>
              <br />
              <img
                src={imageGuideAlias}
                alt="HTML5 Icon"
                className="m-2"
                style={{ maxWidth: "100%" }}
              />
              <div dangerouslySetInnerHTML={{ __html: t("mail.mailadmin_aliasuseraddmsg3") }}></div>
            </>
          }
        />

        {isLoading && <Loading />}
      </div>

      {open && (
        <OrgSelectModal
          title={t("common.main_orgtree")}
          setOpen={setOpen}
          emails={emails}
          open={open}
          orgTabOption={tabOptions}
          setEmails={setEmails}
          onSave={(emails) => {
            const dataArray = Object.values(emails?.selected)

            const value = dataArray.map((item, idx) => ({
              cn: item?.cn,
              email: item?.email,
              index: item?.seqno,
              userid: item?.id ?? item?.userid,
              username: item?.title || item?.username || item?.name,
              userno: item?.userno,
              key: item?.key,
            }))

            setUpdateData({ ...updateData, local_email: value })
          }}
          handleClose={() => setOpen(false)}
        />
      )}

      {/* Messenger Error */}
      <BaseModal
        open={openError}
        toggle={() => setOpenError(false)}
        renderHeader={headerModal}
        renderBody={bodyModal}
        renderFooter={footerModal}
        // size="sm"
      />
    </>
  )
}

export default CreateAliasAccount
