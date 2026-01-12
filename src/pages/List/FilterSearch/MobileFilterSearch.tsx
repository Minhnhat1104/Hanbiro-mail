// @ts-nocheck
import { List, ListItemButton, Popover } from "@mui/material"
import { BaseIcon } from "components/Common"
import useDevice from "hooks/useDevice"
import React, { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { useSearchParams } from "react-router-dom"
import { getInitFilterSearch } from "."
import { useSelector } from "react-redux"

const filterSearchOptions = [
  { title: "mail.mail_view_search_by_from_address", key: "f", value: "" },
  { title: "mail.mail_view_search_by_to_address", key: "t", value: "" },
  { title: "mail.mail_view_search_by_cc_bcc_address", key: "c", value: "" },
  { title: "mail.mail_view_search_by_title", key: "searchfild", value: "s" },
  { title: "mail.mail_view_search_by_content", key: "searchfild", value: "c" },
  {
    title: "mail.mail_view_search_by_attachment",
    key: "searchfild",
    value: "filename",
  },
]

const MobileFilterSearch = ({
  menu,
  onFilterSearchChange,
  isReset,
  setIsReset,
  isMobileFilter,
}) => {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()

  const { isMobile } = useDevice()

  // redux state
  const queryParams = useSelector((state) => state.QueryParams.query)

  const searchRef = useRef()

  const [openSearch, setOpenSearch] = useState(false)
  const [filterSearchSelected, setFilterSearchSelected] = useState(() =>
    getInitFilterSearch(queryParams),
  )

  const handleChangeFilterSearch = (data) => {
    const { key, value } = data
    setFilterSearchSelected({
      key: key,
      value: value,
    })
    // onFilterSearchChange && onFilterSearchChange({ key, value })
  }

  useEffect(() => {
    onFilterSearchChange && onFilterSearchChange(filterSearchSelected)
    setOpenSearch(false)
  }, [filterSearchSelected])

  useEffect(() => {
    if (isReset) {
      setFilterSearchSelected(null)
      setIsReset && setIsReset(false)
    }
  }, [isReset])

  return (
    <>
      <div
        ref={searchRef}
        className={"p-2 d-flex justify-content-between align-items-center w-100"}
        onClick={() => setOpenSearch((prev) => !prev)}
      >
        {t("mail.mail_secure_filter")}
        <BaseIcon
          icon={`fas fa-chevron-${openSearch ? "down" : "right"} text-secondary`}
          className={"ms-1"}
        />
      </div>
      <Popover
        id={`sort-popover`}
        open={openSearch}
        onClose={() => setOpenSearch((prev) => !prev)}
        anchorEl={searchRef.current}
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
            minWidth: 200,
            borderRadius: 0.5,
          }}
        >
          {filterSearchOptions &&
            filterSearchOptions.length > 0 &&
            filterSearchOptions.map((item, index) => (
              <React.Fragment key={item.key + item.value}>
                <ListItemButton
                  className={`${
                    filterSearchSelected?.key === item.key &&
                    filterSearchSelected?.value === item.value
                      ? "active-option"
                      : ""
                  }`}
                  sx={{
                    bgcolor:
                      filterSearchSelected?.key === item.key &&
                      filterSearchSelected?.value === item.value
                        ? "var(--bs-primary) !important"
                        : undefined,
                    color:
                      filterSearchSelected?.key === item.key &&
                      filterSearchSelected?.value === item.value
                        ? "var(--bs-white) !important"
                        : undefined,
                  }}
                  onClick={() => handleChangeFilterSearch(item)}
                >
                  {t(item.title)}
                </ListItemButton>
              </React.Fragment>
            ))}
        </List>
      </Popover>
    </>
  )
}

export default MobileFilterSearch
