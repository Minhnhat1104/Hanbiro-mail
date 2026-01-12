// @ts-nocheck
import { Fragment, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"

import { BaseButton } from "components/Common"
import useDevice from "hooks/useDevice"
import BackButton from "pages/Main/BackButton"
import { setQueryParams } from "store/mailList/actions"
import { setRefreshList, setShowSidebar } from "store/viewMode/actions"

import { useParams } from "react-router-dom"
import "./styles.scss"
import SearchFilterInput from "components/Common/SearchInput"
import HanTooltip from "components/Common/HanTooltip"
import { selectUserMailSetting } from "store/auth/config/selectors"

const MainHeader = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { menu } = useParams()

  const { isTablet, isMobile } = useDevice()
  const isIframeMode = useSelector((state) => state.viewMode.isIframeMode)
  const isShowSidebar = useSelector((state) => state.viewMode.isShowSidebar)
  const isSplitMode = useSelector((state) => state.viewMode.isSplitMode)
  const currentMenu = useSelector((state) => state.viewMode.currentMenu)
  const isDetailView = useSelector((state) => state.mailDetail.isDetailView)
  const isPermitDetailView = useSelector((state) => state.mailDetail.isPermitDetailView)
  const queryParams = useSelector((state) => state.QueryParams.query)
  const userMailSetting = useSelector(selectUserMailSetting)

  const limit = useMemo(() => {
    return userMailSetting?.items_per_page ?? 20
  }, [userMailSetting?.items_per_page])

  const isReceiptsMenu = menu === "Receive"

  const toggleSidebar = () => {
    dispatch(setShowSidebar(!isShowSidebar))
  }

  const onRefresh = () => {
    dispatch(setRefreshList(true))
  }

  return (
    <Fragment>
      <div
        className={`mail-header d-flex align-items-center justify-content-between ${
          isMobile ? "mx-2" : ""
        }`}
      >
        {/* page title */}
        <div className="mail-header-left d-flex align-items-center gap-2">
          {(isTablet || isMobile) && isIframeMode && (
            <BaseButton
              outline
              id="vertical-menu-btn"
              className={`d-flex px-2 py-1 btn-action`}
              onClick={() => {
                toggleSidebar()
              }}
              style={{ width: "32px", height: "32px" }}
            >
              <i className="mdi mdi-menu font-size-16" />
            </BaseButton>
          )}
          <span className={`han-h2 han-fw-semibold han-text-primary`}>
            {currentMenu?.parentTitle ? t(currentMenu?.parentTitle) : currentMenu?.title}
          </span>
          <>
            {(isDetailView && !isSplitMode && !isMobile) || isPermitDetailView ? (
              <BackButton />
            ) : (
              ""
            )}
          </>
        </div>
        <div className="mail-header-right d-flex gap-2">
          {!isMobile && !isPermitDetailView && (isSplitMode || !isDetailView) && (
            <SearchFilterInput
              isFilter={true}
              initialData={queryParams?.keyword ?? ""}
              onSubmit={(keywork) => {
                const nParams = {
                  ...queryParams,
                  keyword: keywork,
                  searchfild: !!queryParams?.searchfild ? queryParams?.searchfild : "all",
                  searchbox: isReceiptsMenu ? "Receive" : queryParams?.searchbox,
                  viewcont: `0,${limit}`,
                }
                dispatch(setQueryParams(nParams))
              }}
            />
          )}

          {/* refresh */}
          {!isMobile && ((!isDetailView && !isPermitDetailView) || isSplitMode) && (
            <HanTooltip placement="top" overlay={t("common.org_refresh")}>
              <BaseButton
                color={`grey`}
                className={"btn-refresh btn-action py-0 fs-5"}
                icon={"mdi mdi-refresh"}
                iconClassName={"me-0"}
                onClick={onRefresh}
              />
            </HanTooltip>
          )}
        </div>
      </div>
    </Fragment>
  )
}

export default MainHeader
