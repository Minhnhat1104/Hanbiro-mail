// @ts-nocheck
// React
import { useContext, useEffect, useMemo, useState } from "react"

// Third-party
import { Card } from "reactstrap"

// Project

import { ComposeContext } from ".."
import "../style.scss"

import DraggableModal from "components/Common/Modal/DraggableModal"
import useDevice from "hooks/useDevice"
import useLocalStorage from "hooks/useLocalStorage"
import ComposeBody from "../ComposeComponent/Body"
import ComposeFooter from "../ComposeComponent/Footer"
import HeaderModalBottom from "../ComposeComponent/HeaderModalBottom"
import HeaderModalCenter from "../ComposeComponent/HeaderModalCenter"
import ComposeCollapse from "../ComposeComponent/ComposeCollapse"
import { updateComposeMode, updateLocalComposeMode } from "store/composeMail/actions"
import { useDispatch, useSelector } from "react-redux"

export const LOCALSTORAGE_COMPOSE_DISPLAY_MODE = "hanbiro.mail.compose.display.mode"
export const composeDisplayModeOptions = {
  EXPAND: "expand",
  COLLAPSE: "collapse",
  MINIMIZE: "minimize",
}

const ComposeCenter = ({ composeId, composeMode, title, currentMenu, composeRef }) => {
  const { editorValue, handleChangeEditor, handleClose } = useContext(ComposeContext)

  const dispatch = useDispatch()
  const { isMobile, isTablet } = useDevice()

  const [isUnmount, setIsUnmount] = useState(false)

  const composeMails = useSelector((state) => state.ComposeMail.composeMails)
  const composeDisplayMode = composeMails.localComposeMode

  const [_, setLocalComposeDisplayMode] = useLocalStorage(
    LOCALSTORAGE_COMPOSE_DISPLAY_MODE,
    composeDisplayModeOptions.EXPAND,
  )

  const isCollapseMode = composeMode === composeDisplayModeOptions.COLLAPSE
  const isMinimize = composeMode === composeDisplayModeOptions.MINIMIZE

  useEffect(() => {
    if (editorValue && !isMinimize) {
      setTimeout(() => {
        handleChangeEditor(editorValue)
      }, 500)
    }
  }, [isCollapseMode])

  // --- Header ---
  const Header = useMemo(() => {
    return (
      <HeaderModalCenter
        title={title}
        composeId={composeId}
        isCollapseMode={isCollapseMode}
        handleMinimize={() => {
          if (isMinimize) {
            dispatch(updateComposeMode({ id: composeId, composeMode: composeDisplayMode }))
          } else {
            dispatch(
              updateComposeMode({
                id: composeId,
                composeMode: composeDisplayModeOptions.MINIMIZE,
              }),
            )
          }
        }}
        handleExpand={() => {
          if (isCollapseMode) {
            dispatch(
              updateComposeMode({
                id: composeId,
                composeMode: composeDisplayModeOptions.EXPAND,
              }),
            )
            dispatch(updateLocalComposeMode(composeDisplayModeOptions.EXPAND))
            setLocalComposeDisplayMode(composeDisplayModeOptions.EXPAND)
          } else {
            dispatch(
              updateComposeMode({
                id: composeId,
                composeMode: composeDisplayModeOptions.COLLAPSE,
              }),
            )
            dispatch(updateLocalComposeMode(composeDisplayModeOptions.COLLAPSE))
            setLocalComposeDisplayMode(composeDisplayModeOptions.COLLAPSE)
          }
        }}
        handleClose={handleClose}
      />
    )
  }, [isMinimize, isCollapseMode, title])

  const renderHeader = () => {
    return <>{Header}</>
  }

  // --- Body ---
  const renderBody = () => {
    return (
      <ComposeBody
        currentMenu={currentMenu}
        composeId={composeId}
        isCollapseMode={isCollapseMode}
        {...(!isCollapseMode && { bodyRef: composeRef })}
      />
    )
  }

  // --- Footer ---
  const renderFooter = () => {
    return (
      <div
        className={`d-flex justify-content-between ${
          isCollapseMode ? "" : "flex-wrap gap-2 align-items-center w-100"
        }`}
      >
        <ComposeFooter />
      </div>
    )
  }

  return (
    <div
      className={`compose-mail-wrapper ${isCollapseMode ? "collapse-mode" : ""}`}
      {...(isCollapseMode && { ref: composeRef })}
    >
      {isMinimize && (
        <div className={`compose-modal-minimize`}>
          <Card className="mb-0">
            <HeaderModalBottom
              title={title}
              totalCompose={composeMails?.data?.length}
              handleMinimize={() => {
                if (isMinimize) {
                  dispatch(updateComposeMode({ id: composeId, composeMode: composeDisplayMode }))
                  setTimeout(() => {
                    handleChangeEditor(editorValue)
                  }, 500)
                } else {
                  dispatch(
                    updateComposeMode({
                      id: composeId,
                      composeMode: composeDisplayModeOptions.MINIMIZE,
                    }),
                  )
                }
              }}
              handleExpand={() => {
                dispatch(
                  updateComposeMode({
                    id: composeId,
                    composeMode: composeDisplayModeOptions.EXPAND,
                  }),
                )
                dispatch(updateLocalComposeMode(composeDisplayModeOptions.EXPAND))
                setLocalComposeDisplayMode(composeDisplayModeOptions.EXPAND)
                setTimeout(() => {
                  handleChangeEditor(editorValue)
                }, 500)
              }}
              handleClose={() => {
                setIsUnmount(true)
                handleClose && handleClose()
              }}
            />
          </Card>
        </div>
      )}
      {composeMode === composeDisplayModeOptions.COLLAPSE && !isMobile && (
        <ComposeCollapse
          isMinimize={composeMode === composeDisplayModeOptions.MINIMIZE}
          renderHeader={renderHeader}
          renderBody={renderBody}
          renderFooter={renderFooter}
        />
      )}

      {composeMode === composeDisplayModeOptions.EXPAND && (
        <DraggableModal
          size="xl"
          centered
          isScrollbox={false}
          isDraggable={true}
          open={composeMode === composeDisplayModeOptions.EXPAND}
          unmountOnClose={isUnmount}
          modalClass={`${isTablet ? "modal-w-80" : ""}`}
          toggle={() => {
            setIsUnmount(true)
            handleClose && handleClose()
          }}
          renderHeader={renderHeader}
          renderBody={renderBody}
          renderFooter={renderFooter}
          headerModule={{
            "modal-title":
              "w-100 d-flex align-items-center justify-content-between mb-0 text-muted",
            "btn-close": "mdi mdi-close bg-transparent border-0 font-size-20 text-muted",
          }}
          contentClass="border-0 compose-modal-center"
          backdrop={"static"}
        />
      )}
    </div>
  )
}

export default ComposeCenter
