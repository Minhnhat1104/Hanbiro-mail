// @ts-nocheck
import React, { Suspense, useContext, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"

import { Card, Col, Collapse, FormGroup, Input, Label } from "reactstrap"

import { Title } from "components/SettingAdmin"
import Tooltip from "components/SettingAdmin/Tooltip"
import BaseButton from "components/Common/BaseButton"
const HanEditor = React.lazy(() => import("components/Common/Editor/HanEditor"))
import { Headers, emailGet, emailPut } from "helpers/email_api_helper"
import { useCustomToast } from "hooks/useCustomToast"
import { SIGNATURE } from "modules/mail/admin/url"
import { BaseIcon } from "components/Common"
import HanTooltip from "components/Common/HanTooltip"
import useDevice from "hooks/useDevice"
import MainHeader from "pages/SettingMain/MainHeader"
import { ComposeContext } from "components/Common/ComposeMail"

const Signature = ({ routeConfig }) => {
  const { t } = useTranslation()
  const { isMobile } = useDevice()

  const { successToast, errorToast } = useCustomToast()

  const { editorValue } = useContext(ComposeContext)

  // State
  const [filter, setFilter] = useState({})
  const [text, setText] = useState("")

  // Ref
  const textRef = useRef(null)

  const fetchData = async () => {
    try {
      const res = await emailGet(`${SIGNATURE}/info/desc`)
      if (res && res?.publist?.sigpublic01?.contents) {
        const sig = res?.publist?.sigpublic01?.contents
        setText(sig)
        textRef.current = sig
        handleChangeEditor(sig)
      }
      const res2 = await emailGet(`${SIGNATURE}/public/config`)
      if (res2) {
        setFilter({
          always: res2?.always || false,
          entirely: res2?.entirely || false,
          location: res2?.location || "",
        })
      }
    } catch (err) {
      console.log("error messenger", err)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Handle change Editor value
  const handleChangeEditor = (value, replace = true) => {
    let checkInitializedTimer = null
    const activeEditor = tinymce?.activeEditor

    function _setNewContent() {
      const newContent = replace ? value : editorValue + value
      setText(newContent)
      activeEditor.setContent(newContent)
      activeEditor.focus()
    }

    if (activeEditor?.initialized) {
      _setNewContent()
    } else {
      // wait for the editor initializes before setting content
      checkInitializedTimer = setInterval(() => {
        if (activeEditor?.initialized) {
          _setNewContent()
          clearInterval(checkInitializedTimer)
        }
      }, 500)
    }
  }

  const handleUpdate = async () => {
    try {
      const res = await emailPut(`${SIGNATURE}/public/config`, filter, Headers)
      const params = {
        contents: text,
      }
      const res2 = await emailPut(`${SIGNATURE}/public/contents/sigpublic01`, params, Headers)
      successToast()
    } catch (err) {
      errorToast()
      console.log("error messenger", err)
    }
  }

  return (
    <>
      <MainHeader currentTitleMenu={routeConfig?.keyTitle} />
      <div className={`w-100 h-100 overflow-hidden overflow-y-auto`}>
        <Tooltip
          content={
            <span
              dangerouslySetInnerHTML={{ __html: t("mail.mail_signature_explain_for_signature") }}
            ></span>
          }
        />
        <FormGroup row>
          <Label htmlFor="taskname" className="col-form-label col-lg-2">
            {t("mail.mail_signature_btn_force_apply")}
          </Label>
          <Col
            lg="10"
            className={`d-flex gap-3 align-items-${isMobile ? "start" : "center"} ${
              isMobile ? "flex-column" : ""
            }`}
          >
            <div className="me-3">
              <Label check className="d-flex align-items-center gap-1">
                <Input
                  className="mt-0"
                  type="radio"
                  name="radio1"
                  checked={filter.always || false}
                  onClick={() => {
                    setFilter({
                      always: true,
                      entirely: false,
                      location: "top",
                    })
                  }}
                  onChange={() => {}}
                />{" "}
                {t("mail.mail_signature_btn_force_append")}{" "}
                <HanTooltip
                  overlay={t("mail.mail_signature_explain_for_force_append")}
                  placement="bottom"
                >
                  <BaseIcon icon={"mdi mdi-information font-size-16 text-secondary"} />
                </HanTooltip>
              </Label>
            </div>
            <div className="me-3">
              <Label check className="d-flex align-items-center gap-2">
                <Input
                  className="mt-0"
                  type="radio"
                  name="radio1"
                  checked={filter.entirely || false}
                  onClick={() => {
                    setFilter((prev) => ({ ...prev, entirely: true, always: false }))
                  }}
                  onChange={() => {}}
                />{" "}
                {t("mail.mail_signature_btn_force_replace")}{" "}
                <HanTooltip
                  overlay={t("mail.mail_signature_explain_for_force_replace")}
                  placement="bottom"
                >
                  <BaseIcon icon={"mdi mdi-information font-size-16 text-secondary"} />
                </HanTooltip>
              </Label>
            </div>
            <div>
              <Label check className="d-flex align-items-center gap-2">
                <Input
                  className="mt-0"
                  type="radio"
                  name="radio1"
                  checked={(!filter.always && !filter.entirely) || false}
                  onClick={() => setFilter({ always: false, entirely: false })}
                  onChange={() => {}}
                />{" "}
                {t("mail.mail_signature_btn_none")}{" "}
                <HanTooltip overlay={t("mail.mail_signature_explain_for_none")} placement="bottom">
                  <BaseIcon icon={"mdi mdi-information font-size-16 text-secondary"} />
                </HanTooltip>
              </Label>
            </div>
          </Col>
        </FormGroup>
        <Collapse isOpen={filter.always}>
          <FormGroup row>
            <Label htmlFor="taskname" className="col-form-label col-lg-2">
              {t("mail.mail_signature_position")}
            </Label>
            <Col
              lg="10"
              className={`d-flex gap-3 align-items-${isMobile ? "start" : "center"} ${
                isMobile ? "flex-column" : ""
              }`}
            >
              <div className="me-3">
                <Label check className="d-flex align-items-center gap-2">
                  <Input
                    className="mt-0"
                    type="radio"
                    name="radio2"
                    checked={filter?.location === "top" || false}
                    onClick={() => {
                      setFilter((prev) => ({ ...prev, location: "top" }))
                    }}
                    onChange={() => {}}
                  />{" "}
                  {t("mail.mail_signature_top")}{" "}
                  <HanTooltip
                    overlay={
                      <span
                        dangerouslySetInnerHTML={{
                          __html: t("mail.mail_signature_explain_for_position"),
                        }}
                      ></span>
                    }
                    placement="bottom"
                  >
                    <BaseIcon icon={"mdi mdi-information font-size-16 text-secondary"} />
                  </HanTooltip>
                </Label>
              </div>
              <div>
                <Label check className="d-flex align-items-center gap-2">
                  <Input
                    className="mt-0"
                    type="radio"
                    name="radio2"
                    checked={filter?.location === "bottom" || false}
                    onClick={() => {
                      setFilter((prev) => ({ ...prev, location: "bottom" }))
                    }}
                    onChange={() => {}}
                  />{" "}
                  {t("mail.mail_signature_bottom")}{" "}
                  <HanTooltip
                    overlay={
                      <span
                        dangerouslySetInnerHTML={{
                          __html: t("mail.mail_signature_explain_for_position"),
                        }}
                      ></span>
                    }
                    placement="bottom"
                  >
                    <BaseIcon icon={"mdi mdi-information font-size-16 text-secondary"} />
                  </HanTooltip>
                </Label>
              </div>
            </Col>
          </FormGroup>
        </Collapse>

        {/* Editor */}
        <Suspense
          fallback={
            <div className="text-center mg-t-20">
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only"></span>
              </div>
            </div>
          }
        >
          <HanEditor value={text} onChange={handleChangeEditor} />
        </Suspense>
        <div className="d-flex justify-content-center py-4">
          <div>
            <BaseButton color={"primary"} className={"me-2"} type="button" onClick={handleUpdate}>
              {t("mail.mail_view_save")}
            </BaseButton>
          </div>
          <div>
            <BaseButton
              color={"grey"}
              type="button"
              className={"btn-action"}
              onClick={() => handleChangeEditor(textRef.current)}
            >
              {t("common.admin_reset_msg")}
            </BaseButton>
          </div>
        </div>
      </div>
    </>
  )
}

export default Signature
