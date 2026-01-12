// @ts-nocheck
import { Grid } from "@mui/material"
import { useTranslation } from "react-i18next"
import { Input } from "reactstrap"
import Select from "react-select"
import { colourStyles } from "components/Common/HanSelect"

const SearchGroup = (props) => {
  const { filterOptions, onFilterChange, type } = props
  const { t } = useTranslation()

  const filterSearchOptions = [
    { label: t("common.mail_list_search_allfield"), value: "all" },
    { label: t("mail.mail_set_autosplit_splitsubject"), value: "s" },
    { label: t("mail.sms_breakdown_col_content"), value: "c" },
    {
      label:
        t("mail.mail_set_autosplit_splitsubject") + " + " + t("mail.sms_breakdown_col_content"),
      value: "sc",
    },
    {
      label: t("mail.mail_view_search_by_attachment"),
      value: "filename",
    },
  ]

  const onChangeSelect = (data) => {
    onFilterChange && onFilterChange({ type, value: data?.value })
  }

  const onChangeKeyword = (event) => {
    onFilterChange && onFilterChange({ type: "keyword", value: event?.target?.value })
  }

  return (
    <div className="d-flex flex-column">
      <Grid container justifyContent="space-between" alignItems="center" spacing={1}>
        <Grid item xs={4}>
          <Select
            value={
              filterSearchOptions.find((item) => item.value === filterOptions?.[type]) ||
              filterSearchOptions[0]
            }
            options={filterSearchOptions}
            onChange={onChangeSelect}
            styles={colourStyles}
            menuPosition="fixed"
          />
        </Grid>
        <Grid item xs={8}>
          <Input value={filterOptions?.keyword || ""} onChange={onChangeKeyword} />
        </Grid>
      </Grid>
    </div>
  )
}

export default SearchGroup
