// @ts-nocheck
import { BaseButton, BaseModal, Loading } from "components/Common"
import { isArray, isEmpty } from "lodash"
import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import { getBaseUrl } from "utils"
import Body from "./Body"
import { useSelector } from "react-redux"
import { selectUserData } from "store/auth/config/selectors"
import { emailGet } from "helpers/email_api_helper"
import { generateUUID } from "components/Common/Attachment/HanModalClouddisk/utils"
import { useCustomToast } from "hooks/useCustomToast"

const AIModal = ({ open, onClose, aiData, onFinishSummary }) => {
  const { t } = useTranslation()
  const { menu } = useParams()
  const { successToast, errorToast } = useCustomToast()

  const langList = useSelector((state) => state.EmailConfig?.langList)
  const isDetailView = useSelector((state) => state.mailDetail.isDetailView)
  const userConfig = useSelector((state) => state.Config.userConfig)

  const { type, lang, data } = aiData

  const [renderData, setRenderData] = useState(() =>
    type === "summary"
      ? aiData.data
      : aiData.data?.map((item) => ({ ...item, subject: undefined })),
  )
  const [event, setEvent] = useState(data[0])
  const [indexEvent, setIndexEvent] = useState(0)

  useEffect(() => {
    if (!isEmpty(event)) {
      if (type === "summary") {
        const eventSource = new EventSource(
          `${getBaseUrl()}/email/ai/sumstreaming/${
            event?.lang
              ? event.lang
              : lang || userConfig?.config?.summary_lang || userConfig?.lang || "en"
          }/${event?.acl || menu}/${event?.mid}/${event?.timeuuid}`,
        )

        let currentAiContent = ""
        let isChange = false
        let titleCount = 0

        // Listen for messages
        eventSource.onmessage = (eventMess) => {
          if (eventMess.data == "[DONE]") {
            eventSource.close()
            setIndexEvent((prev) => (prev += 1))
            setEvent(data[indexEvent + 1])
            onFinishSummary && onFinishSummary(event.mid)
          }

          let streamtText = eventMess.data
          if (
            streamtText === "[" &&
            !(currentAiContent.endsWith("</span><br>") || currentAiContent.endsWith("]<br>"))
          ) {
            streamtText = "<span>"
            isChange = true
            if (titleCount === 0 && currentAiContent.endsWith("<br><br>")) {
              titleCount += 2
            } else {
              titleCount += 1
            }
            if (titleCount === 3) {
              streamtText = "<div class='ai-purpose'><span>"
            }
            if (titleCount === 4) {
              streamtText = "</div><span style='display: none;'>"
            }
          } else if (streamtText === "]" && isChange) {
            streamtText = "</span>"
            isChange = false
          } else if (streamtText === "1" && currentAiContent.endsWith("</span><br>")) {
            streamtText = "<div>1"
          } else if (streamtText === "</br>") {
            streamtText = "<text><br>"
          }
          currentAiContent += streamtText
          if (titleCount <= 2) {
            streamtText = ""
          }
          setRenderData((prev) =>
            prev?.map((_item) => {
              if (event.mid === _item.mid) {
                return {
                  ..._item,
                  messages: (_item.messages || "") + streamtText,
                  ...(!_item.renderId && { renderId: generateUUID() }),
                }
              } else {
                return _item
              }
            }),
          )
        }

        // Handle errors
        eventSource.onerror = (error) => {
          // console.error("EventSource error:", error)
          eventSource.close()
          setIndexEvent((prev) => (prev += 1))
          setEvent(data[indexEvent + 1])
          onFinishSummary && onFinishSummary(event)
        }
      } else {
        emailGet(
          `${getBaseUrl()}/email/ai/translate/${
            event?.lang
              ? event.lang
              : lang || userConfig?.config?.summary_lang || userConfig?.lang || "en"
          }/${event?.acl || menu}/${event?.mid}/${event?.timeuuid}`,
        ).then((res) => {
          if (res.success) {
            setRenderData((prev) =>
              prev?.map((_item) => {
                if (event.mid === _item.mid) {
                  return {
                    ..._item,
                    subject: res?.mail?.subject,
                    messages: res?.mail?.contents || "",
                    ...(!_item.renderId && { renderId: generateUUID() }),
                  }
                } else {
                  return _item
                }
              }),
            )
          }

          setIndexEvent((prev) => (prev += 1))
          setEvent(data[indexEvent + 1])
        })
      }
    }
  }, [event])

  const handleCopyContent = () => {
    try {
      let html = ""
      renderData.forEach((item) => {
        const sub_html = document?.getElementById(item?.renderId)?.innerHTML
        if (html !== "") {
          html += "<hr></hr>"
        }
        html += sub_html
      })
      let aux = document.createElement("div")
      aux.setAttribute("contentEditable", "true")
      aux.innerHTML = html
      document.body.appendChild(aux)
      window?.getSelection()?.selectAllChildren(aux)
      document.execCommand("copy")
      document.body.removeChild(aux)
      successToast()
    } catch (error) {
      errorToast()
    }
  }

  return (
    <BaseModal
      size="lg"
      isOpen={open}
      toggle={onClose}
      className="ai-modal"
      renderHeader={() => {
        return <span className="ai-header-title">{aiData?.title || ""}</span>
      }}
      renderBody={() => (
        <Body
          type={type}
          onCopy={handleCopyContent}
          curLang={lang || userConfig?.config?.summary_lang || userConfig?.lang || "en"}
          renderData={renderData}
          langList={langList}
        />
      )}
    />
  )
}

export default AIModal
