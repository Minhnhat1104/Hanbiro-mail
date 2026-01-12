// @ts-nocheck
import React, { useState } from "react";
import {
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
} from "reactstrap";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "react-datepicker/dist/react-datepicker.css"


const Dropdowns = props => {

  const [singlebtn, setSinglebtn] = useState(false)
  return (
    <>
      <Dropdown
        isOpen={singlebtn}
        toggle={() => setSinglebtn(!singlebtn)}
        className="title-flag-btn"
      >
        <DropdownToggle >
        {props.title}
        </DropdownToggle>
        <DropdownMenu>
          {/* <DropdownItem>Action</DropdownItem>
          <DropdownItem>Another action</DropdownItem>
          <DropdownItem>Something else here</DropdownItem> */}
          {props.content}
        </DropdownMenu>
      </Dropdown>
    </>
  )
}

export default Dropdowns
