// @ts-nocheck
// React
import React, { useEffect, useMemo, useState } from "react"

// Reactstrap
import { Button } from "reactstrap"

// Third-party
import { useTranslation } from "react-i18next"

// Project
import Loading from "components/Common/Loading"
import NoData from "components/Common/NoData"
import { Headers, emailGet } from "helpers/email_api_helper"
import { useCustomToast } from "hooks/useCustomToast"
import { BaseModal } from "components/Common"
import { post } from "helpers/api_helper"

const HeaderInformation = ({
  mode = "orgheader",
  acl = "",
  mid = "",
  menu,
  isShareMenu,
  handleClose = () => {},
}) => {
  const { t } = useTranslation()
  const { errorToast } = useCustomToast()

  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const url = ["email", acl, `${mid}/`].join("/")
        const params = {
          view_mode: mode,
          shareid: isShareMenu ? menu : undefined,
        }
        const res = await emailGet(url, params)
        if (res?.mailview) {
          let nData = res.mailview[0]
          const decodedData = await decodeHeader(res.mailview[0].contents)
          nData = {
            ...nData,
            contents: decodedData,
          }
          setData(nData)
        }
        setIsLoading(false)
      } catch (err) {
        errorToast()
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const decodeHeader = async (content) => {
    let match = content.match(/Subject:(.*?)<br>From/i)
    const subject = match !== null ? match[1] : ""
    match = content.match(/From:(.*?)<br>To/i)
    const fromMail = match !== null ? match[1] : ""
    match = content.match(/To:((.*?)<br>Cc|(.*?)<br>Bcc|(.*?)<br>Date)/i)
    const toMail = match !== null ? match[1] : ""
    match = content.match(/Cc:((.*?)<br>Bcc|(.*?)<br>Date)/i)
    const cc = match !== null ? match[1] : ""
    match = content.match(/Bcc:(.*?)<br>Date/i)
    const bcc = match !== null ? match[1] : ""

    const url = "/mail/main/decode_mail_header"
    let result = content
    const res = await post(
      url,
      {
        subject: subject,
        fromMail: fromMail,
        toMail: toMail,
        cc: cc,
        bcc: bcc,
      },
      Headers,
    )
    if (res?.success) {
      if (subject != "") {
        result = result.replace(subject, res.rows.subject)
      }

      if (fromMail != "") {
        result = result.replace(fromMail, res.rows.fromMail)
      }

      if (toMail != "") {
        result = result.replace(toMail, res.rows.toMail)
      }

      if (cc != "") {
        result = result.replace(cc, res.rows.cc)
      }

      if (bcc != "") {
        result = result.replace(bcc, res.rows.bcc)
      }
    }
    return result
  }

  // --- Header
  const Header = useMemo(() => {
    return <span dangerouslySetInnerHTML={{ __html: data?.subject ?? "" }}></span>
  }, [data])
  const renderHeader = () => {
    return <>{Header}</>
  }

  // --- Body
  const Body = useMemo(() => {
    return (
      <>
        {isLoading ? (
          <Loading />
        ) : (
          <>
            {data?.contents ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: data.contents,
                }}
                className="text-pre"
              />
            ) : (
              <NoData />
            )}
          </>
        )}
      </>
    )
  }, [isLoading, data])
  const renderBody = () => {
    return <>{Body}</>
  }

  return (
    <BaseModal
      size="lg"
      open={true}
      toggle={handleClose}
      renderHeader={renderHeader}
      renderBody={renderBody}
      renderFooter={() => (
        <Button outline color="grey" onClick={handleClose}>
          {t("common.common_btn_close")}
        </Button>
      )}
      // bodyClass="scroll-box"
      footerClass="d-flex align-items-center justify-content-center"
      centered
    />
  )
}

export default HeaderInformation
