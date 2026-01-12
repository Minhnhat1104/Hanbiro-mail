// @ts-nocheck
import classNames from "classnames"
// React
import React, { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { BaseButton, BaseButtonDropdown, BaseIcon } from "components/Common"

import { get } from "helpers/api_helper"
import { Headers, emailGet, emailPost } from "helpers/email_api_helper"
import { useCustomToast } from "hooks/useCustomToast"

import {
  SMTP_POP3_IMAP_STATUS_LIST,
  SMTP_POP3_IMAP_ENABLE_SERVICE,
  SMTP_POP3_IMAP_DISABLE_SERVICE,
} from "modules/mail/admin/url"
import { URL_GET_COUNTRY_CODE } from "modules/mail/settings/urls"

// Third-party
import { Input } from "reactstrap"
import BaseTable from "components/Common/BaseTable/index"

import { NoData, Loading } from "components/Common"
import PaginationV2 from "components/Common/Pagination/PaginationV2"
import MainHeader from "pages/SettingMain/MainHeader"

import SearchInput from "components/SettingAdmin/SearchInput"
import { renderLanguage } from "utils"

import StatusContent from "./StatusContent"
import ModalInformation from "./ModalInformation"
import ModalActivation from "./ModalActivation"
import ModalInactive from "./ModalInactive"
import Toolbar from "../../SettingMain/Toolbar"
import Footer from "../../SettingMain/Footer"

const SmtpPop3ImapStatus = (props) => {
  const { routeConfig } = props
  const { t } = useTranslation()
  const { successToast, errorToast } = useCustomToast()

  // State checkbox
  const [data, setData] = useState({})
  const [selectedData, setSelectedData] = useState({})
  const [openModal, setOpenModal] = useState({
    information: false,
    activation: false,
    inactive: false,
  })

  const [checkedIds, setCheckedIds] = useState([])
  const [isCheckedAll, setIsCheckedAll] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [refetch, setRefetch] = useState(true)
  const [countryCode, setCountryCode] = useState(null)

  const limit = 20
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState({
    keyword: "",
    field: "",
  })

  // get Country Code
  const getCountryCode = async () => {
    try {
      const res = await get(URL_GET_COUNTRY_CODE, {}, Headers, undefined, {
        isApiMail: false,
      })
      if (res?.success) {
        let countryCode = {}
        res?.rows?.forEach(function (country) {
          countryCode[country.code] = country.name
        })
        setCountryCode(countryCode)
      } else {
        errorToast()
      }
    } catch (err) {
      errorToast()
    }
  }

  useEffect(() => {
    getCountryCode()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        let field = search.field !== "" ? search.field : "{filter}"
        let keyword = search.keyword !== "" ? search.keyword : "{st}"
        const res = await emailGet(
          [SMTP_POP3_IMAP_STATUS_LIST, page, limit, field, keyword].join("/"),
        )

        setData(res)
        setCheckedIds([])
        setIsLoading(false)
      } catch (err) {
        console.log("error messenger", err)
      }
    }

    if (refetch) {
      fetchData()
      setRefetch(false)
    }
  }, [refetch])

  const heads = useMemo(() => {
    let columns = [
      {
        content: checkBox("checkedAll"),
      },
      {
        content: t("mail.mail_autosetting_name_n"),
      },
      {
        content: t("mail.mail_secure_User_ID"),
      },
      {
        content: t("mail.mail_position"),
      },
      {
        content: t("mail.fax_group"),
      },
      {
        content: renderLanguage("mail.mail_xxx_status", { xxx: "SMTP" }),
      },
      {
        content: renderLanguage("mail.mail_xxx_status", { xxx: "POP3" }),
      },
      {
        content: renderLanguage("mail.mail_xxx_status", { xxx: "IMAP" }),
      },
      {
        content: t("mail.mail_administrator_blocking"),
      },
    ]
    if (data?.isapppasswd) {
      columns.push({
        content: t("mail.mail_app_password"), //isapppasswd
      })
    }
    return columns
  }, [data?.isapppasswd, isCheckedAll, checkBox])

  const onClickStatus = (data) => {
    setSelectedData(data)
    setOpenModal({ ...openModal, info: true })
  }

  const rows = useMemo(() => {
    if (data?.raws) {
      const rowsData = Object.values(data?.raws).map((item) => ({
        class: "align-middle",
        columns: [
          {
            content: checkBox(item?.id),
          },
          {
            content: <div>{item?.name}</div>,
          },
          {
            content: <div>{item?.id}</div>,
          },
          {
            content: <div>{item?.posname}</div>,
          },
          {
            content: <div>{item?.groupinfo?.join(",")}</div>,
          },
          {
            content: (
              <StatusContent t={t} item={item} type={"smtp"} onClickStatus={onClickStatus} />
            ),
          },
          {
            content: (
              <StatusContent t={t} item={item} type={"pop3"} onClickStatus={onClickStatus} />
            ),
          },
          {
            content: (
              <StatusContent t={t} item={item} type={"imap"} onClickStatus={onClickStatus} />
            ),
          },
          {
            content: (
              <div className={"d-flex align-items-center"}>
                <BaseIcon
                  className={classNames("font-size-8", {
                    "color-orange": item?.managerblock == true,
                    "color-gray": item?.managerblock == false,
                  })}
                  icon={"fas fa-circle me-1"}
                />
                {getManagerStatusMessage(item?.managerblock)}
              </div>
            ),
          },
          {
            content: (
              <div className={"d-flex align-items-center"}>
                <BaseIcon
                  className={classNames("font-size-8", {
                    "color-red": item?.apppasswd == 2,
                    "color-green": item?.apppasswd == 1,
                    "color-orange": item?.apppasswd == 0,
                  })}
                  icon={"fas fa-circle me-1"}
                />
                {getMessageAppPassword(item?.apppasswd)}
              </div>
            ),
          },
        ],
      }))
      return rowsData
    }
    return []
  }, [data, checkedIds])

  const onClickActiveInactive = (isActive = true) => {
    let newSelectedData = {}
    Object.values(data?.raws).map((item) => {
      if (checkedIds.includes(item.id)) {
        item.username = item.id + " (" + item?.name + ")"
        newSelectedData[item.id] = item
      }
    })
    setSelectedData(newSelectedData)
    if (isActive) {
      setOpenModal({ ...openModal, activation: true })
    } else {
      setOpenModal({ ...openModal, inactive: true })
    }
  }

  const handleUpdateActivation = async (params) => {
    const res = await emailPost(SMTP_POP3_IMAP_ENABLE_SERVICE, params, Headers)
    if (res?.success) {
      successToast()
      setOpenModal({ ...openModal, activation: false })
      setCheckedIds([])
      setRefetch(true)
    } else {
      errorToast(res?.msg)
    }
  }

  const handleUpdateInactive = async (params) => {
    const res = await emailPost(SMTP_POP3_IMAP_DISABLE_SERVICE, params, Headers)
    if (res?.success) {
      successToast()
      setOpenModal({ ...openModal, inactive: false })
      setCheckedIds([])
      setRefetch(true)
    } else {
      errorToast(res?.msg)
    }
  }

  const options = [
    {
      value: 1,
      title: t("mail.mail_block_disable_account_for_all_users"),
      onClick: () => {
        onFieldChange("")
      },
    },
    {
      value: 2,
      title: renderLanguage("mail.mail_xxx_account_blocking_users", { xxx: "SMTP" }),
      onClick: () => {
        onFieldChange("smtpblock")
      },
    },
    {
      value: 3,
      title: renderLanguage("mail.mail_xxx_disabled_user", { xxx: "SMTP" }),
      onClick: () => {
        onFieldChange("smtpdisable")
      },
    },
    {
      value: 4,
      title: renderLanguage("mail.mail_xxx_account_blocking_users", { xxx: "POP3" }),
      onClick: () => {
        onFieldChange("pop3block")
      },
    },
    {
      value: 5,
      title: renderLanguage("mail.mail_xxx_disabled_user", { xxx: "POP3" }),
      onClick: () => {
        onFieldChange("pop3disable")
      },
    },
    {
      value: 6,
      title: renderLanguage("mail.mail_xxx_account_blocking_users", { xxx: "IMAP" }),
      onClick: () => {
        onFieldChange("imapblock")
      },
    },
    {
      value: 7,
      title: renderLanguage("mail.mail_xxx_disabled_user", { xxx: "IMAP" }),
      onClick: () => {
        onFieldChange("imapdisable")
      },
    },
    {
      value: 8,
      title: t("mail.mail_administrator_blocks_users"),
      onClick: () => {
        onFieldChange("managerblock")
      },
    },
  ]

  const onFieldChange = (newField) => {
    setPage(1)
    setSearch({ ...search, field: newField })
    setIsCheckedAll(false)
    setCheckedIds([])
    setRefetch(true)
  }

  const onChangePage = (newPage) => {
    setPage(newPage)
    setIsCheckedAll(false)
    setCheckedIds([])
    setRefetch(true)
  }

  const handleSelectAll = () => {
    setIsCheckedAll(!isCheckedAll)
    setCheckedIds(isCheckedAll ? [] : Object.values(data?.raws).map((item) => item?.id))
  }

  const handleCheckboxChange = (value) => {
    const newChecked = checkedIds.includes(value)
      ? checkedIds.filter((v) => v !== value)
      : [...checkedIds, value]

    const isCheckedAll = newChecked.length === Object.values(data?.raws).length
    setIsCheckedAll(isCheckedAll)
    setCheckedIds(newChecked)
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
          else {
            handleCheckboxChange(value)
          }
        }}
        onChange={() => {}}
      />
    )
  }

  function getManagerStatusMessage(status) {
    if (status == true) {
      return t("mail.mail_blocked2")
    } else {
      return t("mail.mail_unblocked")
    }
  }

  function getMessageAppPassword(status) {
    if (status == 0) {
      return t("mail.mail_not_issued")
    } else if (status == 1) {
      return t("mail.mail_issued")
    } else {
      return t("mail.mail_set_pop3_expired")
    }
  }

  return (
    <>
      <MainHeader currentTitleMenu={routeConfig?.keyTitle} />
      <Toolbar
        start={
          <SearchInput
            value={search.keyword}
            onChange={(e) => setSearch({ ...search, keyword: e.target.value })}
            onKeyDown={handleKeyPress}
          />
        }
        end={
          <>
            <BaseButtonDropdown
              options={options}
              color={`grey`}
              className={"btn-action"}
              icon={"mdi mdi-filter font-size-16"}
              iconClassName={`m-0${search.field != "" ? " han-color-primary" : ""}`}
              classDropdown={"dropdown-all"}
              classDropdownToggle={"btn-action d-flex align-items-center justify-content-center"}
              styleToggle={{ width: "38px", height: "38px" }}
            />
            {checkedIds.length > 0 && (
              <BaseButton color={"success"} onClick={() => onClickActiveInactive()}>
                {t("mail.mail_dkim_activation")}
              </BaseButton>
            )}
            {checkedIds.length > 0 && (
              <BaseButton color={"danger"} onClick={() => onClickActiveInactive(false)}>
                {t("mail.mail_inactive")}
              </BaseButton>
            )}
            <BaseButton
              outline
              color={`grey`}
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
        <div className="w-100 h-100 overflow-auto">
          <BaseTable heads={heads} rows={rows} />
          {(data?.tot === 0 || !data?.tot) && <NoData />}
          {isLoading && <Loading />}
        </div>
      </div>

      <Footer
        footerContent={
          data?.tot > 0 && (
            <PaginationV2
              pageCount={data?.tot}
              pageSize={limit}
              pageIndex={page}
              onChangePage={onChangePage}
              hideBorderTop={true}
              hideRowPerPage={true}
            />
          )
        }
      />

      {openModal?.info && (
        <ModalInformation
          isOpen={openModal?.info}
          toggleModal={() => setOpenModal({ ...openModal, info: false })}
          selectedData={selectedData}
          countryCode={countryCode}
        />
      )}
      {openModal?.activation && (
        <ModalActivation
          isAppPassword={data?.isapppasswd}
          isOpen={openModal?.activation}
          toggleModal={() => setOpenModal({ ...openModal, activation: false })}
          selectedData={selectedData}
          handleUpdateActivation={handleUpdateActivation}
        />
      )}
      {openModal?.inactive && (
        <ModalInactive
          isOpen={openModal?.inactive}
          toggleModal={() => setOpenModal({ ...openModal, inactive: false })}
          selectedData={selectedData}
          handleUpdateInactive={handleUpdateInactive}
        />
      )}
    </>
  )
}

export default SmtpPop3ImapStatus
