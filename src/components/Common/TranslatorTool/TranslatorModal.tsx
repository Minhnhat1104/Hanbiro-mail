// @ts-nocheck
import React, { useEffect, useMemo, useRef, useState } from "react"
import BaseModal from "../BaseModal"
import { useTranslation } from "react-i18next"
import { Input } from "reactstrap"
import BaseButton from "../BaseButton"
import { useTranslatorAPI } from "./hooks/useTranslatorAPI"
import BaseTable from "../BaseTable"
import PaginationV2 from "../Pagination/PaginationV2"
import BaseIcon from "../BaseIcon"
import { MenuItem, MenuList, Popover } from "@mui/material"
import NoData from "../NoData"
import AddLangModal from "./components/AddLangModal"

const initAttr = { pageCount: 0, pageIndex: 1, pageSize: 10 }
const filterOptions = [
  { value: "lang", label: "common.language" },
  { value: "menu", label: "common.archive_title_msg_category" },
  { value: "key_lang", label: "common.translator_key" },
  { value: "description", label: "common.common_description" },
]

const TranslatorModal = (props) => {
  const { isOpen = false, onClose, searchLang } = props
  const { t } = useTranslation()

  const [keyword, setKeyword] = useState(searchLang)
  const [searchVale, setSearchValue] = useState(searchLang)
  const [paging, setPaging] = useState(initAttr)
  const [langList, setLangList] = useState([])
  const [openWrite, setOpenWrite] = useState({ open: false, mode: "add", data: null })

  const [openFilter, setOpenFilter] = useState(false)
  const [filterSearch, setFilterSearch] = useState({ field: "lang" })

  const filterRef = useRef(null)

  const { getLanguageList } = useTranslatorAPI()

  const getLangList = async () => {
    const params = {
      folder: "",
      page: paging.pageIndex,
      limit: paging.pageSize,
      field: filterSearch.field,
      system: "client",
      order_by: "menu",
      sort_by: "asc",
      keyword: keyword,
    }

    const res = await getLanguageList(params)
    if (res && res?.rows) {
      setLangList(res?.rows)
    } else {
      setLangList([])
    }

    setPaging((prev) => ({ ...prev, pageCount: res?.attr?.total || 0 }))
  }

  useEffect(() => {
    getLangList()
  }, [keyword, paging.pageSize, paging.pageIndex, filterSearch.field])

  useEffect(() => {
    if (searchLang !== keyword) {
      setKeyword(searchLang)
      setSearchValue(searchLang)
      setPaging((prev) => ({ ...prev, pageIndex: 1 }))
    }
  }, [searchLang])

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      setPaging((prev) => ({ ...prev, pageIndex: 1, pageCount: 0 }))
      setKeyword(searchVale.trim())
    }
  }

  const onRefetch = () => {
    getLangList()
  }

  // table data
  const heads = [
    { content: t("common.translator_system") },
    { content: t("common.archive_title_msg_category") },
    { content: t("common.translator_key") },
    { content: "English" },
    { content: "Korea" },
    { content: "Vietnam" },
    { content: t("common.asset_action") },
  ]

  const rows = useMemo(() => {
    let rowsData = []
    langList?.map((lang, index) => {
      const columns = [
        { content: lang?.system },
        { content: lang?.menu },
        { content: lang?.key_lang },
        { content: lang?.en_code },
        { content: lang?.ko_code },
        { content: lang?.vi_code },
        {
          content: (
            <div className="d-flex gap-2">
              <BaseButton
                icon={"bx bx-edit han-color-success"}
                iconClassName="me-0"
                className={"btn-action p-1"}
                onClick={() => setOpenWrite({ open: true, mode: "edit", data: lang })}
              />
              <BaseButton
                icon={"bx bx-copy han-color-grey"}
                iconClassName="me-0"
                className={"btn-action p-1"}
                onClick={() => setOpenWrite({ open: true, mode: "copy", data: lang })}
              />
            </div>
          ),
        },
      ]
      rowsData.push({ columns })
    })

    return rowsData
  }, [langList])

  // modal data
  const renderHeader = () => t("common.translator_menu")

  const renderBody = () => (
    <div className="h-100 d-flex flex-column justify-content-between">
      <div className="d-flex flex-column gap-3" style={{ height: "calc(100% - 32px)" }}>
        <div className="d-flex justify-content-between gap-2">
          <div className="language-search w-25" style={{ minWidth: 200 }}>
            <Input
              className=""
              value={searchVale}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={onKeyDown}
            />

            <BaseIcon
              innerRef={filterRef}
              icon={"mdi mdi-filter"}
              onClick={() => setOpenFilter(true)}
            />
          </div>

          <BaseButton
            color="primary"
            icon={"bx bx-plus font-size-18"}
            iconClassName="me-0"
            className={"p-2"}
            onClick={() => setOpenWrite({ open: true, mode: "add", data: null })}
          ></BaseButton>

          <Popover
            id="lang-filter-popover"
            open={openFilter}
            anchorEl={filterRef.current}
            onClose={() => setOpenFilter(false)}
            elevation={3}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
            sx={{ mt: 0.125, "& .MuiPaper-root": {} }}
          >
            <MenuList>
              {filterOptions.map((_filter) => (
                <MenuItem
                  selected={_filter.value === filterSearch.field}
                  key={_filter.value}
                  value={_filter.value}
                  sx={{ fontSize: "var(--bs-body-font-size)" }}
                  onClick={() => {
                    setFilterSearch((prev) => ({ ...prev, field: _filter.value }))
                    setOpenFilter(false)
                    setPaging((prev) => ({ ...prev, pageIndex: 1, pageCount: 0 }))
                  }}
                >
                  {t(_filter.label)}
                </MenuItem>
              ))}
            </MenuList>
          </Popover>
        </div>

        <div className="language-table-list flex-1 overflow-auto mb-3">
          <BaseTable heads={heads} rows={rows} />
          {langList?.length === 0 && <NoData />}
        </div>
      </div>

      <div className="">
        <PaginationV2
          {...paging}
          onChangePage={(pageIndex) => setPaging((prev) => ({ ...prev, pageIndex }))}
          setPageSize={(type, pageSize) =>
            setPaging((prev) => ({ ...prev, pageIndex: 1, pageSize }))
          }
        />
      </div>
    </div>
  )

  return (
    <>
      <BaseModal
        size="xl"
        open={isOpen}
        toggle={onClose}
        renderHeader={renderHeader}
        renderBody={renderBody}
        modalClass="translator-modal"
      />

      {openWrite.open && (
        <AddLangModal
          onRefetch={onRefetch}
          isOpen={openWrite.open}
          mode={openWrite.mode}
          editData={openWrite.data}
          onClose={() => setOpenWrite({ open: false, mode: "add", data: null })}
        />
      )}
    </>
  )
}

export default TranslatorModal
