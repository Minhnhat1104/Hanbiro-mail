// @ts-nocheck
import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { Input } from "reactstrap"

import clsx from "clsx"

import useDevice from "hooks/useDevice"

import ItemTree from "./RenderTree"
import "./style.scss"
import * as api from "./api"
import { getEmail, TYPE_TREE } from "./utils"
import useOrgTree from "./hooks/useOrgTree"

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

function OrgTree(
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
  } = useOrgTree({ tabChoosed, typeTreeChoosed })

  // State
  const [departmentChoosed, setDepartmentChoosed] = useState(deptsSelected || {})
  const [userChoosed, setUserChoosed] = useState(usersSelected || {})
  const [parentDepartment, setParentDepartment] = useState({})
  const [childrenDepartment, setChildrenDepartment] = useState([])
  const [isCountSelect, setIsCountSelect] = useState(0)

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

  // useEffect(() => {
  //   setDepartmentChoosed(departmentChoosed)
  //   onChangeSelectDept && onChangeSelectDept(departmentChoosed)
  // }, [departmentChoosed])

  // useEffect(() => {
  //   setUserChoosed(userChoosed)
  //   onChangeSelectUser && onChangeSelectUser(userChoosed)
  // }, [userChoosed])

  const handleClose = () => {
    setDepartmentChoosed({})
    setUserChoosed({})
    // setUsers({});
    setOpen(false)
  }

  // Handle add parent folder into departmentChoosed when all children folders are checked following departmentChoosed and userChoosed
  useEffect(() => {
    if (
      Object.keys(parentDepartment).length > 0 &&
      childrenDepartment.length > 0 &&
      Object.keys(allRef.current).length > 0
    ) {
      const isAllChildrenChosen = childrenDepartment.every((child) =>
        allRef.current.hasOwnProperty(child.key),
      )

      setDepartmentChoosed((prev) => {
        const updatedDepartmentChoosed = { ...prev }
        if (isAllChildrenChosen) {
          updatedDepartmentChoosed[parentDepartment.key] = parentDepartment
        } else {
          delete updatedDepartmentChoosed[parentDepartment.key]
        }
        return updatedDepartmentChoosed
      })
      setIsCountSelect(0)
    }
  }, [parentDepartment, isCountSelect, childrenDepartment])

  // Handle choose all folders: parent folder and children folders
  const handleAllChoose = (items, checked) => {
    const departmentChoosedNew = { ...departmentChoosed }
    const userChoosedNew = { ...userChoosed }
    if (checked) {
      items.forEach((item) => {
        if (item.isFolder) {
          departmentChoosedNew[item.key] = item
        } else {
          const key = typeSelection === "selected" ? item.key : getEmail(item)
          userChoosedNew[key] = item
        }
      })
    } else {
      items.forEach((item) => {
        if (item.isFolder) {
          delete departmentChoosedNew[item.key]
        } else {
          const key = typeSelection === "selected" ? item.key : getEmail(item)
          delete userChoosedNew[key]
        }
      })
    }
    setDepartmentChoosed(departmentChoosedNew)
    onChangeSelectDept && onChangeSelectDept(departmentChoosedNew)
    setUserChoosed(userChoosedNew)
    onChangeSelectUser && onChangeSelectUser(userChoosedNew)
    allRef.current = { ...departmentChoosedNew, ...userChoosedNew }
  }

  // Handle choose a folder or a user
  const handleChoose = (item, checked) => {
    const departmentChoosedNew = { ...departmentChoosed }
    const userChoosedNew = { ...userChoosed }
    if (checked) {
      if (item.isFolder) {
        departmentChoosedNew[item.key] = item
      } else {
        const key = typeSelection === "selected" ? item.key : getEmail(item)
        userChoosedNew[key] = item
      }
    } else {
      if (item.isFolder) {
        delete departmentChoosedNew[item.key]
      } else {
        const key = typeSelection === "selected" ? item.key : getEmail(item)
        delete userChoosedNew[key]
      }
    }
    setDepartmentChoosed(departmentChoosedNew)
    onChangeSelectDept && onChangeSelectDept(departmentChoosedNew)
    setUserChoosed(userChoosedNew)
    onChangeSelectUser && onChangeSelectUser(userChoosedNew)
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
            isExpand={false}
            isBottom={index == departments.length - 1}
            department={department}
            onGetOrg={onGetOrg}
            isSelectBox={!isSingle}
            handleChoose={handleChoose}
            handleAllChoose={handleAllChoose}
            setParentDepartment={setParentDepartment}
            setChildrenDepartment={setChildrenDepartment}
            setIsCountSelect={setIsCountSelect}
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
          className={`d-flex px-3 py-3 align-items-center px-${isMobile ? 2 : 3} gap-${
            isMobile ? 2 : 4
          }`}
        >
          {renderTabTypes}
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

export default forwardRef(OrgTree)
