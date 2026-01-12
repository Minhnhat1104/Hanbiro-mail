// @ts-nocheck
// React
import React, { useEffect, useMemo, useRef, useState } from "react"
import { useTranslation } from "react-i18next"

// Third-party
import { Input } from "reactstrap"

// Project
import { Title } from "components/SettingAdmin"
import BaseTable from "components/Common/BaseTable/index"
import BaseIcon from "components/Common/BaseIcon"
import BaseButton from "components/Common/BaseButton"
import BaseModal from "components/Common/BaseModal"
import Pagination from "components/Common/Pagination"
import { useCustomToast } from "hooks/useCustomToast"
import Loading from "components/Common/Loading"
import { Headers, emailDelete, emailGet, emailPost } from "helpers/email_api_helper"
import { OrgSelectModal } from "components/Common/Org"
import { AliasDomainSelect } from "components/Common/Org/AliasDomainSelect"
import { ALIAS_DOMAIN_USERS } from "modules/mail/admin/url"
import { NoData } from "components/Common"
import useDevice from "hooks/useDevice"
import PaginationV2 from "components/Common/Pagination/PaginationV2"
import { tabOptions } from "components/Common/Org/GroupwareOrgModal"
import FilterPopover from "./FilterPopover"
import FilterComponent from "./component"
import { isEmpty } from "lodash"
import { post } from "helpers/api_helper"
import UserListPopover from "./UserListPopover"

const UsersList = ({ allDomain, isLoading, setIsLoading }) => {
  const { t } = useTranslation()
  const { successToast, errorToast } = useCustomToast()
  const { isMobile } = useDevice()

  // State
  const [userGroup, setUserGroup] = useState(null)
  const [dataUsers, setDataUsers] = useState([])
  const [emails, setEmails] = useState({ selected: {} })
  const initialData = {
    ids: [],
    groups: [],
    domains: [],
  }
  const [updateDomain, setUpdateDomain] = useState(initialData)

  const [checkedIds, setCheckedIds] = useState([])
  const [isCheckedAll, setIsCheckedAll] = useState(false)
  const [page, setPage] = useState(1)

  const [open, setOpen] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)

  const [filterOptions, setFilterOptions] = useState({})
  const [openFilter, setOpenFilter] = useState({ isOpen: false, type: "name" })

  const [userEdit, setUserEdit] = useState("")

  const nameRef = useRef(null)
  const typeRef = useRef(null)
  const domainRef = useRef(null)

  const refFilter = useMemo(() => {
    return {
      name: nameRef?.current,
      type: typeRef?.current,
      domain: domainRef?.current,
    }
  }, [nameRef?.current, typeRef?.current, domainRef?.current])

  useEffect(() => {
    fetchData()
  }, [filterOptions, page])

  useEffect(() => {
    if (userGroup) {
      const newData = Object.values(userGroup?.rows)
      setDataUsers(newData)
    }
  }, [userGroup])

  useEffect(() => {
    if (!isEmpty(updateDomain.groups) || !isEmpty(updateDomain.ids)) {
      if (isEmpty(updateDomain.groups)) {
        getUserEdit()
      } else {
        getGroupEdit()
      }
    }
  }, [updateDomain.groups, updateDomain.ids])

  const onChangePage = (page) => {
    setPage(page)
    setIsCheckedAll(false)
    setCheckedIds([])
  }

  function checkBox(value) {
    const checkAll = value === "checkedAll"
    return (
      <Input
        aria-label="Checkbox for following text input"
        type="checkbox"
        checked={checkAll ? isCheckedAll : checkedIds.some((item) => item?.id === value?.id)}
        onClick={() => {
          if (checkAll) handleSelectAll()
          else handleCheckboxChange(value)
        }}
        onChange={() => {}}
      />
    )
  }

  const heads_group = [
    {
      style: { width: "40px", textAlign: "center" },
      content: checkBox("checkedAll"),
    },
    {
      content: (
        <div className="d-flex gap-1">
          <span>{`${t("mail.mail_fetching_id")} (${t("mail.mailadmin_username")})`}</span>
          <BaseIcon
            innerRef={nameRef}
            icon="mdi mdi-filter"
            onClick={() => setOpenFilter({ isOpen: true, type: "name" })}
          />
        </div>
      ),
    },
    {
      content: (
        <div className="d-flex gap-1">
          <span>{t("mail.mail_cspam_type")}</span>
          <BaseIcon
            innerRef={typeRef}
            icon="mdi mdi-filter"
            onClick={() => setOpenFilter({ isOpen: true, type: "type" })}
          />
        </div>
      ),
    },
    {
      content: (
        <div className="d-flex gap-1">
          <span>{t("mail.mail_admin_receive_domain")}</span>
          <BaseIcon
            innerRef={domainRef}
            icon="mdi mdi-filter"
            onClick={() => setOpenFilter({ isOpen: true, type: "domain" })}
          />
        </div>
      ),
    },
  ]

  const rows = useMemo(() => {
    if (dataUsers) {
      const rows_group = dataUsers.map((item, index) => ({
        class: "align-middle",
        columns: [
          {
            style: { textAlign: "center" },
            content: checkBox({ id: item?.id, cn: item?.cn, type: item?.type }),
          },
          {
            content: (
              <div
                className={`w-100 d-flex justify-content-between ${
                  isMobile ? "flex-column align-items-start" : "align-items-center"
                }`}
              >
                <div className="d-flex align-items-center">
                  {`${item?.id} (${item?.name}) `}
                  <BaseIcon
                    className={"color-green"}
                    icon={"mdi mdi-pencil-box-outline font-size-18"}
                    onClick={() => {
                      let data = {}
                      if (item?.type === "user") {
                        data = {
                          ...updateDomain,
                          ids: [{ cn: item?.cn, id: item?.id }],
                          groups: [],
                          domains: item?.domain,
                        }
                      } else {
                        data = {
                          ...updateDomain,
                          groups: [{ cn: item?.cn, no: item?.id }],
                          ids: [],
                          domains: item?.domain,
                        }
                      }
                      setUpdateDomain(data)
                    }}
                  />
                </div>
                {item?.type === "group" && <UserListPopover t={t} item={item} />}
              </div>
            ),
          },
          {
            content: item?.type,
          },
          {
            content: (
              <>
                {item?.domain.map((domain, index) => (
                  <div key={index}>{domain}</div>
                ))}
              </>
            ),
          },
        ],
      }))
      return rows_group
    }
    return []
  }, [dataUsers, checkedIds, updateDomain])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      // const params = { page: page, ...filterOptions }
      const params = new URLSearchParams()
      params.append("page", page)
      if (!isEmpty(filterOptions)) {
        for (const key in filterOptions) {
          if (key === "domain") {
            filterOptions[key]?.forEach((_item) => {
              params.append("domain", _item)
            })
          } else {
            params.append(key, filterOptions[key])
          }
        }
      }

      const res = await emailGet(ALIAS_DOMAIN_USERS, params)
      if (res?.success) {
        setUserGroup(res)
      }
    } catch (err) {
      errorToast()
      console.log("error messenger", err)
    } finally {
      setIsLoading(false)
    }
  }

  const getUserEdit = async () => {
    const userNo = []
    updateDomain?.ids?.forEach((id) => {
      userNo.push(id?.cn)
      userNo.push(id?.id)
    })
    const params = {
      users_cn_no: [userNo],
      get_by: "id",
    }
    const url = "org/user/get_users"
    try {
      setIsLoading(true)
      const res = await post(url, params, Headers, null, {
        isApiMail: false,
      })
      if (res?.success) {
        const nUser = `${res?.rows?.[0]?.dept}/${res?.rows?.[0]?.id}`
        setUserEdit(nUser)
        setOpenEdit(true)
      }
    } catch (error) {
      errorToast()
    } finally {
      setIsLoading(false)
    }
  }

  const getGroupEdit = async () => {
    const groupNo = []
    updateDomain?.groups?.forEach((group) => {
      groupNo.push(group?.cn)
      groupNo.push(group?.no)
    })
    const params = {
      group_id_cn: groupNo,
    }
    const url = "org/user/get_group_info"
    try {
      setIsLoading(true)
      const res = await post(url, params, Headers, null, {
        isApiMail: false,
      })
      if (res?.success) {
        setUserEdit(res?.rows?.name || "")
        setOpenEdit(true)
      }
    } catch (error) {
      errorToast()
    } finally {
      setIsLoading(false)
    }
  }

  // function Checked Users (Group)
  const handleCheckboxChange = (value) => {
    const newChecked = checkedIds.some((item) => item.id === value?.id)
      ? checkedIds.filter((v) => v?.id !== value?.id)
      : [...checkedIds, value]

    const isCheckedAll = newChecked.length === dataUsers.length
    setIsCheckedAll(isCheckedAll)
    setCheckedIds(newChecked)
  }
  const handleSelectAll = () => {
    setIsCheckedAll(!isCheckedAll)
    setCheckedIds(
      isCheckedAll
        ? []
        : dataUsers.map((item) => ({ id: item?.id, cn: item?.cn, type: item?.type })),
    )
  }

  const handleUpdateDomain = async (updateData) => {
    try {
      const params = {
        data: JSON.stringify(updateData ? updateData : updateDomain),
      }
      const res = await emailPost(ALIAS_DOMAIN_USERS, params, Headers)
      if (res?.success) {
        successToast()
        setCheckedIds([])
        setOpenEdit(false)
        setUpdateDomain(initialData)
        onRefresh()
      } else {
        errorToast(res?.msg)
      }
    } catch (err) {
      errorToast()
      console.log("error messenger", err)
    }
  }

  const handleDelete = async () => {
    try {
      // convert array to params for call API
      const data = checkedIds.reduce(
        (result, item) => {
          if (item.type === "user") {
            result.ids.push({ cn: item.cn, id: item.id })
          } else if (item.type === "group") {
            result.groups.push({ cn: item.cn, no: item.id })
          }
          return result
        },
        { ids: [], groups: [] },
      )
      const params = {
        data: JSON.stringify(data),
      }
      const res = await emailDelete(ALIAS_DOMAIN_USERS, params, Headers)
      if (res?.success) {
        successToast()
        setCheckedIds([])
        onRefresh()
      } else {
        errorToast(res?.msg)
      }
    } catch (err) {
      errorToast()
      console.log("error messenger", err)
    }
  }

  const handleFilterChange = (data) => {
    const { type, value } = data
    const nType = type === "name" ? "id" : type
    setPage(1)
    setFilterOptions((prev) => ({ ...prev, [nType]: value }))
  }

  const Component = FilterComponent?.[openFilter.type]

  const onRefresh = () => {
    setIsCheckedAll(false)
    fetchData()
  }

  return (
    <>
      <div className="table-list position-relative">
        <div className={`message-navbar ${isMobile ? "gap-0" : ""}`}>
          <Title name={t("mail.alias_domain_user_group")} />
          <div className="write-form d-flex justify-content-end gap-2">
            <BaseButton
              color={"primary"}
              className={`btn-primary m-0`}
              icon={"mdi mdi-plus font-size-18"}
              iconClassName={`m-0`}
              onClick={() => {
                setOpen(true)
                setEmails({ selected: {} })
              }}
              style={{ width: "38px", height: "38px" }}
            />
            {checkedIds.length >= 1 && (
              <BaseButton
                color={"danger"}
                className={`btn-danger m-0`}
                icon={"mdi mdi-trash-can-outline font-size-18"}
                iconClassName={`m-0`}
                onClick={handleDelete}
                style={{ width: "38px", height: "38px" }}
              />
            )}
            <BaseButton
              color="grey"
              className={"btn-action m-0"}
              icon={`mdi mdi-refresh font-size-18`}
              iconClassName={`m-0`}
              onClick={onRefresh}
              loading={isLoading}
              style={{ width: "38px", height: "38px" }}
            />
          </div>
        </div>
        <BaseTable heads={heads_group} rows={rows} />
        {dataUsers.length === 0 && <NoData />}
      </div>

      <div>
        {userGroup && userGroup?.tot > 0 && (
          <PaginationV2
            pageCount={userGroup.tot}
            pageSize={20}
            pageIndex={page}
            onChangePage={onChangePage}
            hideBorderTop={true}
            hideRowPerPage={true}
          />
        )}
      </div>
      {open && (
        <OrgSelectModal
          hideTab
          mode={2}
          open={open}
          emails={emails}
          setOpen={setOpen}
          title={t("common.main_orgtree")}
          orgTabOption={tabOptions}
          setEmails={setEmails}
          onSave={(emails) => {
            console.log("emails:", emails)
            const dataArray = Object.values(emails?.selected)

            // convert to object {ids: [], groups: []}
            const convertedObject = dataArray.reduce(
              (result, item) => {
                if (item.isFolder) {
                  result.groups.push({ cn: item?.cn, no: item?.id || item?.groupno })
                } else {
                  result.ids.push({ cn: item?.cn, id: item?.userid || item?.id })
                }
                return result
              },
              { ids: [], groups: [] },
            )

            // Update data
            if (updateDomain?.domains?.length !== 0) {
              const updateData = { ...updateDomain, ...convertedObject }
              handleUpdateDomain(updateData)
            } else {
              errorToast(t("mail.alias_please_select_domain"))
              setOpen(true)
            }
          }}
          customSectionComponent={
            <AliasDomainSelect
              value={updateDomain?.domains}
              onSelectedDomainChange={(domains) => {
                setUpdateDomain({ ...updateDomain, domains: domains })
              }}
            />
          }
          handleClose={() => setOpen(false)}
        />
      )}

      {openEdit && userEdit && (
        <BaseModal
          isOpen={openEdit}
          toggle={() => {
            setOpenEdit(false)
            setUpdateDomain(initialData)
          }}
          renderHeader={() => {
            return <span>{userEdit}</span>
          }}
          renderBody={() => {
            return (
              <div>
                <AliasDomainSelect
                  onSelectedDomainChange={(domains) => {
                    setUpdateDomain({ ...updateDomain, domains: domains })
                  }}
                  value={updateDomain?.domains}
                />
              </div>
            )
          }}
          renderFooter={() => {
            return (
              <div className="action-form">
                <BaseButton
                  color={"primary"}
                  className={"btn btn-block"}
                  type="button"
                  onClick={() => handleUpdateDomain()}
                >
                  {t("common.common_btn_save")}
                </BaseButton>
                <BaseButton
                  className={"btn btn-action btn-block "}
                  type="button"
                  onClick={() => {
                    setOpenEdit(false)
                    setUpdateDomain(initialData)
                  }}
                >
                  {t("common.common_cancel")}
                </BaseButton>
              </div>
            )
          }}
          footerClass="justify-content-center"
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
              value={filterOptions?.[openFilter.type]}
              onChange={handleFilterChange}
              allDomain={openFilter.type === "domain" && allDomain}
            />
          }
          onClose={() => setOpenFilter((prev) => ({ ...prev, isOpen: false }))}
        />
      )}
    </>
  )
}

export default UsersList
