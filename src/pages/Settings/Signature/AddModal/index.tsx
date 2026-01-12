// @ts-nocheck
// React
import React, { useContext, useEffect, useState } from "react"

// Third-party
import axios from "axios"
import { useTranslation } from "react-i18next"
import { Card, Label, Input, Collapse, CardBody } from "reactstrap"
import { cloneDeep } from "lodash"

// Project
import { HanEditor } from "components/Common/Editor"
import { BaseButton, BaseModal } from "components/Common"
import FormUpload from "components/SettingAdmin/FormUpload"
import { useCustomToast } from "hooks/useCustomToast"
import { URL_SIGNATURE, URL_SIGNATURE_HTML } from "modules/mail/settings/urls"
import { Headers, emailPost, emailPut, emailGet } from "helpers/email_api_helper"
import Loading from "components/Common/Loading"
import { getBaseUrl } from "utils"
import useDevice from "hooks/useDevice"

const AddModal = ({
  open = true,
  isEdit = { edit: false, item: {} },
  radioValue = 1,
  handleCheckedImage = () => {},
  handleCheckedText = () => {},
  getSignatureList = () => {},
  handleClose = () => {},
}) => {
  console.log("isEdit:", isEdit)
  const { t } = useTranslation()
  const { isMobile } = useDevice()
  const { successToast, errorToast } = useCustomToast()
  const [isLoading, setIsLoading] = useState(false)
  // Image
  const [selectedFiles, setSelectedFiles] = useState([])
  // Text
  const [editorValue, setEditorValue] = useState("")

  const handleChangeEditor = (value, replace = true) => {
    let checkInitializedTimer = null
    const activeEditor = tinymce?.activeEditor

    function _setNewContent() {
      const newContent = replace ? value : editorValue + value
      setEditorValue(newContent)
      activeEditor.setContent(newContent)
      activeEditor.focus()
    }

    if (activeEditor?.initialized) {
      _setNewContent()
    } else {
      // wait for the editor initializes before setting content
      checkInitializedTimer = setInterval(() => {
        if (activeEditor?.initialized) {
          _setNewContent()
          clearInterval(checkInitializedTimer)
        }
      }, 500)
    }
  }

  useEffect(() => {
    if (isEdit.edit && isEdit.item?.type === "sightml") {
      const fetchData = async (item) => {
        const res = await emailGet(`${URL_SIGNATURE_HTML}/${item?.uid}`)
        handleChangeEditor(res?.data) // Set data to editor
      }
      isEdit?.item && fetchData(isEdit.item)
    }
  }, [isEdit, tinymce])

  // Handle save -> Create/Edit signature
  const handleSave = async (file = null, radioValue = 1, isEdit = { edit: false, item: {} }) => {
    setIsLoading(true)
    let formData = new FormData()
    let contents = ""
    if (isEdit.edit) {
      // Edit mode
      if (isEdit.item?.type === "sigpic") {
        // Edit Pic -> Image
        if (file !== null && file?.length > 0 && file?.[0] !== "") {
          // File is not empty
          formData.append("file", file[0])
          try {
            const res = await axios({
              method: "put",
              url: [getBaseUrl(), URL_SIGNATURE, "pic", isEdit.item?.uid].join("/"),
              headers: {
                "Content-Type": undefined,
              },
              data: formData,
            })
            if (res?.data?.result) {
              getSignatureList()
              successToast()
              handleClose()
              setSelectedFiles([])
              setIsLoading(false)
            }
          } catch (err) {
            errorToast()
            setIsLoading(false)
          }
        } else {
          // File is empty
          setIsLoading(false)
          errorToast("Error<br/>Please select the image")
        }
      } else {
        // Edit Html -> Text
        if (file !== null && file !== "") {
          // File is not empty
          contents = file
            .replace(/<\s*p[^>]*><!--StartFragment--><\s*\/\s*p\s*>/g, "")
            .replace(/<!--EndFragment-->/g, "")
          let backup = cloneDeep(contents)

          /**
           * @author: H.Phuc <hoangphuc@hanbiro.vn> - @since: 2025-04-28
           * @ticket: GQ-287556
           * Replace href mailto with text email
           */
          try {
            let m
            let replaceList = []
            let regex = /<a[^>]*href=["\']mailto:([^"\']+)["\'][^>]*>(.*?)<\/a>/gm
            while ((m = regex.exec(contents)) !== null) {
              let href = ""
              let text = ""
              if (m.index === regex.lastIndex) {
                regex.lastIndex++
              }
              m.map((match, groupIndex) => {
                if (groupIndex == 1) {
                  href = match
                }
                if (groupIndex == 2) {
                  text = match
                }
              })
              if (href !== "" && text !== "" && href !== text) {
                replaceList.push({
                  href: href,
                  text: text,
                })
              }
            }
            if (replaceList.length > 0) {
              replaceList.map((item) => {
                contents = contents.replaceAll("mailto:" + item.href, "mailto:" + item.text)
              })
            }
          } catch (error) {
            console.log("error: ", error)
            contents = backup
          }

          try {
            const params = { contents: contents }
            const res = await emailPut(
              [URL_SIGNATURE, "html", isEdit.item?.uid].join("/"),
              params,
              Headers,
            )
            if (res.result) {
              getSignatureList()
              handleClose()
              successToast()
              handleChangeEditor("")
              setIsLoading(false)
            }
          } catch (err) {
            setIsLoading(false)
            errorToast()
          }
        } else {
          // File is empty
          setIsLoading(false)
          errorToast("Error<br/>Please enter the content")
        }
      }
    } else {
      // Create mode
      if (radioValue === 1) {
        // Create Pic -> Image
        if (file !== null && file?.length > 0 && file?.[0] !== "") {
          // File is not empty
          formData.append("file", file[0])
          try {
            const res = await emailPost([URL_SIGNATURE, "pic"].join("/"), formData, Headers)
            if (res.result) {
              getSignatureList()
              successToast()
              handleClose()
              setSelectedFiles([])
              setIsLoading(false)
            }
          } catch (err) {
            setIsLoading(false)
            errorToast()
          }
        } else {
          // File is empty
          setIsLoading(false)
          errorToast("Error<br/>Please select the image")
        }
      } else {
        // Create Html -> Text
        if (file !== null && file !== "") {
          // File is not empty
          contents = file
            .replace(/<\s*p[^>]*><!--StartFragment--><\s*\/\s*p\s*>/g, "")
            .replace(/<!--EndFragment-->/g, "")
          try {
            const params = { contents: contents }
            const res = await emailPost([URL_SIGNATURE, "html"].join("/"), params, Headers)
            if (res.result) {
              getSignatureList()
              handleClose()
              successToast()
              handleChangeEditor("")
              setIsLoading(false)
            }
          } catch (err) {
            setIsLoading(false)
            errorToast()
          }
        } else {
          // File is empty
          setIsLoading(false)
          errorToast("Error<br/>Please enter the content")
        }
      }
    }
  }

  const renderBody = () => {
    return (
      <div className={`${isMobile ? "" : "px-4"} pt-4 pb-2 position-relative`}>
        <div className="d-flex justify-content-left">
          {isEdit.edit ? (
            // Edit
            <>
              {isEdit.item?.type === "sigpic" ? (
                // Pic -> Image
                <>
                  <Label check className="me-3">
                    <Input
                      type="radio"
                      name="signature-radio"
                      defaultChecked
                      onClick={handleCheckedImage}
                      disabled
                    />{" "}
                    {t("mail.mail_signature_radio_picture")}
                  </Label>
                  <Label check>
                    <Input
                      type="radio"
                      name="signature-radio"
                      onClick={handleCheckedText}
                      disabled
                    />{" "}
                    {t("mail.mail_signature_radio_text")}
                  </Label>
                </>
              ) : (
                // Html -> Text
                <>
                  <Label check className="me-3">
                    <Input
                      type="radio"
                      name="signature-radio"
                      onClick={handleCheckedImage}
                      disabled
                    />{" "}
                    {t("mail.mail_signature_radio_picture")}
                  </Label>
                  <Label check>
                    <Input
                      type="radio"
                      name="signature-radio"
                      onClick={handleCheckedText}
                      defaultChecked
                      disabled
                    />{" "}
                    {t("mail.mail_signature_radio_text")}
                  </Label>
                </>
              )}
            </>
          ) : (
            // Not edit -> Create
            <>
              <Label check className="me-3">
                <Input
                  type="radio"
                  name="signature-radio"
                  defaultChecked
                  onClick={handleCheckedImage}
                />{" "}
                {t("mail.mail_signature_radio_picture")}
              </Label>
              <Label check>
                <Input type="radio" name="signature-radio" onClick={handleCheckedText} />{" "}
                {t("mail.mail_signature_radio_text")}
              </Label>
            </>
          )}
        </div>
        {radioValue === 1 && (!isEdit.edit || (isEdit.edit && isEdit.item?.type === "sigpic")) && (
          <div className="pt-2">{`${t(
            "common.archive_title_msg_allowextmsg",
          )} : bmp,gif,img,jpeg,jpg,png`}</div>
        )}
        <Collapse
          isOpen={
            // Check edit or not -> if edit -> check type of signature || if not edit -> check radioValue
            isEdit.edit ? (isEdit.item?.type === "sigpic" ? true : false) : radioValue === 1
          }
        >
          <Card>
            <CardBody className="p-0 mt-4">
              <FormUpload
                selectedFiles={selectedFiles}
                setSelectedFiles={setSelectedFiles}
                accept={{
                  "image/bmp": [],
                  "image/gif": [],
                  "image/img": [],
                  "image/jpeg": [],
                  "image/jpg": [],
                  "image/png": [],
                }}
                multiple={false}
              />
            </CardBody>
          </Card>
        </Collapse>
        <Collapse
          isOpen={
            // Check edit or not -> if edit -> check type of signature || if not edit -> check radioValue
            isEdit.edit ? (isEdit.item?.type === "sightml" ? true : false) : radioValue === 2
          }
        >
          <Card>
            <CardBody className="p-0 mt-4">
              <HanEditor onChange={handleChangeEditor} value={editorValue} />
            </CardBody>
          </Card>
        </Collapse>

        {isLoading && (
          <div className="position-absolute top-50 start-50 translate-middle">
            <Loading />
          </div>
        )}
      </div>
    )
  }

  return (
    <BaseModal
      open={open}
      toggle={() => {
        handleClose()
        setSelectedFiles([])
        handleChangeEditor("")
      }}
      renderHeader={() => <>{t("mail.mail_signature_write_edit_msg")}</>}
      renderBody={renderBody}
      renderFooter={() => (
        <>
          <BaseButton
            type="button"
            className="st-sg-modal-btn-save"
            color="primary"
            onClick={() =>
              handleSave(
                isEdit.edit
                  ? isEdit.item?.type === "sigpic"
                    ? selectedFiles
                    : editorValue
                  : radioValue === 1
                  ? selectedFiles
                  : editorValue,
                radioValue,
                isEdit,
              )
            }
          >
            {t("mail.mail_view_save")}
          </BaseButton>
          <BaseButton
            outline
            type="button"
            className="st-sg-modal-btn-cancel"
            color="grey"
            onClick={() => {
              handleClose()
              setSelectedFiles([])
              handleChangeEditor("")
            }}
          >
            {t("mail.mail_write_discard")}
          </BaseButton>
        </>
      )}
      footerClass="d-flex align-items-center justify-content-center"
      centered
    />
  )
}

export default AddModal
