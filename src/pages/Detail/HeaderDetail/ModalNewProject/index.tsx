// @ts-nocheck
// React
import React, { useEffect, useState, useContext, useRef } from "react"

// Third-party
import { useTranslation } from "react-i18next"
import { Label, Input, Col, Row } from "reactstrap"

// Project
import { HanEditor } from "components/Common/Editor"
import { HanAttachment } from "components/Common/Attachment"
import { BaseButton, BaseModal } from "components/Common"
import { useCustomToast } from "hooks/useCustomToast"
import {
  URL_POST_NEW_PROJECT_LIST,
  URL_GET_NEW_PROJECT_WORK_TYPE,
  URL_POST_CREATE_WORK,
  URL_POST_CLONE_FILES_WORK,
} from "modules/mail/common/urls"
import { Headers } from "helpers/email_api_helper"
import { get, post } from "helpers/api_helper"
import Loading from "components/Common/Loading"
import AttachmentForward from "components/Common/ComposeMail/ComposeComponent/Body/AttachmentForward"
import { MailContext } from "pages/Detail"
import Select from "react-select"
import moment from "moment"

const ModalNewProject = ({ open = true, handleClose = () => {} }) => {
  const { mail, handleChangeEditor } = useContext(MailContext)
  const { t } = useTranslation()
  const { successToast, errorToast } = useCustomToast()
  const attachmentRef = useRef(null)
  const defaultOptions = {
    label: t("mail.mail_admin_select"),
    value: "0",
  }

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState({})
  const [project, setProject] = useState(defaultOptions)
  const [projectOptions, setProjectOptions] = useState([])
  const [type, setType] = useState(defaultOptions)
  const [typeOptions, setTypeOptions] = useState([])
  const [subject, setSubject] = useState("")
  const [content, setContent] = useState("")
  const [files, setFiles] = useState(mail?.file ?? [])

  useEffect(() => {
    setIsLoading(true)
    post([URL_POST_NEW_PROJECT_LIST, "200"].join("/"), {}, Headers).then((res) => {
      let options = [defaultOptions]
      if (res.success) {
        res.rows.map((item) => {
          options.push({
            label: item.subject,
            value: item.pseqno,
          })
        })
      }
      setProjectOptions(options)
      setIsLoading(false)
    })
    setSubject(mail?.subject ?? "")
    setContent(mail?.contents ?? "")
  }, [mail])

  useEffect(() => {
    if (tinymce.activeEditor) {
      handleChangeEditor(content, content, setContent)
    }
  }, [tinymce.activeEditor])

  useEffect(() => {
    if (project?.value) {
      setIsLoading(true)
      get([URL_GET_NEW_PROJECT_WORK_TYPE, "pseqno", project?.value].join("/"), {}, Headers).then(
        (res) => {
          let options = [defaultOptions]
          if (res.success) {
            res?.rows?.types.map((item) => {
              options.push({
                label: item.subject,
                value: item.ttseq,
              })
            })
          }
          setTypeOptions(options)
          setIsLoading(false)
        },
      )
    }
  }, [project])

  const onSaveWork = async () => {
    let checkError = {}

    if (project.value === defaultOptions.value) {
      checkError["project"] = true
    }

    if (type.value === defaultOptions.value) {
      checkError["type"] = true
    }
    setError(checkError)
    if (Object.keys(checkError).length > 0) {
      return false
    }

    let params = {
      pseqno: project.value,
      params: {
        subject: subject,
        content: content,
        status: "1",
        assignee: "0_0",
        type: type.value,
      },
    }

    if (attachmentRef.current?.getUuid?.()) {
      params.upload_id = attachmentRef.current.getUuid()
      const files = attachmentRef.current.getFiles()

      if (typeof files.attachments === "object" && Object.keys(files.attachments).length > 0) {
        try {
          const result = await attachmentRef.current.uploadAndGetFiles()
        } catch (err) {
          errorToast(t("common.commom_hanupload_error_a"))
        }
      }

      if (files.filesCloudDisk && files.filesCloudDisk.length > 0) {
        const webDisk = files.filesCloudDisk.map((file) => ({
          id: file.link,
          name: file.name,
          size: file.size,
          expire: moment(file.expire).format("MM/DD/YYYY"),
          download: file.download,
        }))

        params.webdisk = JSON.stringify(webDisk)
      }
    }

    setIsLoading(true)
    post(URL_POST_CREATE_WORK, params, Headers).then((res) => {
      setIsLoading(false)
      if (res.success) {
        successToast(res?.msg)
        handleClose()
        if (files.length > 0) {
          let paramCloneFile = {
            taseqno: res.data.taseqno,
            files: files,
          }
          post(URL_POST_CLONE_FILES_WORK, paramCloneFile, Headers)
        }
      } else {
        errorToast(res?.msg)
      }
    })
  }

  const handleDeleteFile = (fileDelete) => {
    const newFiles = files.filter((file) => file.link != fileDelete.link)
    setFiles(newFiles)
  }

  const renderBody = () => {
    return (
      <div className="position-relative">
        <Row>
          <Col lg="12">
            <Label htmlFor="delay-sent" className="col-form-label col-lg-12">
              {t("mail.mail_create_task_project")}
            </Label>
            <Col lg="12" className="d-flex align-items-center gap-1">
              <Select
                value={project}
                onChange={(value) => setProject(value)}
                options={projectOptions}
                className="select2-selection w-100"
                maxMenuHeight={190}
                styles={{
                  menu: (base) => ({
                    ...base,
                    backgroundColor: "white!important",
                    zIndex: 999,
                  }),
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    borderColor: error?.project ? "red" : "#ced4da",
                  }),
                }}
              />
            </Col>
          </Col>
          <Col lg="12">
            <Label htmlFor="delay-sent" className="col-form-label col-lg-12">
              {t("mail.mail_create_task_work_type")}
            </Label>
            <Col lg="12" className="d-flex align-items-center gap-1">
              <Select
                value={type}
                onChange={(value) => setType(value)}
                options={typeOptions}
                className="select2-selection w-100"
                maxMenuHeight={190}
                styles={{
                  menu: (base) => ({
                    ...base,
                    backgroundColor: "white!important",
                    zIndex: 999,
                  }),
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    borderColor: error?.type ? "red" : "#ced4da",
                  }),
                }}
              />
            </Col>
          </Col>
          <Col lg="12">
            <Label htmlFor="delay-sent" className="col-form-label col-lg-12">
              {t("mail.mail_create_task_work_name")}
            </Label>
            <Col lg="12" className="d-flex align-items-center gap-1">
              <Input
                title={t("mail.mail_create_task_work_name")}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </Col>
          </Col>
          <Col lg="12">
            <Col lg="12">
              {files.length > 0 && (
                <AttachmentForward fileList={files} onDeleteFile={handleDeleteFile} />
              )}
            </Col>

            <HanAttachment ref={attachmentRef} />
          </Col>
          <Col lg="12">
            <Label htmlFor="delay-sent" className="col-form-label col-lg-12">
              {t("mail.mail_create_task_description")}
            </Label>
            <Col lg="12" className="d-flex align-items-center gap-1">
              <HanEditor
                parentClass="w-100"
                options={{ height: 600, visual: false }}
                onChange={(value) => handleChangeEditor(value, content, setContent)}
              />
            </Col>
          </Col>
        </Row>
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
      }}
      renderHeader={() => <>{t("mail.mail_create_task_title")}</>}
      renderBody={renderBody}
      modalClass="write-project-modal"
      renderFooter={() => (
        <>
          <BaseButton
            type="button"
            className="st-sg-modal-btn-save"
            color="primary"
            onClick={() => {
              onSaveWork()
            }}
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

export default ModalNewProject
