// @ts-nocheck
import React, { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import Tooltip from "components/SettingAdmin/Tooltip"
import { BaseButton, BaseIcon, NoData, Loading } from "components/Common"
import BaseTable from "components/Common/BaseTable/index"
import SearchInput from "components/SettingAdmin/SearchInput"
import { useCustomToast } from "hooks/useCustomToast"
import { emailGet } from "helpers/email_api_helper"
import { SMTP_POP3_IMAP_IP_BLOCK_LIST, SMTP_POP3_IMAP_IP_UNBLOCK } from "modules/mail/admin/url"
import { selectUserConfig } from "store/auth/config/selectors"
import { renderLanguage } from "utils"

import ModalConfirm from "./ModalConfirm"

const IP = (props) => {
  const { countryCode } = props
  const { t } = useTranslation()
  const userConfig = useSelector(selectUserConfig)
  const { successToast, errorToast } = useCustomToast()

  const [isLoading, setIsLoading] = useState(false)
  const [refetch, setRefetch] = useState(false)
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [keyword, setKeyword] = useState("")
  const [data, setData] = useState({})
  const [selectedData, setSelectedData] = useState({})

  useEffect(() => {
    setKeyword(userConfig?.ip_address)
    setRefetch(true)
  }, [userConfig?.ip_address])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const res = await emailGet([SMTP_POP3_IMAP_IP_BLOCK_LIST, keyword].join("/"))
        setData(res)
        setIsLoading(false)
      } catch (err) {
        console.log("error messenger", err)
      }
    }

    if (refetch) {
      fetchData()
      setRefetch(false)
    }
  }, [refetch])

  const saveUnlock = async () => {
    const res = await emailGet(
      [SMTP_POP3_IMAP_IP_UNBLOCK, selectedData?.remoteip, selectedData?.blocktype].join("/"),
    )

    if (res?.success) {
      successToast()
      setRefetch(true)
    } else {
      errorToast()
    }
  }

  // Search when enter
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      setRefetch(true)
    }
  }

  const openModalAction = (item) => {
    setSelectedData(item)
    setIsOpenModal(true)
  }

  const heads = useMemo(() => {
    return [
      { content: t("mail.mail_block_date_and_time") },
      { content: t("mail.mail_cspam_ip_address") },
      { content: t("mail.mail_country") },
      { content: t("mail.asset_status") },
      { content: t("mail.unblock") },
    ]
  }, [])

  const rows = useMemo(() => {
    if (data?.blocklist) {
      const rowsData = Object.values(data?.blocklist).map((item) => ({
        class: "align-middle",
        columns: [
          { content: <div>{item?.createat}</div> },
          { content: <div>{item?.remoteip}</div> },
          { content: <div>{countryCode[item?.countrycode] ?? item?.countrycode}</div> },
          { content: <span className="han-badge-error">{t("mail.mail_ip_blocking")}</span> },
          {
            content: (
              <BaseButton
                className={"float-start"}
                color={"primary"}
                type="button"
                onClick={() => openModalAction(item)}
              >
                {t("mail.holiday_req_file_okbtn")}
              </BaseButton>
            ),
          },
        ],
      }))
      return rowsData
    }
    return []
  }, [data])

  return (
    <>
      <div className="message-navbar">
        <SearchInput
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <BaseButton
          outline
          color={`grey`}
          className={`btn-outline-grey btn-action m-0`}
          icon={`mdi mdi-refresh font-size-18`}
          iconClassName={`m-0`}
          onClick={() => setRefetch(true)}
          loading={isLoading}
          style={{ width: "38px", height: "38px" }}
        />
      </div>
      <div className="mt-2 table-list position-relative">
        <div className="w-100 overflow-x-auto">
          <BaseTable heads={heads} rows={rows} />
        </div>
        {data?.blocklist?.length == 0 && <NoData />}
        {isLoading && <Loading />}
      </div>

      <Tooltip
        content={
          <div>
            <span
              className={"fw-bold"}
              dangerouslySetInnerHTML={{
                __html: renderLanguage("mail.mail_admin_pop3_imap_ip_msg", { xxx: data?.your_ip }),
              }}
            />
          </div>
        }
      />

      {isOpenModal && (
        <ModalConfirm
          isOpen={isOpenModal}
          toggleModal={() => setIsOpenModal(false)}
          selectedData={selectedData}
          countryCode={countryCode}
          saveUnlock={saveUnlock}
        />
      )}
    </>
  )
}

export default IP
