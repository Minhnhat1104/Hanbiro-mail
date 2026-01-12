// @ts-nocheck
import { BaseButton, BaseModal } from "components/Common"
import { DOWNLOAD_APP } from "constants/download-app"
import React, { memo, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import "./styles.scss"

const DownloadCode = (props) => {
  const [isShow, setIsShow] = useState(false)
  const { t } = useTranslation()

  const renderHeader = () => {
    return <span className="modal-title fw-bold text-uppercase text-center">QR CODE SCANNER</span>
  }
  const renderBody = () => {
    return (
      <>
        <div className="row" onClick={() => setIsShow(true)}>
          <div className="col-6 text-center d-flex flex-column">
            <img src={DOWNLOAD_APP.qrCode.chPlay} alt="mail-app-android"></img>
            <span className="text-uppercase han-text-primary mt-2 fw-bold">Android</span>
          </div>
          <div className="col-6 text-center d-flex flex-column">
            <img src={DOWNLOAD_APP.qrCode.appStore} alt="mail-app-ios"></img>
            <span className="text-uppercase han-text-primary mt-2 fw-bold">IOS</span>
          </div>
        </div>

        <div className="text-center han-text-primary mt-3">
          Please, select a version suitable for your device!
        </div>
        <div className="text-center han-text-secondary mt-2">Hold the camera to the image</div>
      </>
    )
  }

  const renderFooter = () => {
    return (
      <BaseButton outline color="grey" onClick={() => setIsShow(false)}>
        {t("common.common_close_msg")}
      </BaseButton>
    )
  }

  return (
    <>
      <div className="download-app w-100 row p-0 m-0">
        <span className="col-12 py-2 px-2">Download APP</span>
        <div className="col-12 px-2">
          <div className="row cursor-pointer" onClick={() => setIsShow(true)}>
            <img src={DOWNLOAD_APP.images.chPlay} className="col-6" alt="Image" />
            <img src={DOWNLOAD_APP.images.appStore} className="col-6" alt="Image" />
          </div>
        </div>
      </div>
      <BaseModal
        size="lg"
        open={isShow}
        toggle={() => setIsShow(!isShow)}
        renderHeader={renderHeader}
        renderBody={renderBody}
        renderFooter={renderFooter}
        style={{ width: "600px", fontSize: "13px" }}
      />
    </>
  )
}

export default DownloadCode
