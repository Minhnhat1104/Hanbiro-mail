// @ts-nocheck
import { get } from "helpers/api_helper"
import { Fragment, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { components } from "react-select"
import classname from "classnames"
import "./styles.scss"
import { isArray } from "lodash"

const menuHeaderStyle = {
  background: "white",
  bottom: "-1px",
}

const tabOptions = [
  { label: "mail.mail_auto_complete_recent_msg", value: 0 },
  { label: "mail.mail_auto_complete_important_msg", value: 1 },
]

const CustomMenuList = (props) => {
  const { setValue, selectProps } = props
  const { t } = useTranslation()

  const [tab, setTab] = useState(0)
  const [importantList, setImportantList] = useState([])
  const [keyword, setKeyword] = useState("")

  const getImportantList = async () => {
    const url = "addrbook/tree/autocomplete"
    const params = {
      keyword,
    }
    const res = await get(url, params)
    if (res?.success) {
      setImportantList(res?.rows)
    }
  }

  useEffect(() => {
    if (tab === 1) {
      getImportantList()
    }
  }, [tab])

  const handleSelectImportantAddress = (data) => {
    let nList = selectProps?.value ?? []
    const nData = {
      label: `"${data.name?.trim()}" <${data.mail}>`,
      value: `"${data.name?.trim()}" <${data.mail}>`,
    }
    if (isArray(nList)) {
      nList.push(nData)
    }
    setValue(nList)
  }

  return (
    <>
      <components.MenuList className="m-0 pb-0" {...props}>
        {tab === 0 ? (
          props.children
        ) : (
          <div className="important-list">
            {importantList.map((item) => (
              <div
                className="important-item"
                key={item.mail}
                onClick={() => handleSelectImportantAddress(item)}
                // dangerouslySetInnerHTML={{
                //   __html: item?.title,
                // }}
              >
                {`"${item.name?.trim()}" <${item.mail}>`}
              </div>
            ))}
          </div>
        )}
      </components.MenuList>
      <div className="tab-options d-flex" style={menuHeaderStyle}>
        {tabOptions.map((item) => (
          <div
            key={item.value}
            onClick={() => setTab(item.value)}
            className={classname("tab-item cursor-pointer", {
              "tab-active": tab === item.value,
            })}
          >
            {t(item.label)}
          </div>
        ))}
      </div>
    </>
  )
}

export default CustomMenuList
