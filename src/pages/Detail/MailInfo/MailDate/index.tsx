// @ts-nocheck
import { MailContext } from "pages/Detail"
import { DetailNewWindowContext } from "pages/Detail/DetailForNewWindow"
import React, { useContext } from "react"

const MailDate = ({ isNewWindow }) => {
  const { mail } = useContext(isNewWindow ? DetailNewWindowContext : MailContext)
  return <h6 className="han-body2 han-text-secondary m-0 me-3 mt-1">{mail?.receivedate}</h6>
}

export default MailDate
