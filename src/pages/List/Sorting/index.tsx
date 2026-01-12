// @ts-nocheck
import { BaseButtonDropdown, BaseIcon } from "components/Common"
import { DATE_SORT, EMAIL_SORT, SIZE_SORT, SUBJECT_SORT } from "constants/init/filterOptions"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { DropdownItem } from "reactstrap"

const initSortOptions = {
  type: "date",
  sortKind: 0,
}

export const getInitFilterSorting = (queryParams) => {
  if (queryParams?.["mailsort"] && queryParams?.["sortkind"]) {
    return { type: queryParams["mailsort"], sortKind: Number(queryParams["sortKind"]) }
  } else {
    return initSortOptions
  }
}

const Sorting = ({ menu, onFilterChange, isReset, setIsReset, isMobileFilter }) => {
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
  }

  return (
    <BaseButtonDropdown
      classContent={`han-h5 han-fw-regular han-text-primary`}
      classDropdownMenu={`han-h5 han-fw-regular han-text-primary`}
      content={t("common.common_sort_by")}
      direction={isMobileFilter ? "left" : "down"}
      icon={`fas fa-chevron-${isMobileFilter ? "right" : "down"} text-secondary`}
    >
      {options &&
        options.length > 0 &&
        options.map((option, index) => (
          <DropdownItem
            key={index}
            className={`han-h5 han-fw-regular w-100 dropdown-item cursor-pointer ${
              sortOptions.type === option.type ? "active-option" : ""
            }`}
            onClick={() => handleChangeSort(option, index)}
          >
            {t(option.name)}
            <BaseIcon
              icon={option.sort === 0 ? "fas fa-sort-alpha-down" : "fas fa-sort-alpha-down-alt"}
              className={"float-end mt-1"}
            />
          </DropdownItem>
        ))}
    </BaseButtonDropdown>
  )
}

export default Sorting
