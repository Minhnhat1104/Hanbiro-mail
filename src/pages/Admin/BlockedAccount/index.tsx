// @ts-nocheck
// React
import React, { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

// Third-party
import { Card, Col, FormGroup, Input, InputGroup, InputGroupText, Label } from "reactstrap"

// Project
import { Title } from "components/SettingAdmin"
import BaseTable from "components/Common/BaseTable"
import BaseButton from "components/Common/BaseButton"
import BaseIcon from "components/Common/BaseIcon"
import { Headers, emailGet, emailPost } from "helpers/email_api_helper"
import Loading from "components/Common/Loading"
import { useCustomToast } from "hooks/useCustomToast"
import { BaseModal, NoData } from "components/Common"
import { BLOCKED_ACCOUNT, UNBLOCKED_ACCOUNT } from "modules/mail/admin/url"
import SearchSelect from "components/SettingAdmin/SearchSelect"
import MainHeader from "pages/SettingMain/MainHeader"

import "./style.scss"
import Toolbar from "../../SettingMain/Toolbar"

const BlockedAccount = ({ routeConfig }) => {
  const { t } = useTranslation()
  const { successToast, errorToast } = useCustomToast()

  const searchOptions = [
    {
      label: t("common.name"),
      value: "name",
    },
    {
      label: "ID",
      value: "id",
    },
  ]

  const [data, setData] = useState()
  const [search, setSearch] = useState({
    keyword: "",
    searchType: searchOptions[0],
  })
  const [checkedIds, setCheckedIds] = useState([])
  const [isCheckedAll, setIsCheckedAll] = useState(false)
  const [open, setOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState("")
  const [invalid, setInvalid] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [refetch, setRefetch] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const params = {
          searchsrt: search.keyword,
        }
        const res = await emailGet(`${BLOCKED_ACCOUNT}/${search.searchType.value}`, params)
        setData(res)
        setCheckedIds([])
        setIsLoading(false)
      } catch (err) {
        console.log("error messenger", err)
      }
    }

    if (refetch) {
      fetchData()
      setRefetch(false)
    }
  }, [refetch])

  // checkbox
  function checkBox(value) {
    const isChecked = checkedIds.includes(value) || false
    const checkAll = value === "checkedAll"
    return (
      <Input
        aria-label="Checkbox for following text input"
        type="checkbox"
        checked={checkAll ? isCheckedAll : isChecked}
        onClick={() => {
          if (checkAll) handleSelectAll()
          else handleCheckboxChange(value)
        }}
        onChange={() => {
        }}
      />
    )
  }

  const heads = [
    { content: checkBox("checkedAll") },
    { content: t("mail.mail_fetching_id") },
    { content: t("mail.mailadmin_username") },
  ]

  const rows = useMemo(() => {
    if (data?.rows) {
      const rowsBlock = data?.rows.map((item) => ({
        columns: [
          { content: checkBox(item?.id) },
          { content: item?.id || "" },
          { content: item?.name || "-" },
        ],
      }))
      return rowsBlock
    }
    return []
  }, [data, checkedIds])

  // Block keywords
  const headerModal = () => {
    return <div>{t("mail.unblock")}</div>
  }

  const bodyModal = () => {
    return (
      <div>
        <FormGroup row>
          <Label htmlFor="taskname" className="col-form-label col-lg-3">
            {t("mail.new_password")}
          </Label>
          <Col lg="9" className="align-items-center">
            <InputGroup>
              <Input
                name="password"
                value={password}
                type={showPassword ? "text" : "password"}
                placeholder={t("mail.new_password")}
                onChange={(e) => {
                  const { value } = e.target
                  setPassword(value)
                  if (value !== "") {
                    setInvalid(false)
                  } else {
                    setInvalid(true)
                  }
                }}
                invalid={invalid}
                autoComplete={"off"}
              />
              <InputGroupText
                className="cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <i className="mdi mdi-eye-off-outline" />
                ) : (
                  <i className="mdi mdi-eye-outline" />
                )}
              </InputGroupText>
            </InputGroup>
            {invalid && <div className="invalid-feedback d-block">Password is not empty</div>}
          </Col>
        </FormGroup>
      </div>
    )
  }

  const footerModal = () => {
    return (
      <div className="action-form">
        <BaseButton
          color={"primary"}
          type="button"
          onClick={() => {
            if (password != "") {
              handleUnblock()
            } else {
              setInvalid(!invalid)
            }
          }}
        >
          {t("mail.unblock")}
        </BaseButton>
        <BaseButton color={"secondary"} type="button" onClick={onClose}>
          {t("mail.project_close_msg")}
        </BaseButton>
      </div>
    )
  }

  const onClose = () => {
    setOpen(!open)
    setPassword("")
    setInvalid(false)
  }

  // Check box
  const handleCheckboxChange = (value) => {
    const newChecked = checkedIds.includes(value)
      ? checkedIds.filter((v) => v !== value)
      : [...checkedIds, value]

    const isCheckedAll = newChecked.length === data?.rows.length
    setIsCheckedAll(isCheckedAll)
    setCheckedIds(newChecked)
  }
  const handleSelectAll = () => {
    setIsCheckedAll(!isCheckedAll)
    setCheckedIds(isCheckedAll ? [] : data?.rows.map((item) => item.id))
  }

  // Search when enter
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      setRefetch(true)
    }
  }

  const handleUnblock = async () => {
    try {
      const value = checkedIds.map((item) => item).join(",")
      const params = {
        userid: value,
        newpass: password,
      }
      const res = await emailPost(UNBLOCKED_ACCOUNT, params, Headers)
      successToast()
      setCheckedIds([])
      setRefetch(true)
      onClose()
    } catch (err) {
      console.log("error messenger", err)
      errorToast()
    }
  }

  return (
    <>
      <MainHeader currentTitleMenu={routeConfig?.keyTitle} />
      <Toolbar
        start={<SearchSelect search={search} setSearch={setSearch} options={searchOptions} onKeyDown={handleKeyPress}
                             onSubmit={() => setRefetch(true)} />}
        end={
          <>
            {checkedIds.length > 0 && (
              // <BaseButton className={"btn-success unblock-btn m-0"} onClick={onClose} style={{ height: "38px" }}>
              //   {t("mail.unblock")}
              // </BaseButton>
              <BaseButton
                color={`success`}
                className={"btn-success"}
                icon={`mdi mdi-lock-open-outline font-size-18`}
                iconClassName={`m-0`}
                onClick={onClose}
                style={{ width: "38px", height: "38px" }}
              />
            )}
            <BaseButton
              outline
              color="grey"
              className={"btn-outline-grey btn-action"}
              icon={`mdi mdi-refresh font-size-18`}
              iconClassName={`m-0`}
              loading={isLoading}
              onClick={() => setRefetch(true)}
              style={{ width: "38px", height: "38px" }}
            >
            </BaseButton>
          </>
        }
      />
      <div className={`w-100 h-100 overflow-hidden`}>
        <div className={`w-100 h-100 overflow-auto`}>
          <BaseTable heads={heads} rows={rows} />
          {isLoading ? (
            <div className="position-relative">
              <Loading />
            </div>
          ) : (
            data?.tot === 0 && <NoData />
          )}
        </div>
      </div>

      <BaseModal
        isOpen={open}
        toggle={onClose}
        renderHeader={headerModal}
        renderBody={bodyModal}
        renderFooter={footerModal}
        size="md"
      />
    </>
  )
}

export default BlockedAccount
