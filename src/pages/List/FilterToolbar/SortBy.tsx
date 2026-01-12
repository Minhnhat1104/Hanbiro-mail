// @ts-nocheck
import { colourStyles } from "components/Common/HanSelect"
import { DATE_SORT, EMAIL_SORT, SIZE_SORT, SUBJECT_SORT } from "constants/init/filterOptions"
import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import Select from "react-select"
import { Col, Row } from "reactstrap"

const initSortOptions = {
  value: "date",
  sort: 0,
}

const getInitFilterSorting = (queryParams) => {
  if (queryParams?.["mailsort"] && queryParams?.["sortkind"]) {
    return { value: queryParams["mailsort"], sort: Number(queryParams["sortKind"]) }
  } else {
    return initSortOptions
  }
}

const SortBy = (props) => {
  const { type, filterOptions, onFilterChange } = props
  const { t } = useTranslation()

  const sortOptions = [
    { label: t("mail.mail_list_sort_fromemail"), value: EMAIL_SORT },
    { label: t("mail.mail_set_autosplit_splitsubject"), value: SUBJECT_SORT },
    { label: t("mail.mail_list_sort_size"), value: SIZE_SORT },
    { label: t("mail.mail_secure_date"), value: DATE_SORT },
  ]

  const sortType = [
    { label: "A-Z", value: "1" },
    { label: "Z-A", value: "0" },
  ]

  const handleChangeSort = (data, sortType) => {
    onFilterChange && onFilterChange({ type, value: { sortType, value: data.value } })
  }

  return (
    <Row className="gx-2">
      <Col xs={8}>
        <Select
          value={
            sortOptions.find((item) => item.value === filterOptions?.["mailsort"]) || sortOptions[0]
          }
          options={sortOptions}
          onChange={(data) => handleChangeSort(data, "mailsort")}
          styles={colourStyles}
        />
      </Col>

      <Col xs={4}>
        <Select
          value={sortType.find((item) => item.value == filterOptions?.["sortkind"]) || sortType[1]}
          options={sortType}
          onChange={(data) => handleChangeSort(data, "sortkind")}
          styles={colourStyles}
        />
      </Col>
    </Row>
  )
}

export default SortBy
