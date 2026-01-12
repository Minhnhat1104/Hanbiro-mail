// @ts-nocheck
// React
import React, { Suspense, useContext, useEffect, useMemo, useRef } from "react"

// Third-party
import { useTranslation } from "react-i18next"
import { Col, FormText, Input, Label, Row } from "reactstrap"

// Project
import { HanAttachment } from "components/Common/Attachment"
import { borderBottomStyles, colourStyles } from "components/Common/HanSelect"
import { File, Trash2 } from "react-feather"
import { ComposeContext } from "../.."
import Cipher from "../../Cipher"
import "../../style.scss"
import AttachmentForward from "./AttachmentForward"
import ComposeFrom from "./ComposeFrom"
import ComposeSelect from "./ComposeSelect"
import ComposeTextArea from "./ComposeTextArea"
import Receivers from "./Receivers"
import SubjectField from "./SubjectField"
const HanEditor = React.lazy(() => import("components/Common/Editor/HanEditor"))

export const MAX_HEIGHT_MENU = 150

export const CustomStyles = {
  menu: (base) => ({
    ...base,
    zIndex: "2000",
  }),
  control: (base) => ({
    ...base,
    borderTopRightRadius: "0",
    borderBottomRightRadius: "0",
  }),
}

export const COL_LAYOUT_COMPOSE = 10

const ComposeBody = ({ currentMenu, isCollapseMode, bodyRef, composeId }) => {
  const {
    fromValue,
    optionFrom,
    handleChangeFrom,
    selectApproval,
    optionsApproval,
    finalApproval,
    mapprover,
    handleChangeSelectApproval,
    midApproval,
    handleChangeMidApproval,
    editorValue,
    handleChangeEditor,
    enableCipher,
    attachmentRef,
    securePassword,
    setSecurePassword,
    fileForward,
    handleDeleteFileForward,
    emails,
    setEmails,
    attachOptions,
    attachmentFiles,
    setAttachmentFiles,
    errors,
  } = useContext(ComposeContext)

  const { t } = useTranslation()

  const toAddrRef = useRef(null)

  // State for Subject
  const midApprovalOptions = useMemo(() => {
    if (selectApproval?.mmanager?.mlist?.length > 0) {
      let newOptions = selectApproval?.mmanager?.mlist.map((item) => {
        let showName = item?.groupname != "" ? item?.groupname + " / " : ""
        showName += item?.posname != "" ? item?.posname + " / " : ""
        showName += item?.name + " (" + item?.id + ")"

        return {
          ...item,
          label: showName,
          value: item.id,
        }
      })
      newOptions.unshift({
        label: "",
        value: "",
      })

      return newOptions
    }
    return []
  }, [selectApproval, finalApproval])

  // State for Options
  // const [attachOptions, setAttachOptions] = useState(false)
  // const [sendingOptions, setSendingOptions] = useState(false)

  useEffect(() => {
    if (toAddrRef.current) {
      toAddrRef.current.focus()
    }
  }, [toAddrRef.current])

  return (
    <div className="d-flex flex-column h-100" ref={bodyRef}>
      <div>
        {/* From */}
        <ComposeFrom
          title={t("mail.mail_write_from")}
          optionGroup={optionFrom}
          onChange={handleChangeFrom}
          value={fromValue}
          formClass="pt-0 mb-2"
          col={COL_LAYOUT_COMPOSE}
        />
        {/* Secure */}
        {currentMenu === "Secure" && (
          <>
            <div className={`compose-fields d-flex gap-3 mb-2`}>
              <Label htmlFor={"compose-secure"} className={`col-form-label`}>
                {t("mail.mail_write_secureinputpass").replace("<br>", "").replace("<br/>", "")}
              </Label>
              <Input
                id={"compose-secure"}
                type="password"
                className="form-control border-0 ps-0 flex-grow-1 w-auto"
                value={securePassword}
                onChange={(e) => setSecurePassword(e.target.value)}
              />
            </div>
            <FormText>{t("mail.mail_write_securealert1")}</FormText>
          </>
        )}
        {/* To, CC, BCC */}
        <Receivers innerRef={toAddrRef} composeId={composeId} errors={errors} />

        {/* Selection of Approval */}
        {(selectApproval.label !== "" || finalApproval.isselect) && (
          <ComposeSelect
            composeFieldsClass="compose-fields"
            title={t("mail.mail_approval_selection")}
            optionGroup={optionsApproval}
            onChange={(value) => handleChangeSelectApproval(value)}
            value={selectApproval}
            stylesSelect={{ ...colourStyles, ...borderBottomStyles }}
            isDisabled={
              finalApproval?.managerids?.length == 1 &&
              (!finalApproval?.isselect ||
                (selectApproval?.ismmanager && selectApproval?.mmanager?.mselect))
            }
            menuPosition="absolute"
            menuPortalTarget={undefined}
          />
        )}
        {/* Mid-approver */}
        {finalApproval?.managerids?.length > 0 &&
          selectApproval?.mmanager &&
          Object.keys(selectApproval?.mmanager).length > 0 &&
          !selectApproval?.mmanager?.mselect && (
            <ComposeTextArea
              noMargin={true}
              title={t("mail.mail_mid_approver")}
              value={mapprover?.showInputList}
              disabled={true}
            />
          )}
        {selectApproval?.ismmanager && selectApproval?.mmanager?.mselect && (
          <ComposeSelect
            composeFieldsClass="compose-fields"
            title={t("mail.mail_mid_approver")}
            optionGroup={midApprovalOptions}
            onChange={(value) => handleChangeMidApproval(value)}
            value={midApproval}
            stylesSelect={{ ...colourStyles, ...borderBottomStyles }}
            menuPosition="absolute"
            menuPortalTarget={undefined}
          />
        )}

        {/* Subject */}
        <SubjectField />

        {(fileForward.length > 0 || (Array.isArray(emails) && emails?.length > 0)) && (
          <div className="row align-items-center mb-0">
            <Label htmlFor="compose-subject" className={`col-form-label col-lg-${12}`}>
              {t("common.board_option_msg")}
            </Label>
            <Col lg={12}>
              {Array.isArray(emails) &&
                emails?.map((_email, i) => (
                  <div
                    key={_email?.uuid}
                    className={`d-flex flex-row justify-content-between align-items-center w-100 mb-3 ${
                      i === 0 ? "mt-2" : ""
                    }`}
                  >
                    <div className="d-flex flex-row align-items-center" style={{ width: "95%" }}>
                      <File size={12} className="me-1" />
                      <span className="w-100">{_email?.filename}</span>
                    </div>

                    <Trash2
                      onClick={() => {
                        setEmails((prev) => prev?.filter((_item) => _item?.uuid !== _email?.uuid))
                      }}
                      className="text-danger"
                      size={12}
                      style={{ cursor: "pointer" }}
                    />
                  </div>
                ))}
              {fileForward.length > 0 && emails.length === 0 && (
                <AttachmentForward fileList={fileForward} onDeleteFile={handleDeleteFileForward} />
              )}
            </Col>
          </div>
        )}

        <Row className="mb-2">
          {/* <Col lg={`${12 - COL_LAYOUT_COMPOSE}`}></Col> */}
          <Col lg={12}>
            <div className={`mb-2 d-${attachOptions ? "block" : "none"}`}>
              <HanAttachment
                ref={attachmentRef}
                onAttachmentsChange={setAttachmentFiles}
                value={attachmentFiles}
              />
            </div>
            {enableCipher && (
              <div className="mb-2">
                <Cipher />
              </div>
            )}
          </Col>
        </Row>
      </div>

      {/* Editor */}
      <div className="compose-editor-wrapper flex-grow-1">
        <Suspense
          className="h-100"
          fallback={
            <div className="text-center mg-t-20">
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only"></span>
              </div>
            </div>
          }
        >
          <HanEditor
            onChange={handleChangeEditor}
            value={editorValue}
            options={{ height: isCollapseMode ? "500px" : "750px", convert_urls: false }}
          />
        </Suspense>
      </div>
    </div>
  )
}

export default ComposeBody
