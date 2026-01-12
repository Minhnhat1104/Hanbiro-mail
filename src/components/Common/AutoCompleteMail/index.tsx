// @ts-nocheck
import { Headers, emailGet } from "helpers/email_api_helper"
import { useTranslation } from "react-i18next"
import AsyncCreatableSelect from "react-select/async-creatable"
import { borderBottomStyles, colourStyles } from "../HanSelect"
import { validateStrictEmailFinal } from "utils"

let searchTimeout

const AutoCompleteMail = (props) => {
  const {
    onChange,
    value,
    component,
    customComponents,
    stylesSelect = {},
    isMulti = false,
    maxMenuHeight = 300,
    onMenuScrollToBottom = () => {},
    invalid = false,
    placeholder = "mail.mail_plz_enter_email",
    defaultOptions = [],
    innerRef,
    ...rest
  } = props

  const URL_COMPLETE_LIST = "email/complete/list"
  const { t } = useTranslation()

  const filterOptions = async (inputValue) => {
    const res = await emailGet([URL_COMPLETE_LIST, inputValue, "1", "15"].join("/"), {}, Headers)

    return res?.data?.length > 0 ? res.data : []
  }

  const promiseOptions = (inputValue) =>
    new Promise((resolve) => {
      clearTimeout(searchTimeout)
      searchTimeout = setTimeout(() => {
        filterOptions(inputValue).then((result) => {
          let newOptions = []
          if (result?.length > 0) {
            result.map((mail) => newOptions.push({ value: mail, label: mail }))
          }
          resolve(newOptions)
        })
      }, 100)
    })

  const onChangeSelectedOption = (value) => {
    let lastItem = value.at(-1)
    let emails = lastItem?.value ? emailSplit(lastItem?.value) : []
    if (emails?.length > 1) {
      value.pop()
      emails.map((email) => {
        value.push({ label: email, value: email })
      })
    }
    onChange(value)
  }

  const emailSplit = (emailStr, options) => {
    if (typeof options === "undefined") {
      var options = {
        isPaste: false,
        mustBeEmail: true,
      }
    }
    var isPaste = options.hasOwnProperty("isPaste") ? options.isPaste : false
    var mustBeEmail = options.hasOwnProperty("mustBeEmail") ? options.mustBeEmail : false
    var _emails = []
    emailStr = emailStr?.trim()
    if (emailStr !== "") {
      /*
       * H.Phuc <hoangphuc@hanbiro.vn>
       *  2022-08-01 - @Ticket: GQ-66816 - Add split with ';'
       *  2022-11-09 - @Ticket: GQ-80834 - Add split with '\n' and '\t' and ' '
       */
      var emails = emailStr.split(/(,|;|\n|\t)/)
      if (isPaste) {
        emails = emailStr.split(/(,|;|\n|\t| )/)
      }
      if (emails.length > 0) {
        $.each(emails, function (index, value) {
          if (
            value !== "" &&
            value !== "," &&
            value !== ";" &&
            value !== "\n" &&
            value !== "\t" &&
            (!isPaste || (isPaste && value !== " "))
          ) {
            var _newString = emails[index]
            if ((validateStrictEmailFinal(value) && mustBeEmail) || !mustBeEmail) {
              _newString = emails[index] + "|||"
            }
            _emails.push(_newString)
          }
        })
      }
      _emails = _emails.join(",").split("|||,")
      if (_emails.length > 0) {
        _emails.forEach(function (value, index) {
          var newEmail = _emails[index].replace("|||", "").trim()
          if (isPaste) {
            newEmail = newEmail.replace(/\,/g, " ")
          }
          _emails[index] = newEmail
        })
      }
    }
    return _emails
  }

  return (
    <AsyncCreatableSelect
      ref={innerRef}
      cacheOptions
      isCreatable
      // menuIsOpen={true}
      isMulti={isMulti}
      defaultOptions={defaultOptions}
      value={value}
      onChange={onChangeSelectedOption}
      loadOptions={promiseOptions}
      onInputChange={(value, { action }) => {
        if (action === "input-change" || action === "set-value") {
          return value
        }
        return ""
      }}
      components={{
        ...customComponents,
        IndicatorSeparator: () => null,
        IndicatorsContainer: () => null,
      }}
      className={`select2-selection ${!!component ? "flex-grow-1" : "w-100"} ${
        invalid ? "border border-danger rounded" : ""
      }`}
      styles={{
        control: (base, state) => ({
          ...base,
          borderTopRightRadius: component ? 0 : "4px",
          borderBottomRightRadius: component ? 0 : "4px",
          background: state.isDisabled ? "#eff2f7" : "white",
          borderColor: "var(--bs-input-border-color)",
          boxShadow: "none",
          ":hover": {
            ...base[":hover"],
            borderColor: "var(--bs-primary)",
            boxShadow: "0 0 0 1px var(--bs-primary)",
          },
        }),
        menu: (base, state) => ({
          ...base,
          backgroundColor: "white!important",
          overflow: "hidden",
          zIndex: 3000,
        }),
        option: colourStyles.option,
        ...stylesSelect,
        ...borderBottomStyles,
        menuList: (provided) => ({
          ...provided,
          height: 200, // Set max height (adjust as needed)
        }),
      }}
      maxMenuHeight={maxMenuHeight}
      onMenuScrollToBottom={onMenuScrollToBottom}
      placeholder={t(placeholder) + "..."}
      {...rest}
    />
  )
}
export default AutoCompleteMail
