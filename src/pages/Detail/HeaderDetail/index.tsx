// @ts-nocheck
import React from "react"

import useDevice from "hooks/useDevice"

import MailSubject from "./MailSubject"
import MailDetailButton from "./MailDetailButton"

const HeaderDetail = (props) => {
  const { isTablet, isMobile } = useDevice()

  return (
    <div
      className={`d-flex ${
        isTablet ? "flex-nowrap" : "flex-wrap"
      } gap-2 justify-content-between align-item-center`}
    >
      <MailSubject
        isSplitMode={props?.isSplitMode}
        important={props?.important}
        handleMarkAsImportant={props?.handleMarkAsImportant}
        isNewWindow={props?.isNewWindow}
      />
      {!props?.isSplitMode && !isMobile && <MailDetailButton {...props} />}
    </div>
  )
}

export default HeaderDetail
