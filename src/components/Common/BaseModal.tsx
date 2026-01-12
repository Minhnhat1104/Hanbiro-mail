// @ts-nocheck
import classnames from "classnames"
import { isFunction } from "lodash"
import { createContext, useState } from "react"
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap"
import BaseIcon from "./BaseIcon"
import "./styles.scss"
import useDevice from "hooks/useDevice"

export const BaseModalContext = createContext({
  setFullscreen: (fullscreen) => {},
})

function BaseModal(props) {
  const {
    unmountOnClose = true,
    modalClass = "",
    contentClass = "",
    headerClass = "",
    headerModule = {},
    bodyClass = "",
    bodyModule = {},
    footerClass = "",
    footerModule = {},
    size = "lg",
    open = false,
    toggle = () => {},
    renderHeader,
    renderBody,
    renderFooter,
    backdrop = true,
    fullScreenMode = true,
    isDraggable = false,
    isScrollbox = true,
    isClose = true,
    ...rest
  } = props

  const { isMobile } = useDevice()

  const [isFullScreen, setIsFullScreen] = useState(false)

  return (
    <Modal
      size={size}
      isOpen={open}
      toggle={toggle}
      backdrop={backdrop}
      unmountOnClose={unmountOnClose}
      fullscreen={isFullScreen || "sm"}
      className={`base-modal ${modalClass}`}
      contentClassName={classnames("base-modal-content", contentClass)}
      {...rest}
    >
      <BaseModalContext.Provider
        value={{
          setFullscreen: setIsFullScreen,
        }}
      >
        {renderHeader && (
          <ModalHeader
            tag="h2"
            toggle={isClose && toggle}
            cssModule={headerModule}
            className={`base-modal ${headerClass}`}
            style={isDraggable ? { cursor: "move" } : {}}
          >
            <div className="w-100 d-flex justify-content-between">
              <span
                className="text-truncate d-flex align-items-center"
                style={{ width: isMobile ? "100%" : `${isClose ? "calc(100% - 24px)" : "100%"}` }}
              >
                {isFunction(renderHeader) ? renderHeader() : renderHeader}
              </span>
              {fullScreenMode && !isMobile && (
                <BaseIcon
                  className={`han-color-grey mdi ${
                    isFullScreen ? "mdi-fullscreen-exit" : "mdi-fullscreen"
                  }`}
                  onClick={(e) => {
                    e.stopPropagation()
                    setIsFullScreen((prev) => !prev)
                  }}
                />
              )}
            </div>
          </ModalHeader>
        )}
        {renderBody && (
          <ModalBody
            className={classnames("base-modal", bodyClass, {
              "scroll-box": !isFullScreen && isScrollbox,
            })}
            cssModule={bodyModule}
          >
            {isFunction(renderBody) ? renderBody() : renderBody}
          </ModalBody>
        )}
        {renderFooter && (
          <ModalFooter className={classnames("base-modal", footerClass)} cssModule={footerModule}>
            {isFunction(renderFooter) ? renderFooter() : renderFooter}
          </ModalFooter>
        )}
      </BaseModalContext.Provider>
    </Modal>
  )
}

export default BaseModal
