// @ts-nocheck
import React, { useEffect, useMemo, useRef, useState } from "react"
import { BaseButtonDropdown, BaseIcon } from "components/Common"
import { useTranslation } from "react-i18next"
import { DropdownItem } from "reactstrap"
import { List, ListItemButton, Popover } from "@mui/material"
import queryString from "query-string"

const initSortOptions = {
  sortkey: "timestamp",
  sorttype: "desc",
}

const getInitPermitSorting = (queryParams) => {
  if (queryParams?.["sortkey"] && queryParams?.["sorttype"]) {
    return { sortkey: queryParams["sortkey"], sorttype: queryParams["sorttype"] }
  } else {
    return initSortOptions
  }
}

const PermitSorting = ({
  menu,
  onFilterChange,
  isReset,
  setIsReset,
  direction,
  isMobileFilter,
}) => {
  const { t } = useTranslation()
  const sortOptionsList = [
    { name: t("mail.mail_send_user"), type: "userid", sort: "desc" },
    { name: t("mail.mail_set_autosplit_splitsubject"), type: "subject", sort: "desc" },
    { name: t("mail.mail_secure_date"), type: "timestamp", sort: "desc" },
  ]

  const query = useMemo(() => {
    return queryString.parse(location.search)
  }, [location.search])

  const sortRef = useRef(null)

  const [openSort, setOpenSort] = useState(false)
  const [options, setOptions] = useState(sortOptionsList)
  const [sortOptions, setSortOptions] = useState(() => getInitPermitSorting(query))

  // useEffect(() => {
  //   setSortOptions(initSortOptions)
  // }, [menu])

  useEffect(() => {
    if (isReset) {
      setSortOptions(initSortOptions)
      setIsReset && setIsReset(false)
    }
  }, [isReset])

  const handleChangeSort = (data, idx) => {
    const nOptions = [...options].map((option, index) => {
      if (index === idx) {
        return {
          ...data,
          sort: data.sort === "desc" ? "asc" : "desc",
        }
      }
      return {
        ...option,
        sort: "desc",
      }
    })
    const nSortOptions = {
      sortkey: data.type,
      sorttype: data.sort === "desc" ? "asc" : "desc",
    }
    setSortOptions(nSortOptions)
    setOptions(nOptions)
    onFilterChange && onFilterChange("sort", nSortOptions)
  }

  return (
    <>
      {isMobileFilter ? (
        <>
          <div
            ref={sortRef}
            className={"p-2 d-flex justify-content-between align-items-center w-100"}
            onClick={() => setOpenSort((prev) => !prev)}
          >
            {t("common.common_sort_by")}
            <BaseIcon
              icon={`fas fa-chevron-${openSort ? "down" : "right"} text-secondary`}
              className={"ms-1"}
            />
          </div>

          <Popover
            id={`sort-popover`}
            open={openSort}
            onClose={() => setOpenSort((prev) => !prev)}
            anchorEl={sortRef.current}
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
              {options &&
                options.length > 0 &&
                options.map((option, index) => (
                  <ListItemButton
                    key={index}
                    className={`w-100 p-2 cursor-pointer justify-content-between`}
                    onClick={() => handleChangeSort(option, index)}
                    sx={{
                      bgcolor:
                        sortOptions.sortkey === option.type
                          ? "var(--bs-primary) !important"
                          : undefined,
                      color:
                        sortOptions.sortkey === option.type
                          ? "var(--bs-white) !important"
                          : undefined,
                    }}
                  >
                    {option.name}
                    <BaseIcon
                      icon={
                        option.sort === "asc"
                          ? "fas fa-sort-alpha-down"
                          : "fas fa-sort-alpha-down-alt"
                      }
                      className={"float-end mt-1"}
                    />
                  </ListItemButton>
                ))}
            </List>
          </Popover>
        </>
      ) : (
        <BaseButtonDropdown content={t("common.common_sort_by")} direction={direction}>
          {options &&
            options.length > 0 &&
            options.map((option, index) => (
              <DropdownItem
                key={index}
                className={`dropdown-item cursor-pointer ${
                  sortOptions.sortkey === option.type ? "active-option" : ""
                }`}
                onClick={() => handleChangeSort(option, index)}
              >
                {option.name}
                <BaseIcon
                  icon={
                    option.sort === "asc" ? "fas fa-sort-alpha-down" : "fas fa-sort-alpha-down-alt"
                  }
                  className={"float-end mt-1"}
                />
              </DropdownItem>
            ))}
        </BaseButtonDropdown>
      )}
    </>
  )
}

export default PermitSorting
