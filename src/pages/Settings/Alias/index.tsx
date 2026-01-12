// @ts-nocheck
// React
import React, { useEffect, useRef, useState } from "react"

// Third-party
import { Card } from "reactstrap"
import { useTranslation } from "react-i18next"

// Project
import { Title } from "components/SettingAdmin"
import BaseTable from "components/Common/BaseTable"
import Pagination from "components/Common/Pagination"
import { useCustomToast } from "hooks/useCustomToast"
import { Headers, emailPost, formDataUrlencoded } from "helpers/email_api_helper"
import { NoData } from "components/Common"
import Loading from "components/Common/Loading"
import SearchInput from "components/SettingAdmin/SearchInput"
import BaseButtonTooltip from "components/Common/BaseButtonTooltip"
import { DELAY_TIME, PAGE_SIZE } from "constants/setting"
import { URL_ALIAS } from "modules/mail/settings/urls"
import PaginationV2 from "components/Common/Pagination/PaginationV2"
import MainHeader from "pages/SettingMain/MainHeader"
import Toolbar from "../../SettingMain/Toolbar"
import Footer from "../../SettingMain/Footer"

const Alias = (props) => {
  const { routeConfig } = props
  const { t } = useTranslation()
  const { errorToast } = useCustomToast()

  const [data, setData] = useState({ loading: false, list: [], total: 0 })
  const [showMoreData, setShowMoreData] = useState([])
  const [attr, setAttr] = useState({
    total: 0,
    limit: PAGE_SIZE,
    page: 1,
  })
  const [search, setSearch] = useState("")

  const getAliasData = async (page = 1, limit = PAGE_SIZE, search = "") => {
    setData({ ...data, loading: true })
    try {
      const params = { page: search ? 1 : page, limit: limit, keyword: search }
      const res = await emailPost(URL_ALIAS, formDataUrlencoded(params), Headers)
      if (res.success) {
        setData({
          loading: false,
          list: res.rows.email_list,
          total: res.page.total_num,
        })
        setAttr({ ...attr, total: res.page.total_num })
      }
    } catch (err) {
      errorToast()
      setData({ ...data, loading: false })
    }
  }

  useEffect(() => {
    getAliasData(attr.page, attr.limit, search)
  }, [attr.page, search])

  const timeoutId = useRef(null)
  // Handle search key
  const handleSearch = (event) => {
    // Clear timeout if existed
    timeoutId.current && clearTimeout(timeoutId.current)

    if (event.key === "Enter") {
      //  Search with Key down => Enter
      setSearch(event.target.value)
      setAttr((prev) => ({ ...prev, page: 1 }))
    }
    // else {
    //   // Set timeout to search if not search with key "Enter"
    //   timeoutId.current = setTimeout(() => {
    //     setSearch(event.target.value)
    //   }, DELAY_TIME)
    // }
  }

  // Handle pagination
  const handleChangePage = (page) => setAttr({ ...attr, page: page })

  // Handle show more data
  const handleShowMore = (index) => {
    const newData = [...showMoreData]
    newData[index] = !newData[index]
    setShowMoreData(newData)
  }

  // Config header for table
  const heads = [
    { content: t("mail.mailadmin_aliasaccount") },
    { content: t("mail.mail_alias_popaccount") },
  ]

  // Config data row for table
  const rows =
    data.total > 0
      ? data.list.map((item, index) => ({
          columns: [
            { content: [item?.alias_email, ["(", item?.alias_name, ")"].join("")].join(" ") },
            {
              content: (
                <div>
                  {item?.real_email.map((email, idx) => (
                    <p
                      key={idx}
                      style={{ display: showMoreData[index] || idx < 3 ? "block" : "none" }}
                    >
                      {email}
                    </p>
                  ))}
                  {item?.real_email.length > 3 && (
                    <a
                      className="write-form text-primary"
                      type="button"
                      onClick={() => handleShowMore(index)}
                    >
                      {showMoreData[index]
                        ? t("common.approval_group_hide")
                        : t("common.common_see_more")}
                    </a>
                  )}
                </div>
              ),
            },
          ],
        }))
      : [{ columns: [{ content: <NoData />, colSpan: 2 }] }]

  return (
    <>
      <MainHeader currentTitleMenu={t(routeConfig?.keyTitle)} />
      <Toolbar
        start={<SearchInput onKeyDown={handleSearch} />}
        end={
          <BaseButtonTooltip
            title={t("common.org_refresh")}
            id="refresh-alias"
            color="grey"
            className="btn-action"
            icon="mdi mdi-refresh"
            iconClassName="me-0"
            onClick={() => getAliasData(attr.page, attr.limit, search)}
            loading={data.loading}
            style={{ width: "38px", height: "38px" }}
          />
        }
      />
      <div className={`w-100 h-100 overflow-hidden`}>
        <div className={`w-100 h-100 overflow-auto`}>
          {(!data.loading || data.list) && (
            <BaseTable heads={heads} rows={rows} tableClass={`m-0`} />
          )}
          {data.loading && (
            <div className="position-fixed top-0 start-0 vh-100 vw-100 z-1">
              <Loading />
            </div>
          )}
        </div>
      </div>

      <Footer
        footerContent={
          attr.total > 0 && (
            <PaginationV2
              pageCount={attr.total}
              pageSize={attr.limit}
              pageIndex={attr.page}
              onChangePage={handleChangePage}
              hideBorderTop={true}
              hideRowPerPage={true}
            />
          )
        }
      />
    </>
  )
}

export default Alias
