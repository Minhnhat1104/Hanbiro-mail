// @ts-nocheck
import React, { useState } from "react"
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap"
import BaseIcon from "components/Common/BaseIcon"
import { useTranslation } from "react-i18next"

export const FILTERS_SEARCH = [
  {
    id: "all",
    text: "common.holiday_allsearchbtn",
  },
  {
    id: "name",
    text: "common.name",
  },
  {
    id: "desc",
    text: "common.board_memo_msg",
  },
  {
    id: "memo",
    text: "common.holiday_memo",
  },
  {
    id: "tag",
    text: "Tag",
  },
  {
    id: "writer",
    text: "common.admin_create_user",
  },
]

function index({ typeSearchChoosed = {}, onChange = () => {} }) {
  const { t } = useTranslation()
  const [showDropdown, setShowDropdown] = useState(false)
  return (
    <Dropdown isOpen={showDropdown} toggle={() => setShowDropdown(!showDropdown)} direction="down">
      <DropdownToggle
        tag="span"
        onClick={() => setShowDropdown(!showDropdown)}
        data-toggle="dropdown"
        aria-expanded={showDropdown}
      >
        <BaseIcon className="mdi mdi-filter han-color-grey" />
      </DropdownToggle>
      <DropdownMenu style={{ zIndex: 1055 }}>
        {FILTERS_SEARCH.map((item) => (
          <DropdownItem
            active={typeSearchChoosed?.id === item?.id}
            key={item?.id}
            onClick={(e) => {
              e.preventDefault()
              onChange(item)
            }}
          >
            {t(item.text)}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  )
}

export default index
