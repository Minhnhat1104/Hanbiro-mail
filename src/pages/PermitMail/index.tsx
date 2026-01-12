// @ts-nocheck
import React, { useEffect, useMemo, useState } from "react"
import { Card } from "reactstrap"
import PermitMailToolbar from "./PermitMailToolbar"
import PermitMailList from "./PermitMailList"
import "./styles.scss"
import { useCustomToast } from "hooks/useCustomToast"
import { getPermitMailList, putPermitMail } from "modules/mail/list/api"
import { Pagination } from "components/Common"
import { useLocation, useParams, useSearchParams } from "react-router-dom"
import { selectUserData, selectUserMailSetting } from "store/auth/config/selectors"
import { useDispatch, useSelector } from "react-redux"
import { isEmpty, isEqual } from "lodash"
import PermitMailModal from "./PermitMailModal"
import ApproverInfoModal from "./ApproverInfoModal"
import PriorApprovalModal from "./PriorApprovalModal"
import queryString from "query-string"
import PaginationV2 from "components/Common/Pagination/PaginationV2"
import useDevice from "hooks/useDevice"
import { setPermitQueryParams } from "store/mailList/actions"
import { saveMailPersonalSetting } from "store/actions"
import { setRefreshList } from "store/viewMode/actions"

const initInfo = {
  new: 0,
  isSelectAll: false,
  isUnreadAll: true,
}

function PermitMail(props) {
  const { menu } = useParams()
  const dispatch = useDispatch()

  const { isMobile } = useDevice()

  const userData = useSelector(selectUserData)
  const userMailSetting = useSelector(selectUserMailSetting)
  const query = useSelector((state) => state.QueryParams.permitQuery)
  const viewMode = useSelector((state) => state.viewMode)

  const initAttr = {
    page: 1,
    limit: userMailSetting?.items_per_page || 20,
  }

  const getAttrFromQuery = (query) => {
    if (query && query.linenum && query.page) {
      return {
        page: query.page,
        limit: query.linenum,
      }
    } else {
      return initAttr
    }
  }

  const { successToast, errorToast } = useCustomToast()
  const [loading, setLoading] = useState(false)
  const [loadingPermit, setLoadingPermit] = useState(false)
  const [mailList, setMailList] = useState([])
  const [isMiddle, setIsMiddle] = useState(false)
  const [attr, setAttr] = useState(() => getAttrFromQuery(query))
  const [mailSelected, setMailSelected] = useState([])
  console.log(" mailSelected:", mailSelected)
  const [info, setInfo] = useState(initInfo)
  const [isPredecessor, setIsPredecessor] = useState(false)
  const [dataPermitModal, setDataPermitModal] = useState({
    type: "",
    open: false,
  })
  const [openApproverInfoModal, setOpenApproverInfoModal] = useState(false)
  const [openPriorApproval, setOpenPriorApproval] = useState(false)

  useEffect(() => {
    if (!isEmpty(query)) {
      getList()
    }
  }, [query])

  useEffect(() => {
    if ((userMailSetting?.items_per_page || 20) != attr.limit) {
      onLineNumChange(userMailSetting?.items_per_page)
    }
  }, [userMailSetting?.items_per_page])

  useEffect(() => {
    if (viewMode.isRefreshList) {
      onRefresh()
      dispatch(setRefreshList(false))
    }
  }, [viewMode.isRefreshList])

  // handlers
  const getSearchParamsFromQuery = (query) => {
    const nQuery = { ...query }
    delete nQuery["page"]
    delete nQuery["linenum"]
    delete nQuery["sortkey"]
    delete nQuery["sorttype"]
    return nQuery
  }

  const getList = () => {
    setLoading(true)
    const searchParams = getSearchParamsFromQuery(query)

    const params = {
      page: query?.page ?? attr.page,
      linenum: query?.linenum ?? attr.limit,
      sortkey: query?.sortkey ?? "timestamp",
      sorttype: query?.sorttype ?? "desc",
    }

    getPermitMailList(params, searchParams)
      .then((res) => {
        if (res.success) {
          setMailList(res.rows)
          setIsMiddle(res.ismiddle)
          setAttr((prev) => ({
            ...prev,
            total: res.total,
          }))
        }
      })
      .catch((err) => {
        errorToast(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handleSelectMail = (uuid) => {
    let uMailSlected = [...mailSelected]
    if (uMailSlected.length === 0) {
      uMailSlected.push(uuid)
    } else {
      if (!uMailSlected.includes(uuid)) {
        uMailSlected.push(uuid)
      } else {
        uMailSlected = uMailSlected.filter((item) => item !== uuid)
      }
    }
    setMailSelected(uMailSlected)

    let countUnread = 0
    mailList?.map((mail) => {
      if (uMailSlected.indexOf(mail.uuid) != -1 && !mail.isnuew) {
        countUnread++
      }
    })
    setInfo({
      ...info,
      isUnreadAll: countUnread == uMailSlected.length ? true : false,
    })
  }

  const onMultipleSelect = (type) => {
    let newSelectedMails = []
    let isSelectAll = false
    if (!type) {
      type = "all"
    }
    console.log(" type:", type)

    if (type != "none") {
      mailList.map((mail) => {
        if (type == "all") newSelectedMails.push(mail.uuid)
        if (type == "read" && !mail.isnuew) {
          newSelectedMails.push(mail.uuid)
        }
        if (type == "unread" && mail.isnuew) {
          newSelectedMails.push(mail.uuid)
        }
      })
    }

    const remainUuids = mailList.filter((mail) => !newSelectedMails.includes(mail.uuid))

    setMailSelected((prev) => {
      const nUuids = new Set(prev)
      newSelectedMails.forEach((uuid) => {
        nUuids.add(uuid)
      })
      remainUuids.forEach((mail) => {
        nUuids.delete(mail.uuid)
      })
      return Array.from(nUuids)
    })

    if (newSelectedMails.length === mailList.length) {
      isSelectAll = true
    }
    setInfo({
      ...info,
      isSelectAll: isSelectAll,
    })
  }

  const onRefresh = () => {
    getList()
  }

  const handlePermitMail = (type) => {
    if (mailList.length === 0) return
    const isPre = mailList
      .filter((mail) => mailSelected.includes(mail.uuid))
      .every((_item) => _item.mforce)
    setIsPredecessor(isPre)

    setDataPermitModal({
      type: type,
      open: true,
    })
  }

  const onPermitMail = (mode, mforce, reason) => {
    if (mailSelected.length === 0) return
    const uuids = mailSelected.length === 1 ? mailSelected[0] : mailSelected.join(",")
    setLoadingPermit(true)
    if (mode === "allow") {
      putPermitMail({ mode, uuids, mforce })
        .then((res) => {
          if (res.success) {
            successToast()
          } else {
            errorToast(res.msg)
          }
        })
        .catch((err) => {
          errorToast(err)
        })
        .finally(() => {
          setLoadingPermit(false)
          setDataPermitModal((prev) => ({
            ...prev,
            open: false,
          }))
          onRefresh()
        })
    } else {
      putPermitMail({ mode, uuids, mforce }, { reason })
        .then((res) => {
          if (res.success) {
            successToast()
          } else {
            errorToast(res.msg)
          }
        })
        .catch((err) => {
          errorToast(err)
        })
        .finally(() => {
          setLoadingPermit(false)
          setDataPermitModal((prev) => ({
            ...prev,
            open: false,
          }))
          onRefresh()
        })
    }
  }

  const onChangePage = (page) => {
    if (!isEqual(page, attr.page)) {
      setAttr((prev) => ({
        ...prev,
        page: page,
      }))
      dispatch(setPermitQueryParams({ ...query, page: page }))
    }
  }

  const onLineNumChange = (lineNum) => {
    setAttr((prev) => ({
      ...prev,
      limit: lineNum,
    }))
    dispatch(setPermitQueryParams({ ...query, linenum: lineNum }))
  }

  const onChangeSetting = (type, value) => {
    dispatch(
      saveMailPersonalSetting({
        type: type,
        value: value,
      }),
    )
  }

  return (
    <div className={`permit-mail d-flex flex-column gap-2`}>
      <PermitMailToolbar
        info={info}
        isMiddle={isMiddle}
        mailList={mailList}
        mailSelected={mailSelected}
        isDisabled={mailSelected.length === 0}
        onRefresh={onRefresh}
        onMultipleSelect={onMultipleSelect}
        handlePermitMail={handlePermitMail}
        setOpenApproverInfoModal={setOpenApproverInfoModal}
        setOpenPriorApproval={setOpenPriorApproval}
      />
      <PermitMailList
        list={mailList}
        loading={loading}
        onRefresh={onRefresh}
        mailSelected={mailSelected}
        handleSelectMail={handleSelectMail}
      />

      {mailList && mailList.length > 0 && (
        <PaginationV2
          pageCount={attr.total}
          pageSize={attr.limit}
          pageIndex={attr.page}
          onChangePage={onChangePage}
          setPageSize={onChangeSetting}
        />
      )}
      {dataPermitModal.open && mailSelected.length > 0 && (
        <PermitMailModal
          dataPermitModal={dataPermitModal}
          onPermitMail={onPermitMail}
          setToggle={setDataPermitModal}
          loadingPermit={loadingPermit}
          isPredecessor={isPredecessor}
        />
      )}
      {openApproverInfoModal && (
        <ApproverInfoModal
          approverId={userData.id}
          isOpen={openApproverInfoModal}
          toggle={setOpenApproverInfoModal}
        />
      )}
      {openPriorApproval && (
        <PriorApprovalModal isOpen={openPriorApproval} toggle={setOpenPriorApproval} />
      )}
    </div>
  )
}

export default PermitMail
