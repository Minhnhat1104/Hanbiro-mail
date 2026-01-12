// @ts-nocheck
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { Input } from "reactstrap"

import clsx from "clsx"

import useDevice from "hooks/useDevice"

import ItemTree from "./RenderTree"
import "./style.scss"
import * as api from "./api"
import { getEmail, TYPE_TREE, unCheckedParentFolder } from "./utils"
import useOrgTree from "./hooks/useOrgTree"
import { isArray, isEmpty } from "lodash"

const onGetOrg = api.onGetOrg

export const tabOptions = {
  [TYPE_TREE.organization]: {
    name: "common.approval_line_org", // Organization
    types: [
      {
        id: TYPE_TREE.department,
        name: "common.approval_user_post", // Department
      },
      {
        id: TYPE_TREE.position,
        name: "common.holiday_grade", // Position
      },
      {
        id: TYPE_TREE.alias,
        name: "mail.mail_alias", // Alias Account
      },
    ],
  },
  [TYPE_TREE.contacts]: {
    name: "common.board_addressbook_msg", // Contacts
    types: [],
  },
}

function OrgTreeV2(
  {
    tabChoosed,
    setTabChoosed,
    typeTreeChoosed,
    setTypeTreeChoosed,
    selectTab = [],
    setOpen = () => {},
    orgOptions = tabOptions,
    deptsSelected,
    onChangeSelectDept,
    usersSelected,
    onChangeSelectUser,
    onOrgTabChange,
    onOrgConfigChange,
    isSingle = false,
    handleSingleSelect,
    classNames = "",
    typeSelection,
    isOnlyUser,
    hideTab = false,
    APIParams = {},
  },
  ref,
) {
  const { t } = useTranslation()
  const { isMobile } = useDevice()

  const {
    configOrg,
    tabChoosed: newTabChoosed,
    typeTreeChoosed: newTypeTreeChoosed,
    firstLoading,
    keyword,
    departments,
    getOrg,
    setKeyword,
    onChangeTab,
    onChangeType,
    renderLoading,
  } = useOrgTree({ tabChoosed, typeTreeChoosed, APIParams })

  // State
  const [departmentChoosed, setDepartmentChoosed] = useState(deptsSelected || {})
  const [userChoosed, setUserChoosed] = useState(usersSelected || {})

  // Ref
  const allRef = useRef({})

  useEffect(() => {
    if (newTabChoosed) {
      setTabChoosed && setTabChoosed(newTabChoosed)
    }
    if (newTypeTreeChoosed) {
      setTypeTreeChoosed && setTypeTreeChoosed(newTypeTreeChoosed)
    }
  }, [newTabChoosed, newTypeTreeChoosed])

  useEffect(() => {
    getOrg()
    handleClose()
    if (onOrgConfigChange) {
      onOrgConfigChange(configOrg)
    }
  }, [configOrg])

  const handleClose = () => {
    setDepartmentChoosed({})
    setUserChoosed({})
    // setUsers({});
    setOpen(false)
  }

  // Handle choose a folder or a user
  const handleChoose = (item, checked, children) => {
    const departmentChoosedNew = { ...departmentChoosed }
    const userChoosedNew = { ...userChoosed }

    if (isArray(item)) {
      item.forEach((_item) => {
        if (checked) {
          if (_item.isFolder) {
            departmentChoosedNew[_item.key] = _item
          } else {
            const key = typeSelection === "selected" ? _item.key : getEmail(_item)
            userChoosed[key] = _item
          }
        } else {
          if (_item.isFolder) {
            delete departmentChoosedNew[_item.key]
          } else {
            const key = typeSelection === "selected" ? _item.key : getEmail(_item)
            delete userChoosed[key]
          }
        }
      })
    } else {
      if (checked) {
        if (item.isFolder) {
          departmentChoosedNew[item.key] = item
          if (!isEmpty(children) && isArray(children)) {
            children.forEach((child) => {
              if (child.isFolder) {
                departmentChoosedNew[child.key] = child
              } else {
                const uKey = typeSelection === "selected" ? child.key : getEmail(child)
                userChoosed[uKey] = child
              }
            })
          }
        } else {
          const key = typeSelection === "selected" ? item.key : getEmail(item)
          userChoosed[key] = item
        }
      } else {
        if (item.isFolder) {
          delete departmentChoosedNew[item.key]
          const nKey = unCheckedParentFolder(item, departmentChoosedNew)
          if (nKey) {
            delete departmentChoosedNew[nKey]
          }
          if (!isEmpty(children) && isArray(children)) {
            children.forEach((child) => {
              if (child.isFolder) {
                delete departmentChoosedNew[child.key]
              } else {
                const uKey = typeSelection === "selected" ? child.key : getEmail(child)
                delete userChoosed[uKey]
              }
            })
          }
        } else {
          const key = typeSelection === "selected" ? item.key : getEmail(item)
          delete userChoosed[key]
          const nKey = unCheckedParentFolder(item, departmentChoosedNew)
          if (nKey) {
            delete departmentChoosedNew[nKey]
          }
        }
      }
    }

    setDepartmentChoosed(departmentChoosedNew)
    onChangeSelectDept && onChangeSelectDept(departmentChoosedNew)
    setUserChoosed(userChoosed)
    onChangeSelectUser && onChangeSelectUser(userChoosed)
    allRef.current = { ...departmentChoosedNew, ...userChoosedNew }
  }

  useImperativeHandle(
    ref,
    () => {
      return {
        resetCheck: () => {
          setDepartmentChoosed({})
          setUserChoosed({})
        },
      }
    },
    [],
  )

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      e.stopPropagation()
      getOrg()
      handleClose()
    }
  }
  const renderContent = () => {
    return (
      <ul className={clsx("ul", "ztree")}>
        {departments.map((department, index) => (
          <ItemTree
            key={index}
            isExpand={
              (!department?.is_favorite_root || (department?.is_favorite_root && keyword !== "")) &&
              !isEmpty(department?.children)
            }
            isBottom={index == departments.length - 1}
            department={department}
            onGetOrg={onGetOrg}
            isSelectBox={!isSingle}
            handleChoose={handleChoose}
            handleSingleSelect={handleSingleSelect}
            configOrg={configOrg}
            departmentChoosed={departmentChoosed}
            userChoosed={userChoosed}
            typeSelection={typeSelection}
            isOnlyUser={isOnlyUser}
            tabChoosed={newTabChoosed}
          />
        ))}
      </ul>
    )
  }

  const renderTab = useMemo(() => {
    return Object.keys(orgOptions).map((tab) => {
      return (
        <li key={tab} className={`nav-item rounded-1`}>
          <a
            className={`nav-link ${newTabChoosed === tab ? "active" : ""}`}
            id="home-tab5"
            data-toggle="tab"
            href="#home5"
            role="tab"
            aria-controls="home"
            aria-selected="true"
            onClick={() => onChangeTab(tab)}
          >
            <span className="han-h4 han-fw-regular">{t(orgOptions[tab].name)}</span>
          </a>
        </li>
      )
    })
  }, [newTabChoosed, orgOptions])

  const renderTabTypes = useMemo(() => {
    return orgOptions[newTabChoosed].types?.map((typeTree) => (
      <div key={typeTree.id} className="">
        <div className="custom-control custom-radio d-flex align-items-center gap-1">
          <Input
            type="radio"
            id={typeTree.id}
            name="customRadio"
            className="mt-0 custom-control-input form-radio-secondary "
            checked={newTypeTreeChoosed === typeTree.id}
            onClick={() => onChangeType(typeTree)}
            // onChange={() => onChangeType(typeTree)}
            onChange={() => {}}
          />
          <label
            className="custom-control-label cursor-pointer"
            htmlFor={typeTree.id}
            style={{
              margin: 0,
            }}
          >
            {t(typeTree.name)}
          </label>
        </div>
      </div>
    ))
  }, [newTabChoosed, orgOptions, newTypeTreeChoosed])

  const renderOrg = () => {
    return <>{firstLoading ? renderLoading() : renderContent()}</>
  }

  return (
    <div className={`org-tree h-100 pd-10 border-1 border rounded-2 p-0 ${classNames}`}>
      <div className=" d-flex flex-column  bd rounded h-100">
        {/* header tab */}
        <div className="border-bottom">
          <ul className="nav nav-tabs-custom nav-line" id="myTab5" role="tablist">
            {renderTab}
          </ul>
        </div>

        {/* select type org */}
        <div
          className={`d-flex ${!hideTab ? "px-3 py-3" : "p-2"} align-items-center px-${
            isMobile ? 2 : 3
          } gap-${isMobile ? 2 : 4}`}
        >
          {!hideTab && renderTabTypes}
        </div>
        {/* search input */}
        <div className="search-form pd-b-15 px-3 border-1 position-relative">
          <button className="position-absolute search-btn" type="button">
            <i className="bx bx-search-alt"></i>
          </button>
          <input
            type="search"
            className="form-control rounded-1 search-input border-1"
            placeholder={`${t("common.common_search")}...`}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={onKeyDown}
          />
        </div>

        {/* org tree */}
        <div className="px-3 pd-b-10 content-tree" style={{ ...(isMobile && { maxHeight: 300 }) }}>
          {renderOrg()}
        </div>
      </div>
    </div>
  )
}

export default forwardRef(OrgTreeV2)
