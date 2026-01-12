// @ts-nocheck
import React from "react"
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap"
import BaseButton from "../BaseButton"

const Dialog = ({ title, content, buttons, children, ...props }) => {
  return (
    <Modal {...props}>
      <ModalHeader>{title} </ModalHeader>
      <ModalBody>{content ? content : children}</ModalBody>
      <ModalFooter className="d-flex justify-content-end">
        {buttons?.map((button, i) => (
          <BaseButton
            key={i}
            outline={button?.isOutline}
            iconClassName={button?.icon}
            onClick={button?.onClick}
            className={button?.className}
            color={button?.color}
          >
            {button?.text}
          </BaseButton>
        ))}
      </ModalFooter>
    </Modal>
  )
}

export default Dialog
