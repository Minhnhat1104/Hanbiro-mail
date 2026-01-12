// @ts-nocheck
// React
import React, { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

// Third-party
import { Card, Input } from "reactstrap"

// Project
import { Title } from "components/SettingAdmin"
import { BaseButton, BaseIcon, BaseModal, NoData, Pagination } from "components/Common"
import BaseTable from "components/Common/BaseTable"
import { useCustomToast } from "hooks/useCustomToast"
import AddForm from "./AddForm"
import { Headers, emailDelete, emailGet, emailPost } from "helpers/email_api_helper"
import Loading from "components/Common/Loading"
import { ModalConfirm } from "components/Common/Modal"
import SearchSelect from "components/SettingAdmin/SearchSelect"
import { APPROVAL_POLICY } from "modules/mail/admin/url"
import PaginationV2 from "components/Common/Pagination/PaginationV2"
import useDevice from "hooks/useDevice"
import MainHeader from "pages/SettingMain/MainHeader"

import "./style.scss"
import Toolbar from "../../SettingMain/Toolbar"
import Footer from "../../SettingMain/Footer"

const ApprovalPolicy = ({ routeConfig }) => {
  const { t } = useTranslation()
  const { successToast, errorToast } = useCustomToast()
  const { isMobile } = useDevice()

  const searchOptions = [
    {
      label: t("mail.mail_admin_all"),
      value: "all",
    },
    {
      label: t("mail.mail_admin_admin_id"),
      value: "adminid",
    },
    {
      label: t("mail.mail_admin_admin_name"),
      value: "adminname",
    },
    {
      label: t("mail.mail_secure_User_ID"),
      value: "userid",
    },
    {
      label: t("mail.mail_admin_user_name"),
      value: "username",
    },
  ]

  const [data, setData] = useState()
  const [itemUpdate, setItemUpdate] = useState({})
  const [alert, setAlert] = useState("")
  const [openConfirm, setOpenConfirm] = useState(false)
  const [page, setPage] = useState(1)
  const pageSize = 20

  // State checkbox
  const [checkedIds, setCheckedIds] = useState([])
  const [isCheckedAll, setIsCheckedAll] = useState(false)
  const [search, setSearch] = useState({
    keyword: "",
    searchType: searchOptions[0],
  })

  // State Loading
  const [isLoading, setIsLoading] = useState(false)
  const [refetch, setRefetch] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const res = await emailGet(
          `${APPROVAL_POLICY}/${page}/${pageSize}/timestamp/desc${
            search ? "/" + search.searchType.value + "/" + search.keyword : ""
          }`,
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

  const displayList = (users) => {
    if (users && users.length > 0) {
      if (users.length == 1) {
        return users[0].name
      } else {
        return users[0].name + " and " + (users.length - 1) + " others"
      }
    } else {
      return ""
    }
  }

  const heads = [
    { content: checkBox("checkedAll") },
    { content: t("mail.mail_admin_name") },
    { content: t("mail.date") },
    { content: t("mail.mail_mode") },
    { content: t("mail.mail_admin_mid_permitter") },
    { content: t("mail.mail_final_permitter") },
    { content: t("mail.mail_admin_recipient_user") },
    { content: "" },
  ]

  const rows = useMemo(() => {
    if (data?.rows) {
      const rowsData = data?.rows.map((item) => ({
        class: "align-middle",
        columns: [
          { content: checkBox(item?.id) },
          { content: item?.secuname },
          { content: item?.regdate },
          { content: item?.secutype },
          { content: displayList(item?.mseculist) },
          { content: item?.name },
          {
            content: (
              <div className="action-button flex-wrap">
                {item?.users.map((user, index) => (
                  <BaseButton key={index} className={"btn btn-soft-secondary my-1"} type="button">
                    {user?.name}
                  </BaseButton>
                ))}
              </div>
            ),
          },
          {
            content: (
              <div className="action-button">
                <BaseIcon
                  className="mx-2"
                  icon={"mdi mdi-pencil-box-outline font-size-18"}
                  onClick={() => {
                    setItemUpdate(item)
                    toggleModal()
                  }}
                ></BaseIcon>
                <BaseIcon
                  className="mx-2"
                  icon={"mdi mdi-trash-can-outline font-size-18"}
                  onClick={() => {
                    setItemUpdate(item)
                    setOpenConfirm(!openConfirm)
                  }}
                ></BaseIcon>
              </div>
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

  const onChangePage = (page) => {
    setPage(page)
    setIsCheckedAll(false)
    setCheckedIds([])
    setRefetch(true)
  }

  // Search when enter
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      setRefetch(true)
    }
  }

  const [togModal, setTogModal] = useState(false)

  function toggleModal() {
    setTogModal(!togModal)
    removeBodyCss()
  }

  function removeBodyCss() {
    document.body.classList.add("no_padding")
  }

  // Update Approval Policy
  const handleUpdate = async (data, userid) => {
    try {
      const { ids, mmanagerids, mpredecessorids, fdomain, fftype, ffname, fkeyword } = data
      const params = {
        ...data,
        ids: ids.join(","),
        mmanagerids: mmanagerids.join(","),
        mpredecessorids: mpredecessorids.join(","),
        fdomain: fdomain.join(","),
        fftype: fftype.join(","),
        ffname: ffname.join(","),
        fkeyword: fkeyword.join(","),
        ismodify: itemUpdate?.id ? true : undefined,
      }

      const res = await emailPost(`${APPROVAL_POLICY}/${userid}`, params, Headers)
      if (res?.success) {
        successToast()
        toggleModal()
        setItemUpdate({})
        setRefetch(true)
      } else {
        setAlert(res?.msg)
      }
    } catch (err) {
      console.log("error messenger", err)
    }
  }

  // Delete Approval Policy
  const handleDelete = async (data) => {
    try {
      const value = checkedIds.join(",")
      const params = {
        adminid: "all",
      }
      const res = await emailDelete(`${APPROVAL_POLICY}/${data ? data : value}`)
      successToast()
      setRefetch(true)
      setCheckedIds([])
      setIsCheckedAll(false)
      setItemUpdate({})
      setOpenConfirm(!openConfirm)
    } catch (err) {
      console.log("error messenger", err)
      errorToast()
    }
  }

  const headerAlert = () => {
    return <span>{t("common.notice_header_failure")}</span>
  }
  const bodyAlert = () => {
    return <span>{alert}</span>
  }
  const footerAlert = () => {
    return (
      <span className="write-form">
        <BaseButton icon={"bx bx-x"} iconClassName="font-size-16 me-2" onClick={() => setAlert("")}>
          {t("common.common_close_msg")}
        </BaseButton>
      </span>
    )
  }

  return (
    <>
      <MainHeader currentTitleMenu={routeConfig?.keyTitle} />
      <Toolbar
        start={
          <SearchSelect
            search={search}
            setSearch={setSearch}
            options={searchOptions}
            onKeyDown={handleKeyPress}
            onSubmit={() => setRefetch(true)}
            inputGroupClassName={isMobile ? "d-block" : ""}
          />
        }
        end={
          <>
            <BaseButton
              color={`primary`}
              className={`m-0 border-0`}
              icon={"mdi mdi-plus font-size-18"}
              iconClassName={`m-0`}
              onClick={toggleModal}
              style={{ width: "38px", height: "38px" }}
            />
            {checkedIds.length > 0 && (
              <BaseButton
                color={`danger`}
                className={`m-0 border-0`}
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
              color={`grey`}
              className={`btn-outline-grey btn-action m-0`}
              icon={`mdi mdi-refresh font-size-18`}
              onClick={() => setRefetch(!refetch)}
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
            data?.total === 0 && <NoData />
          )}
        </div>
      </div>

      <Footer
        footerContent={
          data?.total > 0 && (
            <PaginationV2
              pageCount={data?.total}
              pageSize={20}
              pageIndex={1}
              onChangePage={onChangePage}
              hideBorderTop={true}
              hideRowPerPage={true}
            />
          )
        }
      />

      {togModal && (
        <AddForm
          isOpen={togModal}
          toggleModal={() => {
            setItemUpdate({})
            toggleModal()
          }}
          itemUpdate={itemUpdate}
          handleUpdate={handleUpdate}
        />
      )}
      <BaseModal
        isOpen={alert != ""}
        toggle={() => setAlert("")}
        renderHeader={headerAlert}
        renderBody={bodyAlert}
        renderFooter={footerAlert}
        size={"xs"}
      />
      {/* Confirm Delete */}
      <ModalConfirm
        isOpen={openConfirm}
        toggle={() => {
          setOpenConfirm(!openConfirm)
          setItemUpdate({})
        }}
        onClick={() => handleDelete(itemUpdate?.id)}
        keyHeader={"mail.mail_set_mailbox_delete"}
        keyBody={"mail.approval_user_msg_confirmDelete"}
      />
    </>
  )
}

export default ApprovalPolicy
