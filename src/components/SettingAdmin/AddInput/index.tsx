// @ts-nocheck
import React from "react";
import {
  InputGroup, Label
} from "reactstrap";
import BaseIcon from "components/Common/BaseIcon";

const InputSearch = (props) => {
  const { title, ...rest } = props
  return (
    <>
      <div className="col-sm-auto" >
        <Label className="visually-hidden" htmlFor="autoSizingInputGroup"> Username</Label>
        <InputGroup >
          <div className="input-group-text" style={{ color: 'white', background: '#0066FF', border: '1px solid #0066FF' }}><BaseIcon className={'bx bx-plus'} />
            <span style={{ marginLeft: "5px" }}>{props.title}</span></div>
          <input {...rest} type="text" className="form-control" id="autoSizingInputGroup" placeholder={props.note} />
        </InputGroup>
      </div>
    </>
  )
}

export default InputSearch
