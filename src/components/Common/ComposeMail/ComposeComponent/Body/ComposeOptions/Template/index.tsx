// @ts-nocheck
import React, { useState } from "react"
import { useTranslation } from "react-i18next"

import { Button } from "reactstrap"
import ComposeTemplateModal from "components/Common/ComposeMail/ComposeTemplateModal"
import HanTooltip from "components/Common/HanTooltip"

const Template = () => {
  const { t } = useTranslation()

  const [showModal, setShowModal] = useState()

  return (
    <>
      <HanTooltip placement="top" overlay={t("mail.mail_template")}>
        <Button
          outline
          onClick={() => setShowModal(true)}
          className={`compose-option-btn ${showModal ? "active" : ""}`}
        >
          <i className="mdi mdi-image-multiple-outline pe-1 fs-5" />
        </Button>
      </HanTooltip>

      <ComposeTemplateModal show={showModal} setShow={setShowModal} />
    </>
  )
}

export default Template
