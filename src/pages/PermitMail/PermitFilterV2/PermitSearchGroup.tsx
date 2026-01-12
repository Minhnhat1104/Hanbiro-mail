// @ts-nocheck
import { Grid } from "@mui/material"
import { useTranslation } from "react-i18next"
import { Input } from "reactstrap"
import Select from "react-select"
import { colourStyles } from "components/Common/HanSelect"
import { useEffect, useState } from "react"

const PermitSearchGroup = (props) => {
  const { filterOptions, onFilterChange, type, options, getSelectedValue } = props
  const { t } = useTranslation()

  const [selectValue, setSelectValue] = useState("")

  useEffect(() => {
    if (filterOptions) {
      setSelectValue(getSelectedValue(filterOptions))
    }
  }, [filterOptions])

  const onChangeSelect = (data) => {
    onFilterChange &&
      onFilterChange({ type, value: { type: data?.value, keyword: filterOptions?.[selectValue] } })
  }

  const onChangeKeyword = (event) => {
    onFilterChange &&
      onFilterChange({ type, value: { type: selectValue, keyword: event?.target?.value } })
  }

  return (
    <div className="d-flex flex-column">
      <Grid container justifyContent="space-between" alignItems="center" spacing={1}>
        <Grid item xs={4}>
          <Select
            value={options.find((item) => item.value === selectValue) || options[0]}
            options={options}
            onChange={onChangeSelect}
            menuPosition="fixed"
            styles={colourStyles}
          />
        </Grid>
        <Grid item xs={8}>
          <Input
            value={
              selectValue === "subjectAndContent"
                ? filterOptions?.subject || filterOptions?.contents
                : filterOptions?.[selectValue] || ""
            }
            onChange={onChangeKeyword}
          />
        </Grid>
      </Grid>
    </div>
  )
}

export default PermitSearchGroup
