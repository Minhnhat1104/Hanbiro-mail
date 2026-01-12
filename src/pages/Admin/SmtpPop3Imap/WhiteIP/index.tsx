// @ts-nocheck
import { useEffect, useState } from "react"

import { useTranslation } from "react-i18next"
import { Col, Input } from "reactstrap"
import { useSelector } from "react-redux"
import { BaseButton, BaseIcon, Loading } from "components/Common"
import SelectMultiple from "components/SettingAdmin/SelectMultiple"
import Tooltip from "components/SettingAdmin/Tooltip"

import { useCustomToast } from "hooks/useCustomToast"
import { emailGet } from "helpers/email_api_helper"
import {
  SMTP_POP3_IMAP_WHITE_IP_LIST,
  SMTP_POP3_IMAP_WHITE_IP_ADD,
  SMTP_POP3_IMAP_WHITE_IP_DEL,
} from "modules/mail/admin/url"
import { selectUserConfig } from "store/auth/config/selectors"

const WhiteIP = (props) => {
  const { t } = useTranslation()
  const { successToast, errorToast } = useCustomToast()
  const userConfig = useSelector(selectUserConfig)

  const [frmData, setFrmData] = useState({
    part1: "",
    part2: "",
    part3: "",
    part4: "",
  })
  const [invalidData, setInvalidData] = useState({})
  const [refetch, setRefetch] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState({})

  useEffect(() => {
    setRefetch(true)
  }, [userConfig?.ip_address])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        const res = await emailGet(SMTP_POP3_IMAP_WHITE_IP_LIST)
        let newData = {}
        Object.keys(res?.whiteiplist).map((key) => {
          let item = res?.whiteiplist?.[key]
          newData[key] = {
            ip: item.ip,
            text: item.ip + " (" + item.countrycode + ")",
          }
        })

        setData(newData)
        setIsLoading(false)
      } catch (err) {
        console.log("error messenger", err)
      }
    }

    if (refetch) {
      fetchData()
      setRefetch(false)
    }
  }, [refetch])

  const addWhiteIp = async () => {
    let whiteIpError = {}
    let arrIp = []
    Object.keys(frmData).forEach(function (part) {
      if (frmData[part] === "") {
        whiteIpError[part] = true
      } else {
        arrIp.push(frmData[part])
      }
    })

    if (Object.keys(whiteIpError).length > 0) {
      setInvalidData(whiteIpError)
      return false
    }

    let ip = arrIp.join(".")
    const res = await emailGet([SMTP_POP3_IMAP_WHITE_IP_ADD, ip].join("/"))

    if (res?.success) {
      successToast()
      setRefetch(true)
      setFrmData({
        part1: "",
        part2: "",
        part3: "",
        part4: "",
      })
      setInvalidData({})
    } else {
      errorToast()
    }
  }

  const onDeleteIP = async (ipData) => {
    const res = await emailGet([SMTP_POP3_IMAP_WHITE_IP_DEL, ipData.ip].join("/"))

    if (res?.success) {
      successToast()
      setRefetch(true)
    } else {
      errorToast()
    }
  }

  const onHandleChangInput = (event, part) => {
    if (
      !(
        (event.keyCode >= 48 && event.keyCode <= 57) ||
        (event.keyCode >= 96 && event.keyCode <= 105)
      ) &&
      event.keyCode != 8
    ) {
      event.preventDefault()
      return false
    }

    let newFrmData = { ...frmData }
    if (event.keyCode == 8) {
      newFrmData[part] = newFrmData[part].substring(0, newFrmData[part].length - 1)
    } else {
      let currentValue = frmData?.[part]
      if (currentValue !== undefined && currentValue.length > 2) {
        event.preventDefault()
        return false
      }
      newFrmData[part] += event.key
    }
    setFrmData(newFrmData)
  }

  return (
    <div className="mt-2 table-list position-relative">
      <div className="d-flex justify-content-between mb-2">
        <div className="d-flex align-items-center">
          <span className={"me-2"}>IP:</span>
          {Object.keys(frmData).map((partIndex) => {
            return (
              <Col lg="1" className={"me-1"} key={"col-" + partIndex}>
                <Input
                  type="text"
                  key={"input-" + partIndex}
                  maxLength={3}
                  value={frmData?.[partIndex]}
                  onKeyUp={(e) => onHandleChangInput(e, partIndex)}
                  onChange={() => {}}
                  invalid={invalidData?.[partIndex]}
                />
              </Col>
            )
          })}
          <BaseButton
            color={"primary"}
            className={`m-0 border-0`}
            icon={`mdi mdi-plus font-size-18`}
            iconClassName={`m-0`}
            onClick={addWhiteIp}
            style={{ width: "38px", height: "38px" }}
          />
        </div>

        <BaseButton
          outline
          color={`grey`}
          className={`btn-outline-grey btn-action m-0`}
          icon={`mdi mdi-refresh font-size-18`}
          iconClassName={`m-0`}
          onClick={() => setRefetch(true)}
          loading={isLoading}
          style={{ width: "38px", height: "38px" }}
        />
      </div>
      <div className="w-100 overflow-x-auto mb-3">
        <SelectMultiple
          data={data}
          keyField={"ip"}
          field={"text"}
          deleteAll={false}
          onDeleteItem={onDeleteIP}
        />
      </div>
      <Tooltip
        content={
          <div>
            <div
              className={"fw-bold"}
              dangerouslySetInnerHTML={{
                __html: t("mail.mail_admin_pop3_imap_white_ip_msg"),
              }}
            />

            <div>
              {t("mail.mail_ip_you_are_currently_connected_to")}:{" "}
              <span className={"fw-bold"}>{userConfig?.ip_address}</span>
            </div>
          </div>
        }
      />
      {isLoading && <Loading />}
    </div>
  )
}

export default WhiteIP
