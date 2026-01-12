// @ts-nocheck
// React
import React, { useEffect, useMemo, useState } from "react"

// Third-party
import { useTranslation } from "react-i18next"
import { Collapse, Card } from "reactstrap"

// Project
import Tooltip from "components/SettingAdmin/Tooltip"
import BaseButton from "components/Common/BaseButton"
import { Title } from "components/SettingAdmin"
import InputText from "components/SettingAdmin/Input/index"
import InputSelect from "components/SettingAdmin/Inputselect/index"
import ToggleSwitch from "components/SettingAdmin/Toggle/index"
import BaseTable from "components/Common/BaseTable"
import { useCustomToast } from "hooks/useCustomToast"
import { postMailToHtml5 } from "modules/mail/common/api"
import { URL_GET_EMAIL_CONFIG } from "modules/mail/common/urls"
import { Headers, emailGet, emailPost } from "helpers/email_api_helper"
import Loading from "components/Common/Loading"
import BaseIconTooltip from "components/Common/BaseIconTooltip"
import { URL_POST_AUTO_MOVE_AUTO_SPLIT } from "modules/mail/settings/urls"
import { ModalAlert } from "components/Common/Modal"
import MobileButton from "./MobileButton"
import useDevice from "hooks/useDevice"
import MainHeader from "pages/SettingMain/MainHeader"
import Toolbar from "../../SettingMain/Toolbar"

export const exceptListSortOptions = ["External", "Receive", "Trash", "Secure"]

const AutoSort = (props) => {
  const { routeConfig } = props
  const { t } = useTranslation()
  const { isMobile } = useDevice()
  const { successToast, errorToast } = useCustomToast()

  const [isOpen, setIsOpen] = useState(false)

  const [isLoading, setIsLoading] = useState(false)

  // State for Add modal
  const [fromValue, setFromValue] = useState("")
  const [toValue, setToValue] = useState("")
  const [subjectValue, setSubjectValue] = useState("")
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [optionGroup, setOptionGroup] = useState([{ label: "", value: "" }])
  const [switchValue, setSwitchValue] = useState(false)

  const [modal, setModal] = useState(false)
  const handleModal = () => setModal(!modal)

  // State for Data table
  const [data, setData] = useState([])

  const getMailbox = async () => {
    try {
      const res = await emailGet(URL_GET_EMAIL_CONFIG)
      if (res?.mailbox?.length > 0) {
        const newOptions = res?.mailbox
          ?.map((item) => ({
            ...item,
            label: item?.name,
            value: item?.key,
          }))
          .filter((option) => !exceptListSortOptions.includes(option.key))
        setOptionGroup(newOptions)
        setSelectedGroup(newOptions[0])
        return
      }
    } catch (err) {
      errorToast()
      return
    }
  }

  const getAutoSortData = async () => {
    setIsLoading(true)
    try {
      const postParams = {
        act: "autosplit",
        mode: "list",
      }
      const res = await postMailToHtml5(postParams)
      if (res.success === "1" && Object.keys(res.data).length > 0) {
        const newData = Object.entries(res.data).map(([key, value]) => ({
          order: key,
          from: value.data?.split(","),
          mailbox: value.acl,
        }))
        setData(newData)
        setIsLoading(false)
        return
      } else {
        setIsLoading(false)
      }
    } catch (err) {
      errorToast()
      setIsLoading(false)
      return
    }
  }

  useEffect(() => {
    getMailbox()
    getAutoSortData()
  }, [])

  // Handle reset
  const handleReset = () => {
    setFromValue("")
    setToValue("")
    setSubjectValue("")
    setSelectedGroup(optionGroup[0])
    setSwitchValue(false)
  }

  // Handle open/close Add modal --> Close modal - reset value
  const handleToggle = () => {
    setIsOpen(!isOpen)
    handleReset()
  }

  // Handle Save settings Add modal
  const handleSaveSettings = async (
    fromValue,
    toValue,
    subjectValue,
    selectedGroup,
    switchValue,
  ) => {
    if (fromValue !== "" || toValue !== "" || subjectValue !== "") {
      setIsLoading(true)
      try {
        const postParams = {
          act: "autosplit",
          mode: "insert",
          data: encodeURIComponent(
            JSON.stringify({
              fromaddr: fromValue,
              toaddr: toValue,
              subject: subjectValue,
              mailbox: selectedGroup.value,
            }),
          ),
        }
        const getParam = "_autosplit=1"
        const res = await postMailToHtml5(postParams, getParam)
        if (res.success === "1") {
          if (switchValue) {
            const resRemove = await emailPost(
              URL_POST_AUTO_MOVE_AUTO_SPLIT,
              {
                frommailbox: "Maildir",
                tomailbox: selectedGroup.value,
                fromaddr: fromValue,
                toaddr: toValue,
                subject: subjectValue,
              },
              Headers,
            )
            if (resRemove.success) {
              successToast()
              getAutoSortData()
              setIsLoading(false)
              handleReset()
              setIsLoading(false)
              return
            }
          }
        }
        successToast()
        getAutoSortData()
        handleReset()
        setIsLoading(false)
      } catch (err) {
        errorToast()
        setIsLoading(false)
      }
    } else {
      handleModal()
    }
  }

  // Handle Move row
  const handleMove = async (row, type, order, index) => {
    if ((type === "up" && order <= 0) || (type === "down" && order >= data.length - 1)) return

    setIsLoading(true)

    try {
      const postParams = {
        act: "autosplit",
        mode: type,
        order: order,
      }
      const res = await postMailToHtml5(postParams)
      if (res.success === "1") {
        let newIndex = index
        if (type === "up") newIndex = index - 1
        else newIndex = index + 1

        if (newIndex < 0) newIndex = 0
        else if (newIndex >= data.length) newIndex = data.length - 1

        const itemMove = data[newIndex]
        const itemCurrent = data[index]

        const tempOrder = itemCurrent.order
        itemCurrent.order = itemMove.order
        itemMove.order = tempOrder

        data[newIndex] = itemCurrent
        data[index] = itemMove

        setData([...data])
        successToast()
        setIsLoading(false)
      }
    } catch (err) {
      errorToast()
      setIsLoading(false)
    }
  }

  // Handle Delete row
  const handleDelete = async (order) => {
    setIsLoading(true)
    try {
      const postParams = {
        act: "autosplit",
        mode: "delete",
        order: order,
      }
      const res = await postMailToHtml5(postParams)
      if (res.success === "1") {
        successToast()
        // getAutoSortData()
        const newData = data.filter((item) => item.order !== order)
        setData(newData)
        setIsLoading(false)
      }
    } catch (err) {
      errorToast()
      setIsLoading(false)
    }
  }

  // Config header for table
  const heads = [
    {
      content: t("mail.mail_set_autosplit_autosplit"),
      class: "w-auto",
    },
    {
      content: t("mail.mail_set_mailbox_mailbox"),
      class: "w-auto",
    },
    {
      content: "",
      class: "w-auto",
    },
  ]

  // Config data row for table
  const rows =
    data.length <= 0
      ? []
      : data.length > 0 &&
        data.map((item, index) => ({
          columns: [
            {
              content: (
                <>
                  {isMobile ? (
                    <>
                      {Array.isArray(item.from) &&
                        item.from.map((_item, idx) => <span key={idx}>{_item}</span>)}
                    </>
                  ) : (
                    <span>{Array.isArray(item.from) && item.from.join(", ")}</span>
                  )}
                </>
              ),
              className: "w-auto han-h5 han-text-primary",
            },
            {
              content: optionGroup?.find((option) => option.value === item.mailbox)?.label,
              className: "w-auto text-nowrap han-h5 han-text-primary",
            },
            {
              content: (
                <>
                  {isMobile ? (
                    <MobileButton
                      item={item}
                      index={index}
                      handleMove={handleMove}
                      handleDelete={handleDelete}
                    />
                  ) : (
                    <div className="action-button">
                      <BaseIconTooltip
                        title={t("common.common_move")}
                        id={`up-${index}`}
                        className="han-color-grey mx-2"
                        icon="mdi mdi-upload font-size-18"
                        onClick={() => handleMove(item, "up", item.order, index)}
                      />
                      <BaseIconTooltip
                        title={t("common.common_move")}
                        id={`down-${index}`}
                        className="han-color-grey mx-2"
                        icon="mdi mdi-download font-size-18"
                        onClick={() => handleMove(item, "down", item.order, index)}
                      />
                      <BaseIconTooltip
                        title={t("common.common_delete")}
                        id={`delete-${index}`}
                        className="color-red mx-2"
                        icon="mdi mdi-trash-can-outline font-size-18"
                        onClick={() => handleDelete(item.order)}
                      />
                    </div>
                  )}
                </>
              ),
              className: "w-auto px-0",
            },
          ],
        }))

  const renderForm = useMemo(() => {
    return (
      <div>
        <InputText
          title={t("mail.mail_set_autosplit_splitfrom")}
          value={fromValue}
          onChange={(e) => setFromValue(e.target.value)}
          autoComplete="off"
        />
        <InputText
          title={t("mail.mail_set_autosplit_splitto")}
          value={toValue}
          onChange={(e) => setToValue(e.target.value)}
          autoComplete="off"
        />
        <InputText
          title={t("mail.mail_set_autosplit_splitsubject")}
          value={subjectValue}
          onChange={(e) => setSubjectValue(e.target.value)}
          autoComplete="off"
        />
        <InputSelect
          title={t("mail.mail_set_mailbox_mailbox")}
          optionGroup={optionGroup}
          onChange={(value) => setSelectedGroup(value)}
          value={selectedGroup}
          maxMenuHeight={150}
        />
        <ToggleSwitch
          title={t("mail.mail_auto_sort_include_existing_mail")}
          checked={switchValue}
          onChange={() => setSwitchValue(!switchValue)}
        />
      </div>
    )
  }, [fromValue, toValue, subjectValue, selectedGroup, switchValue])

  return (
    <>
      <MainHeader currentTitleMenu={t(routeConfig?.keyTitle)} />
      <Toolbar
        end={
          <BaseButton
            color={"primary"}
            icon={"mdi mdi-plus"}
            onClick={handleToggle}
            style={{ height: "38px" }}
          >
            {t("common.dropdown_custom_add_text")}
          </BaseButton>
        }
      />
      <Tooltip
        content={
          <span dangerouslySetInnerHTML={{ __html: t("mail.mail_set_autosplit_splitmsg") }}></span>
        }
      />
      <div className={`w-100 h-100 overflow-hidden overflow-y-auto`}>
        <Collapse isOpen={isOpen}>
          {renderForm}
          <div className="action-form mb-3">
            <BaseButton
              color="primary"
              onClick={() =>
                handleSaveSettings(fromValue, toValue, subjectValue, selectedGroup, switchValue)
              }
            >
              {t("mail.mail_set_autosplit_save")}
            </BaseButton>
          </div>
        </Collapse>

        <div className={``}>
          <BaseTable heads={heads ?? []} rows={rows ?? []} tableClass={`m-0`} />
          {isLoading && (
            <div className="position-relative">
              <Loading />
            </div>
          )}
        </div>
      </div>

      {/*--- Alert Modal --- */}
      {modal && <ModalAlert handleClose={handleModal} />}
    </>
  )
}

export default AutoSort
