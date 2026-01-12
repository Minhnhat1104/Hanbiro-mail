// @ts-nocheck
import { List, ListItemButton, Popover } from "@mui/material"
import { BaseButtonDropdown, BaseIcon } from "components/Common"
import queryString from "query-string"
import React, { useEffect, useMemo, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch } from "react-redux"
import { DropdownItem } from "reactstrap"
import { setSearchKeywork } from "store/mailList/actions"

const filterSearchOptions = [
  { label: "mail.mail_view_search_by_userid", value: "userid" },
  { label: "mail.mail_permit_filter_main_manager", value: "approve_user" },
  { label: "mail.mail_view_search_by_from_address", value: "fromaddr" },
  { label: "mail.mail_view_search_by_to_address", value: "toaddr" },
  { label: "mail.mail_view_search_by_cc_bcc_address", value: "ccaddr" },
  { label: "mail.mail_view_search_by_title", value: "subject" },
  { label: "mail.mail_view_search_by_content", value: "contents" },
  { label: "mail.mail_view_search_by_attachment", value: "filelist" },
]

export const permitSearchFieldsArr = [
  "userid",
  "approve_user",
  "fromaddr",
  "toaddr",
  "ccaddr",
  "subject",
  "contents",
  "filelist",
]

const getInitFilterSearch = (queryParams) => {
  for (const field in queryParams) {
    if (permitSearchFieldsArr.includes(field)) {
      return filterSearchOptions.find((item) => item.value === field)?.value
    }
  }
  return ""
}

const PermitMailSearch = (props) => {
  const { menu, onFilterChange, isReset, setIsReset, direction, isMobileFilter } = props
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const query = useMemo(() => {
    return queryString.parse(location.search)
  }, [location.search])

  const searchRef = useRef()

  const [openSearch, setOpenSearch] = useState(false)
  const [filterSearchSelected, setFilterSearchSelected] = useState(() => getInitFilterSearch(query))

  const handleChangeFilterSearch = (data) => {
    setFilterSearchSelected(data.value)
    onFilterChange && onFilterChange("search", data.value)
    isMobileFilter && setOpenSearch(false)
  }

  useEffect(() => {
    setFilterSearchSelected(() => getInitFilterSearch(query))
  }, [query])

  useEffect(() => {
    if (isReset) {
      setFilterSearchSelected("")
      setIsReset && setIsReset(false)
    }
  }, [isReset])

  return (
    <>
      {isMobileFilter ? (
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
                      className={`${filterSearchSelected === item.value ? "active-option" : ""}`}
                      sx={{
                        bgcolor:
                          filterSearchSelected === item.value
                            ? "var(--bs-primary) !important"
                            : undefined,
                        color:
                          filterSearchSelected === item.value
                            ? "var(--bs-white) !important"
                            : undefined,
                      }}
                      onClick={() => handleChangeFilterSearch(item)}
                    >
                      {t(item.label)}
                    </ListItemButton>
                  </React.Fragment>
                ))}
            </List>
          </Popover>
        </>
      ) : (
        <BaseButtonDropdown
          content={t("mail.mail_secure_filter")}
          classDropdownMenu={""}
          classDropdownToggle={`${filterSearchSelected ? "" : "no-active-search"}`}
          direction={direction}
        >
          {filterSearchOptions &&
            filterSearchOptions.length > 0 &&
            filterSearchOptions.map((item, index) => (
              <React.Fragment key={item.value}>
                <DropdownItem
                  className={`${filterSearchSelected === item.value ? "active-option" : ""}`}
                  onClick={() => handleChangeFilterSearch(item)}
                >
                  {t(item.label)}
                </DropdownItem>
              </React.Fragment>
            ))}
        </BaseButtonDropdown>
      )}
    </>
  )
}

export default PermitMailSearch
