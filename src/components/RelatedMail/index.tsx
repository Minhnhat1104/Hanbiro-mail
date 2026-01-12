// @ts-nocheck
// React
import React, { useContext, useState } from "react"

// Third-party
import { useTranslation } from "react-i18next"
import { useNavigate, useParams } from "react-router-dom"

// Project
import Loading from "components/Common/Loading"
import { MailContext } from "pages/Detail"
import { Table } from "reactstrap"
import "./styles.scss"
import PaginationV2 from "components/Common/Pagination/PaginationV2"

const RelatedMail = ({ data = {}, isHideSizeColumn = false }) => {
  const { t } = useTranslation()
  const { mid, getRelatedMail } = useContext(MailContext)
  const navigate = useNavigate()
  const { menu } = useParams()

  const isReceiveMenu = menu === "Receive"
  const isSentMenu = menu === "Sent"
  const isDraftMenu = menu === "Temp"

  const fromTitle =
    isReceiveMenu || isSentMenu || isDraftMenu
      ? t("mail.mail_list_sort_toemail")
      : t("mail.mail_list_sort_fromemail")

  const [showTable, setShowTable] = useState(true)
  const [attr, setAttr] = useState({
    limit: 10,
    page: 1,
  })

  const handleChangePage = (page) => {
    setAttr({ ...attr, page: page })
    getRelatedMail(page, attr.limit)
  }

  const handleChangePageSize = (type, pageSize) => {
    setAttr((prev) => ({ ...prev, limit: pageSize }))
    getRelatedMail(attr.page, pageSize)
  }

  // Config header for table
  const heads = [
    {
      content: "",
      width: "3%",
    },
    {
      content: fromTitle,
      width: "30%",
    },
    {
      content: t("common.mail_list_sort_subject"),
      width: "40%",
    },
    ...(isHideSizeColumn
      ? []
      : [
          {
            content: t("mail.mail_list_sort_size"),
            width: "7%",
          },
          {
            content: <i className="fa fa-paperclip"></i>,
            width: "5%",
          },
        ]),
    {
      content: t("mail.mail_list_sort_date"),
      width: "15%",
    },
  ]

  // Config data row for table
  const rows =
    data.total > 0 &&
    data.list?.map((item) => ({
      columns: [
        {
          content:
            item.sigmsg === 1 ? (
              // Unread
              <i className="mdi mdi-email-outline"></i>
            ) : (
              // Read
              <i className="mdi mdi-email-open-outline"></i>
            ),
        },
        {
          content: (
            <span
              className=""
              dangerouslySetInnerHTML={{
                __html: item.from ?? "",
              }}
            />
          ),
        },
        {
          content: item.subject ? (
            <span className="han-text-primary text-truncate">
              <span className="han-fw-semibold han-color-primary">
                {item.boxname ? `[${item.boxname}] ` : ""}
              </span>
              <span
                dangerouslySetInnerHTML={{
                  __html: item.subject ?? "",
                }}
                onClick={() =>
                  mid === item?.mid
                    ? null
                    : navigate(["/mail/list", item?.acl, item?.mid].join("/"))
                }
                className={`han-fw-regular ${
                  mid === item?.mid ? "cursor-not-allowed" : "cursor-pointer"
                }`}
              />
            </span>
          ) : (
            ""
          ),
        },
        ...(isHideSizeColumn
          ? []
          : [
              {
                content: item.size ?? "",
              },
              {
                content: item.isfile ? <i className="fa fa-paperclip"></i> : "",
              },
            ]),
        {
          content: item.date ?? "",
        },
      ],
    }))

  return (
    <div className="position-relative mt-2 mb-3">
      <h4
        className="han-h4 han-fw-semibold han-text-primary d-flex align-items-center cursor-pointer"
        onClick={() => setShowTable(!showTable)}
      >
        {t("mail.mail_related_emails")}
        {` (${data?.total})`}
        <i
          className={`${showTable ? "mdi mdi-chevron-down" : "mdi mdi-chevron-right"} font-size-16`}
        />
      </h4>
      {showTable && (
        <div className="w-100 d-flex flex-column gap-2">
          <div className="w-100 overflow-x-auto overflow-y-hidden">
            <Table striped hover className={`related-mail mb-0`}>
              <thead>
                <tr>
                  {heads.length > 0 &&
                    heads.map((thead, index) => {
                      return (
                        <th
                          key={index}
                          className={thead.class}
                          style={{
                            minWidth: index === 2 ? (isHideSizeColumn ? "300px" : "400px") : "auto",
                          }}
                        >
                          {thead.content}
                        </th>
                      )
                    })}
                </tr>
              </thead>

              <tbody>
                {rows &&
                  rows.length > 0 &&
                  rows.map((row, i) => {
                    return (
                      <tr className={row.class} key={i}>
                        {row.columns.map((td, j) => {
                          return (
                            <td
                              // style={{ maxWidth: j !== 0 ? 0 : '100%' }}
                              style={{ maxWidth: j === 2 ? 0 : "100%" }}
                              rowSpan={td?.rowSpan ?? 1}
                              className={j === 2 ? "text-truncate" : "text-nowrap"}
                              key={j}
                            >
                              {td.content}
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
              </tbody>
            </Table>
          </div>
          <PaginationV2
            pageIndex={attr.page}
            pageSize={attr.limit}
            pageCount={data?.total}
            onChangePage={handleChangePage}
            setPageSize={handleChangePageSize}
          />
        </div>
      )}

      {data.loading && (
        <div className="position-absolute top-50 start-50 translate-middle">
          <Loading />
        </div>
      )}
    </div>
  )
}

export default RelatedMail
