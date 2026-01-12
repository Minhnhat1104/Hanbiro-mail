// @ts-nocheck
import { List, Popover } from "@mui/material"
import { BaseIcon } from "components/Common"
import useDevice from "hooks/useDevice"
import { useEffect, useMemo, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { Button } from "reactstrap"
import useMenu from "utils/useMenu"
import { getInitFilterFolder } from "."

const MobileFolderFilter = (props) => {
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

  const folderRef = useRef(null)

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
    setOpenDropdown((prev) => !prev)
  }
  const isChecked = (data) => {
    return folderSelected.includes(data.key)
  }

  return (
    <>
      <div
        ref={folderRef}
        className={"p-2 d-flex justify-content-between align-items-center w-100"}
        onClick={onClickToggle}
      >
        {t("mail.mail_mobile_mbox")}
        <BaseIcon
          icon={`fas fa-chevron-${openDropdown ? "down" : "right"} text-secondary`}
          className={"ms-1"}
        />
      </div>
      <Popover
        id={`folder-popover`}
        open={openDropdown}
        onClose={() => setOpenDropdown((prev) => !prev)}
        anchorEl={folderRef.current}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{
          "& .MuiPopover-paper": {
            p: 0.5,
            boxShadow:
              "0px 10px 13px -6px rgba(0,0,0,0.2),0px 20px 100px 3px rgba(0,0,0,0.14),0px 8px 200px 7px rgba(0,0,0,0.12)",
          },
        }}
      >
        <List
          component="nav"
          sx={{
            p: 0,
            width: 200,
            borderRadius: 0.5,
          }}
        >
          {allMenu &&
            allMenu.length > 0 &&
            allMenu.map((folder, index) => (
              <div key={folder.key} className={"p-1"} onClick={(e) => e.stopPropagation()}>
                <div className="form-check form-check-end">
                  <input
                    onClick={(e) => handleSelectFolder(e, folder)}
                    className="form-check-input"
                    id={`mailbox-${index}`}
                    type="checkbox"
                    defaultChecked={isChecked(folder)}
                  />
                  <label className="form-check-label" htmlFor={`mailbox-${index}`}>
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
        </List>
      </Popover>
    </>
  )
}

export default MobileFolderFilter
