// @ts-nocheck
import React, { useEffect, useState } from "react"
import { BaseIcon } from "components/Common"
import classNames from "classnames"
import "./style.scss"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import useDevice from "hooks/useDevice"
import { useParams } from "react-router-dom"
import FilterToolbarV2 from "pages/List/FilterToolbar/FilterToolbarV2"
import PermitFilterV2 from "pages/PermitMail/PermitFilterV2"

const SearchFilterInput = (props) => {
  const { onSubmit, className, onKeywordChange, isFilter = false } = props
  const { t } = useTranslation()
  const { menu } = useParams()

  const { isTablet, isMobile } = useDevice()

  const isSplitMode = useSelector((state) => state.viewMode.isSplitMode)
  const isDetailView = useSelector((state) => state.mailDetail.isDetailView)
  const isPermitDetailView = useSelector((state) => state.mailDetail.isPermitDetailView)

  const [keyword, setKeyword] = useState(props?.initialData ?? "")
  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      e.stopPropagation()
      onSubmit && onSubmit(keyword)
    }
  }

  useEffect(() => {
    if (props?.initialData != keyword) {
      setKeyword(props?.initialData == null ? "" : props?.initialData)
    }
  }, [props?.initialData])

  useEffect(() => {
    onKeywordChange?.(keyword)
  }, [keyword])
  return (
    <div className={classNames("search-input", className)}>
      <div className={"position-relative"}>
        <input
          type="text"
          className={`form-control han-h4 han-fw-regular han-text-secondary`}
          placeholder={`${t("common.common_search")}...`}
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <BaseIcon
          icon={"search-icon bx bx-search-alt han-text-secondary"}
          onClick={() => onSubmit(keyword)}
        />
        {/* filter */}
        {isFilter && (
          <>
            {!isMobile && menu !== "Approval" && (isSplitMode || !isDetailView) && (
              <FilterToolbarV2 isShowIcon />
            )}
            {!isMobile && menu === "Approval" && !isPermitDetailView && (
              <PermitFilterV2 isShowIcon />
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default SearchFilterInput
