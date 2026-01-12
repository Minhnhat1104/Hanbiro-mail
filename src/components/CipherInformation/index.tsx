// @ts-nocheck
// React
import React, { useContext, useEffect, useState } from "react"

// Third-party
import { Input } from "reactstrap"
import { useTranslation } from "react-i18next"

// Project
import Loading from "components/Common/Loading"
import BaseTable from "components/Common/BaseTable"
import BaseButtonTooltip from "components/Common/BaseButtonTooltip"
import { Headers, emailPost } from "helpers/email_api_helper"
import { useCustomToast } from "hooks/useCustomToast"
import { URL_SET_CIPHER } from "modules/mail/common/urls"
import { MailContext } from "pages/Detail"

import "./style.scss"
import { DetailNewWindowContext } from "pages/Detail/DetailForNewWindow"

const CipherInformation = ({
  isNewWindow,
  dataCipher = {},
  dataRelatedMail = {},
}) => {
  const { t } = useTranslation()
  const { successToast, errorToast } = useCustomToast()

  const { getMail, getRelatedMail } = useContext(
    isNewWindow ? DetailNewWindowContext : MailContext
  )

  const [countLimit, setCountLimit] = useState({ isOpen: false, value: 0 })
  const [dayLimit, setDayLimit] = useState({ isOpen: false, value: 0 })

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    dataCipher?.countlimit &&
      setCountLimit({ ...countLimit, value: dataCipher?.countlimit })
    dataCipher?.daylimit &&
      setDayLimit({ ...dayLimit, value: dataCipher?.daylimit })
  }, [])

  // Handle save data
  const handleSave = async (mid, value, type) => {
    let params = { mids: mid }
    if (type == "daylimit") {
      params.daylimit = value
    } else {
      params.countlimit = value
    }

    setIsLoading(true)
    try {
      const res = await emailPost(URL_SET_CIPHER, params, Headers)
      if (res.success) {
        successToast()
        getMail()
        dataRelatedMail.total > 0 && getRelatedMail()
      }
      setIsLoading(false)
    } catch (err) {
      errorToast()
      setIsLoading(false)
    }

    type === "daylimit"
      ? setDayLimit({ ...dayLimit, isOpen: false })
      : setCountLimit({ ...countLimit, isOpen: false })
  }

  // Config header for table
  const heads = [
    { content: t("mail.asset_status"), class: "w-20" },
    { content: t("mail.mail_cipher_password"), class: "w-20" },
    { content: t("mail.mail_cipher_count_limit"), class: "w-20" },
    { content: t("mail.mail_cipher_day_limit"), class: "w-20" },
    { content: t("mail.mail_cipher_read_count"), class: "w-20" },
  ]

  // Config data row for table
  const rows = [
    {
      class: "align-middle",
      columns: [
        { content: dataCipher?.status, class: "w-20" },
        { content: dataCipher?.password, class: "w-20" },
        {
          content: (
            <div className="d-flex align-items-center gap-1">
              {!countLimit.isOpen && (
                <>
                  {dataCipher?.countlimit}
                  {dataCipher?.type == "abletostop" && (
                    <BaseButtonTooltip
                      title={t("common.todo_edit_msg")}
                      id="edit-countlimit-cipher-information"
                      className="bg-transparent border-0 text-primary font-size-17 px-2"
                      icon="mdi mdi-pencil"
                      iconClassName="me-0"
                      onClick={() =>
                        setCountLimit({ ...countLimit, isOpen: true })
                      }
                    />
                  )}
                </>
              )}
              {countLimit.isOpen && (
                <>
                  <div>
                    <Input
                      type="text"
                      value={countLimit.value}
                      className="padding-input"
                      onChange={e =>
                        setCountLimit({ ...countLimit, value: e.target.value })
                      }
                    />
                  </div>
                  <BaseButtonTooltip
                    title={t("common.todo_confirm_msg")}
                    id="save-countlimit-cipher-information"
                    className="bg-transparent border-0 text-primary font-size-17 px-2"
                    icon="mdi mdi-content-save"
                    iconClassName="me-0"
                    onClick={() =>
                      handleSave(
                        dataCipher?.mid,
                        countLimit.value,
                        "countlimit"
                      )
                    }
                  />
                  <BaseButtonTooltip
                    title={t("common.todo_delete_msg")}
                    id="delete-countlimit-cipher-information"
                    className="bg-transparent border-0 text-danger font-size-17 px-2"
                    icon="mdi mdi-window-close"
                    iconClassName="me-0"
                    onClick={() =>
                      setCountLimit({
                        isOpen: false,
                        value: dataCipher?.countlimit,
                      })
                    }
                  />
                </>
              )}
            </div>
          ),
          class: "w-20",
        },
        {
          content: (
            <div className="d-flex align-items-center gap-1">
              {!dayLimit.isOpen && (
                <>
                  {dataCipher?.daylimit}
                  {dataCipher?.type == "abletostop" && (
                    <BaseButtonTooltip
                      title={t("common.todo_edit_msg")}
                      id="edit-daylimit-cipher-information"
                      className="bg-transparent border-0 text-primary font-size-17 px-2"
                      icon="mdi mdi-pencil"
                      iconClassName="me-0"
                      onClick={() => setDayLimit({ ...dayLimit, isOpen: true })}
                    />
                  )}
                </>
              )}
              {dayLimit.isOpen && (
                <>
                  <div>
                    <Input
                      type="text"
                      value={dayLimit.value}
                      className="padding-input"
                      onChange={e =>
                        setDayLimit({ ...dayLimit, value: e.target.value })
                      }
                    />
                  </div>
                  <BaseButtonTooltip
                    title={t("common.todo_confirm_msg")}
                    id="save-daylimit-cipher-information"
                    className="bg-transparent border-0 text-primary font-size-17 px-2"
                    icon="mdi mdi-content-save"
                    iconClassName="me-0"
                    onClick={() =>
                      handleSave(dataCipher?.mid, dayLimit.value, "daylimit")
                    }
                  />
                  <BaseButtonTooltip
                    title={t("common.todo_delete_msg")}
                    id="delete-daylimit-cipher-information"
                    className="bg-transparent border-0 text-danger font-size-17 px-2"
                    icon="mdi mdi-window-close"
                    iconClassName="me-0"
                    onClick={() =>
                      setDayLimit({
                        isOpen: false,
                        value: dataCipher?.daylimit,
                      })
                    }
                  />
                </>
              )}
            </div>
          ),
          class: "w-20",
        },
        { content: dataCipher?.countnow, class: "w-20" },
      ],
    },
  ]

  return (
    <div className="position-relative">
      <h6>{t("mail.mail_cipher_information")}</h6>
      <BaseTable heads={heads} rows={rows} />
      {isLoading && (
        <div className="position-absolute top-50 start-50 translate-middle">
          <Loading />
        </div>
      )}
    </div>
  )
}

export default CipherInformation
