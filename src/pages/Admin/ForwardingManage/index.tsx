// @ts-nocheck
// React
import React, { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
// Third-party
import classnames from "classnames"
import { Input } from "reactstrap"

import { useCustomToast } from "hooks/useCustomToast"
import { Loading, BaseTable, BaseButton, BaseIcon, HanTooltip, NoData } from "components/Common"
import PaginationV2 from "components/Common/Pagination/PaginationV2"
import SearchInput from "components/SettingAdmin/SearchInput"
import MainHeader from "pages/SettingMain/MainHeader"
import { Headers, emailGet, emailPost } from "helpers/email_api_helper"
import Toolbar from "../../SettingMain/Toolbar"
import Footer from "../../SettingMain/Footer"
import {
  FORWARD_MANAGE_LIST,
  FORWARD_MANAGE_DELETE,
  FORWARD_MANAGE_ADD,
  FORWARD_MANAGE_SET,
} from "modules/mail/admin/url"
import ModalForwardDetail from "./ModalForwardDetail"
import ModalInsertDelete from "./ModalInsertDelete"
import ModalSetSetting from "./ModalSetSetting"

const ForwardingManage = (props) => {
  const { routeConfig } = props
  const { t } = useTranslation()
  const { successToast, errorToast } = useCustomToast()
  // State  checkbox
  const [refetch, setRefetch] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [checkedIds, setCheckedIds] = useState([])
  const [isCheckedAll, setIsCheckedAll] = useState(false)
  const [keyword, setKeyword] = useState("")
  const [isOpenModalInsertDelete, setIsOpenModalInsertDelete] = useState(false)
  const [isOpenModalForwardDetail, setIsOpenModalForwardDetail] = useState(false)
  const [isOpenModalSetSetting, setIsOpenModalSetSetting] = useState(false)

  const [data, setData] = useState()
  const [itemUpdate, setItemUpdate] = useState({})
  const [page, setPage] = useState(1)
  const pageSize = 20

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        let search = keyword != "" ? keyword : "{st}"
        const res = await emailGet(`${FORWARD_MANAGE_LIST}/${page}/${pageSize}/${search}`)
        setData(res)

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

  // Search when enter
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      setKeyword(event.target.value)
      setPage(1)
      setRefetch(true)
    }
  }

  const handleCheckboxChange = (value) => {
    const newChecked = checkedIds.includes(value)
      ? checkedIds.filter((v) => v !== value)
      : [...checkedIds, value]

    const isCheckedAll = newChecked.length === data?.raws?.length
    setIsCheckedAll(isCheckedAll)
    setCheckedIds(newChecked)
  }
  const handleSelectAll = () => {
    setIsCheckedAll(!isCheckedAll)
    setCheckedIds(isCheckedAll ? [] : Object.keys(data?.raws)?.map((key) => data?.raws[key]?.id))
  }

  // Check box
  function checkBox(value) {
    const isChecked = checkedIds.includes(value) || false
    const checkAll = value === "checkedAll"
    return (
      <Input
        type="checkbox"
        checked={checkAll ? isCheckedAll : isChecked}
        onClick={() => {
          if (checkAll) handleSelectAll()
          else handleCheckboxChange(value)
        }}
        onChange={() => {}} // Do not remove
      />
    )
  }

  const onChangePage = (page) => {
    setPage(page)
    setIsCheckedAll(false)
    setCheckedIds([])
    setRefetch(true)
  }

  const formatSetSettingData = () => {
    let settingData = {}
    checkedIds &&
      checkedIds?.length > 0 &&
      checkedIds.map((key) => {
        settingData[key] = data?.raws?.[key]
      })

    setItemUpdate(settingData)
    setIsOpenModalSetSetting(true)
  }

  const handleSetDeleteData = (email) => {
    setItemUpdate({ ...itemUpdate, email: email, isDetail: true })
    setIsOpenModalInsertDelete(true)
  }

  //
  const handleInsertDelete = async (data) => {
    try {
      setIsSaving(true)
      if (data.isInsert) {
        var postData = {
          email: data.email,
          userid: data.id,
          issave: data.isSave === "y",
        }
        const res = await emailPost(FORWARD_MANAGE_ADD, postData, Headers)
        if (res.success) {
          successToast()
          setRefetch(true)
          setIsOpenModalInsertDelete(false)
        } else {
          errorToast(res?.msg)
        }
      } else {
        var postData = {
          email: data.email,
          userid: data.id,
        }
        const res = await emailPost(FORWARD_MANAGE_DELETE, postData, Headers)
        if (res.success) {
          successToast()
          setRefetch(true)
          setIsOpenModalInsertDelete(false)
          if (data?.isDetail) {
            const list = itemUpdate?.forwardlist.filter((item) => item !== data.email)
            setItemUpdate({ ...itemUpdate, forwardlist: list })
          }
        } else {
          errorToast(res?.msg)
        }
      }
    } catch (err) {
      errorToast()
      console.log("error messenger", err)
    } finally {
      setIsSaving(false)
    }
  }

  const handleSetSetting = async (postData) => {
    try {
      setIsSaving(true)
      const res = await emailPost(FORWARD_MANAGE_SET, postData, Headers)
      if (res.success) {
        successToast()
        setRefetch(true)
        setCheckedIds([])
        setIsCheckedAll(false)
        setIsOpenModalSetSetting(false)
      } else {
        errorToast(res?.msg)
      }
    } catch (err) {
      errorToast()
      console.log("error messenger", err)
    } finally {
      setIsSaving(false)
    }
  }

  const heads = [
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
      content: t("mail.asset_status"),
    },
    {
      content: t("mail.mail_whether_to_save"),
    },
    {
      content: t("mail.mail_forwarding_address"),
    },
  ]

  const renderStatus = (isEnable, type) => {
    let result = ""
    if (type == "forward") {
      result = isEnable ? t("mail.mail_set_pop3_use") : t("mail.mail_stop_using")
    } else {
      result = isEnable ? t("mail.project_save_msg") : t("mail.mail_do_not_save")
    }

    return (
      <div className={"d-flex align-items-center"}>
        <span
          className={classnames("cursor-pointer font-size-8 fas fa-circle me-1", {
            "color-red": !isEnable,
            "color-green": isEnable,
          })}
        ></span>
        {result}
      </div>
    )
  }

  const renderForwardList = (item = {}) => {
    const limit = 2
    let newList = item?.forwardlist?.slice(0, limit)
    return (
      <div className={"d-flex align-items-center"}>
        <div className="d-flex">
          {newList &&
            newList?.length > 0 &&
            newList.map((email, idx) => (
              <div
                key={idx}
                className={`rounded h-auto m-1 py-1 px-2 gap-2 han-bg-color-primary-lighter han-color-primary-dark`}
                style={{ minHeight: "28px" }}
              >
                {email}
                <BaseIcon
                  className={"color-red"}
                  icon={"mdi mdi-window-close"}
                  onClick={() => {
                    setItemUpdate({
                      id: item.id,
                      name: item.name,
                      email: email,
                    })
                    setIsOpenModalInsertDelete(true)
                  }}
                />
              </div>
            ))}

          {item?.forwardlist && item?.forwardlist?.length > limit && (
            <HanTooltip overlay={t("common.common_see_more")} placement="bottom">
              <BaseButton
                outline
                color="primary"
                className={"btn-outline-primary m-1"}
                onClick={() => {
                  setItemUpdate(item)
                  setIsOpenModalForwardDetail(true)
                }}
                style={{ width: "28px", height: "28px" }}
              >
                <BaseIcon icon={"mdi mdi-dots-horizontal"} />
              </BaseButton>
            </HanTooltip>
          )}

          <BaseButton
            outline
            color="primary"
            className={"btn-outline-primary m-1"}
            onClick={() => {
              setItemUpdate({
                id: item.id,
                name: item.name,
              })
              setIsOpenModalInsertDelete(true)
            }}
            style={{ width: "28px", height: "28px" }}
          >
            <BaseIcon icon={"mdi mdi-plus"} />
          </BaseButton>
        </div>
      </div>
    )
  }

  const rows = useMemo(() => {
    if (data?.raws) {
      const rowsData = Object.keys(data?.raws).map((key) => {
        let item = data?.raws[key]
        return {
          columns: [
            {
              content: checkBox(item?.id),
            },
            {
              content: item?.name,
            },
            {
              content: item?.id,
            },
            {
              content: item?.posname,
            },
            {
              content: item?.groupinfo.join(", "),
            },
            {
              content: renderStatus(item?.isforward, "forward"),
            },
            {
              content: renderStatus(item?.issave, "save"),
            },
            {
              content: <div className={"d-flex align-items-center"}>{renderForwardList(item)}</div>,
            },
          ],
        }
      })

      return rowsData
    }
    return []
  }, [data?.raws, checkedIds])

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
              onClick={() => formatSetSettingData()}
              style={{ height: "38px" }}
              disabled={checkedIds?.length === 0}
            >
              {t("mail.mail_batch_settings")}
            </BaseButton>

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

      {isOpenModalSetSetting && (
        <ModalSetSetting
          isOpen={isOpenModalSetSetting}
          toggleModal={() => {
            setIsOpenModalSetSetting(!isOpenModalSetSetting)
          }}
          itemUpdate={itemUpdate}
          handleSetSetting={handleSetSetting}
          loading={isSaving}
        />
      )}

      {isOpenModalInsertDelete && (
        <ModalInsertDelete
          isOpen={isOpenModalInsertDelete}
          toggleModal={() => {
            setIsOpenModalInsertDelete(!isOpenModalInsertDelete)
          }}
          itemUpdate={itemUpdate}
          handleInsertDelete={handleInsertDelete}
          loading={isSaving}
        />
      )}

      {isOpenModalForwardDetail && (
        <ModalForwardDetail
          isOpen={isOpenModalForwardDetail}
          toggleModal={() => {
            setIsOpenModalForwardDetail(!isOpenModalForwardDetail)
          }}
          item={itemUpdate}
          setDeleteData={handleSetDeleteData}
        />
      )}
    </>
  )
}

export default ForwardingManage
