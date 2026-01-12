// @ts-nocheck
import React, { useMemo, useRef } from "react"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { formatDateListMail } from "../ListItem"
import { useSelector } from "react-redux"
import { formatSize } from "utils"
import { getStatusPermit } from ".."
import { showCipherIcon, showSentSecuStatus } from "../utils"
import { BaseButton, BaseIcon, BaseModal, BaseTable } from "components/Common"
import { useReactToPrint } from "react-to-print"
import "./styles.scss"

const PrintListModal = ({ open, onClose, list, language }) => {
  const { t } = useTranslation()
  const { menu } = useParams()

  const contentRef = useRef(null)
  const reactToPrintFn = useReactToPrint({
    contentRef,
    onAfterPrint: () => {
      onClose && onClose()
    },
  })

  const userConfig = useSelector((state) => state.Config.userConfig)

  const isReceiptsMenu = menu === "Receive"

  const heads = [
    { content: t("mail.mail_list_search_from") },
    { content: t("common.mail_list_sort_subject") },
    ...(isReceiptsMenu
      ? [{ content: t("mail.mail_list_sort_date") }, { content: t("mail.mail_receive_info") }]
      : [{ content: t("mail.mail_list_sort_size") }, { content: t("mail.mail_list_sort_date") }]),
    ,
  ]

  const rows = useMemo(() => {
    return list?.map((mail) => {
      const isNew = mail.isnew || mail.sigmsg === 0 || mail.sigmsg === 3

      return {
        class: "",
        columns: [
          {
            content: (
              <div className="p-1 d-flex gap-1 align-items-center">
                {!isReceiptsMenu && (
                  <>
                    {mail.isimportant ? (
                      <BaseIcon
                        icon={"fas fa-star"}
                        className={"star-toggle text-warning cursor-pointer"}
                      />
                    ) : (
                      <BaseIcon icon={"far fa-star"} className={"star-toggle"} />
                    )}
                  </>
                )}

                {mail?.sendlater && mail.sendlater.issendlater ? (
                  <span className="ms-2">
                    {mail.sendlater.sendlater_status == "c" ? (
                      <i className="mdi mdi-cancel color-red font-size-16"></i>
                    ) : null}
                    {mail.sendlater.sendlater_status == "n" ? (
                      <i className="mdi mdi-alpha-n-box color-orange font-size-16"></i>
                    ) : null}
                    {mail.sendlater.sendlater_status == "s" ? (
                      <i className="mdi mdi-check-bold color-green font-size-16"></i>
                    ) : null}
                  </span>
                ) : mail.delay && mail.delay != "no" ? (
                  <span className="ms-2">
                    {mail.delay == "cancel" ? (
                      <i className="mdi mdi-cancel color-red font-size-16"></i>
                    ) : null}
                    {mail.delay == "wait" ? (
                      <i className="mdi mdi-alpha-n-box color-orange font-size-16"></i>
                    ) : null}
                    {mail.delay == "success" ? (
                      <i className="mdi mdi-check-bold color-green font-size-16"></i>
                    ) : null}
                  </span>
                ) : null}

                <span
                  className={`han-h5 ${isNew ? "han-fw-bold" : "han-fw-regular"} han-text-primary`}
                >
                  {mail.from_name || mail.from_addr}
                </span>
              </div>
            ),
          },
          {
            content: (
              <div className={`p-1 d-flex justify-content-between flex-grow-1`}>
                {/* mail info */}
                <div className={`d-flex justify-content-start align-items-center w-80`}>
                  <span className={"info"}>
                    {mail?.security_info?.hasinfo && (
                      <BaseIcon className="mdi mdi-alert color-red " />
                    )}
                    {(mail.sigmsg == 2 || mail.sigmsg == 5) && (
                      <BaseIcon className="mdi mdi-reply color-blue" />
                    )}
                    {mail?.sendlater?.issendlater && (
                      <BaseIcon className="mdi mdi-clock color-pink" />
                    )}
                  </span>
                  <div
                    role={`button`}
                    className={`position-relative text-truncate d-flex align-items-center ${
                      menu === "Sent" ? "list-width" : ""
                    }`}
                  >
                    <span className={`flags ${mail.boxname != "" ? "" : "no-width"}`}>
                      {mail.boxname != "" && (
                        // <Badge className={"color-white me-1"} color="primary">
                        //   {mail.boxname}
                        // </Badge>
                        <span className="han-h6 han-fw-semibold badge han-badge-primary px-2 py-1 me-1">
                          {mail.boxname}
                        </span>
                      )}
                    </span>
                    {/* Show cipher icon */}
                    {showCipherIcon(mail)}
                    {/* Show sent secu status */}
                    {showSentSecuStatus(mail)}
                    {/* receipts menu cancel sending*/}
                    {isReceiptsMenu && mail?.getbackstate && (
                      <span
                        className={`cancel-sending ${
                          mail?.getbackstate === "complete" ? "complete" : ""
                        } ${language === "ko" ? "" : "large-text"}`}
                      >
                        {mail?.getbackstr}
                      </span>
                    )}
                    {mail.groupcount > 0 && (
                      <span
                        className={`color-red ${isNew ? "han-fw-bold" : "han-fw-regular"}`}
                      >{`(${mail.groupcount})`}</span>
                    )}
                    <span
                      className={`han-h5 ${
                        isNew ? "han-fw-bold" : "han-fw-regular"
                      } han-text-primary`}
                      dangerouslySetInnerHTML={{
                        __html: isReceiptsMenu
                          ? mail?.stripsubject
                          : mail.subject || t("mail.mail_summary_msg"),
                      }}
                    ></span>
                    {mail.vsstatus != "" && <span className={"color-red"}>{mail.vsstatus}</span>}
                  </div>
                </div>

                {/* approval mail */}
                {menu === "Sent" && getStatusPermit(mail?.secu_state, t)}
              </div>
            ),
          },
          {
            content: (
              <div className="p-1 d-flex gap-1 align-items-center text-nowrap">
                {isReceiptsMenu ? (
                  <span className="list-date">{formatDateListMail(mail, userConfig)}</span>
                ) : (
                  <>
                    <span className={"list-att-icon"}>
                      {mail.is_file != "0" && <BaseIcon icon={"fas fa-paperclip"} />}
                    </span>
                    <span className="list-size text-truncate">{formatSize(mail.size)}</span>
                  </>
                )}
              </div>
            ),
          },
          {
            content: (
              <div className="d-flex align-align-items-center">
                {isReceiptsMenu ? (
                  <span
                    className="p-1 list-date htime"
                    style={{
                      flex: 1,
                      minWidth: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {mail?.htime}
                  </span>
                ) : (
                  <span
                    className="p-1 list-date"
                    style={{
                      flex: 1,
                      minWidth: 0,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {formatDateListMail(mail, userConfig)}
                  </span>
                )}
              </div>
            ),
          },
        ],
      }
    })
  }, [list])

  const Body = (
    <div ref={contentRef}>
      <BaseTable heads={heads} rows={rows} />
    </div>
  )

  return (
    <BaseModal
      open={open}
      size={"xl"}
      toggle={onClose}
      renderHeader={<>{t("common.mail_print_msg")}</>}
      renderBody={Body}
      renderFooter={
        <>
          <BaseButton
            color="primary"
            icon={"bx bx-printer"}
            iconClassName="font-size-16 me-2"
            onClick={() => reactToPrintFn()}
          >
            {t("common.mail_print_msg")}
          </BaseButton>
          <BaseButton
            outline
            color="grey"
            icon={"bx bx-x"}
            iconClassName="font-size-16 me-2"
            onClick={onClose}
          >
            {t("common.common_close_msg")}
          </BaseButton>
        </>
      }
    />
  )
}

export default PrintListModal
