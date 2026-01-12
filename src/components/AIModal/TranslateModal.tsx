// @ts-nocheck
import { BaseButton, BaseButtonDropdown, BaseIcon, BaseModal } from "components/Common"
import { useCustomToast } from "hooks/useCustomToast"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import SummaryItemNew from "./SummaryItemNew"
import TranslateItem from "./TranslateItem"
import AiIcon from "./AiIcon"

const TranslateModal = ({ open, onClose, aiData, mail, onFinishSummary }) => {
  const { t } = useTranslation()
  const { menu } = useParams()
  const { successToast, errorToast } = useCustomToast()

  const langList = useSelector((state) => state.EmailConfig?.langList)
  const userConfig = useSelector((state) => state.Config.userConfig)

  const { type, lang: currentLang, data } = aiData

  const [lang, setLang] = useState(
    currentLang || userConfig?.config?.summary_lang || userConfig?.lang || "en",
  )
  const [renderData, setRenderData] = useState([data[0]])
  const [event, setEvent] = useState(data[0])
  const [indexEvent, setIndexEvent] = useState(0)
  const [isNew, setIsNew] = useState(event?.isnew == 1)
  const [isAttach, setIsAttach] = useState(false)

  const handleCopyContent = (lang) => {
    try {
      const element = document?.getElementById(lang)
      if (element) {
        const content = element?.querySelector(".ai-content-translate")
        const range = document.createRange()
        range.selectNode(content)
        const selection = window?.getSelection()
        selection?.removeAllRanges()
        selection?.addRange(range)
        document.execCommand("copy")
        selection?.removeAllRanges()
        successToast()
      } else {
        throw new Error("Element not found")
      }
    } catch (error) {
      errorToast()
    }
  }

  return (
    <BaseModal
      size="lg"
      isOpen={open}
      toggle={onClose}
      isClose={false}
      fullScreenMode={false}
      className="ai-modal"
      bodyClass={`ai-modal-body ${isAttach ? "attach" : ""}`}
      renderHeader={() => {
        return (
          <span className="ai-header-title">
            <span className="d-flex align-items-center gap-1">
              <AiIcon stroke={2} />
              {t("common.translate_msg")}
            </span>
            <BaseIcon icon={"bx bx-x"} onClick={() => onClose && onClose()} />
          </span>
        )
      }}
      renderBody={() => (
        <div className="ai-body scroll-box">
          {renderData?.map((item, index) => {
            delete item?.renderId
            return (
              <TranslateItem
                key={item?.mid || index}
                type={type}
                index={index}
                item={item}
                mail={mail}
                menu={menu}
                lang={lang}
                langList={langList}
                setLang={setLang}
                setIsAttach={setIsAttach}
                onCopy={handleCopyContent}
                onFinishSummary={(lang) => {
                  setIndexEvent((prev) => (prev += 1))
                  setEvent(data[indexEvent + 1])
                  isNew && onFinishSummary && onFinishSummary(event)
                  setIsNew(false)
                }}
              />
            )
          })}
        </div>
      )}
    />
  )
}

export default TranslateModal
