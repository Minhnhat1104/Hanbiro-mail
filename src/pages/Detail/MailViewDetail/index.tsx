// @ts-nocheck
import React, { useEffect, useRef } from "react"

const MailViewDetail = ({ mail, isMailError }) => {
  const iframeId = "mail-iframe-detail"
  const iframeRef = useRef()

  useEffect(() => {
    if (iframeRef?.current) {
      setIframeContent(mail?.contents)
    }
  }, [iframeRef?.current])

  const setIframeContent = (content) => {
    let iframe = document.getElementById(iframeId)
    if (!iframe) return
    const docIframe = iframeRef.current.contentDocument
    docIframe.open()
    docIframe.write(content)
    docIframe.close()
    setEventClick()
  }

  function setEventClick() {
    let iframe = $(iframeId)
    iframe
      .contents()
      .find("html")
      .find("a, area")
      .on("click", function (e) {
        e.preventDefault()
        const href = $(this).attr("href")
        const target = $(this).attr("target")
        if (target !== undefined && target == "_blank") {
          window.open(href)
        } else {
          $window.location.href = href
        }
      })
  }

  const setIframeHeight = (iframe, count) => {
    const time = count * 1000
    var height = iframe.contents().find("html").find("#print-mail-detail").outerHeight()
    if (height) {
      iframe.css("height", height + 150)
    }
    if (count + 1 <= 6 && height == 16) {
      setIframeHeight(iframe, count + 1)
    }
  }

  return (
    <div className="content-view-body">
      <div className="wrapper-mail-content">
        <div
          className={`mail-content text-muted my-4 ${isMailError && "han-email-error"} ${
            mail?.contents?.includes('border="1"') && "table-view-mail"
          }`}
          // dangerouslySetInnerHTML={{ __html: mail?.contents }}
        >
          <iframe id={iframeId} ref={iframeRef} className="w-100" />
        </div>
      </div>
    </div>
  )
}

export default MailViewDetail
