// @ts-nocheck
import { BaseButtonDropdown, BaseIcon } from "components/Common"
import { emailGet } from "helpers/email_api_helper"
import { isEmpty } from "lodash"
import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import AiHr from "./AiHr"
import EmailInfo from "./EmailInfo"
import SummarySkeleton from "./SummarySkeleton"
import { callAiFunction } from "./useAiFunction"
import { getFlagCode } from "./AiSelectButton"
import AiAction from "./AiAction"

const SummaryItemNew = ({
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
  const contentRef = useRef(null)

  const [aiContents, setAiContents] = useState({})
  const [lang, setlang] = useState(curLang)
  const [isLoading, setIsLoading] = useState(false)
  const [mail, setMail] = useState(curMail)

  const isShareMenu = menu?.includes("HBShare_")

  useEffect(() => {
    if (!isEmpty(item)) {
      handleSummarize()
    }
  }, [item, lang])

  useEffect(() => {
    if (mail && mail?.file?.length > 0) {
      setIsAttach && setIsAttach(true)
    }
  }, [mail])

  const handleSummarize = async () => {
    setIsLoading(true)
    if (!mail) {
      await getMail()
    }
    await callAiFunction({
      type,
      lang,
      menu,
      mail: item,
      setContent: (data) => {
        setIsLoading(false)
        setAiContents((prev) => {
          const firtContent = prev[curLang]
          delete prev[curLang]
          delete prev[lang]
          return {
            [curLang]: firtContent || "",
            [lang]: data,
            ...prev,
          }
        })
      },
      onFinishSummary: () => {
        onFinishSummary && onFinishSummary(lang)
      },
    })
  }

  const getMail = async () => {
    const res = await emailGet(
      ["email", menu, item?.mid].join("/"),
      isShareMenu && { shareid: menu },
    )
    const mailData = res?.mailview[0]
    setMail(mailData)
  }

  return (
    <div className={`ai-summary-item`}>
      {!isEmpty(aiContents) ? (
        <>
          <div className="ai-header d-flex justify-content-between align-items-start mb-3">
            <EmailInfo mail={mail || item} />
            <AiAction
              lang={langList?.find((lang) => lang.value === curLang)?.label}
              date={mail?.receivedate || item?.receivedate}
              onCopy={() => onCopy && onCopy(curLang)}
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
                    <BaseIcon className={"me-2"} icon={`flag-icon flag-icon-${lang.flagCode}`} />
                  ),
                  onClick: () => {
                    setlang(lang.value)
                    setAiContents((prev) => {
                      const firtContent = prev[curLang]
                      delete prev[curLang]
                      delete prev[lang.value]
                      return {
                        [curLang]: firtContent || "",
                        [lang.value]: "",
                        ...prev,
                      }
                    })
                  },
                }))}
            />
          </div>

          <div className="ai-summary-content">
            {Object.keys(aiContents).map((key, index) => {
              const summaryData = aiContents[key]
              return (
                <div
                  key={key}
                  id={key}
                  {...(index === 0 && { ref: contentRef })}
                  className={`${index > 0 ? "ps-5" : ""} ai-summary-item-content`}
                >
                  {index > 1 && <AiHr />}
                  {index > 0 && (
                    <AiAction
                      className="mb-3"
                      onCopy={() => onCopy && onCopy(key)}
                      lang={langList?.find((lang) => lang.value === key)?.label}
                    />
                  )}
                  <div className={`d-flex flex-grow-1 ${index > 0 ? "position-relative" : ""}`}>
                    {index > 0 && (
                      <SummarySkeleton
                        show={!!!aiContents[key]}
                        className={`${index > 0 ? "position-absolute" : ""}`}
                      />
                    )}
                    <div
                      className="ai-content flex-grow-1"
                      style={{ ...(index > 0 && { minHeight: 160 }) }}
                      dangerouslySetInnerHTML={{ __html: summaryData }}
                    ></div>
                  </div>

                  {index === 0 && Object.keys(aiContents).length > 1 && <AiHr />}
                </div>
              )
            })}
          </div>
        </>
      ) : (
        <SummarySkeleton first count={2} show={!!!aiContents[curLang]} />
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

export default SummaryItemNew
