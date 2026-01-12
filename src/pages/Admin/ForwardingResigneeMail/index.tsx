// @ts-nocheck
// React
import React, { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import moment from "moment"

// Third-party
import { Card, Input } from "reactstrap"

// Project
import { Title } from "components/SettingAdmin"
import BaseIcon from "components/Common/BaseIcon"
import BaseButton from "components/Common/BaseButton"
import Pagination from "components/Common/Pagination"
import BaseTable from "components/Common/BaseTable"
import { Headers, emailDelete, emailGet, emailPost } from "helpers/email_api_helper"
import Loading from "components/Common/Loading"
import AddForm from "./AddForm"
import { useCustomToast } from "hooks/useCustomToast"
import { ModalConfirm } from "components/Common/Modal"
import SearchInput from "components/SettingAdmin/SearchInput"
import { FORWARDING_RESIGNEE_MAIL } from "modules/mail/admin/url"
import "react-datepicker/dist/react-datepicker.css"
import "./style.css"
import { NoData } from "components/Common"
import PaginationV2 from "components/Common/Pagination/PaginationV2"
import MainHeader from "pages/SettingMain/MainHeader"
import Toolbar from "../../SettingMain/Toolbar"
import Footer from "../../SettingMain/Footer"

const ForwardingResigneeMail = (props) => {
  const { routeConfig } = props
  const { t } = useTranslation()
  const { successToast, errorToast } = useCustomToast()
  const [data, setData] = useState()
  const [itemUpdate, setItemUpdate] = useState()
  const [isOpenForm, setIsOpenForm] = useState(false)
  const [openConfirm, setOpenConfirm] = useState(false)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const pageSize = 20
  // State  checkbox
  const [checkedIds, setCheckedIds] = useState([])
  const [isCheckedAll, setIsCheckedAll] = useState(false)
  // State Loading
  const [isLoading, setIsLoading] = useState(false)
  const [refetch, setRefetch] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const res = await emailGet(
          `${FORWARDING_RESIGNEE_MAIL}/list/${page}/${pageSize}${search && "/" + search}`,
        )
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
  }, [refetch])

  const onChangePage = (page) => {
    setPage(page)
    setIsCheckedAll(false)
    setCheckedIds([])
    setRefetch(true)
  }

  const statusType = (value) => {
    let result = ""
    switch (value) {
      case "n":
        result = t("mail.mail_retired_forward_new")
        break
      case "s":
        result = t("mail.mail_retired_forward_start")
        break
      case "e":
        result = t("mail.mail_retired_forward_expire")
        break
    }
    return result
  }
  const heads = [
    {
      content: checkBox("checkedAll"),
    },
    {
      content: t("mail.mail_retired_forward_retired_id"),
    },
    {
      content: t("mail.mail_retired_forward_retired_name"),
    },
    {
      content: t("mail.mail_retired_forward_forward_email_address"),
    },
    {
      content: t("mail.mail_ical_start_date"),
    },
    {
      content: t("mail.mail_ical_end_date"),
    },
    {
      content: t("mail.admin_mail_secure_approve_state"),
    },
    {
      content: t("common.asset_action"),
    },
  ]

  const rows = useMemo(() => {
    if (data?.rows) {
      const rowsData = data?.rows.map((item) => ({
        columns: [
          {
            content: checkBox(item?.id),
          },
          {
            content: item?.id,
          },
          {
            content: item?.name,
          },
          {
            content: item?.fmails.map((item) => item).join(", "),
          },
          {
            content: item?.start,
          },
          {
            content: item?.end,
          },
          {
            content: statusType(item?.status),
          },
          {
            content: (
              <BaseIcon
                className={"mdi mdi-circle-edit-outline font-size-14 ad-fore-btn-icon"}
                onClick={() => {
                  setItemUpdate(item?.id)
                  setIsOpenForm(!isOpenForm)
                }}
              />
            ),
          },
        ],
      }))
      return rowsData
    }
    return []
  }, [data, checkedIds])

  // Check box
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
    setCheckedIds(isCheckedAll ? [] : data?.rows.map((item) => item?.id))
  }

  // Search when enter
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      setSearch(event.target.value)
      setPage(1)
      setRefetch(true)
    }
  }

  // Update Forwarding
  const handleUpdate = async (quitid, emails, startDate, endDate, today, format) => {
    try {
      const params = {
        qid: quitid,
        fmails: emails,
        start: moment(startDate).format(format),
        end: moment(endDate).format(format),
        minDate: moment(today).format("MM/DD/YYYY"),
        strFormat: format,
      }
      const res = await emailPost(FORWARDING_RESIGNEE_MAIL, params, Headers)
      successToast()
      setRefetch(true)
      setItemUpdate("")
      setIsOpenForm(!isOpenForm)
    } catch (err) {
      errorToast()
      console.log("error messenger", err)
    }
  }

  // Delete Forwarding
  const handleDelete = async () => {
    try {
      const value = checkedIds.join(",")
      const params = {
        qids: value,
      }
      const res = await emailDelete(FORWARDING_RESIGNEE_MAIL, params, Headers)
      successToast()
      setRefetch(true)
      setCheckedIds([])
      setOpenConfirm(!openConfirm)
    } catch (err) {
      errorToast()
      console.log("error messenger", err)
    }
  }

  return (
    <>
      <MainHeader currentTitleMenu={routeConfig?.keyTitle} />
      <Toolbar
        start={<SearchInput onKeyDown={handleKeyPress} />}
        end={
          <>
            <BaseButton
              color={"primary"}
              className={`m-0 border-0`}
              icon={"mdi mdi-plus font-size-18"}
              iconClassName={`m-0`}
              onClick={() => setIsOpenForm(!isOpenForm)}
              style={{ width: "38px", height: "38px" }}
            />

            {checkedIds.length > 0 && (
              <BaseButton
                color={"danger"}
                className={`m-0 border-0`}
                icon={"mdi mdi-trash-can-outline font-size-18"}
                iconClassName={`m-0`}
                onClick={() => setOpenConfirm(!openConfirm)}
                style={{ width: "38px", height: "38px" }}
              />
            )}

            <BaseButton
              color="grey"
              className={"btn-action m-0"}
              icon={"mdi mdi-refresh font-size-18"}
              iconClassName={`m-0`}
              loading={isLoading}
              onClick={() => setRefetch(true)}
              style={{ width: "38px", height: "38px" }}
            />
          </>
        }
      />
      <div className={`w-100 h-100 overflow-hidden`}>
        <div className="w-100 h-100 overflow-auto">
          <BaseTable heads={heads} rows={rows} />
          {data?.tot === 0 && <NoData />}
          {isLoading && <Loading />}
        </div>
      </div>

      <Footer
        footerContent={
          data &&
          data?.tot > 0 && (
            <PaginationV2
              pageCount={data?.tot}
              pageSize={pageSize}
              pageIndex={page}
              onChangePage={onChangePage}
              hideBorderTop={true}
              hideRowPerPage={true}
            />
          )
        }
      />

      {/* Form Add */}
      {isOpenForm && (
        <AddForm
          isOpen={isOpenForm}
          toggleForm={() => {
            setIsOpenForm(!isOpenForm)
            setItemUpdate("")
          }}
          itemUpdate={itemUpdate}
          handleUpdate={handleUpdate}
        />
      )}

      {/* Confirm Delete */}
      <ModalConfirm
        isOpen={openConfirm}
        toggle={() => {
          setOpenConfirm(!openConfirm)
        }}
        onClick={handleDelete}
        keyHeader={"mail.mail_set_mailbox_delete"}
        keyBody={"mail.approval_user_msg_confirmDelete"}
      />
    </>
  )
}

export default ForwardingResigneeMail
