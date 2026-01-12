// @ts-nocheck
import React from "react"
// import { HanIcon } from "Groupware/components";
import "./styles.scss"
import classnames from "classnames"
import BaseIcon from "components/Common/BaseIcon"

function index({ folders = [], onPress = () => {} }) {
  // if (folders.length == 1) {
  //   return null
  // }
  return (
    <div className="align-items-center d-flex modal-clouddisk-level-folder">
      {folders.map((folder, index) => (
        <React.Fragment key={folder.id ?? index}>
          <span
            onClick={e => {
              e.preventDefault()
              onPress({ folder: folder, index: index })
            }}
            className={classnames(
              "han-h5",
              "name-folder",
              index == folders.length - 1 ? "active-folder" : ""
            )}
          >
            {folder.text}
          </span>
          {index != folders.length - 1 && (
            <BaseIcon className={"bx bx-chevron-right fs-4"} size={8} />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

export default index
