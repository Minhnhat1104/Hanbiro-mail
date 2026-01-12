// @ts-nocheck
// React
import React, { useEffect, useMemo, useRef, useState } from "react"

// Third-party
import { useTranslation } from "react-i18next"
import { Alert } from "reactstrap"
import ReactDragListView from "react-drag-listview"

// Project
import { BaseButton, BaseModal } from "components/Common"
import { useCustomToast } from "hooks/useCustomToast"
import { Headers, emailPut } from "helpers/email_api_helper"
import { URL_SIGNATURE_INFO } from "modules/mail/settings/urls"
import Loading from "components/Common/Loading"

import "./style.scss"

const PositionModal = ({ open = true, handleClose = () => {}, items = [], fData = {} }) => {
  const { t } = useTranslation()
  const { successToast, errorToast } = useCustomToast()

  // State
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // Ref
  const dataRef = useRef(null)

  useEffect(() => {
    if (items.length > 0 && fData.orgmsg !== "") {
      const newItems = fData?.orgmsg
        ?.split("|")
        ?.map((uid) => {
          return items?.find((item) => item?.uid === uid)
        })
        ?.filter((item) => item !== null && item !== undefined)
      if (newItems?.length > 0) {
        setData(newItems)
        dataRef.current = [...newItems]
      }
    }
  }, [items, fData])

  const onDragEnd = (fromIndex, toIndex) => {
    setData((prev) => {
      const nextData = [...prev]
      const nToIndex = toIndex !== -1 ? toIndex : nextData.length - 1
      const item = nextData?.splice(fromIndex, 1)[0]
      nextData?.splice(nToIndex, 0, item)
      return nextData
    })
  }

  // Handle Save Modal
  const handleSaveModal = async (data) => {
    setIsLoading(true)
    const newData = data?.map((item) => item?.uid)?.join("|")

    try {
      const res = await emailPut(
        URL_SIGNATURE_INFO,
        {
          mode: "order",
          dsig: newData,
        },
        Headers,
      )
      if (res.result) {
        successToast()
        setIsLoading(false)
        handleClose()
        dataRef.current = [...data]
      }
    } catch (err) {
      errorToast()
      setIsLoading(false)
    }
  }

  const renderBody = useMemo(() => {
    return (
      <div className="position-relative">
        <Alert color="warning" className="m-0">
          <i className="mdi mdi-bullhorn"></i> {t("mail.mail_signature_change_position_info_msg")}
        </Alert>

        <ReactDragListView.DragColumn
          onDragEnd={onDragEnd}
          ignoreSelector="react-resizable-handle"
          enableScroll={true}
          nodeSelector="li"
          handleSelector="a"
        >
          <ul className="p-0 m-0 position-list">
            {data?.length > 0 &&
              data?.map((item) =>
                item?.default ? (
                  <li
                    key={item?.uid}
                    id={item?.uid}
                    className={`list-group-item mt-3 border rounded p-2 position-item ${
                      item.default && "card-item-used"
                    }`}
                  >
                    <a
                      href="#"
                      className="cursor-grabbing"
                      onClick={(event) => {
                        event.preventDefault()
                        event.stopPropagation()
                      }}
                    >
                      <p className="mb-0 text-center">
                        {t("mail.mail_signature_btn_change_position")}
                      </p>
                      {item?.type === "sigpic" ? (
                        <div
                          className="position-drag-image"
                          dangerouslySetInnerHTML={{
                            __html: "<br/>" + item?.contents,
                          }}
                        />
                      ) : (
                        <div
                          className="text-muted d-block h-100 w-100 position-drag"
                          dangerouslySetInnerHTML={{
                            __html: item?.contents,
                          }}
                        />
                      )}
                    </a>
                  </li>
                ) : null,
              )}
          </ul>
        </ReactDragListView.DragColumn>

        {isLoading && (
          <div className="position-absolute top-50 start-50 translate-middle">
            <Loading />
          </div>
        )}
      </div>
    )
  }, [data, isLoading])

  return (
    <BaseModal
      open={open}
      toggle={() => {
        handleClose()
        setData(dataRef.current)
      }}
      renderHeader={() => <>{t("mail.mail_signature_btn_change_position")}</>}
      renderBody={renderBody}
      renderFooter={() => (
        <>
          <BaseButton
            type="button"
            className="st-sg-modal-btn-save"
            color="primary"
            onClick={() => handleSaveModal(data)}
          >
            {t("mail.mail_view_save")}
          </BaseButton>
          <BaseButton
            outline
            type="button"
            className="st-sg-modal-btn-cancel"
            color="grey"
            onClick={() => {
              handleClose()
              setData(dataRef.current)
            }}
          >
            {t("mail.mail_write_discard")}
          </BaseButton>
        </>
      )}
      footerClass="d-flex align-items-center justify-content-center"
      bodyClass="position-scroll-box"
      size={"xl"}
      centered
    />
  )
}

export default PositionModal
