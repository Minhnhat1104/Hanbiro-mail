// @ts-nocheck
import { BaseButtonDropdown, BaseIcon } from "components/Common"
import { isEmpty } from "lodash"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import AiHr from "./AiHr"
import EmailInfo from "./EmailInfo"
import SummarySkeleton from "./SummarySkeleton"
import { callAiFunction } from "./useAiFunction"
import { getFlagCode } from "./AiSelectButton"
import AiAction from "./AiAction"

function removeHiddenElementsFromHTML(html) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, "text/html")

  // Select all elements that have style containing "display: none"
  const hiddenElements = doc.querySelectorAll('[style*="display:none"]')
  hiddenElements.forEach((el) => el.remove())

  return doc.body.innerHTML
}

const TranslateItem = ({
  type,
  lang: curLang,
  menu,
  item,
  mail: curMail,
  idx,
  langList,
  onCopy,
  setIsAttach,
  onFinishSummary,
}) => {
  const { t } = useTranslation()

  const [aiContents, setAiContents] = useState({})
  const [aiSubject, setAiSubject] = useState({})
  const [lang, setlang] = useState(curLang)
  const [isLoading, setIsLoading] = useState(false)
  const [mail, setMail] = useState(curMail)

  useEffect(() => {
    if (!isEmpty(item)) {
      handleTranslate()
    }
  }, [item, lang])

  useEffect(() => {
    if (mail && mail?.file?.length > 0) {
      setIsAttach && setIsAttach(true)
    }
  }, [mail])

  function domToChunks(node) {
    const chunks = []

    const walk = (n) => {
      if (n.nodeType === Node.TEXT_NODE) {
        const text = n.textContent || ""
        const parts = text.match(/[^ ]+ ?/g) || []
        parts.forEach((part) => chunks.push(part))
      } else if (n.nodeType === Node.ELEMENT_NODE) {
        const tag = n.tagName.toLowerCase()

        // Solid stream with the necessary tags.
        if (["img", "svg", "code", "iframe", "video", "audio"].includes(tag)) {
          chunks.push(n.outerHTML)
          return
        }

        // Stream tags open
        let startTag = `<${tag}`
        for (const attr of n.attributes) {
          startTag += ` ${attr.name}="${attr.value}"`
        }
        startTag += ">"
        chunks.push(startTag)

        // Recursively stream the children.
        for (const child of n.childNodes) {
          walk(child)
        }

        // Stream tags close
        chunks.push(`</${tag}>`)
      }
    }

    walk(node)
    return chunks
  }

  function streamHTML(html, onChunk, delay = 20) {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, "text/html")
    const body = doc.body

    const tokens = domToChunks(body)
    let index = 0
    let output = ""

    function send() {
      if (index < tokens.length) {
        output += tokens[index]
        onChunk(output)
        index++
        setTimeout(send, delay)
      }
    }

    send()
  }

  const handleTranslate = async () => {
    setIsLoading(true)
    await callAiFunction({
      type,
      lang,
      menu,
      mail: item,
      setContent: (data) => {
        setIsLoading(false)
        setAiSubject((prev) => ({
          ...prev,
          [lang]: data?.subject,
        }))
        streamHTML(removeHiddenElementsFromHTML(data?.contents), (chunk) => {
          setAiContents((prev) => {
            delete prev[lang]
            return {
              [lang]: chunk,
              ...prev,
            }
          })
        })
        // setAiContents((prev) => {
        //   delete prev[lang]
        //   return {
        //     [lang]: data?.contents,
        //     ...prev,
        //   }
        // })
      },
      onFinishSummary: () => onFinishSummary(lang),
      setMail,
    })
  }

  return (
    <div className={`ai-summary-item`}>
      {!isEmpty(aiContents) ? (
        <div className="ai-summary-content">
          {Object.keys(aiContents).map((key, index) => {
            const summaryData = aiContents[key]
            return (
              <div key={key} id={key} className={`ai-summary-item-content position-relative`}>
                {index > 1 && <AiHr type="translate" />}
                {index === 0 && (
                  <SummarySkeleton first type="translate" show={!!!aiContents[key]} />
                )}

                {!!aiContents[key] && (
                  <>
                    <div className="ai-header d-flex justify-content-between align-items-start mb-3">
                      <EmailInfo mail={mail || item} subject={aiSubject[key]} />
                      <AiAction
                        lang={langList?.find((lang) => lang.value === key)?.label}
                        date={mail?.receivedate || item?.receivedate}
                        showLangButton={index === 0}
                        onCopy={() => onCopy && onCopy(key)}
                        options={langList
                          ?.map((_item) => ({
                            ..._item,
                            flagCode: getFlagCode(_item.value),
                          }))
                          ?.map((lang) => ({
                            ...lang,
                            isShow: true,
                            disabled: Object.keys(aiContents)?.includes(lang.value),
                            title: lang.label,
                            iconCustom: (
                              <BaseIcon
                                className={"me-2"}
                                icon={`flag-icon flag-icon-${lang.flagCode}`}
                              />
                            ),
                            onClick: () => {
                              setlang(lang.value)
                              setAiContents((prev) => {
                                delete prev[lang.value]
                                return {
                                  [lang.value]: "",
                                  ...prev,
                                }
                              })
                            },
                          }))}
                      />
                    </div>

                    <div
                      className={`ai-content-translate ${index === 0 ? "first" : ""}`}
                      style={{ minHeight: 165 }}
                      dangerouslySetInnerHTML={{ __html: summaryData }}
                    ></div>
                  </>
                )}

                {index === 0 && Object.keys(aiContents).length > 1 && <AiHr type="translate" />}
              </div>
            )
          })}
        </div>
      ) : (
        <SummarySkeleton first type="translate" show={isLoading} />
      )}

      {(mail || item)?.file?.length > 0 && (
        <div className="position-absolute bottom-0 end-0 d-flex justify-content-end py-2 px-3">
          <span className="mb-0 han-body2 han-text-secondary">
            {t("common.board_attach_msg")} ({(mail || item)?.file?.length}{" "}
            {t("common.common_files")}, {(mail || item)?.fileinfo?.totsize})
          </span>
        </div>
      )}
    </div>
  )
}

export default TranslateItem
