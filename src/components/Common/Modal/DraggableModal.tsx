// @ts-nocheck
import React from "react"
import Draggable from "react-draggable"
import BaseModal from "../BaseModal"
import { Modal } from "reactstrap"

const DraggableModal = (props) => {
  return (
    <Draggable handle=".modal-header">
      <BaseModal {...props} />
    </Draggable>
  )
}

export default DraggableModal
