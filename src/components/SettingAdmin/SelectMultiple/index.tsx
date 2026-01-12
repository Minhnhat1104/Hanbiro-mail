// @ts-nocheck
import React from "react"
import classNames from "classnames"
import { BaseButton, BaseIcon, NoData } from "components/Common"

const SelectMultiple = (props) => {
  const {
    data = {},
    setData,
    onDeleteItem,
    field = "username",
    keyField = "id",
    deleteAll = true,
  } = props

  return (
    <div className="form-control p-0 d-flex">
      <div
        className="d-flex flex-grow-1"
        style={{
          overflowY: "auto",
          position: "relative",
        }}
      >
        <div
          className={classNames("d-flex flex-wrap align-content-start", {
            "justify-content-center": Object.values(data).length == 0,
          })}
          style={{ width: "96%" }}
        >
          {Object.values(data).length > 0 &&
            Object.values(data).map((item, idx) => {
              return (
                <BaseButton
                  color={"soft-secondary"}
                  key={idx}
                  className="auto-complete-wrapper m-1 p-0"
                  type="button"
                >
                  <>
                    <span className="px-2">{item?.[field]}</span>
                    <BaseIcon
                      className={`color-red visible`}
                      icon={"mdi mdi-trash-can-outline font-size-18 "}
                      onClick={() => {
                        if (setData) {
                          let newData = { ...data }
                          delete newData[item?.[keyField]]
                          setData(newData)
                        }
                        if (onDeleteItem) {
                          onDeleteItem(item)
                        }
                      }}
                    />
                  </>
                </BaseButton>
              )
            })}

          {Object.values(data).length === 0 && <NoData />}
        </div>
        <div
          style={{
            position: "sticky",
            top: 0,
            alignSelf: "flex-start",
          }}
        >
          {deleteAll && Object.values(data).length > 0 && (
            <BaseIcon
              className={"color-red p-1 base-icon-hidden"}
              icon={"mdi mdi-trash-can-outline font-size-22"}
              onClick={() => setData({})}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default SelectMultiple
