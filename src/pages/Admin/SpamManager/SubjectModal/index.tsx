// @ts-nocheck
// React
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

// Third-party
import {
  Col,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  FormGroup,
  Input,
  Label,
  Row,
} from "reactstrap"

// Project
import { BaseModal } from "components/Common"
import BaseButton from "components/Common/BaseButton"
import BaseIcon from "components/Common/BaseIcon"
import InputSelect from "components/SettingAdmin/Inputselectwriting/index"
import InputText from "components/SettingAdmin/Inputwriting/index"
import ToggleSwitch from "components/SettingAdmin/Toggle/index"
import {
  BASE_URL,
  Headers,
  emailGet,
  emailPost,
  formDataUrlencoded,
} from "helpers/email_api_helper"
import { useCustomToast } from "hooks/useCustomToast"

import AttachmentMail from "components/AttachmentMail"
import "components/SettingAdmin/Tabs/style.css"
import "../style.scss"

const SubjectModal = (props) => {
  const { spamId, isOpen, toggleModal, setFormSpam, handleChangeStatus, handleComposeMail } = props
  const { t } = useTranslation()
  const { successToast, errorToast } = useCustomToast()

  const [mailData, setMailData] = useState()

  // State Loading
  const [showEmailTo, setShowEmailTo] = useState(false)
  const [showHeader, setShowHeader] = useState(false)
  const [header, setHeader] = useState("")
  const [rawHeader, setRawHeader] = useState("")
  const [isOpenDrop, setIsOpenDrop] = useState(false)
  const [isContact, setIsContact] = useState(false)
  const [isBlockAddress, setIsBlockAddress] = useState(false)
  const [isSortMail, setIsSortMail] = useState(false)
  const [mailBox, setMailBox] = useState({})
  const [mailBoxs, setMailBoxs] = useState([])
  const [dataSortMail, setDataSortMail] = useState({
    fromaddr: "",
    toaddr: "",
    subject: "",
    mailbox: "",
  })

  const [folder, setFolder] = useState({})
  const [folders, setFolders] = useState([])
  const [dataContact, setDataContact] = useState({
    name: "",
    email: "",
    important: "0",
    id: "",
  })
  const [dataBlock, setDataBlock] = useState({
    email: "",
  })

  useEffect(() => {
    const fetchHeaderData = async (contents) => {
      try {
        let match = contents.match(/Subject:(.*?)<br>From/i)
        let subject = match !== null ? match[1] : ""
        match = contents.match(/From:(.*?)<br>To/i)
        let fromMail = match !== null ? match[1] : ""
        match = contents.match(/>To:((.*?)<br>Cc|(.*?)<br>Bcc|(.*?)<br>Date)/i)
        let toMail = match !== null ? match[1] : ""
        match = contents.match(/Cc:((.*?)<br>Bcc|(.*?)<br>Date)/i)
        let cc = match !== null ? match[1] : ""
        match = contents.match(/Bcc:(.*?)<br>Date/i)
        let bcc = match !== null ? match[1] : ""
        const params = {
          subject: subject,
          fromMail: fromMail,
          toMail: toMail,
          cc: cc,
          bcc: bcc,
        }

        const res = await emailPost(`ngw/mail/main/decode_mail_header`, params, Headers)
        if (res.success) {
          if (subject != "") {
            contents = contents.replace(subject, res.rows.subject)
          }

          if (fromMail != "") {
            contents = contents.replace(fromMail, res.rows.fromMail)
          }

          if (toMail != "") {
            contents = contents.replace(toMail, res.rows.toMail)
          }

          if (cc != "") {
            contents = contents.replace(cc, res.rows.cc)
          }

          if (bcc != "") {
            contents = contents.replace(bcc, res.rows.bcc)
          }
        }
        setHeader(contents)
      } catch (err) {
        errorToast()
        console.log("error messenger", err)
      }
    }

    if (rawHeader != "") {
      fetchHeaderData(rawHeader)
    }
  }, [rawHeader])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = { view_mode: "orgheader" }
        const queryParameters = formDataUrlencoded(params)
        const res = await emailGet(
          `email/CSpam/${spamId?.id}${showHeader ? "/?" + queryParameters : ""}`,
        )
        if (res?.mailview) {
          if (showHeader) {
            let contents = res?.mailview[0].contents
            setRawHeader(contents)
          } else {
            let newMailData = res?.mailview[0]
            newMailData.spamId = spamId?.id
            setMailData(newMailData)
            setShowEmailTo(res?.mailview[0]?.isaddropen)
          }
        } else {
          errorToast()
        }
      } catch (err) {
        errorToast()
        console.log("error messenger", err)
      }
    }

    fetchData()
  }, [spamId, showHeader])

  useEffect(() => {
    const fetchDataMailBocx = async () => {
      try {
        const res = await emailGet(`email/boxinfo/all`)
        const mailList = res?.mailbox.map((v) => ({
          label: v?.name,
          value: v?.key,
        }))
        setMailBoxs(mailList)
      } catch (err) {
        console.log("error messenger", err)
      }
    }
    if (isSortMail) {
      fetchDataMailBocx()
      setDataSortMail((prev) => ({
        ...prev,
        fromaddr: mailData?.from,
        toaddr: mailData?.to,
        subject: mailData?.subject,
      }))
    }
  }, [isSortMail])

  useEffect(() => {
    const fetchDataMailBox = async () => {
      try {
        const res = await emailGet(`ngw/addrbook/contact/folder_add_contact`)
        const folderList = res?.row.map((group) => ({
          label: group?.name,
          options: Array.isArray(group?.children)
            ? group?.children?.map((item) => ({
                label: item?.name,
                value: item?.id,
              }))
            : [],
        }))
        setFolders(folderList)
        setFolder({
          label: res?.default_folder?.name,
          value: res?.default_folder?.id,
        })
        setDataContact((prev) => ({
          ...prev,
          id: res?.default_folder?.id,
        }))
      } catch (err) {
        console.log("error messenger", err)
      }
    }
    if (isContact) {
      fetchDataMailBox()
      const { strName, strEmail } = extractMailInformation(mailData?.from_addr ?? mailData?.from)
      setDataContact((prev) => ({
        ...prev,
        name: strName,
        email: strEmail,
        important: "0",
      }))
    }
  }, [isContact])

  useEffect(() => {
    if (isBlockAddress) {
      const { strEmail } = extractMailInformation(mailData?.from_addr ?? mailData?.from)
      setDataBlock({
        email: strEmail,
      })
    }
  }, [isBlockAddress])

  const extractMailInformation = (email) => {
    var strTemp, arrTemp, strName, strEmail
    strTemp = email.replace(/&gt;/g, "")
    arrTemp = strTemp.split("&lt;")
    if (arrTemp.length < 2) {
      strTemp = strTemp.replace(">", "")
      arrTemp = strTemp.split("<")
    }
    // check email
    if (arrTemp.length == 2) {
      strName = arrTemp[0]
      strEmail = arrTemp[1]
      // remove ", '
      strName = strName.replace(/'/g, "")
      strName = strName.replace(/"/g, "")
    } else {
      strName = arrTemp[0]
      strEmail = arrTemp[0]
    }

    return { strName, strEmail }
  }

  const removeHtmlInEmail = (text) => {
    return text?.replace(/&lt;/gi, "<")?.replace(/&gt;/gi, ">")
  }

  const handleSave = () => {
    let strLink = `email/CSpam/${spamId?.id}/?view_mode=orgdown`
    const url = [BASE_URL, strLink].join("/")
    const win = window.open(url, "_blank")
    win.focus()
  }

  // Handle open compose mail modal
  // const handleComposeMail = () => {
  //   dispatch(openComposeMail())
  // }

  // Subject pop up
  const headerSubject = () => {
    return <div dangerouslySetInnerHTML={{ __html: mailData?.subject }}></div>
  }

  const bodySubject = () => {
    if (mailData) {
      return (
        <>
          <div>
            <BaseIcon
              icon={`mdi mdi-star${mailData?.isimportant ? "" : "-outline"}`}
              className={mailData?.isimportant ? "color-yellow" : "han-text-primary"}
            />
            <span
              dangerouslySetInnerHTML={{ __html: mailData?.subject }}
              className={"color-blue mx-2"}
            ></span>
          </div>

          <div className="square border rounded my-2 p-3">
            <Row>
              <Col lg="2">
                <div className="d-flex my-2">{t("mail.mail_write_from")}</div>
              </Col>
              <Col lg="10">
                <div className="d-flex my-2">
                  <span>
                    <Dropdown isOpen={isOpenDrop} toggle={() => setIsOpenDrop(!isOpenDrop)}>
                      <DropdownToggle
                        data-toggle="dropdown"
                        tag="span"
                        className="cursor-pointer drop-subject"
                      >
                        <span dangerouslySetInnerHTML={{ __html: mailData?.from }}></span>
                      </DropdownToggle>
                      <DropdownMenu className="p-3" style={{ width: "200px" }}>
                        <div
                          className="cursor-pointer p-1"
                          onClick={() => {
                            console.log(mailData)
                            setIsOpenDrop(!isOpenDrop)
                            handleComposeMail && handleComposeMail(mailData?.replyto)
                          }}
                        >
                          {t("mail.mail_write_write")}
                        </div>
                        <DropdownItem divider />
                        <div
                          className="cursor-pointer p-1"
                          onClick={() => {
                            setIsOpenDrop(!isOpenDrop)
                            setIsContact(!isContact)
                          }}
                        >
                          {t("mail.mail_view_addaddress")}
                        </div>
                        <div
                          className="cursor-pointer p-1"
                          onClick={() => {
                            setIsOpenDrop(!isOpenDrop)
                            setIsBlockAddress(!isBlockAddress)
                          }}
                        >
                          {t("mail.mail_set_bans_bans")}
                        </div>
                        <div
                          className="cursor-pointer p-1"
                          onClick={() => {
                            setIsOpenDrop(!isOpenDrop)
                            setIsSortMail(!isSortMail)
                          }}
                        >
                          {t("mail.mail_view_autosplit")}
                        </div>
                      </DropdownMenu>
                    </Dropdown>
                  </span>

                  <div className="vertical-line mx-2"></div>
                  <span className="mx-2">
                    {`${t("common.profile_login_history_ip")}: ${mailData.remoteip} (${
                      mailData.geoip.isprivate
                        ? t("mail.mail_view_private_msg")
                        : t("mail.mail_view_public_msg")
                    })`}
                  </span>
                  <div className="flag-box mx-2" onClick={() => setShowEmailTo(!showEmailTo)}>
                    <BaseIcon
                      icon={`mdi ${showEmailTo ? "mdi-menu-down" : "mdi-menu-up"}`}
                      className={"mx-1"}
                    />
                  </div>
                  <div className="vertical-line mx-2"></div>
                  <a
                    className="write-form my-0"
                    type="button"
                    onClick={() => {
                      setShowHeader(true)
                    }}
                  >
                    <BaseIcon icon={"mdi mdi-newspaper"} className={"mx-1"} />
                    {t("mail.mail_show_header")}
                  </a>
                  <div className="vertical-line mx-2"></div>
                  <a className="write-form my-0" type="button" onClick={handleSave}>
                    <BaseIcon icon={"mdi mdi-download"} className={"mx-1"} />
                    {t("mail.mail_view_save")}
                  </a>
                </div>
              </Col>
            </Row>

            {showEmailTo && (
              <Row className="mt-3">
                <Col lg="2">
                  <div>{t("mail.mail_secure_toemail")}</div>
                </Col>
                <Col lg="10">
                  <div className="d-flex">
                    <span dangerouslySetInnerHTML={{ __html: mailData?.to }}></span>
                  </div>
                </Col>
              </Row>
            )}
            {showEmailTo && mailData?.cc && (
              <Row className="mt-3">
                <Col lg="2">
                  <div>{t("common.main_mail_cc")}</div>
                </Col>
                <Col lg="10">
                  <div className="d-flex">
                    <span dangerouslySetInnerHTML={{ __html: mailData?.cc }}></span>
                  </div>
                </Col>
              </Row>
            )}
            {showEmailTo && mailData?.bcc && (
              <Row className="mt-3">
                <Col lg="2">
                  <div>{t("common.main_mail_bcc")}</div>
                </Col>
                <Col lg="10">
                  <div className="d-flex">
                    <span dangerouslySetInnerHTML={{ __html: mailData?.bcc }}></span>
                  </div>
                </Col>
              </Row>
            )}
            {showEmailTo && mailData?.replyto && (
              <Row className="mt-3">
                <Col lg="2">
                  <div>{t("mail.mail_reply_to")}</div>
                </Col>
                <Col lg="10">
                  <div className="d-flex">
                    <span dangerouslySetInnerHTML={{ __html: mailData?.replyto }}></span>
                  </div>
                </Col>
              </Row>
            )}
          </div>
          <div className="square border-top my-2 py-3 d-flex flex-column gap-3">
            {/* Attachment File with Grid mode */}
            {mailData?.file?.length > 0 && (
              <AttachmentMail
                isShowButton={{ download: false, preview: false, delete: false, clouddisk: false }}
                initMail={mailData}
                gridMode={true}
                isOpen={true}
              />
            )}
            <div
              className="font-size-13"
              dangerouslySetInnerHTML={{ __html: `${mailData.contents}` }}
            ></div>
            {/* Attachment File with List mode */}
            {mailData?.file?.length > 0 && (
              <AttachmentMail
                isShowButton={{ download: false, preview: false, delete: false, clouddisk: false }}
                initMail={mailData}
                gridMode={false}
                isOpen={true}
              />
            )}
          </div>
        </>
      )
    }
    return
  }

  const footerSubject = () => {
    return (
      <>
        <div className="action-form">
          <BaseButton
            color={"primary"}
            type="button"
            onClick={() => {
              setFormSpam((prev) => ({
                ...prev,
                type: "subject",
                mode: "subject",
                subject: spamId?.subject,
                from: removeHtmlInEmail(mailData?.from),
                to: removeHtmlInEmail(mailData?.to),
              }))
            }}
          >
            {t("mail.mail_block_keywords")}
          </BaseButton>
          <BaseButton
            color={"success"}
            type="button"
            onClick={() => {
              handleChangeStatus("p", spamId?.id)
              toggleModal()
            }}
          >
            {t("mail.mail_admin_process")}
          </BaseButton>
          <BaseButton
            color={"danger"}
            type="button"
            onClick={() => {
              handleChangeStatus("d", spamId?.id)
              toggleModal()
            }}
          >
            {t("mail.mail_secure_deny_btn")}
          </BaseButton>
          <BaseButton color={"grey"} type="button" onClick={toggleModal} className={"btn-action"}>
            {t("mail.project_close_msg")}
          </BaseButton>
        </div>
      </>
    )
  }

  // Header
  const headerModalHeader = () => {
    if (mailData) {
      return <div>{mailData.subject}</div>
    }
    return
  }

  const bodyModalHeader = () => {
    return (
      <div>
        {mailData && (
          <div className="font-size-13" dangerouslySetInnerHTML={{ __html: `${header}` }}></div>
        )}
      </div>
    )
  }

  const footerModalHeader = () => {
    return (
      <BaseButton
        color={"secondary"}
        type="button"
        onClick={() => {
          setShowHeader(false)
        }}
      >
        {t("mail.project_close_msg")}
      </BaseButton>
    )
  }

  // Add to Contact List
  const headerContact = () => {
    return <div>{t("mail.addrbook_add_address_msg")}</div>
  }

  const bodyContact = () => {
    return (
      <div>
        <InputSelect
          title={t("common.addrbook_folder_msg")}
          optionGroup={folders}
          onChange={(s) => {
            setFolder(s)
            setDataContact((prev) => ({
              ...prev,
              id: s.value,
            }))
          }}
          value={folder}
          stylesSelect={{
            option: (styles) => ({
              ...styles,
              paddingLeft: "30px",
            }),
          }}
        />
        <InputText
          title={t("mail.mailadmin_username")}
          value={dataContact?.name}
          onChange={(e) => setDataContact((prev) => ({ ...prev, name: e.target.value }))}
        />
        <InputText
          title={t("mail.mail_forward_email_address")}
          disabled
          value={dataContact?.email}
        />
        <ToggleSwitch
          title={t("mail.mail_addrbook_important")}
          checked={dataContact?.important === "1" || false}
          onChange={(e) => {
            setDataContact((prev) => ({ ...prev, important: e ? "1" : "0" }))
          }}
          col={"9"}
        />
      </div>
    )
  }

  const footerContact = () => {
    return (
      <div className="action-form">
        <BaseButton
          color={"primary"}
          type="button"
          onClick={() => {
            handleSaveContact()
          }}
        >
          {t("mail.mail_view_save")}
        </BaseButton>
        <BaseButton
          color={"grey"}
          className={"btn-action"}
          type="button"
          onClick={() => {
            setIsContact(!isContact)
          }}
        >
          {t("mail.project_close_msg")}
        </BaseButton>
      </div>
    )
  }

  // Block Address
  const headerBlockAddress = () => {
    return <div>{t("mail.mail_set_bans_bans")}</div>
  }

  const bodyBlockAddress = () => {
    return (
      <div>
        <InputText title={t("mail.mail_forward_email_address")} disabled value={dataBlock.email} />
      </div>
    )
  }

  const footerBlockAddress = () => {
    return (
      <div className="action-form">
        <BaseButton
          color={"primary"}
          type="button"
          onClick={() => {
            handleSaveSortMail("None")
          }}
        >
          {t("mail.mail_view_save")}
        </BaseButton>
        <BaseButton
          color={"grey"}
          className={"btn-action"}
          type="button"
          onClick={() => {
            setIsBlockAddress(!isBlockAddress)
          }}
        >
          {t("mail.project_close_msg")}
        </BaseButton>
      </div>
    )
  }

  // Auto-Sort Mail to Folder
  const headerSortMail = () => {
    return <div>{t("mail.mail_view_autosplit")}</div>
  }

  const bodySortMail = () => {
    if (mailData) {
      const strFromEmail = removeHtmlInEmail(mailData?.from_addr ?? mailData?.from)
      const strToEmail = removeHtmlInEmail(mailData?.to)
      return (
        <div>
          <InputText
            title={t("mail.mail_write_from")}
            value={strFromEmail}
            onChange={(e) => {
              setDataSortMail((prev) => ({ ...prev, fromaddr: e.target.value }))
            }}
          />
          <InputText
            title={t("common.mail_write_to")}
            value={strToEmail}
            onChange={(e) => {
              setDataSortMail((prev) => ({ ...prev, toaddr: e.target.value }))
            }}
          />
          <InputText
            title={t("common.mail_write_subject")}
            value={mailData.subject}
            onChange={(e) => {
              setDataSortMail((prev) => ({ ...prev, subject: e.target.value }))
            }}
          />
          <InputSelect
            title={t("mail.mail_mobile_mbox")}
            optionGroup={mailBoxs}
            onChange={(s) => {
              setMailBox(s)
              setDataSortMail((prev) => ({ ...prev, mailbox: s.value }))
            }}
            value={mailBox}
          />
          <FormGroup row>
            <Label htmlFor="taskname" className="col-form-label col-lg-3"></Label>
            <Col lg="9" className="d-flex">
              <Input type="checkbox" />
              <div className="mx-2">{t("mail.mail_continue_confirm_check")}</div>
            </Col>
          </FormGroup>
        </div>
      )
    }
    return
  }

  const footerSortMail = () => {
    return (
      <div className="action-form">
        <BaseButton
          color={"primary"}
          type="button"
          onClick={() => {
            handleSaveSortMail()
          }}
        >
          {t("mail.mail_view_save")}
        </BaseButton>
        <BaseButton
          color={"grey"}
          className={"btn-action"}
          type="button"
          onClick={() => {
            setIsSortMail(!isSortMail)
          }}
        >
          {t("mail.project_close_msg")}
        </BaseButton>
      </div>
    )
  }

  const handleSaveSortMail = async (data) => {
    try {
      const params = {
        act: data ? "bans" : "autosplit",
        mode: data ? "write" : "insert",
        data: data ? data : JSON.stringify(dataSortMail),
      }
      const res = await emailPost(`/cgi-bin/NEW/mailTohtml5.do`, params, Headers)
      successToast()
      if (data) {
        setIsBlockAddress(!isBlockAddress)
      } else {
        setIsSortMail(!isSortMail)
      }
    } catch (err) {
      errorToast()
      console.log("error messenger", err)
    }
  }

  // handle save add contact
  const handleSaveContact = async () => {
    try {
      const params = { ...dataContact }
      const res = await emailPost(`/ngw/addrbook/contact/add`, params, Headers)
      successToast()
      setIsContact(!isContact)
    } catch (err) {
      errorToast()
      console.log("error messenger", err)
    }
  }

  return (
    <>
      <BaseModal
        size="xl"
        isOpen={isOpen}
        toggle={toggleModal}
        renderHeader={headerSubject}
        renderBody={bodySubject}
        renderFooter={footerSubject}
      />

      {showHeader && (
        <BaseModal
          isOpen={showHeader}
          toggle={() => {
            setShowHeader(false)
          }}
          renderHeader={headerModalHeader}
          renderBody={bodyModalHeader}
          renderFooter={footerModalHeader}
        />
      )}

      {/* Add to Contact List */}
      {isContact && (
        <BaseModal
          isOpen={isContact}
          toggle={() => setIsContact(!isContact)}
          renderHeader={headerContact}
          renderBody={bodyContact}
          renderFooter={footerContact}
        />
      )}
      {/* Block Address */}
      {isBlockAddress && (
        <BaseModal
          isOpen={isBlockAddress}
          toggle={() => {
            setIsBlockAddress(!isBlockAddress)
          }}
          renderHeader={headerBlockAddress}
          renderBody={bodyBlockAddress}
          renderFooter={footerBlockAddress}
        />
      )}
      {/* Auto-Sort Mail to Folder */}
      {isSortMail && (
        <BaseModal
          isOpen={isSortMail}
          toggle={() => {
            setIsSortMail(!isSortMail)
          }}
          renderHeader={headerSortMail}
          renderBody={bodySortMail}
          renderFooter={footerSortMail}
        />
      )}
    </>
  )
}

export default SubjectModal
