// @ts-nocheck
import { Col, Input, Label, Row } from "reactstrap"

const ComposeTextArea = (props) => {
  const {
    title,
    note,
    value,
    onChange,
    autoComplete = "on",
    col = 12,
    formClass = "mb-2",
    noMargin = false,
    ...rest
  } = props
  return (
    <Row className={formClass} noMargin={noMargin}>
      <Label htmlFor="compose-text-area" className={`col-form-label col-lg-12`}>
        {title}
      </Label>
      <Col lg={12}>
        <Input
          id="compose-text-area"
          name="compose-text-area"
          type="textarea"
          value={value}
          className="form-control border-0"
          placeholder={note}
          onChange={onChange}
          autoComplete={autoComplete}
          {...rest}
        />
      </Col>
    </Row>
  )
}

export default ComposeTextArea
