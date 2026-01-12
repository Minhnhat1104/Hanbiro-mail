// @ts-nocheck
// React
import React, { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

// Third-party
import { Card, Input } from "reactstrap"

// Project
import { NoData } from "components/Common"
import BaseButton from "components/Common/BaseButton"
import BaseIcon from "components/Common/BaseIcon"
import BaseTable from "components/Common/BaseTable/index"
import Loading from "components/Common/Loading"
import { ModalConfirm } from "components/Common/Modal"
import PaginationV2 from "components/Common/Pagination/PaginationV2"
import { Title } from "components/SettingAdmin"
import SearchInput from "components/SettingAdmin/SearchInput"
import {
  Headers,
  emailDelete,
  emailGet,
  emailPost,
  formDataUrlencoded,
} from "helpers/email_api_helper"
import { useCustomToast } from "hooks/useCustomToast"
import { SHARING_RESIGNEE_MAILBOX } from "modules/mail/admin/url"
import FormSharingMailbox from "./FormSharingMailbox"
import "./style.css"
import MainHeader from "pages/SettingMain/MainHeader"
import { isArray, isEmpty } from "lodash"
import Footer from "../../SettingMain/Footer"
import Toolbar from "../../SettingMain/Toolbar"

const SharingResigneeMailbox = (props) => {
  const { routeConfig } = props
  const { t } = useTranslation()
  const { successToast, errorToast } = useCustomToast()

  const [data, setData] = useState()
  const [itemUpdate, setItemUpdate] = useState(null)
  // State for checkbox
  const [checkedIds, setCheckedIds] = useState([])
  console.log("checkedIds:", checkedIds)
  const [isCheckedAll, setIsCheckedAll] = useState(false)

  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [isConfirm, setIsConfirm] = useState(false)
  const [openForm, setOpenForm] = useState(false)

  // State refetch data
  const [isLoading, setIsLoading] = useState(false)
  const [refetch, setRefetch] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const res = await emailGet(`${SHARING_RESIGNEE_MAILBOX}/${page}/${pageSize}/${search}`)
        setData(res)
        setIsLoading(false)
      } catch (err) {
        // errorToast()
        console.log("error messenger", err)
      }
    }

    if (refetch) {
      setRefetch(false)
      fetchData()
    }
  }, [refetch, page])

  const heads = [
    { content: checkBox("checkedAll") },
    { content: t("mail.mail_retired_users") },
    { content: t("mail.mailadmin_username") },
    { content: t("mail.mail_retired_shareids") },
  ]

  const rows = useMemo(() => {
    if (data?.rows) {
      const rows_share = data?.rows.map((item) => {
        return {
          class: "align-middle",
          columns: [
            { content: checkBox(item?.id) },
            { content: item?.id },
            { content: item?.name },
            {
              content: (
                <div className="action-button flex-wrap">
                  {item &&
                    item?.shareids.map((share, idx) => (
                      <div
                        key={idx}
                        className={`d-flex align-items-center rounded h-auto m-1 py-1 px-2 gap-2 
                      han-bg-color-primary-lighter han-color-primary-dark`}
                        style={{ minHeight: "28px" }}
                      >
                        {`${share?.userid} (${share?.username}) ${share?.date} `}
                        <BaseIcon
                          className={"color-red"}
                          icon={"mdi mdi-window-close"}
                          onClick={() => {
                            const newUserIds = item?.shareids.filter(
                              (v) => v?.userid !== share?.userid,
                            )
                            setIsConfirm(true)
                            setItemUpdate({ id: item?.id, userids: newUserIds })
                          }}
                        />
                      </div>
                    ))}
                  <BaseButton
                    outline
                    color="primary"
                    className={"btn-outline-primary my-1"}
                    onClick={() => {
                      setOpenForm(!openForm)
                      setItemUpdate({ id: item?.id, userids: item?.shareids })
                    }}
                    style={{ width: "28px", height: "28px" }}
                  >
                    {/*{t("mail.sms_fax_default_additional_apply_btn")}*/}
                    <BaseIcon icon={"mdi mdi-plus"} />
                  </BaseButton>
                </div>
              ),
            },
          ],
        }
      })
      return rows_share
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

  // Check box
  const handleCheckboxChange = (value) => {
    const newChecked = checkedIds.includes(value)
      ? checkedIds.filter((v) => v !== value)
      : [...checkedIds, value]

    const isCheckedAll = newChecked.length === Object.values(data?.rows).length
    setIsCheckedAll(isCheckedAll)
    setCheckedIds(newChecked)
  }
  const handleSelectAll = () => {
    setIsCheckedAll(!isCheckedAll)
    setCheckedIds(isCheckedAll ? [] : data?.rows.map((item) => item?.id) || [])
  }

  const onChangePage = (page) => {
    setPage(page)
    setIsCheckedAll(false)
    // setCheckedIds([])
    setRefetch(true)
  }

  // Search when enter
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      setSearch(event.target.value)
      setPage(1)
      setRefetch(true)
    }
  }

  // Update Sharing
  const handleUpdate = async (quitid, userids) => {
    if (isEmpty(userids)) {
      errorToast("admin.manager_add_user_error")
      return
    }
    try {
      const value = userids.map((item) => item?.userid || item?.id)
      const params = {
        quitid: quitid,
        userids: isArray(value) ? value.join(",") : value,
      }
      const res = await emailPost(SHARING_RESIGNEE_MAILBOX, params, Headers)
      successToast()
      setRefetch(true)
      setCheckedIds([])
      setOpenForm(false)
      setItemUpdate(null)
    } catch (err) {
      errorToast()
      console.log("error messenger", err)
    }
  }

  // Delete Sharing
  const handleDelete = async (data) => {
    try {
      const value = data ? data : checkedIds.join(",")
      const params = {
        quitids: value,
      }
      const res = await emailDelete(SHARING_RESIGNEE_MAILBOX, params, Headers)
      successToast()
      setRefetch(true)
      setCheckedIds([])
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
              color={`primary`}
              className={`btn-block m-0 border-0`}
              icon={`mdi mdi-plus font-size-18`}
              iconClassName={`m-0`}
              onClick={() => {
                setOpenForm(!openForm)
              }}
              style={{ width: "38px", height: "38px" }}
            />
            {checkedIds.length >= 1 && (
              <BaseButton
                color={`danger`}
                className={`btn-block m-0 border-0`}
                icon={`mdi mdi-trash-can-outline font-size-18`}
                iconClassName={`m-0`}
                onClick={() => handleDelete()}
                style={{ width: "38px", height: "38px" }}
              />
            )}
            <BaseButton
              outline
              color={`grey`}
              className={`btn-outline-grey btn-action`}
              icon={`mdi mdi-refresh font-size-18`}
              loading={isLoading}
              onClick={() => {
                setRefetch(true)
                setCheckedIds([])
              }}
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
            data?.rows.length === 0 && <NoData />
          )}
        </div>
      </div>

      <Footer
        footerContent={
          data &&
          data?.tot > 0 && (
            <PaginationV2
              pageCount={data?.tot}
              pageSize={data?.linenum || 1}
              pageIndex={page}
              onChangePage={onChangePage}
              hideBorderTop={true}
              hideRowPerPage={true}
            />
          )
        }
      />

      {/* Box Confirm Delete */}
      <ModalConfirm
        isOpen={isConfirm}
        toggle={() => {
          setIsConfirm(false)
        }}
        onClick={() => {
          if (itemUpdate?.userids?.length === 0) {
            handleDelete(itemUpdate.id)
          } else {
            handleUpdate(itemUpdate.id, itemUpdate.userids)
          }
          setIsConfirm(false)
        }}
      ></ModalConfirm>

      {openForm && (
        <FormSharingMailbox
          isOpen={openForm}
          onToggle={() => {
            setOpenForm(!openForm)
            setItemUpdate({})
          }}
          itemUpdate={itemUpdate}
          handleUpdate={handleUpdate}
        />
      )}
    </>
  )
}

export default SharingResigneeMailbox
