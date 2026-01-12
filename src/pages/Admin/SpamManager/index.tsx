// @ts-nocheck
// React
import React, { useEffect, useMemo, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useTranslation } from "react-i18next"

// Third-party
import { Col, Nav, NavItem, NavLink, Row, TabContent, TabPane, Card, Input } from "reactstrap"

// Project
import classnames from "classnames"
import { Title } from "components/SettingAdmin"
import ToggleSwitch from "components/SettingAdmin/Toggle/index"
import BaseButton from "components/Common/BaseButton"

import BaseTable from "components/Common/BaseTable"
import BaseIcon from "components/Common/BaseIcon"
import { BaseButtonDropdown, NoData, Pagination } from "components/Common"
import { Headers, emailGet, emailPost, formDataUrlencoded } from "helpers/email_api_helper"
import { useCustomToast } from "hooks/useCustomToast"
import { ModalConfirm } from "components/Common/Modal"
import Loading from "components/Common/Loading"
import FilteringStatus from "./FilteringStatus"
import {
  setAdminSpamConfig,
  setAdminUnSpamConfig,
  setClearSpamConfig,
} from "store/adminSetting/actions"
import BlockWhiteForm from "./BlockWhiteForm"
import SearchInput from "components/SettingAdmin/SearchInput"
import SubjectModal from "./SubjectModal"
import { SPAM_MANAGER_FILTER_STATUS } from "modules/mail/admin/url"
import PaginationV2 from "components/Common/Pagination/PaginationV2"
import "components/SettingAdmin/Tabs/style.css"
import MainHeader from "pages/SettingMain/MainHeader"

import "./style.scss"
import Toolbar from "../../SettingMain/Toolbar"
import Footer from "../../SettingMain/Footer"
import FilterPopover from "../AliasDomain/UsersList/FilterPopover"
import { MenuItem, MenuList } from "@mui/material"
import { openComposeMail } from "store/composeMail/actions"
import { composeDataDefaults } from "store/composeMail/reducer"

// init value Status
const STATUS_ALL = "all"
const STATUS_NEW = "new"
const STATUS_DENY = "deny"
const STATUS_PROCESS = "process"

// init value URL
const urlSpam = "CSpamadd"
const urlUnspam = "CSpamremove"

const SpamManager = (props) => {
  const { routeConfig } = props
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { successToast, errorToast } = useCustomToast()

  const searchRef = useRef(null)

  const [data, setData] = useState()
  const [checkedIds, setCheckedIds] = useState([])
  const [isCheckedAll, setIsCheckedAll] = useState(false)
  const [isSwitch, setIsSwitch] = useState(true)
  const [isConfirm, setIsConfirm] = useState("")
  const [openFilterStatus, setOpenFilterStatus] = useState(false)
  const [filter, setFilter] = useState({
    keyword: "",
    msgsig: STATUS_ALL,
    searchfild: "all",
    type: "spam",
    viewcont: "0,15",
  })

  const list = useSelector((state) => state?.AdminSetting?.spamManager[filter.type])
  const composeMails = useSelector((state) => state.ComposeMail.composeMails)
  const composeDisplayMode = composeMails?.localComposeMode

  const initFormSpam = {
    type: "", // email/domain or ip
    mode: "", // block or white (b or w)
    data: "",
    isfrop: "n", // Permanent Delete (y or n)
  }
  const [formSpam, setFormSpam] = useState(initFormSpam)
  const [spamId, setSpamId] = useState({ id: "", subject: "" })

  const pageSize = 15
  const [currencePage, setCurrencePage] = useState({ spam: 1, unspam: 1 })

  // State Loading
  const [isLoading, setIsLoading] = useState(false)
  const [refetch, setRefetch] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const params = filter
        const res = await emailGet(
          `email/list/${filter.type === "spam" ? urlSpam : urlUnspam}`,
          params,
        )
        setData(res)
        if (filter.type === "spam") dispatch(setAdminSpamConfig(res))
        else dispatch(setAdminUnSpamConfig(res))

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
  }, [refetch, filter.type])

  useEffect(() => {
    return () => {
      dispatch(setClearSpamConfig())
    }
  }, [])

  // Dropdown menu
  const moreOptions = [
    {
      value: STATUS_ALL,
      title: t("common.mail_list_search_allfield"),
      onClick: () => {
        setFilter((prev) => ({ ...prev, msgsig: STATUS_ALL }))
        setRefetch(true)
      },
      icon: "",
      iconClassName: "me-1",
    },
    {
      value: STATUS_NEW,
      title: t("mail.mail_cspam_type_new"),
      onClick: () => {
        setFilter((prev) => ({ ...prev, msgsig: STATUS_NEW }))
        setRefetch(true)
      },
      icon: "",
      iconClassName: "me-1",
    },
    {
      value: STATUS_DENY,
      title: t("mail.mail_secure_deny_btn"),
      onClick: () => {
        setFilter((prev) => ({ ...prev, msgsig: STATUS_DENY }))
        setRefetch(true)
      },
      icon: "",
      iconClassName: "me-1",
    },
    {
      value: STATUS_PROCESS,
      title: t("common.common_progress_status"),
      onClick: () => {
        setFilter((prev) => ({ ...prev, msgsig: STATUS_PROCESS }))
        setRefetch(true)
      },
      icon: "",
      iconClassName: "me-1",
    },
  ]

  const menuCustom = [
    {
      title: t("mail.mail_block_text"),
      onClick: () => {
        setFormSpam({ ...formSpam, type: "email", mode: "b" })
      },
      icon: "",
      iconClassName: "me-1",
    },
    {
      title: t("mail.mail_white_text"),
      onClick: () => {
        setFormSpam({ ...formSpam, type: "email", mode: "w" })
      },
      icon: "",
      iconClassName: "me-1",
    },
  ]

  const menuCustomIP = [
    {
      title: t("mail.mail_block_text"),
      onClick: () => {
        setFormSpam({ ...formSpam, type: "ip", mode: "b" })
      },
      icon: "",
      iconClassName: "me-1",
    },
    {
      title: t("mail.mail_white_text"),
      onClick: () => {
        setFormSpam({ ...formSpam, type: "ip", mode: "w" })
      },
      icon: "",
      iconClassName: "me-1",
    },
  ]

  // checkbox
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

  // Table Spam
  const headsSpam = [
    {
      class: "align-middle",
      content: checkBox("checkedAll"),
    },
    {
      class: "align-middle",
      content: t("mail.mail_secure_user_name_msg"),
    },
    {
      class: "align-middle",
      content: t("mail.mail_cspam_spam_from"),
    },
    {
      class: "align-middle",
      content: t("mail.mail_cspam_subject"),
    },
    {
      class: "align-middle",
      content: <BaseIcon icon={"mdi mdi-paperclip font-size-18"} />,
    },
    {
      class: "align-middle",
      content: t("mail.mail_list_sort_size"),
    },
    {
      class: "align-middle",
      content: t("mail.mail_spam_manager_reportdate"),
    },
    {
      class: "align-middle",
      content: (
        <div className="d-flex align-items-center">
          {t("mail.breakdown_State")}
          {/* <BaseButtonDropdown options={moreOptions} iconClassName={"me-0"} /> */}
        </div>
      ),
    },
  ]

  const rowsSpam = useMemo(() => {
    if (data?.maillist) {
      const rows_spam = data?.maillist.map((item) => ({
        class: "align-middle",
        columns: [
          {
            content: checkBox(item?.mid),
          },
          {
            content: item?.spaminfo?.username,
          },
          {
            content: (
              <div>
                <div className="d-flex align-items-center">
                  <div className="han-h5 han-fw-400 han-text-primary">{item?.from_addr} </div>
                  <BaseButtonDropdown
                    options={menuCustom}
                    iconClassName={"me-0 han-color-primary"}
                    onClickToggle={() =>
                      setFormSpam({
                        ...formSpam,
                        data: item?.from_addr,
                      })
                    }
                  />
                </div>
                <div className="d-flex align-items-center">
                  <div className="han-h5 han-fw-400 han-text-primary">{`(${item?.spaminfo?.remoteip}) `}</div>
                  <BaseButtonDropdown
                    options={menuCustomIP}
                    iconClassName={"me-0 han-color-primary"}
                    onClickToggle={() =>
                      setFormSpam({
                        ...formSpam,
                        data: item?.spaminfo?.remoteip,
                      })
                    }
                  />
                </div>
              </div>
            ),
          },
          {
            content: (
              <div className="han-h5 han-fw-400 han-text-primary">
                <a
                  onClick={() => {
                    toggleModalSubject()
                    setSpamId({ id: item?.mid, subject: item?.subject })
                  }}
                  dangerouslySetInnerHTML={{ __html: item?.subject }}
                ></a>
              </div>
            ),
          },
          {
            content: item?.is_file ? <BaseIcon icon={"mdi mdi-paperclip font-size-18"} /> : "",
          },
          {
            content: item?.size,
          },
          {
            content: item?.date,
          },
          {
            content: (
              <div>
                {item?.spaminfo?.status === "p"
                  ? t("mail.mail_cspam_type_process")
                  : item?.spaminfo?.status === "c"
                  ? t("mail.mail_deny_msg")
                  : t("mail.mail_cspam_type_new")}
              </div>
            ),
          },
        ],
      }))
      return rows_spam
    }
    return []
  }, [data, checkedIds, formSpam, spamId])

  // Toggle modal
  const [toggleFilter, setToggleFilter] = useState(false)
  const [toggleSubject, setToggleSubject] = useState(false)

  function toggleModalFilter() {
    setToggleFilter(!toggleFilter)
    removeBodyCss()
  }

  function toggleModalSubject() {
    setToggleSubject(!toggleSubject)
    removeBodyCss()
  }

  function removeBodyCss() {
    document.body.classList.add("no_padding")
  }

  // Check box
  const handleCheckboxChange = (value) => {
    const newChecked = checkedIds.includes(value)
      ? checkedIds.filter((v) => v !== value)
      : [...checkedIds, value]

    const isCheckedAll = newChecked.length === data?.maillist.length
    setIsCheckedAll(isCheckedAll)
    setCheckedIds(newChecked)
  }
  const handleSelectAll = () => {
    setIsCheckedAll(!isCheckedAll)
    setCheckedIds(isCheckedAll ? [] : data?.maillist.map((item) => item?.mid) || [])
  }

  const onChangePage = (page) => {
    const currenceItems = (page - 1) * pageSize
    setCurrencePage({ ...currencePage, [filter.type]: page })
    setFilter((prev) => ({ ...prev, viewcont: `${currenceItems},${pageSize}` }))
    setIsCheckedAll(false)
    setCheckedIds([])
    setRefetch(true)
  }

  // Search when enter
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      setFilter((prev) => ({ ...prev, keyword: event.target.value }))
      setRefetch(true)
    }
  }

  const handleChangeStatus = async (mode, id) => {
    try {
      const params = {
        mode: mode,
        mids: id ? id : checkedIds,
        isspamdb: "y",
      }
      const res = await emailPost("email/spam/spamproc", formDataUrlencoded(params), Headers)
      successToast()
      setCheckedIds([])
      setRefetch(true)
    } catch (err) {
      console.log("error messenger", err)
      errorToast()
    }
  }

  const handleChangeSpamManager = async () => {
    try {
      const urlUseSpam = !isSwitch ? "on" : "off"
      const res = await emailPost(`${SPAM_MANAGER_FILTER_STATUS}/managerset/${urlUseSpam}`, Headers)
      successToast()
      setCheckedIds([])
      setRefetch(true)
    } catch (err) {
      console.log("error messenger", err)
      errorToast()
    }
  }

  const handleComposeMail = (mail) => {
    setToggleSubject(false)
    const composeData = {
      ...composeDataDefaults,
      id: `compose-mail-${composeMails.data.length}`,
      modeType: "",
      composeMode: composeDisplayMode,
      toAddress: [{ label: mail, value: mail }],
    }
    dispatch(openComposeMail(composeData))
  }

  const rightHeader = useMemo(() => {
    return (
      <ToggleSwitch
        title={t("mail.mail_use_spam_manager")}
        checked={isSwitch}
        onChange={() => {
          setIsSwitch(!isSwitch)
          handleChangeSpamManager()
        }}
        position={`right`}
        align={`ee`}
      />
    )
  }, [isSwitch])

  return (
    <>
      <MainHeader currentTitleMenu={routeConfig?.keyTitle} rightHeader={rightHeader} />
      {isSwitch && (
        <>
          <Toolbar
            start={
              <div className="d-flex gap-2 position-relative">
                <SearchInput onKeyDown={handleKeyPress} />
                <div
                  className="position-absolute end-0 top-0 d-flex align-items-center px-2"
                  style={{ height: "38px" }}
                  ref={searchRef}
                  onClick={() => setOpenFilterStatus(true)}
                >
                  <BaseIcon icon={"mdi mdi-filter font-size-18"} className={"han-text-secondary"} />
                </div>
                {openFilterStatus && (
                  <FilterPopover
                    id="spam-manage-search-filter"
                    anchorEl={searchRef?.current}
                    isOpen={openFilterStatus}
                    onClose={() => setOpenFilterStatus(false)}
                    contentComponent={
                      <MenuList sx={{ p: 0 }}>
                        {moreOptions.map((option, index) => (
                          <MenuItem
                            key={option.value}
                            onClick={() => {
                              option.onClick()
                              setOpenFilterStatus(false)
                            }}
                            selected={option.value === filter?.msgsig}
                            sx={{ fontSize: "var(--bs-body-font-size)" }}
                          >
                            {option.title}
                          </MenuItem>
                        ))}
                      </MenuList>
                    }
                  />
                )}
              </div>
            }
            end={
              <>
                {checkedIds.length >= 1 && (
                  <>
                    <BaseButton
                      outline
                      color={`danger`}
                      className={`btn-outline-danger`}
                      onClick={() => setIsConfirm("d")}
                      style={{ height: "38px" }}
                    >
                      {t("mail.mail_deny_msg")}
                    </BaseButton>
                    <BaseButton
                      outline
                      color={`success`}
                      className={`btn-outline-success`}
                      onClick={() => setIsConfirm("p")}
                      style={{ height: "38px" }}
                    >
                      {t("mail.mail_cspam_type_process")}
                    </BaseButton>
                  </>
                )}
                <BaseButton
                  outline
                  color="grey"
                  className={`btn-outline-grey btn-action`}
                  icon={"mdi mdi-filter font-size-18"}
                  iconClassName={`m-0`}
                  onClick={() => {
                    toggleModalFilter()
                  }}
                  style={{ width: "38px", height: "38px" }}
                >
                  {/*<span className="">{t("mail.mail_admin_receive_rules")}</span>*/}
                </BaseButton>
                <BaseButton
                  outline
                  color={`grey`}
                  className={`btn-outline-grey btn-action`}
                  icon={`mdi mdi-refresh font-size-18`}
                  iconClassName={`m-0`}
                  onClick={() => setRefetch(true)}
                  loading={isLoading}
                  style={{ width: "38px", height: "38px" }}
                ></BaseButton>
              </>
            }
          />

          <div className={`w-100 h-100 overflow-hidden`}>
            {/*<Title name={t("mail.mail_admin_uspam_report")} />*/}
            <Nav tabs className={`spam-manager-tab border-0 mb-2`}>
              <NavItem
                active={filter.type === "spam"}
                className={"cursor-pointer"}
                onClick={() => {
                  setFilter((prev) => ({
                    ...prev,
                    type: "spam",
                  }))
                  setCheckedIds([])
                  setIsCheckedAll(false)
                }}
              >
                {t("mail.mail_spam")}
              </NavItem>
              <NavItem
                className={"cursor-pointer"}
                active={filter.type === "unspam"}
                onClick={() => {
                  setFilter((prev) => ({
                    ...prev,
                    type: "unspam",
                  }))
                  setCheckedIds([])
                  setIsCheckedAll(false)
                }}
              >
                {t("mail.mail_unspam")}
              </NavItem>
            </Nav>
            <TabContent
              activeTab={filter.type}
              className={`w-100 overflow-y-auto`}
              style={{ height: "calc(100% - 44px)" }}
            >
              <TabPane tabId="spam">
                <div className={`m-0 w-100 h-100 overflow-x-auto`}>
                  <BaseTable heads={headsSpam} rows={rowsSpam} tableClass={`m-0`} />
                  {data?.maillist.length === 0 && <NoData />}
                  {isLoading && <Loading />}
                </div>
              </TabPane>
              <TabPane tabId="unspam">
                <div className={`m-0 w-100 h-100 overflow-x-auto`}>
                  <BaseTable heads={headsSpam} rows={rowsSpam} tableClass={`m-0`} />
                  {data?.maillist.length === 0 && <NoData />}
                  {isLoading && <Loading />}
                </div>
              </TabPane>
            </TabContent>
          </div>

          <Footer
            footerContent={
              data?.total > 0 && (
                <PaginationV2
                  pageCount={data?.total}
                  pageSize={pageSize}
                  pageIndex={currencePage[filter.type]}
                  onChangePage={onChangePage}
                  hideBorderTop={true}
                  hideRowPerPage={true}
                />
              )
            }
          />

          <ModalConfirm
            isOpen={isConfirm === "p" || isConfirm === "d"}
            toggle={() => setIsConfirm("")}
            onClick={() => {
              setIsConfirm("")
              if (isConfirm === "p") handleChangeStatus("p")
              else handleChangeStatus("d")
            }}
            keyHeader={"common.common_confirm"}
            keyBody={"common.alert_continue_msg"}
          ></ModalConfirm>

          {/* Form Filtering Status */}
          {toggleFilter && (
            <FilteringStatus isOpen={toggleFilter} toggleModal={toggleModalFilter} />
          )}

          {/* Form update Email/IP */}
          {formSpam?.type && (
            <BlockWhiteForm
              isOpen={formSpam.type !== ""}
              toggleModal={() => {
                setFormSpam(initFormSpam)
              }}
              headerTitle={
                formSpam?.type === "subject"
                  ? t("mail.mail_block_keywords")
                  : formSpam?.mode === "b"
                  ? t("Block Rules")
                  : t("White Rules")
              }
              formSpam={formSpam}
              setFormSpam={setFormSpam}
            />
          )}

          {/* Form Subject */}
          {toggleSubject && (
            <SubjectModal
              spamId={spamId}
              isOpen={toggleSubject}
              toggleModal={() => {
                toggleModalSubject()
                setSpamId("")
              }}
              setFormSpam={setFormSpam}
              handleChangeStatus={handleChangeStatus}
              handleComposeMail={handleComposeMail}
            />
          )}
        </>
      )}
    </>
  )
}

export default SpamManager
