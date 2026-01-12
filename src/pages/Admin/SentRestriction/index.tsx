// @ts-nocheck
// React
import React, { useState, useEffect, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useTranslation } from "react-i18next"

// Third-party
import {
  Card,
  Col,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
  InputGroup,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
} from "reactstrap"

// Project
import { Title } from "components/SettingAdmin"
import classnames from "classnames"
import BaseIcon from "components/Common/BaseIcon"
import BaseTable from "components/Common/BaseTable"
import Pagination from "components/Common/Pagination"
import BaseButton from "components/Common/BaseButton"
import { Headers, emailDelete, emailGet, emailPost } from "helpers/email_api_helper"
import Loading from "components/Common/Loading"
import {
  setClearSpamConfig,
  setRestrictionDomainConfig,
  setRestrictionFileConfig,
} from "store/adminSetting/actions"
import { useCustomToast } from "hooks/useCustomToast"
import SearchInput from "components/SettingAdmin/SearchInput"
import { ModalConfirm } from "components/Common/Modal"
import { SENT_RESTRICTION } from "modules/mail/admin/url"

import "./style.scss"
import { NoData } from "components/Common"
import PaginationV2 from "components/Common/Pagination/PaginationV2"
import MainHeader from "pages/SettingMain/MainHeader"
import Toolbar from "../../SettingMain/Toolbar"
import Footer from "../../SettingMain/Footer"

const SentRestriction = (props) => {
  const { routeConfig } = props
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { successToast, errorToast } = useCustomToast()

  const [data, setData] = useState()
  // State Check Box
  const [checkedIds, setCheckedIds] = useState({ domain: [], file: [] })
  const [isCheckedAll, setIsCheckedAll] = useState({
    domain: false,
    file: false,
  })

  const [modal, setModal] = useState(false)
  const [openConfirm, setOpenConfirm] = useState(false)
  const toggle = () => setModal(!modal)
  const [filter, setFilter] = useState({
    isadmin: "y",
    linenum: "20",
    page: "1",
  })
  const [page, setPage] = useState({ domain: 1, file: 1 })
  const [tab, setTab] = useState("domain")
  const [search, setSearch] = useState({ domain: "", file: "" })
  const [itemAdd, setItemAdd] = useState({ domain: "", file: "" })
  const list = useSelector((state) => state?.AdminSetting?.restriction[tab])

  // State Loading
  const [isLoading, setIsLoading] = useState(false)
  const [refetch, setRefetch] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const params = { ...filter, type: tab, searchkey: search[tab] }
        const res = await emailGet(SENT_RESTRICTION, params)
        if (res?.success) {
          setData(res)
          if (tab === "domain") dispatch(setRestrictionDomainConfig(res))
          else dispatch(setRestrictionFileConfig(res))
          setIsLoading(false)
        }
      } catch (err) {
        // errorToast()
        console.log("error messenger", err)
      }
    }

    if (refetch) {
      fetchData()
      setRefetch(false)
    }
    if (list === null) {
      fetchData()
    } else if (list !== null) {
      setData(list)
    }
    setRefetch(false)
  }, [refetch, tab])

  useEffect(() => {
    return () => {
      dispatch(setClearSpamConfig())
    }
  }, [])

  function checkbox(value) {
    const type = value?.data ? value?.data?.manager_type : ""
    const isChecked = checkedIds[tab].includes(value) || false
    const checkAll = value === "checkedAll"
    return (
      <>
        <input
          type="checkbox"
          id="subscribe"
          name="subscribe"
          checked={checkAll ? isCheckedAll[tab] : isChecked}
          onClick={() => {
            if (checkAll) handleSelectAll()
            else handleCheckboxChange(value)
          }}
          onChange={() => {}}
          disabled={type === "sys" && tab === "file"}
        />
      </>
    )
  }

  const heads = [
    {
      content: checkbox("checkedAll"),
    },
    {
      content: t("mail.mail_autosetting_name_n"),
    },
    {
      content: t("mail.mail_admin_receive_domain"),
    },
  ]

  const rows = useMemo(() => {
    if (data?.rows) {
      const rowsSent = data?.rows.map((item) => ({
        class: "align-middle",
        columns: [
          { content: checkbox(item) },
          { content: `${item?.data?.username} [${item?.data?.user}]` },
          { content: item?.data?.data },
        ],
      }))
      return rowsSent
    }
    return []
  }, [data, checkedIds])

  const heads1 = [
    {
      content: checkbox("checkedAll"),
    },
    {
      content: t("mail.mail_autosetting_name_n"),
    },
    {
      content: t("mail.mail_sent_limit_file"),
    },
  ]

  // Search when enter
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      setRefetch(true)
    }
  }

  // Add when enter
  const handleKeyPressAdd = (event) => {
    if (event.key === "Enter") {
      if (itemAdd[tab] === "") toggle()
      else handleAdd()
    }
  }

  // Check box
  const handleCheckboxChange = (value) => {
    const updatedIds = checkedIds[tab].includes(value)
      ? checkedIds[tab].filter((v) => v !== value)
      : [...checkedIds[tab], value]

    const isCheckedAll =
      updatedIds.length === data?.rows.filter((v) => v.data.manager_type !== "sys").length
    setIsCheckedAll((prev) => ({
      ...prev,
      [tab]: isCheckedAll,
    }))
    setCheckedIds((prev) => ({
      ...prev,
      [tab]: updatedIds,
    }))
  }
  const handleSelectAll = () => {
    setIsCheckedAll((prev) => ({
      ...prev,
      [tab]: !prev[tab],
    }))

    const fileData = data?.rows.filter((v) => v.data.manager_type !== "sys")
    setCheckedIds({
      ...checkedIds,
      [tab]: tab === "domain" ? data?.rows : fileData,
    })

    if (isCheckedAll[tab]) {
      setCheckedIds({
        ...checkedIds,
        [tab]: [],
      })
    }
  }

  const onChangePage = (page) => {
    setPage((prev) => ({ ...prev, [tab]: page }))
    setFilter((prev) => ({ ...prev, page: page }))
    setRefetch(true)
  }

  const handleAdd = async () => {
    try {
      const params = {
        type: tab,
        isadmin: "y",
        data: itemAdd[tab],
      }
      const res = await emailPost(SENT_RESTRICTION, params, Headers)

      successToast(res?.msg)
      setRefetch(true)
      setItemAdd({ ...itemAdd, [tab]: "" })
    } catch (err) {
      console.log("error messenger", err)
      errorToast()
    }
  }

  const handleDelete = async () => {
    try {
      const data = checkedIds[tab].map((v) => v?.data?.uid).join(",")
      const params = {
        type: tab,
        isadmin: "y",
        data: data,
      }
      const res = await emailDelete(SENT_RESTRICTION, params, Headers)

      successToast(res?.msg)
      setRefetch(true)
      setCheckedIds({ ...checkedIds, [tab]: [] })
      setIsCheckedAll({ ...isCheckedAll, [tab]: false })
      setOpenConfirm(!openConfirm)
    } catch (err) {
      console.log("error messenger", err)
      errorToast()
    }
  }

  return (
    <>
      <MainHeader currentTitleMenu={routeConfig?.keyTitle} />
      <Toolbar
        start={
          <SearchInput
            value={search[tab]}
            onChange={(e) => {
              const { value } = e.target
              setSearch({ ...search, [tab]: value })
            }}
            onKeyDown={handleKeyPress}
          />
        }
        end={
          <>
            {checkedIds[tab].length > 0 && (
              <BaseButton color={"danger"} onClick={() => setOpenConfirm(!openConfirm)}>
                {t("mail.mailadmin_delete")}
              </BaseButton>
            )}
            <Label className="visually-hidden" htmlFor="autoSizingInputGroup">
              {t("mail.mail_admin_user_name")}
            </Label>
            <InputGroup>
              <Input
                value={itemAdd[tab]}
                className={`han-text-primary han-bg-color-soft-grey border-0`}
                id="autoSizingInputGroup"
                placeholder={
                  tab === "domain"
                    ? t("mail.mail_sent_limit_type_domain_msg")
                    : t("mail.mail_sent_limit_type_file_extension_msg")
                }
                onChange={(e) => {
                  const { value } = e.target
                  setItemAdd({ ...itemAdd, [tab]: value })
                }}
                onKeyDown={handleKeyPressAdd}
              />
              <BaseButton
                color="primary"
                className="input-group-text text-white cursor-pointer"
                icon={`mdi mdi-plus font-size-18`}
                iconClassName={`m-0`}
                onClick={() => {
                  if (itemAdd[tab] === "") toggle()
                  else handleAdd()
                }}
                style={{ width: "38px", height: "38px" }}
              />
            </InputGroup>
          </>
        }
      />
      <div className={`w-100 h-100 overflow-hidden`}>
        <Nav tabs className="sent-restriction-tab border-0 mb-2">
          <NavItem
            active={tab === "domain"}
            className={"cursor-pointer"}
            onClick={() => setTab("domain")}
          >
            {t("mail.mail_admin_receive_domain")}
          </NavItem>
          <NavItem
            active={tab === "file"}
            className={"cursor-pointer"}
            onClick={() => setTab("file")}
          >
            {t("mail.mail_sent_limit_file")}
          </NavItem>
        </Nav>
        <TabContent
          activeTab={tab}
          className={`w-100 overflow-y-auto`}
          style={{ height: "calc(100% - 44px)" }}
        >
          <TabPane tabId="domain">
            <div className={`mx-0`}>
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
          <TabPane tabId="file">
            <div className={`mx-0`}>
              <BaseTable heads={heads1} rows={rows} tableClass={`m-0`} />
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
      </div>

      <Footer
        footerContent={
          data &&
          data?.total > 0 && (
            <PaginationV2
              pageCount={data?.total}
              pageSize={data?.linenum}
              pageIndex={page[tab]}
              onChangePage={onChangePage}
              hideBorderTop={true}
              hideRowPerPage={true}
            />
          )
        }
      />

      <Modal isOpen={modal} toggle={toggle}>
        <ModalHeader toggle={toggle}>{t("mail.mail_retired_forward_create")}</ModalHeader>
        <ModalBody>{t("mail.mail_please_input_data")}</ModalBody>
        <ModalFooter>
          <BaseButton color={"secondary"} onClick={toggle}>
            {t("mail.project_close_msg")}
          </BaseButton>
        </ModalFooter>
      </Modal>

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

export default SentRestriction
