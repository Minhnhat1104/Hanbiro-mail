// @ts-nocheck
import React, { useEffect, useState } from "react"
import { Spinner, Input } from "reactstrap"
import { BaseIcon, Empty } from "components/Common"
import { getEmailFolder } from "modules/mail/common/api"
import classnames from "classnames"
import "./styles.scss"
import { isEmpty } from "lodash"

const Folder = ({
  folder = {},
  onClick = () => {},
  style = { paddingLeft: 0 },
  folderChoose = {},
  triggerFirstLoad,
}) => {
  const [isExpand, setIsExpand] = useState(false)
  const [children, setChildren] = useState([])
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [hasChildren, setHasChildren] = useState(false)

  useEffect(() => {
    if (folder) {
      const hasChildren = folder.children ?? folder.hasChildren ? true : false
      if (hasChildren) {
        setHasChildren(true)
      }
      if (!isEmpty(folder.children)) {
        setIsExpand(true)
        setLoaded(true)
        setChildren(folder.children || [])
      }
    }
  }, [folder])

  const loadChild = () => {
    if (isExpand) {
      setIsExpand(false)
    } else {
      if (loaded) {
        setIsExpand(true)
      } else {
        if (typeof folder?.children !== "undefined" && folder?.children?.length != 0) {
          setChildren(folder?.children ?? [])
          setIsExpand(true)
          setLoaded(true)
        } else {
          setLoading(true)
          const params = {
            reverse: 0,
            root: folder.id,
          }
          getEmailFolder(params).then((res) => {
            setLoading(false)
            setChildren(res?.mailbox ?? [])
            setIsExpand(true)
            setLoaded(true)
          })
        }
      }
    }
  }
  if (triggerFirstLoad && !loaded) {
    setLoaded(true)
    loadChild()
  }

  return (
    <div
      className={`container-item ${children.length == 0 ? "" : ""}`}
      style={{ paddingLeft: style.paddingLeft + 12 }}
    >
      <div
        className={classnames(
          "item-folder d-flex align-items-center",
          folderChoose && folderChoose.key && folder.key == folderChoose.key ? "active" : "",
        )}
      >
        <Input
          className="form-check-input"
          type="checkbox"
          checked={folder.key == folderChoose?.key}
          onChange={() => {}} // Do not remove
          onClick={() => {
            onClick(folder)
          }}
        />

        <BaseIcon
          className={`cursor-pointer fs-4 mx-2 icon-folder`}
          icon={
            hasChildren
              ? isExpand
                ? "mdi mdi-folder-download"
                : "mdi mdi-folder-upload"
              : "mdi mdi-folder"
          }
          onClick={(e) => {
            e.preventDefault()
            hasChildren && loadChild(folder)
          }}
        />

        <span className="cursor-pointer fs-5" onClick={() => onClick(folder)}>
          {folder.name}
        </span>
        {loading ? (
          <div className="spinner-border spinner-border-sm" role="status" />
        ) : hasChildren ? (
          <span
            onClick={(e) => {
              e.preventDefault()
              hasChildren && loadChild(folder)
            }}
            className={`cursor-pointer`}
          >
            <BaseIcon
              icon={isExpand ? "mdi mdi-chevron-down" : "mdi mdi-chevron-right"}
              className={`fs-5`}
            />
          </span>
        ) : null}
      </div>
      <div
        className={`mg-t-5`}
        style={{
          display: isExpand ? "block" : "none",
          paddingLeft: "14px",
        }}
      >
        {children.map((folder, index) => (
          <Folder
            folder={folder}
            onClick={onClick}
            folderChoose={folderChoose}
            key={"folder-" + folder?.key}
          />
        ))}
      </div>
    </div>
  )
}

function index({
  folders = [],
  onClick,
  folderChoose = {},
  triggerFirstLoad = false,
  loading,
  className = "",
}) {
  return (
    <div className={`tree-folder ${className}`}>
      {loading ? (
        <div className="w-100 text-center p-5">
          <Spinner color={"primary"} />
        </div>
      ) : folders && folders.length > 0 ? (
        <div className="list-folder border rounded mt-3 p-3">
          {folders.map((folder) => (
            <Folder
              folder={folder}
              onClick={(val) => {
                onClick(val)
              }}
              folderChoose={folderChoose}
              triggerFirstLoad={triggerFirstLoad}
              key={"list-folder" + folder?.key}
            />
          ))}
        </div>
      ) : (
        <div className="w-100 text-center p-5">
          <Empty />
        </div>
      )}
    </div>
  )
}

export default index
