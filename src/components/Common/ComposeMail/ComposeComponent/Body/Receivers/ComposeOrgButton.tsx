// @ts-nocheck
import HanTooltip from "components/Common/HanTooltip"
import React from "react"
import { Button } from "reactstrap"

const ComposeOrgButton = ({ t, type, handleOpenOrgModal }) => {
  return (
    <HanTooltip placement="top" overlay={t("common.approval_line_org")}>
      <Button
        outline
        className="compose-btn-org"
        onClick={() => handleOpenOrgModal && handleOpenOrgModal(type)}
      >
        <i className="mdi mdi-file-tree fs-5"></i>
      </Button>
    </HanTooltip>
  )
}

export default ComposeOrgButton
