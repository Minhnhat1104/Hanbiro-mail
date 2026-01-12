// @ts-nocheck
import BaseButton from "components/Common/BaseButton"
import { onGetUniqueObject } from "components/Common/ComposeMail/utils"
import useDevice from "hooks/useDevice"
import { t } from "i18next"
import { useEffect, useState } from "react"
import { Col, Modal, ModalBody, ModalFooter, ModalHeader, Row } from "reactstrap"
import { OrgTree } from ".."
import { ORG_ICON } from "../HanOrganizationNew/orgTreeIcon"
import { CONFIG_TYPE, getEmail, TYPE_TREE } from "../HanOrganizationNew/utils"
import UserItem from "../UserItem"
import "./styles.scss"
import OrgTreeV2 from "../HanOrganizationNew/OrgTreeV2"
import BaseModal from "components/Common/BaseModal"

export const tabOptions = {
  [TYPE_TREE.organization]: {
    name: "common.approval_line_org", // Organization
    types: [
      {
        id: TYPE_TREE.department,
        name: "common.hr_part_name", // Department
      },
      {
        id: TYPE_TREE.position,
        name: "common.org_user_rank", // Position
      },
    ],
  },
}

const GroupwareOrgModal = ({
  open,
  orgTabOptions = tabOptions,
  onSave,
  handleClose,
  isSingle = false,
  selectedData,
  typeSelection = "selected",
  allowAddDept = false,
}) => {
  // const { t } = useTranslation()
  const { isTablet } = useDevice()
  const [departmentChoosed, setDepartmentChoosed] = useState({})
  const [userChoosed, setUserChoosed] = useState({})
  const [userDisplayed, setUserDisplayed] = useState({})
  const [userSelected, setUserSelected] = useState({})
  const [loading, setLoading] = useState(false)
  const [configOrg, setConfigOrg] = useState(CONFIG_TYPE["department"])

  useEffect(() => {
    setUserDisplayed(selectedData)
  }, [selectedData])

  // Handle get user in children from department
  const onGetChild = (element, userNew) => {
    if (!element.isFolder || (allowAddDept && element.isFolder)) {
      const keyChild = typeSelection === "selected" ? element.key : getEmail(element)
      userNew[keyChild] = element
    }
    if (element.children && element.children.length > 0) {
      element.children.forEach((child) => onGetChild(child, userNew))
    }
  }

  const onGetAddUsers = async () => {
    setLoading(true)
    if (Object.keys(departmentChoosed).length > 0) {
      let userChoosedNew = { ...userChoosed }
      const arrayAPI = []
      for (const property in departmentChoosed) {
        const department = departmentChoosed[property]
        if (department.children && department.children.length > 0) {
          department.children.forEach((element) => onGetChild(element, userChoosedNew))
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
            const key = typeSelection === "selected" ? user.key : getEmail(user)
            userChoosedNew[key] = user
          }
        }
      }
      if (isSingle && Object.keys(departmentChoosed).length > 0) {
        setUserDisplayed({ ...userChoosedNew })
      } else {
        const finalNewUsersTypeChoosed = onGetUniqueObject({
          ...userDisplayed,
          ...userChoosedNew,
        })
        setUserDisplayed({
          // ...userDisplayed,
          // ...userChoosedNew,
          ...finalNewUsersTypeChoosed,
        })
      }
    } else {
      if (isSingle && Object.keys(userChoosed).length > 0) {
        setUserDisplayed({ ...userChoosed })
      } else {
        const finalNewUsersTypeChoosed = onGetUniqueObject({
          ...userDisplayed,
          ...userChoosed,
        })
        setUserDisplayed({
          // ...userDisplayed,
          // ...userChoosed,
          ...finalNewUsersTypeChoosed,
        })
      }
    }
    setLoading(false)
  }

  const handleDeleteUserSelected = () => {
    let nUser = { ...userDisplayed }
    Object.keys(userSelected).forEach((key) => {
      delete nUser[key]
    })
    setUserSelected({})
    setUserDisplayed(nUser)
  }

  const handleDeleteUser = (key) => {
    let nUser = { ...userDisplayed }
    delete nUser[key]
    setUserDisplayed(nUser)
  }

  const renderBody = () => {
    return (
      <Row className="mail-modal-organization">
        <div className="groupware-org">
          <Row className="h-100 gx-4 gy-3">
            <Col md={12} lg={6} className="h-100">
              <OrgTreeV2
                orgOptions={orgTabOptions}
                onChangeSelectDept={(depts) => {
                  setDepartmentChoosed(depts)
                }}
                onChangeSelectUser={(users) => {
                  setUserChoosed(users)
                }}
                onOrgConfigChange={(config) => {
                  setConfigOrg(config)
                }}
                isSingle={isSingle}
              />
            </Col>
            <Col md={12} lg={6} className="h-100">
              <div className="user-selected rounded h-100">
                {/* header */}
                <div className="user-selected-title">
                  {t("common.main_select_list")}

                  <div className="user-selected-button">
                    <BaseButton
                      title={t("mail.mail_set_pop3_add")}
                      className="org-action-btn btn-rounded btn-success"
                      onClick={onGetAddUsers}
                      loading={loading}
                    >
                      {!loading && <i className="bx bx-plus"></i>}
                    </BaseButton>

                    <BaseButton
                      title={t("common.upload_remove")}
                      className="org-action-btn btn-rounded btn-danger"
                      onClick={handleDeleteUserSelected}
                    >
                      <i className="bx bx-minus"></i>
                    </BaseButton>
                    <BaseButton
                      title={t("common.feedback_clear")}
                      className="org-action-btn btn-rounded btn-danger"
                      onClick={() => setUserDisplayed({})}
                    >
                      <i className="bx bx-trash-alt "></i>
                    </BaseButton>
                  </div>
                </div>
                {/* body */}
                <div
                  className="user-selected-content scroll-box"
                  style={{ height: `calc(100% - 49px)` }}
                >
                  <ul className="user-selected-list h-100">
                    {Object.keys(userDisplayed ?? {}).length == 0 ? (
                      <div className="view-no-data">{ORG_ICON.noData}</div>
                    ) : (
                      Object.keys(userDisplayed).map((key) => {
                        const user = userDisplayed[key]
                        // const nameKey =
                        //   typeSelection === "selected"
                        //     ? user?.title || user?.name || user?.username
                        //     : key
                        const nameKey =
                          typeSelection === "selected"
                            ? `${
                                user?.groupname
                                  ? `${user?.groupname}/${user?.username || user?.name}`
                                  : `${user?.username || user?.name}`
                              } ${user?.position ? `(${user?.position})` : ""}`
                            : key
                        return (
                          <li
                            key={key}
                            className=""
                            onClick={() => {
                              setUserSelected((prev) => {
                                const newSelectedUsers = { ...prev }
                                if (newSelectedUsers[key]) {
                                  delete newSelectedUsers[key]
                                } else {
                                  newSelectedUsers[key] = true
                                }
                                return newSelectedUsers
                              })
                            }}
                          >
                            <UserItem
                              key={key}
                              name={nameKey}
                              selected={userSelected[key]}
                              onDelete={() => handleDeleteUser(key)}
                            />
                          </li>
                        )
                      })
                    )}
                  </ul>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Row>
    )
  }

  const renderHeader = () => t("admin.hr_org_tree")

  const renderFooter = () => {
    return (
      <>
        <BaseButton
          type="button"
          className="st-sg-modal-btn-save"
          color="primary"
          disabled={Object.keys(userDisplayed).length === 0}
          onClick={() => {
            onSave && onSave(userDisplayed)
            handleClose()
          }}
        >
          {t("mail.mail_view_save")}
        </BaseButton>
        <BaseButton
          outline
          type="button"
          className="st-sg-modal-btn-cancel"
          color="grey"
          onClick={() => {
            handleClose()
          }}
        >
          {t("mail.mail_write_discard")}
        </BaseButton>
      </>
    )
  }

  return (
    <BaseModal
      className={`${isTablet ? "org-modal-width" : ""}`}
      size="xl"
      isOpen={open}
      backdrop={"static"}
      centered={true}
      toggle={handleClose}
      renderHeader={renderHeader}
      renderBody={renderBody}
      renderFooter={renderFooter}
    />
  )
}

export default GroupwareOrgModal
