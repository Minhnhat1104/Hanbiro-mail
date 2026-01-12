// @ts-nocheck
import { useCustomToast } from "hooks/useCustomToast"
import { getPermitMailDetails, putPermitMail } from "modules/mail/list/api"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { Spinner } from "reactstrap"
import PermitMailModal from "../PermitMailModal"
import Body from "./Body"
import Header from "./Header"
import { postMailToHtml5 } from "modules/mail/common/api"
import useDevice from "hooks/useDevice"
import { setIsPermitDetailView } from "store/mailDetail/actions"

const APPROVAL_MAIL_MENU = "/mail/list/Approval"

export const viewState = {
  n: "mail.mail_list_newmail",
  a: "mail.mail_secure_allow",
  d: "mail.mail_secure_deny",
  r: "mail.mail_secure_recall",
  u: "mail.mail_secure_auto_allow",
  p: "mail.mail_secure_predecessor_permitted",
  m: "mail.mail_interim_approval_in_progress",
  z: "mail.mail_interim_approval_decline",
  t: "mail.mail_interim_approval_complete",
}

const PermitMailDetail = () => {
  const { menu, mid } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { isMobile } = useDevice()
  const { successToast, errorToast } = useCustomToast()

  // state
  const [mailInfo, setMailInfo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingPermit, setLoadingPermit] = useState(false)
  const [dataPermitModal, setDataPermitModal] = useState({
    type: "",
    open: false,
  })
  const [important, setImportant] = useState({
    important: false,
    loading: false,
  })
  const [isPredecessor, setIsPredecessor] = useState(false)

  // set isDetailView
  useEffect(() => {
    dispatch(setIsPermitDetailView(true))

    return () => {
      dispatch(setIsPermitDetailView(false))
    }
  }, [])

  useEffect(() => {
    if (mid) {
      getDetail()
    }
  }, [mid])

  const getDetail = () => {
    setLoading(true)
    const [msg_uuid, ouuid] = mid.split("_")
    getPermitMailDetails(msg_uuid, ouuid)
      .then((res) => {
        if (res?.mailview) {
          setMailInfo(res.mailview[0])
          setImportant((prev) => ({
            ...prev,
            important: res.mailview[0]?.isimportant,
          }))

          const mForce = res.mailview[0].approval.mforce
          const isMForce = res.mailview[0].approval.ismforce
          if (mForce && !isMForce) {
            setIsPredecessor(true)
          }
        }
      })
      .catch((err) => {
        errorToast(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const onRefresh = () => {
    getDetail()
  }

  const handlePermitMail = (type) => {
    if (!mailInfo) return
    setDataPermitModal({
      type: type,
      open: true,
    })
  }

  const onPermitMail = (mode, mforce, reason) => {
    if (!mailInfo) return
    const [msg_uuid, ouuid] = mid.split("_")
    setLoadingPermit(true)
    if (mode === "allow") {
      putPermitMail({ mode, uuids: ouuid, mforce })
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
          // onRefresh()
          navigate(APPROVAL_MAIL_MENU)
        })
    } else {
      putPermitMail({ mode, uuids: ouuid, mforce }, { reason })
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
          // onRefresh()
          navigate(APPROVAL_MAIL_MENU)
        })
    }
  }

  const handleMarkAsImportant = async (isImportant) => {
    setImportant({ ...important, loading: true })
    try {
      const params = {
        acl: mailInfo.acl || menu,
        act: "mailsigupdate",
        mode: isImportant ? "mailtosig" : "sigtomail",
        mid: mid,
      }
      const res = await postMailToHtml5(params)
      if (res) {
        successToast()
        setImportant((prev) => ({ important: !prev.important, loading: false }))
      }
    } catch (err) {
      errorToast()
      setImportant({ ...important, loading: false })
    }
  }

  return (
    <div className={`h-100 px-2 overflow-hidden ${isMobile ? "border-top" : ""}`}>
      {loading && !mailInfo ? (
        <div className="d-flex justify-content-center align-items-center w-100 h-100">
          <Spinner color="primary" style={{ width: "2rem", height: "2rem" }} />
        </div>
      ) : (
        <>
          <Header mail={mailInfo} important={important} handleMarkAsImportant={handleMarkAsImportant} />
          <Body mail={mailInfo} handlePermitMail={handlePermitMail} />
        </>
      )}

      {dataPermitModal.open && (
        <PermitMailModal
          dataPermitModal={dataPermitModal}
          onPermitMail={onPermitMail}
          setToggle={setDataPermitModal}
          loadingPermit={loadingPermit}
          isPredecessor={isPredecessor}
        />
      )}
    </div>
  )
}

export default PermitMailDetail
