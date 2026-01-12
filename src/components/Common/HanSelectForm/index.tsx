// @ts-nocheck
import clsx from "clsx"
import { Row, Col } from "reactstrap"
import React, { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { ICON_NO_DATA } from "./iconNoData"
import "./style.scss"
import { ORG_CONFIG_SELECT_FORM, optimizeDepartments } from "./utils"
import Form from "./Form"
import ItemTree from "../Org/HanOrganizationNew/RenderTree"
import BaseModal from "../BaseModal"
import SearchInput from "../SearchInput"
import { useCustomToast } from "hooks/useCustomToast"
import useDevice from "hooks/useDevice"

const FormList = ({ forms, formChoosed, setFormChoosed, handleSave }) => {
  const [hover, setHover] = useState("")

  return (
    <div className="h-100">
      <ul className="h-100 wrap-content list-unstyled">
        {forms.length == 0 ? (
          <div className="h-100 view-no-data">{ICON_NO_DATA}</div>
        ) : (
          forms.map((item, index) => {
            return (
              <li
                key={index}
                className="wd-100p item-form ps-3 py-2"
                onClick={() => setFormChoosed(item)}
                style={{
                  backgroundColor:
                    formChoosed.no == item.no || hover === item?.no ? "#eef0f7" : "white",
                }}
                onMouseEnter={() => setHover(item?.no)}
                onMouseLeave={() => setHover("")}
              >
                <Form
                  name={item.name}
                  extension={item.ctype}
                  onClick={() => {
                    setFormChoosed(item)
                    handleSave()
                  }}
                  isHover={hover === item?.no}
                  formNo={item?.no}
                />
              </li>
            )
          })
        )}
      </ul>
    </div>
  )
}

function HanFormSelect({ open, handleClose = () => {}, onSave = () => {} }) {
  const { t } = useTranslation()
  const { errorToast } = useCustomToast()
  const { isTablet } = useDevice()

  const [departments, setDepartments] = useState([])
  const [firstLoading, setFirstLoading] = useState(true)
  const [folderChoosed, setFolderChoosed] = useState({})
  const [loading, setLoading] = useState(true)
  const [keyword, setKeyword] = useState("")
  const [configOrg, _] = useState(ORG_CONFIG_SELECT_FORM["category"])
  const [formsBackup, setFormsBackup] = useState([])
  const [forms, setForms] = useState([])
  const [formChoosed, setFormChoosed] = useState({})

  useEffect(() => {
    getOrg()
    handleChoose({ id: "a", isFolder: true })
  }, [configOrg])

  const onKeyDown = (e) => {
    getOrg()
  }

  const onChangeKeywordForm = (keywordForm) => {
    const newKeyword = keywordForm.toLowerCase()
    setForms(formsBackup.filter((item) => item.name.toLowerCase().includes(newKeyword)))
  }

  const getOrg = async () => {
    setFirstLoading(true)
    const params = configOrg.init.params({ keyword: keyword })
    const response = await configOrg.init.api(params)

    if (response && response.success) {
      const departmentModel = optimizeDepartments(response.rows)
      setDepartments(departmentModel)
    }
    setFirstLoading(false)
  }

  const handleChoose = (item) => {
    if (item.isFolder) {
      setFolderChoosed(item?.id)
      setLoading(true)
      configOrg.user.api({ category: item.id, "no-spread": "1" }).then((res) => {
        if (res.success) {
          setFormsBackup(res.rows)
          setForms(res.rows)
        }
        setLoading(false)
      })
    }
  }

  const innerHandleClose = () => {
    setFormChoosed({})
    handleClose()
  }

  const handleSave = (callback) => {
    if (!!!formChoosed?.no) {
      errorToast("Please choose a form")
      return
    }
    configOrg.user.api({ no: formChoosed.no, out: "html" }).then((res) => {
      if (res.success) {
        onSave(res?.rows)
        callback && callback()
      } else {
        errorToast(res?.message || "Error")
      }
    })
  }

  const renderContent = useMemo(() => {
    return (
      <ul className={clsx("ul", "ztree")}>
        {departments.map((department, index) => (
          <ItemTree
            key={index}
            isExpand={true}
            isSelectBox={false}
            isBottom={index == departments.length - 1}
            department={department}
            handleChoose={handleChoose}
            configOrg={configOrg}
            activeFolder={folderChoosed}
          />
        ))}
      </ul>
    )
  }, [departments, configOrg, folderChoosed])

  const renderLoading = useMemo(() => {
    return (
      <div className="h-100 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only"></span>
        </div>
      </div>
    )
  }, [])

  const renderOrg = useMemo(() => {
    return <div className="h-100">{firstLoading ? renderLoading : renderContent}</div>
  }, [firstLoading, departments, configOrg, folderChoosed])

  const renderFormList = useMemo(() => {
    return (
      <FormList
        forms={forms}
        formChoosed={formChoosed}
        setFormChoosed={setFormChoosed}
        handleSave={handleSave}
      />
    )
  }, [forms, formChoosed])

  const renderForm = useMemo(() => {
    return (
      <div className="content-email" style={{ height: "60vh", overflow: "auto" }}>
        {loading ? renderLoading : renderFormList}
      </div>
    )
  }, [loading, forms, formChoosed])

  const renderModalContent = () => {
    return (
      <Row className="gx-3 gy-md-3">
        <Col md={12} lg={6}>
          <div className="h-100 border">
            <div className="bd rounded">
              <div className="type-headline py-2 px-2 mb-3">
                <ul className="nav nav-line" id="myTab5" role="tablist">
                  <li className="nav-item">{t("common.approval_draft_doc_section")}</li>
                </ul>
              </div>

              <div className="search-form mb-3 px-3">
                <SearchInput
                  className="p-0"
                  onKeywordChange={(keywordOrg) => setKeyword(keywordOrg)}
                  onSubmit={onKeyDown}
                />
              </div>
              <div
                className="flex-grow-1 pd-l-10 pd-r-10 pd-b-10 content-tree px-4"
                style={{
                  height: "60vh",
                  overflow: "auto",
                }}
              >
                {renderOrg}
              </div>
            </div>
          </div>
        </Col>

        <Col md={12} lg={6}>
          <div className="h-100 border" style={{ paddingBottom: 10 }}>
            <div className="bd rounded">
              <div className="py-2 px-2 type-headline mb-3">
                <ul className="nav nav-line" id="myTab5" role="tablist">
                  <li className="nav-item">{t("common.approval_docu_formname")}</li>
                </ul>
              </div>
              <div className="search-form pd-b-15 pd-l-10 pd-r-10 pd-t-10 px-3 mb-2">
                <SearchInput
                  className="p-0"
                  onKeywordChange={(keywordForm) => onChangeKeywordForm(keywordForm)}
                />
              </div>
              <div className="">{renderForm}</div>
            </div>
          </div>
        </Col>
      </Row>
    )
  }

  return (
    <BaseModal
      size="lg"
      open={open}
      modalClass={isTablet ? "modal-w-80" : ""}
      renderHeader={() => <>{t("common.board_select_form_msg")}</>}
      renderBody={() => <div className="han-select-form-new">{renderModalContent()}</div>}
      renderFooter={() => (
        <>
          <button className={"btn btn-outline-primary"} onClick={innerHandleClose}>
            {t("common.board_cancel_msg")}
          </button>
          <button className={"btn btn-primary"} onClick={() => handleSave(innerHandleClose)}>
            {t("common.board_save")}
          </button>
        </>
      )}
      toggle={handleClose}
      bodyClass=""
      centered
    />
  )
}

export default HanFormSelect
