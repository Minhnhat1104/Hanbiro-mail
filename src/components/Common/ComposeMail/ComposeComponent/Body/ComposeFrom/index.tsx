// @ts-nocheck
import { borderBottomStyles, colourStyles } from "components/Common/HanSelect"
import DropdownIndicator from "components/Common/HanSelect/DropdownIndicator"
import { useTranslation } from "react-i18next"
import Select from "react-select"
import { Label } from "reactstrap"

const ComposeFrom = (props) => {
  const {
    onChange,
    value,
    title,
    optionGroup,
    mbForm = "",
    formClass = "",
    col = 9,
    maxMenuHeight = 300,
    onMenuScrollToBottom = () => {},
    placeholder = "common.org_select",
    modalPortal,
    ...rest
  } = props

  const { t } = useTranslation()

  return (
    <div className={`compose-fields mb-2 d-flex align-items-center gap-2`}>
      {title && (
        <Label htmlFor={title} className={`col-form-label`}>
          {title}
        </Label>
      )}
      <Select
        value={value}
        onChange={onChange}
        options={optionGroup}
        // menuIsOpen={true}
        maxMenuHeight={maxMenuHeight}
        onMenuScrollToBottom={onMenuScrollToBottom}
        placeholder={t(placeholder) + "..."}
        menuPosition="absolute"
        menuPortalTarget={modalPortal}
        styles={{ ...colourStyles, ...borderBottomStyles }}
        className="react-select-auto-width"
        components={{
          IndicatorSeparator: () => null,
          IndicatorsContainer: DropdownIndicator,
        }}
        {...rest}
      />
    </div>
  )
}

export default ComposeFrom
