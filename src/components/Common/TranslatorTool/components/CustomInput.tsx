// @ts-nocheck
import { TextField } from "@mui/material"
import "flag-icon-css/css/flag-icons.min.css"
import "./styles.scss"
import { Input } from "reactstrap"

const CustomInput = (props) => {
  const { icon = "flag-icon flag-icon-us", ...rest } = props

  return (
    <div className="lang-custom-input">
      <div className="flag-wrapper">
        <span className={icon}></span>
      </div>
      <Input {...rest} />
    </div>
  )
}

export default CustomInput
