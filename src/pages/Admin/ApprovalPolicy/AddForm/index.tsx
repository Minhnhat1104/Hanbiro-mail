// @ts-nocheck
// React
import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

// Third-party
import { Button, Input, InputGroup } from "reactstrap"

// Project
import { BaseButton, BaseIcon } from "components/Common"
import { BaseModal } from "components/Common"
import InputText from "components/SettingAdmin/Inputwriting/index"
import { Row, Col, FormGroup, Label } from "reactstrap"
import { OrgSelectModal } from "components/Common/Org"
import { emailGet } from "helpers/email_api_helper"
import BaseInputFree from "components/SettingAdmin/InputSelectMultiFree"
import { APPROVAL_POLICY_DETAIL } from "modules/mail/admin/url"
import { tabOptions } from "components/Common/Org/GroupwareOrgModal"

const components = {
  DropdownIndicator: null,
}

const AddForm = (props) => {
  const { isOpen, toggleModal, itemUpdate, handleUpdate } = props
  const { t } = useTranslation()

  const [open, setOpen] = useState(false)
  const [invalid, setInvalid] = useState(false)
  const [alert, setAlert] = useState("")
  const [singleSelect, setSingleSelect] = useState(false)
  const [email, setEmail] = useState({ selected: {} })
  const [emails, setEmails] = useState({ selected: {} })
  const [emailsMid, setEmailsMid] = useState({ selected: {} })
  const [dataUpdate, setDataUpdate] = useState({
    esuper: "",
    eforce: "",
    ids: [],
    mode: "force",
    sname: "",
    mmanagerids: [],
    mpredecessorids: [],
    mselect: "",
    mall: "",
    fall: "",
    fdomain: [],
    ffile: "",
    fftype: [],
    ffname: [],
    fmsize: "",
    fkeyword: [],
    mailalarm: "",
    isalarm: "",
    termalarm: "",
    mailalarm_tosender: "",
  })
  const [useKeyword, setUseKeyword] = useState(false)
  const [domainText, setDomainText] = useState("")
  const [typeFile, setTypeFile] = useState("")
  const [ffName, setffName] = useState("")
  const [fKeyword, setfKeyword] = useState("")
  const [typeOrg, setTypeOrg] = useState("")
  const [valueOrg, setValueOrg] = useState({
    ids: [],
    mmanagerids: [],
    mpredecessorids: [],
  })
  const [isLoading, setIsLoading] = useState(false)

  const formatItemName = (item) => {
    let name = item?.name
    if (item?.id) {
      name += " (" + item?.id + ")"
    }
    if (item?.posname) {
      name += " (" + item?.posname + ")"
    }
    return name
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const res = await emailGet(`${APPROVAL_POLICY_DETAIL}/${itemUpdate?.id}`)
        setDataUpdate((prevData) => ({
          ...prevData,
          ...Object.keys(res).reduce((acc, key) => {
            if (prevData.hasOwnProperty(key)) {
              acc[key] = res[key]
            }
            return acc
          }, {}),
          sname: res?.secuname,
          ids: res?.users.map((v) => v.id),
          mmanagerids: res?.mseculist.map((v) => v.id),
          mpredecessorids: res?.mpredecessorids.map((v) => v.id),
        }))
        if (res?.mode == "force") {
          setDataUpdate((prev) => ({
            ...prev,
            ffile: res?.secufilter?.isfile,
            fmsize: res?.secufilter?.msgsize,
            fdomain:
              res?.secufilter?.istodomains !== "" ? res?.secufilter?.istodomains?.split(",") : [],
            fftype: res?.secufilter?.filetype !== "" ? res?.secufilter?.filetype?.split(",") : [],
            ffname: res?.secufilter?.filename !== "" ? res?.secufilter?.filename?.split(",") : [],
            fkeyword: res?.secufilter?.keyword !== "" ? res?.secufilter?.keyword?.split(",") : [],
          }))
        }
        setEmail({ selected: { title: itemUpdate?.name ?? itemUpdate?.id, id: itemUpdate?.id } })
        let objectEmails = {}
        let isGroup = false
        for (const item of res?.users) {
          item.value = item?.id ?? ""
          objectEmails[item.id] = item
          if (item?.type == "group") {
            isGroup = true
            objectEmails[item.id]["value"] = "g}|{" + item?.id
          }
        }
        if (isGroup) {
          for (const item of itemUpdate?.users) {
            if (item?.type == "g") {
              objectEmails[item.id]["name"] = item?.name
            }
          }
        }
        setEmails({ selected: objectEmails })
        const objectEmailsMid = {}
        for (const item of res?.mseculist) {
          objectEmailsMid[item.id] = item
        }
        setEmailsMid({ selected: objectEmailsMid })
        setValueOrg((prev) => ({
          ...prev,
          ids: res?.users.map((v) => ({ label: formatItemName(v), value: v.id })),
          mmanagerids: res?.mseculist.map((v) => ({
            label: formatItemName(v),
            value: v.id,
          })),
          mpredecessorids: res?.mpredecessorids.map((v) => ({
            label: formatItemName(v),
            value: v.id,
          })),
        }))
        if (res?.secufilter?.keyword !== "") {
          setUseKeyword(true)
        }

        setDataUpdate((prevData) => ({
          ...prevData,
          ...Object.keys(res).reduce((acc, key) => {
            if (prevData.hasOwnProperty(key)) {
              acc[key] = res[key]
            }
            return acc
          }, {}),
          sname: res?.secuname,
          ids: Object.keys(objectEmails)?.map((v) => {
            let item = objectEmails[v]
            return item?.value ?? item?.id
          }),
          mmanagerids: res?.mseculist.map((v) => v.id),
          mpredecessorids: res?.mpredecessorids.map((v) => v.id),
        }))
        if (res?.mode == "force") {
          setDataUpdate((prev) => ({
            ...prev,
            ffile: res?.secufilter?.isfile,
            fmsize: res?.secufilter?.msgsize,
            fdomain:
              res?.secufilter?.istodomains !== "" ? res?.secufilter?.istodomains.split(",") : [],
            fftype: res?.secufilter?.filetype !== "" ? res?.secufilter?.filetype.split(",") : [],
            ffname: res?.secufilter?.filename !== "" ? res?.secufilter?.filename.split(",") : [],
            fkeyword: res?.secufilter?.keyword !== "" ? res?.secufilter?.keyword.split(",") : [],
          }))
        }

        setIsLoading(false)
      } catch (err) {
        console.log("error messenger", err)
      }
    }
    if (itemUpdate?.id) fetchData()
  }, [])

  const onForceUpdate = (value, type) => {
    if (value !== "") {
      setDataUpdate({
        ...dataUpdate,
        [type]: [...dataUpdate[type], value],
      })
    }
    setDomainText("")
    setTypeFile("")
    setffName("")
    setfKeyword("")
  }

  const handleTypeEnter = (event, type) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault()
      let value = event.target.value.trim()
      if (value.endsWith(",")) {
        value = value.slice(0, -1)
      }
      if (value !== "") {
        setDataUpdate({
          ...dataUpdate,
          [type]: [...dataUpdate[type], value],
        })
      }
      setDomainText("")
      setTypeFile("")
      setffName("")
      setfKeyword("")
    }
  }

  const handleCheckboxChange = (event, type) => {
    const isChecked = event.target.checked
    setDataUpdate((prev) => ({
      ...prev,
      [type]: isChecked ? "y" : "n",
    }))
  }

  const handleRemove = (item, type) => {
    const newDomain = dataUpdate[type].filter((v) => v !== item)
    setDataUpdate({ ...dataUpdate, [type]: newDomain })
  }

  const headerModal = () => {
    return <div>{t("mail.mail_admin_permit_policy")}</div>
  }

  const bodyModal = () => {
    return (
      <>
        <div>
          <InputText
            title={t("mail.mail_admin_policy_name")}
            value={dataUpdate?.sname}
            onChange={(e) => {
              setDataUpdate((prev) => ({
                ...prev,
                sname: e.target.value,
              }))
            }}
          />
        </div>
        <FormGroup row>
          <Label htmlFor="taskname" className="col-form-label col-lg-3">
            {t("mail.mail_admin_basic_policy")}
          </Label>
          <Col lg="9" className="mt-2">
            <div className="d-flex align-items-center">
              <div className="me-3">
                <Label check>
                  <Input
                    type="radio"
                    name="radio1"
                    checked={dataUpdate?.mode === "force"}
                    onClick={() => {
                      setDataUpdate((prev) => ({ ...prev, mode: "force" }))
                    }}
                    onChange={() => {}}
                  />{" "}
                  {t("mail.mail_admin_forced_permit")}
                </Label>
              </div>
              <div className="me-3">
                <Label check>
                  <Input
                    type="radio"
                    name="radio1"
                    checked={dataUpdate?.mode === "select"}
                    onClick={() => {
                      setDataUpdate((prev) => ({ ...prev, mode: "select" }))
                    }}
                    onChange={() => {}}
                  />{" "}
                  {t("mail.mail_selective_permit")}
                </Label>
              </div>
            </div>
            <div className="mt-2 text-secondary">{t("mail.mail_admin_forced_permit_sending")}</div>
          </Col>
        </FormGroup>
        <Row>
          <Col lg="12">
            <FormGroup row>
              <Label htmlFor="taskname" className="col-form-label col-lg-3">
                {t("mail.mail_final_permitter")}
              </Label>
              <Col lg="9">
                <InputGroup>
                  <Input
                    className="cursor-not-allowed"
                    value={email?.selected?.title || ""}
                    disabled
                    invalid={invalid && Object.keys(email?.selected).length === 0}
                  />
                  <BaseButton
                    color="primary"
                    onClick={() => {
                      setOpen(!open)
                      setSingleSelect(true)
                    }}
                    disabled={Boolean(itemUpdate?.id)}
                  >
                    {t("mail.mail_select")}
                  </BaseButton>
                </InputGroup>
                <div
                  className={`mt-2 ${
                    invalid && Object.keys(email?.selected).length === 0
                      ? "text-danger"
                      : "text-secondary"
                  }`}
                >
                  {t("mail.admin_mail_secure_manager_help_msg")}
                </div>
              </Col>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col lg="12">
            <FormGroup className="mb-4" row>
              <Label htmlFor="taskname" className="col-form-label col-lg-3">
                {t("mail.mail_final_permit_policy")}
              </Label>
              <Col lg="9" className="pl-0 mt-2">
                <div className="d-flex justify-content-left">
                  <Input
                    aria-label="Checkbox for following text input"
                    type="checkbox"
                    className="me-1"
                    checked={dataUpdate?.esuper === "y" || false}
                    onClick={(e) => handleCheckboxChange(e, "esuper")}
                    onChange={() => {}}
                  />
                  <div>{t("mail.mail_forced_approval_possible")}</div>
                </div>
                <div className="mt-2 text-secondary">
                  <p>{t("mail.mail_arbitrary_permit_means")}</p>
                </div>

                {dataUpdate?.mode === "select" && (
                  <div className="d-flex justify-content-left">
                    <Input
                      aria-label="Checkbox for following text input"
                      type="checkbox"
                      className="me-1"
                      checked={dataUpdate?.eforce === "y" || false}
                      onClick={(e) => handleCheckboxChange(e, "eforce")}
                      onChange={() => {}}
                    />
                    <div>{t("mail.mail_permit_all")}</div>
                  </div>
                )}
              </Col>
            </FormGroup>
          </Col>
        </Row>
        {dataUpdate?.mode === "force" && (
          <>
            <div className="mb-4">
              <BaseIcon
                icon={"mdi mdi-help-circle-outline"}
                className={"color-green text-secondary mx-2"}
              />
              {t("mail.mail_specify_the_conditions")}
            </div>

            <Row>
              <Col lg="12">
                <FormGroup className="mb-4" row>
                  <Label htmlFor="taskname" className="col-form-label col-lg-3">
                    {t("mail.mail_permit_condition")}
                  </Label>
                  <Col lg="9" className="pl-0 mt-2">
                    <div>
                      <div className="d-flex justify-content-left">
                        <Input
                          aria-label="Checkbox for following text input"
                          type="checkbox"
                          className="me-1"
                          checked={dataUpdate?.fall === "y" || false}
                          onClick={(e) => handleCheckboxChange(e, "fall")}
                          onChange={() => {}}
                        />
                        <div>{t("mail.mail_admin_include_mail")}</div>
                      </div>

                      <div className="form-name">
                        {dataUpdate?.fall === "y" ? (
                          <div
                            id="taskname"
                            name="taskname"
                            type="text"
                            className="form-control mt-3"
                          >
                            <div className="action-button flex-wrap">
                              {dataUpdate?.fdomain &&
                                dataUpdate?.fdomain.map((item, index) => (
                                  <BaseButton
                                    key={index}
                                    className={"btn btn-soft-secondary p-1 my-1"}
                                    type="button"
                                  >
                                    {item}
                                    <BaseIcon
                                      icon={"mdi mdi-close-thick"}
                                      onClick={() => handleRemove(item, "fdomain")}
                                    />
                                  </BaseButton>
                                ))}
                              <Input
                                className="border-0 w-50 p-1 mx-2"
                                value={domainText}
                                onChange={(e) => setDomainText(e.target.value)}
                                onKeyUp={(e) => handleTypeEnter(e, "fdomain")}
                                placeholder={t("mail.mail_admin_eg_domain")}
                                onBlur={() => onForceUpdate(domainText, "fdomain")}
                              />
                            </div>
                          </div>
                        ) : (
                          <Input
                            className="mt-3 px-4 py-2"
                            disabled={dataUpdate?.fall !== "y" || false}
                            placeholder={t("mail.mail_admin_eg_domain")}
                          />
                        )}
                        <div className="mt-2 text-secondary">
                          <p>
                            {t("mail.mail_when_sending_mail_to_a_specific_domain")}
                            <br />
                            {t("mail.mail_multiple_domains_can_be_registered_separated_by_commas")}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="d-flex justify-content-left">
                        <Input
                          aria-label="Checkbox for following text input"
                          type="checkbox"
                          className="me-1"
                          checked={dataUpdate?.ffile === "y" || false}
                          onClick={(e) => handleCheckboxChange(e, "ffile")}
                          onChange={() => {}}
                        />
                        <div>{t("mail.mail_only_mail_with_attachments")}</div>
                      </div>
                      <div className="form-name">
                        {dataUpdate?.ffile === "y" ? (
                          <div
                            id="taskname"
                            name="taskname"
                            type="text"
                            className="form-control mt-3"
                          >
                            <div className="action-button flex-wrap">
                              {dataUpdate?.ffile &&
                                dataUpdate?.fftype.map((item, index) => (
                                  <BaseButton
                                    key={index}
                                    className={"btn btn-soft-secondary p-1 my-1"}
                                    type="button"
                                  >
                                    {item}
                                    <BaseIcon
                                      icon={"mdi mdi-close-thick"}
                                      onClick={() => handleRemove(item, "fftype")}
                                    />
                                  </BaseButton>
                                ))}
                              <Input
                                className="border-0 w-50 p-1 mx-2"
                                value={typeFile}
                                onChange={(e) => setTypeFile(e.target.value)}
                                onKeyUp={(e) => handleTypeEnter(e, "fftype")}
                                placeholder={t("mail.mail_admin_eg_extension")}
                                onBlur={() => onForceUpdate(typeFile, "fftype")}
                              />
                            </div>
                          </div>
                        ) : (
                          <Input
                            className="mt-3 px-4 py-2"
                            disabled={dataUpdate?.ffile !== "y" || false}
                            placeholder={t("mail.mail_admin_eg_extension")}
                          />
                        )}
                      </div>
                      <div className="form-name">
                        {dataUpdate?.ffile === "y" ? (
                          <div
                            id="taskname"
                            name="taskname"
                            type="text"
                            className="form-control mt-3"
                          >
                            <div className="action-button flex-wrap">
                              {dataUpdate?.ffname &&
                                dataUpdate?.ffname.map((item, index) => (
                                  <BaseButton
                                    key={index}
                                    className={"btn btn-soft-secondary p-1 my-1"}
                                    type="button"
                                  >
                                    {item}
                                    <BaseIcon
                                      icon={"mdi mdi-close-thick"}
                                      onClick={() => handleRemove(item, "ffname")}
                                    />
                                  </BaseButton>
                                ))}
                              <Input
                                className="border-0 w-50 p-1 mx-2"
                                value={ffName}
                                onChange={(e) => setffName(e.target.value)}
                                onKeyUp={(e) => handleTypeEnter(e, "ffname")}
                                placeholder={t("mail.mail_admin_eg_description")}
                                onBlur={() => onForceUpdate(ffName, "ffname")}
                              />
                            </div>
                          </div>
                        ) : (
                          <Input
                            className="mt-3 px-4 py-2"
                            disabled={dataUpdate?.ffile !== "y" || false}
                            placeholder={t("mail.mail_admin_eg_description")}
                          />
                        )}
                        <div className="mt-2 text-secondary">
                          <p>
                            {t("mail.mail_attached_name_keyword")}
                            <br />
                            {t(
                              "mail.mail_multiple_keywords_attach_can_be_registered_separated_by_commas",
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="form-name">
                      <InputGroup>
                        <input
                          type="number"
                          min="0"
                          className="form-control"
                          id="inlineFormInputGroupUsername"
                          onChange={(e) => {
                            setDataUpdate((prev) => ({
                              ...prev,
                              fmsize: e.target.value,
                            }))
                          }}
                          value={dataUpdate.fmsize}
                        />
                        <div className="input-group-text">MB</div>
                      </InputGroup>

                      <div className="mt-2 text-secondary">
                        <p>{t("mail.mail_only_mail_larger_than_certain_size")}</p>
                      </div>
                    </div>

                    <div>
                      <div className="d-flex justify-content-left">
                        <Input
                          aria-label="Checkbox for following text input"
                          type="checkbox"
                          className="me-1"
                          checked={useKeyword}
                          onClick={() => setUseKeyword(!useKeyword)}
                          onChange={() => {}}
                        />
                        {/* <div>Use keyword</div> */}
                        <div>{t("admin.common_search_keyword")}</div>
                      </div>
                      <div className="form-name">
                        {useKeyword ? (
                          <div
                            id="taskname"
                            name="taskname"
                            type="text"
                            className="form-control mt-3"
                          >
                            <div className="action-button">
                              {dataUpdate?.fkeyword &&
                                dataUpdate?.fkeyword.map((item, index) => (
                                  <BaseButton
                                    key={index}
                                    className={"btn btn-soft-secondary p-1 my-1"}
                                    type="button"
                                  >
                                    {item}
                                    <BaseIcon
                                      icon={"mdi mdi-close-thick"}
                                      onClick={() => handleRemove(item, "fkeyword")}
                                    />
                                  </BaseButton>
                                ))}
                              <Input
                                className="border-0 w-50 p-1 mx-2"
                                value={fKeyword}
                                onChange={(e) => setfKeyword(e.target.value)}
                                onKeyUp={(e) => handleTypeEnter(e, "fkeyword")}
                                placeholder={t("mail.mail_admin_eg_keyword")}
                                onBlur={() => onForceUpdate(fKeyword, "fkeyword")}
                              />
                            </div>
                          </div>
                        ) : (
                          <Input
                            className="mt-3 px-4 py-2"
                            disabled={!useKeyword || false}
                            placeholder={t("mail.mail_admin_eg_keyword")}
                          />
                        )}

                        <div className="mt-2 text-secondary">
                          <p>
                            {t("mail.mail_when_keyword_is_included_in_subject_body")}
                            <br />
                            {t(
                              "mail.mail_multiple_keywords_subject_can_be_registered_separated_by_commas",
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Col>
                </FormGroup>
              </Col>
            </Row>
          </>
        )}
        <div>
          <BaseInputFree
            title={t("mail.mail_secure_person")}
            components={components}
            component={
              <Button
                color="primary"
                className="px-1 rounded-none-btn-org"
                onClick={() => {
                  setOpen(!open)
                  setSingleSelect(false)
                  setTypeOrg("ids")
                }}
              >
                <i className="mdi mdi-file-tree"></i>
              </Button>
            }
            onChange={(newValue) => {
              setValueOrg((prev) => ({ ...prev, ids: newValue }))
              setDataUpdate((prev) => ({
                ...prev,
                ids: newValue.map((v) => v.value),
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
            isMulti
            isClearable
            isValidNewOption={(inputValue) => false}
            placeholder=""
            invalid={invalid && valueOrg.ids.length === 0}
            value={valueOrg.ids}
          />
        </div>
        <div>
          <BaseInputFree
            title={t("mail.mail_admin_mid_permitter")}
            components={components}
            component={
              <Button
                color="primary"
                className="px-1 rounded-none-btn-org"
                onClick={() => {
                  setOpen(!open)
                  setSingleSelect(false)
                  setTypeOrg("mmanagerids")
                }}
              >
                <i className="mdi mdi-file-tree"></i>
              </Button>
            }
            onChange={(newValue) => {
              setValueOrg((prev) => ({ ...prev, mmanagerids: newValue }))
              setDataUpdate((prev) => ({
                ...prev,
                mmanagerids: newValue.map((v) => v.value),
              }))
              const filteredObject = {}
              for (const item of newValue) {
                const id = item.value
                if (emailsMid.selected.hasOwnProperty(id)) {
                  filteredObject[id] = emailsMid.selected[id]
                }
              }
              setEmailsMid({ selected: filteredObject })
            }}
            isMulti
            isClearable
            isValidNewOption={(inputValue) => false}
            placeholder=""
            value={valueOrg?.mmanagerids}
          />
        </div>
        <div>
          <BaseInputFree
            title={t("mail.mail_secure_predecessor_setting")}
            onChange={(newValue) => {
              setValueOrg((prev) => ({ ...prev, mpredecessorids: newValue }))
              setDataUpdate((prev) => ({
                ...prev,
                mpredecessorids: newValue.map((v) => v.value),
              }))
            }}
            optionGroup={valueOrg?.mmanagerids}
            isMulti
            isClearable
            placeholder=""
            value={valueOrg?.mpredecessorids}
          />
        </div>
        <Row>
          <Col lg="12">
            <FormGroup className="mb-4" row>
              <Label htmlFor="taskname" className="col-form-label col-lg-3">
                {t("mail.mail_mid_approval_policy")}
              </Label>
              <Col lg="9" className="pl-0 mt-2">
                {dataUpdate?.mode === "force" && (
                  <div>
                    <div className="d-flex justify-content-left">
                      <Input
                        aria-label="Checkbox for following text input"
                        type="checkbox"
                        className="me-1"
                        checked={dataUpdate?.mselect === "y" || false}
                        onClick={(e) => handleCheckboxChange(e, "mselect")}
                        onChange={() => {}}
                      />
                      <div>{t("mail.mail_selective_permit")}</div>
                    </div>
                    <div className="mt-2 text-secondary">
                      <p>{t("mail.mail_select_whether_to_permit_when_sending_mail")}</p>
                    </div>
                  </div>
                )}

                <div>
                  <div className="d-flex justify-content-left">
                    <Input
                      aria-label="Checkbox for following text input"
                      type="checkbox"
                      className="me-1"
                      checked={dataUpdate?.mall === "y" || false}
                      onClick={(e) => handleCheckboxChange(e, "mall")}
                      onChange={() => {}}
                    />
                    <div>{t("mail.mail_permit_all")}</div>
                  </div>
                  <div className="mt-2 text-secondary">
                    <p>{t("mail.mail_all_mid_permit_must_approve_before_the_final_approval")}</p>
                  </div>
                </div>
              </Col>
            </FormGroup>
          </Col>
        </Row>
        <Row>
          <Col lg="12">
            <FormGroup className="mb-4" row>
              <Label htmlFor="taskname" className="col-form-label col-lg-3">
                {t("mail.mail_admin_setting_notification")}
              </Label>
              <Col lg="9" className="pl-0 mt-2">
                <div>
                  <div className="d-flex justify-content-left">
                    <Input
                      aria-label="Checkbox for following text input"
                      type="checkbox"
                      className="me-1"
                      checked={dataUpdate?.mailalarm === "y" || false}
                      onClick={(e) => handleCheckboxChange(e, "mailalarm")}
                      onChange={() => {}}
                    />
                    <div>{t("mail.mail_send_approval_request_email_to_approver")}</div>
                  </div>
                  <div className="mt-2 text-secondary">
                    <p>
                      {t(
                        "mail.mail_if_you_request_approval_we_will_send_an_email_notification_to_the_approver",
                      )}
                    </p>
                  </div>
                </div>

                <div>
                  <div className="d-flex justify-content-left">
                    <Input
                      aria-label="Checkbox for following text input"
                      type="checkbox"
                      className="me-1"
                      checked={dataUpdate?.mailalarm_tosender === "y" || false}
                      onClick={(e) => handleCheckboxChange(e, "mailalarm_tosender")}
                      onChange={() => {}}
                    />
                    <div>{t("mail.mail_receive_approval_request_notification")}</div>
                  </div>
                  <div className="mt-2 text-secondary">
                    <p>{t("mail.mail_receive_approval_request_notification_msg")}</p>
                  </div>
                </div>
              </Col>
            </FormGroup>
          </Col>
        </Row>
      </>
    )
  }

  const footerModal = () => {
    return (
      <div className="d-flex flex-column justify-content-between">
        {invalid && (Object.keys(email?.selected).length === 0 || valueOrg.ids.length === 0) && (
          <div className="text-danger">{t("mail.mail_admin_error_require")}</div>
        )}
        <div className="action-form">
          <BaseButton
            color={"primary"}
            type="button"
            onClick={() => {
              if (!!Object.keys(email?.selected).length && valueOrg.ids.length > 0) {
                handleUpdate(dataUpdate, email?.selected?.id)
              } else {
                setInvalid(true)
              }
            }}
          >
            {t("mail.mail_view_save")}
          </BaseButton>
          <BaseButton
            outline
            color={"grey"}
            data-bs-target="#secondmodal"
            onClick={toggleModal}
            type="button"
          >
            {t("mail.project_close_msg")}
          </BaseButton>
        </div>
      </div>
    )
  }
  const headerAlert = () => {
    return <span>{t("common.notice_header_failure")}</span>
  }
  const bodyAlert = () => {
    return <span>{alert}</span>
  }
  const footerAlert = () => {
    return (
      <span className="write-form">
        <BaseButton icon={"bx bx-x"} iconClassName="font-size-16 me-2" onClick={() => setAlert("")}>
          {t("common.common_close_msg")}
        </BaseButton>
      </span>
    )
  }
  // Save Org Selected Modal
  const handleSaveOrg = (emails) => {
    if (!singleSelect) {
      const dataArray = Object.values(emails?.selected)
      const newValues = dataArray.map((item) => ({
        label: item?.title || item?.name || item?.username,
        value: item?.isFolder
          ? "g}|{" + item?.cn + "_" + (item?.groupno ?? item?.no)
          : item?.fid
          ? item?.userid
          : item?.id,
      }))
      setValueOrg((prev) => ({ ...prev, [typeOrg]: newValues }))
      setDataUpdate({
        ...dataUpdate,
        [typeOrg]: newValues.map((item) => item?.value),
      })
    }
  }

  return (
    <>
      {!isLoading && (
        <BaseModal
          isOpen={isOpen}
          toggle={toggleModal}
          renderHeader={headerModal}
          renderBody={bodyModal}
          renderFooter={footerModal}
        />
      )}
      {open && (
        <OrgSelectModal
          mode={2}
          open={open}
          setOpen={setOpen}
          autoSelectUser={typeOrg === "mmanagerids"}
          isSingle={singleSelect}
          orgTabOption={tabOptions}
          title={t("common.main_orgtree")}
          emails={singleSelect ? email : typeOrg === "ids" ? emails : emailsMid}
          setEmails={singleSelect ? setEmail : typeOrg === "ids" ? setEmails : setEmailsMid}
          onSave={(emails) => {
            handleSaveOrg(emails)
          }}
          handleClose={() => {
            setOpen(!open)
          }}
          // hideTab={true}
          APIParams={
            typeOrg
              ? {
                  single: 1,
                  hidden_favorite: 1,
                }
              : {}
          }
        />
      )}
      <BaseModal
        isOpen={alert != ""}
        toggle={() => setAlert("")}
        renderHeader={headerAlert}
        renderBody={bodyAlert}
        renderFooter={footerAlert}
        size={"xs"}
      />
    </>
  )
}

export default AddForm
