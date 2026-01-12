// @ts-nocheck
import { BaseButtonDropdown } from "components/Common"
import useDevice from "hooks/useDevice"
import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import { useSearchParams } from "react-router-dom"
import { DropdownItem } from "reactstrap"

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

export const getInitFilterSearch = (queryParams) => {
  if (queryParams?.["f"] && queryParams["f"] !== "") {
    return {
      key: "f",
      value: "",
    }
  } else if (queryParams?.["t"] && queryParams["t"] !== "") {
    return {
      key: "t",
      value: "",
    }
  } else if (queryParams?.["c"] && queryParams["c"] !== "") {
    return {
      key: "c",
      value: "",
    }
  } else if (queryParams?.["searchfild"] && queryParams["searchfild"] !== "") {
    return {
      key: "searchfild",
      value: queryParams["searchfild"],
    }
  }
  return null
}

const FilterSearch = ({ menu, onFilterSearchChange, isReset, setIsReset, isMobileFilter }) => {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()

  const { isMobile } = useDevice()

  // redux state
  const queryParams = useSelector((state) => state.QueryParams.query)

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
  }, [filterSearchSelected])

  useEffect(() => {
    if (isReset) {
      setFilterSearchSelected(null)
      setIsReset && setIsReset(false)
    }
  }, [isReset])

  return (
    <BaseButtonDropdown
      content={t("mail.mail_secure_filter")}
      classContent={`han-h5 han-fw-regular han-text-primary`}
      classDropdownToggle={`${filterSearchSelected ? "" : "no-active-search"}`}
      direction={isMobileFilter ? (!isMobile ? "left" : "down") : "down"}
      icon={`fas fa-chevron-${isMobileFilter ? "right" : "down"} text-secondary`}
    >
      {filterSearchOptions &&
        filterSearchOptions.length > 0 &&
        filterSearchOptions.map((item, index) => (
          <React.Fragment key={item.key + item.value}>
            <DropdownItem
              className={`${
                filterSearchSelected?.key === item.key && filterSearchSelected?.value === item.value
                  ? "active-option"
                  : ""
              }`}
              onClick={() => handleChangeFilterSearch(item)}
            >
              {t(item.title)}
            </DropdownItem>
          </React.Fragment>
        ))}
    </BaseButtonDropdown>
  )
}

export default FilterSearch
