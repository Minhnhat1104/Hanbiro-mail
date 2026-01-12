// @ts-nocheck
// React
import React, { useContext, useEffect, useRef, useState } from "react"

// Third-party
import { useTranslation } from "react-i18next"

// Project
import { MailContext } from "pages/Detail"
import { finallyAddress, formatEmailFrom, formatEmailTo } from "utils"
import MailAddressDropdown from "components/MailAddressDropdown"
import CountryFlag from "./CountryFlag"
import { DetailNewWindowContext } from "pages/Detail/DetailForNewWindow"
import AddressDropdownActions from "./AddressDropdownActions"
import useClickOrDrag from "hooks/useClickOrDrag"

const Left = ({ isNewWindow, handleShowMore, showMore, addressDropdownAction }) => {
  const { mail } = useContext(isNewWindow ? DetailNewWindowContext : MailContext)
  const { t } = useTranslation()
  const fromRef = useRef(null)
  const toRef = useRef(null)
  const ccRef = useRef(null)
  const bccRef = useRef(null)
  const replyToRef = useRef(null)

  // State
  const [showCountry, setShowCountry] = useState(false)
  const [openFromActions, setOpenFromActions] = useState(false)
  const [openToActions, setOpenToActions] = useState(false)
  const [openCcActions, setOpenCcActions] = useState(false)
  const [openBccActions, setOpenBccActions] = useState(false)
  const [openReplyToActions, setOpenReplyToActions] = useState(false)

  useEffect(() => {
    resetActions()
  }, [mail])

  const resetActions = () => {
    setOpenFromActions(false)
    setOpenToActions(false)
    setOpenCcActions(false)
    setOpenBccActions(false)
    setOpenReplyToActions(false)
  }

  // Format "From" information
  const { emailRegex: emailFromRegex, emailFromArr } = formatEmailFrom(mail?.from)

  // Format "To" information
  const {
    emailRegex: emailToRegex,
    emailTo,
    checkEmailTo,
    emailToArr,
  } = formatEmailTo(mail?.to, mail?.myeamil)

  // Format "CC" information
  const {
    emailRegex: emailCCRegex,
    emailTo: emailCC,
    checkEmailTo: checkEmailCC,
    emailToArr: emailCCArr,
  } = formatEmailTo(mail?.cc, mail?.myeamil)

  // Format "BCC" information
  const {
    emailRegex: emailBCCRegex,
    emailTo: emailBCC,
    checkEmailTo: checkEmailBCC,
    emailToArr: emailBCCArr,
  } = formatEmailTo(mail?.bcc, mail?.myeamil)

  // Format "Reply to" information
  const {
    emailRegex: replyToRegex,
    emailTo: replyTo,
    checkEmailTo: checkReplyTo,
    emailToArr: replyToArr,
  } = formatEmailTo(mail?.replyto, mail?.myeamil)

  // handle drag or click
  const handleClickOrDrag = (type) => {
    switch (type) {
      case "from":
        setOpenFromActions(true)
        break
      case "to":
        !checkEmailTo && setOpenToActions(true)
        break
      case "cc":
        !checkEmailCC && setOpenCcActions(true)
        break
      case "bcc":
        !checkEmailBCC && setOpenBccActions(true)
        break
      case "replyTo":
        setOpenReplyToActions(true)
        break
      default:
        break
    }
  }

  const { handleMouseDown, handleMouseMove, handleMouseUp } = useClickOrDrag(handleClickOrDrag)

  return (
    <div className="d-flex flex-column gap-1 fw-normal">
      {/* from address */}
      <div className="d-flex gap-2 align-items-center" style={{ height: "22px" }}>
        <div
          style={{ minWidth: "55px" }}
          className="han-body2 han-text-secondary d-flex justify-content-between"
        >
          <span>{t("mail.mail_write_from")}</span>
          <span>{":"}</span>
        </div>
        <h5
          ref={fromRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={(e) => {
            handleMouseUp(e, "from")
          }}
          className="cursor-pointer han-h5 han-fw-medium han-text-primary my-0 position-relative d-flex gap-2"
        >
          {emailFromRegex ? (
            <span dangerouslySetInnerHTML={{ __html: emailFromRegex }}></span>
          ) : (
            <>
              {emailFromArr?.[0] !== ""
                ? emailFromArr[0]
                  ? emailFromArr[0]
                  : "-"
                : emailFromArr[1]
                ? emailFromArr[1]
                : "-"}
              <span
                dangerouslySetInnerHTML={{
                  __html:
                    emailFromArr?.[0] !== ""
                      ? emailFromArr[1]
                        ? "&lt;" + emailFromArr[1] + "&gt;"
                        : "-"
                      : emailFromArr[2]
                      ? emailFromArr[2]
                      : "-",
                }}
              />
            </>
          )}
        </h5>
        <AddressDropdownActions
          open={openFromActions}
          onClose={() => {
            setOpenFromActions(false)
          }}
          anchorEl={fromRef?.current}
          mailAddress={finallyAddress(emailFromRegex, emailFromArr)}
          action={addressDropdownAction}
        />

        {/* country */}
        <CountryFlag showCountry={showCountry} toggle={() => setShowCountry(!showCountry)} />
      </div>

      {/* To */}
      <div className={`d-flex gap-2 align-items-center`} style={{ height: "22px" }}>
        <div
          style={{ minWidth: "55px" }}
          className="han-body2 han-text-secondary d-flex justify-content-between"
        >
          <span>{t("common.main_mail_to")}</span>
          <span>{":"}</span>
        </div>
        <h5
          ref={toRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={(e) => {
            handleMouseUp(e, "to")
          }}
          className="cursor-pointer han-h5 han-fw-medium han-text-primary position-relative my-0 d-flex gap-2"
        >
          <span
            className={`cursor-pointer d-flex gap-1 align-items-center ${
              checkEmailTo ? "" : "pe-none"
            }`}
            {...(checkEmailTo
              ? {
                  onClick: (e) => {
                    e.stopPropagation()
                    handleShowMore("to", mail?.to)
                  },
                }
              : {})}
          >
            {emailToRegex ? (
              <span dangerouslySetInnerHTML={{ __html: emailToRegex }} />
            ) : (
              <span dangerouslySetInnerHTML={{ __html: emailTo ?? "" }} />
            )}
            {checkEmailTo && (
              <i
                className={`animation-icon fa fa-chevron-down ${
                  showMore.open && showMore.type === "to" && "animation-animate"
                }`}
              />
            )}
          </span>
        </h5>
        {!checkEmailTo && (
          <AddressDropdownActions
            open={openToActions}
            onClose={() => {
              setOpenToActions(false)
            }}
            anchorEl={toRef?.current}
            mailAddress={finallyAddress(emailToRegex, emailToArr)}
            action={addressDropdownAction}
          />
        )}
      </div>

      {/* CC */}
      {mail?.cc && (
        <div className={`d-flex gap-2 align-items-center`} style={{ height: "22px" }}>
          <div
            style={{ minWidth: "55px" }}
            className="han-body2 han-text-secondary d-flex justify-content-between"
          >
            <span className="han-text-secondary">{t("common.main_mail_cc")}</span>
            <span>{":"}</span>
          </div>
          <h5
            ref={ccRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={(e) => {
              handleMouseUp(e, "cc")
            }}
            className="cursor-pointer han-h5 han-fw-medium han-text-primary position-relative my-0 d-flex gap-1"
          >
            <span
              className={`cursor-pointer d-flex gap-1 align-items-center ${
                checkEmailCC ? "" : "pe-none"
              }`}
              {...(checkEmailCC
                ? {
                    onClick: (e) => {
                      e.stopPropagation()
                      handleShowMore("cc", mail?.cc)
                    },
                  }
                : {})}
            >
              {emailCCRegex ? (
                <span dangerouslySetInnerHTML={{ __html: emailCCRegex }} />
              ) : (
                <span dangerouslySetInnerHTML={{ __html: emailCC ?? "" }} />
              )}
              {checkEmailCC && (
                <i
                  className={`animation-icon fa fa-chevron-down ${
                    showMore.open && showMore.type === "cc" && "animation-animate"
                  }`}
                />
              )}
            </span>
          </h5>
          {!checkEmailCC && (
            <AddressDropdownActions
              open={openCcActions}
              onClose={() => {
                setOpenCcActions(false)
              }}
              anchorEl={ccRef?.current}
              mailAddress={finallyAddress(emailCCRegex, emailCCArr)}
              action={addressDropdownAction}
            />
          )}
        </div>
      )}

      {/* BCC */}
      {mail?.bcc && (
        <div className="d-flex gap-2 align-items-center" style={{ height: "22px" }}>
          <div
            style={{ minWidth: "55px" }}
            className="han-body2 han-text-secondary d-flex justify-content-between"
          >
            <span className="han-text-secondary">{t("common.main_mail_bcc")}</span>
            <span>{":"}</span>
          </div>
          <h5
            ref={bccRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={(e) => {
              handleMouseUp(e, "bcc")
            }}
            className="cursor-pointer han-h5 han-fw-medium han-text-primary position-relative my-0 d-flex gap-1"
          >
            <span
              className={`cursor-pointer d-flex gap-1 align-items-center ${
                checkEmailBCC ? "" : "pe-none"
              }`}
              {...(checkEmailBCC
                ? {
                    onClick: (e) => {
                      e.stopPropagation()
                      handleShowMore("bcc", mail?.bcc)
                    },
                  }
                : {})}
            >
              {emailBCCRegex ? (
                <span dangerouslySetInnerHTML={{ __html: emailBCCRegex }} />
              ) : (
                <span dangerouslySetInnerHTML={{ __html: emailBCC ?? "" }} />
              )}
              {checkEmailBCC && (
                <i
                  className={`animation-icon fa fa-chevron-down ${
                    showMore.open && showMore.type === "bcc" && "animation-animate"
                  }`}
                />
              )}
            </span>
          </h5>
          {!checkEmailBCC && (
            <AddressDropdownActions
              open={openBccActions}
              onClose={() => {
                setOpenBccActions(false)
              }}
              anchorEl={bccRef?.current}
              mailAddress={finallyAddress(emailBCCRegex, emailBCCArr)}
              action={addressDropdownAction}
            />
          )}
        </div>
      )}

      {/* Reply to */}
      {mail?.replyto && (
        <div className="d-flex gap-2 align-items-center" style={{ height: "22px" }}>
          <div
            style={{ minWidth: "55px" }}
            className="han-body2 han-text-secondary d-flex justify-content-between"
          >
            <span className="han-text-secondary">{t("mail.mail_reply_to")}</span>
            <span>{":"}</span>
          </div>
          <h5
            ref={replyToRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={(e) => {
              handleMouseUp(e, "replyTo")
            }}
            className="han-h5 han-fw-medium han-text-primary cursor-pointer position-relative my-0 d-flex gap-1"
          >
            <span
              className={`cursor-pointer d-flex gap-1 align-items-center ${
                checkReplyTo ? "" : "pe-none"
              }`}
              {...(checkReplyTo
                ? {
                    onClick: (e) => {
                      e.stopPropagation()
                      handleShowMore("bcc", mail?.replyto)
                    },
                  }
                : {})}
            >
              {replyToRegex ? (
                <span dangerouslySetInnerHTML={{ __html: replyToRegex }} />
              ) : (
                <span dangerouslySetInnerHTML={{ __html: replyTo ?? "" }} />
              )}
              {checkReplyTo && (
                <i
                  className={`animation-icon fa fa-chevron-down ${
                    showMore.open && showMore.type === "bcc" && "animation-animate"
                  }`}
                />
              )}
            </span>
          </h5>
          {!checkReplyTo && (
            <AddressDropdownActions
              open={openReplyToActions}
              onClose={() => {
                setOpenReplyToActions(false)
              }}
              anchorEl={replyToRef?.current}
              mailAddress={finallyAddress(replyToRegex, replyToArr)}
              action={addressDropdownAction}
            />
          )}
        </div>
      )}
    </div>
  )
}

export default Left
