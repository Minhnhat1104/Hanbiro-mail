// @ts-nocheck
import React, { useRef, useState } from "react"
import AddressDropdownActions from "./Left/AddressDropdownActions"
import { finallyAddress } from "utils"
import useClickOrDrag from "hooks/useClickOrDrag"

const EmailMoreItem = ({ address, emailRegex, emailArr, addressDropdownAction }) => {
  const addressRef = useRef()

  const { handleMouseDown, handleMouseMove, handleMouseUp } = useClickOrDrag(() => setOpen(true))

  const [open, setOpen] = useState(false)

  return (
    <span key={address} className="cursor-pointer">
      <span
        ref={addressRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        dangerouslySetInnerHTML={{
          __html: address ?? "",
        }}
      ></span>
      <AddressDropdownActions
        open={open}
        onClose={() => {
          setOpen(false)
        }}
        anchorEl={addressRef?.current}
        mailAddress={finallyAddress(emailRegex, emailArr)}
        action={addressDropdownAction}
      />
    </span>
  )
}

export default EmailMoreItem
