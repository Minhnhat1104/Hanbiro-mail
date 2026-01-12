// @ts-nocheck
import { useState } from "react"

import { Dropdown, DropdownMenu, DropdownToggle, Input, InputGroup, Label } from "reactstrap"
import Select from "react-select"
import { useTranslation } from "react-i18next"
import classnames from "classnames"

import { BaseButton } from "components/Common"

import "./style.scss"

const SearchSelect = ({
                        search, // { keyword: "", searchType: { label: "", value: "" }}
                        setSearch,
                        onKeyDown,
                        onSubmit,
                        options,
                        placeholder = "common.common_search",
                        inputGroupClassName = "",
                        ...rest
                      }) => {
  const { t } = useTranslation()

  // State
  const [open, setOpen] = useState(false)

  return (
    <div>
      <InputGroup className={classnames("rounded-2", inputGroupClassName)}>
        <div className="position-relative">
          <Input
            id="search-user"
            type="text"
            value={search.keyword}
            className="han-bg-color-soft-grey border-0 rounded-2 han-h4 han-fw-regular han-text-primary pl-40"
            placeholder={t(placeholder) + "..."}
            onKeyDown={onKeyDown}
            onChange={(e) => setSearch((prev) => ({ ...prev, keyword: e.target.value }))}
            style={{ height: "38px" }}
            {...rest}
          />

          <i className="bx bx-search-alt left-icon" />

          <Dropdown isOpen={open} toggle={() => setOpen(!open)}>
            <DropdownToggle tag="span" caret>
              <i className="mdi mdi-chevron-down right-icon font-size-18" />
            </DropdownToggle>
            <DropdownMenu style={{ minWidth: "160px" }}>
              <div className="p-2">
                <Label for="exampleSelect">{t("mail.mail_admin_search_type")}</Label>
                <Select
                  value={search.searchType}
                  onChange={(e) => setSearch((prev) => ({ ...prev, searchType: e }))}
                  options={options}
                  styles={{
                    menu: (base) => ({
                      ...base,
                      backgroundColor: "white!important",
                      zIndex: "1000",
                    }),
                  }}
                  isMulti={false}
                />
              </div>
              <div className="p-2">
                <Label for="exampleSelect">{t("common.common_search_keyword")}</Label>
                <Input
                  value={search.keyword}
                  type="text"
                  onChange={(e) => setSearch((prev) => ({ ...prev, keyword: e.target.value }))}
                />
              </div>
              <div className="d-flex justify-content-center p-2">
                <BaseButton
                  color={"primary"}
                  icon={"bx bx-search-alt"}
                  type="button"
                  onClick={onSubmit}
                >
                  {t("common.common_search")}
                </BaseButton>
              </div>
            </DropdownMenu>
          </Dropdown>
        </div>
      </InputGroup>
    </div>
  )
}

export default SearchSelect
