// @ts-nocheck
// React
import React, { useEffect, useMemo, useState } from "react"

// Third-party
import { Card, Collapse, Input, Label } from "reactstrap"
import { useTranslation } from "react-i18next"

// Project
import BaseButton from "components/Common/BaseButton"
import BaseTable from "components/Common/BaseTable"
import RadioButton from "components/Common/Form/RadioButton"
import BaseInput from "components/SettingAdmin/Input"
import Tooltip from "components/SettingAdmin/Tooltip"
import Title from "components/SettingAdmin/Title/index"
import { useCustomToast } from "hooks/useCustomToast"
import { postMailToHtml5 } from "modules/mail/common/api"
import { base64_decode, base64_encode, vailForwardMail } from "utils"
import { NoData } from "components/Common"
import Loading from "components/Common/Loading"
import { ModalAlert } from "components/Common/Modal"

import "./style.scss"
import MainHeader from "pages/SettingMain/MainHeader"
import Toolbar from "../../SettingMain/Toolbar"

const SettingForwarding = (props) => {
  const { routeConfig } = props
  const { t } = useTranslation()
  const { successToast, errorToast } = useCustomToast()

  const [isOpen, setIsOpen] = useState(false)
  const toggle = () => setIsOpen(!isOpen)

  const [modal, setModal] = useState(false)
  const handleModal = () => setModal(!modal)
  const [titleModal, setTitleModal] = useState("common.alert_plz_input_data")

  const [data, setData] = useState({ loading: false, list: [] })
  const [mail, setMail] = useState("")
  const [valid, setValid] = useState(true)
  const [forwardingSelected, setForwardingSelected] = useState("WUVT")

  const [checkedIds, setCheckedIds] = useState([]) // checked item list - not list all
  const [isCheckedAll, setIsCheckedAll] = useState(false) // state for check all

  const getForwardingData = async () => {
    setData({ ...data, loading: true })
    try {
      const postParams = {
        act: "forward",
        mode: "list",
      }
      const res = await postMailToHtml5(postParams)
      if (res.success === "1") {
        if (res.emailaddr !== "") {
          const newData = base64_decode(res.emailaddr)
          setData({ loading: false, list: newData.split(",") })
        }
      } else setData({ loading: false, list: [] })
      return
    } catch (err) {
      errorToast()
      setData({ ...data, loading: false })
      return
    }
  }

  useEffect(() => {
    getForwardingData()
  }, [])

  // Handle add
  const handleAdd = async (list, store) => {
    const checkMail = vailForwardMail(list)
    setValid(checkMail.status)
    if (checkMail.status) {
      let email = data.list.length > 0 ? [data.list.join(","), list].join(",") : list
      setData({ ...data, loading: true })
      try {
        const postParams = {
          act: "forward",
          mode: "insert",
          data: JSON.stringify({
            emailaddr: base64_encode(email),
            store: store,
          }),
        }
        const getParam = "?_forward=1"
        const res = await postMailToHtml5(postParams, getParam)
        if (res.success === "1") {
          await getForwardingData()
          // setForwardingSelected("WUVT")
          setMail("")
          successToast()
        } else setData({ ...data, loading: false })
      } catch (err) {
        errorToast()
        setData({ ...data, loading: false })
      }
    } else {
      setTitleModal(
        [t("common.addrbook_email_format_error_msg"), ["(", checkMail.mail, ")"].join("")].join(
          " ",
        ),
      )
      handleModal()
    }
  }

  // Handle delete
  const handleDelete = async (list) => {
    let emailaddr = ""
    list.forEach((item) => (emailaddr = emailaddr === "" ? item : emailaddr + "," + item))

    setData({ ...data, loading: true })
    try {
      const postParams = {
        act: "forward",
        mode: "delete",
        data: JSON.stringify({ emailaddr: base64_encode(emailaddr) }),
      }
      const getParam = "_forward_delete=1"
      const res = await postMailToHtml5(postParams, getParam)
      if (res.success === "1") {
        await getForwardingData()
        data.list.length === list.length && handleCheckAllChange()
        successToast()
      } else setData({ ...data, loading: false })
    } catch (err) {
      errorToast()
      setData({ ...data, loading: false })
    }
  }

  // Handle check all
  const handleCheckAllChange = () => {
    setIsCheckedAll(!isCheckedAll) // Set state for check all
    setCheckedIds(isCheckedAll ? [] : data.list) // Set state list for checked list
  }

  // Handle check one
  const handleCheckOneChange = (item) => {
    const newChecked = checkedIds.includes(item)
      ? checkedIds.filter((v) => v !== item) // Remove item if existed
      : [...checkedIds, item] // Add item if not existed
    const isCheckedAll = newChecked.length === data.list.length // Check if all item checked
    setIsCheckedAll(isCheckedAll) // Set state for check all
    setCheckedIds(newChecked) // Set state list for checked item list
  }

  const forwardingOptions = [
    { value: "Tk8=", title: t("mail.mail_set_forward_action2") },
    { value: "WUVT", title: t("mail.mail_set_forward_action3") },
  ]

  const handleChangeForwarding = (e, value) => setForwardingSelected(value)

  // ================================ Start Render Header Table ================================
  // Config render checkbox for header table
  const renderCheckBox = (value, index = 0) => {
    // value === "" => empty value => set (value + index) to define id
    return (
      <Input
        type="checkbox"
        checked={value === "checkedAll" ? isCheckedAll : checkedIds?.includes(value)}
        onClick={() => {
          if (value === "checkedAll") handleCheckAllChange()
          else handleCheckOneChange(value)
        }}
        onChange={() => {}}
        id={value ? value : value + index}
        className="cursor-pointer"
      />
    )
  }

  // Config header for table
  const heads = [
    { content: <>{renderCheckBox("checkedAll")}</>, class: "w-5" },
    {
      content: (
        <p className="mb-0 han-h5 han-text-secondary">
          {[t("common.addrbook_email_msg"), ["(", data.list.length, ")"].join("")].join(" ")}
        </p>
      ),
    },
    {
      content: (
        <div className="btn-delete">
          {checkedIds.length > 0 && (
            <BaseButton
              color="danger"
              outline
              onClick={() => handleDelete(checkedIds)}
              className="p-btn-delete"
            >
              <i className="mdi mdi-delete"></i> {t("common.common_delete")}
            </BaseButton>
          )}
        </div>
      ),
      class: "w-10",
    },
  ]
  // ================================ End Render Header Table ================================

  // ================================ Start Render Body Table ================================
  // Config data row for table
  const rows = data.loading
    ? []
    : data.list.length > 0
    ? data.list.map((item, index) => ({
        columns: [
          { content: <>{renderCheckBox(item, index)}</>, class: "w-5" },
          {
            content: (
              <Label
                htmlFor={item ? item : item + index} // item === "" => empty item => set value + index to define id
                className={`w-100 cursor-pointer mb-0 ${item === "" && "empty-item"}`}
              >
                {item}
              </Label>
            ),
          },
          {
            content: (
              <Label
                htmlFor={item ? item : item + index} // item === "" => empty item => set value + index to define id
                className="w-100 cursor-pointer mb-0"
              />
            ),
            class: "w-10",
          },
        ],
      }))
    : [
        {
          columns: [{ content: "" }, { content: <NoData /> }, { content: "" }],
        },
      ]
  // ================================ End Render Body Table ================================

  return (
    <>
      <MainHeader currentTitleMenu={t(routeConfig?.keyTitle)} />
      <Toolbar
        end={
          <BaseButton
            color={"primary"}
            icon={"mdi mdi-plus"}
            onClick={toggle}
            style={{ height: "38px" }}
          >
            {t("mail.mail_whitelist_create")}
          </BaseButton>
        }
      />
      <Tooltip
        content={
          <span
            dangerouslySetInnerHTML={{
              __html: t("mail.mail_set_forward_nomsg"),
            }}
          />
        }
      />
      <Collapse isOpen={isOpen} className="mb-2">
        <BaseInput
          title={t("common.addrbook_email_msg")}
          note="Ex: example1@email.com, example2@email.com"
          autoComplete="off"
          value={mail}
          onChange={(e) => setMail(e.target.value)}
          invalid={!valid}
        />
        <RadioButton
          className="align-items-center"
          title={t("mail.mail_preference_forward")}
          options={forwardingOptions}
          value={forwardingSelected}
          onChange={handleChangeForwarding}
          radioGroupClass="ml-negative-2"
        />
        <div className="d-flex justify-content-center">
          <BaseButton
            color="primary"
            onClick={() => handleAdd(mail, forwardingSelected)}
            loading={data.loading}
          >
            {t("mail.mail_view_save")}
          </BaseButton>
        </div>
      </Collapse>
      <div className={`w-100 h-100 overflow-hidden`}>
        <div className="w-100 h-100 overflow-y-auto">
          <BaseTable heads={heads} rows={rows} tableClass={`m-0`} />
          {data.loading && (
            <div className="position-relative">
              <Loading />
            </div>
          )}
        </div>
      </div>
      {/* Alert Modal */}
      {modal && <ModalAlert handleClose={handleModal} titleBody={titleModal} />}
    </>
  )
}

export default SettingForwarding
