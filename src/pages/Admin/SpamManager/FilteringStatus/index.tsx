// @ts-nocheck
// React
import React, { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

// Third-party
import {
  Col,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
  Button,
  Input,
  InputGroup,
} from "reactstrap"

// Project
import classnames from "classnames"
import BaseButton from "components/Common/BaseButton"
import BaseTable from "components/Common/BaseTable"
import BaseIcon from "components/Common/BaseIcon"
import "components/SettingAdmin/Tabs/style.css"
import { BaseModal, NoData, Pagination } from "components/Common"
import { Headers, emailDelete, emailGet, emailPost } from "helpers/email_api_helper"
import { useCustomToast } from "hooks/useCustomToast"
import Loading from "components/Common/Loading"
import { useDispatch, useSelector } from "react-redux"
import {
  setClearSpamConfig,
  setSpamFilterDomainConfig,
  setSpamFilterEmailConfig,
  setSpamFilterFileConfig,
  setSpamFilterIPConfig,
  setSpamFilterSubjectConfig,
} from "store/adminSetting/actions"
import { SPAM_MANAGER_FILTER_STATUS } from "modules/mail/admin/url"
import SearchInput from "components/SettingAdmin/SearchInput"
import useDevice from "hooks/useDevice"
import PaginationV2 from "components/Common/Pagination/PaginationV2"
import { IconButton } from "@mui/material"
import "../style.scss"

const FilteringStatus = (props) => {
  const { isOpen, toggleModal } = props
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const { isTablet, isVerticalTablet, isDesktop } = useDevice()
  const { successToast, errorToast } = useCustomToast()

  const [data, setData] = useState()
  const [addFile, setAddFile] = useState("")
  const [isAddFile, setIsAddFile] = useState(false)
  const [checkedIds, setCheckedIds] = useState([])
  const [isCheckedAll, setIsCheckedAll] = useState(false)
  const [search, setSearch] = useState("")
  const [searchValue, setSearchValue] = useState("")

  const pageSize = 15
  const [page, setPage] = useState({
    ip: 1,
    domain: 1,
    email: 1,
    subject: 1,
    file: 1,
  })

  // State Loading
  const [isLoading, setIsLoading] = useState(false)
  const [refetch, setRefetch] = useState(false)

  // State Form Filtering
  const [tab, setTab] = useState("ip")

  const list = useSelector((state) => state?.AdminSetting?.spamManager?.filter[tab])

  // Fetch data Filtering Status
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const res = await emailGet(
          `${SPAM_MANAGER_FILTER_STATUS}/${tab}/${page[tab]}/${pageSize}/${search}`,
        )
        setData(res)
        switch (tab) {
          case "ip":
            dispatch(setSpamFilterIPConfig(res))
            break
          case "domain":
            dispatch(setSpamFilterDomainConfig(res))
            break
          case "email":
            dispatch(setSpamFilterEmailConfig(res))
            break
          case "subject":
            dispatch(setSpamFilterSubjectConfig(res))
            break
          case "file":
            dispatch(setSpamFilterFileConfig(res))
            break
        }
        setIsLoading(false)
      } catch (err) {
        errorToast()
        console.log("error messenger", err)
      }
    }

    if (refetch) {
      fetchData()
      setRefetch(false)
    }
    if (list == null) {
      fetchData()
    } else if (list != null) {
      setData(list)
    }
  }, [refetch, tab])

  useEffect(() => {
    return () => {
      dispatch(setClearSpamConfig())
    }
  }, [])

  // checkbox
  function checkBox(value) {
    const isChecked = checkedIds.some((item) => item?.i === value?.i) || false
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

  // Check box
  const handleCheckboxChange = (value) => {
    const newChecked = checkedIds.some((item) => item?.i === value?.i)
      ? checkedIds.filter((v) => v !== value)
      : [...checkedIds, value]

    const isCheckedAll = newChecked.length === data?.rows.length
    setIsCheckedAll(isCheckedAll)
    setCheckedIds(newChecked)
  }
  const handleSelectAll = () => {
    setIsCheckedAll(!isCheckedAll)
    setCheckedIds(isCheckedAll ? [] : data?.rows || [])
  }

  const onChangePage = (page) => {
    setPage((prev) => ({ ...prev, [tab]: page }))
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

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value)
  }

  const handleChangeTab = (type) => {
    setTab(type)
    setSearch("")
    setSearchValue("")
    setIsCheckedAll(false)
    setCheckedIds([])
    setRefetch(true)
  }

  const handleAddFile = async () => {
    try {
      const params = {
        data: addFile,
      }
      const res = await emailPost(`${SPAM_MANAGER_FILTER_STATUS}/${tab}`, params, Headers)

      if (res?.success) {
        successToast("File type add success")
        setRefetch(true)
        setAddFile("")
        setIsAddFile(false)
      }
    } catch (err) {
      errorToast()
      setAddFile("")
    }
  }

  const handleDeleteFile = async (item) => {
    try {
      const params = {
        data: item,
      }
      const res = await emailDelete(`${SPAM_MANAGER_FILTER_STATUS}/${tab}`, params)

      if (res?.success) {
        successToast(res?.msg)
        setRefetch(true)
      }
    } catch (err) {
      errorToast()
    }
  }

  const handleDelete = async () => {
    try {
      const deleteRequests = checkedIds.map(async (item) => {
        const params = {
          mode: item?.type,
          data: item?.data,
        }
        // Call emailDelete for each item and await the result
        return await emailDelete(`${SPAM_MANAGER_FILTER_STATUS}/${tab}`, params, Headers)
      })

      // Wait for all delete requests to complete
      if (tab === "ip" || tab === "domain" || tab === "email") {
        const deleteResults = await Promise.all(deleteRequests)
      } else if (tab === "subject") {
        const params = { uids: checkedIds.map((v) => v.uid).join(",") }
        const res = await emailDelete(`${SPAM_MANAGER_FILTER_STATUS}/${tab}`, params, Headers)
      }
      successToast()
      setRefetch(true)
      setCheckedIds([])
    } catch (err) {
      errorToast()
    }
  }

  // Table IP
  const heads = [
    { content: checkBox("checkedAll") },
    { content: t("common.profile_created_history_no") },
    {
      content: tab === "ip" ? t("common.ip") : (
        tab === "domain" ? t("mail.mail_admin_receive_domain") : t("common.activities_type_email")
      ),
    },
    { content: t("mail.mail_cspam_type") },
    { content: t("mail.mail_silently_drop") },
  ]

  const rows = useMemo(() => {
    if (data?.rows) {
      const rows_spam = data?.rows.map((item, index) => ({
        columns: [
          { content: checkBox(item) },
          { content: item?.i },
          { content: item?.data },
          { content: item?.type === "b" ? t("mail.mail_block") : t("mail.mail_white") },
          { content: item?.isblock ? t("common.common_yes_msg") : t("common.common_no_msg") },
        ],
      }))
      return rows_spam
    }
    return []
  }, [data, checkedIds])

  // Table Block keywords
  const headsBlock = [
    { content: checkBox("checkedAll") },
    { content: t("common.profile_created_history_no") },
    { content: t("mail.mail_cspam_subject") },
    { content: t("mail.mail_cspam_spam_from") },
    { content: t("mail.mail_cspam_spam_to") },
    { content: t("mail.mail_silently_drop") },
  ]

  const rowsBlock = useMemo(() => {
    if (data?.rows && tab === "subject") {
      const rows_block = data?.rows.map((item) => ({
        columns: [
          { content: checkBox(item) },
          { content: item?.i },
          { content: item?.subject },
          { content: item?.fromaddr },
          { content: item?.toaddr },
          { content: item?.isblock ? t("common.common_say_yes_msg") : t("common.common_say_no_msg") },
        ],
      }))
      return rows_block
    }
    return []
  }, [data, tab, checkedIds])

  // Table attachment
  const heads_attach = [
    { content: t("mail.mail_file_type") },
    { content: "" },
  ]

  const rowsAttach = useMemo(() => {
    if (data?.rows && tab === "file") {
      const rows_block = data?.rows.map((item, index) => ({
        columns: [
          { content: item },
          {
            content: (
              <IconButton
                size={`small`}
                className={`text-danger`}
                onClick={() => handleDeleteFile(item)}
                style={{ width: "28px", height: "28px" }}
              >
                <i className={`mdi mdi-trash-can-outline`}></i>
              </IconButton>
            ),
          },
        ],
      }))
      return rows_block
    }
    return []
  }, [data])

  const headerLog = () => {
    return <div>{t("mail.mail_admin_receive_rules")}</div>
  }

  const bodyLog = () => {
    return (
      <div className="w-100">
        <Nav tabs className="spam-manager-tab border-0 mb-2">
          <NavItem
            active={tab === "ip"}
            className={"cursor-pointer"}
            onClick={() => {
              handleChangeTab("ip")
            }}
          >
            {t("common.ip")}
          </NavItem>
          <NavItem
            active={tab === "domain"}
            className={"cursor-pointer"}
            onClick={() => {
              handleChangeTab("domain")
            }}
          >
            {t("mail.mail_admin_receive_domain")}
          </NavItem>
          <NavItem
            active={tab === "email"}
            className={"cursor-pointer"}
            onClick={() => {
              handleChangeTab("email")
            }}
          >
            {t("common.activities_type_email")}
          </NavItem>
          <NavItem
            active={tab === "subject"}
            className={"cursor-pointer"}
            onClick={() => {
              handleChangeTab("subject")
            }}
          >
            {t("mail.mail_block_keywords")}
          </NavItem>
          <NavItem
            active={tab === "file"}
            className={"cursor-pointer"}
            onClick={() => {
              handleChangeTab("file")
            }}
          >
            {t("mail.mail_secure_file_msg")}
          </NavItem>
        </Nav>

        <div className="d-flex justify-content-between mb-2">
          <SearchInput value={searchValue} onKeyDown={handleKeyPress} onChange={handleSearchChange} />
          <div className="d-flex justify-content-end">
            {checkedIds.length > 0 && (
              <BaseButton
                color={`danger`}
                className={"btn btn-danger m-0 border-0"}
                icon={`mdi mdi-trash-can-outline font-size-18`}
                iconClassName={`m-0`}
                onClick={handleDelete}
                style={{ width: "38px", height: "38px" }}
              />
            )}
            {tab === "file" && !isAddFile && (
              <BaseButton
                color={`primary`}
                className={"btn btn-success m-0 border-0"}
                icon={`mdi mdi-plus font-size-18`}
                iconClassName={`m-0`}
                onClick={() => {
                  setIsAddFile(true)
                }}
                style={{ width: "38px", height: "38px" }}
              />
            )}
            {tab === "file" && isAddFile && (
              <InputGroup>
                <Input
                  className={`han-text-primary han-bg-color-soft-grey border-0`}
                  value={addFile}
                  placeholder={t("mail.mail_file_type")}
                  onChange={(e) => {
                    setAddFile(e.target.value)
                  }}
                />
                <Button
                  color="primary"
                  className={`border-0 p-1`}
                  onClick={handleAddFile}
                  style={{ width: "38px", height: "38px" }}
                >
                  <BaseIcon icon={`mdi mdi-plus font-size-18`} />
                </Button>
              </InputGroup>
            )}
          </div>
        </div>

        <TabContent activeTab={tab} className="mb-2 text-muted">
          <TabPane tabId="ip" className="overflow-auto" style={{ maxHeight: "50vh" }}>
            <div>
              <BaseTable heads={heads} rows={rows} tableClass={`m-0`} />
              {isLoading ? (
                <div className="position-relative">
                  <Loading />
                </div>
              ) : (
                data?.rows?.length === 0 && <NoData />
              )}
            </div>
          </TabPane>
          <TabPane tabId="domain" className="overflow-auto" style={{ maxHeight: "50vh" }}>
            <div>
              <BaseTable heads={heads} rows={rows} tableClass={`m-0`} />
              {isLoading ? (
                <div className="position-relative">
                  <Loading />
                </div>
              ) : (
                data?.rows?.length === 0 && <NoData />
              )}
            </div>
          </TabPane>
          <TabPane tabId="email" className="overflow-auto" style={{ maxHeight: "50vh" }}>
            <div>
              <BaseTable heads={heads} rows={rows} tableClass={`m-0`} />
              {isLoading ? (
                <div className="position-relative">
                  <Loading />
                </div>
              ) : (
                data?.rows?.length === 0 && <NoData />
              )}
            </div>
          </TabPane>
          <TabPane tabId="subject" className="overflow-auto" style={{ maxHeight: "50vh" }}>
            <div>
              <BaseTable heads={headsBlock} rows={rowsBlock} tableClass={`m-0`} />
              {isLoading ? (
                <div className="position-relative">
                  <Loading />
                </div>
              ) : (
                data?.rows?.length === 0 && <NoData />
              )}
            </div>
          </TabPane>
          <TabPane tabId="file" className="overflow-auto" style={{ maxHeight: "50vh" }}>
            <div>
              <BaseTable heads={heads_attach} rows={rowsAttach} tableClass={`m-0`} />
              {isLoading ? (
                <div className="position-relative">
                  <Loading />
                </div>
              ) : (
                data?.rows?.length === 0 && <NoData />
              )}
            </div>
          </TabPane>
        </TabContent>

        {data && (
          <PaginationV2
            pageCount={data?.total}
            pageSize={data?.linenum}
            pageIndex={page[tab]}
            onChangePage={onChangePage}
            hideBorderTop={true}
            hideRowPerPage={true}
          />
        )}
      </div>
    )
  }

  const footerLog = () => {
    return (
      <>
        <div className="action-form">
          <BaseButton
            className={"btn btn-secondary btn-block "}
            type="button"
            onClick={toggleModal}
          >
            {t("common.common_cancel")}
          </BaseButton>
        </div>
      </>
    )
  }

  return (
    <>
      {/* Form Filtering Status */}
      <BaseModal
        size="xl"
        modalClass={isTablet ? "modal-w-80" : ""}
        isOpen={isOpen}
        toggle={toggleModal}
        renderHeader={headerLog}
        renderBody={bodyLog}
        // renderFooter={footerLog}
      />
    </>
  )
}

export default FilteringStatus
