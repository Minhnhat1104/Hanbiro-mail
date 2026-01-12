// @ts-nocheck
import React, { useEffect, useMemo, useState } from "react"

import { Card } from "reactstrap"

import { Title } from "components/SettingAdmin"
import { useTranslation } from "react-i18next"
import BaseTable from "components/Common/BaseTable"
import BaseButton from "components/Common/BaseButton"
import BaseIcon from "components/Common/BaseIcon"
import SearchInput from "components/SettingAdmin/SearchInput"
import { BLOCKED_IP } from "modules/mail/admin/url"
import { NoData, Pagination } from "components/Common"
import Loading from "components/Common/Loading"
import { emailGet } from "helpers/email_api_helper"
import PaginationV2 from "components/Common/Pagination/PaginationV2"
import MainHeader from "pages/SettingMain/MainHeader"

import "../BlockedAccount/style.scss"
import Toolbar from "../../SettingMain/Toolbar"
import Footer from "../../SettingMain/Footer"

const BlockedIPAddress = ({ routeConfig }) => {
  const { t } = useTranslation()

  const [data, setData] = useState()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const res = await emailGet(BLOCKED_IP)
        setData(res)
        setIsLoading(false)
      } catch (err) {
        console.log("error messenger", err)
      }
    }
    fetchData()
  }, [])

  const onChangePage = (page) => {
  }

  const heads = [
    { content: <input type="checkbox" /> },
    { content: t("common.ip") },
    { content: t("mail.country") },
    { content: t("mail.mail_web_block") },
    { content: t("common.logs") },
  ]

  const rows = useMemo(() => {
    if (data?.rows) {
      const rowsData = data?.rows.map((item) => ({
        columns: [
          { content: <input type="checkbox" /> },
          { content: item?.ip },
          { content: `${item?.contry_name} / ${item?.contry_code}` },
          {
            content: `${item?.ipblock ? t("mail.mail_blocked") : ""}${
              item?.webblock ? t("mail.web_blocked") : ""
            }`,
          },
          {
            content: (
              <div>
                <BaseIcon icon="mdi mdi-briefcase" />
              </div>
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
      <MainHeader currentTitleMenu={routeConfig?.keyTitle} />
      <Toolbar
        start={<SearchInput />}
        end={
          <>
            <BaseButton
              color={`success`}
              className={"btn-success"}
              icon={`mdi mdi-lock-open-outline font-size-18`}
              iconClassName={`m-0`}
              style={{ width: "38px", height: "38px" }}
            />
            <BaseButton
              outline
              color={`grey`}
              className={"btn-outline-grey btn-action"}
              icon={`mdi mdi-refresh font-size-18`}
              iconClassName={`m-0`}
              style={{ width: "38px", height: "38px" }}
            />
          </>
        }
      />
      <div className={`w-100 h-100 overflow-hidden`}>
        <div className={`w-100 h-100 overflow-auto`}>
          <BaseTable heads={heads} rows={rows} />
          {isLoading ? (
            <div className="position-relative">
              <Loading />
            </div>
          ) : (
            data?.tot === 0 && <NoData />
          )}
        </div>
      </div>
      <Footer footerContent={data && data?.tot > 0 && (
        <PaginationV2
          pageCount={data?.tot}
          pageSize={20}
          pageIndex={1}
          onChangePage={onChangePage}
          hideBorderTop={true}
          hideRowPerPage={true}
        />
      )} />
    </>
  )
}

export default BlockedIPAddress
