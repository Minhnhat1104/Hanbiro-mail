// @ts-nocheck
import { useTranslation } from "react-i18next"
import FieldItem from "./FieldItem"
import IncludesAttachment from "./IncludesAttachment"
import MailBox from "./MailBox"
import SearchDate from "./SearchDate"
import SearchGroup from "./SearchGroup"
import Status from "./Status"
import SortBy from "./SortBy"
import { useParams } from "react-router-dom"

const FilterModalBody = (props) => {
  const { filterOptions, onFilterChange } = props
  const { t } = useTranslation()
  const { menu } = useParams()

  const isShareMenu = menu?.includes("HBShare_")
  const isSpamMenu = menu === "Spam"

  return (
    <div className="d-flex flex-column gap-2">
      {/* From */}
      <FieldItem
        type={"f"}
        title={t("mail.mail_list_search_from")}
        filterOptions={filterOptions}
        onFilterChange={onFilterChange}
      />

      {/* To */}
      <FieldItem
        type={"t"}
        title={t("mail.mail_list_sort_toemail")}
        filterOptions={filterOptions}
        onFilterChange={onFilterChange}
      />

      {/* CC */}
      <FieldItem
        type={"c"}
        title={t("mail.mail_search_cc_bcc_addr")}
        filterOptions={filterOptions}
        onFilterChange={onFilterChange}
      />

      {/* Content */}
      <FieldItem
        title={t("common.board_content_msg")}
        component={
          <SearchGroup
            type={"searchfild"}
            filterOptions={filterOptions}
            onFilterChange={onFilterChange}
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

      {/* Sort by */}
      <FieldItem
        title={t("common.archive_title_msg_sorting")}
        component={
          <SortBy type={"sort"} filterOptions={filterOptions} onFilterChange={onFilterChange} />
        }
      />

      {/* Mail Box */}
      {!isShareMenu && !isSpamMenu && (
        <FieldItem
          title={t("mail.mail_mobile_mbox")}
          component={
            <MailBox
              type={"searchbox"}
              filterOptions={filterOptions}
              onFilterChange={onFilterChange}
            />
          }
        />
      )}

      {/* Status */}
      {/* <FieldItem
        title={t("common.org_device_state")}
        component={
          <Status type={"msgsig"} filterOptions={filterOptions} onFilterChange={onFilterChange} />
        }
      /> */}

      {/* More */}
      {/* <FieldItem
        title={t("mail.todo_more_msg")}
        component={
          <IncludesAttachment
            type={"isfile"}
            filterOptions={filterOptions}
            onFilterChange={onFilterChange}
          />
        }
      /> */}
    </div>
  )
}

export default FilterModalBody
