// @ts-nocheck
// React
import React, { useEffect, useMemo, useRef, useState } from "react"
import { useTranslation } from "react-i18next"

// Third-party
import { Card, Input } from "reactstrap"

// Project
import { Title } from "components/SettingAdmin"
import BaseButton from "components/Common/BaseButton"
import BaseTable from "components/Common/BaseTable/index"
import BaseIcon from "components/Common/BaseIcon"
import { useCustomToast } from "hooks/useCustomToast"
import {
  Headers,
  emailDelete,
  emailGet,
  emailPost,
  formDataUrlencoded,
} from "helpers/email_api_helper"
import Loading from "components/Common/Loading"
import AddForm from "./AddForm"
import { HIDDEN_FORWARDING } from "modules/mail/admin/url"
import "./style.css"
import { NoData } from "components/Common"
import MainHeader from "pages/SettingMain/MainHeader"
import Toolbar from "../../SettingMain/Toolbar"
import PaginationV2 from "components/Common/Pagination/PaginationV2"
import FilterPopover from "../AliasDomain/UsersList/FilterPopover"
import FilterComponent from "./FilterComponent"
import { isArray, isEmpty, isObject } from "lodash"

const HideForwarding = (props) => {
  const { routeConfig } = props
  const { t } = useTranslation()
  const { successToast, errorToast } = useCustomToast()

  /**
   * @author: H.Phuc <hoangphuc@hanbiro.vn> - @since: 2024-08-09
   * @ticket: ngw-v2-237125
   * API return paginate data is not true so remove UI paginate
   */
  const paging = {
    linenum: 1000,
    page: 1,
  }
  const [data, setData] = useState()
  const [itemUpdate, setItemUpdate] = useState({})

  // State checkbox
  const [checkedIds, setCheckedIds] = useState([])
  const [isCheckedAll, setIsCheckedAll] = useState(false)

  // State Loading
  const [isLoading, setIsLoading] = useState(false)
  const [refetch, setRefetch] = useState(true)

  const [filterOptions, setFilterOptions] = useState({})
  const [openFilter, setOpenFilter] = useState({ isOpen: false, type: "manager", key: "managerid" })

  const managerRef = useRef(null)
  const userRef = useRef(null)
  const infoRef = useRef(null)

  const refFilter = useMemo(() => {
    return {
      manager: managerRef?.current,
      user: userRef?.current,
      info: infoRef?.current,
    }
  }, [managerRef?.current, userRef?.current, infoRef?.current])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const params = {
          linenum: paging.linenum,
          page: paging.page,
          ...getParamFromFilter(filterOptions),
        }
        const res = await emailGet(HIDDEN_FORWARDING, params)
        if (res?.success) {
          if (Object.keys(res.rows).length === 0) {
            res.tot = 0
          }
          setData(res)
        } else {
          errorToast(res?.msg)
        }
      } catch (err) {
        errorToast()
        console.log("error messenger", err)
      } finally {
        setIsLoading(false)
      }
    }
    if (refetch) {
      fetchData()
      setRefetch(false)
    }
  }, [refetch])

  const renderInforSet = (row) => {
    var text = []
    if (row.tooutside == "y") text.push("Send Mail (to outside)")
    if (row.toinside == "y") text.push("Recieve Mail")
    if (row.isfile == "y") text.push("including attachments ( cloud attachments )")

    return text.join(", ")
  }

  const heads = [
    { content: checkBox("checkedAll") },
    {
      content: (
        <div className="d-flex gap-1">
          <span>{t("mail.task_main_manager")}</span>
          <BaseIcon
            innerRef={managerRef}
            icon="mdi mdi-filter"
            onClick={() => setOpenFilter({ isOpen: true, type: "manager", key: "managerid" })}
          />
        </div>
      ),
    },
    {
      content: (
        <div className="d-flex gap-1">
          <span>{t("mail.mail_admin_spam_manager_users") + "(" + t("mail.mail_groups") + ")"}</span>
          <BaseIcon
            innerRef={userRef}
            icon="mdi mdi-filter"
            onClick={() => setOpenFilter({ isOpen: true, type: "user", key: "id" })}
          />
        </div>
      ),
    },
    {
      content: (
        <div className="d-flex gap-1">
          <span>{t("mail.mail_set_information")}</span>
          <BaseIcon
            innerRef={infoRef}
            icon="mdi mdi-filter"
            onClick={() => setOpenFilter({ isOpen: true, type: "info" })}
          />
        </div>
      ),
    },
  ]

  const rows = useMemo(() => {
    if (data?.rows) {
      const rowsData = Object.values(data?.rows).map((item) => ({
        class: "align-middle",
        columns: [
          { content: checkBox(item?.managerid) },
          {
            content: (
              <div className="d-flex align-items-center">
                {item?.managerid}
                &nbsp;
                <BaseIcon
                  className={"color-green"}
                  icon={"fas fa-edit"}
                  onClick={() => {
                    toggleModal()
                    setItemUpdate(item)
                  }}
                />
              </div>
            ),
          },
          {
            content: (
              <div>
                {item?.ids &&
                  item?.ids.map((user, idx) => (
                    <div key={idx}>
                      <BaseIcon
                        icon={`mdi ${
                          user?.type === "user" ? "mdi-account" : "mdi-account-multiple"
                        }`}
                      />
                      &nbsp;
                      {user?.name}
                    </div>
                  ))}
              </div>
            ),
          },
          { content: renderInforSet(item) },
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
          else {
            handleCheckboxChange(value)
          }
        }}
        onChange={() => {}}
      />
    )
  }

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
    setCheckedIds(isCheckedAll ? [] : Object.values(data?.rows).map((item) => item?.managerid))
  }

  const [togModal, setTogModal] = useState(false)

  function toggleModal() {
    setTogModal(!togModal)
  }

  // Update Hide Forwarding
  const handleUpdate = async (data) => {
    try {
      const params = {
        data: JSON.stringify(data),
      }

      const res = await emailPost(HIDDEN_FORWARDING, formDataUrlencoded(params), Headers)
      if (res?.success) {
        successToast()
        toggleModal()
        setRefetch(true)
      } else {
        // setAlert(res?.msg)
      }
    } catch (err) {
      errorToast()
      console.log("error messenger", err)
    }
  }
  // Delete Approval Policy
  const handleDelete = async () => {
    try {
      const params = {
        data: JSON.stringify({
          managerids: checkedIds,
        }),
      }
      const res = await emailDelete(HIDDEN_FORWARDING, params)
      successToast()
      setRefetch(true)
      setCheckedIds([])
      setIsCheckedAll(false)
    } catch (err) {
      console.log("error messenger", err)
      errorToast()
    }
  }

  // handle filter
  const Component = FilterComponent?.[openFilter.type]
  const handleFilterChange = (data) => {
    const { type, value } = data
    const nType = type === "manager" ? "managerid" : type === "user" ? "id" : type
    setFilterOptions((prev) => ({ ...prev, [nType]: value }))
    setRefetch(true)
  }

  const getParamFromFilter = (filter) => {
    if (!isObject(filter)) return
    let nFilter = {}
    Object.keys(filter).forEach((key) => {
      if (key === "info") {
        if (isArray(filter[key]) && !isEmpty(filter[key])) {
          filter[key].forEach((item) => {
            nFilter[item] = "y"
          })
        } else {
          delete nFilter.toinside
          delete nFilter.tooutside
          delete nFilter.isfile
        }
      } else {
        nFilter[key] = filter[key] ? filter[key] : undefined
      }
    })
    return nFilter
  }

  return (
    <>
      <MainHeader currentTitleMenu={routeConfig?.keyTitle} />
      <Toolbar
        // start={<Title name={t("mail.asset_manager_user")} />}
        end={
          <>
            <BaseButton
              color={"primary"}
              className={`m-0 border-0`}
              icon={"mdi mdi-plus font-size-18"}
              iconClassName={`m-0`}
              onClick={() => {
                toggleModal()
                setItemUpdate({})
              }}
              style={{ width: "38px", height: "38px" }}
            />
            {checkedIds?.length > 0 && (
              <BaseButton
                color={"danger"}
                className={`m-0 border-0`}
                icon={"mdi mdi-trash-can-outline font-size-18"}
                iconClassName={`m-0`}
                onClick={handleDelete}
                style={{ width: "38px", height: "38px" }}
              />
            )}
            <BaseButton
              outline
              color={`grey`}
              className={"btn-outline-grey btn-action"}
              icon={`mdi mdi-refresh font-size-18`}
              iconClassName={`m-0`}
              onClick={() => {
                setRefetch(true)
              }}
              loading={isLoading}
              style={{ width: "38px", height: "38px" }}
            ></BaseButton>
          </>
        }
      />
      <div className={`w-100 h-100 overflow-hidden`}>
        <div className={`w-100 h-100`}>
          <div
            className="overflow-auto"
            style={{ height: data?.tot === 0 ? 40 : "calc(100% - 40px)" }}
          >
            <BaseTable heads={heads} rows={rows} />
          </div>
          {data?.tot === 0 ? (
            <NoData />
          ) : (
            <div className="pt-2">
              {/* <PaginationV2
                pageCount={data?.tot || 0}
                pageSize={paging?.linenum}
                pageIndex={paging?.page}
                onChangePage={(page) => {
                  setPaging((prev) => ({ ...prev, page }))
                  setRefetch(true)
                }}
                setPageSize={(type, linenum) => {
                  setPaging((prev) => ({ ...prev, linenum }))
                  setRefetch(true)
                }}
                hideBorderTop={true}
              /> */}
            </div>
          )}
          {isLoading && <Loading />}
        </div>
      </div>

      {togModal && (
        <AddForm
          isOpen={togModal}
          toggleModal={() => {
            toggleModal()
            setItemUpdate({})
          }}
          itemUpdate={itemUpdate}
          handleUpdate={handleUpdate}
        />
      )}

      {openFilter.isOpen && (
        <FilterPopover
          type={openFilter.type}
          isOpen={openFilter.isOpen}
          anchorEl={refFilter[openFilter.type]}
          id={`alias-domain-filter-${openFilter.type}`}
          contentComponent={
            <Component
              value={filterOptions?.[openFilter?.key ?? openFilter?.type]}
              onChange={handleFilterChange}
            />
          }
          onClose={() => setOpenFilter((prev) => ({ ...prev, isOpen: false }))}
        />
      )}
    </>
  )
}

export default HideForwarding
