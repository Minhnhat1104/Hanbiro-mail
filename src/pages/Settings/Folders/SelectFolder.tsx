// @ts-nocheck
import { BaseButtonDropdown } from "components/Common"
import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react"
import { DropdownItem } from "reactstrap"
import TreeFolders from "./TreeFolders"
import { useTranslation } from "react-i18next"
import { isEmpty } from "lodash"
import { Link } from "react-router-dom"
import { Collapse } from "@mui/material"

const SelectFolder = ({ value, folders, onCallbackFolder }, ref) => {
  const { t } = useTranslation()

  const dataFolderDefault = {
    name: t("mail.mail_menu_private"),
    fullname: t("mail.mail_menu_private"),
    id: "",
    key: "",
  }

  const [folderSelected, setFolderSelected] = useState(dataFolderDefault)
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    if (value) {
      const newFolderSelected =
        folders?.find((folder) => folder?.id === value?.preid) || dataFolderDefault
      setFolderSelected(newFolderSelected)
    } else {
      setFolderSelected(dataFolderDefault)
    }
  }, [value])

  useImperativeHandle(
    ref,
    () => {
      return {
        resetSelectFolder: () => setFolderSelected(dataFolderDefault),
      }
    },
    [],
  )

  const handleSelectFolder = (data) => {
    if (!isEmpty(data)) {
      setFolderSelected(data)
      onCallbackFolder && onCallbackFolder(data)
    }
  }

  return (
    <BaseButtonDropdown
      content={folderSelected?.name ?? t("common.board_toplevel_select_msg")}
      classDropdown={"w-100 border"}
      classDropdownMenu={"w-100 mt-1"}
    >
      {/* <DropdownItem>
        <TreeFolders folders={folders} onClick={handleSelectFolder} />
      </DropdownItem> */}
      <div>
        <ul className="list-unstyled categories-list">
          <li>
            <div className="custom-accordion">
              <Link
                className="font-size-14 fw-medium py-1 d-flex align-items-center"
                onClick={() => {
                  setIsOpen(!isOpen)
                  handleSelectFolder(dataFolderDefault)
                }}
                to="#"
              >
                <i
                  className={
                    isOpen
                      ? "mdi mdi-chevron-down font-size-16 mx-2"
                      : "mdi mdi-chevron-right font-size-16 mx-2"
                  }
                />
                <i
                  className={
                    isOpen
                      ? "mdi mdi-folder-open icon-folder font-size-16 mx-2"
                      : "mdi mdi-folder icon-folder font-size-16 mx-2"
                  }
                />
                {t("mail.mail_menu_private")}
              </Link>
              <Collapse in={isOpen} sx={{ ml: "26px" }}>
                <div className="card border-0 shadow-none ps-3 mb-0 overflow-x-auto">
                  <div className="card-border"></div>
                  <TreeFolders
                    folders={folders.filter((_folder) => _folder.preid === "-")}
                    folderChoose={folderSelected}
                    onClick={handleSelectFolder}
                  />
                </div>
              </Collapse>
            </div>
          </li>
        </ul>
      </div>
    </BaseButtonDropdown>
  )
}

export default forwardRef(SelectFolder)
