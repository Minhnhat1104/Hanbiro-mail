// @ts-nocheck
import { useTranslation } from "react-i18next"

import { isObject } from "lodash"

import useDevice from "hooks/useDevice"

const CheckboxGroup = (props) => {
  const {
    value = [],
    options = [],
    isVertical = false,
    fieldValue = "value",
    fieldLabel = "label",
    disabled = false,
    onChange = (params) => {},
    onClick,
    checkboxClass = "",
  } = props
  const { t } = useTranslation()
  const { isMobile } = useDevice()

  if (options.length === 0) return <> No Options</>

  return (
    <div
      className={`d-flex align-items-center gap-3${isMobile || isVertical ? " flex-column" : ""}`}
    >
      {options &&
        options.map((item, index) => (
          <div className="form-check" key={index}>
            <input
              className="form-check-input"
              type="checkbox"
              checked={
                Array.isArray(value) &&
                value?.findIndex((_item) => {
                  if (isObject(_item)) {
                    return _item[fieldValue] == item[fieldValue]
                  } else {
                    return _item == item[fieldValue]
                  }
                }) !== -1
              }
              onChange={(e) => {
                if (onChange && typeof onChange === "function") {
                  let valueNew = []
                  if (e.target.checked) {
                    valueNew = value.concat(item)
                  } else {
                    valueNew = value.filter(
                      (itemChosed) => itemChosed[fieldValue] != item[fieldValue],
                    )
                  }

                  onChange && onChange(valueNew)
                }
              }}
              id={["checkbox-group-", item?.value, index].join("")}
              disabled={disabled}
            />
            <label className="form-check-label" htmlFor={["checkbox-group-", item?.value, index].join("")}>
              {t(item[fieldLabel])}
            </label>
          </div>
        ))}
    </div>
  )
}

export default CheckboxGroup
