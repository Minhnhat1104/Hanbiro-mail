// @ts-nocheck
import { List, ListItemButton, Popover } from "@mui/material"
import { BaseButton, BaseIcon, SearchInput } from "components/Common"
import useDevice from "hooks/useDevice"
import { isEmpty, isEqual } from "lodash"
import SearchDate from "pages/List/SearchDate"
import MobileSearchDate from "pages/List/SearchDate/MobileSearchDate"
import queryString from "query-string"
import { useEffect, useMemo, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useNavigate, useSearchParams } from "react-router-dom"
import { Button, Col, Row } from "reactstrap"
import { selectUserMailSetting } from "store/auth/config/selectors"
import { setQueryParams, setSearchKeywork } from "store/mailList/actions"
import PermitMailSearch, { permitSearchFieldsArr } from "./PermitMailSearch"
import PermitMailStatus from "./PermitMailStatus"
import PermitSorting from "./PermitSorting"

const getInitFilterOptions = (query, initFilter) => {
  const { state, search, ...rest } = initFilter
  let searchParams = {}
  for (const field in query) {
    if (permitSearchFieldsArr.includes(field)) {
      searchParams.key = field
      searchParams.value = query[field]
    }
  }
  return query
    ? {
        ...rest,
        search: !isEmpty(searchParams)
          ? searchParams
          : {
              key: "userid",
              value: "",
            },
        ...query,
      }
    : initFilter
}

function PermitFilterToolbar(props) {
  const { menu, isOnlySearch, mobileFilterIcon } = props
  const { t } = useTranslation()
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const filterRef = useRef()

  const { isMobile, isVerticalTablet } = useDevice()

  const isMobileFilter = isMobile || isVerticalTablet

  // redux state
  const userMailSetting = useSelector(selectUserMailSetting)

  const initPermitFilterToolbar = {
    page: 1,
    linenum: userMailSetting?.items_per_page ?? 10,
    sortkey: "timestamp",
    sorttype: "desc",
    state: "n",
    search: {
      key: "userid",
      value: "",
    },
  }

  const query = useMemo(() => {
    return queryString.parse(location.search)
  }, [location.search])

  const [openFilter, setOpenFilter] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const [keyword, setKeyword] = useState("")
  const [filterOptions, setFilterOptions] = useState(() =>
    getInitFilterOptions(query, initPermitFilterToolbar),
  )
  const [isReset, setIsReset] = useState(false)

  const searchKeywork = useSelector((state) => state.QueryParams.searchKeywork)

  useEffect(() => {
    setFilterOptions(() => getInitFilterOptions(query, initPermitFilterToolbar))
    for (const field in query) {
      if (permitSearchFieldsArr.includes(field)) {
        dispatch(setSearchKeywork(query?.[field]))
      }
    }
  }, [query])

  useEffect(() => {
    dispatch(setSearchKeywork(""))
  }, [])

  useEffect(() => {
    setKeyword(searchKeywork)
    if (filterOptions.search.key !== "") {
      setFilterOptions((prev) => ({
        ...prev,
        search: {
          ...prev.search,
          value: searchKeywork,
        },
      }))
    }
  }, [searchKeywork])

  useEffect(() => {
    syncSearchParams()
  }, [filterOptions])

  const onFilterChange = (type, value) => {
    if (type === "sort") {
      setFilterOptions((prev) => {
        return {
          ...prev,
          sortkey: value.sortkey,
          sorttype: value.sorttype,
        }
      })
    } else if (type === "search") {
      setFilterOptions((prev) => {
        let nFilter = { ...prev }
        if (value === "filelist") {
          nFilter = {
            ...nFilter,
            isfile: "y",
          }
        } else {
          delete nFilter.isfile
        }
        delete nFilter.userid
        delete nFilter.approve_user
        delete nFilter.fromaddr
        delete nFilter.toaddr
        delete nFilter.ccaddr
        delete nFilter.subject
        delete nFilter.contents
        delete nFilter.filelist
        return {
          ...nFilter,
          [type]: {
            key: value,
            value: keyword,
          },
        }
      })
    } else if (type === "date") {
      setFilterOptions((prev) => {
        return {
          ...prev,
          // approve_startdate: value.startdate === '' ? '' : `${value.startdate} 00:00:00`,
          // approve_enddate: value.enddate === '' ? '' : `${value.enddate} 23:59:59`
          startdate: value.startdate === "" ? "" : `${value.startdate} 00:00:00`,
          enddate: value.enddate === "" ? "" : `${value.enddate} 23:59:59`,
        }
      })
    } else {
      setFilterOptions((prev) => {
        return {
          ...prev,
          state: value,
        }
      })
    }
  }

  const handleChangeKeyword = (value) => {
    setKeyword(value)
    if (filterOptions.search.key !== "") {
      setFilterOptions((prev) => ({
        ...prev,
        search: {
          ...prev.search,
          value: value,
        },
      }))
    }
  }

  const syncSearchParams = () => {
    const nFilter = formatSearchParams(filterOptions)
    const params = queryString.parse(location.search)
    if (isEqual(nFilter, params)) {
    }
    setSearchParams(nFilter)
    dispatch(setQueryParams(nFilter))
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

  const onResetFilter = () => {
    setFilterOptions(initPermitFilterToolbar)
    setKeyword("")
    setIsReset(true)
  }

  return (
    <>
      {isOnlySearch ? (
        <div className="d-flex">
          <SearchInput className={""} initialData={keyword} onSubmit={handleChangeKeyword} />
        </div>
      ) : (
        <>
          {isMobileFilter ? (
            <>
              {isMobile ? (
                <div
                  className="px-3"
                  ref={filterRef}
                  color="white"
                  onClick={(e) => {
                    e.stopPropagation()
                    setOpenFilter(true)
                  }}
                >
                  {mobileFilterIcon ? (
                    mobileFilterIcon
                  ) : (
                    <BaseIcon
                      className={"text-secondary"}
                      icon={"mdi mdi-filter-outline font-size-16"}
                      iconClassName="me-0"
                    />
                  )}
                </div>
              ) : (
                <BaseButton
                  outline
                  color={"secondary"}
                  buttonRef={filterRef}
                  className={"me-1 py-0"}
                  icon={"mdi mdi-filter-outline"}
                  iconClassName={"me-0"}
                  onClick={(e) => {
                    e.stopPropagation()
                    setOpenFilter(true)
                  }}
                />
              )}

              <Popover
                id={`permit-filter-popover`}
                open={openFilter}
                onClose={() => setOpenFilter((prev) => !prev)}
                anchorEl={filterRef.current}
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
                    width: "100%",
                    minWidth: 150,
                    maxWidth: 200,
                    borderRadius: 0.5,
                  }}
                >
                  <ListItemButton sx={{ p: 0 }}>
                    <PermitSorting
                      menu={menu}
                      onFilterChange={onFilterChange}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      direction={isMobileFilter ? "left" : undefined}
                      isMobileFilter={isMobileFilter}
                    />
                  </ListItemButton>
                  <ListItemButton sx={{ p: 0 }}>
                    <MobileSearchDate
                      menu={menu}
                      onFilterChange={onFilterChange}
                      isReset={isReset}
                      setIsReset={setIsReset}
                    />
                  </ListItemButton>
                  <ListItemButton sx={{ p: 0 }}>
                    <PermitMailStatus
                      menu={menu}
                      onFilterChange={onFilterChange}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      direction={isMobileFilter ? "left" : undefined}
                      isMobileFilter={isMobileFilter}
                    />
                  </ListItemButton>
                  <ListItemButton sx={{ p: 0 }}>
                    <PermitMailSearch
                      menu={menu}
                      onFilterChange={onFilterChange}
                      isReset={isReset}
                      setIsReset={setIsReset}
                      direction={isMobileFilter ? "left" : undefined}
                      isMobileFilter={isMobileFilter}
                    />
                  </ListItemButton>
                  <ListItemButton sx={{ p: 1 }} onClick={onResetFilter}>
                    {t("common.common_reset")}
                  </ListItemButton>
                </List>
              </Popover>
            </>
          ) : (
            <Row className="filter-options flex-grow-1 px-3">
              <Col className="col-12 d-flex align-items-center justify-content-between">
                <div className="d-flex">
                  <PermitSorting
                    menu={menu}
                    onFilterChange={onFilterChange}
                    isReset={isReset}
                    setIsReset={setIsReset}
                  />
                  <SearchDate
                    menu={menu}
                    onFilterChange={onFilterChange}
                    isReset={isReset}
                    setIsReset={setIsReset}
                  />
                  <PermitMailStatus
                    menu={menu}
                    onFilterChange={onFilterChange}
                    isReset={isReset}
                    setIsReset={setIsReset}
                  />
                  <PermitMailSearch
                    menu={menu}
                    onFilterChange={onFilterChange}
                    isReset={isReset}
                    setIsReset={setIsReset}
                  />
                  <Button outline color="white" onClick={onResetFilter}>
                    {t("common.common_reset")}
                  </Button>
                </div>
                <div className="d-flex">
                  <SearchInput
                    className={""}
                    initialData={keyword}
                    onSubmit={handleChangeKeyword}
                  />
                </div>
              </Col>
            </Row>
          )}
        </>
      )}
    </>
  )
}

export default PermitFilterToolbar
