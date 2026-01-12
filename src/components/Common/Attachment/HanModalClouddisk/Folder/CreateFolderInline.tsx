// @ts-nocheck
import BaseButton from "components/Common/BaseButton"
import BaseIcon from "components/Common/BaseIcon"
import { debounce } from "lodash"
import React, { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Input } from "reactstrap"

const CreateFolderInline = ({ handleCreateFolder, handleCancel }) => {
  const { t } = useTranslation()
  const [folderName, setFolderName] = React.useState("")
  return (
    <form
      className="d-flex gap-3 align-items-center"
      onSubmit={(e) => {
        e.preventDefault()
        handleCreateFolder(folderName)
        setFolderName("")
      }}
    >
      <label
        htmlFor="folderName"
        className="text-nowrap m-0 han-h4 han-fw-medium han-text-secondary"
      >
        {t("common.task_folder_name")}
      </label>
      <Input
        id="folderName"
        name="folderName"
        placeholder="Name"
        onChange={(e) => setFolderName(e.target.value)}
      />
      <span className="d-flex">
        <BaseIcon className={"bx bx-x fs-4 mx-1"} onClick={() => handleCancel()} />
        <BaseIcon
          className={"bx bx-check text-success fs-4 mx-1"}
          onClick={() => {
            setFolderName("")
            handleCreateFolder(folderName)
          }}
        />
      </span>
    </form>
  )
}

export default CreateFolderInline
