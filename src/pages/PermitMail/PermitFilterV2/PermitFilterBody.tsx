// @ts-nocheck
import { useTranslation } from "react-i18next"
import IncludesAttachment from "../../List/FilterToolbar/IncludesAttachment"
import SearchDate, { currentDataOptions } from "../../List/FilterToolbar/SearchDate"
import Status from "../../List/FilterToolbar/Status"
import FieldItem from "pages/List/FilterToolbar/FieldItem"
import PermitSearchGroup from "./PermitSearchGroup"
import PermitSortBy from "./PermitSortBy"
import PermitStatus from "./PermitStatus"
import PermitIncludesAttachment from "./PermitIncludesAttachment"
import moment from "moment"

const PermitFilterBody = (props) => {
  const { filterOptions, onFilterChange } = props
  const { t } = useTranslation()

  const searchToOptions = [
    { label: t("mail.mail_list_sort_toemail"), value: "toaddr" },
    { label: t("mail.admin_mail_secure_to_cc_bcc_addr"), value: "alltoaddr" },
  ]

  const searchContentOptions = [
    { label: t("mail.mail_before_preview_all"), value: "all" },
    { label: t("mail.mail_set_autosplit_splitsubject"), value: "subject" },
    { label: t("mail.sms_breakdown_col_content"), value: "contents" },
    {
      label:
        t("mail.mail_set_autosplit_splitsubject") + " + " + t("mail.sms_breakdown_col_content"),
      value: "subjectAndContent",
    },
    { label: t("mail.mail_secure_file_msg"), value: "filelist" },
  ]

  const getSelectedToValue = (filterOptions) => {
    if (filterOptions?.hasOwnProperty("toaddr") && !filterOptions?.hasOwnProperty("alltoaddr")) {
      return "toaddr"
    } else if (
      filterOptions?.hasOwnProperty("alltoaddr") &&
      !filterOptions?.hasOwnProperty("toaddr")
    ) {
      return "alltoaddr"
    } else {
      return "toaddr"
    }
  }

  const getSelectedContentValue = (filterOptions) => {
    if (
      filterOptions?.hasOwnProperty("subject") &&
      !filterOptions?.hasOwnProperty("contents") &&
      !filterOptions?.hasOwnProperty("filelist")
    ) {
      return "subject"
    } else if (
      filterOptions?.hasOwnProperty("contents") &&
      !filterOptions?.hasOwnProperty("subject") &&
      !filterOptions?.hasOwnProperty("filelist")
    ) {
      return "contents"
    } else if (
      filterOptions?.hasOwnProperty("filelist") &&
      !filterOptions?.hasOwnProperty("subject") &&
      !filterOptions?.hasOwnProperty("contents")
    ) {
      return "filelist"
    } else if (
      filterOptions?.hasOwnProperty("subject") &&
      filterOptions?.hasOwnProperty("contents")
    ) {
      return "subjectAndContent"
    } else {
      return "all"
    }
  }

  return (
    <div className="d-flex flex-column gap-2">
      {/* Sort by */}
      <FieldItem
        title={t("common.archive_title_msg_sorting")}
        component={
          <PermitSortBy
            type={"sort"}
            filterOptions={filterOptions}
            onFilterChange={onFilterChange}
          />
        }
      />

      {/* User Id */}
      <FieldItem
        type={"userid"}
        title={t("mail.mail_fetching_user_ID")}
        filterOptions={filterOptions}
        onFilterChange={onFilterChange}
      />

      {/* Permission Manager */}
      <FieldItem
        type={"approve_user"}
        title={t("mail.mail_permit_filter_main_manager")}
        filterOptions={filterOptions}
        onFilterChange={onFilterChange}
      />

      {/* From */}
      <FieldItem
        type={"fromaddr"}
        title={t("mail.mail_list_search_from")}
        filterOptions={filterOptions}
        onFilterChange={onFilterChange}
      />

      {/* To */}
      <FieldItem
        title={t("mail.mail_list_sort_toemail")}
        component={
          <PermitSearchGroup
            type={"to"}
            options={searchToOptions}
            filterOptions={filterOptions}
            onFilterChange={onFilterChange}
            getSelectedValue={getSelectedToValue}
          />
        }
      />

      {/* Content */}
      <FieldItem
        title={t("common.board_content_msg")}
        component={
          <PermitSearchGroup
            type={"content"}
            options={searchContentOptions}
            filterOptions={filterOptions}
            onFilterChange={onFilterChange}
            getSelectedValue={getSelectedContentValue}
          />
        }
      />

      {/* Permit Date */}
      <FieldItem
        title={t("mail.admin_mail_secure_approve_date")}
        component={
          <SearchDate
            type={"approve_date"}
            filterOptions={filterOptions}
            onFilterChange={onFilterChange}
            keyOfStartDate="approve_startdate"
            keyOfEndDate="approve_enddate"
          />
        }
      />

      {/* Search Date */}
      <FieldItem
        title={t("mail.mail_log_search_date")}
        component={
          <SearchDate type={"date"} filterOptions={filterOptions} onFilterChange={onFilterChange} />
        }
      />

      {/* Status */}
      <FieldItem
        title={t("common.org_device_state")}
        component={
          <PermitStatus
            type={"state"}
            filterOptions={filterOptions}
            onFilterChange={onFilterChange}
          />
        }
      />

      {/* Attachment */}
      <FieldItem
        title={t("mail.mail_secure_file_msg")}
        component={
          <PermitIncludesAttachment
            type={"isfile"}
            filterOptions={filterOptions}
            onFilterChange={onFilterChange}
          />
        }
      />
    </div>
  )
}

export default PermitFilterBody
