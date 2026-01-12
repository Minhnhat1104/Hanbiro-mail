// @ts-nocheck
import { Split } from "@geoffcox/react-splitter"
import withRouter from "components/Common/withRouter"
import Detail from "pages/Detail"
import List from "pages/List"
import PermitMail from "pages/PermitMail"
import PermitMailDetail from "pages/PermitMail/Details/index"
import { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Route, Routes } from "react-router-dom"
import { Card } from "reactstrap"
import { selectUserMailSetting } from "store/auth/config/selectors"
import { setShowSidebar, setSplitMode } from "store/viewMode/actions"
import SplitViewEmpty from "./SplitViewEmpty"
import "./styles.scss"
import useDevice from "hooks/useDevice"
import MainHeader from "pages/Main/MainHeader"

const MIN_SPLIT_PRIMARY_SIZE = "450px"
const MIN_SPLIT_SECONDARY_SIZE = "450px"
const SPLITTER_SIZE = "4px"

const initialData = {
  attr: {
    total: 0,
    limit: 20,
    page: 1,
  },
  info: {
    countNew: {
      new: 0,
      total: 0,
    },
    isImportantAll: false,
    isSelectAll: false,
    isUnreadAll: true,
  },
}

const colors = {
  drag: "blue",
  click: "white",
}

const Main = (props) => {
  const { router } = props
  const { isTablet, isMobile } = useDevice()
  // redux
  const dispatch = useDispatch()
  const { isSplitMode } = useSelector((state) => state.viewMode)
  const userMailSetting = useSelector(selectUserMailSetting)

  // state
  const [isHidePageInfo, setIsHidePageInfo] = useState(false)
  const [isChangeAttView, setIsChangeAttView] = useState(false)
  const [splitData, setSplitData] = useState(null)

  const menu = useMemo(() => {
    return router?.params?.menu
  }, [router?.params?.menu])

  useEffect(() => {
    if (splitData) {
      if (splitData?.primary < 600) {
        !isHidePageInfo && setIsHidePageInfo(true)
      } else {
        isHidePageInfo && setIsHidePageInfo(false)
      }
      if (splitData?.secondary < 600) {
        !isChangeAttView && setIsChangeAttView(true)
      } else {
        isChangeAttView && setIsChangeAttView(false)
      }
    }
  }, [splitData])

  useEffect(() => {
    if (userMailSetting) {
      const result = userMailSetting?.list_pane_type === "hidden" ? false : true
      if (isTablet || isMobile) {
        dispatch(setSplitMode(false))
        dispatch(setShowSidebar(false))
      } else {
        dispatch(setShowSidebar(true))
        if (result !== isSplitMode && !isTablet) {
          dispatch(setSplitMode(result))
        }
      }
    }
  }, [userMailSetting, isTablet, isMobile])

  return (
    <Card
      className={`${
        isMobile ? "main-card-mobile " : "main-card "
      }h-100 px-3 p-2 m-0 overflow-hidden`}
    >
      <MainHeader />
      <div style={{ height: "calc(100% - 55px)" }}>
        <Routes>
          <Route
            path="/"
            element={
              <>
                {menu === "Approval" && <PermitMail menu={menu} />}
                {menu !== "Approval" && (
                  <>
                    {isSplitMode ? (
                      <Split
                        splitterSize={SPLITTER_SIZE}
                        minPrimarySize={MIN_SPLIT_PRIMARY_SIZE}
                        minSecondarySize={MIN_SPLIT_SECONDARY_SIZE}
                        onMeasuredSizesChanged={setSplitData}
                        className={`gap-2`}
                      >
                        <List
                          menu={menu}
                          isSplitMode={isSplitMode}
                          isHidePageInfo={isHidePageInfo}
                        />
                        <SplitViewEmpty />
                      </Split>
                    ) : (
                      <List menu={menu} isSplitMode={isSplitMode} />
                    )}
                  </>
                )}
              </>
            }
          />

          <Route
            path="/:mid?"
            element={
              <>
                {menu === "Approval" && <PermitMailDetail />}
                {menu !== "Approval" && (
                  <>
                    {isSplitMode ? (
                      <Split
                        splitterSize={SPLITTER_SIZE}
                        minPrimarySize={MIN_SPLIT_PRIMARY_SIZE}
                        minSecondarySize={MIN_SPLIT_SECONDARY_SIZE}
                        onMeasuredSizesChanged={setSplitData}
                      >
                        <List
                          menu={menu}
                          isSplitMode={isSplitMode}
                          isHidePageInfo={isHidePageInfo}
                        />
                        <Detail isChangeAttView={isChangeAttView} />
                      </Split>
                    ) : (
                      <Detail isChangeAttView={isChangeAttView} />
                    )}
                  </>
                )}
              </>
            }
          />
        </Routes>
      </div>
    </Card>
  )
}

export default withRouter(Main)
