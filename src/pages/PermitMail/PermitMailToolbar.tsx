// @ts-nocheck
import { BaseButton, BaseButtonDropdown, BaseIcon } from "components/Common"
import HanTooltip from "components/Common/HanTooltip"
import React, { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Input, Label } from "reactstrap"
import "./styles.scss"
import useDevice from "hooks/useDevice"
import PermitFilterToolbar from "./PermitFilterToolbar"
import MobileSearch from "pages/List/EmailToolbar/MobileSearch"
import { useSearchParams } from "react-router-dom"
import { setPermitQueryParams, setQueryParams, setSearchKeywork } from "store/mailList/actions"
import { useDispatch, useSelector } from "react-redux"
import PermitFilterV2 from "./PermitFilterV2"
import { isEmpty } from "lodash"

function PermitMailToolbar(props) {
  const {
    menu,
    info,
    isMiddle,
    mailList,
    mailSelected,
    onRefresh,
    isSplitMode,
    isDisabled,
    onMultipleSelect,
    handlePermitMail,
    setOpenPriorApproval,
    setOpenApproverInfoModal,
  } = props
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { isDesktop, isMobile, isVerticalTablet } = useDevice()

  const isMobileFilter = isMobile || isVerticalTablet

  const queryParams = useSelector((state) => state.QueryParams.permitQuery)

  const options = [
    {
      value: 1,
      title: t("mail.mail_select_checkbox_all"),
      onClick: () => {
        onMultipleSelect("all")
      },
    },
    {
      value: 2,
      title: t("mail.mail_select_checkbox_uncheck_all"),
      onClick: () => {
        onMultipleSelect("none")
      },
    },
  ]

  const isSelectAll = useMemo(() => {
    return !isEmpty(mailSelected) && mailList.every((mail) => mailSelected?.includes(mail.uuid))
  }, [mailList, mailSelected])

  const [searchParams, setSearchParams] = useSearchParams()
  const [showSearchInputMobile, setShowSearchInputMobile] = useState(false)

  return (
    <div
      className={`email-toolbar d-flex align-items-center justify-content-between position-relative ${
        isMobile ? "py-2 px-2 border-top border-bottom bg-white" : "ms-2"
      }`}
    >
      <div className="left-toolbar btn-toolbar align-items-center" role="toolbar">
        <Input
          className="checkbox-wrapper-mail m-0 border-1"
          type="checkbox"
          id="selectall"
          checked={isSelectAll}
          onChange={(e) => {}}
          onClick={(e) => {
            console.log(" e:", e.target.checked)
            e.target.checked ? onMultipleSelect() : onMultipleSelect("none")
          }}
        />
        <HanTooltip placement="top" overlay={"Select Options"} trigger={["hover", "click"]}>
          <div>
            <BaseButtonDropdown
              options={options}
              iconClassName={"me-0"}
              classDropdown={"dropdown-all"}
              classDropdownToggle={"btn-no-active"}
            />
          </div>
        </HanTooltip>
      </div>

      <div className="right-toolbar gap-2">
        {/* Permit */}
        <BaseButton
          color={"success"}
          icon={"mdi mdi-check"}
          disabled={isDisabled}
          iconClassName={isMobile ? "me-0" : undefined}
          onClick={() => handlePermitMail && handlePermitMail("allow")}
        >
          {!isMobile && t("mail.mail_secure_allow_btn")}
        </BaseButton>

        {/* Deny */}
        <BaseButton
          color={"danger"}
          disabled={isDisabled}
          icon={"mdi mdi-cancel"}
          iconClassName={isMobile ? "me-0" : undefined}
          onClick={() => handlePermitMail && handlePermitMail("deny")}
        >
          {!isMobile && t("mail.mail_secure_deny_btn")}
        </BaseButton>

        {/* Approver Infomation */}
        <BaseButton
          color={"grey"}
          className={`btn-action`}
          icon={isMobile ? "mdi mdi-information-outline" : undefined}
          iconClassName={"me-0"}
          onClick={() => setOpenApproverInfoModal && setOpenApproverInfoModal(true)}
        >
          {!isMobile && t("mail.mail_approvers_information")}
        </BaseButton>

        {/* Prior Approval */}
        {!isMiddle && (
          <BaseButton
            color={"grey"}
            className={`btn-action`}
            icon={isMobile ? "mdi mdi-check-decagram-outline" : undefined}
            iconClassName={`me-0`}
            onClick={() => setOpenPriorApproval && setOpenPriorApproval(true)}
          >
            {!isMobile && t("mail.mail_prior_permit")}
          </BaseButton>
        )}

        {/* Mobile Filter */}
        {isMobile ? (
          <div className="right-toolbar-mobile" onClick={() => setShowSearchInputMobile(true)}>
            <BaseButton
              outline
              color={"grey"}
              className={"btn btn-action fs-5"}
              icon={"mdi mdi-magnify"}
              iconClassName={"me-0"}
            />
            {/* mobile search */}
            <div className={`mobile-search-input px-2 ${showSearchInputMobile ? "show" : "hide"}`}>
              <BaseIcon
                icon={"mdi mdi-chevron-left pe-2 font-size-22 text-secondary"}
                onClick={(e) => {
                  e.stopPropagation()
                  setShowSearchInputMobile(false)
                }}
              />

              {/* search input */}
              <MobileSearch
                className={""}
                initialData={searchParams.get("keyword") ?? ""}
                onSubmit={(keywork) => {
                  const nParams = {
                    ...queryParams,
                    all: keywork,
                  }
                  dispatch(setPermitQueryParams(nParams))
                }}
              />

              {/* filter button */}
              <PermitFilterV2 menu={menu} />
            </div>
          </div>
        ) : (
          // <PermitFilterV2 menu={menu} />
          <></>
        )}

        {/* refresh */}
        {/* <HanTooltip placement="top" overlay={"Refresh"}>
          <BaseButton
            color={"grey"}
            className={"btn btn-refresh btn-action fs-5"}
            icon={"mdi mdi-refresh"}
            iconClassName={"me-0"}
            onClick={() => onRefresh && onRefresh()}
          />
        </HanTooltip> */}
      </div>
    </div>
  )
}

export default PermitMailToolbar
