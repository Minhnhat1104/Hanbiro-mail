// @ts-nocheck
// React
import { useContext, useRef, useState } from "react"

// Third-party
import { useTranslation } from "react-i18next"

// Project
import useClickOrDrag from "hooks/useClickOrDrag"
import { MailContext } from "pages/Detail"
import { DetailNewWindowContext } from "pages/Detail/DetailForNewWindow"
import { finallyAddress, formatEmailFrom, formatEmailTo } from "utils"
import AddressDropdownActions from "./Left/AddressDropdownActions"

const MailInfoMobile = ({ isNewWindow, handleShowMore, showMore, addressDropdownAction }) => {
  const { mail } = useContext(isNewWindow ? DetailNewWindowContext : MailContext)
  const { t } = useTranslation()

  const fromRef = useRef(null)
  const toRef = useRef(null)
  const ccRef = useRef(null)
  const bccRef = useRef(null)
  const replyToRef = useRef(null)

  // State
  const [openFromActions, setOpenFromActions] = useState(false)
  const [openToActions, setOpenToActions] = useState(false)
  const [openCcActions, setOpenCcActions] = useState(false)
  const [openBccActions, setOpenBccActions] = useState(false)
  const [openReplyToActions, setOpenReplyToActions] = useState(false)

  // handle drag or click
  const handleClickOrDrag = (type) => {
    switch (type) {
      case "from":
        setOpenFromActions(true)
        break
      case "to":
        setOpenToActions(true)
        break
      case "cc":
        setOpenCcActions(true)
        break
      case "bcc":
        setOpenBccActions(true)
        break
      case "replyTo":
        setOpenReplyToActions(true)
        break
      default:
        break
    }
  }

  const { handleMouseDown, handleMouseMove, handleMouseUp } = useClickOrDrag(handleClickOrDrag)

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

  return (
    <div className="d-flex flex-column gap-2 fw-normal border border-1 rounded-1 p-2 w-100">
      {/* from address */}
      <div className="row align-items-start">
        <div className="col-3 han-body2 han-text-secondary d-flex justify-content-between">
          <span>{t("mail.mail_write_from")}</span>
        </div>
        <h5
          ref={fromRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={(e) => {
            handleMouseUp(e, "from")
          }}
          className="col-9 cursor-pointer han-h5 han-fw-medium han-text-primary my-0 position-relative d-flex flex-wrap gap-2"
        >
          {emailFromRegex ? (
            <span>{emailFromRegex}</span>
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
      </div>

      {/* To */}
      <div className={`row align-items-start`}>
        <div className="col-3 han-body2 han-text-secondary d-flex justify-content-between">
          <span>{t("common.main_mail_to")}</span>
        </div>
        <h5
          ref={toRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={(e) => {
            handleMouseUp(e, "to")
          }}
          className="col-9 cursor-pointer han-h5 han-fw-medium han-text-primary position-relative my-0 d-flex gap-2"
        >
          <span
            className={`cursor-pointer d-flex gap-1 align-items-start ${
              checkEmailTo ? "" : "pe-none"
            }`}
            {...(checkEmailTo ? { onClick: () => handleShowMore("to", mail?.to) } : {})}
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
        <div className={`row align-items-start`}>
          <div className="col-3 han-body2 han-text-secondary d-flex justify-content-between">
            <span className="han-text-secondary">{t("common.main_mail_cc")}</span>
          </div>
          <h5
            ref={ccRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={(e) => {
              handleMouseUp(e, "cc")
            }}
            className="col-9 cursor-pointer han-h5 han-fw-medium han-text-primary position-relative my-0 d-flex gap-1"
          >
            <span
              className={`cursor-pointer d-flex gap-1 align-items-start ${
                checkEmailCC ? "" : "pe-none"
              }`}
              {...(checkEmailCC ? { onClick: () => handleShowMore("cc", mail?.cc) } : {})}
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
        <div className="row align-items-start">
          <div className="col-3 han-body2 han-text-secondary d-flex justify-content-between">
            <span className="han-text-secondary">{t("common.main_mail_bcc")}</span>
          </div>
          <h5
            ref={bccRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={(e) => {
              handleMouseUp(e, "bcc")
            }}
            className="col-9 cursor-pointer han-h5 han-fw-medium han-text-primary position-relative my-0 d-flex gap-1"
          >
            <span
              className={`cursor-pointer d-flex gap-1 align-items-start ${
                checkEmailBCC ? "" : "pe-none"
              }`}
              {...(checkEmailBCC ? { onClick: () => handleShowMore("bcc", mail?.bcc) } : {})}
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
        <div className="row align-items-start">
          <div className="col-3 han-body2 han-text-secondary d-flex justify-content-between">
            <span className="han-text-secondary">{t("mail.mail_reply_to")}</span>
          </div>
          <h5
            ref={replyToRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={(e) => {
              handleMouseUp(e, "replyTo")
            }}
            className="col-9 han-h5 han-fw-medium han-text-primary cursor-pointer position-relative my-0 d-flex gap-1"
          >
            <span
              className={`cursor-pointer d-flex gap-1 align-items-start ${
                checkReplyTo ? "" : "pe-none"
              }`}
              {...(checkReplyTo ? { onClick: () => handleShowMore("bcc", mail?.replyto) } : {})}
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

      {/* date */}
      <div className="row align-items-center">
        <div className="col-3 han-body2 han-text-secondary">
          <span>{t("mail.mail_list_sort_date")}</span>
        </div>

        <h6 className="col-9 han-body2 han-text-primary mb-0">{mail?.receivedate}</h6>
      </div>
    </div>
  )
}

export default MailInfoMobile
