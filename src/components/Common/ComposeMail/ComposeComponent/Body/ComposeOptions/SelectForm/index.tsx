// @ts-nocheck
import { useState, useContext } from "react"
import { useTranslation } from "react-i18next"
import { ComposeContext } from "components/Common/ComposeMail"
import { Button } from "reactstrap"
import HanFormSelect from "components/Common/HanSelectForm"
import HanTooltip from "components/Common/HanTooltip"

const SelectForm = () => {
  const { t } = useTranslation()
  const { handleChangeEditor } = useContext(ComposeContext)

  const [isShowPopup, setIsShowPopup] = useState(false)

  return (
    <>
      <HanTooltip placement="top" overlay={t("common.board_select_form_msg")}>
        <Button
          outline
          onClick={() => setIsShowPopup(true)}
          className={`compose-option-btn ${isShowPopup ? "active" : ""}`}
        >
          <i className="mdi mdi-form-select fs-5"></i>
        </Button>
      </HanTooltip>

      {isShowPopup && (
        <HanFormSelect
          open={isShowPopup}
          handleClose={() => setIsShowPopup(!isShowPopup)}
          onSave={(value) => {
            handleChangeEditor(value.form, false, "form")
          }}
        />
      )}
    </>
  )
}

export default SelectForm
