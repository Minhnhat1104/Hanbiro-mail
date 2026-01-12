// @ts-nocheck
// React
import React, { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
// Third-party
import classNames from "classnames"
import { Card, Input } from "reactstrap"

// Project
import { Title } from "components/SettingAdmin"
import { BaseButton, BaseIcon, BaseModal, NoData, Pagination } from "components/Common"
import BaseTable from "components/Common/BaseTable"
import {
  Headers,
  emailDelete,
  emailGet,
  emailPost,
  emailPut,
  formDataUrlencoded,
} from "helpers/email_api_helper"
import AddForm from "./AddForm"
import Loading from "components/Common/Loading"
import { useCustomToast } from "hooks/useCustomToast"
import SearchInput from "components/SettingAdmin/SearchInput"
import { ModalConfirm } from "components/Common/Modal"
import { PRIOR_APPROVAL } from "modules/mail/admin/url"
import "../../Settings/SpamSettings/style.scss"
import { useParams } from "react-router-dom"
import useDevice from "hooks/useDevice"
import PaginationV2 from "components/Common/Pagination/PaginationV2"
import MainHeader from "pages/SettingMain/MainHeader"
import Toolbar from "../../SettingMain/Toolbar"
import Footer from "../../SettingMain/Footer"
import "./style.css"
import { isEmpty, cloneDeep } from "lodash"

const PriorApproval = ({ routeConfig }) => {
  const { menu } = useParams()
  const { t } = useTranslation()
  const { successToast, errorToast } = useCustomToast()
  const { isDesktop } = useDevice()

  const [data, setData] = useState()
  const [togModal, setTogModal] = useState(false)
  const [alert, setAlert] = useState("")

  function removeBodyCss() {
    document.body.classList.add("no_padding")
  }

  function togtoggleModal() {
    setTogModal(!togModal)
    removeBodyCss()
  }

  // State  checkbox
  const [checkedIds, setCheckedIds] = useState([])
  const [isCheckedAll, setIsCheckedAll] = useState(false)

  const [itemUpdate, setItemUpdate] = useState({})
  const [openConfirm, setOpenConfirm] = useState(false)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [expandList, setExpandList] = useState({})
  const pageSize = 20

  // State Loading
  const [isLoading, setIsLoading] = useState(false)
  const [refetch, setRefetch] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        let params = {}
        if (menu !== "Approval") {
          params = { adminid: `all${search && "/" + search}` }
        }
        const queryParameters = formDataUrlencoded(params)
        const res = await emailGet(`${PRIOR_APPROVAL}/${page}/${pageSize}?${queryParameters}`)
        if (res?.success) {
          setData(res)
        } else {
          setAlert(res?.msg)
        }

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

  const maxItems = 40

  const onClickExpand = function (row) {
    let newData = cloneDeep(expandList)
    if (newData.hasOwnProperty(row.uuid)) {
      newData[row.uuid] = !newData[row.uuid]
    } else {
      newData[row.uuid] = true
    }
    setExpandList(newData)
  }

  const getExpandIcon = function (row) {
    if (row.userid != "") {
      var list = cloneDeep(row.userid)
      list = list.split(",")
      if (list.length > maxItems) {
        return true
      }
    }
    return false
  }

  const getListSender = function (row) {
    if (row.userid == "") {
      return ["All"]
    } else {
      var list = cloneDeep(row.userid)
      list = list.split(",")
      var max = maxItems
      if (list.length > maxItems) {
        if (expandList[row.uuid]) {
          max = list.length
        }
        var result = []
        for (var i = 0; i < max; i++) {
          var userId = list[i]
          result.push(userId)
        }
        list = result
      }
      return list
    }
  }

  function renderAttachment(isFile) {
    return (
      <div className="d-flex justify-content-center">
        <div
          className={classNames({
            "ad-prior-approval-un-active": isFile !== "y",
            "ad-prior-approval-active": isFile === "y",
          })}
        />
      </div>
    )
  }

  // isDesktop
  const heads = useMemo(() => {
    let columns = [
      { content: checkBox("checkedAll") },
      { content: t("mail.mail_registration_date") },
      { content: t("mail.mail_pre_approval_name") },
      { content: t("mail.mail_permit_scope") },
      { content: t("mail.mail_sending_address_sending_domain") },
      { content: t("mail.mail_mail_size") },
      { content: t("mail.mail_secure_file_msg") },
      { content: t("admin.manager_action") },
    ]
    if (!isDesktop) {
      columns.splice(5, 1) // Size
      columns.splice(5, 1) // Attachment
    }
    return columns
  }, [isDesktop])

  const formatItemData = (item, checkedIds, expandList, isDesktop) => {
    let columns = [
      { content: checkBox(item?.uuid) },
      { content: item?.regdate },
      { content: item?.name },
      {
        content: (
          <div className="icon-action">
            {getListSender(item).map((userId, idx) => {
              return (
                <div
                  key={idx}
                  className={`rounded h-auto m-1 py-1 px-2 gap-2 han-bg-color-primary-lighter han-color-primary-dark`}
                  style={{ minHeight: "28px", display: "inline-block" }}
                >
                  {userId}
                </div>
              )
            })}
            {getExpandIcon(item) && (
              <BaseIcon
                icon={classNames("mdi font-size-18", {
                  "mdi-chevron-double-up": expandList?.[item.uuid] === true,
                  "mdi-chevron-double-down": expandList?.[item.uuid] !== true,
                })}
                onClick={() => {
                  onClickExpand(item)
                }}
              />
            )}
          </div>
        ),
      },
      { content: item?.toaddr },
      { content: item?.msize + "M" },
      { content: renderAttachment(item?.isfile) },
      {
        content: (
          <div className="icon-action">
            <BaseIcon
              icon={"mdi mdi-pencil-box-outline font-size-18 me-2"}
              onClick={() => {
                setItemUpdate(item)
                togtoggleModal()
              }}
            />
            <BaseIcon
              icon={"mdi mdi-trash-can-outline font-size-18"}
              onClick={() => {
                setItemUpdate(item)
                setOpenConfirm(!openConfirm)
              }}
            />
          </div>
        ),
      },
    ]

    if (!isDesktop) {
      columns.splice(5, 1) // Size
      columns.splice(5, 1) // Attachment
    }

    let obj = {
      class: "align-middle",
      columns: columns,
    }

    return obj
  }

  const rows = useMemo(() => {
    if (data?.rows) {
      const rowsData = data?.rows.map((item) =>
        formatItemData(item, checkedIds, expandList, isDesktop),
      )
      return rowsData
    }
    return []
  }, [data, checkedIds, expandList, isDesktop])

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
    setCheckedIds(isCheckedAll ? [] : data?.rows.map((item) => item?.uuid) || [])
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
      setSearch(event.target.value)
      setRefetch(true)
    }
  }

  // Add Prior Approval
  const handleAdd = async (data, userid) => {
    try {
      const { name, to, isfile, ftype, fname, msize } = data
      const params = {
        name: name,
        to: to,
        userid: !isEmpty(userid) ? userid.map((v) => v.value).join(",") : "",
        isfile: isfile,
        ftype: ftype.join(","),
        fname: fname,
        msize: msize,
        // adminid: "all",
      }
      if (
        window.location.pathname.includes("admin") &&
        !window.location.pathname.includes("list")
      ) {
        params.adminid = "all"
      }
      const res = await emailPost(PRIOR_APPROVAL, formDataUrlencoded(params), Headers)
      if (res.success) {
        successToast()
      } else {
        errorToast(res?.msg)
      }
      setRefetch(true)
      togtoggleModal()
    } catch (err) {
      errorToast()
    }
  }
  // Update Prior Approval
  const handleUpdate = async (data, userid) => {
    try {
      const { name, to, isfile, ftype, fname, msize } = data
      const params = {
        uuid: itemUpdate?.uuid,
        name: name,
        to: to,
        userid: !isEmpty(userid) ? userid.map((v) => v.value).join(",") : "",
        isfile: isfile,
        ftype: ftype.length > 0 ? ftype.join(",") : "",
        fname: fname,
        msize: msize,
        adminid: "all",
      }
      const filter = { adminid: "all", ...params }
      const res = await emailPut(`${PRIOR_APPROVAL}/${itemUpdate?.uuid}`, filter, Headers)
      successToast()
      setRefetch(true)
      togtoggleModal()
      setItemUpdate({})
    } catch (err) {
      console.log("error messenger", err)
      errorToast()
    }
  }

  // Delete Prior Approval
  const handleDelete = async (data) => {
    try {
      const value = checkedIds.join(",")
      const params = {
        adminid: "all",
      }
      const res = await emailDelete(`${PRIOR_APPROVAL}/${data ? data : value}`, params, Headers)
      successToast()
      setRefetch(true)
      setCheckedIds([])
      setItemUpdate({})
      setIsCheckedAll(false)
      setOpenConfirm(!openConfirm)
    } catch (err) {
      console.log("error messenger", err)
      errorToast()
    }
  }

  // Alert
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
      {/*<div className={`${menu === "Approval" ? "p-0 h-100" : "card py-3 px-5"} border-0`}>*/}
      {/*</div>*/}
      <MainHeader currentTitleMenu={routeConfig?.keyTitle} />
      <Toolbar
        start={<SearchInput onKeyDown={handleKeyPress} />}
        end={
          <>
            <BaseButton
              color={`primary`}
              className={`m-0 border-0`}
              icon={"mdi mdi-plus font-size-18"}
              iconClassName={`m-0`}
              onClick={togtoggleModal}
              style={{ width: "38px", height: "38px" }}
            />
            {checkedIds.length > 0 && (
              <BaseButton
                color={`danger`}
                className={`m-0 border-0`}
                icon={"mdi mdi-trash-can-outline font-size-18"}
                iconClassName={`m-0`}
                onClick={() => setOpenConfirm(!openConfirm)}
                style={{ width: "38px", height: "38px" }}
              />
            )}
            <BaseButton
              outline
              color={`grey`}
              className={`btn-outline-grey btn-action m-0`}
              icon={`mdi mdi-refresh font-size-18`}
              iconClassName={`m-0`}
              onClick={() => setRefetch(true)}
              loading={isLoading}
              style={{ width: "38px", height: "38px" }}
            />
          </>
        }
      />

      <div className={`w-100 h-100 overflow-hidden`}>
        <div className={`w-100 h-100 overflow-auto`}>
          <BaseTable heads={heads} rows={rows} tableClass={`m-0`} />
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
              pageSize={pageSize}
              pageIndex={page}
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
            togtoggleModal()
            setItemUpdate({})
          }}
          itemUpdate={itemUpdate}
          handleAdd={handleAdd}
          handleUpdate={handleUpdate}
        />
      )}
      <BaseModal
        isOpen={!!alert}
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
        onClick={() => handleDelete(itemUpdate?.uuid)}
        keyHeader={"mail.mail_set_mailbox_delete"}
        keyBody={"mail.approval_user_msg_confirmDelete"}
      />
    </>
  )
}

export default PriorApproval
