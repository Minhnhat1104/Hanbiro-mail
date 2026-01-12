// @ts-nocheck
import { BaseButton, BaseModal, BaseIcon } from "components/Common"
import { colourStyles } from "components/Common/HanSelect"
import BaseTable from "components/Common/BaseTable/index"
import { concat } from "lodash"
import { useCustomToast } from "hooks/useCustomToast"
import { postEmailExclude } from "store/emailConfig/actions"
import { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import useMenu from "utils/useMenu"
import { useTranslation } from "react-i18next"
import Select from "react-select"
import { Row, Col, FormGroup, Label } from "reactstrap"

const ExcludedMailboxModal = ({ open, onClose, refreshList }) => {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const { successToast, errorToast } = useCustomToast()
  const { basicMenus, folderMenus } = useMenu()
  const excludeSearch = useSelector((state) => state.EmailConfig.excludeSearch)
  const [excludeMailboxVal, setExcludeMailboxVal] = useState(excludeSearch.excludeMailbox)
  const [isNew, setIsNew] = useState({})
  const [isSaving, setIsSaving] = useState(false)

  const newOptions = [
    { label: t("mail.mail_select_checkbox_all"), value: "a" },
    { label: t("mail.mail_cspam_type_new"), value: "n" },
    { label: t("mail.mail_write_important_msg"), value: "f" },
  ]

  useEffect(() => {
    const item = newOptions.filter((option) => option.value === excludeSearch.isNew)
    setIsNew(item)
  }, [excludeSearch.isNew])

  const defaultOptions = useMemo(() => {
    let menus = concat(basicMenus, folderMenus)
    let array = menus.map((item) => {
      return {
        value: item.key ?? item.id,
        label: item.name,
      }
    })
    return array
  }, [basicMenus, folderMenus])

  const options = useMemo(() => {
    return defaultOptions.filter((menu) => excludeMailboxVal.indexOf(menu.value) === -1)
  }, [defaultOptions, excludeMailboxVal])

  const deleteMailbox = (mailbox) => {
    let newExcludeMailboxVal = [...excludeMailboxVal]
    const index = newExcludeMailboxVal.indexOf(mailbox.value)
    newExcludeMailboxVal.splice(index, 1)
    setExcludeMailboxVal(newExcludeMailboxVal)
  }

  const callback = (response) => {
    if (response.success) {
      successToast()
      onClose()
      refreshList && refreshList()
    } else {
      errorToast()
    }
  }

  const onSaveExclude = () => {
    console.log("2025-06-18 15:59:02---", excludeMailboxVal)
    setIsSaving(true)
    const params = {
      boxs: excludeMailboxVal?.length > 0 ? excludeMailboxVal.join(",") : "",
      isnew: isNew.value,
    }
    dispatch(postEmailExclude(params, callback))
  }

  const rows = useMemo(() => {
    if (excludeMailboxVal?.length > 0) {
      let array = defaultOptions.filter((menu) => excludeMailboxVal.indexOf(menu.value) !== -1)
      const rowsData = array.map((item) => ({
        columns: [
          {
            content: (
              <div className="d-flex align-items-center justify-content-between">
                <span>{item.label}</span>
                <BaseIcon
                  icon={"mdi mdi-delete text-danger font-size-15 p-1"}
                  onClick={() => deleteMailbox(item)}
                />
              </div>
            ),
          },
        ],
      }))
      return rowsData
    }
    return [
      {
        columns: [
          {
            content: (
              <div className="d-flex align-items-center justify-content-center">
                {t("common.nodata_msg")}
              </div>
            ),
          },
        ],
      },
    ]
  }, [excludeMailboxVal, defaultOptions])

  const onChangeSelect = (item) => {
    let newExcludeMailboxVal = [...excludeMailboxVal]
    newExcludeMailboxVal.push(item.value)
    setExcludeMailboxVal(newExcludeMailboxVal)
  }

  const onChangeNew = (item) => {
    setIsNew(item)
  }

  return (
    <BaseModal
      size="lg"
      isOpen={open}
      toggle={onClose}
      className="exclude-modal"
      renderHeader={() => {
        return <span className="ai-header-title">{t("mail.mail_excluded_mail")}</span>
      }}
      renderBody={() => (
        <div>
          <Row>
            <Col lg="12">
              <FormGroup className="mb-4" style={{ padding: "8px 0px", border: 0 }} row>
                <Label className="col-form-label col-lg-4">
                  {t("mail.mail_select_exclude_mailboxes")}
                </Label>
                <Col lg="8">
                  <Select
                    value={{}}
                    options={options}
                    onChange={onChangeSelect}
                    styles={colourStyles}
                    menuPosition="fixed"
                  />
                </Col>
              </FormGroup>
            </Col>
          </Row>
          <Row>
            <Col lg="12">
              <div className={`w-100 h-100 overflow-hidden`}>
                <div className="w-100 h-100 overflow-auto">
                  <BaseTable heads={{}} rows={rows} />
                </div>
              </div>
            </Col>
          </Row>
          <Row>
            <Col lg="12">
              <FormGroup className="mb-4" style={{ padding: "8px 0px", border: 0 }} row>
                <Label className="col-form-label col-lg-4">{t("common.common_filter")}</Label>
                <Col lg="8">
                  <Select
                    options={newOptions}
                    value={isNew}
                    onChange={onChangeNew}
                    styles={colourStyles}
                    menuPosition="fixed"
                  />
                </Col>
              </FormGroup>
            </Col>
          </Row>
        </div>
      )}
      renderFooter={() => {
        return (
          <span className={"d-flex w-100 justify-content-center"}>
            <BaseButton outline className={"btn-outline-grey"} onClick={onClose}>
              {t("common.common_btn_close")}
            </BaseButton>
            <BaseButton
              color={"primary"}
              className={"mx-2"}
              onClick={onSaveExclude}
              // disabled={isSaving}
              loading={isSaving}
            >
              {t("common.common_btn_save")}
            </BaseButton>
          </span>
        )
      }}
    />
  )
}

export default ExcludedMailboxModal
