// @ts-nocheck
// React
import React, { useContext, useState } from "react"

// Third-party
import { Card } from "reactstrap"
import { useDispatch, useSelector } from "react-redux"

// Project
import { expandComposeModal } from "store/composeMail/actions"

import "../style.scss"
import HeaderModalBottom from "../ComposeComponent/HeaderModalBottom"
import ComposeBody from "../ComposeComponent/Body"
import ComposeFooter from "../ComposeComponent/Footer"

import { ComposeContext } from ".."

const ComposeBottom = ({ title }) => {
  const { handleClose } = useContext(ComposeContext)

  const dispatch = useDispatch()
  const expandComposeMail = useSelector((state) => state.ComposeMail.expandComposeMail)

  // State for Minimize
  const [isMinimize, setIsMinimize] = useState(false)

  return (
    <div className={`${!isMinimize ? "compose-modal" : "compose-modal-minimize"}`}>
      <Card className="mb-0">
        {/* --- Header --- */}
        <HeaderModalBottom
          title={title}
          handleMinimize={() => setIsMinimize(!isMinimize)}
          handleExpand={() => dispatch(expandComposeModal(!expandComposeMail))}
          handleClose={handleClose}
        />

        {!isMinimize && (
          <div className="px-3 py-2 mb-2">
            {/* --- Body --- */}
            <ComposeBody />

            {/* --- Footer --- */}
            <div className="d-flex align-items-center justify-content-between mt-3">
              <ComposeFooter />
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

export default ComposeBottom
