// @ts-nocheck
import { useTranslation } from "react-i18next"

import { useEffect, useState } from "react"

import "./styles.scss"
import { Button, Spinner } from "reactstrap"
import { getCurrentVersion } from "utils/version"
import useLocalStorage from "hooks/useLocalStorage"
import { useSelector } from "react-redux"
import useDevice from "hooks/useDevice"

const LOCALSTORAGE_SETTINGS = "persist:hanbiro"

const INTERVAL_30_MIN = 30 * 60 * 1000

const UpdateVersionPopup = () => {
  const { t } = useTranslation()
  const { isMobile } = useDevice()
  const [appVersion, setAppVersion] = useLocalStorage("hanbiro.mail.version", null)
  const [openUpdate, setOpenUpdate] = useState(false)

  const isIframeMode = useSelector((state) => state.viewMode.isIframeMode)

  const checkUpdate = () => {
    const currentVersion = getCurrentVersion()
    if (!appVersion) {
      setAppVersion(currentVersion)
    } else {
      if (currentVersion !== appVersion) {
        if (isIframeMode) {
          window.parent.postMessage({ type: "HanbiroUpdateVersion", fromApp: "mail" }, "*")
        } else {
          setOpenUpdate(true)
        }
        setAppVersion(currentVersion)
      }
    }
  }

  useEffect(() => {
    checkUpdate()
    const checkVersion = setInterval(() => {
      checkUpdate()
    }, INTERVAL_30_MIN)

    return () => clearInterval(checkVersion)
  }, [])

  return (
    <>
      {openUpdate && (
        <div className={`update-popup ${isMobile ? "vw-100 end-0 bottom-0" : ""}`}>
          <div className="d-flex">
            {/* <div className="loading-update d-flex justify-content-center align-items-center">
              <Spinner color="primary"></Spinner>
            </div> */}
            <div className="d-flex flex-column">
              <span className="mb-3">{t("common.alert_new_update_version_msg")}</span>
              <div className="d-flex justify-content-end">
                <Button
                  className="me-2"
                  color="primary"
                  onClick={() => {
                    setOpenUpdate(false)
                    localStorage.removeItem(LOCALSTORAGE_SETTINGS)
                    location.reload()
                  }}
                >
                  {t("common.notice_header_update")}
                </Button>
                <Button outline color="grey" onClick={() => setOpenUpdate(false)}>
                  {t("common.common_cancel")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default UpdateVersionPopup
