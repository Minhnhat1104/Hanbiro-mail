// @ts-nocheck
import { MenuItem, Select } from "@mui/material"
import { emailGet } from "helpers/email_api_helper"
import { useCustomToast } from "hooks/useCustomToast"
import _, { isEqual, isObject } from "lodash"
import { useEffect, useRef, useState } from "react"
import { Input } from "reactstrap"
import "./styles.scss"

const AddSelectLangKey = (props) => {
  const { value, onChange, disabled, ...rest } = props

  const { successToast, errorToast } = useCustomToast()

  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState()
  const [menuList, setMenuList] = useState([])
  const [langKey, setLangKey] = useState("")
  const [langText, setLangText] = useState("")

  const setLangKeyDebounced = useRef(
    _.debounce((searchText) => setLangKey(searchText), 1000),
  ).current

  useEffect(() => {
    getMenuList()
  }, [])

  useEffect(() => {
    if (value && isObject(value) && !isEqual(value, data)) {
      setData(value)
      setLangText(value?.key)
    }
  }, [value])

  useEffect(() => {
    if (data) {
      setData((prev) => ({ ...prev, key: langKey }))
    }
  }, [langKey])

  useEffect(() => {
    if (data && !isEqual(value, data)) {
      onChange && onChange(data)
    }
  }, [data])

  const getMenuList = async () => {
    const url = "ngw/translator/tree/index?section=client&id=client&reverse=1"
    setIsLoading(true)
    try {
      const res = await emailGet(url)
      if (res?.success) {
        const defaultOption = [{ value: "none", label: "--select--" }]
        const data = res?.rows?.map((row) => ({
          ...row,
          value: row?.index,
          label: row?.name || row?.text,
        }))
        setMenuList([...defaultOption, ...data])
      }
    } catch (error) {
      errorToast()
      console.log("error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="lang-add-select-key">
      <div className="select-menu-wrapper">
        <Select
          disabled={isLoading || disabled}
          value={data?.menu || ""}
          onChange={(e) => setData((prev) => ({ ...prev, menu: e.target.value }))}
          sx={{
            minWidth: 100,
            height: 30,
            color: "var(--bs-white)",
            fontSize: "13px",
            fontWeight: "bold",
            "& .Mui-disabled": { "-webkit-text-fill-color": "var(--bs-bg-soft-grey) !important" },
            "& .MuiSvgIcon-root": { color: "var(--bs-white)" },
            "& .MuiOutlinedInput-notchedOutline": { border: "none" },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": { border: "none" },
          }}
        >
          {menuList?.map((menu) => (
            <MenuItem key={menu.value} value={menu.value} sx={{ fontSize: "13px" }}>
              {menu.label}
            </MenuItem>
          ))}
        </Select>
      </div>
      <Input
        value={langText}
        onChange={(e) => {
          setLangText(e.target.value)
          setLangKeyDebounced(e.target.value)
        }}
        disabled={isLoading || disabled}
      />
    </div>
  )
}

export default AddSelectLangKey
