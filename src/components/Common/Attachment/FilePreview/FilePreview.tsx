// @ts-nocheck
import React, { useEffect, useState } from "react"

import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer"
import { useTranslation } from "react-i18next"

import BaseButton from "components/Common/BaseButton"
import BaseModal from "components/Common/BaseModal"
import Loading from "components/Common/Loading"
import { useCustomToast } from "hooks/useCustomToast"
import { getBaseUrl, isVideoFile } from "utils"
import { get } from "helpers/api_helper"

import "./style.scss"

const FilePreview = ({ file, isOpen, handleClose, isLocalFile, isShareMenu, menu }) => {
  const { t } = useTranslation()
  const { successToast, errorToast } = useCustomToast()

  const [DocView, setDocView] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) setDocView(null)
  }, [isOpen])

  useEffect(() => {
    if (file) {
      if (isLocalFile) {
        const url = URL.createObjectURL(file.file)
        setDocView(
          <DocViewer
            documents={[
              {
                uri: url,
                fileName: file.orgname,
              },
            ]}
            pluginRenderers={DocViewerRenderers}
          />,
        )
      } else {
        setIsLoading(true)
        if (isVideoFile(file.name)) {
          setIsLoading(false)
          setDocView(
            <video
              style={{ margin: "0 auto", display: "block" }}
              controls
              autoPlay
              name="media"
              preload="auto"
              width="80%"
              height="auto"
            >
              <source src={getBaseUrl() + file.link} type="video/mp4" />
            </video>,
          )
        } else {
          get(
            `${getBaseUrl()}${file.preview || file.preview2 || file.preview3}${
              isShareMenu ? menu : ""
            }`,
          )
            .then((data) => {
              if (data.URI) {
                get(getBaseUrl() + data.URI)
                  .then((data) => {
                    setIsLoading(false)
                    setDocView(
                      <div
                        // className="d-flex scroll-box flex-column align-items-center"
                        className="d-flex flex-column align-items-center"
                      >
                        <div
                          className=""
                          style={{ width: "-webkit-fill-available" }}
                          dangerouslySetInnerHTML={{
                            __html: data.replaceAll('src="/', 'src="' + getBaseUrl() + "/"),
                          }}
                        ></div>
                      </div>,
                    )
                  })
                  .catch(() => {
                    errorToast("Failed")
                  })
                  .finally(() => {
                    setIsLoading(false)
                  })
              } else {
                setIsLoading(false)
                setDocView(
                  <div
                    // className="d-flex scroll-box flex-column align-items-center"
                    className="d-flex flex-column align-items-center"
                  >
                    <div
                      className=""
                      style={{ width: "-webkit-fill-available" }}
                      dangerouslySetInnerHTML={{ __html: data }}
                    ></div>
                  </div>,
                )
              }
            })
            .catch(() => {
              errorToast("Failed")
            })
            .finally(() => {
              setIsLoading(false)
            })
        }
      }
    }
  }, [file, isLocalFile])

  return (
    <>
      {isLoading && <Loading className="p-0" />}
      <BaseModal
        isOpen={isOpen && !isLoading && !!DocView}
        size="auto"
        modalClass="base-file-preview-modal"
        // bodyClass=" h-100"
        bodyClass="base-file-preview-modal-scroll"
        contentClass="auto-size-modal"
        toggle={() => handleClose()}
        renderHeader={() => <>{t("common.board_office_preview_msg")}</>}
        renderBody={() => <div className="h-100 w-100">{DocView}</div>}
        renderFooter={() => (
          <BaseButton className="btn btn-dark" onClick={() => handleClose()}>
            {t("common.common_btn_close")}
          </BaseButton>
        )}
        centered
      />
    </>
  )
}

export default FilePreview
