// @ts-nocheck
// React
import { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react"

// Third-party
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams, useSearchParams } from "react-router-dom"
import { Alert, Input } from "reactstrap"

// Project
import { FilePreview } from "components/Common/Attachment/FilePreview"
import BaseButtonTooltip from "components/Common/BaseButtonTooltip"
import { shareboxHelper } from "components/Common/ComposeMail"
import { Dialog } from "components/Common/Dialog"
import Loading from "components/Common/Loading"

import {
  emailDelete,
  emailGet,
  emailPost,
  formDataUrlencoded,
  Headers,
} from "helpers/email_api_helper"
import { useCustomToast } from "hooks/useCustomToast"
import { URL_EMAIL_SPAM, URL_MAIL_TO_HTML5 } from "modules/mail/common/urls"
import { openComposeMail } from "store/composeMail/actions"
import { setRefreshList } from "store/viewMode/actions"
import { isObject } from "utils"

import AddContact from "components/AddContact"
import ApprovalInformation from "components/ApprovalInformation"
import AttachmentMail from "components/AttachmentMail"
import BlockSenders from "components/BlockSenders"
import CipherInformation from "components/CipherInformation"
import { BaseButton } from "components/Common"
import { ModalConfirm } from "components/Common/Modal"
import HeaderInformation from "components/HeaderInformation"
import RelatedMail from "components/RelatedMail"
import CloudAttachment from "components/CloudAttachment"
import SentMail from "components/SentMail"
import ShareBox from "components/ShareBox"
import useDevice from "hooks/useDevice"
import { isEmpty } from "lodash"
import { postMailToHtml5 } from "modules/mail/common/api"
import {
  postAddContact,
  postAutoSortMailToFolder,
  postAutoSplit,
  postBLockAddress,
  postDeleteMail,
} from "modules/mail/list/api"
import AddContactModal from "pages/List/AddContactModal"
import AutoSortMailToFolderModal from "pages/List/AutoSortMailToFolderModal"
import BlockAddressModal from "pages/List/BlockAddressModal"
import ModalMove from "pages/List/ModalMove"
import { selectUserMailSetting } from "store/auth/config/selectors"
import { composeDataDefaults } from "store/composeMail/reducer"
import { setIsDetailView } from "store/mailDetail/actions"
import { setQueryParams } from "store/mailList/actions"
import FooterDetail from "./FooterDetail"
import HeaderDetail from "./HeaderDetail"
import MailDetailButton from "./HeaderDetail/MailDetailButton"
import MailInfo from "./MailInfo"
import MobileHeader from "./MobileHeader"
import SecurityMsg from "./SecurityMsg"
import "./styles.scss"
import AIModal from "components/AIModal"
import TranslateModal from "components/AIModal/TranslateModal"
import SummaryModal from "components/AIModal/SummaryModal"
import useGroupwareMenu from "utils/useGroupwareMenu"

export const MailContext = createContext({})

const Detail = ({ isChangeAttView }) => {
  const { t } = useTranslation()
  const { errorToast, successToast } = useCustomToast()

  // Router
  const navigate = useNavigate()
  const { menu, mid } = useParams()

  const { isMobile, isVerticalTablet } = useDevice()

  // state
  const [secretPass, setSecretPass] = useState("")

  // redux
  const dispatch = useDispatch()
  const isSplitMode = useSelector((state) => state.viewMode.isSplitMode)
  const currentAcl = useSelector((state) => state.mailDetail.currentAcl)
  const isSecureView = useSelector((state) => state.mailDetail.isSecureView)
  const isViewFromList = useSelector((state) => state.mailDetail.isViewFromList)
  const queryParams = useSelector((state) => state.QueryParams.query)
  const composeMails = useSelector((state) => state.ComposeMail.composeMails)
  const composeDisplayMode = composeMails.localComposeMode
  const { checkMenuAvailable } = useGroupwareMenu()

  const [searchParams, setSearchParams] = useSearchParams()

  const userMailSetting = useSelector(selectUserMailSetting)

  const isSecureMenu = menu === "Secure"
  const isShareMenu = menu?.includes("HBShare_")
  const isReceiptsMenu = menu === "Receive"

  // State for button to the top
  const divRef = useRef(null)
  const contentRef = useRef(null)
  const detailPageRef = useRef(null)

  // AI function
  const [aiData, setAiData] = useState({ open: false, type: "", data: [] })

  const [openMoveData, setOpenMoveData] = useState({
    open: false,
    type: "move",
  })

  const limit = useMemo(() => {
    return userMailSetting?.items_per_page ?? 20
  }, [userMailSetting?.items_per_page])

  // handle scroll
  const [isScroll, setIsScroll] = useState(false)
  const [showButtonFixed, setShowButtonFixed] = useState(false)
  const [openConfirmModal, setOpenConfirmModal] = useState(false)

  const scrollToTop = (event, behavior) => {
    divRef?.current?.scroll({ top: 0, behavior: behavior ?? "smooth" })
  }

  const handleScroll = (event) => {
    const { scrollTop } = event.target
    setIsScroll(scrollTop >= 350)
  }

  const checkElementVisible = useCallback((event) => {
    if (event?.target?.scrollTop > (isSplitMode ? 200 : 100)) {
      setShowButtonFixed(true)
    } else {
      setShowButtonFixed(false)
    }
  }, [])

  const enableCloudDisk = useMemo(() => {
    return checkMenuAvailable("disk")
  }, [checkMenuAvailable])

  // set isDetailView
  useEffect(() => {
    dispatch(setIsDetailView(true))

    return () => {
      dispatch(setIsDetailView(false))
    }
  }, [])

  useEffect(() => {
    const detailPage = detailPageRef.current
    if (detailPageRef?.current) {
      detailPage.addEventListener("scroll", (e) => checkElementVisible(e, detailPage))
    }

    return () => {
      detailPageRef?.current?.removeEventListener("scroll", (e) =>
        checkElementVisible(e, detailPage),
      )
    }
  }, [detailPageRef?.current])

  // State for loading
  const [isLoading, setIsLoading] = useState(false)

  // State for mail
  const [mail, setMail] = useState({})
  const [isMailError, setIsMailError] = useState(false)
  const [showPassInput, setShowPassInput] = useState(isSecureMenu && isSecureView === "1")

  // State for Related mail
  const [groupMailList, setGroupMailList] = useState({
    loading: false,
    list: [],
    total: 0,
  })
  const [isShowRelatedMail, setIsShowRelatedMail] = useState(false)

  // State for Cipher Information
  const [cipherInfo, setCipherInfo] = useState({
    isShow: false,
    data: {},
  })

  // State for Block Sender(s)
  const [isShowBlockSender, setIsShowBlockSender] = useState(false)
  const handleBlockSender = () => setIsShowBlockSender(!isShowBlockSender)

  // State for Add to Contact List
  const [isShowAddToContactList, setIsShowAddToContactList] = useState(false)
  const handleAddToContactList = () => setIsShowAddToContactList((prev) => !prev)

  // State for modal
  const [isShowHeader, setIsShowHeader] = useState({ isShow: false, mode: "" }) // Show Header or Original
  const [isShowShareBox, setIsShowShareBox] = useState(false)
  const [previewFile, setPreviewFile] = useState({})

  const onPreviewHandle = (file) => {
    setPreviewFile({
      ...previewFile,
      isOpen: true,
      isLocalFile: false,
      file: file,
    })
  }

  // handle target link
  // useEffect(() => {
  //   if (mail && contentRef?.current?.innerHTML) {
  //     const aElement = contentRef.current.querySelectorAll("a")
  //     if (!!aElement && aElement.length > 0) {
  //       aElement.forEach((_ele) => {
  //         const url = _ele.getAttribute("href")
  //         if (!!url && (url?.includes(location.origin) || process.env.NODE_ENV === "development")) {
  //           let pathname = ""
  //           if (url.includes("archive")) {
  //             pathname = url.split("#")?.[0]
  //             if (pathname) {
  //               _ele.setAttribute("href", pathname)
  //             }
  //           } else {
  //             if (url.includes("nhr") && !url.includes("#")) {
  //               pathname = "/nhr" + url.split("nhr")?.[1]
  //             } else {
  //               pathname = url.split("#")?.[1]
  //             }

  //             if (pathname) {
  //               const nUrl = `${
  //                 process.env.NODE_ENV === "development"
  //                   ? "https://vndev.hanbiro.com"
  //                   : location.origin
  //               }/groupware-v3${pathname}`
  //               _ele.setAttribute("href", nUrl)
  //             }
  //           }
  //           _ele.setAttribute("target", "_blank")
  //         } else {
  //           _ele.setAttribute("target", "_blank")
  //         }
  //       })
  //     }
  //   }
  // }, [mail])

  useEffect(() => {
    if (secretPass) {
      setSecretPass("")
    }
  }, [mid])

  // from mail function
  const handleCompose = (mail) => {
    // setComposeProps({
    //   handleClose: () => setOpenComposeModal(false),
    //   modeType: "",
    //   toAddress: [{ label: mail, value: mail }],
    // })
    // setOpenComposeModal(true)
    const composeData = {
      ...composeDataDefaults,
      id: `compose-mail-${composeMails.data.length}`,
      modeType: "",
      composeMode: composeDisplayMode,
      toAddress: [{ label: mail, value: mail }],
    }
    dispatch(openComposeMail(composeData))
  }

  // State for Resend (Sent Mail)
  // const [resendData, setResendData] = useState({ open: false, shareId: "" })
  // Handle open/close modal for Resend
  // const handleOpenResendModal = (shareId = "") => setResendData({ open: true, shareId: shareId })
  // const handleCloseResendModal = () => setResendData({ open: false, shareId: "" })
  const handleOpenResendModal = (shareId = "") => {
    const composeData = {
      ...composeDataDefaults,
      id: `compose-mail-${composeMails.data.length}`,
      composeMode: composeDisplayMode,
      mid: mid,
      modeType: "resend",
      shareId: shareId,
      titleCompose: "mail.mail_view_resend",
    }
    dispatch(openComposeMail(composeData))
  }

  // State for Edit (Draft Mail)
  // const [edit, setEdit] = useState(false)
  // Handle open/close modal for Edit
  // const handleOpenEditModal = () => setEdit(true)
  // const handleCloseEditModal = () => setEdit(false)
  const handleOpenEditModal = () => {
    const composeData = {
      ...composeDataDefaults,
      id: `compose-mail-${composeMails.data.length}`,
      composeMode: composeDisplayMode,
      mid: mid,
      modeType: "edit",
      titleCompose: "mail.mail_set_mailbox_modify",
    }
    dispatch(openComposeMail(composeData))
  }

  // State for Reply
  // const [reply, setReply] = useState(false)
  // Handle open/close modal for Reply
  // const handleOpenReplyModal = () => setReply(true)
  // const handleCloseReplyModal = () => setReply(false)
  const handleOpenReplyModal = () => {
    const composeData = {
      ...composeDataDefaults,
      id: `compose-mail-${composeMails.data.length}`,
      composeMode: composeDisplayMode,
      mid: mid,
      modeType: "reply",
      titleCompose: "mail.mail_view_reply",
    }
    dispatch(openComposeMail(composeData))
  }

  // State for Reply All
  // const [replyAll, setReplyAll] = useState(false)
  // Handle open/close modal for Reply All
  // const handleReplyAllModal = () => setReplyAll(true)
  // const handleCloseReplyAllModal = () => setReplyAll(false)
  const handleReplyAllModal = () => {
    const composeData = {
      ...composeDataDefaults,
      id: `compose-mail-${composeMails.data.length}`,
      composeMode: composeDisplayMode,
      mid: mid,
      modeType: "allreply",
      titleCompose: "mail.mail_view_allreply",
    }
    dispatch(openComposeMail(composeData))
  }

  // State for Forward
  const uuids = useMemo(() => {
    return [mail?.timeuuid]
  }, [mail])
  // const [forward, setForward] = useState(false)
  // const [emlForward, setEmlForward] = useState(false)
  // Handle open/close modal for Forward
  // const handleForwardModal = () => setForward(true)
  // const handleEmlForwardModal = () => {
  //   setForward(true)
  //   setEmlForward(true)
  // }
  const handleForwardModal = () => {
    const composeData = {
      ...composeDataDefaults,
      id: `compose-mail-${composeMails.data.length}`,
      composeMode: composeDisplayMode,
      mid: mid,
      uuids: undefined,
      modeType: "forward",
      titleCompose: "common.mail_view_forward",
    }
    dispatch(openComposeMail(composeData))
  }
  const handleEmlForwardModal = () => {
    const composeData = {
      ...composeDataDefaults,
      id: `compose-mail-${composeMails.data.length}`,
      composeMode: composeDisplayMode,
      mid: mid,
      uuids: uuids,
      modeType: "eml-forward",
      titleCompose: "mail.mail_eml_forward",
    }
    dispatch(openComposeMail(composeData))
  }
  // const handleCloseForwardModal = () => {
  //   setForward(false)
  //   setEmlForward(false)
  // }

  // State for Report Hacking Mail
  // const [reportHackingMail, setReportHackingMail] = useState(false)
  // Handle open/close modal for Report Hacking Mail
  const handleReportHackingMailModal = () => {
    const composeData = {
      ...composeDataDefaults,
      id: `compose-mail-${composeMails.data.length}`,
      composeMode: composeDisplayMode,
      mid: mid,
      modeType: "hacking",
      uuids: mail?.timeuuid,
      titleCompose: "mail.mail_hacking_report",
    }
    dispatch(openComposeMail(composeData))
  }

  const handleOpenNewWindow = (acl, mid) => {
    let url = `${
      process.env.NODE_ENV === "development" ? "" : process.env.PUBLIC_URL
    }/clone-writer/${acl}/${mid}`
    if (isShareMenu) {
      url = url + "?" + `shareid=${menu}`
    }
    window.open(url, "_blank", "width=1150,height=749,scrollbars=1,resizable=1")
  }
  // const handleReportHackingMailModal = () => setReportHackingMail(true)
  // const handleCloseReportHackingMailModal = () => setReportHackingMail(false)

  // Handle close compose modal
  // const handleCloseComposeMail = () => {
  //   dispatch(expandComposeModal(initialState.expandComposeMail))
  //   dispatch(closeComposeMail())
  //   if (resendData.open) {
  //     handleCloseResendModal()
  //   } else if (edit) {
  //     handleCloseEditModal()
  //   } else if (reply) {
  //     handleCloseReplyModal()
  //   } else if (replyAll) {
  //     handleCloseReplyAllModal()
  //   } else if (forward) {
  //     handleCloseForwardModal()
  //   } else if (reportHackingMail) {
  //     handleCloseReportHackingMailModal()
  //   }
  // }

  // Handle call API to get mail
  const getMail = async () => {
    try {
      setIsLoading(true)
      let res = {}
      if (isShareMenu) {
        // const nMenu = menu.split("_")[menu.split("_").length - 1]
        const nMenu = currentAcl ? currentAcl : menu
        res = await emailGet(["email", nMenu, mid].join("/"), { shareid: menu })
      } else if (isSecureMenu && (isSecureView === "1" || showPassInput)) {
        res = await emailGet(["email", currentAcl ? currentAcl : menu, mid].join("/"), {
          set_password: secretPass,
        })
        if (res?.mailview[0]?.from == "None" && res?.mailview[0]?.subject == "None") {
          errorToast(t("mail.mail_memo_invalid"))
          setIsLoading(false)
          return
        }
      } else {
        res = await emailGet(["email", currentAcl ? currentAcl : menu, mid].join("/"))
      }

      const mailData = res?.mailview[0]
      if (isObject(mailData?.sentsecuinfo)) {
        setCipherInfo({ isShow: true, data: mailData?.sentsecuinfo })
      }
      setMail(mailData)
      setImportant({ value: mailData?.isimportant, loading: false })
      if (
        mailData?.subject?.search("[Email Error]") === 1 &&
        mailData?.subject?.search("메일발송실패") === 14 &&
        mailData?.subject?.search("[ 메일 전송 실패 (Failed to send mail) ]") === 2
      ) {
        setIsMailError(true)
      }
      if (
        mailData?.to == "None" &&
        mailData?.from == "None" &&
        mailData?.subject == "None" &&
        mailData?.acl == "Secure"
      ) {
        /**
         * @description Using for case: Access view by direct url link without going through list / Refresh view page
         */
        !showPassInput && setShowPassInput(true)
      } else {
        setShowPassInput(false)
      }
      // setSecretPass("")
      if (divRef) {
        scrollToTop(null, "auto")
      }
    } catch (err) {
      if (isShareMenu) {
        errorToast(t("mail.mail_no_permission"))
      } else {
        errorToast()
      }
      navigate(["/mail/list", menu].join("/"))
    } finally {
      setIsLoading(false)
    }
  }

  // Handle call API to get related mail
  const getRelatedMail = async (page = 1, limit = 10) => {
    setGroupMailList({ ...groupMailList, loading: true })
    try {
      const params = {
        act: "getgrouplist",
        acl: "Maildir",
        mid: mid,
        sno: page,
        listlimit: limit,
      }
      const res = await emailGet(URL_MAIL_TO_HTML5, params)
      if (res?.groupmaillist?.length > 0) {
        setIsShowRelatedMail(true)
        setGroupMailList({
          loading: false,
          list: res?.groupmaillist,
          total: res?.tot,
        })
      }
    } catch (err) {
      errorToast()
      setGroupMailList({ ...groupMailList, loading: false })
    }
  }

  /**
   * @description Using for case: Access view by direct url link without going through list / Refresh view page
   */
  useEffect(() => {
    if (!isViewFromList) {
      getMail() // Call API
    }
  }, [])

  useEffect(() => {
    setIsShowRelatedMail(false)
    if (isSecureMenu && isSecureView === "1") {
      /**
       * @description Using for case: Access view through list or split
       */
      !showPassInput && setShowPassInput(true)
    } else {
      if (isViewFromList) {
        getMail() // Call API
      }
      getRelatedMail() // Call API
    }
  }, [mid, isSecureView, isViewFromList])

  /**
   * @description Handle show or hide header modal
   * @returns {void}
   */
  const handleShowHeader = (mode) => {
    setIsShowHeader({ isShow: true, mode: mode })
  }
  const handleCloseShowHeader = () => {
    setIsShowHeader({ ...isShowHeader, isShow: false })
  }

  /**
   * @description Handle show or hide share box modal
   * @returns {void}
   */
  const handleShowShareBox = () => {
    setIsShowShareBox(true)
  }
  const handleCloseShareBox = () => {
    setIsShowShareBox(false)
  }

  /**
   * @description Show action modal when clicking on button
   * */
  const [actionModal, setActionModal] = useState({
    isOpen: false,
    title: t("mail.mail_log_action"),
    content: t("mail.common_confirm_continue"),
    buttons: [],
    centered: true,
  })
  const handleActionModal = (type = t("mail.mail_log_action"), actionCallback, ...args) => {
    setActionModal({
      ...actionModal,
      isOpen: true,
      title: type,
      buttons: [
        {
          text: t("mail.mail_view_continue_msg"),
          onClick: () => {
            actionCallback?.(...args)
            setActionModal({ ...actionModal, isOpen: false })
          },
          color: "primary",
        },
        {
          text: t("common.common_cancel"),
          onClick: () => {
            setActionModal({ ...actionModal, isOpen: false })
          },
        },
      ],
    })
  }

  // mail dropdown action state
  // const [openComposeModal, setOpenComposeModal] = useState(false)
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

  // const initParams = useMemo(() => {
  //   return {
  //     acl: menu,
  //     act: "maillist",
  //     mailsort: "date",
  //     sortkind: "0",
  //     timemode: "mobile",
  //     viewcont: `0,${userMailSetting?.items_per_page ?? 20}`,
  //   }
  // }, [menu, userMailSetting?.items_per_page])

  const handleSearchAddress = (type, mail) => {
    if (type === "f") {
      const nQuery = { ...queryParams, viewcont: `0,${limit}`, f: mail }
      if (nQuery.hasOwnProperty("t")) {
        delete nQuery["t"]
      }
      setSearchParams(nQuery)
      dispatch(setQueryParams(nQuery))
    } else {
      const nQuery = { ...queryParams, viewcont: `0,${limit}`, t: mail }
      if (nQuery.hasOwnProperty("f")) {
        delete nQuery["f"]
      }
      setSearchParams(nQuery)
      dispatch(setQueryParams(nQuery))
    }
    navigate("/mail/list")
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
          }
        }
      })
      .catch((err) => {
        errorToast(err)
      })
  }

  // Mail button
  const [important, setImportant] = useState({
    value: false,
    loading: false,
  })
  // Handle mark as important button => Mark as Important
  const handleMarkAsImportant = async (isImportant, acl, mid) => {
    if (!isEmpty(mail?.shareinfo)) {
      errorToast(t("mail.mail_no_permission"))
      return
    }
    setImportant({ ...important, loading: true })
    try {
      const params = {
        acl: acl,
        act: "mailsigupdate",
        mode: isImportant ? "mailtosig" : "sigtomail",
        mid: mid,
      }
      const res = await postMailToHtml5(params)
      successToast()
      setImportant({ value: !important.value, loading: false })
      // getMail() // Refresh page
    } catch (err) {
      errorToast()
      setImportant({ ...important, loading: false })
    }
  }

  // Handle mark as unread button => Mark as Unread
  const handleMarkAsUnread = async (acl, mid) => {
    try {
      const params = {
        acl: acl,
        act: "mailsigupdate",
        mode: "curtonew",
        mid: mid,
        ...(isShareMenu && { shareid: menu }),
      }
      const res = await postMailToHtml5(params)
      if (res.success === "1") {
        successToast()
        if (isSplitMode) {
          dispatch(setRefreshList(true))
        } else {
          navigate(["/mail/list", menu].join("/"))
        }
      } else {
        errorToast(res?.msg || "Failed")
      }
    } catch (err) {
      errorToast()
    }
  }

  // Handle save button => Save mail as file
  const handleSaveMail = (acl, mid) => {
    const shareboxParsedMenu = shareboxHelper?.shareboxParser(menu)
    const strLink = [
      "/email",
      acl,
      mid,
      "?view_mode=orgdown" +
        (shareboxParsedMenu?.isShare ? "&shareid=" + shareboxParsedMenu?.shareid : ""),
    ].join("/")
    const url = window.location.protocol + "//" + window.location.hostname + strLink
    const win = window.open(url, "_blank")
    win.focus()
  }

  // Handle report spam button => Move to spam
  const handleReportSpam = async (acl, mid) => {
    try {
      const params = {
        boxid: acl,
        mids: mid,
        mode: "spam",
      }
      const res = await emailPost(URL_EMAIL_SPAM, formDataUrlencoded(params), Headers)
      if (res.success) {
        successToast()
        navigate(["/mail/list", menu].join("/"))
      }
    } catch (err) {
      errorToast()
    }
  }

  // Handle not spam button => Move to inbox
  const handleNotSpam = async (acl, mid) => {
    try {
      const params = {
        boxid: acl,
        mids: mid,
        mode: "nospam",
      }
      const res = await emailPost(URL_EMAIL_SPAM, formDataUrlencoded(params), Headers)
      if (res.success) {
        successToast()
        navigate(["/mail/list", menu].join("/"))
      }
    } catch (err) {
      errorToast()
    }
  }

  // Handle Flag of Draft Mail
  const handleFlag = async (type, acl, mid) => {
    setImportant({ ...important, loading: true })
    try {
      const params = {
        acl: acl,
        act: "mailsigupdate",
        mode: type === "add" ? "mailtosig" : "sigtomail",
        mid: mid,
      }
      const res = await postMailToHtml5(params)
      if (res.success === "1") {
        setImportant({ ...important, loading: false })
        successToast()
        navigate(["/mail/list", menu].join("/"))
      }
    } catch (err) {
      errorToast()
      setImportant({ ...important, loading: false })
    }
  }

  // Handle delete button => Move to trash
  const handleDeleteMail = async (acl, mid) => {
    try {
      const params = {
        acl: acl,
        mid: mid,
      }
      const res = await postDeleteMail(params)
      if (res.success === "1") {
        successToast()
        if (isSplitMode) {
          dispatch(setRefreshList(true))
        }
        if (location.pathname.includes("clone-writer")) {
          window.close()
        } else {
          navigate(["/mail/list", menu].join("/"))
        }
      } else {
        errorToast()
      }
    } catch (err) {
      errorToast()
    }
  }

  const handleMove = (type) => {
    setOpenMoveData({ open: true, type: type })
  }

  const handleImmediateSending = async () => {
    const url = "email/isent"
    const params = {
      mid,
    }
    const res = await emailPost(url, params, Headers)
    if (res?.success) {
      successToast()
      setMail((prev) => ({ ...prev, isent: false }))
    } else {
      errorToast()
    }
  }

  const handleCancelSendLater = async () => {
    const res = await emailDelete(`email/etc/sendlater?t=${mid}`)
    if (res && res.success) {
      successToast()
      getMail()
    } else {
      errorToast()
    }
  }

  // Handle change Editor value
  const handleChangeEditor = (value, contents, setContents, replace = true, format = "raw") => {
    let checkInitializedTimer = null
    const activeEditor = tinymce?.activeEditor

    function _setNewContent() {
      const newContent = replace ? value : contents + value
      setContents(newContent)
      activeEditor.setContent(newContent, { format: format })
      activeEditor.focus()
    }

    if (activeEditor?.initialized) {
      _setNewContent()
    } else {
      // wait for the editor initializes before setting content
      checkInitializedTimer = setInterval(() => {
        if (activeEditor?.initialized) {
          _setNewContent()
          clearInterval(checkInitializedTimer)
        }
      }, 500)
    }
  }

  const onClickContent = (event) => {
    if (event.target.classList.contains("open-hbcompose")) {
      var email = event.target.innerText
      handleCompose(email)
    }
  }

  return (
    <MailContext.Provider
      value={{ menu, mid, mail, getMail, getRelatedMail, handleChangeEditor, setMail }}
    >
      <div
        className={`wrapper-detail-page ${
          isMobile ? "d-flex flex-column" : ""
        } h-100 position-relative`}
      >
        {/* show button when scroll */}
        {showButtonFixed && !isMobile && (
          <div
            data-button-scroll
            className="position-absolute w-100 top-0 p-2 pe-4 d-flex justify-content-end z-1"
          >
            <MailDetailButton
              isShareMenu={isShareMenu}
              secretPass={secretPass}
              isSplitMode={isSplitMode}
              handleFlag={handleFlag}
              handleNotSpam={handleNotSpam}
              handleSaveMail={handleSaveMail}
              handleReportSpam={handleReportSpam}
              handleDeleteMail={handleDeleteMail}
              handleMarkAsUnread={handleMarkAsUnread}
              handleMarkAsImportant={handleMarkAsImportant}
              handleActionModal={handleActionModal}
              handleResendModal={handleOpenResendModal}
              handleEditModal={handleOpenEditModal}
              handleReplyModal={handleOpenReplyModal}
              handleReplyAllModal={handleReplyAllModal}
              handleForwardModal={handleForwardModal}
              handleEmlForwardModal={handleEmlForwardModal}
              handleReportHackingMailModal={handleReportHackingMailModal}
              handleShowHeader={handleShowHeader}
              handleShowShareBox={handleShowShareBox}
              handleBlockSender={handleBlockSender}
              handleAddToContactList={handleAddToContactList}
              handleMove={handleMove}
              handleImmediateSending={handleImmediateSending}
              handleCancelSendLater={() => setOpenConfirmModal(true)}
              setAiData={(val) => {
                setAiData({ ...val, data: [{ ...mail, mid: val?.data?.mid }] })
              }}
            />
          </div>
        )}

        {isMobile && (
          <MobileHeader
            isShareMenu={isShareMenu}
            secretPass={secretPass}
            isSplitMode={isSplitMode}
            important={important}
            handleFlag={handleFlag}
            handleNotSpam={handleNotSpam}
            handleSaveMail={handleSaveMail}
            handleReportSpam={handleReportSpam}
            handleDeleteMail={handleDeleteMail}
            handleMarkAsUnread={handleMarkAsUnread}
            handleMarkAsImportant={handleMarkAsImportant}
            handleActionModal={handleActionModal}
            handleResendModal={handleOpenResendModal}
            handleEditModal={handleOpenEditModal}
            handleReplyModal={handleOpenReplyModal}
            handleReplyAllModal={handleReplyAllModal}
            handleForwardModal={handleForwardModal}
            handleEmlForwardModal={handleEmlForwardModal}
            handleReportHackingMailModal={handleReportHackingMailModal}
            handleShowHeader={handleShowHeader}
            handleShowShareBox={handleShowShareBox}
            handleBlockSender={handleBlockSender}
            handleMove={handleMove}
            handleImmediateSending={handleImmediateSending}
            handleCancelSendLater={() => setOpenConfirmModal(true)}
          />
        )}

        <div
          ref={detailPageRef}
          id="mail-detail-page"
          className="h-100 flex-grow-1 overflow-y-auto"
        >
          <div
            className={`border-0 ${
              isMobile || isVerticalTablet ? "px-3 py-3" : "px-2 py-0"
            } d-flex flex-column`}
          >
            {showPassInput ? (
              <div className="row p-2 align-items-center">
                <div className="col-lg-3 col-12 d-flex justify-content-end">
                  <span>{t("common.main_user_passwd")}</span>
                </div>

                <div className="col-lg-6 col-12">
                  <div className="d-flex align-items-center">
                    <Input
                      type="password"
                      value={secretPass}
                      onChange={(e) => setSecretPass(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.keyCode === 13 || e.code === "Enter") {
                          getMail()
                        }
                      }}
                    />
                    <BaseButton
                      color={"primary"}
                      icon={"bx bx-check"}
                      loading={isLoading}
                      disabled={!secretPass.trim()}
                      className={"btn-primary ms-3"}
                      onClick={getMail}
                    >
                      {t("common.common_confirm")}
                    </BaseButton>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {isLoading && (
                  <div className="position-absolute w-100 h-100 d-flex justify-content-center align-items-center">
                    <Loading />
                  </div>
                )}

                {!isEmpty(mail) && (
                  <>
                    {/* --- Header Detail --- */}
                    <HeaderDetail
                      isShareMenu={isShareMenu}
                      important={important}
                      secretPass={secretPass}
                      handleFlag={handleFlag}
                      handleNotSpam={handleNotSpam}
                      handleSaveMail={handleSaveMail}
                      handleReportSpam={handleReportSpam}
                      handleDeleteMail={handleDeleteMail}
                      handleMarkAsUnread={handleMarkAsUnread}
                      handleMarkAsImportant={handleMarkAsImportant}
                      handleActionModal={handleActionModal}
                      handleResendModal={handleOpenResendModal}
                      handleEditModal={handleOpenEditModal}
                      handleReplyModal={handleOpenReplyModal}
                      handleReplyAllModal={handleReplyAllModal}
                      handleForwardModal={handleForwardModal}
                      handleEmlForwardModal={handleEmlForwardModal}
                      handleReportHackingMailModal={handleReportHackingMailModal}
                      handleShowHeader={handleShowHeader}
                      handleShowShareBox={handleShowShareBox}
                      handleBlockSender={handleBlockSender}
                      handleAddToContactList={handleAddToContactList}
                      handleMove={handleMove}
                      isSplitMode={isSplitMode}
                      handleImmediateSending={handleImmediateSending}
                      handleCancelSendLater={() => setOpenConfirmModal(true)}
                      setAiData={(val) => {
                        setAiData({ ...val, data: [{ ...mail, mid: val?.data?.mid }] })
                      }}
                    />

                    {/* Warning for Spam Mail */}
                    {menu === "Spam" && (
                      <Alert
                        color="error"
                        className="d-flex align-items-center gap-2 font-size-13 w-100"
                      >
                        <i className="mdi mdi-cancel"></i>
                        {/* This is a spam mail - It seems dangerous! */}
                        {t("mail.mail_security_usemanagerdb_msg_false")}
                      </Alert>
                    )}

                    {/* Warning for security */}
                    {menu !== "Spam" && (
                      <SecurityMsg securityInfo={mail?.security_info} isSplitMode={isSplitMode} />
                    )}

                    {/* Mail Infomation */}
                    <MailInfo
                      addressDropdownAction={{
                        onComposeTo: handleCompose,
                        onSearchAddress: handleSearchAddress,
                        onAddContact: setAddContactData,
                        onBlockAddress: setBlockAddressData,
                        onAutoSortMailtoFolder: ({ open, data }) =>
                          setSortMailData({
                            open,
                            data: {
                              from_addr: data,
                              to_addr: mail?.myeamil !== data ? mail?.myeamil : "",
                              subject: mail.subject,
                            },
                          }),
                      }}
                    />

                    {isSplitMode && (
                      <MailDetailButton
                        isShareMenu={isShareMenu}
                        secretPass={secretPass}
                        isSplitMode={isSplitMode}
                        handleFlag={handleFlag}
                        handleNotSpam={handleNotSpam}
                        handleSaveMail={handleSaveMail}
                        handleReportSpam={handleReportSpam}
                        handleDeleteMail={handleDeleteMail}
                        handleMarkAsUnread={handleMarkAsUnread}
                        handleMarkAsImportant={handleMarkAsImportant}
                        handleActionModal={handleActionModal}
                        handleResendModal={handleOpenResendModal}
                        handleEditModal={handleOpenEditModal}
                        handleReplyModal={handleOpenReplyModal}
                        handleReplyAllModal={handleReplyAllModal}
                        handleForwardModal={handleForwardModal}
                        handleEmlForwardModal={handleEmlForwardModal}
                        handleReportHackingMailModal={handleReportHackingMailModal}
                        handleShowHeader={handleShowHeader}
                        handleShowShareBox={handleShowShareBox}
                        handleBlockSender={handleBlockSender}
                        handleMove={handleMove}
                        handleAddToContactList={handleAddToContactList}
                        handleImmediateSending={handleImmediateSending}
                        handleCancelSendLater={() => setOpenConfirmModal(true)}
                        setAiData={(val) => {
                          setAiData({ ...val, data: [{ ...mail, mid: val?.data?.mid }] })
                        }}
                      />
                    )}

                    <div
                      className={`d-flex flex-column flex-grow-1 ${isSplitMode ? "pb-3" : ""}`}
                      ref={divRef}
                      onScroll={handleScroll}
                    >
                      {/* Approval Information */}
                      {mail?.isapproval && <ApprovalInformation />}
                      {/* Sent Mail => Receipts && Cancellation */}
                      {menu === "Sent" && (
                        <SentMail
                          handleActionModal={handleActionModal}
                          isHideButtonText={isChangeAttView}
                        />
                      )}
                      {/* Attachment File with Grid mode */}
                      {mail?.file?.length > 0 && (
                        <AttachmentMail
                          gridMode={true}
                          isOpen={true}
                          securePassword={secretPass}
                          isChangeAttView={isChangeAttView}
                          onPreviewHandle={onPreviewHandle}
                          handleActionModal={handleActionModal}
                        />
                      )}
                      {/* --- Content --- */}
                      <div className="content-view-body">
                        <div className="wrapper-mail-content">
                          <div
                            ref={contentRef}
                            className={`mail-content text-muted my-4 ${
                              isMailError && "han-email-error"
                            } ${mail?.contents?.includes('border="1"') && "table-view-mail"}`}
                            dangerouslySetInnerHTML={{ __html: mail?.contents }}
                            onClick={onClickContent}
                          />
                        </div>
                      </div>
                      {/* Attachment File with List mode */}
                      {mail?.file?.length > 0 && (
                        <AttachmentMail
                          onPreviewHandle={onPreviewHandle}
                          gridMode={false}
                          isOpen={true}
                          securePassword={secretPass}
                          handleActionModal={handleActionModal}
                        />
                      )}
                      {/* Related Email */}
                      {isShowRelatedMail && (
                        <RelatedMail
                          data={groupMailList ?? {}}
                          isHideSizeColumn={isChangeAttView}
                        />
                      )}
                      {enableCloudDisk && mail?.cloudlist?.length > 0 && (
                        <CloudAttachment mail={mail} />
                      )}

                      {/* Cipher Information */}
                      {cipherInfo.isShow && (
                        <CipherInformation
                          dataCipher={cipherInfo.data}
                          dataRelatedMail={groupMailList}
                        />
                      )}
                      {/* --- Footer Detail --- */}
                      {!isSecureMenu && !isReceiptsMenu && (
                        <FooterDetail
                          handleReplyModal={handleOpenReplyModal}
                          handleReplyAllModal={handleReplyAllModal}
                          handleForwardModal={handleForwardModal}
                        />
                      )}
                      {isScroll && (
                        <BaseButtonTooltip
                          title={t("mail.mail_signature_top")}
                          id="go-to-top-button"
                          className="btn-to-top border-0 bg-transparent text-muted py-1 px-2"
                          iconClassName="me-0 fs-1"
                          icon="mdi mdi-arrow-up-bold-circle"
                          onClick={scrollToTop}
                        />
                      )}
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          {/* Show Header */}
          {isShowHeader.isShow && (
            // Header or Original
            <HeaderInformation
              mode={isShowHeader.mode}
              acl={mail?.acl}
              mid={mid}
              menu={menu}
              isShareMenu={isShareMenu}
              handleClose={handleCloseShowHeader}
            />
          )}

          {/* Copy to Share Box */}
          {isShowShareBox && (
            <ShareBox acl={mail?.acl} mid={mid} handleClose={handleCloseShareBox} />
          )}

          {/* Block Sender(s) */}
          {isShowBlockSender && <BlockSenders handleClose={handleBlockSender} />}

          {/* Add to Contact List */}
          {isShowAddToContactList && <AddContact handleClose={handleAddToContactList} />}

          {/* Action Modal */}
          <Dialog {...actionModal} />

          {/* Resend Modal */}
          {/* {resendData.open && (
            <ComposeMail
              titleCompose="mail.mail_view_resend"
              handleClose={handleCloseComposeMail}
              mid={mid}
              modeType="resend"
              shareId={resendData.shareId}
            />
          )} */}

          {/* Edit Modal */}
          {/* {edit && (
            <ComposeMail
              titleCompose="mail.mail_set_mailbox_modify"
              handleClose={handleCloseComposeMail}
              mid={mid}
              modeType="edit"
            />
          )} */}

          {/* Reply Modal */}
          {/* {reply && (
            <ComposeMail
              titleCompose="mail.mail_view_reply"
              handleClose={handleCloseComposeMail}
              mid={mid}
              modeType="reply"
            />
          )} */}

          {/* Reply All Modal */}
          {/* {replyAll && (
            <ComposeMail
              titleCompose="mail.mail_view_allreply"
              handleClose={handleCloseComposeMail}
              mid={mid}
              modeType="allreply"
            />
          )} */}

          {/* Forward Modal */}
          {/* {forward && (
            <ComposeMail
              titleCompose={emlForward ? "mail.mail_eml_forward" : "common.mail_view_forward"}
              handleClose={handleCloseComposeMail}
              mid={mid}
              uuids={emlForward ? uuids : undefined}
              modeType="forward"
            />
          )} */}

          {/* Report Hacking Mail Modal */}
          {/* {reportHackingMail && (
            <ComposeMail
              titleCompose="mail.mail_hacking_report"
              handleClose={handleCloseReportHackingMailModal}
              mid={mid}
              modeType="hacking"
              uuids={mail?.timeuuid}
            />
          )} */}

          {/* Preview file modal */}
          <FilePreview
            {...previewFile}
            handleClose={() => {
              setPreviewFile({ isOpen: false })
            }}
          />

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
            />
          )}
          {/* {openComposeModal && <ComposeMail {...composeProps} />} */}
          {openMoveData.open && (
            <ModalMove
              mid={mid}
              mail={mail}
              menuKey={menu}
              keyHeader={openMoveData.type !== "move" ? "common.action_copy" : undefined}
              type={openMoveData.type}
              isOpen={openMoveData.open}
              toggle={() => setOpenMoveData((prev) => ({ ...prev, open: false }))}
            />
          )}
          {openConfirmModal && (
            <ModalConfirm
              // loading={loading}
              isOpen={openConfirmModal}
              toggle={() => setOpenConfirmModal(false)}
              onClick={() => {
                handleCancelSendLater()
                setOpenConfirmModal(false)
              }}
              keyHeader={"common.whisper_cancel_sending"}
              keyBody={"common.whisper_are_you_sure"}
            />
          )}

          {/* AI modal */}
          {aiData.open && aiData.type === "translate" && (
            <TranslateModal
              open={aiData.open}
              aiData={aiData}
              mail={mail}
              onClose={() => {
                setAiData({ open: false, type: "", data: [] })
              }}
            />
          )}
          {aiData.open && aiData.type === "summary" && (
            <SummaryModal
              open={aiData.open}
              aiData={aiData}
              mail={mail}
              onClose={() => {
                setAiData({ open: false, type: "", data: [] })
              }}
            />
          )}
        </div>
      </div>
    </MailContext.Provider>
  )
}

export default Detail
