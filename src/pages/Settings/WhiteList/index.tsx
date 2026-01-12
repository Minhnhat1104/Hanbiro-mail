// @ts-nocheck
// React
import React, { useEffect, useMemo, useRef, useState } from "react"

// Third-party
import { Card, Input, InputGroup, Label } from "reactstrap"
import { useTranslation } from "react-i18next"

// Project
import BaseIcon from "components/Common/BaseIcon"
import Title from "components/SettingAdmin/Title/index"
import Tooltip from "components/SettingAdmin/Tooltip"
import BaseTable from "components/Common/BaseTable"
import { BaseButton, NoData, Pagination } from "components/Common"
import { DELAY_TIME, PAGE_SIZE } from "constants/setting"
import { base64_encode } from "utils"
import { useCustomToast } from "hooks/useCustomToast"
import { postMailToHtml5 } from "modules/mail/common/api"
import SearchInput from "components/SettingAdmin/SearchInput"
import { ModalAlert } from "components/Common/Modal"
import BaseButtonTooltip from "components/Common/BaseButtonTooltip"
import Loading from "components/Common/Loading"
import BaseIconTooltip from "components/Common/BaseIconTooltip"
import PaginationV2 from "components/Common/Pagination/PaginationV2"

import "./style.scss"
import MainHeader from "pages/SettingMain/MainHeader"
import Toolbar from "../../SettingMain/Toolbar"
import Footer from "../../SettingMain/Footer"

const WhiteList = (props) => {
  const { routeConfig } = props
  const { t } = useTranslation()
  const { successToast, errorToast } = useCustomToast()

  const [modal, setModal] = useState(false)
  const handleModal = () => setModal(!modal)

  const [data, setData] = useState({ loading: false, list: [], total: 0 })
  const [attr, setAttr] = useState({
    total: 0,
    limit: PAGE_SIZE,
    page: 1,
  })

  const [search, setSearch] = useState("")
  const [mail, setMail] = useState("")
  const [titleModal, setTitleModal] = useState("common.alert_plz_input_data")
  const [sort, setSort] = useState("asc")
  const [valueChange, setValueChange] = useState("")

  const [checkedIds, setCheckedIds] = useState([]) // checked item list - not list all
  const [isCheckedAll, setIsCheckedAll] = useState(false) // state for check all

  const getWhiteListData = async (page = 1, limit = PAGE_SIZE, search = "", sort = "asc") => {
    setData({ ...data, loading: true })
    try {
      const postParams = {
        act: "whitelistmanage",
        mode: "list",
        data: JSON.stringify({
          page: page,
          limit: limit,
          sort: sort,
          search: search ? base64_encode(search) : "",
        }),
      }
      const res = await postMailToHtml5(postParams)
      if (typeof res.success !== "undefined" && res.success === "1") {
        const newData = Object.entries(res.data).map(([key, value]) => value)
        setAttr({ ...attr, total: res.total })
        setData({ loading: false, list: newData, total: res.total })
      }
    } catch (err) {
      errorToast()
      setData({ ...data, loading: false })
    }
  }

  useEffect(() => {
    getWhiteListData(attr.page, attr.limit, search, sort)
  }, [attr.page, search, sort])

  // Handle pagination
  const handleChangePage = (page) => setAttr({ ...attr, page: page })

  // Handle check all
  const handleCheckAllChange = () => {
    setIsCheckedAll(!isCheckedAll) // Set state for check all
    setCheckedIds(isCheckedAll ? [] : data.list) // Set state list for checked list
  }

  // Handle check one
  const handleCheckOneChange = (item) => {
    const newChecked = checkedIds.includes(item)
      ? checkedIds.filter((v) => v !== item) // Remove item if existed
      : [...checkedIds, item] // Add item if not existed
    const isCheckedAll = newChecked.length === data.list.length // Check if all item checked
    setIsCheckedAll(isCheckedAll) // Set state for check all
    setCheckedIds(newChecked) // Set state list for checked item list
  }

  const timeoutId = useRef(null)
  // Handle search key
  const handleSearch = (event, valueChange) => {
    // Clear timeout if existed
    timeoutId.current && clearTimeout(timeoutId.current)

    if (event.key === "Enter") {
      // Search with Key down => Enter
      // setSearch(event.target.value)
      setSearch(valueChange)
      setAttr({ ...attr, page: 1 })
    }
    // else {
    //   // Set timeout to search if not search with key "Enter"
    //   timeoutId.current = setTimeout(() => {
    //     // setSearch(event.target.value)
    //     setSearch(valueChange)
    //   }, DELAY_TIME)
    // }
  }

  // Handle add
  const handleAdd = async (email, list) => {
    if (email) {
      const regex = /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]/
      if (regex.test(email)) {
        const existedEmail = list.find((item) => item === email)
        if (existedEmail) {
          setTitleModal("Email already exists")
          handleModal()
        } else {
          setData({ ...data, loading: true })
          try {
            const newEmail = email.split(" ")
            let newData = {}
            if (newEmail.length > 1) {
              newData = {
                name: base64_encode(encodeURIComponent(newEmail[0])),
                email: base64_encode(encodeURIComponent(newEmail[1])),
              }
            } else {
              newData = {
                name: " ",
                email: base64_encode(encodeURIComponent(newEmail[0])),
              }
            }
            const postParams = {
              act: "whitelistmanage",
              mode: "add",
              data: JSON.stringify(newData),
            }
            const getParam = "_whitelistmanage=1"
            const res = await postMailToHtml5(postParams, getParam)
            if (res.success === "1") {
              await getWhiteListData(attr.page, attr.limit, search, sort)
              setMail("")
              successToast()
            } else setData({ ...data, loading: false })
          } catch (err) {
            errorToast()
            setData({ ...data, loading: false })
          }
        }
      } else {
        setTitleModal("common.addrbook_email_format_error_msg")
        handleModal()
      }
    } else {
      setTitleModal("common.alert_plz_input_data")
      handleModal()
    }
  }

  // Handle delete
  const handleDelete = async (list) => {
    let newList = ""
    if (list.length === 1) newList = list[0]
    else newList = list.join(",")

    setData({ ...data, loading: true })
    try {
      const postParams = {
        act: "whitelistmanage",
        mode: "del",
        data: JSON.stringify(base64_encode(encodeURIComponent(newList))),
      }
      const getParam = "_whitelistmanage_delete=1"
      const res = await postMailToHtml5(postParams, getParam)
      if (res.success === "1") {
        await getWhiteListData(attr.page, attr.limit, search, sort)
        data.list.length === list.length && handleCheckAllChange()
        successToast()
      } else setData({ ...data, loading: false })
    } catch (err) {
      errorToast()
      setData({ ...data, loading: false })
    }
  }

  // ================================ Start Render Header Table ================================
  // Config render checkbox for header table
  const renderCheckBox = (value, index = 0) => {
    // value === "" => empty value => set (value + index) to define id
    return (
      <Input
        type="checkbox"
        checked={value === "checkedAll" ? isCheckedAll : checkedIds?.includes(value)}
        onClick={() => {
          if (value === "checkedAll") handleCheckAllChange()
          else handleCheckOneChange(value)
        }}
        onChange={() => {
        }}
        id={value ? value : value + index}
        className="cursor-pointer"
      />
    )
  }

  // Config render title for header table
  const renderTitleHeader = useMemo(() => {
    return (
      <div className="d-flex align-items-center gap-2">
        <p className="mb-0 han-h5 han-text-secondary">
          {[t("common.addrbook_email_msg"), ["(", data.total, ")"].join("")].join(" ")}
        </p>
        {sort === "desc" ? (
          <BaseIconTooltip
            title={t("mail.archive_title_msg_desc")}
            id="sort"
            className="font-size-15"
            icon="mdi mdi-sort-ascending"
            onClick={() => setSort("asc")}
          />
        ) : (
          <BaseIconTooltip
            title={t("mail.archive_title_msg_asc")}
            id="sort"
            className="font-size-15"
            icon="mdi mdi-sort-descending"
            onClick={() => setSort("desc")}
          />
        )}
      </div>
    )
  }, [data, sort])

  // Config header for table
  const heads = [
    { content: <>{renderCheckBox("checkedAll")}</>, class: "w-5" },
    { content: <>{renderTitleHeader}</> },
    {
      // Delete button
      content: (
        <div className="btn-delete">
          {checkedIds.length > 0 && (
            <BaseButton
              color="danger"
              outline
              onClick={() => handleDelete(checkedIds)}
              className="p-btn-delete"
            >
              <i className="mdi mdi-delete"></i> {t("common.common_delete")}
            </BaseButton>
          )}
        </div>
      ),
      class: "w-10",
    },
  ]
  // ================================ End Render Header Table ================================

  // ================================ Start Render Body Table ================================
  // Config data row for table
  const rows = data.loading
    ? []
    : data.total > 0
      ? data.list.map((item, index) => ({
        columns: [
          { content: <>{renderCheckBox(item, index)}</>, class: "w-5" },
          {
            content: (
              <Label
                htmlFor={item ? item : item + index} // item === "" => empty item => set value + index to define id
                className={`w-100 cursor-pointer mb-0 ${item === "" && "empty-item"}`}
              >
                {item}
              </Label>
            ),
          },
          {
            content: (
              <Label
                htmlFor={item ? item : item + index} // item === "" => empty item => set value + index to define id
                className="w-100 cursor-pointer mb-0"
              />
            ),
            class: "w-10",
          },
        ],
      }))
      : [{ columns: [{ content: "" }, { content: <NoData /> }, { content: "" }] }]
  // ================================ End Render Body Table ================================

  return (
    <>
      <MainHeader currentTitleMenu={t(routeConfig?.keyTitle)} />
      <Toolbar
        start={
          <SearchInput
            value={valueChange}
            onKeyDown={(e) => handleSearch(e, valueChange)}
            onChange={(e) => setValueChange(e.target.value)}
          />
        }
        end={
          <>
            <InputGroup>
              <BaseButton
                color="primary"
                className="input-group-text cursor-pointer border-0 border-top-right-radius-0"
                onClick={() => handleAdd(mail, data.list)}
                icon="mdi mdi-plus"
                loading={data.loading}
              >
                {t("mail.mail_whitelist_create")}
              </BaseButton>
              <Input
                autoComplete="off"
                type="text"
                className="form-control"
                id="autoSizingInputGroup"
                placeholder={`${t("common.name")} <id@email.com>`}
                value={mail}
                onChange={(e) => setMail(e.target.value)}
              />
            </InputGroup>
            <BaseButtonTooltip
              title={t("common.org_refresh")}
              id="refresh-whitelist"
              color="grey"
              outline
              className="btn-outline-grey btn-action"
              icon="mdi mdi-refresh"
              iconClassName={`m-0`}
              onClick={() => {
                setValueChange("")
                setSearch("")
                setSort("asc")
                setCheckedIds([])
                setIsCheckedAll(false)
                setAttr({ ...attr, page: 1 })
                getWhiteListData(1, PAGE_SIZE, "", "asc")
              }}
              loading={data.loading}
              style={{ width: "38px", height: "38px" }}
            />
          </>
        }
      />
      <Tooltip
        className={`mb-2`}
        content={<div dangerouslySetInnerHTML={{ __html: t("mail.mail_whitelist_inputemail") }} />}
      />

      <div className={`w-100 h-100 overflow-hidden`}>
        <div className={`w-100 h-100 overflow-y-auto`}>
          <BaseTable heads={heads} rows={rows} tableClass={`m-0`} />
          {data.loading && (
            <div className="position-relative">
              <Loading />
            </div>
          )}
        </div>
      </div>

      <Footer footerContent={attr.total > 0 && (
        <PaginationV2
          pageCount={attr.total}
          pageSize={attr.limit}
          pageIndex={attr.page}
          onChangePage={handleChangePage}
          hideBorderTop={true}
          hideRowPerPage={true}
        />
      )} />

      {/* Alert Modal */}
      {modal && <ModalAlert handleClose={handleModal} titleBody={titleModal} />}
    </>
  )
}

export default WhiteList
