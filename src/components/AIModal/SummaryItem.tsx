// @ts-nocheck
import { BaseButtonDropdown } from "components/Common"
import { emailGet } from "helpers/email_api_helper"
import React, { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { getBaseUrl } from "utils"
import AiLoading from "./AiLoading"
import { useTranslation } from "react-i18next"
import SummarySkeleton from "./SummarySkeleton"

const SummaryItem = ({ type, curLang, item, index, langList, onCopy }) => {
  const { t } = useTranslation()

  const { menu } = useParams()
  const [transData, setTransData] = useState({})
  const [lang, setlang] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  // console.log(" isLoading:", isLoading)

  const userConfig = useSelector((state) => state.Config.userConfig)

  useEffect(() => {
    if (lang && lang !== curLang) {
      setIsLoading(true)

      if (type === "summary") {
        const eventSource = new EventSource(
          `${getBaseUrl()}/email/ai/sumstreaming/${lang ? lang : "en"}/${item?.acl || menu}/${
            item?.mid
          }/${item?.timeuuid}`,
        )

        let currentAiContent = ""
        let isChange = false
        let titleCount = 0

        // eventSource.onopen = (eventS) => {
        //   setIsLoading(true)
        // }

        // Listen for messages
        eventSource.onmessage = (eventMess) => {
          if (eventMess.data == "[DONE]") {
            eventSource.close()
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
          setTransData((prev) => {
            let nData = { ...prev }
            if (!nData.hasOwnProperty(lang)) {
              nData = {
                [lang]: {
                  subject: "",
                  contents: streamtText,
                },
                ...nData,
              }
            } else {
              nData[lang] = {
                subject: "",
                contents: (nData[lang]?.contents || "") + streamtText,
              }
            }
            return nData
          })
        }

        setIsLoading(false)
        // Handle errors
        eventSource.onerror = (error) => {
          // console.error("EventSource error:", error)
          eventSource.close()
        }
      } else {
        emailGet(
          `${getBaseUrl()}/email/ai/translate/${
            item?.lang ? item.lang : lang || userConfig?.lang || "en"
          }/${item?.acl || menu}/${item?.mid}/${item?.timeuuid}`,
        ).then((res) => {
          if (res.success) {
            setTransData((prev) => {
              let nData = {
                [lang]: {
                  subject: res?.mail?.subject || "",
                  contents: res?.mail?.contents || "",
                },
                ...prev,
              }
              return nData
            })
            setIsLoading(false)
          }
        })
      }
    }
  }, [lang])

  return (
    <>
      {index > 0 && (
        <div className="w-100 han-bg-color-grey-lighter my-3" style={{ height: "1px" }}></div>
      )}

      <div className="d-flex justify-content-between align-items-start mb-3">
        <div className="ai-user-info d-flex flex-column">
          {type === "summary" && (
            <span
              className="font-size-15 han-fw-semibold"
              dangerouslySetInnerHTML={{
                __html: item?.subject,
              }}
            ></span>
          )}
          {type === "summary" && (
            <span className="ai-sub-title">
              <span className="ai-title">{t("mail.mail_write_from")}</span>
              {": "}
              {item?.from_name && <span className="ai-from-name me-1">{item?.from_name}</span>}
              <span
                dangerouslySetInnerHTML={{
                  __html: item?.from || "&lt;" + item?.from_addr + "&gt;" || "",
                }}
              ></span>
              {" - "}
              <span>{item?.receivedate || item?.date || ""}</span>
            </span>
          )}
        </div>
        <div className="d-flex align-items-center gap-2">
          <i
            onClick={() => onCopy && onCopy()}
            className="btn btn-action btn-copy bx bx-copy font-size-16 han-color-grey p-0 px-1"
          />
          <BaseButtonDropdown
            end={true}
            classDropdownToggle="btn-action btn-translate p-1"
            icon="fa fa-angle-down font-size-14 han-color-grey"
            iconClassName="ms-2"
            content={<i className="mdi mdi-translate han-color-grey" />}
            options={langList?.map((lang) => ({
              ...lang,
              isShow: true,
              disabled: Object.keys(transData)?.includes(lang.value) || lang.value === curLang,
              title: lang.label,
              onClick: () => setlang(lang.value),
            }))}
          />
        </div>
      </div>
      {type === "summary" ? (
        <>
          {item?.messages ? (
            <div id={item?.renderId}>
              <div className="ai-content" dangerouslySetInnerHTML={{ __html: item.messages }}></div>
              {Object.values(transData).length > 0 && (
                <div
                  className="w-100 han-bg-color-grey-lighter my-3"
                  style={{ height: "1px" }}
                ></div>
              )}

              <SummarySkeleton show={isLoading} />
              <div className={`w-100${type === "translate" ? "" : " ps-5"}`}>
                {Object.keys(transData)?.map((_key, idx) => (
                  <React.Fragment key={_key}>
                    {idx > 0 && (
                      <div
                        className="w-100 han-bg-color-grey-lighter my-3"
                        style={{ height: "1px" }}
                      ></div>
                    )}
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className="font-size-15 han-fw-bold">
                        {transData[_key]?.subject || ""}
                      </span>
                      <div className="d-flex align-items-center gap-2">
                        <span className="han-text-secondary">
                          {langList?.find((lang) => lang.value === _key)?.label}
                        </span>
                      </div>
                    </div>
                    <div
                      className="ai-content overflow-x-auto"
                      dangerouslySetInnerHTML={{ __html: transData[_key].contents || "" }}
                    ></div>
                  </React.Fragment>
                ))}

                {/* {isLoading && <SummarySkeleton/>} */}
              </div>
            </div>
          ) : (
            <SummarySkeleton />
          )}
        </>
      ) : (
        <div id={item?.renderId}>
          <SummarySkeleton show={isLoading} />

          <div className={`w-100${type === "translate" ? "" : " ps-5"}`}>
            {Object.keys(transData)?.map((_key, idx) => (
              <React.Fragment key={_key}>
                {idx > 0 && (
                  <div
                    className="w-100 han-bg-color-grey-lighter my-4"
                    style={{ height: "1px" }}
                  ></div>
                )}
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div className="d-flex flex-column">
                    <span className="font-size-15 han-fw-bold">
                      {transData[_key]?.subject || ""}
                    </span>
                    <span className="ai-sub-title">
                      <span
                        dangerouslySetInnerHTML={{ __html: item?.from || item?.from_addr || "" }}
                      ></span>
                      {" - "}
                      <span>{item?.receivedate || item?.date || ""}</span>
                    </span>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="han-text-secondary">
                      {langList?.find((lang) => lang.value === _key)?.label}
                    </span>
                  </div>
                </div>
                <div
                  className="overflow-x-auto"
                  dangerouslySetInnerHTML={{ __html: transData[_key].contents || "" }}
                ></div>
              </React.Fragment>
            ))}
          </div>

          {Object.values(transData).length > 0 && (
            <div className="w-100 han-bg-color-grey-lighter my-4" style={{ height: "1px" }}></div>
          )}

          {item?.messages ? (
            <>
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div className="d-flex flex-column">
                  <span className="font-size-15 han-fw-bold">{item?.subject || ""}</span>
                  <span className="ai-sub-title">
                    <span
                      dangerouslySetInnerHTML={{ __html: item?.from || item?.from_addr || "" }}
                    ></span>
                    {" - "}
                    <span>{item?.receivedate || item?.date || ""}</span>
                  </span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <span className="han-text-secondary">
                    {langList?.find((lang) => lang.value === curLang)?.label}
                  </span>
                </div>
              </div>
              <div
                className="overflow-x-auto"
                dangerouslySetInnerHTML={{ __html: item.messages }}
              ></div>
            </>
          ) : (
            <SummarySkeleton />
          )}
        </div>
      )}
    </>
  )
}

export default SummaryItem
