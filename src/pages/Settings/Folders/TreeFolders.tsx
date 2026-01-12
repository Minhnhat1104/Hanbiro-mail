// @ts-nocheck
import React, { useEffect, useMemo, useState } from "react"
import { Spinner, Input } from "reactstrap"
import { BaseIcon, Empty } from "components/Common"
import { getEmailFolder } from "modules/mail/common/api"
import "./styles.scss"

const Folder = ({
  folder = {},
  onClick = () => {},
  style = { paddingLeft: 0 },
  folderChoose = {},
  triggerFirstLoad,
  onGetFoldersList = (list) => {}, // Callback to get folders list when expanding folder
  isLoaded,
}) => {
  const [isExpand, setIsExpand] = useState(false)
  const [children, setChildren] = useState([])
  const [loading, setLoading] = useState(false)
  // const [loaded, setLoaded] = useState(isLoaded)
  const hasChildren = useMemo(() => {
    return folder?.children ?? folder?.hasChildren ? true : false
  }, [folder])

  useEffect(() => {
    if (isExpand) {
      loadChild()
    }
  }, [folder])

  useEffect(() => {
    if (!isLoaded && isExpand) {
      loadChild()
    }
  }, [isLoaded])

  const loadChild = () => {
    if (isExpand) {
      setIsExpand(false)
    } else {
      if (isLoaded) {
        setIsExpand(true)
      } else {
        if (typeof folder?.children !== "undefined" && folder?.children?.length != 0) {
          setChildren(folder?.children ?? [])
          setIsExpand(true)
          // setLoaded(true)
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
            onGetFoldersList(res?.mailbox ?? [])
            // setLoaded(true)
          })
        }
      }
    }
  }
  if (triggerFirstLoad && !isLoaded) {
    // setLoaded(true)
    loadChild()
  }

  return (
    <div
      className={`container-item ${children.length == 0 ? "" : ""}`}
      style={{ paddingLeft: style.paddingLeft + 12 }}
    >
      <div
        className={`folder-item ps-2 d-flex align-items-center 
        ${
          folderChoose && folderChoose.key && folder.key == folderChoose.key
            ? "active-tree-folder"
            : ""
        }`}
      >
        {loading ? (
          <span style={{ width: "24px" }}>
            <i className="bx bx-loader bx-spin font-size-16 align-middle mx-1" />
          </span>
        ) : hasChildren ? (
          <span
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              hasChildren && loadChild(folder)
            }}
            className={`cursor-pointer`}
          >
            <BaseIcon
              icon={isExpand ? "mdi mdi-chevron-down" : "mdi mdi-chevron-right"}
              className={`font-size-16 mx-1`}
            />
          </span>
        ) : (
          <span style={{ width: "24px" }}></span>
        )}

        <BaseIcon
          className={`cursor-pointer mx-1 icon-folder font-size-16`}
          icon={folder?.isshare ? "mdi mdi-folder-account" : "mdi mdi-folder"}
          onClick={(e) => {
            e.preventDefault()
            hasChildren && loadChild(folder)
          }}
        />

        <span
          className="han-h5 han-fw-regular han-text-primary folder-name cursor-pointer px-1 rounded text-nowrap"
          onClick={() => onClick(folder)}
        >
          {folder.name}
          <span className="">{`( ${folder.size}-${folder.new}/${folder.total} )`}</span>
        </span>
      </div>
      <div
        className={`mg-t-5`}
        style={{
          display: isExpand ? "block" : "none",
        }}
      >
        {children.map((folder, index) => (
          <Folder
            folder={folder}
            onClick={onClick}
            onGetFoldersList={onGetFoldersList}
            folderChoose={folderChoose}
            key={"folder-" + folder?.key}
            style={{ paddingLeft: 12 }}
          />
        ))}
      </div>
    </div>
  )
}

function TreeFolders({
  folders = [], // Data folders list to display
  onClick,
  folderChoose = {},
  triggerFirstLoad = false,
  loading,
  className = "",
  onGetFoldersList = (list) => {}, // Callback to get folders list when expanding folder
  isLoaded,
}) {
  return (
    <div className={`tree-folder-setting ${className}`}>
      {loading ? (
        <div className="w-100 text-center p-5">
          <Spinner color={"primary"} />
        </div>
      ) : folders && folders.length > 0 ? (
        <div className="list-folder">
          {folders.map((folder) => (
            <Folder
              isLoaded={isLoaded}
              folder={folder}
              onClick={(val) => {
                onClick(val)
              }}
              onGetFoldersList={onGetFoldersList}
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

export default TreeFolders
