// @ts-nocheck
import Select from "react-select"
import { BaseButton, BaseModal } from "components/Common"
import React, { useEffect, useMemo, useState } from "react"
import { Input } from "reactstrap"
import { useTranslation } from "react-i18next"
import { getEmailConfig } from "modules/mail/common/api"
import { exceptListSortOptions } from "pages/Settings/AutoSort"

const AutoSortMailToFolderModal = ({ isOpen, data, toggle, onSortMail, menu }) => {
  const { t } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [fromAddr, setFromAddr] = useState(data ? data.from_addr : "")
  const [toAddr, setToAddr] = useState(data ? data?.to_addr || "" : "")
  const [subject, setSubject] = useState(data ? data.subject : "")
  const [mailbox, setMailbox] = useState(null)
  const [isMoveTogether, setIsMoveTogether] = useState(false)
  const [mailBoxOptions, setMailboxOptions] = useState([])

  useEffect(() => {
    getEmailConfig().then((res) => {
      if (res?.mailbox) {
        const listMailbox = res.mailbox
          ?.map((item) => ({
            value: item.key,
            label: item.name,
          }))
          .filter((option) => !exceptListSortOptions.includes(option.value))
        setMailboxOptions(listMailbox)
        setMailbox(listMailbox?.find((ele) => ele?.value === menu) || listMailbox[0])
      }
    })
  }, [])

  const renderBody = useMemo(() => {
    return (
      <div className="d-flex flex-column">
        <div className="mb-3">
          <p>{t("mail.mail_cspam_from")}</p>
          <Input value={fromAddr} onChange={(e) => setFromAddr(e.target.value)} />
        </div>
        <div className="mb-3">
          <p>{t("mail.mail_cspam_spam_to")}</p>
          <Input value={toAddr} onChange={(e) => setToAddr(e.target.value)} />
        </div>
        <div className="mb-3">
          <p>{t("common.mail_list_sort_subject")}</p>
          <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
        </div>
        <div className="mb-3">
          <p>{t("mail.mail_mobile_mbox")}</p>
          <Select
            value={mailbox}
            options={mailBoxOptions}
            onChange={setMailbox}
            menuPosition="fixed"
            styles={{
              menu: (base) => ({
                ...base,
                backgroundColor: "white!important",
              }),
            }}
          />
        </div>
        <div className="form-check form-check-primary mb-3">
          <input
            type="checkbox"
            className="form-check-input"
            id="received-mail"
            defaultChecked={isMoveTogether}
            onClick={(e) => setIsMoveTogether(e.target.checked)}
          />
          <label className="form-check-label" htmlFor="received-mail">
            {t("mail.mail_continue_confirm_check")}
          </label>
        </div>
      </div>
    )
  }, [mailbox, mailBoxOptions, fromAddr, toAddr, subject])
  return (
    <BaseModal
      isOpen={isOpen}
      toggle={toggle}
      renderHeader={() => {
        return <span>{t("mail.mail_view_autosplit")}</span>
      }}
      renderBody={renderBody}
      renderFooter={() => {
        return (
          <span className={"w-100 d-flex justify-content-end"}>
            <BaseButton
              color="primary"
              className={"mx-2"}
              onClick={() => {
                setLoading(true)
                onSortMail &&
                  onSortMail(
                    {
                      fromaddr: fromAddr,
                      toaddr: toAddr,
                      subject: subject,
                      mailbox: mailbox.value,
                    },
                    isMoveTogether,
                  )
                setLoading(false)
              }}
              icon="bx bx-save me-2"
              loading={loading}
            >
              {t("common.common_btn_save")}
            </BaseButton>
            <BaseButton outline color="grey" icon="bx bx-x me-2" onClick={toggle}>
              {t("common.common_btn_close")}
            </BaseButton>
          </span>
        )
      }}
    />
  )
}

export default AutoSortMailToFolderModal
