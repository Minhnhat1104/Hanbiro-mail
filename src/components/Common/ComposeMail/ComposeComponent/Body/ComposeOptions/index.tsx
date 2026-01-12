// @ts-nocheck
import { ComposeContext } from "components/Common/ComposeMail"
import HanTooltip from "components/Common/HanTooltip"
import useDevice from "hooks/useDevice"
import { useContext, useState } from "react"
import { useTranslation } from "react-i18next"
import { Button, DropdownToggle, UncontrolledDropdown } from "reactstrap"
import SendingOptions from "../SendingOptions"
import SelectForm from "./SelectForm"
import Signature from "./Signature"
import Template from "./Template"

const ComposeOptions = ({ onClickAttachmentOption }) => {
  const { t } = useTranslation()
  const { isMobile, isVerticalTablet } = useDevice()

  const {
    handleChangeCipher,
    enableCipher,
    handleShowEditorToolbar,
    isShowEditorToolbar,
    attachOptions,
  } = useContext(ComposeContext)
  const [isShowSendingOptions, setIsShowSendingOptions] = useState(false)

  return (
    <>
      <div
        className={`compose-options-btn d-flex flex-wrap justify-content-end gap-2 ${
          isMobile ? "flex-column" : "flex-row"
        } `}
      >
        <div
          className={`d-flex gap-2 ${isMobile ? "justify-content-center align-items-center" : ""}`}
        >
          {!isMobile && !isVerticalTablet && (
            <HanTooltip placement="top" overlay={t("Formatting options")}>
              <Button
                outline
                className={`compose-option-btn ${isShowEditorToolbar ? "active" : ""}`}
                onClick={handleShowEditorToolbar}
              >
                <i className="mdi mdi-format-color-text fs-4"></i>
              </Button>
            </HanTooltip>
          )}

          <HanTooltip placement="top" overlay={t("common.board_file_msg")}>
            <Button
              outline
              className={`compose-option-btn ${attachOptions ? "active" : ""}`}
              onClick={() => {
                onClickAttachmentOption()
              }}
            >
              <i className="mdi mdi-attachment fs-5"></i>
            </Button>
          </HanTooltip>

          <SelectForm />

          <Signature />

          <Template />

          <HanTooltip placement="top" overlay={t("mail.mail_cipher")}>
            <Button
              outline
              onClick={() => handleChangeCipher("enableCipher")}
              className={`compose-option-btn ${enableCipher ? "active" : ""}`}
            >
              <i className="mdi mdi-lock fs-5"></i>
            </Button>
          </HanTooltip>

          <HanTooltip placement="top" overlay={t("common.common_action_msg")}>
            <UncontrolledDropdown
              className="title-flag-btn"
              isOpen={isShowSendingOptions}
              toggle={() => setIsShowSendingOptions(!isShowSendingOptions)}
            >
              <DropdownToggle
                outline
                className={`d-flex align-items-center gap-1 compose-option-btn ${
                  isShowSendingOptions ? "active" : ""
                }`}
              >
                <i className="mdi mdi-dots-vertical fs-5"></i>
              </DropdownToggle>
              <SendingOptions />
            </UncontrolledDropdown>
          </HanTooltip>
        </div>
      </div>
    </>
  )
}

export default ComposeOptions
