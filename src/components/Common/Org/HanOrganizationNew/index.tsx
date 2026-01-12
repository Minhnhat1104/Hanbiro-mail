// @ts-nocheck
import { forwardRef } from "react"

import { Col, Row } from "reactstrap"

import useDevice from "hooks/useDevice"

import EmailSelectionArea from "./EmailSelectionArea"
import OrgTree from "./OrgTree"
import "./style.scss"
import AddButton from "./AddButton"
import OrgTreeV2 from "./OrgTreeV2"

function HanOrganizationNew(
  {
    tabChoosed,
    setTabChoosed,
    typeTreeChoosed,
    setTypeTreeChoosed,
    orgTabOptions,
    isSingle = false,
    users = {},
    setUsers = () => {},
    handleSingleSelect,
    deptsSelected,
    onChangeSelectDept,
    usersSelected,
    onChangeSelectUser,
    onOrgConfigChange,
    onGetAddUsers,
    loading,
    typeSelection,
    setTypeSelection,
    isOnlyUser,
    hideTab = false,
    APIParams = {},
  },
  ref,
) {
  const { isTablet, isMobile } = useDevice()

  return (
    <Col xs={12} className="han-organization-new h-100">
      <Row className="gy-3 h-100">
        <Col xs={12} lg={isTablet || isSingle ? 12 : 5} className="h-100">
          <OrgTreeV2
            isSingle={isSingle}
            tabChoosed={tabChoosed}
            setTabChoosed={setTabChoosed}
            typeTreeChoosed={typeTreeChoosed}
            setTypeTreeChoosed={setTypeTreeChoosed}
            orgOptions={orgTabOptions}
            deptsSelected={deptsSelected}
            onChangeSelectDept={onChangeSelectDept}
            usersSelected={usersSelected}
            onChangeSelectUser={onChangeSelectUser}
            onOrgConfigChange={onOrgConfigChange}
            handleSingleSelect={handleSingleSelect}
            typeSelection={typeSelection}
            isOnlyUser={isOnlyUser}
            ref={ref}
            hideTab={hideTab}
            APIParams={APIParams}
          />
        </Col>

        {!isSingle && !(isTablet || isMobile) && (
          <>
            {/* add button */}
            <Col xs={12} lg={2} className="d-flex justify-content-center align-items-center">
              <AddButton
                onGetAddUsers={onGetAddUsers}
                loading={loading}
                typeSelection={typeSelection}
              />
            </Col>

            <Col xs={12} lg={5} className="h-100">
              <EmailSelectionArea
                onGetAddUsers={onGetAddUsers}
                loading={loading}
                typeSelection={typeSelection}
                users={users}
                setUsers={setUsers}
                setTypeSelection={setTypeSelection}
              />
            </Col>
          </>
        )}
      </Row>
    </Col>
  )
}

export default forwardRef(HanOrganizationNew)
