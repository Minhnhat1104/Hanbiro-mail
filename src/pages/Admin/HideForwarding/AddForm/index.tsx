// @ts-nocheck
// React
import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

// Third-party
import { Button, Input, Label } from "reactstrap"

// Project
import BaseButton from "components/Common/BaseButton"
import { BaseModal } from "components/Common"
import BaseInputFree from "components/SettingAdmin/InputSelectMultiFree"
import { OrgSelectModal } from "components/Common/Org"
import { tabOptions } from "components/Common/Org/GroupwareOrgModal"

const components = {
  DropdownIndicator: null,
}

const AddForm = (props) => {
  const { isOpen, toggleModal, itemUpdate, handleUpdate } = props
  const { t } = useTranslation()

  const [admin, setAdmin] = useState([])
  const [value, setValue] = useState([])
  const [open, setOpen] = useState(false)
  const [invalid, setInvalid] = useState(false)
  const [isAlert, setIsAlert] = useState(false)
  const [singleSelect, setSingleSelect] = useState(false)
  const [email, setEmail] = useState({ selected: {} })
  const [emails, setEmails] = useState({ selected: {} })
  const [dataUpdate, setDataUpdate] = useState({
    managerid: "",
    ids: [],
    isfile: "n",
    toinside: "n",
    tooutside: "n",
  })

  useEffect(() => {
    if (itemUpdate?.managerid) {
      setDataUpdate({
        managerid: itemUpdate?.managerid,
        ids: itemUpdate?.ids.map((v) => ({ cn: v.cn, id: v.id })),
        isfile: itemUpdate?.isfile,
        toinside: itemUpdate?.toinside,
        tooutside: itemUpdate?.tooutside,
      })
      setAdmin([{ label: itemUpdate?.managerid, value: itemUpdate?.managerid }])
      const users = itemUpdate?.ids.map((item) => ({
        label: item?.name,
        value: item?.id,
        cn: item?.cn,
        type: item?.type,
      }))
      setValue(users)
      const objectEmails = {}
      for (const item of itemUpdate?.ids) {
        objectEmails[item.id] = item
      }
      setEmails({ selected: objectEmails })
    }
  }, [])

  useEffect(() => {
    if (email?.selected?.id) {
      setAdmin([{ label: email?.selected?.title, value: email?.selected?.id }])
      setDataUpdate((prev) => ({
        ...prev,
        // managerid: email?.selected?.id,
        managerid: email?.selected?.userid || email?.selected?.id,
      }))
    }
  }, [email, value])

  const handleCheckboxChange = (event, type) => {
    const isChecked = event.target.checked
    setDataUpdate((prev) => ({
      ...prev,
      [type]: isChecked ? "y" : "n",
    }))
  }

  const bodyModal = () => {
    return (
      <>
        <BaseInputFree
          title={t("mail.task_main_manager")}
          components={components}
          component={
            <Button
              color="primary"
              className={`px-1 rounded-none-btn-org ${itemUpdate?.managerid ? "d-none" : ""}`}
              onClick={() => {
                setOpen(!open)
                setSingleSelect(true)
              }}
            >
              <i className="mdi mdi-file-tree"></i>
            </Button>
          }
          isMulti={false}
          invalid={invalid && admin.length === 0}
          isValidNewOption={(inputValue) => false}
          menuIsOpen={false}
          placeholder=""
          value={admin}
          isDisabled={itemUpdate?.managerid}
        />
        <BaseInputFree
          title={`${t("mail.mail_admin_spam_manager_users")} (${t("mail.mail_groups")})`}
          components={components}
          component={
            <Button
              color="primary"
              className="px-1 rounded-none-btn-org"
              onClick={() => {
                setOpen(!open)
                setSingleSelect(false)
              }}
            >
              <i className="mdi mdi-file-tree"></i>
            </Button>
          }
          onChange={(newValue) => {
            setValue(newValue)
            setDataUpdate((prev) => ({
              ...prev,
              ids: newValue.map((v) => ({ id: v.value, cn: v.cn })),
            }))
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
          invalid={invalid && value.length === 0}
          isValidNewOption={(inputValue) => false}
          menuIsOpen={false}
          placeholder=""
          value={value}
        />

        {/* conditions */}

        <div className="row">
          <Label htmlFor="taskname" className="col-form-label col-12 col-lg-3">
            {t("mail.mail_admin_condition")}
          </Label>
          <div className="col-12 col-lg-9">
            <div className="d-flex justify-content-left">
              <Input
                type="checkbox"
                className="me-1"
                id="receive-mail"
                checked={dataUpdate?.toinside === "y" || false}
                onChange={(e) => handleCheckboxChange(e, "toinside")}
              />
              <Label htmlFor="receive-mail" className="">
                {t("mail.mail_receive_mail_opt")}
              </Label>
            </div>
            <div className="d-flex justify-content-left">
              <Input
                type="checkbox"
                className="me-1"
                id="mail-outside"
                checked={dataUpdate?.tooutside === "y" || false}
                onChange={(e) => handleCheckboxChange(e, "tooutside")}
              />
              <Label htmlFor="mail-outside" className="">
                {t("mail.mail_to_outside")}
              </Label>
            </div>

            <div className="d-flex justify-content-left">
              <Input
                type="checkbox"
                className="me-1"
                id="include-attachment"
                checked={dataUpdate?.isfile === "y" || false}
                onChange={(e) => handleCheckboxChange(e, "isfile")}
              />
              <Label htmlFor="include-attachment" className="">
                {t("mail.mail_include_attachment_opt")}
              </Label>
            </div>
          </div>
        </div>
      </>
    )
  }

  const headerModal = () => {
    return <></>
  }

  const footerModal = () => {
    return (
      <>
        <div className="action-form">
          <BaseButton
            color={"primary"}
            type="button"
            onClick={() => {
              if (value.length > 0 && admin.length > 0) {
                handleUpdate(dataUpdate)
              } else {
                setInvalid(true)
                setIsAlert(!isAlert)
              }
            }}
          >
            {t("mail.mail_view_save")}
          </BaseButton>
          <BaseButton
            color={"secondary"}
            data-bs-target="#secondmodal"
            onClick={toggleModal}
            type="button"
          >
            {t("mail.mail_write_discard")}
          </BaseButton>
        </div>
      </>
    )
  }

  const headerAlert = () => {
    return <span>{t("Error")}</span>
  }
  const bodyAlert = () => {
    return <span>{t("Please select users or groups")}</span>
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
        renderHeader={headerModal}
        renderBody={bodyModal}
        renderFooter={footerModal}
      />
      {open && (
        <OrgSelectModal
          hideTab={true}
          title={t("common.main_orgtree")}
          setOpen={setOpen}
          emails={singleSelect ? email : emails}
          open={open}
          isSingle={singleSelect}
          orgTabOption={tabOptions}
          setEmails={singleSelect ? setEmail : setEmails}
          allowAddDept={!singleSelect}
          onSave={(emails) => {
            if (!singleSelect) {
              const dataGroupArray = Object.values(emails?.selected).filter((item) => item.isFolder)
              const dataUserArray = Object.values(emails?.selected).filter((item) => !item.isFolder)
              const newUserValues = dataUserArray.map((item) => ({
                label: item?.title || item?.username || item?.name,
                value: item?.id,
              }))
              const newGroupValues = dataGroupArray.map((item) => ({
                label: item?.title || item?.groupname,
                value: item?.groupno,
              }))
              setValue(
                dataGroupArray.length > 0
                  ? [...newGroupValues, ...newUserValues]
                  : [...newUserValues],
              )

              setDataUpdate({
                ...dataUpdate,
                ...(dataGroupArray.length > 0 && {
                  groups: dataGroupArray.map((item) => ({ cn: item?.cn, no: item?.groupno })),
                }),
                ids: dataUserArray.map((item) => ({ cn: item?.cn, id: item?.id })),
              })
            }
          }}
          handleClose={() => {
            setOpen(!open)
          }}
        />
      )}
      <BaseModal
        isOpen={isAlert}
        toggle={() => {
          setIsAlert(!isAlert)
        }}
        renderHeader={headerAlert}
        renderBody={bodyAlert}
        renderFooter={footerAlert}
        size={"sm"}
      />
    </>
  )
}

export default AddForm
