// @ts-nocheck
import React, { useEffect, useState } from "react"
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from "reactstrap"
import { get, map } from "lodash"
import { withTranslation } from "react-i18next"

//i18n
import i18n from "../../../i18n"
import languages from "constants/languages"
import { useDispatch, useSelector } from "react-redux"
import { get as ApiGet, post } from "helpers/api_helper"
import { getGroupwareUrl } from "utils"
import { getConfig } from "store/auth/config/actions"

const LanguageDropdown = () => {
  // Declare a new state variable, which we'll call "menu"
  const [selectedLang, setSelectedLang] = useState("")
  const [menu, setMenu] = useState(false)
  const userLang = useSelector((state) => state.Config?.userConfig?.lang)
  const dispatch = useDispatch()

  useEffect(() => {
    if (!localStorage.getItem("lang.code")) {
      dispatch(getConfig())
    } else {
      changeLanguageAction(localStorage.getItem("lang.code"))
    }
  }, [])

  useEffect(() => {
    changeLanguageAction(userLang)
  }, [userLang])

  const changeLanguageAction = async (lang) => {
    //set language as i18n
    i18n.changeLanguage(lang)
    localStorage.setItem("hanbiro-lang", lang)
    setSelectedLang(lang)
  }

  const toggle = () => {
    setMenu(!menu)
  }
  return (
    <>
      <Dropdown isOpen={menu} toggle={toggle} className="d-inline-block">
        <DropdownToggle className="btn header-item " tag="button">
          <img
            src={get(languages, `${selectedLang}.flag`)}
            alt="Skote"
            height="16"
            className="me-1"
          />
        </DropdownToggle>
        <DropdownMenu className="language-switch dropdown-menu-end">
          {map(Object.keys(languages), (key) => (
            <DropdownItem
              key={key}
              onClick={async () => {
                const formData = new FormData()
                formData.append("lang", key)
                formData.append("mode", "general")
                await post(getGroupwareUrl() + "/org/user/setting", formData, {
                  "Content-Type": "multipart/form-data",
                })
                await changeLanguageAction(key)
                window.location.reload()
              }}
              className={`notify-item ${selectedLang === key ? "active" : "none"}`}
            >
              <img src={get(languages, `${key}.flag`)} alt="Skote" className="me-1" height="12" />
              <span className="align-middle">{get(languages, `${key}.label`)}</span>
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </>
  )
}

export default withTranslation()(LanguageDropdown)
