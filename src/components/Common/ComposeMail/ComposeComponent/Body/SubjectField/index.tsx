// @ts-nocheck
import { useContext, useState } from "react"
import { ComposeContext } from "components/Common/ComposeMail"
import { useTranslation } from "react-i18next"

import { COL_LAYOUT_COMPOSE } from ".."
import BaseInput from "components/SettingAdmin/Inputwriting"
import ComposeOptions from "../ComposeOptions"
import { Col, Input, Label, Row } from "reactstrap"

const SubjectField = ({ onClickAttachmentOption }) => {
  const { t } = useTranslation()
  const { subject, handleChangeSubject } = useContext(ComposeContext)

  const [isInvalid, setIsInvalid] = useState(false)

  return (
    <>
      {/* <BaseInput
        mbForm={""}
        formClass="mb-0"
        title={t("common.mail_write_subject")}
        note={t("common.mail_write_subject") + "..."}
        col={COL_LAYOUT_COMPOSE}
        value={subject}
        onChange={handleChangeSubject}
        // invalid={isInvalid}
        // onBlur={() => setIsInvalid(subject === "")}
      /> */}
      <div className={`compose-fields d-flex gap-2 mb-2`}>
        <Label htmlFor={"compose-subject"} className={`col-form-label text-nowrap`}>
          {t("common.mail_write_subject")}
        </Label>
        <Input
          id={"compose-subject"}
          className="form-control border-0 ps-0"
          placeholder={t("mail.mail_mobile_subjecterr")}
          value={subject}
          onChange={handleChangeSubject}
        />
      </div>

      {/* <Row lg="12" className="mt-1">
        <Col lg={`${12 - COL_LAYOUT_COMPOSE}`}></Col>
        <Col lg={COL_LAYOUT_COMPOSE}>
          <ComposeOptions onClickAttachmentOption={onClickAttachmentOption} />
        </Col>
      </Row> */}
    </>
  )
}

export default SubjectField
