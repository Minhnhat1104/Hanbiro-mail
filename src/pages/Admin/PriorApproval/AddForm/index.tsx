// @ts-nocheck
// React
import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import Switch from "react-switch"

// Third-party
import { Col, Collapse, FormGroup, Label, Row, Input, Button } from "reactstrap"

// Project
import { BaseButton, BaseIcon, BaseModal } from "components/Common"
import Tooltip from "components/SettingAdmin/Tooltip"
import Inputname from "components/SettingAdmin/Inputwriting/index"
import LabelText from "components/SettingAdmin/InputWithLabel"
import BaseInputFree from "components/SettingAdmin/InputSelectMultiFree"
import { OrgSelectModal } from "components/Common/Org"

import SenderModal from "./SenderModal"
import { tabOptions } from "components/Common/Org/GroupwareOrgModal"

import "../../ApprovalPolicy/style.scss"

const components = {
  DropdownIndicator: null,
}

const AddForm = ({ isOpen, toggleModal, itemUpdate, handleAdd, handleUpdate }) => {
  const { t } = useTranslation()

  const [value, setValue] = useState([])
  const [open, setOpen] = useState(false)
  const [isAlert, setIsAlert] = useState(false)
  const [invalid, setInvalid] = useState(false)
  const [emails, setEmails] = useState({ selected: {} })
  const [type, setType] = useState("")

  const [dataUpdate, setDataUpdate] = useState({
    name: "",
    to: "",
    isfile: "n",
    ftype: [],
    fname: "",
    msize: "",
  })

  useEffect(() => {
    if (itemUpdate?.name) {
      setDataUpdate({
        name: itemUpdate?.name,
        to: itemUpdate?.toaddr,
        isfile: itemUpdate?.isfile,
        ftype: itemUpdate?.ftype,
        fname: itemUpdate?.fname,
        msize: itemUpdate?.msize,
      })
      const values = itemUpdate?.userid ? itemUpdate?.userid.split(",") : []
      const objectEmails = {}
      for (const item of values) {
        objectEmails[item] = { id: item, name: item }
      }
      setEmails({ selected: objectEmails })
      const newArr =
        values.length > 0
          ? values.map((item) => ({
              label: item,
              value: item,
            }))
          : []
      setValue(newArr)
    }
  }, [])

  const Offsymbol = () => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          fontSize: 12,
          color: "#fff",
          paddingRight: 2,
        }}
      >
        {" "}
        Off
      </div>
    )
  }

  const OnSymbol = () => {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          fontSize: 12,
          color: "#fff",
          paddingRight: 2,
        }}
      >
        {" "}
        On
      </div>
    )
  }

  // handle add file type
  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      e.stopPropagation()
      handleAddType()
    }
  }

  const handleAddType = () => {
    if (type.trim() === "") return
    if (dataUpdate.ftype?.includes(type)) {
      setType("")
      return
    }
    setDataUpdate((prev) => ({
      ...prev,
      ftype: [...dataUpdate?.ftype, type],
    }))
    setType("")
  }

  const handleRemoveFileType = (fileType) => {
    setDataUpdate((prev) => ({
      ...prev,
      ftype: prev?.ftype?.filter((_item) => _item !== fileType),
    }))
  }

  const renderModal = () => {
    return <div>{t("mail.mail_admin_add_condition")}</div>
  }

  const renderBody = () => {
    return (
      <div>
        <Tooltip content={t("mail.mail_if_all_of_the_conditions_set_below_are_met")} />
        <Inputname
          title={t("mail.mail_condition_name")}
          note={t("mail.mail_auto_setting_example")}
          value={dataUpdate?.name}
          onChange={(e) => setDataUpdate((prev) => ({ ...prev, name: e.target.value }))}
          invalid={invalid && dataUpdate?.name == ""}
        />
        <BaseInputFree
          title={t("mail.mail_send_user")}
          components={components}
          component={
            <Button
              color="primary"
              className="px-1 rounded-none-btn-org"
              onClick={() => {
                setOpen(!open)
              }}
            >
              <i className="mdi mdi-file-tree"></i>
            </Button>
          }
          onChange={(newValue) => {
            setValue(newValue)
            const filteredObject = {}
            for (const item of newValue) {
              const id = item.value
              if (emails.selected.hasOwnProperty(id)) {
                filteredObject[id] = emails.selected[id]
              }
            }
            setEmails({ selected: filteredObject })
          }}
          isMulti={true}
          isClearable
          isValidNewOption={(inputValue) => false}
          menuIsOpen={false}
          placeholder=""
          value={value}
          invalid={invalid && value.length === 0}
        />
        <LabelText
          title={t("mail.mail_at_the_receive_address")}
          label={t("mail.mail_admin_include")}
          value={dataUpdate?.to}
          onChange={(e) => {
            setDataUpdate((prev) => ({
              ...prev,
              to: e.target.value,
            }))
          }}
        />
        <Row>
          <Col lg="12">
            <FormGroup row className="d-flex align-items-center">
              <Label htmlFor="taskname" className="col-form-label col-lg-3">
                {t("mail.mail_attachments_contained")}
              </Label>
              <Col lg="9">
                <Switch
                  uncheckedIcon={<Offsymbol />}
                  checkedIcon={<OnSymbol />}
                  className="me-1 mb-sm-8 mb-2"
                  onColor="#0066FF"
                  onChange={(e) =>
                    setDataUpdate((prev) => ({
                      ...prev,
                      isfile: e ? "y" : "n",
                    }))
                  }
                  checked={dataUpdate?.isfile === "y" || false}
                />
              </Col>
            </FormGroup>
          </Col>
        </Row>
        <Collapse isOpen={dataUpdate?.isfile === "y"}>
          <FormGroup row className="d-flex align-items-center">
            <Label htmlFor="taskname" className="col-form-label col-lg-3"></Label>
            <Col lg="9">
              <div>
                <Label htmlFor="formrow-subject-Input">{t("mail.mail_admin_type_file")}</Label>
                <div className="input-group">
                  <Input
                    className="form-control"
                    id="inputGroupFile02"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    onKeyDown={onKeyDown}
                  />
                  <Label
                    className="input-group-text cursor-pointer"
                    htmlFor="inputGroup"
                    onClick={handleAddType}
                  >
                    <BaseIcon icon={"mdi mdi-plus"} />
                  </Label>
                </div>
                <div className="d-flex">
                  {dataUpdate?.ftype &&
                    dataUpdate?.ftype.map((item, index) => (
                      <BaseButton
                        key={index}
                        className={"btn btn-soft-secondary p-1 m-1"}
                        type="button"
                      >
                        {item}
                        <BaseIcon
                          icon={"mdi mdi-close-thick"}
                          onClick={() => handleRemoveFileType(item)}
                        />
                      </BaseButton>
                    ))}
                </div>
              </div>
              <div className="py-2">
                <Label htmlFor="formrow-subject-Input">
                  {t("mail.mail_admin_keyword_file_name")}
                </Label>
                <Input
                  type="text"
                  className="form-control"
                  id="formrow-subject-Input"
                  value={dataUpdate?.fname}
                  onChange={(e) => {
                    setDataUpdate((prev) => ({
                      ...prev,
                      fname: e.target.value,
                    }))
                  }}
                />
              </div>
            </Col>
          </FormGroup>
        </Collapse>
        <LabelText
          title={`${t("admin.admin_mail_attach")}`}
          label={t("mail.mail_less_then_mb")}
          type="number"
          min={0}
          value={dataUpdate?.msize}
          onChange={(e) =>
            setDataUpdate((prev) => ({
              ...prev,
              msize: e.target.value,
            }))
          }
        />
      </div>
    )
  }

  const Footer = () => {
    return (
      <div className="btn-form-action-approval">
        <BaseButton
          color={"primary"}
          className="me-2"
          type="button"
          onClick={() => {
            if (itemUpdate.name) {
              handleUpdate(dataUpdate, value)
            } else {
              handleAdd(dataUpdate, value)
            }
            // if (!!dataUpdate?.name && value.length > 0) {
            // } else {
            //   setIsAlert(!isAlert)
            //   setInvalid(true)
            // }
          }}
        >
          {" "}
          {t("mail.mail_view_save")}{" "}
        </BaseButton>
        <BaseButton color={"grey"} outline type="button" onClick={toggleModal}>
          {" "}
          {t("mail.project_close_msg")}{" "}
        </BaseButton>
      </div>
    )
  }

  const headerAlert = () => {
    return <span>{t("common.notice_header_failure")}</span>
  }
  const bodyAlert = () => {
    return <span>{t("common.alert_plz_input_data")}</span>
  }
  const footerAlert = () => {
    return (
      <span className="write-form">
        <BaseButton
          icon={"bx bx-x"}
          iconClassName="font-size-16 me-2"
          onClick={() => setIsAlert(!isAlert)}
        >
          {t("common.common_close_msg")}
        </BaseButton>
      </span>
    )
  }

  return (
    <>
      <BaseModal
        isOpen={isOpen}
        toggle={toggleModal}
        renderHeader={renderModal}
        renderBody={renderBody}
        renderFooter={Footer}
      />
      {window.location.pathname.includes("admin") && !window.location.pathname.includes("list") ? (
        <>
          {open && (
            <OrgSelectModal
              title={t("common.main_orgtree")}
              setOpen={setOpen}
              emails={emails}
              open={open}
              mode={2}
              autoSelectUser
              orgTabOption={tabOptions}
              setEmails={setEmails}
              onSave={(emails) => {
                const dataArray = Object.values(emails?.selected)
                const newValues = dataArray.map((item, idx) => ({
                  label: item?.title || item?.username || item?.name,
                  value: item?.id || item?.userid || item?.userno,
                }))
                const uniqueValues = newValues.filter(
                  // use for filter duplicate
                  (newItem) => !value.some((existingItem) => existingItem.value === newItem.value),
                )
                setValue(newValues)
              }}
              handleClose={() => {
                setOpen(!open)
              }}
            />
          )}
        </>
      ) : (
        <>
          {open && (
            <SenderModal
              isOpen={open}
              onClose={() => setOpen(false)}
              onSave={(list) => {
                if (list && list?.length > 0) {
                  const newValues = list.map((item) => ({
                    label: item?.title || item?.username || item?.name,
                    value: item?.id,
                  }))
                  setValue(newValues)
                }
              }}
            />
          )}
        </>
      )}
      {/* <BaseModal
        isOpen={isAlert}
        toggle={() => {
          setIsAlert(!isAlert)
        }}
        renderHeader={headerAlert}
        renderBody={bodyAlert}
        renderFooter={footerAlert}
        size={"xs"}
      /> */}
    </>
  )
}

export default AddForm
