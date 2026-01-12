// @ts-nocheck
import { BaseButtonDropdown, BaseIcon } from "components/Common"
import BaseIconTooltip from "components/Common/BaseIconTooltip"
import React from "react"
import { useTranslation } from "react-i18next"
import { DropdownItem } from "reactstrap"
import "./styles.scss"

const MobileButton = ({ item, index, handleMove, handleDelete }) => {
  const { t } = useTranslation()

  return (
    <BaseButtonDropdown
      icon="mdi mdi-cog-outline"
      iconClassName="m-0"
      classDropdownMenu="mobile-button-dropdown"
    >
      <DropdownItem id={`up-${index}`}>
        <BaseIcon
          className="mdi mdi-arrow-up font-size-18 color-green"
          onClick={() => handleMove && handleMove(item, "up", item.order, index)}
        />
      </DropdownItem>
      <DropdownItem id={`down-${index}`}>
        <BaseIcon
          className="mdi mdi-arrow-down font-size-18 color-blue"
          onClick={() => handleMove && handleMove(item, "down", item.order, index)}
        />
      </DropdownItem>
      <DropdownItem id={`delete-${index}`}>
        <BaseIcon
          className="mdi mdi-trash-can-outline font-size-18 color-red"
          onClick={() => handleDelete && handleDelete(item.order)}
        />
      </DropdownItem>
    </BaseButtonDropdown>
  )
}

export default MobileButton
