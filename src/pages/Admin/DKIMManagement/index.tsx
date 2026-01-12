// @ts-nocheck
// React
import React, { useState, useEffect, useMemo } from "react"
import { useTranslation } from "react-i18next"

// Third-party
import { Card } from "reactstrap"

// Project
import { Title } from "components/SettingAdmin"
import Tooltip from "components/SettingAdmin/Tooltip/index"
import BaseButton from "components/Common/BaseButton"
import BaseTable from "components/Common/BaseTable"
import Pagination from "components/Common/Pagination"
import { Headers, emailDelete, emailGet, emailPost } from "helpers/email_api_helper"
import AddForm from "./AddForm"
import { useCustomToast } from "hooks/useCustomToast"
import Loading from "components/Common/Loading"
import DetailDKIM from "./DetailDKIM"
import { ModalConfirm } from "components/Common/Modal"
import { DKIM_MANAGEMENT } from "modules/mail/admin/url"

import "./style.css"
import { NoData } from "components/Common"
import PaginationV2 from "components/Common/Pagination/PaginationV2"
import MainHeader from "pages/SettingMain/MainHeader"
import Toolbar from "../../SettingMain/Toolbar"
import Footer from "../../SettingMain/Footer"

const DKIMManagement = (props) => {
  const { routeConfig } = props
  const { t } = useTranslation()
  const { successToast, errorToast } = useCustomToast()

  const [data, setData] = useState()
  const [item, setItem] = useState({})
  const [isOpenForm, setIsOpenForm] = useState(false)
  const [isDelete, setIsDelete] = useState(false)
  const [togModal, setTogModal] = useState(false)

  function tog_toggleModal() {
    setTogModal(!togModal)
  }

  const [modal, setModal] = useState(false)
  const toggle = () => setModal(!modal)

  // State Loading
  const [isLoading, setIsLoading] = useState(false)
  const [refetch, setRefetch] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const res = await emailGet(`${DKIM_MANAGEMENT}/list`)
        setData(res)

        setIsLoading(false)
      } catch (err) {
        // errorToast()
        console.log("error messenger", err)
      }
    }

    if (refetch) {
      fetchData()
      setRefetch(false)
    }
  }, [refetch])

  function Activation(activation) {
    return (
      <div className={`${activation ? "ad-dkim-acti" : "ad-dkim-unacti"}`}>
        {activation ? t("mail.mail_dkim_activation") : t("mail.mail_dkim_not_activation")}
      </div>
    )
  }

  function Status(isDefault) {
    return (
      <div className="d-flex justify-content-center">
        {isDefault && <div className="ad-dkim-sta"></div>}
      </div>
    )
  }

  function ListButton(selector, domain) {
    return (
      <>
        <div className="d-flex justify-content-center gap-2">
          <BaseButton
            className={"ad-dkim-btn-def"}
            onClick={() => {
              toggle()
              setItem({ selector: selector, domain: domain })
            }}
          >
            {t("mail.mail_dkim_set_as_default")}
          </BaseButton>
          <BaseButton
            type="button"
            color={"primary"}
            onClick={() => {
              tog_toggleModal()
              setItem({ selector: selector, domain: domain })
            }}
          >
            {/*{t("mail.mail_search_detail_btn")}*/}
            <i className="mdi mdi-eye"></i>
          </BaseButton>
          <BaseButton
            color={"danger"}
            onClick={() => {
              setIsDelete(!isDelete)
              setItem({ selector: selector, domain: domain })
            }}
          >
            {/*{t("mail.mailadmin_delete")}*/}
            <i className="mdi mdi-trash-can"></i>
          </BaseButton>
        </div>
      </>
    )
  }

  const heads = [
    {
      content: t("mail.mail_admin_receive_domain"),
    },
    {
      content: t("mail.mail_dkim_activation"),
    },
    {
      content: t("mail.mail_dkim_date"),
    },
    {
      content: t("mail.mail_dkim_selector"),
    },
    {
      content: t("mail.mail_dkim_default"),
    },
    {
      content: t(""),
    },
  ]

  const rows = useMemo(() => {
    if (data) {
      const rowsDkim = Object.keys(data?.items).reduce((acc, domain) => {
        const accRows = data?.items[domain].data.map((dat, i) => {
          const row = {
            class: "align-middle",
            columns: [
              {
                rowSpan: data?.items[domain].tot,
                content: domain,
                className: "align-middle",
              },
              {
                content: Activation(data?.items[domain].activation),
                rowSpan: data?.items[domain].tot,
                className: "align-middle",
              },
              { content: dat?.date },
              { content: dat?.selector },
              { content: Status(dat?.isdefault) },
              { content: ListButton(dat?.selector, domain) },
            ],
          }
          if (data.items[domain].tot > 1 && i > 0) {
            row.columns = row.columns.filter((col, index) => index > 1)
          }
          return row
        })
        return [...acc, ...accRows]
      }, [])
      return rowsDkim
    }
    return []
  }, [data])

  const onChangePage = (page) => {}
  // Update DKIM
  const handleUpdate = async (selector, domain, isdefault) => {
    try {
      const params = {
        selector: selector,
        domain: domain,
      }
      if (isdefault !== undefined) {
        params.isdefault = isdefault
      }
      const res = await emailPost(DKIM_MANAGEMENT, params, Headers)
      successToast()
      setRefetch(true)
      setIsOpenForm(false)
      setModal(false)
      setItem({})
    } catch (err) {
      errorToast()
      console.log("error messenger", err)
    }
  }
  // Delete DKIM
  const handleDelete = async (selector, domain) => {
    try {
      const params = {
        selector: selector,
        domain: domain,
      }
      const res = await emailDelete(DKIM_MANAGEMENT, params, Headers)
      successToast()
      setRefetch(true)
      setIsDelete(false)
      setItem({})
    } catch (err) {
      errorToast()
      console.log("error messenger", err)
    }
  }

  return (
    <>
      <MainHeader currentTitleMenu={routeConfig?.keyTitle} />
      <Tooltip
        content={<span dangerouslySetInnerHTML={{ __html: t("mail.mail_dkim_tooltip") }}></span>}
      />
      <Toolbar
        start={<></>}
        end={
          <>
            <BaseButton
              color={"primary"}
              className={`btn-primary`}
              icon={"mdi mdi-plus font-size-18"}
              iconClassName={`m-0`}
              onClick={() => {
                setIsOpenForm(!isOpenForm)
              }}
              style={{ width: "38px", height: "38px" }}
            />
            <BaseButton
              outline
              color="grey"
              className={"btn-outline-grey btn-action"}
              icon={"mdi mdi-refresh font-size-18"}
              iconClassName={`m-0`}
              loading={isLoading}
              onClick={() => setRefetch(true)}
              style={{ width: "38px", height: "38px" }}
            />
          </>
        }
      />

      <div className={`w-100 h-100 overflow-hidden`}>
        <div className="w-100 h-100 overflow-auto">
          <BaseTable heads={heads} rows={rows} />
          {data?.selectortotal === 0 && <NoData />}
          {isLoading && <Loading />}
        </div>
      </div>

      <Footer
        footerContent={
          data &&
          data?.selectortotal > 0 && (
            <PaginationV2
              pageCount={data?.selectortotal}
              pageSize={20}
              pageIndex={1}
              onChangePage={onChangePage}
              hideBorderTop={true}
              hideRowPerPage={true}
            />
          )
        }
      />

      {/* View Detail */}
      {togModal && (
        <DetailDKIM
          isOpen={togModal}
          toggleForm={() => {
            tog_toggleModal()
          }}
          detailItem={item}
        />
      )}
      {/* Add DKIM Manager */}
      {isOpenForm && (
        <AddForm
          isOpen={isOpenForm}
          toggleForm={() => {
            setIsOpenForm(!isOpenForm)
          }}
          handleUpdate={handleUpdate}
        />
      )}
      {/* Confirm set Default */}
      {modal && (
        <ModalConfirm
          isOpen={modal}
          toggle={() => {
            toggle()
          }}
          keyHeader={t("common.common_confirm")}
          keyBody={t("mail.mail_dkim_confirm_set_as_default")}
          onClick={() => {
            handleUpdate(item?.selector, item?.domain, "y")
          }}
        />
      )}
      {/* Confirm Delete */}
      {isDelete && (
        <ModalConfirm
          isOpen={isDelete}
          toggle={() => {
            setIsDelete(!isDelete)
          }}
          onClick={() => {
            handleDelete(item?.selector, item?.domain)
          }}
        />
      )}
    </>
  )
}

export default DKIMManagement
