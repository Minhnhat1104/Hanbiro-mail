// @ts-nocheck
import ModalConfirm from "components/Common/Modal/ModalConfirm"
import withRouter from "components/Common/withRouter"
import { useCustomToast } from "hooks/useCustomToast"
import queryString from "query-string"
import { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { saveMailPersonalSetting } from "store/auth/config/actions"
import { selectUserMailSetting } from "store/auth/config/selectors"
import ListItem from "./ListItem"
import ModalMove from "./ModalMove"
import "./style.scss"

import PaginationV2 from "components/Common/Pagination/PaginationV2"
import { emailDelete, emailPost, Headers } from "helpers/email_api_helper"
import useDevice from "hooks/useDevice"
import { isArray, isEmpty, isEqual } from "lodash"
import { postEmailSpam, postMailToHtml5 } from "modules/mail/common/api"
import {
  getCancelSending,
  getListEmail,
  postAddContact,
  postAutoSortMailToFolder,
  postAutoSplit,
  postBLockAddress,
  postDeleteMail,
} from "modules/mail/list/api"
import moment from "moment"
import { useTranslation } from "react-i18next"
import { setSocketData, setSocketMenuData } from "store/actions"
import { openComposeMail } from "store/composeMail/actions"
import { composeDataDefaults } from "store/composeMail/reducer"
import { setQueryParams, triggerPrintModal } from "store/mailList/actions"
import { setRefreshList } from "store/viewMode/actions"
import { isReadSharedMail } from "utils"
import i18n from "../../i18n"
import AddContactModal from "./AddContactModal"
import AutoSortMailToFolderModal from "./AutoSortMailToFolderModal"
import BlockAddressModal from "./BlockAddressModal"
import EmailToolbar2 from "./EmailToolbar/EmailToolbar2"
import SplitItem from "./SplitItem"
import PrintListModal from "./PrintListModal"
import AIModal from "components/AIModal"
import SummaryModal from "components/AIModal/SummaryModal"
import TranslateModal from "components/AIModal/TranslateModal"
import useMenu from "utils/useMenu"
import { decodeHtmlEntities } from "./utils"

export const getStatusPermit = (state, t) => {
  if (!state) return

  let mailStatus = ""
  let statusColor = ""

  if (state === "n") {
    mailStatus = "common.common_pending_status"
    statusColor = "secondary"
  } else if (state === "u") {
    mailStatus = "mail.mail_secure_auto_allow"
    statusColor = "primary"
  } else if (state === "a") {
    mailStatus = "mail.mail_secure_allow"
    statusColor = "success"
  } else if (state === "d") {
    mailStatus = "common.main_docu_reject"
    statusColor = "danger"
  }

  return <span className={`list-approval-mail text-${statusColor}`}>{t(mailStatus)}</span>
}

const confirmTypeData = {
  delete: {
    header: "common.common_delete",
    body: "common.approval_config_warn_delete",
  },
  spam: {
    header: "mail.mail_spam_manager_reportspam",
    body: "mail.common_confirm_continue",
  },
  nospam: {
    header: "mail.mail_button_report_no_spam",
    body: "mail.common_confirm_continue",
  },
}
const initialData = {
  attr: {
    total: 0,
    limit: 20,
    page: 1,
  },
  info: {
    countNew: {
      new: 0,
      total: 0,
    },
    isImportantAll: false,
    isSelectAll: false,
    isUnreadAll: true,
    isBothAll: false,
  },
}

const Index = (props) => {
  const { router, menu, isSplitMode, isHidePageInfo = false } = props
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { successToast, errorToast } = useCustomToast()
  const { isMobile, isVerticalTablet } = useDevice()
  const { allMenus } = useMenu()

  // redux state
  const queryParams = useSelector((state) => state.QueryParams.query)
  const openPrintModal = useSelector((state) => state.QueryParams.openPrintModal)
  const newMailData = useSelector((state) => state.Socket.data)
  const userMailSetting = useSelector(selectUserMailSetting)
  const viewMode = useSelector((state) => state.viewMode)
  const composeMails = useSelector((state) => state.ComposeMail.composeMails)
  const composeDisplayMode = composeMails.localComposeMode
  const [currentPage, setCurrentPage] = useState(1)
  const isShare = menu?.indexOf("HBShare_") === 0 ? true : false
  const excludeMailbox = useSelector((state) => state.EmailConfig.excludeSearch.excludeMailbox)

  const initAttr = {
    // total: 0,
    limit: userMailSetting?.items_per_page || 20,
    page: 1,
  }
  const getAttrFromQuery = (query) => {
    if (query && query.viewcont) {
      const [offset, limit] = query.viewcont.split(",")
      return {
        // total: 0,
        limit: Number(limit),
        page: Math.ceil(Number(offset) / Number(limit)) + 1,
      }
    } else {
      return initAttr
    }
  }

  const [aiData, setAiData] = useState({ open: false, type: "", data: [] })
  const [emlLimit, setEmlLimit] = useState(50)
  const [loading, setLoading] = useState(false)
  const [isSpamManager, setIsSpamManager] = useState(false)
  const [listMail, setListMail] = useState([])
  const [info, setInfo] = useState(initialData["info"])
  const [attr, setAttr] = useState(() => getAttrFromQuery(initAttr))
  const [shareData, setShareData] = useState({
    isShareMail: false,
    shareInfo: {},
  })
  const [isCanHack, setIsCanHack] = useState(false)
  const [useInside, setUseInside] = useState(false)

  const [uuids, setUuids] = useState([])
  const [selectedMails, setSelectedMails] = useState([])
  const [openMoveData, setOpenMoveData] = useState({
    open: false,
    type: "move",
  })
  const [confirmData, setConfirmData] = useState({
    open: false,
    type: "",
  })
  // const [searchParams, setSearchParams] = useSearchParams()
  // const [openForwardModal, setOpenForwardModal] = useState(false)
  // const [composeProps, setComposeProps] = useState({})
  const [blockAddressData, setBlockAddressData] = useState({
    open: false,
    data: "",
  })
  const [addContactData, setAddContactData] = useState({
    open: false,
    data: "",
  })
  const [sortMailData, setSortMailData] = useState({
    open: false,
    data: "",
  })

  const [backupMailData, setBackupMailData] = useState(null)

  const initParams = useMemo(() => {
    return {
      acl: menu,
      act: "maillist",
      mailsort: "date",
      sortkind: "0",
      timemode: "mobile",
      viewcont: `0,${userMailSetting?.items_per_page ?? 20}`,
      searchbox: menu,
    }
  }, [menu, userMailSetting?.items_per_page])

  // effect
  useEffect(() => {
    const handlerMess = (event) => {
      // Verify the origin for security
      if (event.origin !== window.location.origin) return

      if (event?.data?.type === "MAIL_NEW_WINDOW_CLOSING") {
        // Execute callback actions
        handleUpdateLocalViewStatus(event?.data?.mid)
      }
    }
    window.addEventListener("message", handlerMess)

    return () => window.removeEventListener("message", handlerMess)
  }, [])

  useEffect(() => {
    if (newMailData && newMailData?.docuId && currentPage === 1) {
      setBackupMailData(newMailData)
    }
  }, [newMailData?.docuId])

  useEffect(() => {
    if (
      backupMailData?.docuId &&
      (menu !== "all" || (menu === "all" && excludeMailbox.indexOf(backupMailData?.mailbox) === -1))
    ) {
      let boxName = ""
      let mailboxKey = backupMailData?.mailbox?.toLowerCase()
      allMenus.map((mailbox) => {
        if (mailbox.key.toLowerCase() === mailboxKey) {
          boxName = mailbox.name
        }
      })
      const sender = backupMailData?.sender.trim().match(/"([^"]*)"/)?.[1]
      const cusNewMailData = {
        acl: backupMailData?.mailbox,
        addr: backupMailData?.sender,
        boxname: boxName,
        date: backupMailData?.date ?? backupMailData?.regdate,
        delay: "no",
        deluser: "",
        from_name: backupMailData?.fromname ?? sender ?? t("common.nodata_msg"),
        from_addr: backupMailData?.from_addr ?? t("common.nodata_msg"),
        getbackstate: "",
        getbackstr: "",
        groupcount: 0,
        htime: "",
        is_file: backupMailData?.isfile ?? 0,
        isbmail: false,
        isimportant: backupMailData?.isimportant ?? false,
        isnew: 1,
        isnotsave: false,
        ispreview: false,
        "message-id": backupMailData?.docuId,
        mid: backupMailData.docuId,
        dummy: backupMailData.docuId + "_" + moment.unix(),
        secu_approvaltime: "",
        secu_approvaluser: "",
        secu_reason: "",
        secu_state: "",
        security_info: {
          hasinfo: false,
        },
        sendlater: {
          issendlater: false,
          sendlater_timezone: "",
          sendlater_regtime: "",
          sendlater_status: "",
        },
        sentsecuinfo: {},
        sharedid: "",
        sigmsg: 1,
        size: backupMailData?.size ?? 0,
        spaminfo: {},
        stripsubject: backupMailData.message,
        subject: backupMailData.message,
        timestamp: backupMailData.timestamp,
        timeuuid: backupMailData.timeuuid,
        vsstatus: "",
        isinside: backupMailData.hasOwnProperty("isinside") ? backupMailData.isinside : true,
      }
      if (menu === "all" || menu === cusNewMailData.acl) {
        setListMail((prev) => {
          return uniqueBy(
            [
              {
                ...cusNewMailData,
                boxname: menu === cusNewMailData.acl ? null : cusNewMailData.boxname,
              },
            ].concat(prev),
            attr,
            function (x) {
              return x["mid"] + "_" + x["timeuuid"]
            },
          )
        })
      }
      setBackupMailData(null)
      setAttr((prev) => ({ ...prev, total: prev.total + 1 }))
    }
  }, [backupMailData])

  useEffect(() => {
    if (!isEqual(attr, getAttrFromQuery(queryParams))) {
      setAttr((prev) => ({
        ...prev,
        ...getAttrFromQuery(queryParams),
      }))
    }
    if (!isEmpty(queryParams)) {
      getListMail(queryParams)
    }
  }, [queryParams])

  useEffect(() => {
    // setSelectedMails([])
    if (newMailData) {
      dispatch(setSocketData(null))
    }
  }, [listMail])

  useEffect(() => {
    // check selected all list mails
    if (selectedMails.length === listMail.length && selectedMails.length !== 0) {
      setInfo((prev) => {
        return {
          ...prev,
          isSelectAll: true,
        }
      })
    } else {
      setInfo((prev) => {
        return {
          ...prev,
          isSelectAll: false,
        }
      })
    }
  }, [selectedMails])

  useEffect(() => {
    if (viewMode.isRefreshList) {
      onResetList()
      dispatch(setRefreshList(false))
    }
  }, [viewMode.isRefreshList])

  useEffect(() => {
    if ((userMailSetting?.items_per_page || 20) != attr.limit) {
      syncLimitChange()
    }
  }, [userMailSetting?.items_per_page])

  const uniqueBy = (arr, attr, fn) => {
    let unique = {},
      distinct = []

    arr.map((x) => {
      let key = fn(x)
      if (!unique[key]) {
        distinct.push(x)
        unique[key] = true
      }
    })

    if (attr?.limit && distinct.length > attr.limit) {
      for (var index = 0; index < distinct.length - attr.limit; index++) {
        distinct.pop()
      }
    }

    return distinct
  }

  // handler
  const getListMail = (query) => {
    setLoading(true)
    let params = !isEmpty(query) ? { ...query } : { ...initParams }
    if (isShare) {
      let arr = menu.split("_")
      params.acl = arr[arr.length - 1]
      params.shareid = menu
    }

    getListEmail(params)
      .then((res) => {
        if (res) {
          setUseInside(res?.useinside ?? false)
          setIsSpamManager(res?.hasspammanager ?? false)
          setIsCanHack(res.canhack ?? false)
          setShareData({
            isShareMail: res.isshare ?? false,
            shareInfo: res.shareinfo ?? {},
          })
          setEmlLimit(res.emllimit || 50)
          const mailList = uniqueBy(res.maillist, attr, function (x) {
            return x["mid"] + "_" + x["timeuuid"]
          })
          setListMail(mailList)
          if (mailList?.length === 0) {
            setSelectedMails([])
          }
          setAttr((prev) => ({ ...prev, total: res.total }))
          setInfo((prev) => ({
            ...prev,
            countNew: {
              ...prev.countNew,
              new: res.newcount,
              total: res.total,
            },
            isImportantAll: false,
            isSelectAll: false,
          }))
          let countImportant = 0
          res.maillist.map((mail) => {
            if (mail.isimportant) countImportant++
          })
          if (countImportant == res.maillist.length && countImportant != 0) {
            setInfo((prev) => ({
              ...prev,
              isImportantAll: true,
            }))
          }
        } else {
          errorToast()
        }
      })
      .catch(() => {
        errorToast()
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handleChangeCountLocal = (type, num) => {
    setInfo((prev) => ({
      ...prev,
      countNew: {
        ...prev.countNew,
        new:
          type === "plus"
            ? prev.countNew.new + num
            : prev.countNew.new == 0
            ? 0
            : prev.countNew.new - num,
      },
    }))
  }

  const handleChangeUnreadLocal = (idx, value) => {
    setListMail((prev) =>
      prev?.map((mail, index) => ({
        ...mail,
        isnew: idx === index ? value : mail.isnew,
      })),
    )
  }

  const onChangePage = (page) => {
    if (page != attr.page) {
      // setAttr(prev => ({
      //   ...prev,
      //   page
      // }))
      syncPageChange(page)
    }
  }

  const syncPageChange = (page) => {
    let nQuery = {}
    if (isEmpty(queryParams)) {
      nQuery = {
        ...initParams,
        viewcont: `${(page - 1) * attr.limit},${attr.limit}`,
      }
    } else {
      nQuery = {
        ...queryParams,
        viewcont: `${(page - 1) * attr.limit},${attr.limit}`,
      }
    }
    // const pathname = router.location.pathname
    // router.navigate(`${pathname}?${queryString.stringify(nQuery)}`)
    // setSearchParams(nQuery)
    dispatch(setQueryParams(nQuery))
    setCurrentPage(page)
  }

  const syncLimitChange = () => {
    const limit = userMailSetting?.items_per_page ?? 20
    let nQuery = {}
    let offset = ""
    if (isEmpty(queryParams)) {
      offset = initParams.viewcont.split(",")[0]
      nQuery = {
        ...initParams,
        viewcont: `${offset},${limit}`,
      }
    } else {
      offset = queryParams?.viewcont?.split(",")[0]
      nQuery = {
        ...queryParams,
        viewcont: `${offset},${limit}`,
      }
    }
    // const pathname = router.location.pathname
    // router.navigate(`${pathname}?${queryString.stringify(nQuery)}`)
    // setSearchParams(nQuery)
    dispatch(setQueryParams(nQuery))
  }

  const handleSelect = (mid, uuid) => {
    let newSelectedMails = [...selectedMails]
    let checkPosition = newSelectedMails.indexOf(mid)
    if (checkPosition != -1) {
      newSelectedMails.splice(checkPosition, 1)
    } else {
      newSelectedMails.push(mid)
    }
    setSelectedMails(newSelectedMails)

    let countUnread = 0
    let countRead = 0
    listMail.map((mail) => {
      if (newSelectedMails.indexOf(mail.mid) != -1 && !mail.isnew) {
        countRead++
      } else if (newSelectedMails.indexOf(mail.mid) != -1 && mail.isnew) {
        countUnread++
      }
    })
    if (countRead > 0 && countUnread > 0) {
      setInfo((prev) => ({
        ...prev,
        isBothAll: true,
      }))
    } else {
      setInfo((prev) => ({
        ...prev,
        isBothAll: false,
      }))
    }
    setInfo((prev) => ({
      ...prev,
      isUnreadAll: countUnread == newSelectedMails.length ? true : false,
    }))

    const nUuids = selectedHelper(uuids, uuid)
    setUuids(nUuids)
  }

  const selectedHelper = (oldArray, item) => {
    if (!isArray(oldArray) || !item) return []
    const newArray = [...oldArray]
    const pos = newArray.indexOf(item)
    if (pos != -1) {
      newArray.splice(pos, 1)
    } else {
      newArray.push(item)
    }
    return newArray
  }

  const onSelectDataType = (type) => {
    let newSelectedMails = []
    let nUuids = []
    let isSelectAll = false
    if (!type) {
      type = "all"
    }

    if (type != "none") {
      listMail.map((mail) => {
        if (type == "all") {
          newSelectedMails.push(mail.mid)
          nUuids.push(mail?.timeuuid)
        }
        if (type == "read" && !mail.isnew) {
          newSelectedMails.push(mail.mid)
          nUuids.push(mail?.timeuuid)
        }
        if (type == "unread" && mail.isnew) {
          newSelectedMails.push(mail.mid)
          nUuids.push(mail?.timeuuid)
        }
        if (type == "important" && mail.isimportant) {
          newSelectedMails.push(mail.mid)
          nUuids.push(mail?.timeuuid)
        }
        if (type == "not_important" && !mail.isimportant) {
          newSelectedMails.push(mail.mid)
          nUuids.push(mail?.timeuuid)
        }
      })
    }

    let countUnread = 0
    let countRead = 0
    listMail.map((mail) => {
      if (newSelectedMails.indexOf(mail.mid) != -1 && !mail.isnew) {
        countRead++
      } else if (newSelectedMails.indexOf(mail.mid) != -1 && mail.isnew) {
        countUnread++
      }
    })
    let isBothAll = false
    let isUnreadAll = false
    if (countRead > 0 && countUnread > 0) {
      isBothAll = true
    }
    if (countUnread === newSelectedMails.length) {
      isUnreadAll = true
    }
    if (newSelectedMails.length == listMail.length) {
      isSelectAll = true
    }

    // setSelectedMails(newSelectedMails)
    // setUuids(nUuids)
    const remainMids = listMail.filter((mail) => !newSelectedMails.includes(mail.mid))
    const remainUuids = listMail.filter((mail) => !nUuids.includes(mail.timeuuid))

    setSelectedMails((prev) => {
      const nMids = new Set(prev)
      newSelectedMails.forEach((mail) => {
        nMids.add(mail)
      })
      remainMids.forEach((mail) => {
        nMids.delete(mail.mid)
      })
      return Array.from(nMids)
    })

    setUuids((prev) => {
      const timeuuids = new Set(prev)
      nUuids.forEach((timeuuid) => {
        timeuuids.add(timeuuid)
      })
      remainUuids.forEach((mail) => {
        timeuuids.delete(mail.timeuuid)
      })
      return Array.from(timeuuids)
    })

    setInfo((prev) => ({
      ...prev,
      isUnreadAll: isUnreadAll,
      isSelectAll: isSelectAll,
      isBothAll: isBothAll,
    }))
  }

  const onDelete = (mid) => {
    const params = {
      acl: router?.params?.menu,
      mid: mid ? mid : selectedMails,
    }
    setLoading(true)
    postDeleteMail(params).then((res) => {
      setLoading(false)
      resetConfirmData()
      if (res.success == "1") {
        onResetList()
        successToast()
        const url = `/mail/list/${menu}?${queryString.stringify(queryParams)}`
        navigate(url)
      } else {
        errorToast("Failed")
      }
    })
  }

  const onMarkRead = (toUnread = true, mid, isRefresh = true, isUncheck = true) => {
    const isShare = menu?.indexOf("HBShare_") === 0
    const menuArr = menu?.split("_")
    const acl = isShare ? menuArr?.[menuArr.length - 1] : menu
    const params = {
      acl: acl,
      act: "mailsigupdate",
      mode: toUnread ? "newtocur" : "curtonew",
      mid: mid ? mid : selectedMails,
      ...(isShare && { shareid: menu }),
    }

    postMailToHtml5(params).then((res) => {
      if (res?.success || res?.success == "1") {
        isRefresh && onResetList()
        isUncheck && setSelectedMails([])
      } else {
        errorToast(res?.msg || "Failed")
      }
    })
  }

  const onResetList = () => {
    setUuids([])
    setSelectedMails([])
    getListMail(queryParams)
  }

  const getAclList = (selectedMails = []) => {
    let aclItems = {}

    if (listMail && listMail.length > 0) {
      listMail.map((mail) => {
        if (selectedMails.length == 0 || selectedMails.indexOf(mail.mid) != -1) {
          if (!aclItems[mail.acl]) {
            aclItems[mail.acl] = []
          }
          aclItems[mail.acl].push(mail.mid)
        }
      })
    }
    return aclItems
  }

  const onSetImportantAll = () => {
    if (router?.params?.menu == "all") {
      let aclItems = getAclList(),
        count = 0
      let aclItemsLength = Object.keys(aclItems).length
      if (aclItemsLength) {
        Object.keys(aclItems).map((acl) => {
          const callbackAllImport = (res) => {
            count++
            if (count == aclItemsLength) {
              onResetList()
            }
          }
          onSetImportant(!info.isImportantAll, acl, aclItems[acl], callbackAllImport)
        })
      }
    } else {
      if (listMail && listMail.length > 0) {
        let mids = []
        listMail.map((mail) => {
          mids.push(mail.mid)
        })

        onSetImportant(!info.isImportantAll, router?.params?.menu, mids)
      }
    }
  }

  const onSetImportant = (isImportant = true, acl, mids, callback) => {
    if (!isEmpty(shareData.shareInfo)) {
      errorToast(t("mail.mail_no_permission"))
      return
    }
    const arr = acl?.split("_")
    const nAcl = isShare ? arr[arr.length - 1] : acl
    const params = {
      acl: nAcl,
      act: "mailsigupdate",
      mode: isImportant ? "mailtosig" : "sigtomail",
      mid: mids,
      ...(isShare ? { shareid: acl } : {}),
    }
    postMailToHtml5(params).then((res) => {
      callback ? callback(res) : onResetList()
      if (!res?.success) {
        errorToast(res?.msg || "Failed")
      }
    })
  }

  const onReportSpam = (isSpam) => {
    if (router?.params?.menu == "all") {
      let aclItems = getAclList(selectedMails),
        count = 0
      let aclItemsLength = Object.keys(aclItems).length

      if (aclItemsLength) {
        Object.keys(aclItems).map((acl) => {
          const callbackAll = (res) => {
            if (res.success) {
              count++
              if (count == aclItemsLength) {
                onResetList()
              }
            }
          }
          isSpamManager
            ? onReportSpamManager(isSpam, acl, aclItems[acl], callbackAll)
            : onSetSpam(isSpam, acl, aclItems[acl], callbackAll)
        })
      }
    } else {
      isSpamManager
        ? onReportSpamManager(isSpam, router?.params?.menu, selectedMails)
        : onSetSpam(isSpam, router?.params?.menu, selectedMails)
    }
  }

  const onReportSpamManager = (isSpam = true, acl, mids, callback) => {
    const params = {
      boxid: acl,
      mode: isSpam ? "spam" : "nospam",
      mids: mids,
    }
    setLoading(true)
    postEmailSpam(params)
      .then((res) => {
        resetConfirmData()
        callback ? callback(res) : onResetList()
      })
      .catch((err) => {
        errorToast()
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const onSetSpam = async (isSpam = true, acl, mids, callback) => {
    const params = new FormData()
    params.append("acl", acl)
    params.append("act", isSpam ? "tospam" : "toham")
    if (isArray(mids)) {
      if (mids.length > 1) {
        mids.forEach((mid) => {
          params.append("mid", mid)
        })
      } else {
        params.append("mid", mids[0])
      }
    }

    setLoading(true)
    const url = `cgi-bin/NEW/mailTohtml5.do${isSpam ? "" : "?notspam=1"}`
    try {
      const res = await emailPost(url, params, Headers)
      if (res?.success == "1") {
        callback ? callback(res) : onResetList()
      }
      resetConfirmData()
    } catch (error) {
      errorToast()
      console.log("error:", error)
    } finally {
      setLoading(false)
    }
  }

  const resetConfirmData = () => {
    setConfirmData({
      open: false,
      type: "",
    })
  }

  const onChangeSetting = (type, value) => {
    dispatch(
      saveMailPersonalSetting({
        type: type,
        value: value,
      }),
    )
  }

  const handleMove = (type) => {
    setOpenMoveData({ open: true, type: type })
  }

  // from mail function
  const handleCompose = (mail) => {
    // setComposeProps({
    //   handleClose: () => setOpenComposeModal(false),
    //   modeType: "",
    //   toAddress: toAddress: [{ label: mail.from_addr, value: mail.from_addr }],
    // })
    // setOpenComposeModal(true)
    const toAddress = mail?.addr?.split(",")
    const composeData = {
      ...composeDataDefaults,
      id: `compose-mail-${composeMails.data.length}`,
      composeMode: composeDisplayMode,
      modeType: "",
      toAddress: toAddress.map((addr) => ({
        label: decodeHtmlEntities(addr),
        value: decodeHtmlEntities(addr),
      })),
    }
    dispatch(openComposeMail(composeData))
  }

  const handleSearchAddress = (type, mail) => {
    const limit = userMailSetting?.items_per_page || 20
    if (type === "f") {
      const nQuery = { ...queryParams }
      if (nQuery.hasOwnProperty("t")) {
        delete nQuery["t"]
      }

      // setSearchParams({ ...nQuery, f: mail.from_addr })
      dispatch(setQueryParams({ ...nQuery, viewcont: `0,${limit}`, f: mail.from_addr }))
    } else {
      const nQuery = { ...queryParams }
      if (nQuery.hasOwnProperty("f")) {
        delete nQuery["f"]
      }

      // setSearchParams({ ...nQuery, t: mail.from_addr })
      dispatch(setQueryParams({ ...nQuery, viewcont: `0,${limit}`, t: mail.from_addr }))
    }
  }

  const handleAddContact = (data) => {
    if (!data) return
    postAddContact(data)
      .then((res) => {
        if (res.success) {
          successToast()
        }
      })
      .catch((err) => {
        errorToast(err)
      })
      .finally(() => {
        setAddContactData((prev) => ({
          ...prev,
          open: false,
        }))
      })
  }

  const handleBlockAddress = (data) => {
    const params = {
      act: "bans",
      mode: "write",
      data: data,
    }
    postBLockAddress(params)
      .then((res) => {
        if (res.success) {
          successToast()
        }
      })
      .catch((err) => {
        errorToast(err)
      })
      .finally(() => {
        setBlockAddressData((prev) => ({
          ...prev,
          open: false,
        }))
      })
  }

  const handleSortMailtoFolder = (data, autoSplit) => {
    const params = {
      act: "autosplit",
      mode: "insert",
      data: JSON.stringify(data),
    }
    postAutoSortMailToFolder(params)
      .then((res) => {
        if (res.success === "1") {
          successToast()
          if (autoSplit) {
            const params = {
              frommailbox: menu,
              fromaddr: data.fromaddr,
              toaddr: data.toaddr,
              tomailbox: data.mailbox,
              subject: data.subject,
            }
            postAutoSplit(params)
              .then(() => {})
              .catch((err) => {
                errorToast(err)
              })
              .finally(() => {
                setSortMailData((prev) => ({
                  ...prev,
                  open: false,
                }))
              })
          } else {
            setSortMailData((prev) => ({
              ...prev,
              open: false,
            }))
          }
        }
      })
      .catch((err) => {
        errorToast(err)
      })
  }

  const handleForward = (mail) => {
    // setComposeProps({
    //   titleCompose: "common.mail_view_forward",
    //   handleClose: () => setOpenForwardModal(false),
    //   mid: mail.mid,
    //   modeType: "forward",
    // })
    // setOpenForwardModal(true)
    const composeData = {
      ...composeDataDefaults,
      id: `compose-mail-${composeMails.data.length}`,
      composeMode: composeDisplayMode,
      mid: mail.mid,
      modeType: "forward",
      titleCompose: "common.mail_view_forward",
    }
    dispatch(openComposeMail(composeData))
  }

  const handleCancelSendLater = async (mid) => {
    const res = await emailDelete(`email/etc/sendlater?t=${mid}`)
    if (res && res.success) {
      successToast()
      onResetList()
    } else {
      errorToast()
    }
  }

  const handleCancelSending = async (mail) => {
    const params = {
      act: "mailgetback",
      deluser: mail?.deluser,
      mid: mail?.mid,
      msgid: mail?.["message-id"],
    }
    const res = await getCancelSending(params)
    if (res && res.success) {
      successToast()
      onResetList()
    } else {
      errorToast()
    }
  }

  const handleOpenNewWindow = (acl, mid) => {
    if (!isReadSharedMail(shareData.shareInfo)) {
      errorToast(t("mail.mail_no_permission"))
      return
    }
    let url = `${
      process.env.NODE_ENV === "development" ? "" : process.env.PUBLIC_URL
    }/clone-writer/${acl}/${mid}`
    if (isShare) {
      url = url + "?" + `shareid=${menu}`
    }
    const newWindow = window.open(url, "_blank", "width=1150,height=749,scrollbars=1,resizable=1")
  }

  // Handle copy text to clipboard
  const handleCopyToClipboard = (text) => {
    if (text) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          successToast(t("mail.mail_copy_to_clipboardCopied"))
        })
        .catch((err) => {
          errorToast(["Error<br/>", err].join(""))
        })
    }
  }

  const handleResend = (shareId = "") => {
    const composeData = {
      ...composeDataDefaults,
      id: `compose-mail-${composeMails.data.length}`,
      composeMode: composeDisplayMode,
      mid: selectedMails[0],
      modeType: "resend",
      shareId: shareId,
      titleCompose: "mail.mail_view_resend",
    }
    dispatch(openComposeMail(composeData))
  }

  const handleUpdateLocalViewStatus = (mid) => {
    setListMail((prev) =>
      prev.map((mail) => {
        if (mail.mid === mid) {
          return {
            ...mail,
            isnew: 0,
          }
        }
        return mail
      }),
    )
    handleChangeCountLocal("minus", 1)
  }

  const handleUpdateViewStatus = (mail) => {
    onMarkRead && onMarkRead(true, mail?.mid, false, false)
    handleUpdateLocalViewStatus(mail?.mid)
  }

  return (
    <>
      <div
        className={`list-mail d-flex flex-column h-100 justify-content-between${
          isMobile ? "" : " gap-2"
        }${isSplitMode ? " pe-2" : ""}`}
      >
        <EmailToolbar2
          menu={router?.params?.menu}
          info={info}
          attr={attr}
          uuids={uuids}
          setUuids={setUuids}
          emlLimit={emlLimit}
          loading={loading}
          isSplitMode={isSplitMode}
          isSpamManager={isSpamManager}
          selectedMails={selectedMails}
          setSelectedMails={setSelectedMails}
          listMail={listMail}
          onDelete={onDelete}
          onMarkRead={onMarkRead}
          onSetImportantAll={onSetImportantAll}
          onToggleMove={handleMove}
          onSelectDataType={onSelectDataType}
          onReportSpam={onReportSpam}
          onRefresh={onResetList}
          setConfirmData={setConfirmData}
          onChangeSetting={onChangeSetting}
          shareData={shareData}
          isCanHack={isCanHack}
          isHidePageInfo={isHidePageInfo}
          onResend={handleResend}
          // onUpdateLocalViewStatus={handleUpdateLocalViewStatus}
          // onFilterChange={onFilterChange}
        />
        {/* list mail */}
        <div
          className={`list-content flex-grow-1 overflow-y-auto ${
            isSplitMode ? "scroll-box-list" : ""
          }`}
        >
          {isSplitMode ? (
            <SplitItem
              onRefresh={onResetList}
              menu={menu}
              language={i18n.language}
              router={router}
              loading={loading}
              listMail={listMail}
              handleSelect={handleSelect}
              selectedMails={selectedMails}
              onSetImportant={onSetImportant}
              onMarkRead={onMarkRead}
              onDelete={onDelete}
              setConfirmData={setConfirmData}
              onComposeTo={handleCompose}
              onSearchAddress={handleSearchAddress}
              onAddContact={setAddContactData}
              onBlockAddress={setBlockAddressData}
              onAutoSortMailtoFolder={setSortMailData}
              onChangeCount={handleChangeCountLocal}
              onChangeUnread={handleChangeUnreadLocal}
              onCancelSendLater={handleCancelSendLater}
              onCancelSending={handleCancelSending}
              onForward={handleForward}
              shareData={shareData}
              onOpenNewWindow={handleOpenNewWindow}
              handleCopyToClipboard={handleCopyToClipboard}
              setAiData={setAiData}
            />
          ) : (
            <>
              {isVerticalTablet || isMobile ? (
                <SplitItem
                  onRefresh={onResetList}
                  menu={menu}
                  language={i18n.language}
                  router={router}
                  loading={loading}
                  listMail={listMail}
                  handleSelect={handleSelect}
                  selectedMails={selectedMails}
                  onSetImportant={onSetImportant}
                  onMarkRead={onMarkRead}
                  onDelete={onDelete}
                  setConfirmData={setConfirmData}
                  onComposeTo={handleCompose}
                  onSearchAddress={handleSearchAddress}
                  onAddContact={setAddContactData}
                  onBlockAddress={setBlockAddressData}
                  onAutoSortMailtoFolder={setSortMailData}
                  onChangeCount={handleChangeCountLocal}
                  onChangeUnread={handleChangeUnreadLocal}
                  onCancelSendLater={handleCancelSendLater}
                  onCancelSending={handleCancelSending}
                  onForward={handleForward}
                  shareData={shareData}
                  onOpenNewWindow={handleOpenNewWindow}
                  handleCopyToClipboard={handleCopyToClipboard}
                  setAiData={setAiData}
                />
              ) : (
                <ListItem
                  menu={menu}
                  language={i18n.language}
                  router={router}
                  listMail={listMail}
                  handleSelect={handleSelect}
                  selectedMails={selectedMails}
                  loading={loading}
                  onSetImportant={onSetImportant}
                  onMarkRead={onMarkRead}
                  onDelete={onDelete}
                  setConfirmData={setConfirmData}
                  onComposeTo={handleCompose}
                  onSearchAddress={handleSearchAddress}
                  onAddContact={setAddContactData}
                  onBlockAddress={setBlockAddressData}
                  onAutoSortMailtoFolder={setSortMailData}
                  onForward={handleForward}
                  onCancelSendLater={handleCancelSendLater}
                  onCancelSending={handleCancelSending}
                  shareData={shareData}
                  onOpenNewWindow={handleOpenNewWindow}
                  handleCopyToClipboard={handleCopyToClipboard}
                  setAiData={setAiData}
                  useInside={useInside}
                />
              )}
            </>
          )}
        </div>

        {listMail.length > 0 && (
          <PaginationV2
            pageCount={attr.total}
            pageSize={attr.limit}
            pageIndex={attr.page}
            onChangePage={onChangePage}
            isSplitMode={isSplitMode}
            setPageSize={onChangeSetting}
            isHidePageInfo={isHidePageInfo}
          />
        )}
      </div>
      {openMoveData.open && (
        <ModalMove
          menuKey={menu}
          keyHeader={openMoveData.type !== "move" ? "common.action_copy" : undefined}
          type={openMoveData.type}
          isOpen={openMoveData.open}
          toggle={() => setOpenMoveData((prev) => ({ ...prev, open: false }))}
          listMail={listMail}
          selectedMails={selectedMails}
          onResetList={onResetList}
        />
      )}
      {confirmData?.open && (
        <ModalConfirm
          isOpen={confirmData?.open}
          loading={loading}
          toggle={() => resetConfirmData()}
          onClick={() => {
            if (confirmData?.type == "delete") {
              onDelete(confirmData?.mid)
            } else if (confirmData?.type == "spam") {
              onReportSpam(true)
            } else if (confirmData?.type == "nospam") {
              onReportSpam(false)
            }
            // resetConfirmData()
          }}
          keyHeader={confirmTypeData?.[confirmData?.type]["header"]}
          keyBody={confirmTypeData?.[confirmData?.type]["body"]}
        />
      )}
      {blockAddressData.open && (
        <BlockAddressModal
          isOpen={blockAddressData.open}
          data={blockAddressData.data}
          toggle={setBlockAddressData}
          onBlockAddress={handleBlockAddress}
        />
      )}
      {addContactData.open && (
        <AddContactModal
          isOpen={addContactData.open}
          data={addContactData.data}
          toggle={() => setAddContactData((prev) => ({ ...prev, open: false }))}
          onAddContact={handleAddContact}
        />
      )}
      {sortMailData.open && (
        <AutoSortMailToFolderModal
          isOpen={sortMailData.open}
          data={sortMailData.data}
          toggle={() => setSortMailData((prev) => ({ ...prev, open: false }))}
          onSortMail={handleSortMailtoFolder}
          menu={menu}
        />
      )}

      {openPrintModal && (
        <PrintListModal
          list={listMail}
          open={openPrintModal}
          language={i18n.language}
          onClose={() => dispatch(triggerPrintModal(false))}
        />
      )}

      {aiData.open && aiData.type === "translate" && (
        <TranslateModal
          open={aiData.open}
          aiData={aiData}
          onClose={() => {
            setAiData({ open: false, type: "", data: [] })
          }}
          onFinishSummary={handleUpdateViewStatus}
        />
      )}
      {aiData.open && aiData.type === "summary" && (
        <SummaryModal
          open={aiData.open}
          aiData={aiData}
          onClose={() => {
            setAiData({ open: false, type: "", data: [] })
          }}
          onFinishSummary={handleUpdateViewStatus}
        />
      )}
      {/* {openForwardModal && <ComposeMail {...composeProps} />} */}
    </>
  )
}

export default withRouter(Index)
