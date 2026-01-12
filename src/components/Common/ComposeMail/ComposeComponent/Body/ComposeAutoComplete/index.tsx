// @ts-nocheck
// Third-party
import AutoCompleteMail from "components/Common/AutoCompleteMail"
import { Label } from "reactstrap"

const ComposeAutoComplete = (props) => {
  const { AutoCompleteComponent, component, mbForm, formClass, col = 9, innerRef, ...rest } = props

  return (
    <div className="compose-fields mb-2 d-flex align-items-center gap-2">
      <Label htmlFor="taskname" className={`col-form-label`}>
        {props.title}
      </Label>
      {AutoCompleteComponent ? (
        <AutoCompleteComponent component={component} {...rest} />
      ) : (
        <AutoCompleteMail component={component} {...rest} innerRef={innerRef} />
      )}

      {!!component && component}
    </div>
  )
}

export default ComposeAutoComplete