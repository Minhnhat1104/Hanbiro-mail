// @ts-nocheck
import { Popover } from "@mui/material"
import { BaseButton } from "components/Common"
import { isEqual } from "lodash"
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { useParams, useSearchParams } from "react-router-dom"
import { selectUserMailSetting } from "store/auth/config/selectors"
import { setQueryParams } from "store/mailList/actions"
import FilterModalBody from "./FilterModalBody"

export const initFilterOptions = {
  acl: "",
  act: "maillist",
  mailsort: "date",
  sortkind: "0",
  timemode: "mobile",
  viewcont: "",
}

const FilterModal = ({ isOpen, onClose, anchorEl, isHideFilterButton }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { menu } = useParams()

  // redux state
  const userMailSetting = useSelector(selectUserMailSetting)
  const queryParams = useSelector((state) => state.QueryParams.query)

  const [searchParams, setSearchParams] = useSearchParams()

  const limit = useMemo(() => {
    return userMailSetting?.items_per_page ?? 20
  }, [userMailSetting?.items_per_page])

  const initFilter = useMemo(() => {
    const isSearchBox = !menu?.includes("HBShare_") && !["Secure", "Receive", "Spam"].includes(menu)
    return {
      acl: menu,
      act: "maillist",
      mailsort: "date",
      sortkind: "0",
      timemode: "mobile",
      viewcont: `0,${limit}`,
      ...(isSearchBox ? { searchbox: menu } : {}),
    }
  }, [limit, menu])

  const [filterOptions, setFilterOptions] = useState(() => {
    return queryParams
      ? {
          ...initFilter,
          ...queryParams,
        }
      : {
          ...initFilter,
        }
  })

  useEffect(() => {
    const nFilter = {
      ...initFilter,
      ...queryParams,
    }
    setFilterOptions(nFilter)
    handleApplyFilter(nFilter, false)
  }, [queryParams])

  const onFilterChange = (data) => {
    const { type, value } = data
    if (type === "searchfild") {
      setFilterOptions((prev) => ({
        ...prev,
        [type]: value,
        searchbox: !!prev?.searchbox ? prev?.searchbox : "all",
      }))
    } else if (type === "date") {
      setFilterOptions((prev) => {
        return {
          ...prev,
          startdate: value.startdate === "" ? undefined : value.startdate,
          enddate: value.enddate === "" ? undefined : value.enddate,
        }
      })
    } else if (type === "sort") {
      setFilterOptions((prev) => ({
        ...prev,
        [value.sortType]: value.value,
        ...(value.sortType === "mailsort"
          ? { sortkind: !!prev?.sortkind ? prev?.sortkind : "1" }
          : {}),
      }))
    } else {
      setFilterOptions((prev) => ({
        ...prev,
        [type]: value,
      }))
    }
  }

  const syncSearchParams = (params, isResetPage) => {
    const nFilter = params ? params : formatSearchParams(filterOptions)
    let nParams = { ...nFilter, viewcont: isResetPage ? `0,${limit}` : nFilter?.viewcont }
    if (!isEqual(nParams, queryParams)) {
      setSearchParams(nParams)
      dispatch(setQueryParams(nParams))
    } else {
      setSearchParams(nParams)
    }
  }

  const formatSearchParams = (params) => {
    if (!params || Object.keys(params).length < 1) return
    const nParams = { ...params }
    for (const key in nParams) {
      if (!nParams[key]) {
        delete nParams[key]
      }
    }
    return nParams
  }

  const handleApplyFilter = (params, isResetPage) => {
    syncSearchParams(params, isResetPage)
    onClose()
  }

  const handleResetFilter = () => {
    setFilterOptions(initFilter)
    // handleApplyFilter(initFilter)
  }

  // render modal
  const renderBody = () => {
    return <FilterModalBody filterOptions={filterOptions} onFilterChange={onFilterChange} />
  }

  const renderFooter = () => {
    return (
      <div className="w-100 d-flex justify-content-end align-items-center gap-2">
        <BaseButton
          outline
          color="grey"
          size="sm"
          onClick={handleResetFilter}
          className={"btn-action"}
        >
          {t("common.common_reset")}
        </BaseButton>
        <BaseButton color="primary" size="sm" onClick={() => handleApplyFilter(undefined, true)}>
          {t("common.holiday_appbtn")}
        </BaseButton>
      </div>
    )
  }

  return (
    <Popover
      id="mail-filter-popover"
      open={isOpen}
      anchorEl={anchorEl}
      onClose={onClose}
      elevation={3}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      sx={{ mt: 0.125, "& .MuiPaper-root": { width: 500, maxWidth: "90vw" } }}
    >
      <div className="d-flex gap-3 flex-column p-3">
        {renderBody()}
        {renderFooter()}
      </div>
    </Popover>
  )
}

export default FilterModal
