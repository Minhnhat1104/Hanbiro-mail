// @ts-nocheck
import classnames from "classnames"
import { useEffect, useState } from "react"
import { Input } from "reactstrap"
import "./styles.scss"
import useDeviceNavigator from "hooks/useDeviceNavigator"
import { validateStrictEmailFinal } from "utils"

const CustomMultipleValue = (props) => {
  const { index, data, setValue, selectProps, removeProps } = props
  const { isMobile, isTablet } = useDeviceNavigator()
  const [editValue, setEditValue] = useState(data.value)
  const [isEditValue, setIsEditValue] = useState(false)
  const [isValid, setIsValid] = useState(false)

  useEffect(() => {
    if (data.value && data.value !== editValue) {
      setEditValue(data.value)
    }

    if (data.value) {
      setIsValid(validateStrictEmailFinal(data.value))
    }
  }, [data.value])

  const handleKeyDown = (event) => {
    event.stopPropagation()
    if (event.key === "Enter" || event.keyCode === 13) {
      handleEditValue()
    }
  }

  const handleEditValue = () => {
    const nValues = selectProps?.value?.map((val, idx) => {
      if (index === idx) {
        return { value: editValue, label: editValue }
      } else {
        return val
      }
    })
    setIsValid(validateStrictEmailFinal(nValues))
    setValue(nValues)
    setIsEditValue(false)
    setEditValue("")
  }

  const handleRemoveValue = () => {
    // const nValues = selectProps?.value?.filter((val, idx) => {
    //   return idx !== index
    // })
    // setValue(nValues)
    removeProps.onClick()
  }

  return (
    <div
      className={classnames(
        "value-container m-1 d-flex bg-light rounded-1 align-items-center me-1 overflow-hidden",
        { "ps-1 border-0": !isEditValue, "text-danger": !isValid },
      )}
      onKeyDown={handleKeyDown}
    >
      <div style={{ width: `calc(100% - ${isEditValue ? "24px" : "45px"})` }}>
        {isEditValue ? (
          <Input
            style={{ border: "none", borderRadius: 0 }}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            autoFocus
          />
        ) : (
          <div className="w-100 text-truncate">{data.label}</div>
        )}
      </div>
      <div className="d-flex" onMouseDown={(e) => e.stopPropagation()}>
        {!isEditValue && (
          <div
            className="px-1 edit-btn h-100 ms-1"
            {...(isMobile || isTablet
              ? {
                  onTouchEnd: (e) => {
                    e.stopPropagation()
                    setIsEditValue(true)
                  },
                }
              : {
                  onClick: (e) => {
                    e.stopPropagation()
                    setIsEditValue(true)
                  },
                })}
          >
            <i className="mdi mdi-pencil cursor-pointer" />
          </div>
        )}
        <div
          className="px-1 delete-btn d-flex align-items-center"
          style={{ height: isEditValue ? "22px" : "auto" }}
          {...(isMobile || isTablet
            ? {
                onTouchEnd: (e) => {
                  e.stopPropagation()
                  isEditValue ? setIsEditValue(false) : handleRemoveValue()
                },
              }
            : {
                onClick: (e) => {
                  e.stopPropagation()
                  isEditValue ? setIsEditValue(false) : handleRemoveValue()
                },
              })}
        >
          <i className={`mdi mdi-${isEditValue ? "close" : "delete"} cursor-pointer`} />
        </div>
      </div>
    </div>
  )
}

export default CustomMultipleValue
