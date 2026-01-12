// @ts-nocheck
import BaseIcon from "components/Common/BaseIcon"
import React from "react"
import { SearchType } from "."
import { useTranslation } from "react-i18next"
import "./styles.scss"

const Search = ({
  keyword = "",
  onSearch = () => {},
  setKeyword = () => {},
  typeSearchChoosed = {},
  onChangeTypeSearch = () => {},
}) => {
  const { t } = useTranslation()

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      e.stopPropagation()
      onSearch && onSearch(keyword)
    }
  }

  return (
    <div className="clouddisk-search">
      <div className={"search-input ps-0 position-relative"}>
        <input
          type="text"
          className={`form-control han-h4 han-fw-regular han-text-secondary`}
          placeholder={`${t("common.common_search")}...`}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={onKeyDown}
        />

        <div
          className="search-icon d-flex position-absolute justify-content-center align-items-center border-0"
          type="button"
          id="modal-clouddisk-search"
          onClick={(e) => {
            e.preventDefault()
            keyword != "" && onSearch()
          }}
        >
          <BaseIcon icon={"bx bx-search-alt han-text-secondary"} />
        </div>

        <div className="filter-icon position-absolute d-flex align-items-center">
          <SearchType typeSearchChoosed={typeSearchChoosed} onChange={onChangeTypeSearch} />
        </div>
      </div>
    </div>
  )
}

export default Search
