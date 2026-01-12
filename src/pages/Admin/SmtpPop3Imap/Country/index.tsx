// @ts-nocheck
import { useEffect, useState, useMemo } from "react"

import { useTranslation } from "react-i18next"
import { FormGroup } from "reactstrap"
import { BaseButton, BaseIcon, Loading } from "components/Common"
import SelectMultiple from "components/SettingAdmin/SelectMultiple"
import Select from "react-select"
import Tooltip from "components/SettingAdmin/Tooltip"
import { colourStyles } from "components/Common/HanSelect"

import { useCustomToast } from "hooks/useCustomToast"
import { emailGet } from "helpers/email_api_helper"
import {
  SMTP_POP3_IMAP_WHITE_COUNTRY_CODE_LIST,
  SMTP_POP3_IMAP_WHITE_COUNTRY_CODE_ADD,
  SMTP_POP3_IMAP_WHITE_COUNTRY_CODE_DEL,
  SMTP_POP3_IMAP_BLACK_COUNTRY_CODE_LIST,
  SMTP_POP3_IMAP_BLACK_COUNTRY_CODE_ADD,
  SMTP_POP3_IMAP_BLACK_COUNTRY_CODE_DEL,
} from "modules/mail/admin/url"

const Country = (props) => {
  const { type, countryCode, userInfo } = props
  const { t } = useTranslation()
  const { successToast, errorToast } = useCustomToast()

  const [country, setCountry] = useState({})
  const [invalidData, setInvalidData] = useState(false)
  const [refetch, setRefetch] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [data, setData] = useState({})

  useEffect(() => {
    setRefetch(true)
  }, [userInfo])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        let url = SMTP_POP3_IMAP_WHITE_COUNTRY_CODE_LIST
        if (type != "white") {
          url = SMTP_POP3_IMAP_BLACK_COUNTRY_CODE_LIST
        }
        const res = await emailGet(url)
        let loopData = type != "white" ? res?.blackiplist : res?.whiteiplist
        let newData = {}
        Object.keys(loopData).map((key) => {
          let item = loopData?.[key]
          newData[key] = {
            code: item?.code,
            text: item?.name + " (" + item?.code?.toUpperCase() + ")",
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

  const countryCodeFormat = useMemo(() => {
    let newCountryCode = []
    if (Object.keys(countryCode).length > 0) {
      Object.keys(countryCode).map((code) => {
        let countryName = countryCode[code]
        newCountryCode.push({
          value: code,
          label: countryName + " - " + code.toUpperCase(),
        })
      })
    }

    return newCountryCode
  }, [countryCode])

  const addCountry = async () => {
    if (!country.value) {
      setInvalidData(true)
      return false
    }

    let url = [SMTP_POP3_IMAP_WHITE_COUNTRY_CODE_ADD, country.value].join("/")
    if (type != "white") {
      url = [SMTP_POP3_IMAP_BLACK_COUNTRY_CODE_ADD, country.value].join("/")
    }

    const res = await emailGet(url)
    if (res?.success) {
      successToast()
      setRefetch(true)
      setCountry({})
      setInvalidData(false)
    } else {
      errorToast()
    }
  }

  const onDeleteCountry = async (countryData) => {
    let url = [SMTP_POP3_IMAP_WHITE_COUNTRY_CODE_DEL, countryData.code].join("/")
    if (type != "white") {
      url = [SMTP_POP3_IMAP_BLACK_COUNTRY_CODE_DEL, countryData.code].join("/")
    }

    const res = await emailGet(url)
    if (res?.success) {
      successToast()
      setRefetch(true)
      setCountry({})
    } else {
      errorToast()
    }
  }
  return (
    <div className="mt-2 table-list position-relative">
      <div className="d-flex justify-content-between mb-2">
        <div className="d-flex align-items-center w-50">
          <span className={"me-2"}>{t("mail.mail_country")}:</span>
          <Select
            value={country}
            onChange={(val) => {
              setCountry(val)
            }}
            options={countryCodeFormat}
            className={`select2-selection w-50 me-2`}
            styles={{
              menu: (base) => ({
                ...base,
                backgroundColor: "white!important",
              }),

              ...colourStyles,
              control: (styles) => ({
                ...styles,
                borderColor: invalidData ? "red" : "var(--bs-input-border-color)",
              }),
            }}
            placeholder={t("mail.mail_country") + "..."}
            menuPosition="fixed"
          />
          <BaseButton
            color={"primary"}
            onClick={() => {
              addCountry()
            }}
          >
            {t("common.dropdown_custom_add_text")}
          </BaseButton>
        </div>

        <BaseButton
          outline
          color={`grey`}
          className={`btn-outline-grey`}
          onClick={() => setRefetch(true)}
          loading={isLoading}
        >
          <BaseIcon icon={"mdi mdi-reload"} />
        </BaseButton>
      </div>
      <div className="w-100 overflow-x-auto mb-3">
        <SelectMultiple
          data={data}
          keyField={"code"}
          field={"text"}
          deleteAll={false}
          onDeleteItem={onDeleteCountry}
        />
      </div>
      <Tooltip
        content={
          <div>
            {type == "white" && (
              <div
                className={"fw-bold"}
                dangerouslySetInnerHTML={{
                  __html: t("mail.mail_admin_pop3_imap_country_msg"),
                }}
              />
            )}
            <div>
              {t("mail.mail_country_you_are_currently_connected_to")}:{" "}
              <span className="fw-bold">
                {countryCode[userInfo?.country_code]} ({userInfo?.country_code?.toUpperCase()})
              </span>
            </div>
          </div>
        }
      />
      {isLoading && <Loading />}
    </div>
  )
}
export default Country
