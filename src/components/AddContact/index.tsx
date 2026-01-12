// @ts-nocheck
// React
import React, { useContext, useEffect, useState } from "react"

// Third-party
import { useTranslation } from "react-i18next"

// Project
import { BaseButton, BaseModal } from "components/Common"
import BaseInput from "components/SettingAdmin/Inputwriting"
import BaseSelect from "components/SettingAdmin/Inputselectwriting"
import ToggleSwitch from "components/SettingAdmin/Toggle/index"
import { URL_ADD_FOLDER_CONTACT, URL_GET_FOLDER_CONTACT } from "modules/mail/common/urls"
import { useCustomToast } from "hooks/useCustomToast"
import { Headers, emailGet, emailPost } from "helpers/email_api_helper"
import { formatEmailFrom } from "utils"
import { MailContext } from "pages/Detail"

const formatGroupLabel = (data) => (
  <div>
    <span>{data.label}</span>
    <span>{data.options.length}</span>
  </div>
)

const AddContact = ({ handleClose = () => {}, mailData = {} }) => {
  const { t } = useTranslation()
  const { successToast, errorToast } = useCustomToast()
  const { mail: mailContext } = useContext(MailContext)

  const mail = mailContext || mailData // Get mail data

  const [isLoading, setIsLoading] = useState(false)
  const [folder, setFolder] = useState({})
  const [option, setOption] = useState([])
  const [important, setImportant] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  const { emailRegex, emailFromArr } = formatEmailFrom(mail?.from)

  // Fetch Data
  const fetchData = async () => {
    setIsLoading(true)
    try {
      const res = await emailGet(URL_GET_FOLDER_CONTACT, {}, Headers)
      if (res.success) {
        // Folder
        let newData = {}
        const newOption = res?.row?.map((item) => ({
          label: item?.name,
          options: item?.children?.map((child) => {
            if (child?.id === res?.default_folder?.id) {
              newData = {
                ...child,
                label: child?.name,
                value: child?.name,
              }
            }
            return {
              ...child,
              label: child?.name,
              value: child?.name,
            }
          }),
        }))
        setOption(newOption)
        setFolder(newData)

        // Name
        if (emailRegex) {
          setEmail(emailRegex)
        } else {
          if (emailFromArr?.length > 0) {
            if (emailFromArr[0] !== "") setEmail(emailFromArr[1])
            else setEmail(emailFromArr[2]?.split("&lt;")?.[1]?.replace(/&gt;/g, ""))
          }
        }

        // Email Address
        if (emailFromArr?.length > 0) {
          if (emailFromArr[0] !== "") setName(emailFromArr[0])
          else setName(emailFromArr[1])
        }
      }
      setIsLoading(false)
    } catch (err) {
      errorToast()
      setIsLoading(false)
    }
  }
  useEffect(() => {
    fetchData()
  }, [])

  // Handle save
  const handleSave = async (folder, name, email, important) => {
    setIsLoading(true)
    try {
      const res = await emailPost(
        URL_ADD_FOLDER_CONTACT,
        {
          name: name,
          email: email,
          important: important ? 1 : 0,
          id: folder?.id,
        },
        Headers,
      )
      if (res.success) {
        successToast()
        handleClose()
      }
      setIsLoading(false)
    } catch (err) {
      errorToast()
      setIsLoading(false)
    }
  }

  // --- Body
  const renderBody = () => {
    return (
      <>
        <BaseSelect
          title={t("common.board_folder_msg")}
          optionGroup={option}
          formatGroupLabel={formatGroupLabel}
          onChange={(value) => setFolder(value)}
          value={folder}
          maxMenuHeight={200}
        />
        <BaseInput
          title={t("common.mail_set_userinfo_name")}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <BaseInput title={t("mail.mail_forward_email_address")} value={email} disabled={true} />
        <ToggleSwitch
          col="9"
          title={t("mail.mail_addrbook_important")}
          checked={important}
          onChange={() => setImportant(!important)}
        />
      </>
    )
  }

  return (
    <BaseModal
      isOpen={true}
      toggle={handleClose}
      renderHeader={() => <>{t("mail.addrbook_add_address_msg")}</>}
      renderBody={renderBody}
      renderFooter={() => (
        <>
          <BaseButton
            color="primary"
            onClick={() => handleSave(folder, name, email, important)}
            loading={isLoading}
          >
            {t("common.common_btn_save")}
          </BaseButton>
          <BaseButton outline color="grey" onClick={handleClose} loading={isLoading}>
            {t("common.common_btn_close")}
          </BaseButton>
        </>
      )}
      centered
    />
  )
}

export default AddContact
