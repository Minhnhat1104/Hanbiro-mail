// @ts-nocheck
// React
import React, { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"

// Third-party
import { Input, InputGroup, Modal, ModalBody, ModalFooter } from "reactstrap"

// Project
import { Title } from "components/SettingAdmin"
import BaseTable from "components/Common/BaseTable/index"
import BaseIcon from "components/Common/BaseIcon"
import BaseButton from "components/Common/BaseButton"
import { useCustomToast } from "hooks/useCustomToast"
import Loading from "components/Common/Loading"
import {
  emailDelete,
  emailGet,
  emailPost,
  formDataUrlencoded,
  Headers,
} from "helpers/email_api_helper"
import { ALIAS_DOMAIN } from "modules/mail/admin/url"
import { NoData } from "components/Common"
import useDevice from "hooks/useDevice"

const DomainList = ({ routeConfig, aliasDomain, onRefresh }) => {
  const { t } = useTranslation()
  const { successToast, errorToast } = useCustomToast()
  const { isMobile } = useDevice()

  // State data
  const [newDomain, setNewDomain] = useState("")
  const [checkedIds, setCheckedIds] = useState([])
  const [isCheckedAll, setIsCheckedAll] = useState(false)
  const [togModal, setTogModal] = useState(false)
  const [invalidUrl, setInvalidUrl] = useState(false)

  function checkBox(value) {
    const isChecked = checkedIds.includes(value) || false
    const checkAll = value === "checkedAll"

    return (
      <Input
        aria-label="Checkbox for following text input"
        type="checkbox"
        checked={checkAll ? isCheckedAll : isChecked}
        onClick={() => {
          if (checkAll) handleSelectAll()
          else handleCheckboxChange(value)
        }}
        onChange={() => {}}
      />
    )
  }

  const heads = [
    {
      style: { width: "40px", textAlign: "center" },
      content: checkBox("checkedAll"),
    },
    {
      content: t("mail.mail_admin_receive_domain"),
    },
  ]
  const rows = useMemo(() => {
    if (aliasDomain) {
      const rowsData = aliasDomain.map((item) => ({
        columns: [
          {
            style: { textAlign: "center" },
            content: checkBox(item?.domain),
          },
          {
            content: item?.domain,
          },
        ],
      }))
      return rowsData
    }
    return []
  }, [aliasDomain, checkedIds])

  function toggleModal() {
    setTogModal(!togModal)
    removeBodyCss()
  }

  function checkUrl(str) {
    const re = new RegExp(
      /^((?:(?:(?:\w[\.\-\+]?)*)\w)+)((?:(?:(?:\w[\.\-\+]?){0,62})\w)+)\.(\w{2,6})$/,
    )
    if (!str.match(re)) {
      return false
    } else {
      return true
    }
  }

  function removeBodyCss() {
    document.body.classList.add("no_padding")
  }

  // Handle Checked rows
  const handleCheckboxChange = (value) => {
    const newChecked = checkedIds.includes(value)
      ? checkedIds.filter((v) => v !== value)
      : [...checkedIds, value]

    const isCheckedAll = newChecked.length === aliasDomain.length
    setIsCheckedAll(isCheckedAll)
    setCheckedIds(newChecked)
  }
  const handleSelectAll = () => {
    setIsCheckedAll(!isCheckedAll)
    setCheckedIds(isCheckedAll ? [] : aliasDomain.map((item) => item.domain))
  }

  const handleTextInput = (event) => {
    setNewDomain(event.target.value)
  }

  // Handle Add Domain
  const handleAddDomain = async () => {
    try {
      const params = {
        setdomain: newDomain,
      }
      const res = await emailPost(ALIAS_DOMAIN, formDataUrlencoded(params), Headers)
      if (res.success) {
        setNewDomain("")
        successToast()
        onRefresh()
      } else {
        errorToast(res?.msg)
      }
    } catch (err) {
      errorToast()
      console.log("error messenger", err)
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      const validUrl = checkUrl(newDomain)
      if (newDomain && validUrl) handleAddDomain()
      else {
        if (newDomain && !validUrl) {
          setInvalidUrl(true)
          setTogModal(true)
        } else {
          setTogModal(true)
          invalidUrl && setInvalidUrl(false)
        }
      }
    }
  }
  // Handle Delete Domain
  const handleDelete = async () => {
    try {
      const setDomain = checkedIds.map((item) => item).join(",")
      const params = {
        setdomain: setDomain,
      }
      const res = await emailDelete(ALIAS_DOMAIN, params, Headers)
      successToast()
      onRefresh()
      setCheckedIds([])
    } catch (err) {
      errorToast()
      console.log("error messenger", err)
    }
  }

  return (
    <>
      <div className="table-list">
        <div className={`message-navbar ${isMobile ? "gap-0" : ""}`}>
          <Title name={t(routeConfig?.keyTitle)} />
          <div className="write-form d-flex justify-content-end gap-2">
            <InputGroup className="add-box">
              <Input
                type="text"
                value={newDomain}
                className={`han-text-primary han-bg-color-soft-grey border-0`}
                placeholder={t("mail.mail_sent_limit_type_domain_msg")}
                onChange={handleTextInput}
                onKeyDown={handleKeyDown}
              />
              <BaseButton
                color="primary"
                className="input-group-text text-white cursor-pointer z-0"
                icon={`mdi mdi-plus font-size-18`}
                iconClassName={`m-0`}
                onClick={() => {
                  const validUrl = checkUrl(newDomain)
                  if (newDomain && validUrl) handleAddDomain()
                  else {
                    if (newDomain && !validUrl) {
                      setInvalidUrl(true)
                      setTogModal(true)
                    } else {
                      setTogModal(true)
                      invalidUrl && setInvalidUrl(false)
                    }
                  }
                }}
                style={{ width: "38px", height: "38px" }}
              />
            </InputGroup>
            {checkedIds.length >= 1 && (
              <BaseButton
                className={"btn-danger m-0"}
                color={"danger"}
                icon={"mdi mdi-trash-can-outline font-size-18"}
                iconClassName={`m-0`}
                onClick={handleDelete}
                style={{ width: "38px", height: "38px" }}
              />
            )}
          </div>
        </div>
        <BaseTable heads={heads} rows={rows} />
        {aliasDomain.length === 0 && <NoData />}
      </div>

      <div>
        <Modal isOpen={togModal} toggle={toggleModal} centered>
          <div className="modal-header">
            <h5 className="modal-title" id="staticBackdropLabel">
              {t("common.notice_header_failure")}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => setTogModal(false)}
              aria-label="Close"
            />
          </div>
          <ModalBody>
            {invalidUrl ? t("mail.mail_domain_is_invalid") : t("common.alert_plz_input_data")}
          </ModalBody>
          <ModalFooter>
            <BaseButton
              color={"grey"}
              className={"btn-action"}
              data-bs-target="#secondmodal"
              onClick={toggleModal}
            >
              {t("common.common_cancel")}
            </BaseButton>
          </ModalFooter>
        </Modal>
      </div>
    </>
  )
}

export default DomainList
