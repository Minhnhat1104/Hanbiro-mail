// @ts-nocheck
import React, { useState, useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import { Col, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap"

import { onGetUniqueObject } from "components/Common/ComposeMail/utils"
import BaseButton from "components/Common/BaseButton"
import { Dialog } from "components/Common/Dialog"
import useDevice from "hooks/useDevice"

import "./styles.scss"
import HanOrganizationNew from "../HanOrganizationNew"
import { CONFIG_TYPE, getEmail, mapChildrenToDept, TYPE_TREE } from "../HanOrganizationNew/utils"
import EmailSelectionArea from "../HanOrganizationNew/EmailSelectionArea"
import { isArray, isEmpty } from "lodash"
import { onGetAllChildrenGroup } from "./api"

const USERS_INIT = {
  to: {},
  cc: {},
  bcc: {},
}

const modalContentHeight = {
  height: "60vh",
}

function index({
  open = true,
  orgTabOption,
  setEmails = () => {},
  emails = USERS_INIT,
  title,
  onSave,
  handleClose,
  isSingle = false,
  activeTypeSelection,
  customSectionComponent,
  allowAddDept = false,
  isOnlyUser = false,
  isComposeMail = false,
  mode = 3,
  hideTab = false,
  APIParams = {},
  autoSelectUser = false,
}) {
  // multiselect mode
  // 1: just choose 1 item (like single choice but still show checkbox)
  // 2: choose parent but not choose children
  // 3: choose parent and choose all chidren
  // 4: just show checkbox of children and choose children
  // 5: choose parent but not choose children

  // autoSelectUser: auto select users when checked group and the node un-expand

  const { t } = useTranslation()

  const { isTablet, isMobile, isDesktop } = useDevice()

  // State
  const [users, setUsers] = useState(emails)
  const [departmentChoosed, setDepartmentChoosed] = useState({})
  const [userChoosed, setUserChoosed] = useState({})
  const [loading, setLoading] = useState(false)
  const [tabChoosed, setTabChoosed] = useState(TYPE_TREE.organization) // organization, contacts
  const [typeTreeChoosed, setTypeTreeChoosed] = useState(TYPE_TREE.department) // department, position, alias
  const [configOrg, setConfigOrg] = useState(CONFIG_TYPE[typeTreeChoosed])
  const [typeSelection, setTypeSelection] = useState(
    Object.keys(emails).length > 0
      ? activeTypeSelection
        ? activeTypeSelection
        : Object.keys(users)[0]
      : "selected",
  )
  const [activeStep, setActiveStep] = useState(1)
  const [actionModal, setActionModal] = useState({
    isOpen: false,
    title: t("mail.holiday_req_file_okbtn"),
    content: t("common.common_includeSubGroup"),
    buttons: [],
    centered: true,
  })

  const handleActionModal = (actionCallback, ...args) => {
    setActionModal({
      ...actionModal,
      isOpen: true,
      buttons: [
        {
          text: t("common.common_no_msg"),
          onClick: () => {
            setActionModal({ ...actionModal, isOpen: false })
          },
          color: "grey",
          isOutline: true,
        },
        {
          text: t("common.common_yes_msg"),
          onClick: () => {
            actionCallback?.(...args)
            setActionModal({ ...actionModal, isOpen: false })
          },
          color: "primary",
        },
      ],
    })
  }

  // Ref
  const orgTreeRef = useRef()

  useEffect(() => {
    setUsers(emails)
  }, [emails])

  useEffect(() => {
    if (isTablet || isMobile) {
      setDepartmentChoosed({})
      setUserChoosed({})
    }
  }, [typeSelection])

  const onSaveClick = () => {
    setEmails(users)
    handleClose && handleClose()
    onSave && onSave(users)
  }

  const handleSingleSelect = (item) => {
    setEmails({ selected: item })
    handleClose && handleClose()
    onSave && onSave(item)
  }

  useEffect(() => {
    if (typeSelection && orgTreeRef.current) {
      orgTreeRef.current.resetCheck && orgTreeRef.current.resetCheck()
    }
  }, [typeSelection, orgTreeRef])

  // Reset check when delete all users like mail old version
  useEffect(() => {
    if (Object.keys(users?.[typeSelection]).length === 0 && orgTreeRef.current) {
      orgTreeRef.current.resetCheck && orgTreeRef.current.resetCheck()
    }
  }, [users, typeSelection, orgTreeRef])

  // Handle get user in children from department
  const onGetChild = (element, userNew) => {
    if (!element.isFolder || (allowAddDept && element.isFolder)) {
      const keyChild =
        typeSelection === "selected" ? element.key : getEmail(element, element.isFolder)
      userNew[keyChild] = element
    }
    if (element.children && element.children.length > 0) {
      element.children.forEach((child) => onGetChild(child, userNew))
    }
  }

  // Handle add users when clicking add button
  const onGetAddUsers = async (typeChoosed) => {
    setLoading(true)
    if (mode === 3) {
      if (Object.keys(departmentChoosed).length > 0) {
        let userChoosedNew = { ...userChoosed }
        const arrayAPI = []
        for (const property in departmentChoosed) {
          const department = departmentChoosed[property]
          if (department.children && department.children.length > 0) {
            department.children.forEach((element) => onGetChild(element, userChoosedNew))
          } else {
            if (department.isLazy) {
              if (allowAddDept) {
                const nKey = getEmail(department, department.isFolder)
                userChoosedNew[nKey] = department
              } else if (configOrg.user.api) {
                const params = configOrg.user.params({ idURL: property })
                arrayAPI.push(configOrg.user.api(params))
              }
            } else if (department?.email || !isOnlyUser) {
              const nKey = getEmail(department, department.isFolder)
              userChoosedNew[nKey] = department
            }
          }
        }

        const responses = await Promise.all(arrayAPI)
        for (const element of responses) {
          if (element && element.success) {
            for (const user of element.rows) {
              const key = typeSelection === "selected" ? user.key : getEmail(user)
              userChoosedNew[key] = user
            }
          }
        }

        if (isSingle && Object.keys(departmentChoosed).length > 0) {
          setUsers({ ...users, [typeChoosed]: userChoosedNew })
        } else {
          const finalNewUsersTypeChoosed = onGetUniqueObject({
            ...users[typeChoosed],
            ...userChoosedNew,
          })
          setUsers({
            ...users,
            [typeChoosed]: {
              ...finalNewUsersTypeChoosed,
            },
          })
        }
      } else {
        if (isSingle && Object.keys(userChoosed).length > 0) {
          setUsers({ ...users, [typeChoosed]: userChoosed })
        } else {
          const finalNewUsersTypeChoosed = onGetUniqueObject({
            ...users[typeChoosed],
            ...userChoosed,
          })
          setUsers({
            ...users,
            [typeChoosed]: {
              ...finalNewUsersTypeChoosed,
            },
          })
        }
      }
    } else if (mode === 2 || mode === 5) {
      if (typeTreeChoosed === "position") {
        let listUser = {}
        listUser = await handleGetListPositionApi(
          { ...userChoosed, ...departmentChoosed },
          listUser,
          CONFIG_TYPE[typeTreeChoosed],
        )
        const finalNewUsersTypeChoosed = onGetUniqueObject({
          ...users[typeChoosed],
          ...listUser,
        })
        setUsers((prev) => ({
          ...prev,
          [typeChoosed]: { ...prev[typeChoosed], ...finalNewUsersTypeChoosed },
        }))
      } else {
        if (tabChoosed === "contacts") {
          let listUser = {}
          listUser = await handleGetListContactApi(
            { ...userChoosed, ...departmentChoosed },
            listUser,
            CONFIG_TYPE[tabChoosed],
          )
          const finalNewUsersTypeChoosed = onGetUniqueObject({
            ...users[typeChoosed],
            ...listUser,
          })
          setUsers((prev) => ({
            ...prev,
            [typeChoosed]: { ...prev[typeChoosed], ...finalNewUsersTypeChoosed },
          }))
        } else {
          const nData = await mapChildrenToDept(
            userChoosed,
            departmentChoosed,
            configOrg,
            isComposeMail,
            typeTreeChoosed === "alias" || autoSelectUser,
          )
          setUsers((prev) => {
            let nUserChoosed = {}
            nData &&
              Object.keys(nData)?.forEach((_key) => {
                const item = nData[_key]
                if (!item?.isExpand && isEmpty(item?.children)) {
                  const nKey = getEmail(
                    item,
                    item.isFolder,
                    isComposeMail ? undefined : { userKeyField: "id" },
                    isComposeMail,
                  )
                  nUserChoosed[nKey] = item
                } else {
                  nUserChoosed = { ...nUserChoosed, ...item?.children }
                }
              })
            const finalNewUsersTypeChoosed = onGetUniqueObject({
              ...prev[typeChoosed],
              ...nUserChoosed,
            })
            return {
              ...prev,
              [typeChoosed]: {
                ...prev[typeChoosed],
                ...finalNewUsersTypeChoosed,
              },
            }
          })
          if (mode == 5) {
            var groups = []
            nData &&
              Object.keys(nData)?.forEach((_key) => {
                const item = nData[_key]
                if (item?.isFolder) {
                  groups.push(item?.groupno)
                }
              })

            if (groups.length > 0) {
              onGetAllChildrenGroup({ ids: groups }).then((res) => {
                if (res.success && res?.rows?.length > 0) {
                  handleActionModal(addDept, { typeChoosed: typeChoosed, rows: res?.rows })
                }
              })
            }
          }
        }
      }
    }
    setLoading(false)
  }

  const addDept = (data) => {
    const { typeChoosed, rows } = data
    let nUserChoosed = {}
    if (rows?.length > 0) {
      setUsers((prev) => {
        rows?.forEach((item) => {
          item.isFolder = true
          item.groupname = item?.name
          item.key = item?.cn + "_" + item?.no
          if (isEmpty(item?.children)) {
            const nKey = getEmail(item, item.isFolder)
            nUserChoosed[nKey] = item
          } else {
            nUserChoosed = { ...nUserChoosed, ...item?.children }
          }
        })

        const finalNewUsersTypeChoosed = onGetUniqueObject({
          ...prev[typeChoosed],
          ...nUserChoosed,
        })
        return {
          ...prev,
          [typeChoosed]: {
            ...prev[typeChoosed],
            ...finalNewUsersTypeChoosed,
          },
        }
      })
    }
  }

  const handleGetListPositionApi = async (list, listUser, apiConfig) => {
    if (!isEmpty(list)) {
      for (const key in list) {
        const item = list[key]
        if (!item?.isFolder) {
          const uKey = typeSelection === "selected" ? item.key : getEmail(item)
          listUser[uKey] = item
        } else {
          const params = apiConfig?.expand?.params({ idURL: item?.key })
          const userData = await apiConfig?.expand?.api(params)
          if (isArray(userData?.rows)) {
            await handleGetListPositionApi(userData?.rows, listUser, apiConfig)
          }
        }
      }
      return listUser
    }
  }

  const handleGetListContactApi = async (list, listUser, apiConfig) => {
    if (!isEmpty(list)) {
      for (const key in list) {
        const item = list[key]
        if (!item?.isFolder) {
          if (item?.email || item?.email?.length > 0) {
            const uKey = typeSelection === "selected" ? item.key : getEmail(item)
            listUser[uKey] = item
          }
        } else {
          if (isEmpty(item?.children) && !item?.leaf) {
            const params = apiConfig?.expand?.params({ idURL: item?.key })
            const userData = await apiConfig?.expand?.api(params)
            if (isArray(userData?.rows)) {
              await handleGetListContactApi(userData?.rows, listUser, apiConfig)
            }
          } else {
            await handleGetListContactApi(item.children, listUser, apiConfig)
          }
        }
      }
      return listUser
    }
  }

  const handleTypeSelection = (typeId) => {
    setDepartmentChoosed({})
    setUserChoosed({})
    setTypeSelection(typeId)
  }

  const renderHanOrganization = () => {
    return (
      <HanOrganizationNew
        {...((isTablet || isMobile) && {
          tabChoosed: tabChoosed,
          setTabChoosed: setTabChoosed,
          typeTreeChoosed: typeTreeChoosed,
          setTypeTreeChoosed: setTypeTreeChoosed,
          deptsSelected: departmentChoosed,
          usersSelected: userChoosed,
        })}
        orgTabOptions={orgTabOption}
        setUsers={setUsers}
        users={users}
        isSingle={isSingle}
        tabChoosed={tabChoosed}
        setTabChoosed={setTabChoosed}
        typeTreeChoosed={typeTreeChoosed}
        setTypeTreeChoosed={setTypeTreeChoosed}
        handleSingleSelect={handleSingleSelect}
        activeTypeSelection={activeTypeSelection}
        isOnlyUser={isOnlyUser}
        onChangeSelectDept={(depts) => setDepartmentChoosed(depts)}
        onChangeSelectUser={(users) => setUserChoosed(users)}
        onOrgConfigChange={(config) => setConfigOrg(config)}
        onGetAddUsers={onGetAddUsers}
        loading={loading}
        typeSelection={typeSelection}
        setTypeSelection={handleTypeSelection}
        ref={orgTreeRef}
        hideTab={hideTab}
        APIParams={APIParams}
      />
    )
  }

  const renderModalContent = () => {
    return (
      <Row className="mail-modal-organization h-100">
        {renderHanOrganization()}
        {customSectionComponent && (
          <Col xs={12}>
            <div className="w-100 text-start custom-section-component">
              {customSectionComponent}
            </div>
          </Col>
        )}
      </Row>
    )
  }

  const renderFirstModalContent = () => {
    return <Row className="mail-modal-organization h-100">{renderHanOrganization()}</Row>
  }

  const renderSecondModalContent = () => {
    return (
      <Row className="mail-modal-organization h-100">
        <EmailSelectionArea
          onGetAddUsers={onGetAddUsers}
          loading={loading}
          typeSelection={typeSelection}
          users={users}
          setUsers={setUsers}
          setTypeSelection={handleTypeSelection}
        />

        {customSectionComponent && (
          <Col xs={12} className="px-0">
            <div className="w-100 text-start custom-section-component">
              {customSectionComponent}
            </div>
          </Col>
        )}
      </Row>
    )
  }

  return (
    <Modal
      className={`${isTablet ? "org-modal-width" : ""}`}
      size={isSingle && isDesktop ? "md" : "xl"}
      isOpen={open}
      backdrop={"static"}
      centered={true}
    >
      <ModalHeader className="w-100 position-relative">
        {
          <div className="d-flex ">
            <span className="d-block han-h2 han-fw-semibold">{title}</span>
            <BaseButton
              onClick={() => handleClose()}
              className="bg-transparent text-black position-absolute top-50 text-lg border-0"
              style={{
                right: 0,
                transform: "translateY(-50%)",
                fontSize: "1.2rem",
              }}
            >
              <i className="mdi mdi-close font-size-20 han-text-primary"></i>
            </BaseButton>
          </div>
        }
      </ModalHeader>
      <div className="modal-content">
        <ModalBody
          className={
            isTablet || isMobile
              ? "org-modal-mobile-height text-center"
              : "org-modal-height text-center"
          }
        >
          {/* {renderModalContent()} */}
          {!(isTablet || isMobile) || isSingle ? (
            <>{renderModalContent()}</>
          ) : (
            <>
              {activeStep === 0 ? (
                <>{renderFirstModalContent()}</>
              ) : (
                <>{renderSecondModalContent()}</>
              )}
            </>
          )}
        </ModalBody>
      </div>
      <ModalFooter className="d-flex justify-content-center">
        <>
          <BaseButton
            outline
            color={"grey"}
            type="button"
            icon={"mdi mdi-close"}
            onClick={() => handleClose()}
          >
            {t("common.common_btn_close")}
          </BaseButton>
          {(isTablet || isMobile) && activeStep !== 0 && !isSingle && (
            <BaseButton
              color={"primary"}
              type="button"
              icon={"mdi mdi-arrow-left"}
              onClick={() => {
                setActiveStep(0)
              }}
            >
              {t("mail.mail_view_prev")}
            </BaseButton>
          )}
          {!isSingle && (
            <BaseButton
              color={"primary"}
              type="button"
              icon={"mdi mdi-content-save"}
              loading={loading}
              onClick={async () => {
                if ((isTablet || isMobile) && activeStep === 0) {
                  await onGetAddUsers(typeSelection)
                  if (!loading) {
                    setActiveStep(1)
                  }
                } else {
                  onSaveClick()
                }
              }}
            >
              {(isTablet || isMobile) && activeStep === 0
                ? t("mail.mail_dkim_add")
                : t("common.common_btn_save")}
            </BaseButton>
          )}
        </>
      </ModalFooter>
      {actionModal.isOpen && <Dialog {...actionModal} />}
    </Modal>
  )
}

export default index
