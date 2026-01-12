// @ts-nocheck
import { emailGet } from "helpers/email_api_helper"
import { getBaseUrl } from "utils"

export async function callAiFunction(options) {
  const { type, lang, menu, mail, setContent, onFinishSummary, setMail } = options

  if (type === "summary") {
    const eventSource = new EventSource(
      `${getBaseUrl()}/email/ai/sumstreaming/${lang}/${mail?.acl || menu}/${mail?.mid}/${
        mail?.timeuuid
      }`,
    )

    let currentAiContent = ""
    let resultContent = ""
    let isChange = false
    let titleCount = 0
    let isNumber = false
    let isRemoveDot = false
    let isPurposeTitle = false
    let isPurposeContent = false

    // Listen for messages
    eventSource.onmessage = (eventMess) => {
      if (eventMess.data == "[DONE]") {
        eventSource.close()
        onFinishSummary && onFinishSummary(mail.mid)
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
        if (titleCount === 1) {
          streamtText = "<div class='ai-purpose'><span>"
          isPurposeTitle = true
        }
        if (titleCount >= 2) {
          streamtText = "</div><span style='display: none;'>"
        }
      } else if (streamtText === "<br>" && isPurposeTitle) {
        streamtText = "<br><span class='ai-purpose-content'><span class='bullet'></span>"
        isPurposeTitle = false
        isPurposeContent = true
      } else if (streamtText === "<br>" && isPurposeContent) {
        streamtText = "</span><br>"
        isPurposeContent = false
      } else if (streamtText === "]" && isChange) {
        streamtText = "</span>"
        isChange = false
      } else if (
        parseInt(streamtText) > 0 &&
        (currentAiContent.endsWith("</span><br>") ||
          currentAiContent.endsWith("<br><br>") ||
          currentAiContent?.trimEnd()?.endsWith("<br>"))
      ) {
        streamtText = "<strong>"
        // streamtText = "<strong>" + streamtText
        isNumber = true
        isRemoveDot = true
      } else if (streamtText === "." && isNumber) {
        streamtText = ""
        isRemoveDot = false
      } else if (streamtText === "<br>" && isNumber) {
        streamtText = "</strong><br>"
        isNumber = false
      } else if (
        streamtText === "-" &&
        (currentAiContent?.trimEnd()?.endsWith("<br>") ||
          currentAiContent?.trimEnd()?.endsWith("</br>"))
      ) {
        streamtText = '<span class="bullet"></span>'
      }
      currentAiContent += streamtText
      // if (titleCount <= 2) {
      //   streamtText = ""
      // }
      resultContent += streamtText
      setContent(resultContent)
    }

    // Handle errors
    eventSource.onerror = (error) => {
      // console.error("EventSource error:", error)
      eventSource.close()
      onFinishSummary && onFinishSummary(mail)
    }
  } else {
    const res = await emailGet(
      `${getBaseUrl()}/email/ai/translate/${lang}/${mail?.acl || menu}/${mail?.mid}/${
        mail?.timeuuid
      }`,
    )
    if (res.success) {
      setMail && setMail(res?.mail)
      setContent({ subject: res?.mail?.subject, contents: res?.mail?.contents || "" })
      onFinishSummary && onFinishSummary(mail)
    }
  }
}
