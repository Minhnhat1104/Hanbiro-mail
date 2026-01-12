// @ts-nocheck
// React
import { useEffect, useMemo, useRef, useState } from "react"

// Third-party
import { useTranslation } from "react-i18next"
import { Input, InputGroup, Label } from "reactstrap"

// Project
import { NoData } from "components/Common"
import BaseButton from "components/Common/BaseButton"
import BaseIconTooltip from "components/Common/BaseIconTooltip"
import BaseTable from "components/Common/BaseTable"
import Loading from "components/Common/Loading"
import { ModalAlert } from "components/Common/Modal"
import PaginationV2 from "components/Common/Pagination/PaginationV2"
import SearchInput from "components/SettingAdmin/SearchInput"
import { PAGE_SIZE } from "constants/setting"
import { useCustomToast } from "hooks/useCustomToast"
import useDevice from "hooks/useDevice"
import { postMailToHtml5 } from "modules/mail/common/api"
import { base64_encode } from "utils"

import MainHeader from "pages/SettingMain/MainHeader"
import Footer from "../../SettingMain/Footer"
import Toolbar from "../../SettingMain/Toolbar"
import "./style.scss"

const BlockedAddresses = (props) => {
  const { routeConfig } = props
  const { t } = useTranslation()
  const { isMobile } = useDevice()
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
  const [sort, setSort] = useState("desc")

  const [checkedIds, setCheckedIds] = useState([]) // checked item list - not list all
  const [isCheckedAll, setIsCheckedAll] = useState(false) // state for check all

  const getBlockedAddressesData = async (
    page = 1,
    limit = PAGE_SIZE,
    search = "",
    sort = "desc",
  ) => {
    setData({ ...data, loading: true })
    try {
      const postParams = {
        act: "bans",
        mode: "read",
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
      } else setData({ ...data, loading: false })
    } catch (err) {
      errorToast()
      setData({ ...data, loading: false })
    }
  }

  useEffect(() => {
    getBlockedAddressesData(attr.page, attr.limit, search, sort)
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
  const handleSearch = (event) => {
    // Clear timeout if existed
    timeoutId.current && clearTimeout(timeoutId.current)

    if (event.key === "Enter") {
      setSearch(event.target.value)
      setAttr({ ...attr, page: 1 })
    }
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
            const postParams = {
              act: "bans",
              mode: "write",
              data: email,
            }
            const res = await postMailToHtml5(postParams)
            if (res.success === "1") {
              await getBlockedAddressesData(attr.page, attr.limit, search, sort)
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
        act: "bans",
        mode: "delete",
        data: newList,
      }
      const res = await postMailToHtml5(postParams)
      if (res.success === "1") {
        setCheckedIds([])
        await getBlockedAddressesData(attr.page, attr.limit, search, sort)
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
        onChange={() => {}}
        id={value ? value : value + index}
        className="cursor-pointer"
      />
    )
  }

  // Config render title for header table
  const renderTitleHeader = useMemo(() => {
    return (
      <div className="d-flex align-items-center gap-2">
        <p className="mb-0">{t("common.addrbook_email_msg")}</p>
        {sort === "desc" ? (
          <BaseIconTooltip
            title={t("mail.archive_title_msg_desc")}
            id="sort"
            className=""
            icon="mdi mdi-sort-ascending"
            onClick={() => setSort("asc")}
          />
        ) : (
          <BaseIconTooltip
            title={t("mail.archive_title_msg_asc")}
            id="sort"
            className=""
            icon="mdi mdi-sort-descending"
            onClick={() => setSort("desc")}
          />
        )}
      </div>
    )
  }, [sort])

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
          {
            content: <>{renderCheckBox(item, index)}</>,
            class: "w-5",
          },
          {
            content: (
              <Label
                htmlFor={item ? item : item + index} // item === "" => empty item => set value + index to define id
                className={`han-text-primary w-100 cursor-pointer mb-0 ${
                  item === "" && "empty-item"
                }`}
              >
                {item}
              </Label>
            ),
          },
          {
            content: (
              <Label
                htmlFor={item ? item : item + index} // item === "" => empty item => set value + index to define id
                className="han-text-primary w-100 cursor-pointer mb-0"
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
        start={<SearchInput onKeyDown={handleSearch} isMobile={isMobile} />}
        end={
          <>
            <Label className="visually-hidden" htmlFor="autoSizingInputGroup">
              {" "}
              Username
            </Label>
            <InputGroup>
              <BaseButton
                color={"primary"}
                className="input-group-text cursor-pointer border-0 han-h4 han-fw-regular border-top-right-radius-0"
                onClick={() => handleAdd(mail, data.list)}
                icon="mdi mdi-plus"
                loading={data.loading}
              >
                {t("mail.mail_dkim_add")}
              </BaseButton>
              <Input
                autoComplete="off"
                type="text"
                className="form-control han-h4 han-fw-regular han-text-secondary"
                id="autoSizingInputGroup"
                placeholder={t("mail.mail_set_bans_action1")}
                value={mail}
                onChange={(e) => setMail(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    e.stopPropagation()
                    handleAdd(mail, data.list)
                  }
                }}
              />
            </InputGroup>
          </>
        }
      />
      <div className={`w-100 h-100 overflow-hidden`}>
        {/* --- Content --- */}
        <div className={`w-100 h-100 overflow-auto`}>
          <BaseTable heads={heads} rows={rows} tableClass={`m-0`} />
          {data.loading && (
            <div className="position-relative">
              <Loading />
            </div>
          )}
        </div>
      </div>

      <Footer
        footerContent={
          attr.total > 0 && (
            <PaginationV2
              pageCount={attr.total}
              pageSize={attr.limit}
              pageIndex={attr.page}
              onChangePage={handleChangePage}
              hideBorderTop={true}
              hideRowPerPage={true}
            />
          )
        }
      />
      {/*--- Alert Modal --- */}
      {modal && <ModalAlert handleClose={handleModal} titleBody={titleModal} />}
    </>
  )
}

export default BlockedAddresses
