// @ts-nocheck
import React, { memo, useState, useMemo, useRef, useEffect } from "react"
import { Input } from "reactstrap"

import { CircularProgress } from "@mui/material"

import { ORG_ICON } from "./orgTreeIcon"
import { optimizeDepartments, getEmail, TYPE_TREE } from "./utils"
import "../HanOrganizationNew/style.scss"
import { isEmpty } from "lodash"

export const Department = memo(function Department(props) {
  const inputRef = useRef(null)
  const {
    isBottom,
    department,
    onGetOrg,
    handleChoose,
    configOrg,
    isSelectBox = true,
    handleSingleSelect,
    activeFolder = "",
    departmentChoosed = {},
    userChoosed = {},
    typeSelection,
    isOnlyUser,
    tabChoosed,
    keyword,
  } = props

  const [loading, setLoading] = useState(false)
  const [isExpand, setIsExpand] = useState(() => props.isExpand)
  const [children, setChildren] = useState(() => (department.children ? department.children : []))

  const { title, isLazy, key } = department

  const isChecked = useMemo(() => {
    return Object.keys(departmentChoosed)?.includes(department.key)
  }, [departmentChoosed])

  const isCheckedAllChildren = useMemo(() => {
    if (!isEmpty(children)) {
      const deptKeyArr = Object.keys(departmentChoosed)
      const userKeyArr = Object.keys(userChoosed)?.map((_key) => _key?.split(" ")[0])

      return children.every(
        (child) => deptKeyArr.includes(child.key) || userKeyArr.includes(child.key),
      )
    }
    return false
  }, [children, departmentChoosed, userChoosed])

  useEffect(() => {
    if (isCheckedAllChildren) {
      if (!Object.keys(departmentChoosed)?.includes(department.key)) {
        handleChoose && handleChoose({ ...department, isExpand: isExpand }, true)
      }
    } else {
      if (Object.keys(departmentChoosed)?.includes(department.key)) {
        handleChoose && handleChoose(department, false)
      }
    }
  }, [isCheckedAllChildren])

  useEffect(() => {
    if (!isEmpty(children) && isExpand) {
      if (isChecked) {
        !isCheckedAllChildren && handleChoose && handleChoose(children, true)
      } else {
        isCheckedAllChildren && handleChoose && handleChoose(children, false)
      }
    }
  }, [isChecked, isExpand])

  const getClassName = () => {
    if (isBottom) {
      if (isExpand) {
        return "bottom_open"
      } else {
        return "bottom_close"
      }
    } else {
      if (isExpand) {
        return "roots_open"
      } else {
        return "roots_close"
      }
    }
  }

  const Icon = useMemo(() => {
    if (isBottom) {
      if (isExpand) {
        return ORG_ICON.openIcon
      } else {
        return ORG_ICON.closeIcon
      }
    } else {
      if (isExpand) {
        return ORG_ICON.openIcon
      } else {
        return ORG_ICON.closeIcon
      }
    }
  }, [isBottom, isExpand])

  const getClassNameFolder = () => {
    if (isExpand) {
      return "ico_open"
    } else {
      return "ico_close"
    }
  }

  const folderIcon = useMemo(() => {
    if (isExpand) {
      return ORG_ICON.folderOpenIcon
    } else {
      return ORG_ICON.folderCloseIcon
    }
  }, [isExpand])

  const lazyLoad = () => {
    if (isLazy || department?.children !== undefined) {
      if (children.length === 0) {
        if (isExpand) {
          setIsExpand(!isExpand)
        } else {
          setLoading(true)
          const getOrg = async () => {
            const params = configOrg.expand.params({ idURL: key })
            const response = await configOrg.expand.api(params)
            if (response && response.success) {
              const departmentModel = optimizeDepartments(response.rows)
              if (departmentModel && departmentModel.length > 0) {
                setChildren(departmentModel)
              }
              setIsExpand(true)
              setLoading(false)
            }
          }
          getOrg()
        }
      } else {
        setIsExpand(!isExpand)
      }
    } else {
      handleChoose && handleChoose(department)
    }
  }

  return (
    <li className="">
      {loading ? (
        <span
          onClick={lazyLoad}
          className={`button justify-content-center align-items-center`}
          style={{
            width: 24,
            backgroundImage: "none",
            padding: 5,
            display: "inline-flex",
          }}
        >
          <CircularProgress size={10} style={{ color: "var(--bs-primary)" }} />
        </span>
      ) : (
        <span
          onClick={lazyLoad}
          className={`button switch ${getClassName()}`}
          style={{ backgroundImage: "none" }}
        >
          {(isLazy || children.length > 0) && Icon}
        </span>
      )}

      <a className="cursor-pointer user-select-none align-content-center" style={{ height: 24 }}>
        {!isOnlyUser && isSelectBox && (
          <Input
            type="checkbox"
            innerRef={inputRef}
            style={{ marginLeft: 5, marginRight: 5, marginTop: 2 }}
            onChange={(event) => {
              handleChoose &&
                handleChoose(
                  { ...department, isExpand: isExpand },
                  event.target.checked,
                  isExpand ? children : undefined,
                )
            }}
            checked={isChecked}
          />
        )}
        <span
          className={`button m-0 icon-folder ${getClassNameFolder()} user-select-none`}
          style={{ width: 24, backgroundImage: "none" }}
          onClick={(e) => {
            if (isSelectBox) {
              inputRef.current?.click()
            } else {
              lazyLoad()
            }
          }}
        >
          {folderIcon}
        </span>
        <span
          className={`px-1 ${
            activeFolder === department?.key ? "han-bg-color-primary-lighter" : ""
          } ${
            isExpand ||
            (departmentChoosed && Object.keys(departmentChoosed).includes(department.key))
              ? "han-fw-regular han-color-primary"
              : "han-fw-regular han-text-primary"
          }`}
          onClick={(e) => {
            if (isSelectBox) {
              inputRef.current?.click()
            } else {
              lazyLoad()
            }
          }}
        >
          {title}
        </span>
      </a>
      {children && (
        <ul
          className="line"
          style={{
            display: isExpand ? "block" : "none",
          }}
        >
          {children.map((department, index) => (
            <ItemTree
              key={index}
              isExpand={
                (!department?.is_favorite_root ||
                  (department?.is_favorite_root && keyword !== "")) &&
                !isEmpty(department?.children)
              }
              isBottom={index == children.length - 1}
              department={department}
              onGetOrg={onGetOrg}
              handleChoose={handleChoose}
              configOrg={configOrg}
              isSelectBox={isSelectBox}
              handleSingleSelect={handleSingleSelect}
              activeFolder={activeFolder}
              departmentChoosed={departmentChoosed}
              userChoosed={userChoosed}
              typeSelection={typeSelection}
              isOnlyUser={isOnlyUser}
              tabChoosed={tabChoosed}
            />
          ))}
        </ul>
      )}
    </li>
  )
})

export const User = memo(function User(props) {
  const inputRef = useRef(null)
  const {
    isBottom,
    department,
    handleChoose,
    isSelectBox,
    handleSingleSelect,
    userChoosed,
    typeSelection,
  } = props
  const { title } = department
  const key = typeSelection === "selected" ? department?.key : getEmail(department)
  const getClassName = () => {
    if (isBottom) {
      return "bottom_docu"
    } else {
      return "center_docu"
    }
  }
  return (
    <li className="level2">
      <span className={`button level2 switch ${getClassName()}`}></span>
      <a className="level2 user-select-none align-content-center">
        {isSelectBox && (
          <Input
            type="checkbox"
            innerRef={inputRef}
            style={{ marginLeft: 5, marginRight: 5, marginTop: 2 }}
            onChange={(event) => {
              handleChoose(department, event.target.checked)
            }}
            checked={Object.keys(userChoosed).includes(key)}
          />
        )}
        <span
          className="button ico_docu"
          style={{
            backgroundImage: "none",
          }}
          onClick={(e) => {
            if (!isSelectBox) {
              handleSingleSelect(department)
            } else inputRef.current?.click()
          }}
        >
          {ORG_ICON.userIcon}
        </span>
        <span
          className={`${
            Object.keys(userChoosed).includes(key)
              ? "han-fw-regular han-color-primary"
              : "han-fw-regular han-text-primary"
          }`}
          style={{ marginLeft: 4 }}
          onClick={(e) => {
            if (!isSelectBox) {
              handleSingleSelect(department)
            } else inputRef.current?.click()
          }}
        >
          {title}
        </span>
      </a>
    </li>
  )
})

const ItemTree = memo(function ItemTree({
  department,
  isExpand,
  isBottom,
  onGetOrg,
  handleChoose,
  configOrg,
  isSelectBox,
  handleSingleSelect,
  activeFolder,
  departmentChoosed,
  userChoosed,
  typeSelection,
  isOnlyUser,
  tabChoosed,
}) {
  const { isFolder } = department

  return (
    <>
      {isFolder ? (
        <Department
          isSelectBox={isSelectBox}
          isExpand={isExpand}
          isBottom={isBottom}
          department={department}
          onGetOrg={onGetOrg}
          handleChoose={handleChoose}
          configOrg={configOrg}
          handleSingleSelect={handleSingleSelect}
          activeFolder={activeFolder}
          departmentChoosed={departmentChoosed}
          userChoosed={userChoosed}
          typeSelection={typeSelection}
          isOnlyUser={isOnlyUser}
          tabChoosed={tabChoosed}
        />
      ) : (
        <User
          isBottom={isBottom}
          department={department}
          handleChoose={handleChoose}
          isSelectBox={isSelectBox}
          handleSingleSelect={handleSingleSelect}
          userChoosed={userChoosed}
          typeSelection={typeSelection}
        />
      )}
    </>
  )
})
export default ItemTree
