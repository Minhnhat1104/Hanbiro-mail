// @ts-nocheck
import { memo, useMemo, useState } from "react"
import BaseModal from "../BaseModal"
import useDevice from "hooks/useDevice"
import { useTranslation } from "react-i18next"
import { Headers, emailGet } from "helpers/email_api_helper"
import BaseButton from "../BaseButton"
import { useCustomToast } from "hooks/useCustomToast"

function Form({ extension = "", name = "", onClick = () => {}, isHover = false, formNo = "" }) {
  const getColor = () => {
    switch (extension.toLowerCase()) {
      case "bmp":
      case "gif":
      case "jpg":
      case "png":
        return "#5b47fb"
      case "mp3":
      case "wav":
        return "#00b8d4"
      case "dll":
      case "exe":
        return "#7987a1"
      case "doc":
      case "docx":
      case "rtf":
      case "txt":
        return "#0168fa"
      case "xls":
      case "xlsx":
      case "xlr":
        return "#10b759"
      case "csv":
        return "#099145"
      case "html":
      case "htm":
      case "js":
      case "class":
      case "java":
      case "php":
        // return "#6f42c1";
        // return "#6aafea"
        // return "#0066ff"
        // return { backgroundColor: "#0066ff", color: "white" }
        return { backgroundColor: "var(--bs-primary-light)", color: "var(--bs-primary)" }
      case "pdf":
        return "#dc3545"
      case "zip":
      case "rar":
        return "#1875ae"
      case "pptx":
      case "pptm":
      case "ppt":
        return "#fd7e14"
      case "avi":
      case "mp4":
      case "vob":
        return "#f10075"
      default:
        // return "#7987a1"
        // return "#ea6a6a"
        return { backgroundColor: "#F46A6A40", color: "rgba(244, 106, 106, 1)" }
    }
  }
  const { t } = useTranslation()
  const { successToast, errorToast } = useCustomToast()
  const [open, setOpen] = useState(false)
  const { isTablet } = useDevice()
  const [content, setContent] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const getFormData = async () => {
    setIsLoading(true)
    try {
      const res = await emailGet(
        "ngw/approval/approval/common_form",
        {
          no: formNo,
          out: "html",
        },
        Headers,
      )
      if (res.success) {
        setContent(res?.rows?.form)
      }
      setIsLoading(false)
    } catch (err) {
      errorToast()
      setIsLoading(false)
    }
  }

  const BodyMemo = useMemo(() => {
    return (
      <div className="overflow-auto" style={{ height: "78vh" }}>
        <span
          dangerouslySetInnerHTML={{
            __html: content ?? "",
          }}
        />
      </div>
    )
  }, [content])

  return (
    <>
      <div className="d-flex align-items-center">
        <span
          className="badge badge-primary"
          style={{
            ...getColor(),
            width: 70,
            lineHeight: 1.5,
            fontWeight: 600,
            borderRadius: 4,
          }}
        >
          {extension}
        </span>
        <span className="text-form-more">{name}</span>

        {isHover && (
          <i
            onClick={(e) => {
              // e.stopPropagation()
              setOpen(true)
              getFormData()
            }}
            className="bx bx-search-alt search-icon"
          />
        )}
        {/* {isHover && <span className="text-form-more">{name}</span>} */}
      </div>
      {open && (
        <BaseModal
          size="xl"
          open={open}
          backdrop={"static"}
          modalClass={isTablet ? "modal-w-80 overflow-hidden" : ""}
          renderHeader={name}
          renderBody={BodyMemo}
          // bodyClass="scroll-box"
          renderFooter={() => (
            <>
              <BaseButton
                outline
                color="grey"
                onClick={() => {
                  setOpen(false)
                  setContent("")
                }}
              >
                {t("common.common_btn_close")}
              </BaseButton>
              <BaseButton
                color="primary"
                onClick={() => {
                  onClick && onClick()
                  setOpen(false)
                }}
                loading={isLoading}
              >
                {t("common.approval_form_select")}
              </BaseButton>
            </>
          )}
          toggle={() => {
            setOpen(false)
            setContent("")
          }}
          centered
        />
      )}
    </>
  )
}

export default memo(Form)
