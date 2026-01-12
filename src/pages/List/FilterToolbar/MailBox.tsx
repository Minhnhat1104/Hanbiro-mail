// @ts-nocheck
import { BaseIcon } from "components/Common"
import HanAutoComplete from "components/Common/HanAutoComplete"
import { isEmpty, isEqual } from "lodash"
import { getEmailFolder } from "modules/mail/common/api"
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Input } from "reactstrap"
import useMenu from "utils/useMenu"
import "./styles.scss"
import { setEmailConfig } from "store/emailConfig/actions"
import { useDispatch, useSelector } from "react-redux"
import { updateFolderMenus } from "utils/sidebar"

const isChecked = (selected, data) => {
  if (selected.some((item) => item.value === "all")) return true
  return selected.some((item) => item.value === data.value)
}

const MailBoxDropdown = ({
  folders,
  folder,
  selected,
  initExpand = false,
  showCollapse,
  apiGetChildren = () => {},
  apiReturnGetField = "mailbox",
  handleSelectFolder,
  callbackUpdateMailbox,
}) => {
  const [isExpand, setIsExpand] = useState(initExpand)
  const [children, setChildren] = useState(folders || folder?.children || [])
  const [isLoading, setIsLoading] = useState(false)
  const [checkLoadApi, setCheckLoadApi] = useState(false)

  const handleClick = () => {
    setIsExpand(!isExpand)
    if (!checkLoadApi && (children?.length == 0 || typeof children === "boolean")) {
      setIsLoading(true)
      setCheckLoadApi(true)

      apiGetChildren({ root: folder.key, isopen: "yes" }).then((res) => {
        const nChildren = res?.[apiReturnGetField]?.map((item) => ({
          ...item,
          label: item.name,
          value: item.key,
        }))
        setChildren(nChildren ?? [])
        callbackUpdateMailbox && callbackUpdateMailbox(folder, nChildren ?? [])
        setIsLoading(false)
      })
    }
  }

  return (
    <div className="mailbox-dropdown">
      <div>
        <MailBoxItem
          folder={folder}
          selected={selected}
          handleClick={handleClick}
          isLoading={isLoading}
          showCollapse={showCollapse}
          isExpand={isExpand}
          handleSelectFolder={handleSelectFolder}
        />
      </div>
      <div className="ms-4">
        {isExpand &&
          children &&
          typeof children !== "boolean" &&
          children.length != 0 &&
          children.map((child, index) => {
            return child?.children?.length > 0 || child?.hasChildren ? (
              <MailBoxDropdown
                key={index}
                folder={child}
                selected={selected}
                folders={child?.children}
                apiGetChildren={apiGetChildren}
                apiReturnGetField={apiReturnGetField}
                handleSelectFolder={handleSelectFolder}
                showCollapse={child?.children || child?.hasChildren}
                initExpand={child?.children}
                callbackUpdateMailbox={callbackUpdateMailbox}
              />
            ) : (
              <div key={index}>
                <MailBoxItem
                  folder={child}
                  selected={selected}
                  initExpand={initExpand}
                  handleSelectFolder={handleSelectFolder}
                />
              </div>
            )
          })}
      </div>
    </div>
  )
}

const MailBoxItem = (props) => {
  const { folder, selected, isLoading, showCollapse, isExpand, handleClick, handleSelectFolder } =
    props

  // const [showCollapse, setShowCollapse] = useState(folder?.children || folder?.hasChildren)

  return (
    <div
      key={folder.value}
      className="mailbox-dropdown-item p-1 d-flex gap-1"
      onClick={(e) => {
        e.stopPropagation()
        handleSelectFolder(folder)
      }}
    >
      {showCollapse ? (
        <div className="btn-expand-folder">
          {isLoading ? (
            <div className="spinner-border spinner-border-sm" role="status" />
          ) : (
            <BaseIcon
              icon={isExpand ? "fas fa-chevron-down" : "fas fa-chevron-right"}
              onClick={(e) => {
                e.stopPropagation()
                handleClick && handleClick()
              }}
              className={"ms-1 han-text-secondary"}
            />
          )}
        </div>
      ) : (
        <div className="empty-spacing"></div>
      )}
      <Input
        className={`form-check-input ${showCollapse ? "" : "ms-4"}`}
        id={`mailbox-${folder.value}`}
        type="checkbox"
        checked={isChecked(selected, folder)}
        onChange={() => {}}
      />
      <span className="ms-2 cursor-pointer">{folder.label}</span>
    </div>
  )
}

const MailBoxList = (props) => {
  const { options, setValue, value } = props
  const { folderMenus } = useMenu()
  const dispatch = useDispatch()

  const emailMenuConfig = useSelector((state) => state.EmailConfig)

  const handleSelectFolder = (data) => {
    let nSelect = [...value]
    if (value.some((item) => item.value === "all")) {
      nSelect = options
    }
    const isSeleted = nSelect.findIndex((item) => item.value === data.value)
    if (isSeleted !== -1) {
      nSelect = [...nSelect].filter((item) => item.value !== data.value)
    } else {
      nSelect.push(data)
    }
    setValue(nSelect)
  }

  const handleUpdateFolders = (menu, subMenu) => {
    const nFolders = updateFolderMenus(folderMenus, menu, subMenu)

    dispatch(setEmailConfig({ ...emailMenuConfig, folderMenus: nFolders }))
  }

  return (
    <div className="mailbox-list px-2 py-2 overflow-y-auto" style={{ height: 250 }}>
      <div className="">
        {options &&
          options.length > 0 &&
          options.map((folder) => (
            <MailBoxDropdown
              selected={value}
              key={folder.value}
              folder={folder}
              isChecked={isChecked}
              initExpand={folder?.children}
              showCollapse={folder?.children || folder?.hasChildren}
              handleSelectFolder={handleSelectFolder}
              apiGetChildren={getEmailFolder}
              callbackUpdateMailbox={handleUpdateFolders}
            />
          ))}
      </div>
    </div>
  )
}

const MailBox = (props) => {
  const { filterOptions, onFilterChange, type } = props
  const { t } = useTranslation()
  const { basicMenus, folderMenus } = useMenu()

  const allFolder = {
    value: "all",
    label: t("mail.all"),
  }

  const allMenu = useMemo(() => {
    return [...basicMenus, ...folderMenus]
      ?.map((item) => ({
        ...item,
        label: item.name,
        value: item.key,
      }))
      .filter((_item) => !["Secure", "Receive", "Approval"].includes(_item.value))
  }, [basicMenus, folderMenus])

  const getInitValue = (filterOptions) => {
    if (!!filterOptions?.searchbox) {
      if (filterOptions?.searchbox === "all") return [allFolder]
      let searchArr = []
      if (filterOptions?.searchbox?.includes(",")) {
        searchArr = filterOptions?.searchbox.split(",")
        // return allMenu.filter((item) => searchArr.includes(item.value))
        return getItemSelected(searchArr, allMenu)
      } else {
        // return [allMenu.find((item) => item.value === filterOptions?.searchbox) || allFolder]
        return getItemSelected([filterOptions?.searchbox], allMenu)
      }
    } else {
      return [allFolder]
    }
  }

  const getItemSelected = (searchArr, list, selected) => {
    let result = selected ? selected : []
    list.forEach((item) => {
      if (searchArr?.includes(item.value)) {
        result.push(item)
      } else {
        if (item?.children) {
          getItemSelected(searchArr, item?.children, result)
        }
      }
    })
    return result
  }

  const [value, setValue] = useState(() => getInitValue(filterOptions))

  useEffect(() => {
    const nValue = value?.map((item) => item.value)?.join(",")
    if (nValue !== filterOptions?.searchbox) {
      setValue(() => getInitValue(filterOptions))
    }
  }, [filterOptions])

  useEffect(() => {
    const nValue = value?.map((item) => item.value)?.join(",")
    onFilterChange && onFilterChange({ type, value: nValue })
  }, [value])

  return (
    <HanAutoComplete
      isMulti
      value={value}
      options={allMenu}
      isSearchable={!value.some((item) => item.value === "all")}
      isOptionDisabled={() => value.length >= 3}
      onChange={(data, options) => {
        setValue(data)
      }}
      closeMenuOnSelect={false}
      components={{
        MenuList: (props) => MailBoxList({ ...props, value }),
      }}
    />
  )
}

export default MailBox
