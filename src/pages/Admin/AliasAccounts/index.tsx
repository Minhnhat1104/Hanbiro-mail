// @ts-nocheck
// React
import React, { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { RoutePaths } from "routes"

// Third-party
import { Card, Input } from "reactstrap"

// Project
import { Title } from "components/SettingAdmin"
import BaseButton from "components/Common/BaseButton"
import BaseTable from "components/Common/BaseTable"
import BaseIcon from "components/Common/BaseIcon"
import { NoData, Pagination } from "components/Common"
import Loading from "components/Common/Loading"
import { Headers, emailPost, formDataUrlencoded } from "helpers/email_api_helper"
import { useCustomToast } from "hooks/useCustomToast"
import { ModalConfirm } from "components/Common/Modal"
import { ALIAS_ACCOUNT, ALIAS_ACCOUNT_DELETE } from "modules/mail/admin/url"
import SearchInput from "components/SettingAdmin/SearchInput"
import useDevice from "hooks/useDevice"
import PaginationV2 from "components/Common/Pagination/PaginationV2"
import MainHeader from "pages/SettingMain/MainHeader"
import Footer from "pages/SettingMain/Footer"
import Toolbar from "pages/SettingMain/Toolbar"

const AliasAccounts = (props) => {
  const { routeConfig } = props
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { successToast, errorToast } = useCustomToast()
  const { isMobile } = useDevice()

  const [data, setData] = useState()
  const [showMoreRows, setShowMoreRows] = useState([])
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")

  // State Loading
  const [isLoading, setIsLoading] = useState(false)
  const [refetch, setRefetch] = useState(true)
  const [checkedIds, setCheckedIds] = useState([])
  const [isCheckedAll, setIsCheckedAll] = useState(false)
  const [itemDelete, setItemDelete] = useState("")
  const [openConfirm, setOpenConfirm] = useState(false)

  // get data table
  const fetchData = async () => {
    try {
      setIsLoading(true)
      const params = {
        page: page,
        limit: "",
        keyword: search,
      }
      const res = await emailPost(`ngw/admin/${ALIAS_ACCOUNT}`, formDataUrlencoded(params), Headers)
      if (res?.success) {
        setData(res)
      }
      setIsLoading(false)
    } catch (err) {
      errorToast()
      console.log("error messenger", err)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (refetch) {
      fetchData()
      setRefetch(false)
    }
  }, [refetch])

  useEffect(() => {
    fetchData()
  }, [page])

  const heads = [
    { content: checkBox("checkedAll") },
    { content: t("mail.common_aliasaccount") },
    { content: t("mail.mailadmin_popaccount") },
    { content: "" },
  ]

  const rows = useMemo(() => {
    if (data?.rows?.email_list) {
      const rowsData = data?.rows?.email_list.map((item, index) => ({
        class: "align-middle",
        columns: [
          { content: item?.alias_type == "1" ? checkBox(item?.alias_email) : "" },
          { content: `${item?.alias_email} (${item?.alias_name})` },
          {
            content: (
              <div className={`d-flex flex-column gap-1`}>
                {item?.real_email.map((email, idx) => (
                  <span
                    key={idx}
                    style={{ display: showMoreRows[index] || idx < 3 ? "block" : "none" }}
                  >
                    {email}
                  </span>
                ))}
                {item?.real_email.length > 3 && (
                  <span
                    className="han-color-primary han-fw-medium"
                    type="button"
                    onClick={() => toggleShowMore(index)}
                  >
                    {showMoreRows[index]
                      ? t("common.common_see_less")
                      : t("common.common_see_more")}
                  </span>
                )}
              </div>
            ),
          },
          {
            content:
              item?.alias_type == "1" ? (
                <div className="action-button">
                  <BaseIcon
                    className={"color-green mx-2"}
                    icon={"mdi mdi-pencil-box-outline font-size-18"}
                    onClick={() => {
                      navigate(`/mail/admin/alias/${item?.alias_email}`)
                    }}
                  />
                  <BaseIcon
                    className={"color-red mx-2"}
                    icon={"mdi mdi-trash-can-outline font-size-18"}
                    onClick={() => {
                      setItemDelete(item?.alias_email)
                      setOpenConfirm(!openConfirm)
                    }}
                  />
                </div>
              ) : (
                ""
              ),
          },
        ],
      }))
      return rowsData
    }
    return []
  }, [data, showMoreRows, checkedIds])

  // Save Key Row for checked View more or Hide
  const toggleShowMore = (index) => {
    const newShowMoreRows = [...showMoreRows]
    newShowMoreRows[index] = !newShowMoreRows[index]
    setShowMoreRows(newShowMoreRows)
  }

  // Check box UI
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

  // Check box function
  const handleSelectAll = () => {
    setIsCheckedAll(!isCheckedAll)
    // convert array alias_type 1 and array only alias_email
    setCheckedIds(
      isCheckedAll
        ? []
        : data?.rows?.email_list
          .filter((item) => item?.alias_type === "1")
          .map((item) => item?.alias_email),
    )
  }

  const handleCheckboxChange = (value) => {
    const newChecked = checkedIds.includes(value)
      ? checkedIds.filter((v) => v !== value)
      : [...checkedIds, value]

    const isCheckedAll =
      newChecked.length === data?.rows?.email_list.filter((item) => item.alias_type === "1").length

    setIsCheckedAll(isCheckedAll)
    setCheckedIds(newChecked)
  }

  const onChangePage = (page) => {
    setPage(page)
    setIsCheckedAll(false)
    setCheckedIds([])
  }

  // Search when enter
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      if (page === 1) {
        setRefetch(true)
      } else {
        setPage(1)
      }
    }
  }

  // Delete Alias Account
  const handleDelete = async () => {
    try {
      const params = itemDelete
        ? { "arglist[0][alias]": itemDelete }
        : checkedIds.reduce((acc, email, index) => {
          const key = `arglist[${index}][alias]`
          acc[key] = email
          return acc
        }, {})

      const res = await emailPost(`/ngw/admin/${ALIAS_ACCOUNT_DELETE}`, params, Headers)
      successToast()
      setOpenConfirm(!openConfirm)
      setCheckedIds([])
      setItemDelete("")
      setIsCheckedAll(false)
      setRefetch(true)
    } catch (err) {
      errorToast()
      console.log("error messenger", err)
    }
  }

  return (
    <>
      <MainHeader currentTitleMenu={routeConfig?.keyTitle} />
      <Toolbar
        start={
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyPress}
          />
        }
        end={
          <>
            <BaseButton
              color={`primary`}
              className={`border-0`}
              icon={"mdi mdi-plus font-size-18"}
              iconClassName={`m-0`}
              onClick={() => navigate(RoutePaths.AdminCreateAliasAccount)}
              style={{ width: "38px", height: "38px" }}
            />
            {checkedIds.length >= 1 && (
              <BaseButton
                color={"danger"}
                className={`border-0`}
                icon={"mdi mdi-trash-can-outline font-size-18"}
                iconClassName={`m-0`}
                onClick={() => {
                  setOpenConfirm(!openConfirm)
                }}
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
            />
          </>
        }
      />

      <div className={`w-100 h-100 overflow-hidden`}>
        {/* table data */}
        <div className="w-100 h-100 overflow-auto position-relative" style={{ minHeight: "200px" }}>
          <BaseTable heads={heads} rows={rows} tableClass="mb-0" />
          {data?.page?.total_num == 0 && <NoData />}
          {isLoading && <Loading className="p-0" />}
        </div>
      </div>

      <Footer
        footerContent={
          data?.page?.total_num > 0 && (
            <PaginationV2
              pageCount={data?.page?.total_num}
              pageSize={20}
              pageIndex={page}
              onChangePage={onChangePage}
              hideBorderTop={true}
              hideRowPerPage={true}
            />
          )
        }
      />

      <ModalConfirm
        isOpen={openConfirm}
        toggle={() => {
          setOpenConfirm(!openConfirm)
        }}
        onClick={() => {
          handleDelete()
        }}
        keyHeader={"common.alert_info_msg"}
        keyBody={"mail.mail_menu_trashdel"}
      />
    </>
  )
}

export default AliasAccounts
