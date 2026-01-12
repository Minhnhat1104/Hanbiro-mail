// @ts-nocheck
// React
import { useContext } from "react"

// Third-party
import { useTranslation } from "react-i18next"
import { DropdownItem, DropdownMenu, Input } from "reactstrap"

import BaseIcon from "components/Common/BaseIcon"
import { ComposeContext } from "components/Common/ComposeMail/index"
import HanTooltip from "components/Common/HanTooltip"
import "./styles.scss"

const SendingOptions = ({ setIsShowSendingOptions }) => {
  const { sendingOptions, handleChangeSendingOptions, isShowImmediateSending } =
    useContext(ComposeContext)
  const { t } = useTranslation()

  const handleOnClick = () => {}

  const handleOnChange = (e) => {
    e.stopPropagation()
    // const { name, checked } = e.target
    // handleChangeSendingOptions(name, checked)
  }

  return (
    <DropdownMenu className="mt-2 box-shadow-lg">
      <DropdownItem
        className="d-flex align-items-center"
        toggle={false}
        onClick={() => handleChangeSendingOptions("saveInSendbox", !sendingOptions.saveInSendbox)}
      >
        <Input
          type="checkbox"
          className="mt-0"
          onChange={handleOnChange}
          checked={sendingOptions.saveInSendbox}
        />
        <label className="mb-0 mx-2 cursor-pointer">{t("common.mail_write_savesent")}</label>
      </DropdownItem>
      <DropdownItem
        toggle={false}
        className="d-flex align-items-center"
        onClick={() => {
          handleChangeSendingOptions("sendAsImportant", !sendingOptions.sendAsImportant)
        }}
      >
        <Input
          type="checkbox"
          className="mt-0"
          onChange={handleOnChange}
          checked={sendingOptions.sendAsImportant}
        />
        <label className="mb-0 mx-2 cursor-pointer">{t("mail.mail_write_important_msg")}</label>
      </DropdownItem>
      <DropdownItem
        toggle={false}
        className="d-flex align-items-center"
        onClick={() => handleChangeSendingOptions("sendIndividual", !sendingOptions.sendIndividual)}
      >
        <Input
          type="checkbox"
          className="mt-0"
          onChange={handleOnChange}
          checked={sendingOptions.sendIndividual}
        />
        <label className="mb-0 mx-2 cursor-pointer">{t("common.mail_send_mail_individual")}</label>
        <HanTooltip
          overlayClassName="sending-tooltip"
          overlay={
            <span
              style={{ maxWidth: "300px" }}
              dangerouslySetInnerHTML={{
                __html: t(
                  "common.you_can_hide_the_email_recipients_information_by_individual_sending",
                ),
              }}
            ></span>
          }
          placement="top"
        >
          <BaseIcon icon="mdi mdi-information-outline" />
        </HanTooltip>
      </DropdownItem>

      {/* show immediate sending checkbox */}
      {isShowImmediateSending && (
        <DropdownItem
          toggle={false}
          className="d-flex align-items-center"
          onClick={() =>
            handleChangeSendingOptions("immediateSending", !sendingOptions.immediateSending)
          }
        >
          <Input
            type="checkbox"
            className="mt-0"
            onChange={handleOnChange}
            checked={sendingOptions.immediateSending}
          />
          <label className="mb-0 mx-2 cursor-pointer">{t("mail.mail_immediate_sending")}</label>
        </DropdownItem>
      )}
      <DropdownItem toggle={false} divider></DropdownItem>
      <DropdownItem toggle={false} className="font-size-14 fw-bold">
        {t("common.board_office_preview_msg")}
      </DropdownItem>
      <DropdownItem
        toggle={false}
        className="d-flex align-items-center"
        onClick={() => handleChangeSendingOptions("previewMode", "a")}
      >
        <Input
          name="radio-sending-options"
          type="radio"
          className="mt-0"
          checked={sendingOptions.previewMode === "a"}
          onChange={handleOnChange}
        />
        <label className="mb-0 mx-2 cursor-pointer">{t("mail.mail_before_preview_all")}</label>
      </DropdownItem>
      <DropdownItem
        toggle={false}
        className="d-flex align-items-center"
        onClick={() => handleChangeSendingOptions("previewMode", "f")}
      >
        <Input
          name="radio-sending-options"
          type="radio"
          className="mt-0"
          checked={sendingOptions.previewMode === "f"}
          onChange={handleOnChange}
        />
        <label className="mb-0 mx-2 cursor-pointer">{t("mail.mail_before_only_important")}</label>
      </DropdownItem>
      <DropdownItem
        toggle={false}
        className="d-flex align-items-center"
        onClick={() => handleChangeSendingOptions("previewMode", "n")}
      >
        <Input
          name="radio-sending-options"
          type="radio"
          className="mt-0"
          checked={sendingOptions.previewMode === "n"}
          onChange={handleOnChange}
        />
        <label className="mb-0 mx-2 cursor-pointer">{t("mail.mail_before_not_used")}</label>
      </DropdownItem>
    </DropdownMenu>
  )
}

export default SendingOptions
