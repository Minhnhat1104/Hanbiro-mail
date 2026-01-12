// @ts-nocheck
import { useContext, useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"

import { getSignatureDetail, getSignatureInfo } from "modules/mail/compose/api"

import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from "reactstrap"

import { ComposeContext } from "components/Common/ComposeMail/index"
import HanTooltip from "components/Common/HanTooltip"
import { emailGet, Headers } from "helpers/email_api_helper"
import { applyDefaultFont, getDataFromHtml } from "./utils"

const Signature = (props) => {
  const { t } = useTranslation()
  const { modeType, isInitSuccess, editorValue, setSignature } = useContext(ComposeContext)

  const [openSignature, setOpenSignature] = useState(false)
  const [defaultSigPublic, setDefaultSigPublic] = useState("")
  const [sigList, setSigList] = useState()
  const [sigOptions, setSigOptions] = useState([])
  const [selectedSig, setSelectedSig] = useState()

  useEffect(() => {
    loadData()
  }, [])

  // Handle get signature from api get signature
  useEffect(() => {
    if (modeType !== "") {
      if (isInitSuccess && modeType !== "resend" && modeType !== "edit") {
        getSignature()
      }
    } else {
      getSignature()
    }
  }, [selectedSig, isInitSuccess])

  const getSignature = () => {
    let signature = ""
    if (selectedSig) {
      getSignatureDetail(selectedSig).then((res) => {
        signature = res?.data || ""
        signature = applyDefaultFont(signature)
        // console.log("signature:", signature)
        setSignature(signature)
      })
    } else {
      emailGet(`email/writeform/default`, undefined, Headers).then((res) => {
        signature = res?.data || ""
        signature = applyDefaultFont(signature)
        setSignature(signature)
      })
    }
  }

  function loadData() {
    getSignatureInfo().then((res) => {
      if (res) {
        if (res?.public_use === true) {
          setDefaultSigPublic(getDataFromHtml(res?.publist?.sigpublic01?.contents))
        }
        if (res?.siglist && Object.keys(res.siglist).length) {
          const _defaultObj = {
            contents: "",
            ctime: Math.floor(Date.now() / 1000),
            default: true,
            name: "Default",
            uid: "default",
            type: "default",
          }
          const _items = [
            {
              name: _defaultObj["name"],
              value: _defaultObj["uid"],
              type: _defaultObj["type"],
            },
          ]
          const newSigList = Object.keys(res.siglist).reduce((acc, key) => {
            acc[key] = {
              ...res.siglist[key],
              contents: getDataFromHtml(res.siglist[key].contents),
            }
            return acc
          }, {})
          // const _siglist = { ...res.siglist }
          const _siglist = { ...newSigList }
          _siglist["default"] = { ..._defaultObj }

          for (const key in res.siglist) {
            const value = res.siglist[key]

            if (value.uid.indexOf("sigpic") != -1) {
              value.type = "sigpic"
            } else {
              value.type = "sightml"
            }

            _items.push({
              name: value.name + `(${value.uid})`,
              value: value.uid,
              type: value.type,
            })
          }

          setSelectedSig(_defaultObj.uid)
          setSigList(_siglist)
          setSigOptions(_items)
        }
      }
    })
  }

  return (
    <>
      <HanTooltip placement="top" overlay={t("mail.mail_preference_signature")}>
        <UncontrolledDropdown
          toggle={() => setOpenSignature(!openSignature)}
          isOpen={openSignature}
        >
          <DropdownToggle outline className={`compose-option-btn ${openSignature ? "active" : ""}`}>
            <i className="mdi mdi-pen fs-5"></i>{" "}
            <i className={`mdi mdi-chevron-${openSignature ? "up" : "down"}`}></i>
          </DropdownToggle>

          <DropdownMenu className="mt-2 box-shadow-lg">
            {sigOptions.map((_opt) => (
              <DropdownItem
                key={`opt-${_opt.name}`}
                className="px-3"
                onClick={() => {
                  setSelectedSig(_opt.value)
                }}
              >
                <div className="d-flex justify-content-between">
                  <span>{_opt.name}</span>

                  {selectedSig === _opt.value && <i className="mdi mdi-check" />}
                </div>
              </DropdownItem>
            ))}
          </DropdownMenu>
        </UncontrolledDropdown>
      </HanTooltip>
    </>
  )
}

export default Signature
