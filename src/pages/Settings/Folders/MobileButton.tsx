// @ts-nocheck
import { BaseButtonDropdown, BaseIcon } from "components/Common"
import { useTranslation } from "react-i18next"
import { DropdownItem } from "reactstrap"
import "./styles.scss"

const MobileButton = ({
  item,
  setBoxId,
  setOpenModalConfirm,
  setOpenModalUploadEml,
  handleDownloadBackupMailbox,
}) => {
  const { t } = useTranslation()

  return (
    <BaseButtonDropdown
      icon="mdi mdi-cog-outline color-blue"
      iconClassName="m-0"
      classDropdownMenu="mobile-button-dropdown"
    >
      <DropdownItem>
        <BaseIcon
          className="color-red me-1"
          icon={"mdi mdi-trash-can-outline font-size-18"}
          onClick={() => {
            setBoxId(item.key)
            setOpenModalConfirm(true)
          }}
        />
      </DropdownItem>
      {item?.canshare && (
        <DropdownItem>
          <BaseIcon
            className="color-blue me-1"
            icon={"mdi mdi-upload font-size-18"}
            onClick={() => {
              setBoxId(item.key)
              setOpenModalUploadEml(true)
            }}
          />
        </DropdownItem>
      )}
      <DropdownItem>
        <BaseIcon
          className="color-blue"
          icon={"mdi mdi-download font-size-18"}
          onClick={() => handleDownloadBackupMailbox(undefined, undefined, item.key)}
        />
      </DropdownItem>
    </BaseButtonDropdown>
  )
}

export default MobileButton
