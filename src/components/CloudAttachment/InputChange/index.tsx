// @ts-nocheck
// React
import React, { useState, useEffect } from "react"
import moment from "moment"
import { BaseButton, BaseIcon } from "components/Common"
import { Input } from "reactstrap"
import MuiDateTimePicker from "components/Common/HanDatePicker/MuiDateTimePicker"
// Max: 2 billion
const maxNumber = 2000000000
const InputChange = ({ type, file, dateFormat, onCallback, postData, errorToast }) => {
  const [isEdit, setIsEdit] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [date, setDate] = useState(new Date())
  const [numberDownload, setNumberDownload] = useState(file.maxCount)

  useEffect(() => {
    if (type == "date") {
      setDate(getValue(file.expire))
    }
  }, [type, file.expire])

  function getValue(expire) {
    /**
     * H.Phuc <hoangphuc@hanbiro.vn> - 2025-05-12
     * Data: 20/01/2023 02:00 -> arrDate.length = 3 / Format same userData.date_format
     * + 04/29 02:00 -> arrDate.length = 2 / Doesn't same userData.date_format - does not have year
     * + 02:00 -> arrDate.length = 1 / Doesn't same userData.date_format - only have hours and minutes
     */
    try {
      var arrExpire = expire.split(" ")
      var arrDate = arrExpire[0].split("/")
      if (arrDate.length == 2) {
        // Does not have year have year and wrong format so set format YYYY/MM/DD as default
        var dateObj = new Date()
        expire = dateObj.getUTCFullYear() + "/" + expire
        return moment(expire, "YYYY/MM/DD HH:mm")
      } else if (arrDate.length == 1) {
        var hour = expire.split(":")
        return moment().set({ hour: hour[0], minute: hour[1] })
      }
    } catch (error) {
      console.log("error", error)
    }
    return expire
  }

  const callPostData = async (id, key, value) => {
    let params = {
      cid: id,
      ckey: key,
    }
    if (type == "date") {
      params.expire = value
    } else {
      params.maxcount = value
    }

    postData(params).then((res) => {
      if (res.success) {
        setIsEdit(false)
        onCallback && onCallback(type, params)
      } else {
        errorToast()
      }
      setIsLoading(false)
    })
  }

  const onSave = () => {
    if (type === "date") {
      if (!moment.isMoment(date)) {
        setIsLoading(true)
        callPostData(file.cid, file.ckey, moment(date).format(dateFormat))
      } else {
        setIsEdit(false)
      }
    } else {
      if (file.maxCount !== numberDownload) {
        callPostData(file.cid, file.ckey, numberDownload)
      } else {
        setIsEdit(false)
      }
    }
  }

  const onChangeDate = (date) => {
    setDate(date)
  }

  const onChangeInInput = (event) => {
    let newNumber = parseInt(event.target.value)
    if (newNumber > maxNumber) newNumber = maxNumber
    setNumberDownload(newNumber)
  }

  return (
    <>
      {isEdit ? (
        <div className="d-flex align-items-center justify-content-end">
          {type == "date" ? (
            <MuiDateTimePicker
              value={date}
              onChange={onChangeDate}
              timeSteps={{ minutes: 1 }}
              disabled={isLoading}
            />
          ) : (
            <Input
              type="number"
              min={0}
              max={maxNumber}
              style={{ width: 130 }}
              defaultValue={numberDownload}
              onChange={onChangeInInput}
            />
          )}

          <BaseButton
            outline
            color="grey"
            className={`btn-outline-grey`}
            textClassName="han-fw-semibold"
            style={{ padding: 0, margin: 5, border: 0 }}
            onClick={() => onSave()}
            disabled={isLoading}
          >
            <span className="d-flex align-items-center">
              <BaseIcon icon={"mdi mdi-check"} className={"font-size-18 mx-2"} />
            </span>
          </BaseButton>
          <BaseButton
            outline
            color="grey"
            className={`btn-outline-grey`}
            textClassName="han-fw-semibold"
            style={{ padding: 0, margin: 5, border: 0 }}
            onClick={() => setIsEdit(!isEdit)}
            disabled={isLoading}
          >
            <BaseIcon icon={"mdi mdi-close"} className={"font-size-18 mx-2"} />
          </BaseButton>
        </div>
      ) : (
        <div
          className="cursor-pointer han-color-primary"
          onClick={() => {
            setIsEdit(!isEdit)
          }}
        >
          {type == "date" ? file.expire : file.maxCount}
        </div>
      )}
    </>
  )
}

export default InputChange
