// @ts-nocheck
import React, { useState } from "react"
import { Button, Card, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap"
import { useTranslation } from "react-i18next"
import { formatEmailFrom, formatEmailTo } from "utils"
import HanTooltip from "../../../components/Common/HanTooltip"
import { BaseButton, BaseIcon } from "../../../components/Common"

const MailInfo = ({ mail, showMore, handleShowMore, handlePermitMail, handlePreviewApproval }) => {
  const { t } = useTranslation()

  // State
  const [showCountry, setShowCountry] = useState(false)

  // Format "From" information
  const { emailRegex: emailFromRegex, emailFromArr } = formatEmailFrom(mail?.from)
  // Format "To" information
  const { emailRegex: emailToRegex, emailTo, checkEmailTo } = formatEmailTo(mail?.to, mail?.myeamil)
  // Format "CC" information
  const {
    emailRegex: emailCCRegex,
    emailTo: emailCC,
    checkEmailTo: checkEmailCC,
  } = formatEmailTo(mail?.cc, mail?.myeamil)
  // Format "BCC" information
  const {
    emailRegex: emailBCCRegex,
    emailTo: emailBCC,
    checkEmailTo: checkEmailBCC,
  } = formatEmailTo(mail?.bcc, mail?.myeamil)

  const hideButtonPermitDenyList = ["a", "d", "r", "u", "z"]

  return (
    <div className={`d-flex flex-wrap gap-2 justify-content-between align-items-start mb-3`}>
      <div className="d-flex flex-column gap-1 position-relative">
        {/* from */}
        <div className="d-flex gap-2 align-items-center">
          <div
            style={{ minWidth: "50px" }}
            className="han-body2 han-text-secondary d-flex justify-content-between"
          >
            <span>{t("mail.mail_list_search_from")}</span>
            <span>{":"}</span>
          </div>
          <h5 className="han-h5 han-fw-medium han-text-primary d-flex position-relative my-0 gap-2">
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
          <Dropdown isOpen={showCountry} toggle={() => setShowCountry(!showCountry)}>
            <DropdownToggle className="p-0 border-0 bg-transparent font-size-17">
              <Button
                className="px-3 py-1 rounded-pill d-flex gap-2"
                outline
                tag="div" // fix warning button (Button) into button (DropdownToggle)
              >
                {mail?.geoip?.country_code ? (
                  <span className={`flag-icon flag-icon-${mail?.geoip?.country_code}`} />
                ) : mail?.geoip?.isprivate ? (
                  t("mail.mail_view_private_msg")
                ) : (
                  t("mail.mail_view_public_msg")
                )}
                <i className="mdi mdi-menu-down"></i>
              </Button>
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem>
                <span className="text-muted">{t("common.org_pri_contry_type")}: </span>
                <span className="text-dark">
                  {mail?.geoip?.country_code ? mail?.geoip?.country_code : "-"}
                </span>
              </DropdownItem>
              <DropdownItem>
                <span className="text-muted">{t("common.profile_login_history_ip")}: </span>
                <span className="text-dark">
                  {mail?.remoteip ? mail?.remoteip : "-"} (
                  {mail?.geoip?.isprivate
                    ? t("mail.mail_view_private_msg")
                    : t("mail.mail_view_public_msg")}
                  )
                </span>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>

        {/* --- To --- */}
        <div className={`d-flex gap-2 align-items-center ${mail?.cc ? "mb-1" : ""}`}>
          <div
            style={{ minWidth: "50px" }}
            className="han-body2 han-text-secondary d-flex justify-content-between"
          >
            <span>{t("common.main_mail_to")}</span>
            <span>{":"}</span>
          </div>
          <h5 className="han-h5 han-fw-medium han-text-primary d-flex position-relative my-0 gap-2">
            <span
              className={`d-flex gap-1 align-items-center cursor-pointer ${
                checkEmailTo ? "" : "pe-none"
              }`}
              onClick={() => handleShowMore("to", mail?.to)}
            >
              {emailToRegex ? (
                <span dangerouslySetInnerHTML={{ __html: emailToRegex }} />
              ) : (
                <span dangerouslySetInnerHTML={{ __html: emailTo ?? "" }} />
              )}
              {checkEmailTo && (
                <i
                  className={`text-muted animation-icon fa fa-chevron-down ${
                    showMore.open && showMore.type === "to" && "animation-animate"
                  }`}
                />
              )}
            </span>
          </h5>
        </div>

        {/* --- CC --- */}
        {mail?.cc && (
          <div className={`d-flex gap-2 align-items-center ${mail?.bcc ? "mb-1" : ""}`}>
            <div
              style={{ minWidth: "50px" }}
              className="han-body2 han-text-secondary d-flex justify-content-between"
            >
              <span className="han-text-secondary">{t("common.main_mail_cc")}</span>
              <span>{":"}</span>
            </div>
            <h5 className="han-h5 han-fw-medium han-text-primary d-flex position-relative my-0 gap-2">
              <span
                className={`d-flex gap-1 align-items-center cursor-pointer ${
                  checkEmailCC ? "" : "pe-none"
                }`}
                onClick={() => handleShowMore("cc", mail?.cc)}
              >
                {emailCCRegex ? (
                  <span dangerouslySetInnerHTML={{ __html: emailCCRegex }} />
                ) : (
                  <span dangerouslySetInnerHTML={{ __html: emailCC ?? "" }} />
                )}
                {checkEmailCC && (
                  <i
                    className={`text-muted animation-icon fa fa-chevron-down ${
                      showMore.open && showMore.type === "cc" && "animation-animate"
                    }`}
                  />
                )}
              </span>
            </h5>
          </div>
        )}

        {/* --- BCC --- */}
        {mail?.bcc && (
          <div className={`d-flex gap-2 align-items-center`}>
            <div
              style={{ minWidth: "50px" }}
              className="han-body2 han-text-secondary d-flex justify-content-between"
            >
              <span className="han-text-secondary">{t("common.main_mail_bcc")}</span>
              <span>{":"}</span>
            </div>
            <h5 className="han-h5 han-fw-medium han-text-primary d-flex position-relative my-0 gap-2">
              <span
                className={`d-flex gap-1 align-items-center cursor-pointer ${
                  checkEmailBCC ? "" : "pe-none"
                }`}
                onClick={() => handleShowMore("bcc", mail?.bcc)}
              >
                {emailBCCRegex ? (
                  <span dangerouslySetInnerHTML={{ __html: emailBCCRegex }} />
                ) : (
                  <span dangerouslySetInnerHTML={{ __html: emailBCC ?? "" }} />
                )}
                {checkEmailBCC && (
                  <i
                    className={`text-muted animation-icon fa fa-chevron-down ${
                      showMore.open && showMore.type === "bcc" && "animation-animate"
                    }`}
                  />
                )}
              </span>
            </h5>
          </div>
        )}

        {showMore.open && (
          <Card className="card-show-more active">
            <p className="mb-0" dangerouslySetInnerHTML={{ __html: showMore.data ?? "" }} />
          </Card>
        )}
      </div>
      <div className="d-flex flex-column gap-2 position-relative">
        <h6 className="han-body2 han-text-secondary m-0">{mail?.approval?.senddate}</h6>
        <div className="d-flex align-items-center justify-content-end gap-2">
          {/* Permit */}
          <HanTooltip placement="top" overlay={t("mail.mail_secure_allow_btn")}>
            <BaseButton
              color={"primary"}
              className={"btn-primary rounded-circle"}
              style={{ width: "30px", height: "30px" }}
              onClick={() => handlePreviewApproval && handlePreviewApproval(true)}
            >
              <i className="mdi mdi-information-symbol font-size-24"></i>
            </BaseButton>
          </HanTooltip>

          {!hideButtonPermitDenyList.includes(mail?.approval?.state) && (
            <>
              {/* Permit */}
              <HanTooltip placement="top" overlay={t("mail.mail_secure_allow_btn")}>
                <BaseButton
                  outline
                  color={"success"}
                  className={"btn-outline-success rounded-circle"}
                  style={{ width: "30px", height: "30px" }}
                  onClick={() => handlePermitMail && handlePermitMail("allow")}
                >
                  <i className="mdi mdi-check font-size-22"></i>
                </BaseButton>
              </HanTooltip>

              {/* Deny */}
              <HanTooltip placement="top" overlay={t("mail.mail_secure_deny_btn")}>
                <BaseButton
                  outline
                  color={"error"}
                  className={"btn-outline-error rounded-circle"}
                  style={{ width: "30px", height: "30px" }}
                  onClick={() => handlePermitMail && handlePermitMail("deny")}
                >
                  <i className="mdi mdi-close font-size-22"></i>
                </BaseButton>
              </HanTooltip>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default MailInfo
