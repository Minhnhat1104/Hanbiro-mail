// @ts-nocheck
// React
import React, { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

// Third-party
import { Card, Col, Input, InputGroup, Row } from "reactstrap"

// Project
import { Title } from "components/SettingAdmin"
import BaseIcon from "components/Common/BaseIcon"
import BaseButton from "components/Common/BaseButton"
import BaseTable from "components/Common/BaseTable/index"
import { BaseModal, NoData, Pagination } from "components/Common"
import {
  Headers,
  emailDelete,
  emailGet,
  emailPost,
  formDataUrlencoded,
} from "helpers/email_api_helper"
import SearchInput from "components/SettingAdmin/SearchInput"
import Loading from "components/Common/Loading"
import { OrgSelectModal } from "components/Common/Org"
import { INTERNAL_USERS } from "modules/mail/admin/url"
import { useCustomToast } from "hooks/useCustomToast"
import { vailForwardMail } from "utils"
import useDevice from "hooks/useDevice"
import PaginationV2 from "components/Common/Pagination/PaginationV2"
import { tabOptions } from "components/Common/Org/GroupwareOrgModal"
import MainHeader from "pages/SettingMain/MainHeader"
import Toolbar from "../../SettingMain/Toolbar"
import Footer from "../../SettingMain/Footer"

const InternalUsers = ({ routeConfig }) => {
  const { t } = useTranslation()
  const { successToast, errorToast } = useCustomToast()
  const { isDesktop, isMobile } = useDevice()

  // State
  const [data, setData] = useState()
  const [checkedIds, setCheckedIds] = useState([])
  const [isCheckedAll, setIsCheckedAll] = useState(false)
  const [open, setOpen] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [emails, setEmails] = useState({ selected: {} })
  const pageSize = 15
  const initialFilter = {
    page: 1,
    keyword: "",
    sort: "1",
    limit: pageSize,
  }
  const [filter, setFilter] = useState(initialFilter)
  const [updateData, setUpdateData] = useState("")

  // State Loading
  const [isLoading, setIsLoading] = useState(false)
  const [refetch, setRefetch] = useState(true)

  // State Validation Email
  const [invalid, setInvalid] = useState(false)
  const valid = vailForwardMail(updateData)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const params = filter
        const res = await emailGet(`${INTERNAL_USERS}/list`, params)
        setData(res)
        setIsLoading(false)
      } catch (err) {
        // errorToast()
        console.log("error messenger", err)
      }
    }

    if (refetch) {
      fetchData()
      setRefetch(false)
    }
    setRefetch(false)
  }, [refetch])

  const toggleError = () => {
    setIsOpen(!isOpen)
  }

  // Search when enter
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      //   setFilter(prev => ({ ...prev, keyword: event.target.value }))
      setRefetch(true)
    }
  }

  const onChangePage = (page) => {
    setFilter((prev) => ({ ...prev, page: page }))
    setIsCheckedAll(false)
    setCheckedIds([])
    setRefetch(true)
  }

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
        onChange={() => {}}
      />
    )
  }

  const heads = [
    {
      content: checkBox("checkedAll"),
    },
    {
      content: t("common.hr_mail"),
    },
  ]
  const rows = useMemo(() => {
    if (data?.list) {
      const rowsData = data?.list.map((item) => ({
        columns: [
          {
            content: checkBox(item),
          },
          {
            content: item,
          },
        ],
      }))
      return rowsData
    }
    return []
  }, [data, checkedIds])

  const headerModal = () => {
    return <div>{t("common.alert_error_msg")}</div>
  }
  const bodyModal = () => {
    return <div>{t("common.alert_insert_query_error")}</div>
  }
  const footerModal = () => {
    return (
      <div className="action-form">
        <BaseButton
          color="grey"
          className={"btn-block btn-action"}
          type="button"
          onClick={toggleError}
        >
          {t("common.common_btn_close")}
        </BaseButton>
      </div>
    )
  }

  const handleCheckboxChange = (value) => {
    const newChecked = checkedIds.includes(value)
      ? checkedIds.filter((v) => v !== value)
      : [...checkedIds, value]

    const isCheckedAll = newChecked.length === data?.list.length
    setIsCheckedAll(isCheckedAll)
    setCheckedIds(newChecked)
  }
  const handleSelectAll = () => {
    setIsCheckedAll(!isCheckedAll)
    setCheckedIds(isCheckedAll ? [] : data?.list || [])
  }

  const handleUpdate = async () => {
    try {
      const params = { block: true }
      const value = updateData
        .split(",")
        .map((email) => encodeURIComponent(email))
        .join("%2C")
      const res = await emailPost(`${INTERNAL_USERS}/${value}`, params, Headers)
      if (res?.result === "true") {
        setEmails({ selected: {} })
        setUpdateData("")
        successToast()
        setRefetch(true)
        setInvalid(false)
      } else {
        toggleError()
      }
    } catch (err) {
      errorToast()
      console.log("error messenger", err)
    }
  }
  const handleDelete = async () => {
    try {
      const value = checkedIds.map((email) => encodeURIComponent(email)).join("%2C")
      const res = await emailDelete(`${INTERNAL_USERS}/${value}`)

      setCheckedIds([])
      successToast()
      setRefetch(true)
    } catch (err) {
      errorToast()
      console.log("error messenger", err)
    }
  }

  const rightHeader = useMemo(() => {
    return (
      <div className="d-flex justify-content-end align-items-center gap-2">
        <InputGroup className="add-box">
          <Input
            type="text"
            value={updateData}
            className={`han-text-primary han-bg-color-soft-grey border-0`}
            placeholder="ex: example1@email.com, example2@email.com"
            maxLength="100"
            onChange={(e) => setUpdateData(e.target.value)}
            invalid={!valid?.status && invalid}
          />
          <BaseButton
            color="primary"
            className="input-group-text text-white cursor-pointer"
            icon={`mdi mdi-lan font-size-18`}
            iconClassName={`m-0`}
            onClick={() => setOpen(!open)}
            style={{ width: "38px", height: "38px" }}
          />
        </InputGroup>
        {updateData && (
          <BaseButton
            color={"primary"}
            icon={`mdi mdi-content-save-outline font-size-18`}
            iconClassName={`m-0`}
            onClick={() => {
              setInvalid(true)
              if (valid?.status) {
                handleUpdate()
              }
            }}
            style={{ width: "38px", height: "38px" }}
          />
        )}
      </div>
    )
  }, [updateData, valid, invalid, open])

  return (
    <>
      <MainHeader currentTitleMenu={routeConfig?.keyTitle} rightHeader={rightHeader} />
      <Toolbar
        start={
          <SearchInput
            value={filter?.keyword}
            placeholder={t("mail.common_search_input_msg")}
            onChange={(e) => {
              setFilter((prev) => ({ ...prev, keyword: e.target.value }))
            }}
            onKeyDown={handleKeyPress}
          />
        }
        end={
          <>
            {checkedIds.length > 0 && (
              <BaseButton
                color={"danger"}
                className={`btn-danger`}
                icon={"mdi mdi-trash-can-outline font-size-18"}
                iconClassName={`m-0`}
                onClick={handleDelete}
                style={{ width: "38px", height: "38px" }}
              />
            )}

            <BaseButton
              outline
              color="grey"
              className={"btn-outline-grey btn-action"}
              icon={`mdi mdi-refresh font-size-18`}
              iconClassName={`m-0`}
              onClick={() => {
                setFilter(initialFilter)
                setRefetch(true)
              }}
              loading={isLoading}
              style={{ width: "38px", height: "38px" }}
            />
          </>
        }
      />
      <div className={`w-100 h-100 overflow-hidden`}>
        <div className="w-100 h-100 overflow-auto">
          <BaseTable heads={heads} rows={rows} />
          {isLoading ? (
            <div className="position-relative">
              <Loading />
            </div>
          ) : (
            data?.list.length === 0 && <NoData />
          )}
        </div>
      </div>

      <Footer
        footerContent={
          data &&
          data?.tot > 0 && (
            <PaginationV2
              pageCount={data?.tot}
              pageSize={pageSize}
              pageIndex={filter?.page}
              onChangePage={onChangePage}
              hideBorderTop={true}
              hideRowPerPage={true}
            />
          )
        }
      />

      {open && (
        <OrgSelectModal
          title={"Organization"}
          setOpen={setOpen}
          emails={emails}
          open={open}
          orgTabOption={tabOptions}
          setEmails={setEmails}
          onSave={(emails) => {
            const dataArray = Object.values(emails?.selected)

            // convert to object {ids: [], groups: []}
            const convertedObject = dataArray.map((item) => item.email).join(",")

            // Update data
            setUpdateData(convertedObject)
          }}
          handleClose={() => setOpen(!open)}
        />
      )}
      <BaseModal
        isOpen={isOpen}
        toggle={toggleError}
        centered
        renderHeader={headerModal}
        renderBody={bodyModal}
        renderFooter={footerModal}
        size="sm"
      />
    </>
  )
}

export default InternalUsers
