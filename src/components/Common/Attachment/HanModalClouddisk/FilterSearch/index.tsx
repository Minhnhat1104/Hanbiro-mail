// @ts-nocheck
import classnames from "classnames"
import BaseIcon from "components/Common/BaseIcon"
import React, { useEffect } from "react"
import "./style.scss"
import useClickOutside from "utils/useOutsideDetect"
import { useTranslation } from "react-i18next"
import { Button } from "reactstrap"
export const FILTERS = [
  {
    id: "my",
    text: "common.faq_category",
  },
  {
    id: "doc",
    text: "common.document",
  },
  {
    id: "photo",
    text: "common.photo",
  },
  {
    id: "music",
    text: "common.music",
  },
  {
    id: "movie",
    text: "Video",
  },
]
function index({ filterChoosed = {}, onChange = () => {} }) {
  const { t } = useTranslation()
  const [showDropdown, setShowDropdown] = React.useState(false)
  const drowdownRef = React.useRef()
  useClickOutside(drowdownRef, () => {
    setShowDropdown(false)
  })
  useEffect(() => {}, [])
  return (
    <div className="dropdown dropdown-custom me-2">
      <Button
        color="grey"
        className="btn-action d-flex justify-content-center align-items-center gap-1"
        id="modalClouddiskFilter"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded="false"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <BaseIcon className="fas fa-filter" />
        <span>{t("common.common_filter")}</span>
      </Button>
      {showDropdown && (
        <div
          ref={drowdownRef}
          className="dropdown-clouddisk-custom"
          aria-labelledby="modalClouddiskFilter"
        >
          {FILTERS.map((item) => (
            <a
              key={item?.id}
              className={classnames("dropdown-item", item.id == filterChoosed.id ? "active" : "")}
              href="#"
              onClick={(e) => {
                e.preventDefault()
                // setFilterChoosed(item);
                onChange(item)
                setShowDropdown(false)
              }}
            >
              {t(item.text)}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

export default index
