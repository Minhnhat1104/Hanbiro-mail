// @ts-nocheck
// React
import React, { useEffect, useMemo, useState } from "react"

// Third-party
import { Button } from "reactstrap"
import { useTranslation } from "react-i18next"
import { Checkbox, FormControlLabel } from "@mui/material"

// Project
import { ORG_ICON } from "components/Common/Org/HanOrganizationNew/orgTreeIcon"
import Loading from "components/Common/Loading"
import NoData from "components/Common/NoData"
import { Headers, emailGet, emailPost, formDataUrlencoded } from "helpers/email_api_helper"
import { URL_GET_EMAIL_SHARE_BOX, URL_POST_EMAIL_SHARE_BOX } from "modules/mail/common/urls"
import { useCustomToast } from "hooks/useCustomToast"
import { BaseModal } from "components/Common"

const ShareBox = ({ acl, mid, handleClose }) => {
  const { t } = useTranslation()
  const { successToast, errorToast } = useCustomToast()

  const [isLoading, setIsLoading] = useState(false)
  const [mailBox, setMailBox] = useState([
    {
      key: "",
      title: "",
    },
  ])
  const [checkedValue, setCheckedValue] = useState("")
  const [shareKey, setShareKey] = useState("")

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const res = await emailGet(URL_GET_EMAIL_SHARE_BOX)
        if (res?.mailbox) {
          const mailBoxes = res?.mailbox?.map((item) => ({
            key: item?.key,
            title: item?.name,
          }))
          setMailBox(mailBoxes)
        }
        setIsLoading(false)
      } catch (err) {
        errorToast()
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  /**
   * @description Handle when clicking checkbox and copy button
   * @returns {void}
   */

  const handleCheckboxChange = (value, isCheck) => {
    if (isCheck) {
      setCheckedValue(value)
      setShareKey(value)
    } else {
      setCheckedValue("")
      setShareKey("")
    }
  }

  const handleCopy = async (acl, mid, key) => {
    try {
      const params = {
        // boxid: acl,
        boxid: "Maildir",
        mids: mid,
        sharedid: key, // key of share box
      }
      const res = await emailPost(URL_POST_EMAIL_SHARE_BOX, formDataUrlencoded(params), Headers)
      if (res?.success) {
        successToast()
        handleClose()
      } else {
        errorToast(res?.msg)
      }
    } catch (err) {
      errorToast()
    }
  }

  // --- Header
  const Header = useMemo(() => {
    return <>{t("mail.mail_share_copy_to_sharebox")}</>
  }, [])
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
            {mailBox?.length > 0 ? (
              mailBox.map((item) => (
                <div key={item.key}>
                  <FormControlLabel
                    control={
                      <>
                        <Checkbox
                          checked={checkedValue === item.key}
                          onClick={(e) => handleCheckboxChange(item.key, e.target.checked)}
                          onChange={() => {}}
                          size="small"
                        />
                        <span className="button m-2 bg-none font-size-15">
                          {ORG_ICON.folderCloseIcon}
                        </span>
                      </>
                    }
                    label={item.title}
                  />
                </div>
              ))
            ) : (
              <NoData />
            )}
          </>
        )}
      </>
    )
  }, [isLoading, mailBox, checkedValue])
  const renderBody = () => {
    return <>{Body}</>
  }

  // --- Footer
  const Footer = useMemo(() => {
    return (
      <>
        <Button color="primary" onClick={() => handleCopy(acl, mid, shareKey)}>
          {t("common.action_copy")}
        </Button>
        <Button outline color="grey" onClick={handleClose}>
          {t("common.common_btn_close")}
        </Button>
      </>
    )
  }, [acl, mid, shareKey])
  const renderFooter = () => {
    return <>{Footer}</>
  }

  return (
    <BaseModal
      size="md"
      open={true}
      toggle={handleClose}
      renderHeader={renderHeader}
      renderBody={renderBody}
      renderFooter={renderFooter}
      // bodyClass="scroll-box"
      footerClass="d-flex align-items-center justify-content-center"
      centered
    />
  )
}

export default ShareBox
