// @ts-nocheck
import AddressDropdownActions from "pages/Detail/MailInfo/Left/AddressDropdownActions"
import React, { useRef, useState } from "react"

const AddressAction = ({ action, title, mail, anchorOrigin, transformOrigin, titleClass }) => {
  const addressRef = useRef(null)
  const [open, setOpen] = useState(false)

  return (
    <div className="sender px-2 cursor-pointer">
      <span
        className={titleClass}
        ref={addressRef}
        onClick={() => setOpen(true)}
        dangerouslySetInnerHTML={{
          __html: title,
        }}
      ></span>
      <AddressDropdownActions
        open={open}
        onClose={() => {
          setOpen(false)
        }}
        anchorEl={addressRef?.current}
        mailAddress={mail.from_addr || ""}
        action={action}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
      />
    </div>
  )
}

export default AddressAction
