// @ts-nocheck
// React
import { createContext, useEffect, useMemo, useRef, useState } from "react"

// API
import { setPreviewMode, writeEmail } from "modules/mail/compose/api"
import { EMAIL_RECENT_LIST, EMAIL_SMTP, MAIL_COMPOSE_SENT_LIMIT } from "modules/mail/compose/urls"

// Third-party
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"

import ComposeCenter from "components/Common/ComposeMail/ComposeCenter"
import ComposeOrg from "components/Common/ComposeMail/ComposeOrg"
import ComposePreviewModal from "components/Common/ComposeMail/ComposePreviewModal"

// Project
import { emailGet } from "helpers/email_api_helper"
import { useCustomToast } from "hooks/useCustomToast"
import { closeOrgModal } from "store/composeMail/actions"
import { formatDateTime, formatEmailTo } from "utils"
import ComposeReservation from "./ComposeReservation"

import { isEmpty } from "lodash"
import moment from "moment"
import { updateSignature } from "./ComposeComponent/Body/ComposeOptions/Signature/utils"
import { decodeHtmlEntities, onGetUniqueArray } from "./utils"
import queryString from "query-string"
import { validateStrictEmailFinal } from "utils"

// Preview Mode: a | f | n
const DEFAULT_SENDING_OPTIONS = {
  saveInSendbox: true,
  sendAsImportant: false,
  sendIndividual: false,
  immediateSending: false,
  previewMode: "",
}

const DEFAULT_APPROVAL_OPTIONS = {
  name: "",
  etype: "",
  id: "",
  value: "",
  label: "",
}

export const ComposeContext = createContext({
  subject: "",
  fromValue: "",
  toValue: [],
  ccValue: [],
  bccValue: [],
  editorValue: "",
  onComposeMail: () => null,
  onClickPreview: () => null,
  isSending: false,
  sendingOptions: { ...DEFAULT_SENDING_OPTIONS },
  handleChangeSendingOptions: (option, value) => null,
  onClickSaveDraft: () => null,
  enableCipher: false,
  cpassword: "",
  cpasswordHint: "",
  secuOpenLimit: "",
  secuDayLimit: "",
  isPassGuide: false,
  isSecu2r: false,
  handleChangeCipher: (field = "", value = "") => null,
  handleChangeEditor: (value = "", replace = true) => null,
  attachmentRef: null,
  isShowImmediateSending: false,
  extensionNotAllowStr: [],
  errors: {},
})

export const shareboxHelper = {
  isSharebox: (id) => {
    return id?.indexOf("Share") !== -1
  },
  getSharebox: (id) => {
    const idArr = id?.split("_")
    return idArr[idArr?.length - 1]
  },
  shareboxParser: function (id) {
    return {
      isShare: this?.isSharebox(id),
      sharebox: this?.getSharebox(id),
      shareid: id,
    }
  },
}

const ComposeMail = ({
  isOpen,
  composeId,
  composeMode = "",
  titleCompose = "mail.mail_menu_write",
  handleClose,
  mid = "",
  modeType = "",
  uuids = "",
  toAddress,
  selectedMails,
  listMail,
  shareId = "",
  isNewWindow = false, // true: open in new window, false: open in same window
}) => {
  const { t } = useTranslation()
  const { errorToast, successToast } = useCustomToast()
  const dispatch = useDispatch()
  const urlParams = useParams()
  const navigate = useNavigate()
  const composeRef = useRef(null)

  const isShareMail = queryString.parse(location.search)?.shareid || ""
  const currentMenu = useMemo(() => {
    if (isShareMail) {
      return isShareMail
    } else {
      return urlParams?.menu ? urlParams.menu : "Sent"
    }
  }, [urlParams, isShareMail])

  const isShareMenu = currentMenu?.indexOf("HBShare_") === 0 || isShareMail ? true : false
  const showOrgModal = useSelector((state) => state.ComposeMail.showOrgModal)

  const [isLoading, setIsLoading] = useState(false)
  const attachmentRef = useRef(null)
  const previewRef = useRef(null)

  const [attachmentFiles, setAttachmentFiles] = useState({})
  const [showReservation, setShowReservation] = useState(false)
  const [showPreview, setShowPreview] = useState(false)

  const myEmailGlobal = useSelector((state) => state.Config.userConfig.user_data.email) // email data from state redux
  const fromValueRef = useRef(null)
  const [fromValue, setFromValue] = useState({
    label: "",
    value: "",
  })
  const [optionFrom, setOptionFrom] = useState([
    {
      label: "",
      value: "",
    },
  ])
  const [toValue, setToValue] = useState(toAddress ? toAddress : null)
  const [checkedValue, setCheckedValue] = useState(false)
  const [optionTo, setOptionTo] = useState([
    {
      label: "",
      value: "",
    },
  ])
  const [editorValue, setEditorValue] = useState("")
  const [editorValueHtml, setEditorValueHtml] = useState({
    mode: "",
    value: "",
  })
  const [signature, setSignature] = useState("")
  const [isInitSuccess, setIsInitSuccess] = useState(false)
  const [pageTotal, setPageTotal] = useState(1)
  const [pageCurrent, setPageCurrent] = useState(1)
  const [ccValue, setCcValue] = useState(null)
  const [bccValue, setBccValue] = useState(null)
  const [subject, setSubject] = useState("")
  const [securePassword, setSecurePassword] = useState("")
  const [selectApproval, setSelectApproval] = useState({
    ...DEFAULT_APPROVAL_OPTIONS,
  })
  const [optionsApproval, setOptionsApproval] = useState([{ ...DEFAULT_APPROVAL_OPTIONS }])
  const [finalApproval, setFinalApproval] = useState({})
  const [midApproval, setMidApproval] = useState({})
  const [mapprover, setMapprover] = useState({
    showInputList: "",
    mapprover: "",
  })
  const [isSending, setIsSending] = useState(false)
  const [sendingOptions, setSendingOptions] = useState({
    ...DEFAULT_SENDING_OPTIONS,
  })
  const [mailPreview, setMailPreview] = useState()
  const [sendDate, setSendDate] = useState()
  const [timezone, setTimezone] = useState()
  const [delayDays, setDelayDays] = useState()
  const [enableCipher, setEnableCipher] = useState(false)
  const [cpassword, setCPassword] = useState("")
  const [cpasswordHint, setCPasswordHint] = useState("")
  const [secuOpenLimit, setSecuOpenLimit] = useState(0)
  const [secuDayLimit, setSecuDayLimit] = useState(0)
  const [isPassGuide, setIsPassGuide] = useState(false)
  const [isSecu2r, setIsSecu2r] = useState(false)
  const [fileForward, setFileForward] = useState([])
  const [isShowImmediateSending, setIsShowImmediateSending] = useState(false)
  const [emails, setEmails] = useState([])
  const [extensionNotAllowStr, setExtensionNotAllowStr] = useState([])
  const [attachOptions, setAttachOptions] = useState(false)
  const [isShowEditorToolbar, setIsShowEditorToolbar] = useState(true)
  const [errors, setErrors] = useState({
    to: [],
    cc: [],
    bcc: [],
  })

  // Fetch Data Sender
  const getDataFrom = async () => {
    setIsLoading(true)
    try {
      const res = await emailGet(EMAIL_SMTP)
      setFromValue({
        label: res?.default,
        value: res?.default,
      })
      const newValueOption = [res?.default]
      fromValueRef.current = {
        label: myEmailGlobal, // email data from state redux
        value: myEmailGlobal, // email data from state redux
      }
      res?.data?.forEach((item) => newValueOption.push(item))
      if (newValueOption?.length > 0) {
        const newOptions = newValueOption.map((item) => ({
          label: item,
          value: item,
        }))
        setOptionFrom(newOptions)
      }

      if (res?.isdelay) {
        setIsShowImmediateSending(res?.isdelay)
      }

      setSendingOptions((prev) => ({
        ...prev,
        previewMode: res?.previewmode || "",
      }))

      setFinalApproval(res?.permitinfo)
      if (res?.permitinfo?.managerids.length !== 0) {
        let flag = 0 // Flag to check if selectApproval is DEFAULT_APPROVAL_OPTIONS or not
        const newOptionsApproval = res?.permitinfo?.managerids.map((item) => {
          let showName = item?.groupname != "" ? item?.groupname + " / " : ""
          showName += item?.posname != "" ? item?.posname + " / " : ""
          showName += item?.name + " (" + item?.id + ")" + " / " + item?.etype

          if (res?.permitinfo?.defaultid === item?.id) {
            flag = 1
            setSelectApproval({
              ...item, // Using item because it includes name, etype, id and others
              label: showName,
              value: showName,
            })

            handleChangeMidApprover({
              ...item, // Using item because it includes name, etype, id and others
              label: showName,
              value: showName,
            })
          }

          return {
            // name: item?.name,
            // etype: item?.etype,
            // id: item?.id,
            ...item, // Using item because it includes name, etype, id and others
            label: showName,
            value: showName,
          }
        })
        // setSelectApproval(newOptionsApproval[0])
        setOptionsApproval(
          flag === 0 // Check if selectApproval is DEFAULT_APPROVAL_OPTIONS or not
            ? [...optionsApproval, ...newOptionsApproval]
            : [...newOptionsApproval],
        )
      }

      setIsLoading(false)
    } catch (err) {
      errorToast()
      setIsLoading(false)
    }
  }

  // Fetch Data Recipient
  const getDataTo = async (pageCurrent) => {
    try {
      const url = [EMAIL_RECENT_LIST, pageCurrent, 15].join("/")
      const res = await emailGet(url)
      setPageTotal(res?.totpage)
      if (res?.row) {
        const newOptions = res?.row.map((item) => ({
          label: item,
          value: item,
        }))
        optionTo[0].label === ""
          ? setOptionTo(newOptions)
          : setOptionTo(optionTo.concat(newOptions))
      }
    } catch (err) {
      errorToast()
    }
  }

  // Fetch Data (Sender + Recipient + Subject + Editor Value) with mode: Reply + Reply All + Forward
  const getMailNotWrite = async (mid, mode) => {
    try {
      let res = {}
      if (mode === "edit" || mode === "resend") {
        res = await emailGet(
          ["email", mode === "resend" && shareId ? "Sent" : currentMenu, mid].join("/"),
          { shareid: shareId ? shareId : undefined },
        )
      } else if (mode === "hacking") {
        res = await emailGet(["email", currentMenu, uuids].join("/"), {
          view_mode: mode,
          uuids: uuids,
        })
      } else if (mode === "forward" || mode === "eml-forward") {
        const menuArr = currentMenu.split("_")
        const nMenu = isShareMenu ? menuArr[menuArr.length - 1] : currentMenu
        const params = {
          view_mode: "forward",
          uuids: !isEmpty(uuids) ? (uuids.length > 1 ? uuids?.join(",") : uuids[0]) : undefined,
          shareid: isShareMenu ? currentMenu : undefined,
        }
        res = await emailGet(
          [
            "email",
            nMenu,
            !isEmpty(uuids) ? (uuids.length > 1 ? uuids?.join(",") : uuids[0]) : mid,
          ].join("/"),
          params,
        )
      } else {
        const menuArr = currentMenu.split("_")
        const nMenu = isShareMenu ? menuArr[menuArr.length - 1] : currentMenu
        res = await emailGet(["email", nMenu, mid].join("/"), {
          view_mode: mode,
          shareid: isShareMenu ? currentMenu : undefined,
        })
      }

      if (!isEmpty(res) && !res?.mailview) {
        errorToast(res?.msg || "Failed")
        handleClose()
      } else {
        // From value -> Use default value
        const initSendData = res.mailview[0]

        // To value
        // Handle To value array
        const handleToValue = (toValueArr, callback) => {
          if (toValueArr?.length > 0) {
            const newValueArr = []
            toValueArr.forEach((value) => {
              const {
                emailRegex: emailToRegex,
                checkEmailTo,
                emailToArr,
                emailToFormat,
                emailTo,
              } = formatEmailTo(value)
              if (emailToRegex) {
                // emailToRegex has format: &lt;mss@eosec.co.kr&gt; || &lt;lamvt22@global.hanbiro.com&gt;
                let newEmailToRegex = emailToRegex
                if (emailToRegex?.includes("&lt;") && emailToRegex?.includes("&gt;")) {
                  newEmailToRegex = emailToRegex?.replace(/&lt;/g, "<")?.replace(/&gt;/g, ">")
                }
                newValueArr.push({
                  label: newEmailToRegex,
                  value: newEmailToRegex,
                })
              } else if (checkEmailTo) {
                const newOptions = emailToArr.map((item) => ({
                  label: item,
                  value: item,
                }))
                newValueArr.push(...newOptions)
              } else if (emailToFormat) {
                newValueArr.push({ label: emailToFormat, value: emailToFormat })
              } else if (emailTo) {
                newValueArr.push({ label: emailTo, value: emailTo })
              }
            })
            if (newValueArr.length > 0) {
              // Remove duplicate value
              const newUniqueArr = onGetUniqueArray(newValueArr)
              // const newUniqueArr = newValueArr.filter(item => {
              //   // Check if the item does not include any other item in the array
              //   return newValueArr.every(otherItem => {
              //     // Skip checking against itself
              //     if (item?.value === otherItem?.value) return true
              //     // Return false if the item includes any other item
              //     return !otherItem?.value.includes(item?.value)
              //   })
              // })
              callback(newUniqueArr)
            }
          }
        }
        // Array to store To value
        let toValueArr = []
        if (mode === "edit" || mode === "resend") {
          // edit (Draft mail) or resend (Sent mail)
          toValueArr = res?.mailview[0]?.to?.split(",")
          handleToValue(toValueArr, setToValue)
          setFileForward(res?.mailview[0]?.file)
        } else if (mode === "hacking") {
          // report hacking mail
          toValueArr = res?.mailview[0]?.toaddr?.split(",")
          handleToValue(toValueArr, setToValue)
        } else if (mode === "forward" || mode === "eml-forward") {
          // forward
          setToValue(null)
          if (res?.mailview[0]?.file && res?.mailview[0]?.file?.length > 0) {
            setFileForward(res?.mailview[0]?.file)
          }
        } else {
          // reply + reply all
          toValueArr = res?.mailview[0]?.from?.split(",")
          handleToValue(toValueArr, setToValue)
          setFileForward([])
        }

        if (Array.isArray(res?.mailview?.[0]?.emls) && res?.mailview?.[0]?.emls?.length > 0) {
          setEmails(res?.mailview?.[0]?.emls)
        } else {
          setEmails([])
        }

        // sending options
        setSendingOptions((prev) => ({
          ...prev,
          sendAsImportant: initSendData.isimportant,
        }))

        // Cc value
        // Array to store CC value
        let ccValueArr = []
        if (mode === "edit" || mode === "resend" || mode === "allreply") {
          // edit (Draft mail)
          ccValueArr = res?.mailview[0]?.cc?.split(",")
          handleToValue(ccValueArr, setCcValue)
        } else {
          setCcValue(null)
        }

        // Bcc value
        // Array to store To value
        let bccValueArr = []
        if (mode === "edit" || mode === "resend" || mode === "allreply") {
          // edit (Draft mail)
          bccValueArr = res?.mailview[0]?.bcc?.split(",")
          handleToValue(bccValueArr, setBccValue)
        } else {
          setBccValue(null)
        }

        // Subject value
        setSubject(decodeHtmlEntities(res?.mailview[0]?.subject))

        // Editor value
        if (res?.mailview[0]) {
          let newContent = res?.mailview[0]?.contents || ""
          handleChangeEditor(newContent, false, undefined, handleInitSuccess)
          setEditorValueHtml({ mode: mode, value: newContent })
        }
      }
    } catch (err) {
      console.log("err:", err)
      errorToast()
    }
  }

  const handleInitSuccess = () => {
    setIsInitSuccess(true)
  }

  // get sent limit data
  const getSentLimitData = async () => {
    try {
      const res = await emailGet(MAIL_COMPOSE_SENT_LIMIT)
      if (res?.success) {
        if (res?.hasOwnProperty("issplit") && res?.issplit === "y") {
          setSendingOptions((prev) => ({ ...prev, sendIndividual: true }))
        }
        if (res?.hasOwnProperty("file_list") && !isEmpty(res?.file_list)) {
          setExtensionNotAllowStr(res.file_list)
        }
      } else {
        errorToast(res?.msg)
      }
    } catch (error) {
      errorToast()
    }
  }

  useEffect(() => {
    // Fetch Data Sender
    getDataFrom()
    getSentLimitData()
  }, [])

  useEffect(() => {
    // Fetch Data (Sender + Recipient + Subject + Editor Value) with mode: Reply + Reply All + Forward
    if (mid !== "" && modeType !== "") getMailNotWrite(mid, modeType)
  }, [mid, modeType, uuids])

  useEffect(() => {
    // Fetch Data Recipient
    getDataTo(pageCurrent)
  }, [pageCurrent])

  // signature
  useEffect(() => {
    if (signature) {
      const newContent = updateSignature(editorValue, signature, editorValueHtml?.mode)
      handleChangeEditor(newContent, true, undefined, undefined, "html")
    }
  }, [signature])

  // Handle scroll menu select
  const handlePageCurrent = () => {
    if (pageCurrent < pageTotal) {
      setPageCurrent(pageCurrent + 1)
    }
  }

  // Handle change value From
  const handleChangeFrom = (value) => setFromValue(value)

  // Handle format array value: To, Cc, Bcc
  const formatEmailArray = (values) => {
    const formatEmail = values?.map((item, index) => {
      const emailRegex = /<([^>]+)>/
      const match = emailRegex.exec(item?.label)
      const newEmail = match ? match[1] : item?.label
      return {
        label: newEmail,
        value: newEmail,
        index: index,
      }
    })
    const newToValue = formatEmail
      ?.map((value, index, arr) => {
        const foundIndex = arr?.findIndex((item) => item?.label === value?.label)
        return foundIndex === index ? value : null
      })
      ?.filter((item) => item !== null && item !== undefined)
    const finalValue = values?.filter(
      (value, index) => newToValue?.findIndex((item) => item?.index === index) !== -1,
    )
    return finalValue
  }

  // Handle change value To
  const handleChangeTo = (values) => {
    if (values?.length === 0) setCheckedValue(false)
    if (values?.[0]?.label !== fromValueRef.current?.label) setCheckedValue(false)
    const newValues = formatEmailArray(values)
    setToValue(newValues)
  }

  // Handle Checkbox Include 'From' address (Send to myself)
  const handleCheckboxToValue = (event) => {
    if (event.target.checked) {
      setCheckedValue(true)
      setToValue([fromValueRef.current])
    } else {
      setCheckedValue(false)
      const newToValue = toValue?.filter((item) => item.value !== fromValueRef.current.value)
      setToValue(newToValue)
    }
  }

  // Handle change value CC
  const handleChangeCc = (values) => {
    const newValues = formatEmailArray(values)
    setCcValue(newValues)
  }

  // Handle change value BCC
  const handleChangeBcc = (values) => {
    const newValues = formatEmailArray(values)
    setBccValue(newValues)
  }

  /**
   * @description Handle Change Organization Modal => Common
   * */
  const handleChangeOrg = (value) => {
    // To
    const toValueOrg = Object.keys(value?.to).map((item) => ({
      label: item,
      value: item,
    }))
    const findFromValue = toValueOrg.find((item) => item.value === fromValueRef.current.value)
    if (toValueOrg.length === 0 || !findFromValue) {
      setCheckedValue(false) // If toValue is empty || not found fromValue in toValue, set checkedValue = false
    }
    setToValue(toValueOrg)

    // Cc
    const ccValueOrg = Object.keys(value?.cc).map((item) => ({
      label: item,
      value: item,
    }))
    setCcValue(ccValueOrg)

    // Bcc
    const bccValueOrg = Object.keys(value?.bcc).map((item) => ({
      label: item,
      value: item,
    }))
    setBccValue(bccValueOrg)
  }

  // Handle change Subject value
  const handleChangeSubject = (event) => setSubject(event.target.value)

  // Handle change Selection of approval value
  const handleChangeSelectApproval = (value) => {
    setSelectApproval(value)
    handleChangeMidApprover(value)
  }

  const handleChangeMidApproval = (value) => {
    setMidApproval(value)
  }

  // Handle change Mid-approver value
  const handleChangeMidApprover = (selectApproval) => {
    let newMapprover = ""
    let showInputList = ""
    if (selectApproval?.mmanager && Object.keys(selectApproval?.mmanager)?.length !== 0) {
      // Map to get data
      selectApproval?.mmanager?.mlist?.map((data, index) => {
        let showName = data?.groupname ? data?.groupname + " / " : ""
        showName += data?.posname ? data?.posname + " / " : ""
        showName += data?.name + " (" + data?.id + ")"

        showInputList += showName
        newMapprover += data?.id

        if (index < selectApproval?.mmanager?.mlist?.length - 1) {
          showInputList += "\n"
          newMapprover += ","
        }
      })
    }
    setMapprover({
      showInputList: showInputList,
      mapprover: newMapprover,
    })
  }

  // Handle change Editor value
  const handleChangeEditor = (value, replace = true, contentType, callback, format = "raw") => {
    let checkInitializedTimer = null
    const activeEditor = tinymce?.activeEditor

    function _setNewContent() {
      const newContent = replace
        ? value
        : contentType === "form"
        ? value + editorValue
        : editorValue + value
      setEditorValue(newContent)
      activeEditor.setContent(newContent, format === "raw" ? { format: format } : undefined)
      // activeEditor.focus()
      callback && callback()
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

  const handleDeleteFileForward = (file) => {
    const newFileForward = fileForward.filter((item) => item !== file)
    setFileForward(newFileForward)
  }

  const handleChangeSendingOptions = (option, value) => {
    setSendingOptions({
      ...sendingOptions,
      [option]: value,
    })

    if (option === "previewMode") {
      setPreviewMode(value).then((res) => {})
    }
  }

  const checkFormatEmails = (data, errors, field) => {
    data.map((item) => {
      let valid = validateStrictEmailFinal(item.value)
      if (!valid) {
        errors[field].push(item.value)
      }
    })
  }

  const handleChangeCipher = (field, value) => {
    if (field === "password") setCPassword(value)
    if (field === "passwordHint") setCPasswordHint(value)
    if (field === "openLimit") setSecuOpenLimit(value)
    if (field === "dayLimit") setSecuDayLimit(value)

    if (field === "enableCipher") setEnableCipher(!enableCipher)
    if (field === "passGuide") setIsPassGuide(value)
    if (field === "secu2r") setIsSecu2r(value)
  }

  // caller = "preview" | "saveDraft"
  const onComposeMail = async (caller = "") => {
    let newErrors = {
      to: [],
      cc: [],
      bcc: [],
    }
    checkFormatEmails(toValue, newErrors, "to")
    checkFormatEmails(bccValue, newErrors, "bcc")
    checkFormatEmails(ccValue, newErrors, "cc")
    setErrors(newErrors)

    if (caller !== "preview" && caller !== "saveDraft") {
      if (subject.trim() === "") {
        errorToast(t("mail.mail_mobile_subjecterr"))
        return
      }
      if (toValue?.length === 0 || toValue === null) {
        errorToast(t("mail.mail_mobile_mailerr"))
        return
      }
    }

    if (newErrors?.to?.length > 0 || newErrors?.cc?.length > 0 || newErrors?.bcc?.length > 0) {
      return
    }

    setIsSending(true)

    let params = {
      mode: modeType
        ? modeType === "edit" || modeType === "resend"
          ? "resend"
          : modeType === "hacking" || modeType === "forward"
          ? "forward"
          : modeType
        : "write",
      mailid: mid ? (modeType === "hacking" ? uuids : mid) : "",
      fromaddr: fromValue.value,
      toaddr: Array.isArray(toValue) ? toValue.map((_v) => _v.value).join(",") : "",
      bccaddr: Array.isArray(bccValue) ? bccValue.map((_v) => _v.value).join(",") : "",
      ccaddr: Array.isArray(ccValue) ? ccValue.map((_v) => _v.value).join(",") : "",
      issave: "n",
      issplit: "n",
      subject: subject,
      senddate: "",
      issecu: currentMenu === "Secure" ? "y" : "n",
      secupass: currentMenu === "Secure" ? securePassword : "",
      upfiles: "",
      todraft: "n",
      issimple: "n",
      isorgmail: "y",
      siginfo: "",
      siglocation: "t",
      contents: editorValue,
    }

    // check delay mail
    if (isShowImmediateSending) {
      params.isent = sendingOptions.immediateSending ? "y" : "n"
    }

    if (Array.isArray(emails) && emails.length > 0) {
      params.uuids = emails?.map((_email) => _email?.uuid)?.join(",")
    }

    // Approval
    if (finalApproval && typeof selectApproval != "undefined" && selectApproval.value != "") {
      params.eapprover = selectApproval?.id

      // Mid-approver
      if (selectApproval.mmanager.mselect) {
        if (midApproval?.id) {
          params.mapprover = midApproval?.id
        }
      } else {
        if (mapprover.mapprover) {
          params.mapprover = mapprover.mapprover
        }
      }
    }

    if (sendingOptions.sendAsImportant) {
      params.isimportant = "y"
    }

    if (
      caller === "preview" ||
      sendingOptions.previewMode === "a" ||
      (sendingOptions.previewMode === "f" && sendingOptions.sendAsImportant)
    ) {
      // Check preview existed or not
      if (previewRef.current == null) {
        params.preview = "y"
      }
    }

    if (sendingOptions.sendIndividual) {
      params.issplit = "y"
    }

    if (sendingOptions.saveInSendbox) {
      params.issave = "y"
    }

    // Check menu and sharebox
    const shareboxParsedMenu = shareboxHelper.shareboxParser(currentMenu)
    const mailboxMenu = shareboxParsedMenu.isShare ? shareboxParsedMenu.sharebox : currentMenu
    params.mailbox = mailboxMenu

    if (shareboxParsedMenu.isShare) {
      params.shareid = shareboxParsedMenu.shareid
    }

    if (caller === "saveDraft") {
      params.todraft = "y"
      params.preview = "n"
    }

    if (sendDate) {
      if (delayDays > 0) {
        params.senddate = formatDateTime(new Date(sendDate), delayDays)
      } else {
        params.senddate = sendDate
      }
    }

    if (timezone) {
      params.gmt = timezone.gmt
    }

    // Handle Cipher params
    if (enableCipher) {
      params.issecu2 = "y"
      params.secupass2 = cpassword
      params.passhint = cpasswordHint

      if (isPassGuide) {
        params.ispassguide = "y"
      } else {
        params.ispassguide = "n"
      }

      if (isSecu2r) {
        params.issecu2r = "y"
        params.secuopenlimit = secuOpenLimit
        params.secudaylimit = secuDayLimit
      } else {
        params.issecu2r = "n"
      }
    }

    if (attachmentRef.current?.getUuid?.() && caller !== "preview" && params.preview !== "y") {
      params.upload_id = attachmentRef.current.getUuid()
      const files = attachmentRef.current.getFiles()

      if (typeof files.attachments === "object" && Object.keys(files.attachments).length > 0) {
        try {
          const result = await attachmentRef.current.uploadAndGetFiles()
        } catch (err) {
          errorToast(t("common.commom_hanupload_error_a"))
        }
      }

      if (files.filesCloudDisk && files.filesCloudDisk.length > 0) {
        const webdisk = files.filesCloudDisk.map((file) => ({
          id: file.link,
          name: file.name,
          size: file.size,
          expire: moment(file.expire).format("MM/DD/YYYY"),
          download: file.download,
        }))

        params.webdisk = JSON.stringify(webdisk)
      }
    }

    // Attach file forward
    if (fileForward.length) {
      const files = fileForward.map((f) => f.ii)
      if (files.length) params.upfiles = files.join(",")
    }

    writeEmail(params)
      .then((res) => {
        if (res.mailpreview) {
          // Check preview existed or not
          if (previewRef.current == null) {
            previewRef.current = true
            setMailPreview(res.mailpreview)
            setShowPreview(true)
            return
          }
        }

        if (res.success) {
          handleClose()
          successToast(t("mail.mail_sent_success"))
          modeType === "edit" ||
            (modeType === "resend" && navigate(["/mail/list", currentMenu].join("/")))
        } else {
          errorToast(res.msg)
        }
      })
      .then(() => {
        setIsSending(false)
      })
  }

  const onClickPreview = () => {
    onComposeMail("preview")
  }

  const onClickSaveDraft = () => {
    onComposeMail("saveDraft")
  }

  const onClickReservation = () => {
    setShowReservation(true)
  }

  const onSaveReservation = ({ timezone = "", sendDate = "", delayDays = 0 }) => {
    if (timezone) setTimezone(timezone)
    if (sendDate) setSendDate(sendDate)
    if (delayDays) setDelayDays(delayDays)

    setShowReservation(false)
  }

  const handleShowEditorToolbar = () => {
    const editor = composeRef?.current?.querySelector(".tox.tox-tinymce")
    if (editor) {
      const editorToolbar = editor.querySelector(".tox-editor-header")
      if (editorToolbar) {
        isShowEditorToolbar
          ? editorToolbar.classList.add("d-none")
          : editorToolbar.classList.remove("d-none")
      }
    }
    setIsShowEditorToolbar(!isShowEditorToolbar)
  }

  return (
    <>
      <ComposeContext.Provider
        value={{
          modeType,
          isInitSuccess,
          fromValue,
          optionFrom,
          handleChangeFrom,
          toValue,
          optionTo,
          handleChangeTo,
          handlePageCurrent,
          handleClose,
          checkedValue,
          handleCheckboxToValue,
          ccValue,
          handleChangeCc,
          bccValue,
          handleChangeBcc,
          subject,
          handleChangeSubject,
          selectApproval,
          optionsApproval,
          finalApproval,
          mapprover,
          handleChangeSelectApproval,
          midApproval,
          handleChangeMidApproval,
          fileForward,
          handleDeleteFileForward,
          editorValue,
          handleChangeEditor,
          editorValueHtml,
          onComposeMail,
          isSending,
          isLoading,
          onClickPreview,
          sendingOptions,
          handleChangeSendingOptions,
          onClickSaveDraft,
          onClickReservation,
          enableCipher,
          cpassword,
          cpasswordHint,
          secuOpenLimit,
          secuDayLimit,
          isPassGuide,
          isSecu2r,
          handleChangeCipher,
          attachmentRef,
          isShowImmediateSending,
          selectedMails,
          listMail,
          emails,
          setEmails,
          securePassword,
          setSecurePassword,
          setSignature,
          extensionNotAllowStr,
          attachOptions,
          setAttachOptions,
          isShowEditorToolbar,
          handleShowEditorToolbar,
          attachmentFiles,
          setAttachmentFiles,
          errors,
        }}
      >
        <ComposeCenter
          isOpen={isOpen}
          composeId={composeId}
          composeMode={composeMode}
          title={titleCompose}
          currentMenu={currentMenu}
          composeRef={composeRef}
        />
        {/* --- Organization Modal */}
        {showOrgModal.show && (showOrgModal?.composeId === composeId || isNewWindow) && (
          <ComposeOrg
            open={showOrgModal.show}
            handleClose={() => dispatch(closeOrgModal(showOrgModal.type))}
            handleChangeOrg={handleChangeOrg}
            activeTypeSelection={showOrgModal.type}
          />
        )}
      </ComposeContext.Provider>

      {/* Reservation Modal */}
      {showReservation && (
        <ComposeReservation
          handleClose={() => setShowReservation(false)}
          onSave={onSaveReservation}
          delayDays={delayDays}
          sendDate={sendDate}
          currentTimezone={timezone}
        />
      )}

      {/* Preview Modal */}
      {showPreview && (
        <ComposePreviewModal
          show={showPreview}
          // setShow={setShowPreview}
          handleClose={() => {
            previewRef.current = null
            setShowPreview(false)
          }}
          mailPreview={mailPreview}
          loading={isSending}
          onSend={onComposeMail}
          files={attachmentRef?.current?.getFiles() ?? []}
        />
      )}
    </>
  )
}

export default ComposeMail
