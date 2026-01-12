// @ts-nocheck
// React
import React, { useContext, useEffect, useState } from "react"

// Third-party
import { useTranslation } from "react-i18next"

// Project
import { OrgSelectModal } from "components/Common/Org"
import { ComposeContext } from ".."

const ComposeOrg = ({ open, handleClose, handleChangeOrg, activeTypeSelection }) => {
  const { toValue, ccValue, bccValue } = useContext(ComposeContext)
  const { t } = useTranslation()

  const [emails, setEmails] = useState({ to: {}, cc: {}, bcc: {} })

  useEffect(() => {
    const newEmails = {
      to: { ...emails.to },
      cc: { ...emails.cc },
      bcc: { ...emails.bcc },
    }

    if (toValue) {
      toValue.forEach((item) => {
        newEmails.to[item?.value] = {
          // email: item?.value
        }
      })
    }
    if (ccValue) {
      ccValue.forEach((item) => {
        newEmails.cc[item?.value] = {
          // email: item?.value
        }
      })
    }
    if (bccValue) {
      bccValue.forEach((item) => {
        newEmails.bcc[item?.value] = {
          // email: item?.value
        }
      })
    }

    setEmails(newEmails)
  }, [toValue, ccValue, bccValue])

  return (
    <OrgSelectModal
      mode={2}
      open={open}
      emails={emails}
      setEmails={setEmails}
      title={t("common.main_orgtree")}
      onSave={(emails) => handleChangeOrg(emails)}
      handleClose={handleClose}
      activeTypeSelection={activeTypeSelection}
      isComposeMail={true}
    />
  )
}

export default ComposeOrg
