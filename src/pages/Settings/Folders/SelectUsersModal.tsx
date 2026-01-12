// @ts-nocheck
import { Fragment, useCallback, useEffect, useMemo, useState } from "react"

import { isEmpty } from "lodash"
import { useTranslation } from "react-i18next"
import Select from "react-select"
import { Col, Input, Row } from "reactstrap"

import { BaseButton, BaseIcon, BaseModal } from "components/Common"
import { generateUUID } from "components/Common/Attachment/HanModalClouddisk/utils"
import { tabOptions } from "components/Common/Org/GroupwareOrgModal"
import { CONFIG_TYPE, TYPE_TREE, getEmail } from "components/Common/Org/HanOrganizationNew/utils"
import { permissionOptions } from "constants/settings/folders"
import { Headers, emailGet } from "helpers/email_api_helper"
import { useCustomToast } from "hooks/useCustomToast"
import useDevice from "hooks/useDevice"
import { getUsersShare } from "modules/mail/settings/api"
import { IS_SHARE_BOX } from "modules/mail/settings/urls"
import OrgTreeV2 from "components/Common/Org/HanOrganizationNew/OrgTreeV2"
import "./styles.scss"

const SelectUsersModal = ({ isOpen, toggleModal, onPermission, boxId, loading }) => {
  const { t } = useTranslation()
  const { isMobile } = useDevice()
  const { errorToast } = useCustomToast()

  // State
  const [configOrg, setConfigOrg] = useState(CONFIG_TYPE[TYPE_TREE.department])
  const [usersSelected, setUsersSelected] = useState(null)
  const [deptsSelected, setDeptsSelected] = useState(null)
  const [activeStep, setActiveStep] = useState(1)
  const [shareUsers, setShareUsers] = useState([])
  const [checkUser, setCheckUser] = useState([])

  const [loadingUsers, setLoadingUsers] = useState(false)

  const cusPermissionOptions = useMemo(() => {
    return permissionOptions.map((item) => {
      return {
        ...item,
        label: t(item.label),
      }
    })
  }, [permissionOptions])

  useEffect(() => {
    getIsShare()
  }, [])

  // handler
  const checkIsShare = async () => {
    try {
      const data = await emailGet(`${IS_SHARE_BOX}/${boxId}`, {}, Headers)
      if (data?.success) {
        return data.isshare
      } else {
        throw new Error(data.msg)
      }
    } catch (error) {
      errorToast(error)
    }
  }

  const getIsShare = async () => {
    if (await checkIsShare()) {
      getUsersShare(boxId).then((res) => {
        if (res.success) {
          setShareUsers(res.rows)
        }
      })
    }
  }

  // Handle get user in children from department
  const onGetChild = (element, userNew, arrayAPI) => {
    if (!element.isFolder) {
      const keyChild = getEmail(element)
      userNew[keyChild] = element
    } else {
      if (element.children && element.children.length > 0) {
        element.children.forEach((child) => onGetChild(child, userNew))
      } else {
        if (configOrg.user.api) {
          const params = configOrg.user.params({ idURL: element?.key || element?.id })
          arrayAPI.push(configOrg.user.api(params))
        }
      }
    }
  }

  const handleSelectDept = async () => {
    if (Object.keys(deptsSelected).length > 0) {
      let userChoosedNew = {}

      const arrayAPI = []
      for (const property in deptsSelected) {
        const department = deptsSelected[property]

        if (department.children && department.children.length > 0) {
          department.children.forEach((element) => onGetChild(element, userChoosedNew, arrayAPI))
        } else {
          if (configOrg.user.api) {
            const params = configOrg.user.params({ idURL: property })
            arrayAPI.push(configOrg.user.api(params))
          }
        }
      }

      const responses = await Promise.all(arrayAPI)
      for (const element of responses) {
        if (element && element.success) {
          for (const user of element.rows) {
            const key = getEmail(user)
            userChoosedNew[key] = user
          }
        }
      }
      return userChoosedNew
    }
  }

  const handleShareUsers = async () => {
    setLoadingUsers(true)
    const deptsSelected = await handleSelectDept()
    let userChoosedNew = {}
    if (!isEmpty(usersSelected)) {
      Object.values(usersSelected).forEach((user) => {
        const nKey = getEmail(user)
        userChoosedNew[nKey] = user
      })
    }
    const newUsersSelected = { ...deptsSelected, ...userChoosedNew }
    const newUsers = Object.values(newUsersSelected)?.map((item) => {
      return {
        ...item,
        userid: item.userid ?? item.id,
        permissions: permissionOptions[0].value,
      }
    })
    if (newUsers.length < 1) {
      setLoadingUsers(false)
      return
    }

    let nUsers = [...shareUsers]
    if (nUsers.length > 0) {
      for (let i = 0; i < newUsers.length; i++) {
        const index = nUsers.findIndex((item) => {
          if (item.userno) {
            return item.userno === newUsers[i].userno ?? newUsers[i].no
          } else if (item.userid) {
            return item.userid === newUsers[i].userid
          }
        })
        if (index !== -1) continue
        nUsers.push(newUsers[i])
      }
      setShareUsers(nUsers)
    } else {
      setShareUsers(newUsers)
    }
    setLoadingUsers(false)
  }

  const handleCheckUser = (e, user) => {
    if (e.target.checked) {
      let nUsers = [...checkUser]
      nUsers.push(user)
      setCheckUser(nUsers)
    } else {
      if (isEmpty(checkUser)) return
      let nUsers = [...checkUser].filter((item) => {
        if (item.userno) {
          return item.userno !== user.userno
        } else if (item.userid) {
          return item.userid !== user.userid
        }
      })
      setCheckUser(nUsers)
    }
  }

  const handleRemoveUser = () => {
    if (isEmpty(checkUser)) return
    const cloneCheckUser = [...checkUser]
    let nUsers = [...shareUsers]
    for (let i = 0; i < cloneCheckUser.length; i++) {
      const index = nUsers.findIndex(
        (item) =>
          item.userno === cloneCheckUser[i].userno || item.userid === cloneCheckUser[i].userid,
      )
      if (index === -1) continue
      nUsers = nUsers.filter((item) => {
        if (item.userno) {
          return item.userno !== cloneCheckUser[i].userno
        } else if (item.userid) {
          return item.userid !== cloneCheckUser[i].userid
        }
      })
      setCheckUser((prev) => {
        return prev.filter((item) => {
          if (item.userno) {
            return item.userno !== cloneCheckUser[i].userno
          } else if (item.userid) {
            return item.userid !== cloneCheckUser[i].userid
          }
        })
      })
    }
    setShareUsers(nUsers)
  }

  const handleChangePermission = useCallback(
    (data, index) => {
      let nShareUsers = [...shareUsers]
      nShareUsers[index] = {
        ...shareUsers[index],
        permissions: data.value,
      }
      setShareUsers(nShareUsers)
    },
    [shareUsers],
  )

  const handleSave = () => {
    onPermission && onPermission(shareUsers)
  }

  // render modal
  const shareFolderHeader = () => {
    return <div>{t("mail.mail_admin_spam_manager_select_user")}</div>
  }

  const renderFirstModalContent = () => {
    return (
      <OrgTreeV2
        // deptsSelected={deptsSelected}
        // usersSelected={usersSelected}
        onOrgConfigChange={setConfigOrg}
        onChangeSelectDept={(data) => setDeptsSelected(data)}
        onChangeSelectUser={(users) => setUsersSelected(users)}
        classNames={"org-list w-100"}
        orgOptions={tabOptions}
        typeSelection={"selected"}
      />
    )
  }

  const renderSecondModalContent = () => {
    return (
      <>
        <div className="d-flex justify-content-between align-items-center bg-body-secondary p-2">
          <div>{t("mail.mail_selection_list")}</div>
          <div className="d-flex justify-content-between align-items-center">
            {!isMobile && (
              <BaseButton
                color={"success"}
                className="btn-add-user rounded-circle me-2"
                onClick={handleShareUsers}
                size="sm"
                loading={loadingUsers}
                icon={"mdi mdi-plus font-size-14"}
                iconClassName=""
                iconLoadingSmall={true}
              ></BaseButton>
            )}
            <BaseButton
              size="sm"
              color={"danger"}
              className="rounded-circle me-2"
              onClick={handleRemoveUser}
            >
              <BaseIcon icon={"mdi mdi-minus font-size-14"} />
            </BaseButton>
            <BaseButton
              size="sm"
              color={"outline-danger"}
              className="rounded-circle"
              onClick={() => {
                setShareUsers([])
                setCheckUser([])
                setDeptsSelected({})
                setUsersSelected({})
              }}
            >
              <BaseIcon icon={"mdi mdi-trash-can-outline font-size-14"} />
            </BaseButton>
          </div>
        </div>
        <div className="select-option custom-scroll p-2 border rounded mt-2 w-100">
          {shareUsers &&
            shareUsers.length > 0 &&
            shareUsers.map((user, index) => (
              <Fragment key={generateUUID()}>
                <Row className="align-items-center mb-2">
                  <Col xs={6} className="d-flex align-items-center">
                    <Input
                      id={user.userid}
                      type="checkbox"
                      onClick={(e) => handleCheckUser(e, user)}
                      defaultChecked={checkUser.includes(user)}
                      className="m-0"
                    />
                    <label htmlFor={user.userid} className="user-info m-0 ms-2 text-truncate">
                      {`${user?.groupname ? `[${user.groupname}]` : ""} ${user?.userid ?? ""}`}
                    </label>
                  </Col>
                  <Col xs={6}>
                    <Select
                      value={cusPermissionOptions.find((item) => item.value === user.permissions)}
                      options={cusPermissionOptions}
                      onChange={(data) => handleChangePermission(data, index)}
                      menuPosition="fixed"
                      styles={{
                        menu: (base) => ({
                          ...base,
                          backgroundColor: "white!important",
                        }),
                      }}
                    />
                  </Col>
                </Row>
              </Fragment>
            ))}
        </div>
      </>
    )
  }

  const shareFolderBody = () => {
    return (
      <Row>
        {!isMobile ? (
          <>
            <Col xs={6} className="org-tree-folder han-organization-new">
              {renderFirstModalContent()}
            </Col>
            <Col xs={6} className="select-user">
              {renderSecondModalContent()}
            </Col>
          </>
        ) : (
          <>
            {activeStep === 0 ? (
              <Col xs={12} className="org-tree-folder han-organization-new">
                {renderFirstModalContent()}
              </Col>
            ) : (
              <Col xs={12} className="select-user">
                {renderSecondModalContent()}
              </Col>
            )}
          </>
        )}
      </Row>
    )
  }

  const shareFolderFooter = () => {
    return (
      <div className="d-flex justify-content-end w-100">
        {isMobile && activeStep !== 0 && (
          <BaseButton
            icon={"mdi mdi-arrow-left"}
            color={"primary"}
            className="me-2"
            type="button"
            onClick={() => {
              setActiveStep(0)
            }}
          >
            {t("mail.mail_view_prev")}
          </BaseButton>
        )}
        <BaseButton
          loading={loading}
          icon="bx bx-save"
          color={"primary"}
          className="me-2"
          type="button"
          onClick={() => {
            if (isMobile && activeStep === 0) {
              setActiveStep(1)
              handleShareUsers()
            } else {
              handleSave()
            }
          }}
        >
          {isMobile && activeStep === 0 ? t("mail.mail_dkim_add") : t("mail.mail_view_save")}
        </BaseButton>
        <BaseButton
          color={"grey"}
          className={"btn-action"}
          type="button"
          onClick={() => toggleModal(false)}
        >
          {t("mail.mail_write_discard")}
        </BaseButton>
      </div>
    )
  }

  return (
    <BaseModal
      centered
      size="xl"
      isOpen={isOpen}
      toggle={() => {
        toggleModal((prev) => !prev)
      }}
      renderHeader={shareFolderHeader}
      renderBody={shareFolderBody}
      renderFooter={shareFolderFooter}
    />
  )
}

export default SelectUsersModal
