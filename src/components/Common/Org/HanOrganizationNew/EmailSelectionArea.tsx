// @ts-nocheck
import classnames from "classnames"
import BaseButton from "components/Common/BaseButton"
import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import UserItem from "../UserItem"
import { ORG_ICON } from "./orgTreeIcon"
import useDevice from "hooks/useDevice"
import { Button } from "reactstrap"

function EmailSelectionArea({ users, setUsers, typeSelection, setTypeSelection }) {
  const { t } = useTranslation()
  const { isTablet, isMobile } = useDevice()

  const TYPES = useMemo(
    (_) => {
      if (Object.keys(users).length > 0)
        return Object.keys(users).map((key) => {
          return {
            id: key,
            name: key.toUpperCase(),
          }
        })
      else {
        return [
          {
            id: "select",
            name: t("admin.admin_select_list"),
          },
        ]
      }
    },
    [users],
  )

  const onChangeTypeUser = (type) => {
    setTypeSelection && setTypeSelection(type.id)
  }
  const onDeleteAllUser = () => {
    setSelectedUsers({})
    setUsers({
      ...users,
      [typeSelection]: {},
    })
  }

  const onDeleteUser = (key) => {
    let usersNew = { ...users[typeSelection] }
    delete usersNew[key]
    setUsers({
      ...users,
      [typeSelection]: usersNew,
    })
  }

  const onDeleteSelected = () => {
    let usersNew = { ...users[typeSelection] }
    Object.keys(selectedUsers).forEach((key) => {
      delete usersNew[key]
    })
    setSelectedUsers({})
    setUsers({
      ...users,
      [typeSelection]: usersNew,
    })
  }
  const [selectedUsers, setSelectedUsers] = useState({})
  console.log("🚀 ~ selectedUsers:", selectedUsers)

  return (
    <div
      className={`${
        !(isTablet || isMobile) ? "h-100" : "flex-1"
      }  pd-10 border-1 border rounded-2 px-0 flex-grow-1 overflow-hidden`}
    >
      <div className="h-100 d-flex flex-column">
        <div className="d-flex justify-content-between w-100 type-headline pe-3 border-bottom">
          <ul className="nav nav-tabs-custom nav-line flex-nowrap gap-1" id="myTab5" role="tablist">
            {TYPES.map((type) => (
              <li
                key={type.id}
                className={`nav-item nav-type-item px-4 rounded-1 cursor-pointer`}
                onClick={() => onChangeTypeUser(type)}
              >
                <a
                  className={classnames("nav-link", typeSelection == type.id ? "active" : "")}
                  id="home-tab5"
                  data-toggle="tab"
                  href="#home5"
                  role="tab"
                  aria-controls="home"
                  aria-selected="true"
                >
                  <span className="han-h4 han-fw-regular">
                    {type.id === "selected" ? t("admin.admin_select_list") : type.name}
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <div className="function-list d-flex gap-2 align-items-center">
            <Button
              color="grey"
              title={t("common.upload_remove")}
              className={`btn-action ${
                Object.keys(selectedUsers)?.length > 0 ? "btn-action-delete" : ""
              } org-action-btn d-flex align-items-center justify-content-center`}
              onClick={() => onDeleteSelected()}
            >
              <i className="mdi mdi-minus"></i>
            </Button>
            <Button
              color="grey"
              title={t("common.feedback_clear")}
              className="btn-action btn-action-delete org-action-btn d-flex align-items-center justify-content-center"
              onClick={onDeleteAllUser}
            >
              <i className="mdi mdi-trash-can-outline"></i>
            </Button>
          </div>
        </div>
        <div
          className={`content-email ${!(isTablet || isMobile) ? "h-100" : ""} p-1 overflow-auto`}
          style={{
            ...(isTablet && { maxHeight: "70vh" }),
            ...(isMobile && { maxHeight: "60vh" }),
          }}
        >
          <ul className="wrap-content h-100 m-0 justify-content-start">
            {Object.keys(users ?? {}).length == 0 ||
            Object.keys(users?.[typeSelection] ?? {}).length == 0 ? (
              <div className="w-100 d-flex justify-content-center align-items-center">
                {ORG_ICON.noData}
              </div>
            ) : (
              <div className="w-100">
                {Object.keys(users?.[typeSelection] ?? {}).map((key) => {
                  const user = users?.[typeSelection]?.[key]
                  const nameKey =
                    typeSelection === "selected"
                      ? user?.isFolder
                        ? user?.groupname
                        : `${
                            user?.groupname
                              ? `${user?.groupname}/${user?.username || user?.name}`
                              : `${user?.username || user?.name}`
                          } ${user?.position ? `(${user?.position})` : ""}`
                      : // : user && Object.keys(user).length > 0
                        // ? `${user?.username || user?.title} <${user?.email}>`
                        key
                  return (
                    user &&
                    user?.type !== "folder" && (
                      <span
                        key={key}
                        className="mb-1"
                        onClick={() => {
                          console.time("start_select")
                          setSelectedUsers((prevSelectedUsers) => {
                            const newSelectedUsers = { ...prevSelectedUsers }
                            if (newSelectedUsers[key]) {
                              delete newSelectedUsers[key]
                            } else {
                              newSelectedUsers[key] = true
                            }
                            // console.timeEnd("start_select")
                            return newSelectedUsers
                          })
                        }}
                      >
                        <UserItem
                          key={key}
                          name={nameKey}
                          selected={selectedUsers[key]}
                          onDelete={() => onDeleteUser(key)}
                        />
                      </span>
                    )
                  )
                })}
              </div>
            )}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default EmailSelectionArea
