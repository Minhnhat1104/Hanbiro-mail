// @ts-nocheck
// React
import moment from "moment"
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

// Third-party
import { Col, Input, Row } from "reactstrap"

// Project
import { BaseIcon, BaseModal, NoData } from "components/Common"
import BaseButton from "components/Common/BaseButton"
import BaseTable from "components/Common/BaseTable"
import HanDatePicker from "components/Common/HanDatePicker"
import { colourStyles } from "components/Common/HanSelect"
import Loading from "components/Common/Loading"
import PaginationV2 from "components/Common/Pagination/PaginationV2"
import PieChart from "components/SettingAdmin/Chart/PieChart"
import BaseViewText from "components/SettingAdmin/ViewText"
import { emailGet } from "helpers/email_api_helper"
import useDevice from "hooks/useDevice"
import { LOG_ANALYSIS } from "modules/mail/admin/url"
import Footer from "pages/SettingMain/Footer"
import MainHeader from "pages/SettingMain/MainHeader"
import Toolbar from "pages/SettingMain/Toolbar"
import { useSelector } from "react-redux"
import Select from "react-select"
import { formatTimestampToDate } from "utils"
import { getDateFormat } from "utils/dateTimeFormat"
import "../../Settings/SpamSettings/style.scss"
import FilteringStatus from "../SpamManager/FilteringStatus"
import BlockWhiteForm from "./BlockWhiteForm"
import HanTooltip from "components/Common/HanTooltip"
import DownloadCsvModal from "./DownloadCsvModal"

const LogAnalysis = (props) => {
  const { routeConfig } = props
  const { t } = useTranslation()
  const { isDesktop, isMobile } = useDevice()

  // redux state
  const userConfig = useSelector((state) => state?.Config?.userConfig)
  const userDateFormat = getDateFormat(userConfig, "/")

  const [data, setData] = useState()
  const [history, setHistory] = useState()
  // State Toggle
  const [togModal3, setTogModal3] = useState(false)
  const [togModal4, setTogModal4] = useState(false)
  const [showChart, setShowChart] = useState(false)
  const initialFilterTime = {
    type: "",
    status: "",
    date: { label: t("mail.mail_select_checkbox_all"), value: "all" },
  }
  const [showFilter, setShowFilter] = useState(initialFilterTime)
  const [filterType, setFilterType] = useState(null)
  const [filterStatus, setFilterStatus] = useState(null)
  const [openCsvModal, setOpenCsvModal] = useState(false)

  const strFormat = `${userDateFormat?.toUpperCase()} HH:mm:ss`
  const minWeek = formatTimestampToDate(
    moment().subtract(7, "days").startOf("day").unix(),
    strFormat,
  )
  const initialFilter = {
    fromaddr: "",
    ipaddr: "",
    isadmin: "y",
    linenum: 15,
    page: 1,
    searchkey: "",
    status: "",
    subject: "",
    toaddr: "",
    type: "",
    enddate: moment().endOf("day").format(strFormat),
    startdate: minWeek,
  }
  const [filter, setFilter] = useState(initialFilter)

  const initFormSpam = {
    type: "", // email/domain or ip
    mode: "", // block or white (b or w)
    data: "",
    isdrop: "n",
  }
  const [formSpam, setFormSpam] = useState(initFormSpam)

  // State Loading
  const [isLoading, setIsLoading] = useState(false)
  const [refetch, setRefetch] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const res = await emailGet(LOG_ANALYSIS, filter)
        if (res?.success) {
          setData(res)
          setIsLoading(false)
        }
      } catch (err) {
        // errorToast()
        console.log("error messenger", err)
      }
    }

    if (refetch) {
      fetchData()
      setRefetch(false)
    }
    setRefetch(false)
  }, [refetch])

  function removeBodyCss() {
    document.body.classList.add("no_padding")
  }

  function togtoggleModal3(item = {}) {
    setTogModal3(!togModal3)
    setHistory(item)
    removeBodyCss()
  }

  function togtoggleModal4() {
    setTogModal4(!togModal4)
    removeBodyCss()
  }

  const onChangePage = (page) => {
    setFilter({ ...filter, page: page })
    setRefetch(true)
  }

  const onResetFilter = () => {
    setFilterType(null)
    setFilterStatus(null)
    setShowFilter(initialFilterTime)
    setFilter(initialFilter)
    setRefetch(true)
  }

  const startDateChange = (date) => {
    setFilter((prev) => ({
      ...prev,
      startdate: moment(date).format(strFormat),
    }))
  }

  const endDateChange = (date) => {
    setFilter((prev) => ({
      ...prev,
      enddate: moment(date).format(strFormat),
    }))
  }

  const filterTypeChange = (value) => {
    setFilter({ ...filter, type: value?.value, page: 1 })
    setFilterType(value)
    setRefetch(true)
  }

  const filterStatusChange = (value) => {
    setFilter({ ...filter, status: value?.value, page: 1 })
    setFilterStatus(value)
    setRefetch(true)
  }

  const typeOptions = [
    { label: t("mail.mail_receive_info"), value: "r" },
    { label: t("common.common_send_msg"), value: "s" },
    { label: t("mail.mail_cspam_spam"), value: "p" },
    { label: t("mail.admin_user_access_deny"), value: "b" },
    { label: t("common.timecard_status_etc_msg"), value: "e" },
  ]

  const statusOptions = [
    { label: t("common.alert_success_msg"), value: "s" },
    { label: t("mail.mail_fail"), value: "f" },
    { label: t("mail.mail_delay"), value: "d" },
  ]

  const renderModalHistory = () => {
    return <div>{t("mail.mail_history")}</div>
  }

  const renderBodyHistory = () => {
    if (history) {
      return (
        <div>
          <BaseViewText
            title={t("mail.mail_cspam_type")}
            text={`${history?.mtype} ${history?.type} ${
              history?.status === "s"
                ? t("common.alert_success_msg")
                : history?.status === "d"
                ? t("mail.mail_delay")
                : t("common.common_failed")
            }`}
          ></BaseViewText>
          <BaseViewText title={t("common.hr_result")} text={history?.msg}></BaseViewText>
          <BaseViewText
            title={t("mail.mail_log_msg")}
            text={<span className="text-break">{history?.result}</span>}
          ></BaseViewText>
          <BaseViewText
            title={t("mail.mail_list_sort_date")}
            text={history?.startdate}
          ></BaseViewText>
          <BaseViewText
            title={t("mail.mail_set_autosplit_splitsubject")}
            text={history?.subject}
          ></BaseViewText>
          <BaseViewText title={t("mail.mail_cspam_spam_from")} text={history?.from}></BaseViewText>
          <BaseViewText title={t("mail.mail_cspam_spam_to")} text={history?.to}></BaseViewText>
          <div className="overflow-x-auto">
            <BaseTable heads={heads2} rows={rows2} />
          </div>
        </div>
      )
    } else return
  }

  const FooterHistory = () => {
    return (
      <div className="btn-form-action-approval">
        <BaseButton color={"secondary"} type="button" onClick={togtoggleModal3}>
          {t("common.main_close_msg")}
        </BaseButton>
      </div>
    )
  }

  const logType = (type) => {
    let result = ""
    switch (type) {
      case "receive":
        result = t("mail.mail_receive_info")
        break
      case "sent":
        result = t("common.common_send_msg")
        break
      case "spam":
        result = t("common.mail_spam_label")
        break
      case "block":
        result = t("mail.admin_user_access_deny")
        break
      case "etc":
        result = t("common.timecard_status_etc_msg")
        break
    }
    return result
  }

  const heads = [
    { content: t("mail.mail_cspam_type") },
    { content: t("common.hr_result") },
    { content: t("mail.mail_list_sort_date") },
    { content: t("mail.mail_cspam_subject") },
    { content: t("common.mail_sender") },
    { content: t("common.mail_receiver") },
    { content: "IP" },
    { content: t("mail.mail_list_sort_size") },
  ]

  const rows = useMemo(() => {
    if (data?.rows) {
      const rowsLog = data?.rows.map((item, index) => ({
        class: "align-middle",
        columns: [
          {
            content: (
              <div>
                <div>{logType(item?.type)}</div>
              </div>
            ),
          },
          {
            content: (
              <div className={`d-flex justify-content-center align-items-center`}>
                <BaseIcon
                  className={`${
                    item?.status === "s"
                      ? "han-color-success"
                      : item?.status === "d"
                      ? "han-color-warning"
                      : "han-color-error"
                  }`}
                  icon={`mdi ${
                    item?.status === "s"
                      ? "mdi-alpha-s-circle"
                      : item?.status === "d"
                      ? "mdi-alpha-d-circle"
                      : "mdi-alpha-f-circle"
                  } font-size-24`}
                  onClick={() => {
                    togtoggleModal3(item)
                  }}
                ></BaseIcon>
              </div>
            ),
          },
          {
            content: (
              <div className="d-flex flex-column" style={{ minWidth: "154px" }}>
                <div>{`${t("mail.mail_start_date")}: ${item?.startdate}`}</div>
                <div>{`${t("mail.mail_end_date")}: ${item?.enddate}`}</div>
              </div>
            ),
          },
          {
            content: (
              <div
                className={`han-color-primary cursor-pointer`}
                onClick={() => {
                  setFormSpam({
                    ...formSpam,
                    type: "subject",
                    mode: "b",
                    subject: item?.subject,
                    from: item?.from,
                    to: item?.to,
                  })
                }}
              >
                {item?.subject}
              </div>
            ),
          },
          {
            content: item?.from ? (
              <div className="d-flex flex-column">
                <span
                  className={`han-color-primary cursor-pointer`}
                  onClick={() => {
                    setFormSpam({
                      ...formSpam,
                      data: item?.from,
                      type: "email",
                      mode: "b",
                    })
                  }}
                >
                  {item?.from}
                </span>
                {item?.forward_sender && <span>{`(${item?.forward_sender})`}</span>}
              </div>
            ) : (
              ""
            ),
          },
          {
            content: item?.to ? (
              <div className="d-flex align-items-center">
                <span
                  className={`han-color-primary cursor-pointer`}
                  onClick={() => {
                    setFormSpam({
                      ...formSpam,
                      data: item?.to,
                      type: "email",
                      mode: "b",
                    })
                  }}
                >
                  {item?.to}
                </span>
              </div>
            ) : (
              ""
            ),
          },
          {
            content: item?.remoteip ? (
              <div className="d-flex align-items-center">
                <span
                  className={`han-color-primary cursor-pointer`}
                  onClick={() => {
                    setFormSpam({
                      ...formSpam,
                      data: item?.remoteip,
                      type: "ip",
                      mode: "b",
                    })
                  }}
                >
                  {item?.remoteip}
                </span>
              </div>
            ) : (
              ""
            ),
          },
          { content: item?.size },
        ],
      }))
      return rowsLog
    }
    return []
  }, [data, formSpam])

  const heads2 = [
    { content: t("mail.mail_list_sort_date") },
    { content: t("mail.mail_secure_user_name_msg") },
    { content: t("mail.mail_cspam_type") },
    { content: t("common.mail_log_action") },
    { content: t("mail.mail_log_msg") },
  ]

  const rows2 = useMemo(() => {
    if (history?.history) {
      const rows = history?.history.map((item, index) => ({
        columns: [
          { content: item?.date },
          { content: item?.name },
          { content: item?.type },
          { content: item?.action },
          { content: item?.msg },
        ],
      }))
      return rows
    }
    return []
  }, [history])

  // Search when enter
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      setRefetch(true)
    }
  }

  return (
    <>
      <MainHeader currentTitleMenu={routeConfig?.keyTitle} />
      {!!data && showChart && (
        <Row>
          <Col lg="6">
            <PieChart
              data={data?.chart2?.data}
              type={data?.chart2?.type}
              legend={data?.chart2?.legend}
            />
          </Col>
          <Col lg="6">
            <PieChart
              data={data?.chart3?.data}
              type={data?.chart3?.type}
              legend={data?.chart3?.legend}
            />
          </Col>
        </Row>
      )}
      <Toolbar
        display={{ start: "col", end: "row" }}
        start={
          <>
            <div className={`d-flex align-items-center gap-2`}>
              <Input
                className={`text-toolbar han-text-primary`}
                placeholder={t("mail.mail_cspam_spam_from")}
                value={filter?.fromaddr}
                onChange={(e) => setFilter((prev) => ({ ...prev, fromaddr: e.target.value }))}
                style={{ height: "38px" }}
              />
              <Input
                className={`text-toolbar han-text-primary`}
                placeholder={t("mail.mail_cspam_spam_to")}
                value={filter?.toaddr}
                onChange={(e) => setFilter((prev) => ({ ...prev, toaddr: e.target.value }))}
                style={{ height: "38px" }}
              />
              <Input
                className={`text-toolbar han-text-primary`}
                placeholder={t("common.mail_list_sort_subject")}
                value={filter?.subject}
                onChange={(e) => setFilter((prev) => ({ ...prev, subject: e.target.value }))}
                style={{ height: "38px" }}
              />
              <Input
                className={`text-toolbar han-text-primary`}
                placeholder={t("mail.mail_cspam_ip_address")}
                value={filter?.ipaddr}
                onChange={(e) => setFilter((prev) => ({ ...prev, ipaddr: e.target.value }))}
                style={{ height: "38px" }}
              />
              <HanTooltip overlay={t("mail.addrbook_find_msg")} placement="top">
                <BaseButton
                  color="grey"
                  className={"btn-action m-0 border-0"}
                  icon={"mdi mdi-magnify font-size-18"}
                  iconClassName={`m-0`}
                  onClick={() => {
                    setRefetch(true)
                  }}
                  style={{ width: "38px", height: "38px" }}
                />
              </HanTooltip>
              <HanTooltip overlay={t("common.common_reset")} placement="top">
                <BaseButton
                  color="grey"
                  className={"btn-action m-0 border-0"}
                  icon={"mdi mdi-find-replace font-size-18"}
                  iconClassName={`m-0`}
                  onClick={onResetFilter}
                  style={{ width: "38px", height: "38px" }}
                />
              </HanTooltip>
            </div>
            <div className={`d-flex justify-content-start align-items-center flex-wrap gap-2 mt-2`}>
              <div>
                <HanDatePicker
                  className={`text-toolbar han-text-primary`}
                  value={
                    moment(filter?.startdate, strFormat).toDate() ||
                    moment(minWeek, strFormat).toDate()
                  }
                  onChange={startDateChange}
                  dateFormat={userDateFormat}
                  enableTabLoop={false} // Fix react-datepicker pushing other elements to the right on toggle
                  attrs={{
                    style: { width: "136px" },
                    buttonStyle: { width: "38px", height: "38px" },
                    buttonClassName: "btn-grey text-white",
                    buttonWrapperStyle: { border: "none" },
                  }}
                />
              </div>
              <div>
                <HanDatePicker
                  className={`text-toolbar han-text-primary`}
                  value={moment(filter?.enddate, strFormat).toDate() || new Date()}
                  onChange={endDateChange}
                  dateFormat={userDateFormat}
                  enableTabLoop={false} // Fix react-datepicker pushing other elements to the right on toggle
                  attrs={{
                    style: { width: "136px" },
                    buttonStyle: { width: "38px", height: "38px" },
                    buttonWrapperStyle: { border: "none" },
                    buttonClassName: "btn-grey text-white",
                  }}
                />
              </div>
              <div>
                <Select
                  key={`type_selected_${filterType?.value}`}
                  className={`select2-selection rounded-2`}
                  options={typeOptions}
                  value={filterType}
                  onChange={filterTypeChange}
                  placeholder={`${t("mail.mail_cspam_type")}...`}
                  styles={{
                    ...colourStyles,
                    control: (base, state) => ({
                      ...base,
                      backgroundColor: "#f4f4f4",
                      borderColor: "#f4f4f4",
                      borderRadius: "4px",
                      width: "173px",
                      boxShadow: "none",
                      ":hover": {
                        ...base[":hover"],
                        borderColor: "#f4f4f4",
                      },
                    }),
                  }}
                />
              </div>
              <div className={`d-flex align-items-center`}>
                <Select
                  key={`status_selected_${filterStatus?.value}`}
                  className={`select2-selection rounded-2`}
                  options={statusOptions}
                  value={filterStatus}
                  onChange={filterStatusChange}
                  placeholder={`${t("mail.asset_status")}...`}
                  styles={{
                    ...colourStyles,
                    control: (base, state) => ({
                      ...base,
                      backgroundColor: "#f4f4f4",
                      borderColor: "#f4f4f4",
                      borderRadius: "4px",
                      width: "173px",
                      boxShadow: "none",
                      ":hover": {
                        ...base[":hover"],
                        borderColor: "#f4f4f4",
                      },
                    }),
                  }}
                />
              </div>
            </div>
          </>
        }
        end={
          <>
            <HanTooltip overlay={t("mail.mail_admin_receive_rules")} placement="top">
              <BaseButton
                outline
                color="grey"
                className={"btn-outline-grey btn-action"}
                icon={"mdi mdi-filter font-size-18"}
                iconClassName={`m-0`}
                onClick={() => {
                  togtoggleModal4()
                }}
                style={{ width: "38px", height: "38px" }}
              />
            </HanTooltip>
            <HanTooltip overlay={t("Chart")} placement="top">
              <BaseButton
                outline
                color="grey"
                className={"btn-outline-grey btn-action"}
                icon={"mdi mdi-chart-bar font-size-18"}
                iconClassName={`m-0`}
                onClick={() => setShowChart(!showChart)}
                loading={isLoading}
                style={{ width: "38px", height: "38px" }}
              />
            </HanTooltip>
            <HanTooltip overlay={t("mail.mail_download_csv")} placement="top">
              <BaseButton
                outline
                color="grey"
                className={"btn-outline-grey btn-action"}
                icon={"mdi mdi-download font-size-18"}
                iconClassName={`m-0`}
                onClick={() => setOpenCsvModal(true)}
                loading={isLoading}
                style={{ width: "38px", height: "38px" }}
              />
            </HanTooltip>
            <HanTooltip overlay={t("common.org_refresh")} placement="top">
              <BaseButton
                outline
                color="grey"
                className={"btn-outline-grey btn-action"}
                icon={"mdi mdi-refresh font-size-18"}
                iconClassName={`m-0`}
                onClick={onResetFilter}
                loading={isLoading}
                style={{ width: "38px", height: "38px" }}
              />
            </HanTooltip>
          </>
        }
      />

      <div className={`w-100 h-100 overflow-hidden`}>
        <div className="w-100 h-100 overflow-auto">
          <BaseTable
            heads={heads}
            rows={rows}
            tableClass={`d-sm-table m-0`}
            className={`d-lg-table-row`}
          />
          {data?.rows.length === 0 && <NoData />}
          {isLoading && <Loading />}
        </div>
      </div>

      <Footer
        footerContent={
          data &&
          data?.tot > 0 && (
            <PaginationV2
              pageCount={data?.tot}
              pageSize={15}
              pageIndex={filter?.page}
              onChangePage={onChangePage}
              hideBorderTop={true}
              hideRowPerPage={true}
            />
          )
        }
      />

      {/* Form update Block/White & Receive Block */}
      {formSpam?.type && (
        <BlockWhiteForm
          isOpen={formSpam.type !== ""}
          toggleModal={() => {
            setFormSpam(initFormSpam)
          }}
          headerTitle={
            formSpam?.type === "subject"
              ? t("mail.mail_keyword_blocking_settings")
              : formSpam?.mode === "b"
              ? t("mail.mail_adding_blocklist")
              : t("mail.mail_receive_white")
          }
          formSpam={formSpam}
          setFormSpam={setFormSpam}
        />
      )}

      {/* History */}
      {togModal3 && (
        <BaseModal
          isOpen={togModal3}
          toggle={() => {
            togtoggleModal3()
          }}
          centered
          renderHeader={renderModalHistory}
          renderBody={renderBodyHistory}
          renderFooter={FooterHistory}
        />
      )}

      {/* Filtering Status */}
      {togModal4 && <FilteringStatus isOpen={togModal4} toggleModal={togtoggleModal4} />}

      {/* Download CSV Modal */}
      {openCsvModal && (
        <DownloadCsvModal isOpen={openCsvModal} onClose={() => setOpenCsvModal(false)} />
      )}
    </>
  )
}

export default LogAnalysis
