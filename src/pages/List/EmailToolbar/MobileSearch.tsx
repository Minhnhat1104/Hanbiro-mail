// @ts-nocheck
import React, { useEffect, useState } from "react"
import { BaseIcon } from "components/Common"
import classNames from "classnames"
import { useTranslation } from "react-i18next"
import { Input } from "reactstrap"
import { X } from "react-feather"
import { useDispatch } from "react-redux"
import { setSearchKeywork } from "store/mailList/actions"

const MobileSearch = (props) => {
  const { onSubmit, className, onKeywordChange, initialData, iconClass = "" } = props
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const [keyword, setKeyword] = useState(initialData ?? "")
  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      e.stopPropagation()
      onSubmit && onSubmit(keyword)
    }
  }

  useEffect(() => {
    if (initialData != keyword) {
      setKeyword(initialData == null ? "" : initialData)
    }
  }, [initialData])

  useEffect(() => {
    onKeywordChange?.(keyword)
  }, [keyword])
  return (
    <div className={"d-flex align-items-center flex-grow-1"}>
      <Input
        type="text"
        className=""
        placeholder={`${t("common.common_search")}...`}
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        onKeyDown={onKeyDown}
      />
      <X
        size={18}
        strokeWidth={1}
        className={`${iconClass} text-secondary`}
        onClick={() => {
          setKeyword("")
          dispatch(setSearchKeywork(""))
        }}
      />
    </div>
  )
}

export default MobileSearch
