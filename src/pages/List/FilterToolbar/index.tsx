// @ts-nocheck
import { List, ListItemButton, Popover } from "@mui/material"
import { BaseButton, BaseIcon, SearchInput } from "components/Common"
import useDevice from "hooks/useDevice"
import { isEmpty, isEqual } from "lodash"
import queryString from "query-string"
import { memo, useEffect, useMemo, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { useLocation, useSearchParams } from "react-router-dom"
import { Button, Col, Row } from "reactstrap"
import { selectUserMailSetting } from "store/auth/config/selectors"
import { setIsBackToList, setQueryParams } from "store/mailList/actions"
import FilterSearch from "../FilterSearch"
import MobileFilterSearch from "../FilterSearch/MobileFilterSearch"
import Folders from "../Folders"
import MobileFolderFilter from "../Folders/MobileFolderFilter"
import SearchDate from "../SearchDate"
import MobileSearchDate from "../SearchDate/MobileSearchDate"
import Sorting from "../Sorting"
import MobileSorting from "../Sorting/MobileSorting"
import MailStatus from "../Status"
import MobileStatus from "../Status/MobileStatus"
import { setResetFilter } from "store/viewMode/actions"

export const initFilterOptions = {
  acl: "",
  act: "maillist",
  mailsort: "date",
  sortkind: "0",
  timemode: "mobile",
  viewcont: "",
}

const FilterToolbar = (props) => {
  const { menu, isOnlySearch = false, mobileFilterIcon, mobileFilterDropdownClass = "" } = props
  const { t } = useTranslation()
  const location = useLocation()
  const dispatch = useDispatch()
  const { isMobile, isVerticalTablet } = useDevice()

  const isMobileFilter = isMobile || isVerticalTablet

  const isShareMenu = menu?.indexOf("HBShare_") === 0 ? true : false
  const isSpamMenu = menu === "Spam"
  const isTrashMenu = menu === "Trash"
  const isSentMenu = menu === "Sent"

  // redux state
  const userMailSetting = useSelector(selectUserMailSetting)
  const isBackToList = useSelector((state) => state.QueryParams.isBackToList)
  const queryParams = useSelector((state) => state.QueryParams.query)
  const searchKeywork = useSelector((state) => state.QueryParams.searchKeywork)
  const isResetFilter = useSelector((state) => state.viewMode.isResetFilter)

  const filterRef = useRef(null)

  const [openFilter, setOpenFilter] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const [filterSearch, setFilterSearch] = useState({
    key: "searchfild",
    value: "all",
  })
  const [keyword, setKeyword] = useState("")
  const [isReset, setIsReset] = useState(false)

  const limit = useMemo(() => {
    return userMailSetting?.items_per_page ?? 20
  }, [userMailSetting?.items_per_page])

  const [filterOptions, setFilterOptions] = useState(() => {
    // const params = queryString.parse(location.search)
    return queryParams
      ? {
          ...initFilterOptions,
          ...queryParams,
          acl: menu,
          ...(menu === "all" ? { searchbox: "all" } : {}),
        }
      : {
          ...initFilterOptions,
          acl: menu,
          viewcont: `0,${limit}`,
          ...(menu === "all" ? { searchbox: "all" } : {}),
        }
  })

  useEffect(() => {
    setKeyword(searchKeywork)
  }, [searchKeywork])

  useEffect(() => {
    if (isResetFilter) {
      onResetFilter()
      dispatch(setResetFilter(false))
    }
  }, [isResetFilter])

  // useEffect(() => {
  //   const params = queryString.parse(location.search)
  //   setFilterOptions(
  //     !isEmpty(params)
  //       ? params
  //       : {
  //           ...initFilterOptions,
  //           acl: menu,
  //           viewcont: `0,${limit}`,
  //           ...(menu === "all" ? { searchbox: "all" } : {}),
  //         },
  //   )
  // }, [location.search])

  // useEffect(() => {
  //   setKeyword("")
  //   setFilterOptions((prev) => ({
  //     ...prev,
  //     acl: menu,
  //   }))
  //   // setIsReset(true)
  // }, [menu])

  useEffect(() => {
    if (keyword !== "") {
      if (filterSearch) {
        const { key, value } = filterSearch
        if (key !== "searchfild") {
          setFilterOptions((prev) => {
            const nFilter = { ...prev }
            delete nFilter["searchfild"]
            switch (key) {
              case "f":
                delete nFilter["t"]
                delete nFilter["c"]
                break
              case "t":
                delete nFilter["f"]
                delete nFilter["c"]
                break
              case "c":
                delete nFilter["t"]
                delete nFilter["f"]
                break
              default:
                break
            }
            return {
              ...nFilter,
              [key]: keyword,
            }
          })
        } else {
          const searchbox = isShareMenu || isSpamMenu || isTrashMenu || isSentMenu ? "all" : menu
          setFilterOptions((prev) => {
            const nFilter = { ...prev }
            delete nFilter["f"]
            delete nFilter["t"]
            delete nFilter["c"]
            return {
              ...nFilter,
              searchbox,
              [key]: value,
              keyword: keyword,
              ...(isShareMenu ? { shareid: menu } : {}),
            }
          })
        }
      } else {
        setFilterOptions((prev) => {
          return {
            ...prev,
            keyword: keyword,
          }
        })
      }
    } else {
      if (isBackToList) {
        setKeyword(queryParams?.keyword || "")
        dispatch(setIsBackToList(false))
      } else {
        setFilterOptions((prev) => {
          const nFilter = { ...prev }
          delete nFilter["keyword"]
          return nFilter
        })
      }
    }
  }, [filterSearch, keyword])

  useEffect(() => {
    syncSearchParams()
  }, [filterOptions])

  const onFilterChange = (type, key, value) => {
    if (type === "sort") {
      setFilterOptions((prev) => {
        return {
          ...prev,
          mailsort: value.type,
          sortkind: value.sort,
        }
      })
    } else if (type === "searchbox") {
      if (!Array.isArray(value)) return
      const nValue = value.join(",")
      setFilterOptions((prev) => {
        return {
          ...prev,
          [key]: nValue,
        }
      })
    } else if (type === "date") {
      setFilterOptions((prev) => {
        return {
          ...prev,
          startdate: value.startdate === "" ? "" : `${value.startdate} 00:00:00`,
          enddate: value.enddate === "" ? "" : `${value.enddate} 23:59:59`,
        }
      })
    } else if (type === "status") {
      if (key === "isfile") {
        setFilterOptions((prev) => {
          const nStatus = { ...prev }
          delete nStatus?.msgsig
          return {
            ...nStatus,
            [key]: value,
          }
        })
      } else {
        setFilterOptions((prev) => {
          const nStatus = { ...prev }
          delete nStatus?.isfile
          return {
            ...nStatus,
            [key]: value,
          }
        })
      }
    } else {
      setFilterOptions((prev) => {
        return {
          ...prev,
          [key]: value,
        }
      })
    }
  }

  const syncSearchParams = () => {
    const nFilter = { ...filterOptions }
    const params = queryString.parse(location.search)
    if (!isEqual(nFilter, queryParams)) {
    }
    setSearchParams(nFilter)
    dispatch(setQueryParams(nFilter))
  }

  const formatSearchParams = (params) => {
    if (!params || Object.keys(params).length < 1) return
    const nParams = { ...params }
    for (const key in nParams) {
      if (nParams[key] === "") {
        delete nParams[key]
      }
    }
    return nParams
  }

  const onResetFilter = () => {
    setFilterOptions({
      ...initFilterOptions,
      acl: menu,
      viewcont: `0,${limit}`,
      ...(menu === "all" ? { searchbox: "all" } : {}),
    })
    setKeyword("")
    setIsReset(true)
  }

  return (
    <>
      {isOnlySearch ? (
        <div className="d-flex">
          <SearchInput
            className={""}
            initialData={
              searchParams.get("keyword") ??
              searchParams.get("f") ??
              searchParams.get("t") ??
              searchParams.get("c")
            }
            onSubmit={setKeyword}
          />
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
                    <BaseIcon icon={"mdi mdi-filter-outline"} iconClassName="me-0" />
                  )}
                </div>
              ) : (
                <BaseButton
                  outline
                  color={""}
                  buttonRef={filterRef}
                  className={"me-1 py-0 fs-5 border-1"}
                  icon={"mdi mdi-filter-outline"}
                  iconClassName={"me-0"}
                  onClick={(e) => {
                    e.stopPropagation()
                    setOpenFilter(true)
                  }}
                />
              )}

              <Popover
                id={`filter-popover`}
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
                  {menu == "all" && (
                    <ListItemButton sx={{ p: 0 }}>
                      <MobileFolderFilter
                        onFilterChange={onFilterChange}
                        isReset={isReset}
                        setIsReset={setIsReset}
                      />
                    </ListItemButton>
                  )}
                  {menu !== "Secure" && menu !== "Receive" && (
                    <>
                      <ListItemButton sx={{ p: 0 }}>
                        <MobileSorting
                          menu={menu}
                          onFilterChange={onFilterChange}
                          isReset={isReset}
                          setIsReset={setIsReset}
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
                        <MobileStatus
                          menu={menu}
                          onFilterChange={onFilterChange}
                          isReset={isReset}
                          setIsReset={setIsReset}
                        />
                      </ListItemButton>
                      <ListItemButton sx={{ p: 0 }}>
                        <MobileFilterSearch
                          menu={menu}
                          onFilterSearchChange={setFilterSearch}
                          isReset={isReset}
                          setIsReset={setIsReset}
                        />
                      </ListItemButton>
                      <ListItemButton onClick={onResetFilter} sx={{ px: 1 }}>
                        {t("common.common_reset")}
                      </ListItemButton>
                    </>
                  )}
                </List>
              </Popover>
            </>
          ) : (
            // <HanTooltip placement="top" overlay={t("mail.mail_secure_filter")} trigger="hover">
            //   <Dropdown
            //     isOpen={openFilter}
            //     toggle={() => setOpenFilter((prevState) => !prevState)}
            //     className={`me-1 ${mobileFilterDropdownClass}`}
            //   >
            //     <DropdownToggle color="white">
            //       {mobileFilterIcon ? (
            //         mobileFilterIcon
            //       ) : (
            //         <BaseIcon icon={"mdi mdi-filter"} iconClassName="me-0" />
            //       )}
            //     </DropdownToggle>
            //     <DropdownMenu className="py-0">
            //       {menu == "all" && (
            //         <DropdownItem className="mobile-filter">
            //           <Folders
            //             isMobileFilter={isMobileFilter}
            //             onFilterChange={onFilterChange}
            //             isReset={isReset}
            //             setIsReset={setIsReset}
            //           />
            //         </DropdownItem>
            //       )}
            //       {menu !== "Secure" && menu !== "Receive" && (
            //         <>
            //           <DropdownItem className="mobile-filter">
            //             <Sorting
            //               menu={menu}
            //               isMobileFilter={isMobileFilter}
            //               onFilterChange={onFilterChange}
            //               isReset={isReset}
            //               setIsReset={setIsReset}
            //             />
            //           </DropdownItem>
            //           <DropdownItem className="mobile-filter">
            //             <SearchDate
            //               menu={menu}
            //               isMobileFilter={isMobileFilter}
            //               onFilterChange={onFilterChange}
            //               isReset={isReset}
            //               setIsReset={setIsReset}
            //             />
            //           </DropdownItem>
            //           <DropdownItem className="mobile-filter">
            //             <MailStatus
            //               menu={menu}
            //               isMobileFilter={isMobileFilter}
            //               onFilterChange={onFilterChange}
            //               isReset={isReset}
            //               setIsReset={setIsReset}
            //             />
            //           </DropdownItem>
            //           <DropdownItem className="mobile-filter">
            //             <FilterSearch
            //               menu={menu}
            //               isMobileFilter={isMobileFilter}
            //               onFilterSearchChange={setFilterSearch}
            //               isReset={isReset}
            //               setIsReset={setIsReset}
            //             />
            //           </DropdownItem>
            //           <DropdownItem className="btn-reset-filter w-100 py-2" onClick={onResetFilter}>
            //             {t("common.common_reset")}
            //           </DropdownItem>
            //         </>
            //       )}
            //     </DropdownMenu>
            //   </Dropdown>
            //   {/* </BaseButton> */}
            // </HanTooltip>
            <Row className="filter-options flex-grow-1 px-3">
              <Col className="col-12 d-flex align-items-center justify-content-between">
                <div className="d-flex">
                  {menu == "all" && (
                    <Folders
                      onFilterChange={onFilterChange}
                      isReset={isReset}
                      setIsReset={setIsReset}
                    />
                  )}
                  {menu !== "Secure" && menu !== "Receive" && (
                    <>
                      <Sorting
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
                      <MailStatus
                        menu={menu}
                        onFilterChange={onFilterChange}
                        isReset={isReset}
                        setIsReset={setIsReset}
                      />
                      <FilterSearch
                        menu={menu}
                        onFilterSearchChange={setFilterSearch}
                        isReset={isReset}
                        setIsReset={setIsReset}
                      />
                      <Button className={`han-h5 han-fw-regular han-text-primary`} outline color="white" onClick={onResetFilter}>
                        {t("common.common_reset")}
                      </Button>
                    </>
                  )}
                </div>
                <div className="d-flex">
                  <SearchInput
                    className={""}
                    initialData={
                      searchParams.get("keyword") ??
                      searchParams.get("f") ??
                      searchParams.get("t") ??
                      searchParams.get("c")
                    }
                    onSubmit={setKeyword}
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

export default memo(FilterToolbar)
