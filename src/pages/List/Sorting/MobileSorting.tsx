// @ts-nocheck
import { List, ListItemButton, Popover } from "@mui/material"
import { BaseButtonDropdown, BaseIcon } from "components/Common"
import { DATE_SORT, EMAIL_SORT, SIZE_SORT, SUBJECT_SORT } from "constants/init/filterOptions"
import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { DropdownItem } from "reactstrap"
import { getInitFilterSorting } from "."

const initSortOptions = {
  type: "date",
  sortKind: 0,
}

const MobileSorting = ({ menu, onFilterChange, isReset, setIsReset, isMobileFilter }) => {
  const { t } = useTranslation()

  const sortOptionsList = [
    { name: "mail.mail_send_user", type: EMAIL_SORT, sort: 1 },
    {
      name: "mail.mail_set_autosplit_splitsubject",
      type: SUBJECT_SORT,
      sort: 1,
    },
    { name: "mail.mail_list_sort_size", type: SIZE_SORT, sort: 1 },
    { name: "mail.mail_secure_date", type: DATE_SORT, sort: 1 },
  ]

  // redux state
  const queryParams = useSelector((state) => state.QueryParams.query)

  const sortRef = useRef(null)

  const [openSort, setOpenSort] = useState(false)
  const [options, setOptions] = useState(sortOptionsList)
  const [sortOptions, setSortOptions] = useState(() => getInitFilterSorting(queryParams))

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
          sort: data.sort === 1 ? 0 : 1,
        }
      }
      return {
        ...option,
        sort: 1,
      }
    })
    setSortOptions({
      type: data.type,
      sortKind: data.sort === 1 ? 0 : 1,
    })
    setOptions(nOptions)
    onFilterChange && onFilterChange("sort", "", data)
    setOpenSort(false)
  }

  return (
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
                className={`w-100 sort-item p-2 cursor-pointer justify-content-between`}
                onClick={() => handleChangeSort(option, index)}
                sx={{
                  bgcolor:
                    sortOptions.type === option.type ? "var(--bs-primary) !important" : undefined,
                  color:
                    sortOptions.type === option.type ? "var(--bs-white) !important" : undefined,
                }}
              >
                {t(option.name)}
                <BaseIcon
                  icon={option.sort === 0 ? "fas fa-sort-alpha-down" : "fas fa-sort-alpha-down-alt"}
                  className={"float-end mt-1"}
                />
              </ListItemButton>
            ))}
        </List>
      </Popover>
    </>
  )
}

export default MobileSorting
