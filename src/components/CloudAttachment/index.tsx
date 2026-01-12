// @ts-nocheck
// React
import React, { useMemo, useContext, useState } from "react"

// Third-party
import { useSelector } from "react-redux"
import { useTranslation } from "react-i18next"
import { cloneDeep } from "lodash"

import { BaseIcon } from "components/Common"
import BaseTable from "components/Common/BaseTable"
import InputChange from "./InputChange"

import { formatSize, formatMailDateTime } from "utils"
import { MailContext } from "pages/Detail"
import { Headers, emailPost } from "helpers/email_api_helper"
import { URL_POST_CLOUD } from "modules/mail/common/urls"
import { useCustomToast } from "hooks/useCustomToast"
import moment from "moment"

const CloudAttachment = ({ mail }) => {
  const userConfig = useSelector((state) => state.Config.userConfig)
  const dateFormat = (userConfig?.date_format?.toUpperCase() || "Y/M/D") + " " + "HH:mm"
  const { t } = useTranslation()
  const { setMail } = useContext(MailContext)
  const { successToast, errorToast } = useCustomToast()

  const postData = async (params) => {
    return await emailPost(URL_POST_CLOUD, params, Headers)
  }

  const onCallback = (type, data) => {
    let cloneMail = cloneDeep(mail)
    cloneMail?.cloudlist?.map((file) => {
      if (file.cid == data.cid && file.ckey == data.ckey) {
        if (type === "date") {
          file.expire = formatMailDateTime(data.expire, dateFormat)
        } else {
          file.maxCount = data.maxcount
        }
      }
    })

    setMail(cloneMail)
    successToast()
  }

  // Config header for table
  const heads = [
    {
      content: t("common.upload_file_name"),
      class: "w-auto",
    },
    {
      content: t("mail.mail_file_validity"),
      class: "w-auto text-end",
    },
    {
      content: t("mail.mail_clouddisk_max_count"),
      class: "w-auto text-end",
    },
    {
      content: t("mail.mail_number_of_downloads"),
      class: "w-auto text-end",
    },
    {
      content: t("common.common_delete"),
      class: "w-auto text-end",
    },
  ]

  const rows = useMemo(() => {
    let array = []
    if (mail?.cloudlist?.length > 0) {
      array = mail.cloudlist.map((item, index) => ({
        columns: [
          {
            content: (
              <>
                {item.name}{" "}
                <span className="han-h6 han-text-secondary">{formatSize(item.size)}</span>
              </>
            ),
            className: "w-auto han-h5 han-text-primary",
          },
          {
            content: (
              <InputChange
                type={"date"}
                file={item}
                dateFormat={dateFormat}
                onCallback={onCallback}
                postData={postData}
                errorToast={errorToast}
              />
            ),
            className: "w-auto text-end",
          },
          {
            content: <>{item.curCount}</>,
            className: "w-auto text-end",
          },
          {
            content: (
              <InputChange
                type={"maxCount"}
                file={item}
                dateFormat={dateFormat}
                onCallback={onCallback}
                postData={postData}
                errorToast={errorToast}
              />
            ),
            className: "w-auto text-end",
          },
          {
            content: (
              <>
                <BaseIcon
                  className={`color-red`}
                  icon={"mdi mdi-trash-can-outline font-size-18 "}
                  onClick={() => {
                    const params = {
                      cid: item.cid,
                      ckey: item.cid,
                      expire: moment().add(-1, "days").format(dateFormat),
                      maxcount: 0,
                    }
                    postData(params).then((res) => {
                      if (res.success) {
                        successToast()
                      } else {
                        errorToast()
                      }
                    })
                  }}
                />
              </>
            ),
            className: "w-auto text-end",
          },
        ],
      }))
    }
    return array
  }, [mail?.cloudlist, dateFormat])

  return (
    <div className="position-relative mt-2 mb-3">
      <h4 className="han-h4 han-fw-semibold han-text-primary d-flex align-items-center cursor-pointer">
        {t("mail.mail_view_file")}
      </h4>
      <div className="w-100 d-flex flex-column gap-2">
        <BaseTable heads={heads ?? []} rows={rows ?? []} tableClass={`m-0`} />
      </div>
    </div>
  )
}
export default CloudAttachment
