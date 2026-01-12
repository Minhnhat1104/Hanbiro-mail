// @ts-nocheck
import React, { useState, useEffect } from "react"
import { useCustomToast } from "hooks/useCustomToast"
import { postMailToHtml5 } from "modules/mail/common/api"

const Rater = ({ data, getRate }) => {
  const [rate, setRate] = useState(0)
  const [isEdit, setIsEdit] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { successToast, errorToast } = useCustomToast()

  const resetRate = () => {
    if (data && Number(data)) {
      setRate(Number(data))
    } else {
      setRate(0)
    }
  }

  useEffect(() => {
    resetRate()
  }, [data])

  const handleMinus = () => {
    const nRate = rate - 10
    if (70 <= nRate && nRate <= 90) {
      setRate(nRate)
    }
  }

  const handlePlus = () => {
    const nRate = rate + 10
    if (70 <= nRate && nRate <= 90) {
      setRate(nRate)
    }
  }

  const handleCancel = () => {
    resetRate()
    setIsEdit(false)
  }

  const handleSave = async (data = {}) => {
    setIsLoading(true)

    try {
      const postParams = {
        act: "spam",
        mode: "rate",
        rate: rate,
      }
      const res = await postMailToHtml5(postParams)
      if (res.success == "1") {
        successToast()
        setIsLoading(false)
      } else {
        if (!res?.success) {
          errorToast()
        }
        setIsLoading(false)
      }
    } catch (err) {
      console.log("🚀 ~ err:", err)
      errorToast()
      setIsLoading(false)
    } finally {
      getRate()
      resetRate()
      setIsEdit(false)
    }
  }

  return (
    <>
      {!isEdit ? (
        <span
          style={{
            fontWeight: 500,
            fontSize: 16,
            cursor: "pointer",
          }}
          onClick={() => setIsEdit(true)}
          className="text-danger me-1 border-bottom border-danger"
        >
          {data || ""}
        </span>
      ) : (
        <div
          style={{ display: "inline-flex" }}
          className="flex-row align-items-center justyfy-content-center"
        >
          <div
            style={{ display: "inline-flex" }}
            className="flex-row align-items-center justyfy-content-center"
          >
            <button onClick={handleMinus} className="btn btn-sm btn-danger">
              <i className="mdi mdi-minus"></i>
            </button>
            <div
              className="border mx-1"
              style={{
                width: 36,
                height: 32,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {rate}
            </div>
            <button onClick={handlePlus} className="btn btn-sm btn-success">
              <i class="mdi mdi-plus"></i>
            </button>
          </div>

          <div
            style={{ display: "inline-flex" }}
            className="flex-row align-items-center justyfy-content-center ms-2 me-1"
          >
            <button
              onClick={handleSave}
              style={{ marginRight: 2 }}
              className="btn btn-sm btn-success"
              disabled={isLoading}
            >
              <i class="mdi mdi-16px mdi-check"></i>
            </button>
            <button onClick={handleCancel} className="btn btn-sm btn-secondary">
              <i class="mdi mdi-16px mdi-close"></i>
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default Rater
