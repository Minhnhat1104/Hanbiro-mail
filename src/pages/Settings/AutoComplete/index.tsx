// @ts-nocheck
// React
import React, { useEffect, useMemo, useRef, useState } from "react"

// Third-party
import { useTranslation } from "react-i18next"
import { Card, Row, Col, FormGroup, Label } from "reactstrap"
import Select from "react-select"

// Project
import { Title } from "components/SettingAdmin"
import Tooltip from "components/SettingAdmin/Tooltip/index"
import BaseButton from "components/Common/BaseButton"
import ToggleSwitch from "components/SettingAdmin/Toggle/index"
import { useCustomToast } from "hooks/useCustomToast"
import { Headers, emailGet, emailPost, formDataUrlencoded } from "helpers/email_api_helper"
import HanTooltip from "components/Common/HanTooltip"
import Loading from "components/Common/Loading"
import { URL_AUTOCOMPLETE } from "modules/mail/settings/urls"

import autoCompleteImage from "./auto-complete-en.gif"

import "./style.scss"
import MainHeader from "pages/SettingMain/MainHeader"

const AutoComplete = (props) => {
  const { routeConfig } = props
  const { t } = useTranslation()
  const { successToast, errorToast } = useCustomToast()

  const [isLoading, setIsLoading] = useState(false)

  const [name1, setName1] = useState({ label: "", value: "" })
  const [name2, setName2] = useState({ label: "", value: "" })
  const [name3, setName3] = useState({ label: "", value: "" })
  const [spliter, setSpliter] = useState({ label: "", value: "" })
  const [dataSwitch, setDataSwitch] = useState({})

  const dataRef = useRef(null)

  const spliters = [
    {
      label: "/",
      value: "s",
    },
    {
      label: "-",
      value: "h",
    },
    {
      label: "_",
      value: "u",
    },
    {
      label: t("mail.mail_autosetting_spliter_b"),
      value: "b",
    },
    {
      label: t("mail.mail_autosetting_spliter_bu"),
      value: "bu",
    },
  ]

  const originOption1 = [
    {
      label: t("common.hr_pri_name"),
      value: "n",
    },
    {
      label: t("common.approval_user_post"),
      value: "g",
    },
    {
      label: t("common.org_user_rank"),
      value: "p",
    },
  ]
  const [optionGroup1, setOptionGroup1] = useState(originOption1)

  const originOption2 = [
    {
      label: t("common.approval_formcode_useNo"),
      value: "",
    },
    {
      label: t("common.hr_pri_name"),
      value: "n",
    },
    {
      label: t("common.approval_user_post"),
      value: "g",
    },
    {
      label: t("common.org_user_rank"),
      value: "p",
    },
  ]
  const [optionGroup2, setOptionGroup2] = useState(originOption2)
  const [optionGroup3, setOptionGroup3] = useState(originOption2)

  // Handle data when selecting option 1
  const handleChangeName1 = async (name1, reload) => {
    const newOption2 = [...originOption2]
    const newOption3 = [...originOption2]

    newOption2?.forEach((option, key) => {
      if (option.value === name1.value) {
        newOption2?.splice(key, 1)
      }
    })

    newOption3?.forEach((option, key) => {
      if (option.value === name1.value) {
        newOption3?.splice(key, 1)
      }
    })

    if (typeof reload === "undefined" && reload !== true) {
      setName2(originOption2?.find((item) => item.value === ""))
      setName3(originOption2?.find((item) => item.value === ""))
    }

    setOptionGroup2(newOption2)
    setOptionGroup3(newOption3)
  }

  // Handle data when selecting option 2 and 3
  const handleChangeName2 = async (name1, name2, reload) => {
    if (name2.value !== "") {
      const newOption3 = [...originOption2]

      newOption3?.forEach((option, key) => {
        if (option.value === name2.value) {
          newOption3?.splice(key, 1)
        }
      })

      newOption3?.forEach((option, key) => {
        if (option.value === name1.value) {
          newOption3?.splice(key, 1)
        }
      })

      if (typeof reload === "undefined" && reload !== true) {
        setName3(originOption2?.find((item) => item.value === ""))
      }

      setOptionGroup3(newOption3)
    }
  }

  // Handle data
  const handleData = (data = {}) => {
    const a = data.setname?.split("")

    let name1 = ""
    let name2 = ""
    let name3 = ""
    if (typeof a[0] !== "undefined" && a[0] !== "") {
      name1 = originOption1?.find((item) => item.value === a[0])
      setName1(name1)
    }
    if (typeof a[1] !== "undefined" && a[1] !== "") {
      name2 = originOption2?.find((item) => item.value === a[1])
      setName2(name2)
    } else {
      name2 = originOption2?.find((item) => item.value === "")
      setName2(name2)
    }
    if (typeof a[2] !== "undefined" && a[2] !== "") {
      name3 = originOption2?.find((item) => item.value === a[2])
      setName3(name3)
    } else {
      name3 = originOption2?.find((item) => item.value === "")
      setName3(name3)
    }

    setSpliter(spliters?.find((item) => item.value === data.spliter))

    handleChangeName1(name1, true)
    handleChangeName2(name1, name2, true)

    setDataSwitch({
      ...dataSwitch,
      usealiasaddr: data.setlists.isaliasaddr,
      usewhiteaddr: data.setlists.iswhiteaddr,
      useshareaddr: data.setlists.isshareaddr,
      usemyaddr: data.setlists.ismyaddr,
      usepublicaddr: data.setlists.ispublicaddr,
      usegroupaddr: data.setlists.isgroupaddr,
    })
  }

  // Get data from API
  const getAutoCompleteData = async () => {
    setIsLoading(true)
    try {
      const res = await emailGet([URL_AUTOCOMPLETE, "info"].join("/"))
      handleData(res)
      dataRef.current = { ...res }
      setIsLoading(false)
    } catch (err) {
      errorToast()
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getAutoCompleteData()
  }, [])

  // Handle save setting
  const handleSave = async (e, name1, name2, name3, spliter, dataSwitch) => {
    setIsLoading(true)

    if (e && e.preventDefault) {
      e.preventDefault()
    }

    try {
      const params = {
        name1: name1.value,
        name2: name2.value,
        name3: name3.value,
        name: [name1.value, name2.value, name3.value].join(""),
        spliter: spliter.value,
        usealiasaddr: dataSwitch.usealiasaddr ? "y" : "n",
        usewhiteaddr: dataSwitch.usewhiteaddr ? "y" : "n",
        useshareaddr: dataSwitch.useshareaddr ? "y" : "n",
        usemyaddr: dataSwitch.usemyaddr ? "y" : "n",
        usepublicaddr: dataSwitch.usepublicaddr ? "y" : "n",
        usegroupaddr: dataSwitch.usegroupaddr ? "y" : "n",
      }
      const res = await emailPost(
        [URL_AUTOCOMPLETE, "set"].join("/"),
        formDataUrlencoded(params),
        Headers,
      )
      if (res.result === "true") {
        successToast()
        getAutoCompleteData()
      }
      setIsLoading(false)
    } catch (err) {
      errorToast()
      setIsLoading(false)
    }
  }

  // Handle reset setting
  const handleReset = () => {
    handleData(dataRef.current)
  }

  const DataBaseToggle = {
    data: [
      {
        id: "1",
        title: t("mail.mail_autosetting_usealiasaddr"),
        tooltip: t("mail.mail_auto_setting_usealias_warning"),
        value: "usealiasaddr",
      },
      {
        id: "2",
        title: t("mail.mail_autosetting_usewhiteaddr"),
        tooltip: t("mail.mail_auto_setting_usewhite_warning"),
        value: "usewhiteaddr",
      },
      {
        id: "3",
        title: t("mail.mail_autosetting_useshareaddr"),
        tooltip: t("mail.mail_autosetting_useshareaddr_warning"),
        value: "useshareaddr",
      },
      {
        id: "4",
        title: t("mail.mail_autosetting_usemyaddr"),
        tooltip: t("mail.mail_autosetting_usemyaddr_warning"),
        value: "usemyaddr",
      },
      {
        id: "5",
        title: t("mail.mail_autosetting_usepublicaddr"),
        tooltip: t("mail.mail_autosetting_usegroupaddr_warning"),
        value: "usepublicaddr",
      },
      {
        id: "6",
        title: t("mail.mail_autosetting_usegroupaddr"),
        tooltip: t("mail.mail_autosetting_usepublicaddr_warning"),
        value: "usegroupaddr",
      },
    ],
  }

  const renderListToggle = useMemo(() => {
    return (
      <>
        {DataBaseToggle.data.length > 0 &&
          DataBaseToggle.data.map((item) => (
            <Row key={item.id}>
              <ToggleSwitch
                col="9"
                title={
                  <div className="d-flex align-items-center justify-content-left gap-2 m-auto ">
                    <div>{item.title}</div>
                    <div>
                      <HanTooltip
                        placement="top"
                        overlay={<div className="w-100">{item.tooltip}</div>}
                        overlayClassName="max-width-tooltip"
                      >
                        <i className="mdi mdi-information-outline font-size-15 text-muted"></i>
                      </HanTooltip>
                    </div>
                  </div>
                }
                checked={dataSwitch[item.value]}
                onChange={() =>
                  setDataSwitch({
                    ...dataSwitch,
                    [item.value]: !dataSwitch[item.value],
                  })
                }
              />
            </Row>
          ))}
      </>
    )
  }, [DataBaseToggle.data])

  return (
    <>
      <MainHeader currentTitleMenu={t(routeConfig?.keyTitle)} />
      <Tooltip
        content={
          <div className="d-flex flex-column gap-2">
            <span dangerouslySetInnerHTML={{ __html: t("mail.mail_auto_setting_example_memo") }} />
            <div className="d-flex align-items-start gap-2">
              <span
                dangerouslySetInnerHTML={{ __html: t("mail.mail_auto_setting_example") + ": " }}
              />
              <img src={autoCompleteImage} alt="" />
            </div>
          </div>
        }
      />
      <div className={`w-100 h-100 overflow-hidden overflow-y-auto`}>
        {isLoading ? (
          <div className="position-relative">
            <Loading />
          </div>
        ) : (
          <>
            {/* --- Content -> Format List --- */}
            <div className="mt-2 mx-0">
              <Row>
                <Col lg="12">
                  <FormGroup className="mb-4" row>
                    <Label htmlFor="taskname" className="col-form-label col-lg-3">
                      <div className="container p-0">
                        <div>{t("mail.mail_auto_setting_format")}</div>
                      </div>
                    </Label>

                    <Col lg="9">
                      <div className="d-flex gap-2 justify-content-left ml-negative-2">
                        <Select
                          value={name1}
                          onChange={(option) => {
                            if (option.value !== name1.value) {
                              setName1(option)
                              handleChangeName1(option)
                            }
                          }}
                          options={optionGroup1}
                          className="select2-selection w-100"
                        />
                        <Select
                          value={spliter}
                          onChange={(option) => setSpliter(option)}
                          options={spliters}
                          className="select2-selection w-100"
                        />
                        <Select
                          value={name2}
                          onChange={(option) => {
                            if (option.value !== name2.value) {
                              setName2(option)
                              handleChangeName2(name1, option)
                            }
                          }}
                          options={optionGroup2}
                          className="select2-selection w-100"
                        />
                        <Select
                          value={spliter}
                          onChange={(option) => setSpliter(option)}
                          options={spliters}
                          className="select2-selection w-100"
                          isDisabled={true}
                        />
                        <Select
                          value={name3}
                          onChange={(option) => setName3(option)}
                          options={optionGroup3}
                          className="select2-selection w-100"
                        />
                      </div>
                    </Col>
                  </FormGroup>
                </Col>
              </Row>
            </div>

            {/* --- Content -> Switch List --- */}
            {renderListToggle}

            {/* --- Footer --- */}
            <div className="d-flex justify-content-center">
              <BaseButton
                color="primary"
                className="me-2"
                onClick={(e) => handleSave(e, name1, name2, name3, spliter, dataSwitch)}
              >
                {t("mail.mail_set_autosplit_save")}
              </BaseButton>
              <BaseButton color="grey" className={"btn-action"} onClick={handleReset}>
                {t("mail.project_reset_msg")}
              </BaseButton>
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default AutoComplete
