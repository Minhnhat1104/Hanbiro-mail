// @ts-nocheck
import { Popover } from "@mui/material"
import { BaseButton } from "components/Common"
import { isEqual } from "lodash"
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { useParams, useSearchParams } from "react-router-dom"
import { selectUserMailSetting } from "store/auth/config/selectors"
import { setPermitQueryParams } from "store/mailList/actions"
import PermitFilterBody from "./PermitFilterBody"

const PermitFilterModal = ({ isOpen, onClose, anchorEl, isHideFilterButton }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { menu } = useParams()

  // redux state
  const userMailSetting = useSelector(selectUserMailSetting)
  const queryParams = useSelector((state) => state.QueryParams.permitQuery)

  const [searchParams, setSearchParams] = useSearchParams()

  const limit = useMemo(() => {
    return userMailSetting?.items_per_page ?? 20
  }, [userMailSetting?.items_per_page])

  const initPermitFilterToolbar = useMemo(
    () => ({
      page: 1,
      linenum: limit,
      sortkey: "timestamp",
      sorttype: "desc",
    }),
    [limit, menu],
  )

  const [filterOptions, setFilterOptions] = useState(() => {
    return queryParams
      ? {
          ...initPermitFilterToolbar,
          ...queryParams,
        }
      : {
          ...initPermitFilterToolbar,
        }
  })

  useEffect(() => {
    const nFilter = {
      ...initPermitFilterToolbar,
      ...queryParams,
    }
    setFilterOptions(nFilter)
    handleApplyFilter(nFilter)
  }, [queryParams])

  const onFilterChange = (data) => {
    const { type, value } = data
    if (type === "sort") {
      setFilterOptions((prev) => {
        return {
          ...prev,
          [value?.sortkey]: value?.value,
        }
      })
    } else if (type === "to") {
      setFilterOptions((prev) => {
        const nField = { ...prev }
        if (value?.type === "toaddr") {
          delete nField.alltoaddr
        } else {
          delete nField.toaddr
        }
        return {
          ...nField,
          [value?.type]: value?.keyword || "",
        }
      })
    } else if (type === "content") {
      setFilterOptions((prev) => {
        const nField = { ...prev }
        delete nField.all
        if (value?.type === "subject") {
          delete nField.contents
          delete nField.filelist
        } else if (value?.type === "contents") {
          delete nField.subject
          delete nField.filelist
        } else if (value?.type === "filelist") {
          delete nField.subject
          delete nField.contents
        } else if (value?.type === "all") {
          delete nField.subject
          delete nField.contents
          delete nField.filelist
        } else {
          delete nField.filelist
        }
        return {
          ...nField,
          ...(value?.type === "subjectAndContent"
            ? {
                subject: value?.keyword || "",
                contents: value?.keyword || "",
              }
            : { [value?.type]: value?.keyword || "" }),
        }
      })
    } else if (type === "date") {
      setFilterOptions((prev) => {
        return {
          ...prev,
          startdate: value.startdate === "" ? "" : `${value.startdate}`,
          enddate: value.enddate === "" ? "" : `${value.enddate}`,
        }
      })
    } else if (type === "approve_date") {
      setFilterOptions((prev) => {
        return {
          ...prev,
          approve_startdate: value.approve_startdate === "" ? "" : `${value.approve_startdate}`,
          approve_enddate: value.approve_enddate === "" ? "" : `${value.approve_enddate}`,
        }
      })
    } else {
      setFilterOptions((prev) => {
        return {
          ...prev,
          [type]: value,
        }
      })
    }
  }

  const syncSearchParams = (params) => {
    const nFilter = params ? params : formatSearchParams(filterOptions)
    if (!isEqual(nFilter, queryParams)) {
      setSearchParams(nFilter)
      dispatch(setPermitQueryParams(nFilter))
    } else {
      setSearchParams(nFilter)
    }
  }

  const formatSearchParams = (params) => {
    if (!params || Object.keys(params).length < 1) return
    const nParams = { ...params }
    for (const key in nParams) {
      if (key === "search") {
        const nKey = nParams["search"].key
        const nValue = nParams["search"].value
        if (nValue !== "") {
          nParams[nKey] = nValue
        }
        delete nParams["search"]
      }
      if (nParams[key] === "") {
        delete nParams[key]
      }
    }
    return nParams
  }

  const handleApplyFilter = (params) => {
    syncSearchParams(params)
    onClose()
  }

  const handleResetFilter = () => {
    setFilterOptions(initPermitFilterToolbar)
    // handleApplyFilter(initPermitFilterToolbar)
  }

  // render modal
  const renderBody = () => {
    return <PermitFilterBody filterOptions={filterOptions} onFilterChange={onFilterChange} />
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
        <BaseButton color="primary" size="sm" onClick={() => handleApplyFilter()}>
          {t("common.holiday_appbtn")}
        </BaseButton>
      </div>
    )
  }

  return (
    <Popover
      id="permit-mail-filter-popover"
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

export default PermitFilterModal
