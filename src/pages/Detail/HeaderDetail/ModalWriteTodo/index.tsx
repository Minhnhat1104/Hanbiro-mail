// @ts-nocheck
// React
import { useContext, useEffect, useRef, useState } from "react"

// Third-party
import { useTranslation } from "react-i18next"
import { Button, Col, FormGroup, Input, Label, Row } from "reactstrap"

// Project
import AttachmentMailList from "components/AttachmentMail/AttachmentMailList"
import { BaseButton, BaseModal } from "components/Common"
import { HanAttachment } from "components/Common/Attachment"
import { MAX_HEIGHT_MENU } from "components/Common/ComposeMail/ComposeComponent/Body"
import AutoComplete from "components/Common/ComposeMail/ComposeComponent/Body/AutoComplete"
import CustomMultipleValue from "components/Common/CustomReactSelect/CustomMultipleValue/CustomMultipleValue"
import { HanEditor } from "components/Common/Editor"
import HanDatePicker from "components/Common/HanDatePicker"
import Loading from "components/Common/Loading"
import GroupwareOrgModal from "components/Common/Org/GroupwareOrgModal"
import { get, post } from "helpers/api_helper"
import { Headers } from "helpers/email_api_helper"
import { useCustomToast } from "hooks/useCustomToast"
import { isEmpty } from "lodash"
import {
  URL_CHECK_SMS_SERVICE,
  URL_CLONE_FILES_FROM_OTHERS,
  URL_CONFIG_TODO_UNREAD,
  URL_GET_TODO_CATEGORY_LIST,
  URL_WRITE_TODO,
} from "modules/mail/common/urls"
import moment from "moment"
import { MailContext } from "pages/Detail"
import { useSelector } from "react-redux"
import Select from "react-select"
import { getDateFormat } from "utils/dateTimeFormat"
import AutoCompleteOrg from "./AutoCompleteOrg"
import "../styles.scss"

const priorityOptions = [
  { value: "4", label: "todo.todo_priority_urgent" },
  { value: "3", label: "todo.todo_priority_high" },
  { value: "2", label: "todo.todo_priority_normal" },
  { value: "1", label: "todo.todo_priority_low" },
]
const checkboxOptions = [
  { value: "mytodo", label: "todo.todo_my_todo_msg" },
  { value: "sendsms", label: "common.addrbook_sms_msg" },
  { value: "sendmail", label: "common.board_send_mail_msg" },
]

const ModalWriteTodo = ({ open = true, handleClose = () => {} }) => {
  const { mail, handleChangeEditor } = useContext(MailContext)

  const { t } = useTranslation()
  const { successToast, errorToast } = useCustomToast()
  const userConfig = useSelector((state) => state.Config.userConfig)

  // ref
  const attachmentRef = useRef()

  // state
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [openOrgModal, setOpenOrgModal] = useState({
    open: false,
    type: "to",
  })

  const [subject, setSubject] = useState("")
  const [content, setContent] = useState("")
  const [isSms, setIsSms] = useState(false)

  const [priority, setPriority] = useState({
    value: priorityOptions[2].value,
    label: t(priorityOptions[2].label),
  })

  const [startDate, setStartDate] = useState(moment().toDate())
  const [endDate, setEndDate] = useState(moment().add(7, "day").toDate())

  const [isUseCategory, setIsUseCategory] = useState(false)
  const [category, setCategory] = useState(null)
  const [categoryOptions, setCategoryOptions] = useState([])

  const [toValues, setToValues] = useState({})
  const [ccValues, setCcValues] = useState({})
  const [validate, setValidate] = useState({})

  const [oldAttachment, setOldAttachment] = useState([])

  const [checkboxState, setCheckboxState] = useState({
    mytodo: false,
    sendsms: false,
    sendmail: false,
    sendwhiper: false,
  })

  // side effects
  useEffect(() => {
    setIsLoading(true)
    const getInitData = async () => {
      const isSmsService = await get(URL_CHECK_SMS_SERVICE)
      const categoryData = await post(URL_GET_TODO_CATEGORY_LIST, { mode: "config" }, Headers)

      setIsLoading(false)
      if (isSmsService?.success) setIsSms(true)
      if (categoryData?.success) {
        const nData = categoryData.rows.categories.map((row) => ({
          value: row?.key,
          label: row?.value,
        }))
        setCategoryOptions(nData)
        setCategory(nData[0])
      }
    }
    getInitData()
    setSubject(mail?.subject ?? "")
    setContent(mail?.contents ?? "")

    if (mail?.file?.length > 0) {
      setOldAttachment(mail?.file)
    }
  }, [mail])

  useEffect(() => {
    if (tinymce.activeEditor) {
      handleChangeEditor(content, content, setContent)
    }
  }, [tinymce.activeEditor])

  // handlers
  const handleChangeTo = (values) => {
    if (Array.isArray(values) && values.length === 0) setToValues({})
    let toData = {}
    values.forEach((value) => {
      toData[value?.id] = value
    })
    setToValues(toData)
  }

  const handleChangeCc = (values) => {
    if (Array.isArray(values) && values.length === 0) setCcValues({})
    let ccData = {}
    values.forEach((value) => {
      ccData[value?.id] = value
    })
    setCcValues(ccData)
  }

  const handleChangeOrg = (values) => {
    if (!values) return
    const toData = { ...toValues, ...values }
    const ccData = { ...ccValues, ...values }

    openOrgModal.type === "to" ? setToValues(toData) : setCcValues(ccData)
  }

  const handleDeleteFile = (title, handler, boxname, mailId, fileCount) => {
    const nList = oldAttachment.filter((att) => att.count != fileCount)
    setOldAttachment(nList)
  }

  const handleWriteTodo = async () => {
    // setTimeout(async () => {
    // }, 100)
    let params = {
      priority: priority?.value,
      category: isUseCategory ? category.value : undefined,
      contents: content,
      subject: subject,
      email: checkboxState.sendmail,
      ismytodo: checkboxState.mytodo,
      receive_target: checkboxState.mytodo ? "" : formatTargetData(toValues).join(","),
      receive_target_ids: checkboxState.mytodo ? undefined : formatTargetData(toValues),
      read_target: formatTargetData(ccValues).join(","),
      read_target_ids: formatTargetData(ccValues),
      mytodo: checkboxState.mytodo ? 1 : 0,
      whisper: checkboxState.sendwhiper ? 1 : 0,
      from: moment(startDate).format(getDateFormat(userConfig).toUpperCase()),
      to: moment(endDate).format(getDateFormat(userConfig).toUpperCase()),
    }

    if (params.ismytodo === false && params.receive_target_ids.length === 0) {
      setValidate({ to: true })
      return false
    }

    let files
    if (attachmentRef.current?.getUuid?.()) {
      params.upload_id = attachmentRef.current.getUuid()
      files = attachmentRef.current.getFiles()

      if (typeof files.attachments === "object" && Object.keys(files.attachments).length > 0) {
        try {
          const result = await attachmentRef.current.uploadAndGetFiles()
        } catch (err) {
          errorToast(t("common.commom_hanupload_error_a"))
        }
      }

      if (files.filesCloudDisk && files.filesCloudDisk.length > 0) {
        const webdisk = files.filesCloudDisk.map((file) => ({
          id: file.link,
          name: file.name,
          size: file.size,
        }))

        params.webDiskList = webdisk
      }
    }

    try {
      const writeTodoResponse = await post(URL_WRITE_TODO, params, Headers)
      if (writeTodoResponse?.success) {
        const insertId = writeTodoResponse?.rows?.inserted_id

        if (oldAttachment.length > 0 || files?.filesCloudDisk?.length > 0) {
          let webdisk = []
          if (files?.filesCloudDisk?.length > 0) {
            webdisk = files.filesCloudDisk.map((file) => ({
              id: file.link,
              name: file.name,
              size: file.size,
              link: file.link,
            }))
          }
          const clondFileParams = {
            tdseqno: insertId,
            files: [...oldAttachment, ...webdisk],
          }
          await post(URL_CLONE_FILES_FROM_OTHERS, clondFileParams, Headers)
        }

        await post(
          URL_CONFIG_TODO_UNREAD,
          {
            mode: "config",
            push: "1",
            tdseq: insertId,
          },
          Headers,
        )
      }
      handleClose()
    } catch (error) {
      console.log("error:", error)
    }
  }

  const formatTargetData = (values) => {
    if (isEmpty(values)) return []
    const list = Object.values(values)
    const result = []
    list.forEach((item) => {
      const [cn, no] = item.seqno.split("_")
      result.push(`C${cn}_U${no}`)
    })
    return result
  }

  const renderBody = () => {
    return (
      <div className="position-relative">
        <Row className="gy-2">
          {/* title */}
          <Col lg="12">
            <Label htmlFor="delay-sent" className="col-form-label col-lg-12">
              {t("common.calendar_subject_msg")}
            </Label>
            <Col lg="12" className="d-flex align-items-center gap-1">
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
            </Col>
          </Col>
          {/* priority */}
          <Col lg="12">
            <Label htmlFor="delay-sent" className="col-form-label col-lg-12">
              {t("common.feedback_priority")}
            </Label>
            <Col lg="12" className="d-flex align-items-center gap-1">
              <Select
                value={priority}
                onChange={(value) => setPriority(value)}
                options={priorityOptions.map((o) => ({
                  ...o,
                  label: t(o.label),
                }))}
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
                    borderColor: error?.calendar ? "red" : "#ced4da",
                  }),
                }}
              />
            </Col>
          </Col>
          {/* use category */}
          <Col lg="12">
            <FormGroup check>
              <Input
                id="categoryCheckbox"
                type="checkbox"
                defaultChecked={isUseCategory}
                onClick={() => setIsUseCategory(!isUseCategory)}
              />
              <Label check for="categoryCheckbox">
                {t("common.approval_draft_doc_section")}
              </Label>
            </FormGroup>
          </Col>
          {/* category */}
          {isUseCategory && (
            <Col lg="12">
              <Label htmlFor="delay-sent" className="col-form-label col-lg-12">
                {t("common.approval_draft_doc_section")}
              </Label>
              <Col lg="12" className="d-flex align-items-center gap-1">
                <Select
                  value={category}
                  onChange={(value) => setCategory(value)}
                  options={categoryOptions}
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
                      borderColor: error?.category ? "red" : "#ced4da",
                    }),
                  }}
                />
              </Col>
            </Col>
          )}
          {/* due date */}
          <Col lg="12">
            <Label htmlFor="delay-sent" className="col-form-label col-lg-12">
              {t("common.todo_term_msg")}
            </Label>
            <Row className="gx-3 gy-3">
              <Col md="12" lg="6" className="">
                <HanDatePicker
                  value={startDate}
                  onChange={(date) => {
                    setStartDate(date)
                    if (new Date(date) > new Date(endDate)) {
                      setEndDate(date)
                    }
                  }}
                />
              </Col>
              <Col md="12" lg="6" className="">
                <HanDatePicker value={endDate} onChange={setEndDate} minDate={startDate} />
              </Col>
            </Row>
          </Col>
          {/* to */}
          <Col lg="12">
            <AutoComplete
              isMulti
              title={t("common.mail_write_to")}
              value={Object.values(toValues).map((item) => ({
                ...item,
                value: item?.username,
                label: item?.username,
              }))}
              onChange={handleChangeTo}
              // optionGroup={optionTo}
              maxMenuHeight={MAX_HEIGHT_MENU}
              // onMenuScrollToBottom={handlePageCurrent}
              component={
                <Button
                  color="primary"
                  className="px-1 rounded-none-btn-org"
                  onClick={() => setOpenOrgModal({ open: true, type: "to" })}
                  disabled={checkboxState["mytodo"] ?? false}
                >
                  <i className="mdi mdi-file-tree"></i>
                </Button>
              }
              AutoCompleteComponent={AutoCompleteOrg}
              customComponents={{ MultiValue: CustomMultipleValue }}
              mbForm="mb-form"
              col={12}
              // stylesSelect={CustomStyles}
              // defaultOptions={recentList}
              isDisabled={checkboxState["mytodo"] ?? false}
              invalid={validate?.["to"]}
            />
          </Col>
          {/* checkbox options */}
          <Col lg="12" className="d-flex gap-2">
            {checkboxOptions.map((option) => {
              if (option.value === "sendsms") {
                return (
                  <>
                    {isSms ? (
                      <FormGroup check key={option.value}>
                        <Input
                          id={`check-${option.value}`}
                          type="checkbox"
                          defaultChecked={checkboxState[option.value]}
                          onClick={() =>
                            setCheckboxState((prev) => ({
                              ...prev,
                              [option.value]: !prev[option.value],
                            }))
                          }
                        />
                        <Label check for={`check-${option.value}`}>
                          {t(option.label)}
                        </Label>
                      </FormGroup>
                    ) : null}
                  </>
                )
              } else if (option.value === "mytodo") {
                return (
                  <FormGroup check key={option.value}>
                    <Input
                      id={`check-${option.value}`}
                      type="checkbox"
                      defaultChecked={checkboxState[option.value]}
                      onClick={() => {
                        if (!checkboxState[option.value]) {
                          handleChangeTo([])
                        }
                        setCheckboxState((prev) => ({
                          ...prev,
                          [option.value]: !prev[option.value],
                        }))
                      }}
                    />
                    <Label check for={`check-${option.value}`}>
                      {t(option.label)}
                    </Label>
                  </FormGroup>
                )
              } else {
                return (
                  <FormGroup check key={option.value}>
                    <Input
                      id={`check-${option.value}`}
                      type="checkbox"
                      defaultChecked={checkboxState[option.value]}
                      onClick={() =>
                        setCheckboxState((prev) => ({
                          ...prev,
                          [option.value]: !prev[option.value],
                        }))
                      }
                    />
                    <Label check for={`check-${option.value}`}>
                      {t(option.label)}
                    </Label>
                  </FormGroup>
                )
              }
            })}
          </Col>
          {/* CC */}
          <Col lg="12">
            <AutoComplete
              title={t("common.main_mail_cc")}
              isMulti
              value={Object.values(ccValues).map((item) => ({
                ...item,
                value: item?.username,
                label: item?.username,
              }))}
              onChange={handleChangeCc}
              // optionGroup={optionTo}
              maxMenuHeight={MAX_HEIGHT_MENU}
              // onMenuScrollToBottom={handlePageCurrent}
              component={
                <Button
                  color="primary"
                  className="px-1 rounded-none-btn-org"
                  // onClick={handleOpenOrgModal}
                  onClick={() => setOpenOrgModal({ open: true, type: "cc" })}
                >
                  <i className="mdi mdi-file-tree"></i>
                </Button>
              }
              AutoCompleteComponent={AutoCompleteOrg}
              customComponents={{ MultiValue: CustomMultipleValue }}
              mbForm="mb-form"
              col={12}
              // stylesSelect={CustomStyles}
              // defaultOptions={recentList}
            />
          </Col>
          {/* attachment */}
          <Col lg="12">
            <Label htmlFor="delay-sent" className="pb-0 col-form-label col-lg-12">
              {t("common.approval_execute_attach")}
            </Label>
            <div className={`mb-2`}>
              <HanAttachment ref={attachmentRef} />
            </div>

            {/* old attachment */}
            {oldAttachment.length > 0 && (
              <div className="py-2">
                <h6 className="mb-0">
                  {t("common.board_attach_msg")} ({mail?.file?.length} {t("common.common_files")},{" "}
                  {mail?.fileinfo?.totsize})
                </h6>

                <AttachmentMailList
                  mailList={oldAttachment}
                  gridMode={false}
                  isOpen={true}
                  isShowButton={{
                    download: false,
                    preview: false,
                    delete: true,
                  }}
                  onActionModal={handleDeleteFile}
                />
              </div>
            )}
          </Col>

          {/* editor */}
          <Col lg="12">
            <Col lg="12" className="d-flex align-items-center gap-1">
              <HanEditor
                options={{ height: 600, visual: false }}
                parentClass="w-100"
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
    <>
      <BaseModal
        open={open}
        toggle={() => {
          handleClose()
        }}
        backdrop={"static"}
        modalClass="write-todo-modal"
        renderHeader={() => t("common.todo_todo_write_msg")}
        renderBody={renderBody}
        renderFooter={() => (
          <>
            <BaseButton
              type="button"
              className="st-sg-modal-btn-save"
              color="primary"
              onClick={handleWriteTodo}
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
      {openOrgModal.open && (
        <GroupwareOrgModal
          open={openOrgModal.open}
          handleClose={() => setOpenOrgModal({ open: false, type: "to" })}
          onSave={handleChangeOrg}
          selectedData={openOrgModal.type === "to" ? toValues : ccValues}
        />
      )}
    </>
  )
}

export default ModalWriteTodo
