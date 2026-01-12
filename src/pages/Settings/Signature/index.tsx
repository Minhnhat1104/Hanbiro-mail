// @ts-nocheck
// React
import React, { useEffect, useState } from "react"

// Third-party
import { useTranslation } from "react-i18next"
import { Card, Col, Row } from "reactstrap"

// Project
import Title from "components/SettingAdmin/Title/index"
import { Dialog } from "components/Common/Dialog"
import Loading from "components/Common/Loading"
import { useCustomToast } from "hooks/useCustomToast"
import { emailGet } from "helpers/email_api_helper"
import {
  URL_SIGNATURE_INFO,
  URL_SIGNATURE_USE_LINE,
} from "modules/mail/settings/urls"

import SignatureToolbar from "./SignatureHeader"
import SignatureItem from "./SignatureItem"
import AddModal from "./AddModal"
import PositionModal from "./PositionModal"
import PreviewModal from "./PreviewModal"

import "./style.scss"
import MainHeader from "pages/SettingMain/MainHeader"
import Toolbar from "../../SettingMain/Toolbar"

const Signature = (props) => {
  const { routeConfig } = props
  const { t } = useTranslation()
  const { errorToast } = useCustomToast()

  const [radioValue, setRadioValue] = useState(1)
  const [items, setItems] = useState([])
  const [fData, setFData] = useState({ isDefault: false, orgmsg: "" })
  const [useLine, setUseLine] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [checkData, setCheckData] = useState({ lists: [], isCheckAll: false })

  const [isEdit, setIsEdit] = useState({ edit: false, item: {} })
  const [openAddModal, setOpenAddModal] = useState(false)
  const [openPositionModal, setOpenPositionModal] = useState(false)
  const [previewModal, setPreviewModal] = useState({ open: false, item: {} })

  // Handle open/close modal
  const handleAddModal = () => {
    setOpenAddModal(!openAddModal)
    setRadioValue(1)
    setIsEdit({ edit: false, item: {} })
  }
  const handlePositionModal = () => setOpenPositionModal(!openPositionModal)
  const handlePreviewModal = (item = {}) =>
    setPreviewModal({ open: !previewModal.open, item: item })

  // Call API to get signature list
  const getSignatureList = async () => {
    setIsLoading(true)
    setCheckData({ lists: [], isCheckAll: false })
    setFData({ isDefault: false, orgmsg: "" })
    try {
      const sortType = "desc"
      const res = await emailGet([URL_SIGNATURE_INFO, sortType].join("/"))
      if (res && res.siglist) {
        if (Object.keys(res.siglist)?.length) {
          // setFData({ orgmsg: res.default.orgmsg })
          setFData(prevData => ({ ...prevData, orgmsg: res.default.orgmsg }))
          const newItems = Object.entries(res.siglist)?.map(([key, value]) => {
            if (value.uid.indexOf("sigpic") !== -1) {
              value.type = "sigpic"
            } else {
              value.type = "sightml"
            }
            if (value.default) {
              setFData(prevData => ({ ...prevData, isDefault: true }))
            }
            return value
          })
          setItems(newItems)
        } else {
          setItems([])
        }
      }
      setIsLoading(false)
    } catch (err) {
      errorToast()
      setIsLoading(false)
    }
  }

  // Call API to get signature use line
  const getSignatureUseLine = async () => {
    setIsLoading(true)
    try {
      const res = await emailGet(URL_SIGNATURE_USE_LINE)
      if (res) setUseLine(res.lineuse)
      setIsLoading(false)
    } catch (err) {
      errorToast()
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getSignatureList()
    getSignatureUseLine()
  }, [])

  // Handle Checked Signature
  const handleCheckSignature = (e, item) => {
    if (e.target.checked) {
      setCheckData({
        lists: [...checkData.lists, item.uid],
        isCheckAll: checkData.isCheckAll,
      })
    } else {
      if (checkData.lists.length > 0) {
        setCheckData({
          lists: checkData.lists?.filter(uid => uid !== item.uid),
          isCheckAll: checkData.isCheckAll,
        })
      }
    }
  }

  /**
   * @description Show action modal when clicking on button
   * */
  const [actionModal, setActionModal] = useState({
    isOpen: false,
    title: t("mail.mail_log_action"),
    content: t("mail.common_confirm_continue"),
    buttons: [],
    centered: false,
    toggle: () => {
    },
  })
  const handleActionModal = (
    type = t("mail.mail_log_action"),
    content = t("mail.common_confirm_continue"),
    actionCallback,
    ...args
  ) => {
    setActionModal({
      ...actionModal,
      isOpen: true,
      title: type,
      content: content,
      toggle: () => setActionModal({ ...actionModal, isOpen: false }),
      buttons: [
        {
          text: t("mail.mail_view_continue_msg"),
          onClick: () => {
            actionCallback?.(...args)
            setActionModal({ ...actionModal, isOpen: false })
          },
          color: "primary",
        },
        {
          text: t("common.common_cancel"),
          onClick: () => {
            setActionModal({ ...actionModal, isOpen: false })
          },
        },
      ],
    })
  }

  return (
    <>
      {/* --- Title --- */}
      <MainHeader currentTitleMenu={t(routeConfig?.keyTitle)} />
      {/*<Toolbar*/}
      {/*  start={}*/}
      {/*  end={}*/}
      {/*/>*/}
      {/* --- Toolbar --- */}
      <SignatureToolbar
        loading={isLoading}
        fData={fData}
        checkData={checkData}
        useLine={useLine}
        handleAdd={handleAddModal}
        handlePosition={handlePositionModal}
        getSignatureList={getSignatureList}
        getSignatureUseLine={getSignatureUseLine}
      />
      <div className={`w-100 h-100 overflow-hidden`}>
        {/* --- Content --- */}
        {isLoading ? (
          <div className="py-5 position-relative">
            <div className="position-absolute top-50 start-50 translate-middle">
              <Loading />
            </div>
          </div>
        ) : (
          <Row className="card-list mx-0 overflow-y-auto">
            {items.length > 0 && items.map((item, key) => (
              <React.Fragment key={item.uid}>
                <SignatureItem
                  item={item}
                  index={key + 1}
                  handleCheckSignature={handleCheckSignature}
                  handlePreviewModal={handlePreviewModal}
                  getSignatureList={getSignatureList}
                  handleEdit={item => {
                    setOpenAddModal(!openAddModal)
                    setIsEdit({ edit: true, item: item })
                  }}
                  handleActionModal={handleActionModal}
                />
              </React.Fragment>
            ))}
          </Row>
        )}

        {/* --- Add/Write modal --- */}
        <AddModal
          open={openAddModal}
          isEdit={isEdit}
          radioValue={radioValue}
          handleCheckedImage={() => setRadioValue(1)}
          handleCheckedText={() => setRadioValue(2)}
          getSignatureList={getSignatureList}
          handleClose={handleAddModal}
        />

        {/* --- Change Position Modal --- */}
        <PositionModal
          open={openPositionModal}
          handleClose={handlePositionModal}
          items={items}
          fData={fData}
        />

        {/* --- Preview Modal --- */}
        <PreviewModal
          previewData={previewModal}
          handleClose={handlePreviewModal}
        />
      </div>

      {/* Action Modal */}
      <Dialog {...actionModal} />
    </>
  )
}

export default Signature
