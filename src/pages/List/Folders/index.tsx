// @ts-nocheck
import { BaseIcon } from "components/Common"
import useDevice from "hooks/useDevice"
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { Button, ButtonDropdown, DropdownMenu, DropdownToggle } from "reactstrap"
import useMenu from "utils/useMenu"

export const getInitFilterFolder = (queryParams) => {
  if (queryParams?.["searchbox"] && queryParams["searchbox"] !== "all") {
    return queryParams["searchbox"].split(",")
  } else {
    return null
  }
}

const Folders = (props) => {
  const { onFilterChange, isReset, setIsReset, isMobileFilter } = props
  const { isMobile } = useDevice()
  const { basicMenus, folderMenus } = useMenu()
  const { t } = useTranslation()

  // redux state
  const queryParams = useSelector((state) => state.QueryParams.query)

  const allMenu = useMemo(() => {
    return [...basicMenus, ...folderMenus]
  }, [basicMenus, folderMenus])

  const initfolderSelected = useMemo(() => {
    const nfolders = allMenu.map((item) => item.key)
    return nfolders
  }, [allMenu])

  const [folderSelected, setFolderSelected] = useState(
    () => getInitFilterFolder(queryParams) ?? initfolderSelected,
  )
  const [openDropdown, setOpenDropdown] = useState(false)

  useEffect(() => {
    if (isReset) {
      setFolderSelected(initfolderSelected)
      setIsReset && setIsReset(false)
    }
  }, [isReset])

  const handleSelectFolder = (e, data) => {
    e.stopPropagation()
    if (e.target.checked) {
      setFolderSelected((prev) => {
        const nSelect = [...prev]
        nSelect.push(data.key)
        return nSelect
      })
    } else {
      const nSelect = [...folderSelected].filter((item) => item !== data.key)
      setFolderSelected(nSelect)
    }
  }

  const handleSave = () => {
    onFilterChange && onFilterChange("searchbox", "searchbox", folderSelected)
    setOpenDropdown(false)
  }
  const onClickToggle = () => {
    setOpenDropdown(!openDropdown)
  }
  const isChecked = (data) => {
    return folderSelected.includes(data.key)
  }

  return (
    <ButtonDropdown
      isOpen={openDropdown}
      toggle={(e) => {
        e.stopPropagation()
        setOpenDropdown(!openDropdown)
      }}
      className={"han-h5 han-fw-regular han-text-primary base-button-dropdown"}
      direction={isMobileFilter ? "left" : "down"}
    >
      <DropdownToggle className={"btn dropdown-toggle"} tag="div" onClick={onClickToggle}>
        {t("mail.mail_mobile_mbox")}
        <BaseIcon
          icon={`fas fa-chevron-${isMobileFilter ? "right" : "down"} text-secondary`}
          className={"ms-1"}
        />
      </DropdownToggle>
      <DropdownMenu className={""}>
        {allMenu &&
          allMenu.length > 0 &&
          allMenu.map((folder, index) => (
            <div key={folder.key} className={"dropdown-item"} onClick={(e) => e.stopPropagation()}>
              <div className="form-check form-check-end">
                <input
                  onClick={(e) => handleSelectFolder(e, folder)}
                  className="form-check-input"
                  id={`mailbox-${index}`}
                  type="checkbox"
                  defaultChecked={isChecked(folder)}
                />
                <label className="han-h5 han-fw-regular han-text-primary form-check-label" htmlFor={`mailbox-${index}`}>
                  {folder.name}
                </label>
              </div>
            </div>
          ))}
        <div className="d-flex justify-content-end">
          <Button size="" color="primary" className={`px-2 py-1 mt-2 me-2`} onClick={handleSave}>
            {t("common.common_btn_save")}
          </Button>
        </div>
      </DropdownMenu>
    </ButtonDropdown>
  )
}

export default Folders
