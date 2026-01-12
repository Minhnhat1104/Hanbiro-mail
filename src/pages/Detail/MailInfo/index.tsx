// @ts-nocheck
// React
import { Fragment, useContext, useRef, useState } from "react"

// Third-party
import "flag-icon-css/css/flag-icons.min.css"
import { Card } from "reactstrap"

// Project
import { finallyAddress, formatEmailTo } from "utils"

import Left from "./Left"

import MailAddressDropdown from "components/MailAddressDropdown"
import { DetailNewWindowContext } from "../DetailForNewWindow"
import MailDate from "./MailDate"
import { MailContext } from "../index"
import EmailMoreItem from "./EmailMoreItem"
import MailInfoMobile from "./MailInfoMobile"
import useDevice from "hooks/useDevice"
import useClickOutside from "hooks/useClickOutside"

const MailInfo = ({ isNewWindow, addressDropdownAction }) => {
  const { menu, mail, getMail } = useContext(isNewWindow ? DetailNewWindowContext : MailContext)
  const { isMobile } = useDevice()

  const showMoreRef = useRef(null)

  useClickOutside(showMoreRef, () => {
    if (showMore.open) setShowMore((prev) => ({ ...prev, open: false }))
  })

  const [showMore, setShowMore] = useState({
    type: "to",
    open: false,
    data: null,
  })

  const handleShowMore = (type, data) => {
    setShowMore((prev) => ({
      type,
      open: !prev.open,
      data,
    }))
  }

  return (
    <div className="position-relative mb-1">
      <div className="d-flex flex-wrap gap-2 justify-content-between align-items-start">
        {isMobile ? (
          <MailInfoMobile
            isNewWindow={isNewWindow}
            showMore={showMore}
            handleShowMore={handleShowMore}
            addressDropdownAction={addressDropdownAction}
          />
        ) : (
          <Left
            isNewWindow={isNewWindow}
            showMore={showMore}
            handleShowMore={handleShowMore}
            addressDropdownAction={addressDropdownAction}
          />
        )}

        {!isMobile && <MailDate isNewWindow={isNewWindow} />}
      </div>

      {showMore.open && (
        <Card innerRef={showMoreRef} className="card-show-more active">
          <span>
            {showMore?.data?.split(",")?.map((add, index) => {
              const length = showMore?.data?.split(",")?.length
              const { emailRegex: emailRegex, emailToArr: emailArr } = formatEmailTo(
                add?.trim(),
                mail?.myeamil,
              )

              return (
                <Fragment key={add}>
                  <EmailMoreItem
                    address={add}
                    emailArr={emailArr}
                    emailRegex={emailRegex}
                    addressDropdownAction={addressDropdownAction}
                  />
                  {index < length - 1 ? ", " : ""}
                </Fragment>
              )
            })}
          </span>
        </Card>
      )}
    </div>
  )
}

export default MailInfo
