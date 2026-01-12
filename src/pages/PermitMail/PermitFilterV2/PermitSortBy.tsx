// @ts-nocheck
import { colourStyles } from "components/Common/HanSelect"
import { DATE_SORT, EMAIL_SORT, SIZE_SORT, SUBJECT_SORT } from "constants/init/filterOptions"
import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import Select from "react-select"
import { Col, Row } from "reactstrap"

const initSortOptions = {
  sortkey: "timestamp",
  sorttype: "desc",
}

const getInitPermitSorting = (queryParams) => {
  if (queryParams?.["sortkey"] && queryParams?.["sorttype"]) {
    return { sortkey: queryParams["sortkey"], sorttype: queryParams["sorttype"] }
  } else {
    return initSortOptions
  }
}

const PermitSortBy = (props) => {
  const { type, filterOptions, onFilterChange } = props
  const { t } = useTranslation()

  const sortOptions = [
    { label: t("mail.mail_send_user"), value: "userid" },
    { label: t("mail.mail_set_autosplit_splitsubject"), value: "subject" },
    { label: t("mail.mail_secure_date"), value: "timestamp" },
  ]

  const sortType = [
    { label: "A-Z", value: "asc" },
    { label: "Z-A", value: "desc" },
  ]

  const handleChangeSort = (data, sortkey) => {
    onFilterChange && onFilterChange({ type, value: { sortkey, value: data.value } })
  }

  return (
    <Row className="gx-2">
      <Col xs={8}>
        <Select
          value={
            sortOptions.find((item) => item.value === filterOptions?.["sortkey"]) || sortOptions[0]
          }
          options={sortOptions}
          onChange={(data) => handleChangeSort(data, "sortkey")}
          styles={colourStyles}
        />
      </Col>

      <Col xs={4}>
        <Select
          value={sortType.find((item) => item.value == filterOptions?.["sorttype"]) || sortType[1]}
          options={sortType}
          onChange={(data) => handleChangeSort(data, "sorttype")}
          styles={colourStyles}
        />
      </Col>
    </Row>
  )
}

export default PermitSortBy
