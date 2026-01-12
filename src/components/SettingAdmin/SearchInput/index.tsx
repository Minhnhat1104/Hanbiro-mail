// @ts-nocheck
// React
import React from "react"

// Third-party
import { Input } from "reactstrap"
import { useTranslation } from "react-i18next"

// Project
import "./style.scss"

const SearchInput = ({
  isMobile = false,
  onChange = () => {},
  onKeyDown = () => {},
  placeholder = "common.common_search",
  ...rest
}) => {
  const { t } = useTranslation()

  return (
    <div className={`search-input ps-0 search-user ${isMobile ? "w-100" : ""}`}>
      <div className="position-relative">
        <Input
          id="search-user"
          autoComplete="off"
          type="text"
          className="form-control han-h4 han-fw-regular han-text-primary"
          placeholder={t(placeholder) + "..."}
          onKeyDown={onKeyDown}
          onChange={onChange}
          {...rest}
        />
        <i className="bx bx-search-alt search-icon" />
      </div>
    </div>
  )
}

export default SearchInput
