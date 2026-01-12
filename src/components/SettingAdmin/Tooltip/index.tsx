// @ts-nocheck
import React, { useState } from "react"
import BaseIcon from "components/Common/BaseIcon"
import { Alert } from "reactstrap"

const Tooltip = (props) => {
  const { content, color = "success", className = "" } = props
  const [visible, setVisible] = useState(true)
  const onDismiss = () => setVisible(false)
  return (
    <div>
      <Alert color={color} className={className} isOpen={visible} toggle={onDismiss}>
        <div style={{ display: "flex", justifyContent: "left" }}>
          <div>
            <BaseIcon icon={"fas fa-info"} />
          </div>
          <div style={{ marginLeft: "10px" }} className="han-h5 han-fw-regular han-text-success">
            {content}
          </div>
        </div>
      </Alert>
    </div>
  )
}

export default Tooltip
