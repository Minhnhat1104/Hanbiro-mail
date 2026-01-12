// @ts-nocheck
// React
import React, { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"

// Project
import { Headers, emailGet } from "helpers/email_api_helper"
import { BaseButton, BaseIcon } from "components/Common"
import { Card, CardBody, CardText } from "reactstrap"
import "./style.scss"

const OrgAutoComplete = (props) => {
  const { emails, setEmails, showInput = true, canEdit = true } = props
  const { t } = useTranslation()

  const [data, setData] = useState()

  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState("")
  const [itemEdit, setItemEdit] = useState({})
  const [search, setSearch] = useState(false)
  const [isScroll, setIsScroll] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const [debouncedKeyword, setDebouncedKeyword] = useState(keyword)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 })
  const [timeoutId, setTimeoutId] = useState(null)
  const divRef = useRef(null)
  const inputRef = useRef(null)
  const inputItemRef = useRef(null)

  // get data
  useEffect(() => {
    if (debouncedKeyword !== "") {
      fetchData()
    }
  }, [debouncedKeyword, page])

  // get data add
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setDebouncedKeyword(keyword)
    }, 500)

    if (keyword === "") {
      setPage(1)
    }
    return () => clearTimeout(delayDebounceFn)
  }, [keyword])

  // get data edit
  useEffect(() => {
    if (search) {
      setDebouncedKeyword(itemEdit?.username)
    }

    if (itemEdit?.username === "") {
      setPage(1)
    }
  }, [itemEdit, search])

  // Edit to focus input
  useEffect(() => {
    if (itemEdit?.id !== undefined && inputItemRef.current) {
      inputItemRef.current.focus()
    }
  }, [itemEdit])

  // find coordinates of selectbox
  useEffect(() => {
    if (keyword !== "" || itemEdit?.username !== "") {
      const inputElement = keyword !== "" ? inputRef.current : inputItemRef.current
      const divElement = divRef.current
      if (inputElement && divElement) {
        const inputRect = inputElement.getBoundingClientRect()
        const divRect = divElement.getBoundingClientRect()

        const top = inputRect.top - divRect.top + inputElement.offsetHeight
        const left = inputRect.left - divRect.left

        setDropdownPosition({ top, left })
      }
    }
  }, [keyword, itemEdit])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const params = {
        keyword: debouncedKeyword,
        page: page,
        limit: "15",
        tree: "dynatree",
      }
      const res = await emailGet(`ngw/org/tree/autocomplete`, params, Headers)

      if (data && page !== 1) setData([...data, ...res?.rows])
      else setData(res?.rows)

      if (res?.attrs.thispage === res?.attrs.totpage) setIsScroll(false)
      else setIsScroll(true)
      setIsLoading(false)
    } catch (err) {
      console.log("error messenger", err)
    }
  }

  // check scroll eng
  const handleScroll = (event) => {
    const dropdownMenuElement = event.target
    const isScrollEnd =
      dropdownMenuElement.scrollHeight - 1 ===
      dropdownMenuElement.scrollTop + dropdownMenuElement.clientHeight
    if (isScrollEnd) {
      setPage(page + 1)
    }
  }

  // set time out and clear time
  const handleInputClick = () => {
    clearTimeout(timeoutId)
  }
  const handleInputBlur = () => {
    const newTimeoutId = setTimeout(() => {
      if (keyword !== "") setKeyword("")
      if (search) {
        setItemEdit({})
        setSearch(false)
      }
    }, 200)
    setTimeoutId(newTimeoutId)
  }

  // add user
  const handleAddUser = (item) => {
    const isDuplicate = Object.values(emails?.selected).some(
      (existingItem) => existingItem.id === item.id,
    )

    if (!isDuplicate) {
      setEmails((prev) => ({ selected: { ...prev.selected, [item.id]: item } }))
    }
    setKeyword("")
  }

  // edit user
  const handleEditUser = (item) => {
    const newData = Object.values(emails?.selected).map((v) => {
      if (v.id === itemEdit.id) {
        return item
      }
      return v
    })
    const objectEmails = {}
    for (const item of newData) {
      objectEmails[item.id] = item
    }
    setEmails({ selected: objectEmails })
    setSearch(false)
  }

  return (
    <div className="form-control p-0 d-flex">
      <div
        className="d-flex flex-grow-1"
        style={{
          height: "150px",
          overflowY: "auto",
          position: "relative",
        }}
        ref={divRef}
      >
        <div className=" d-flex flex-wrap align-content-start" style={{ width: "94%" }}>
          {Object.values(emails?.selected).length > 0 &&
            Object.values(emails?.selected).map((item, idx) => {
              const isEdit = itemEdit?.id === item?.id
              return (
                <BaseButton
                  color={"soft-secondary"}
                  key={idx}
                  className="auto-complete-wrapper m-1 p-0"
                  type="button"
                >
                  <>
                    <span className="px-2">{item?.username}</span>
                    {canEdit && (
                      <BaseIcon
                        className={`color-green ${isEdit ? "invisible" : "visible"}`}
                        icon={"mdi mdi-pencil font-size-18"}
                        onClick={() => {
                          setItemEdit(item)
                        }}
                      />
                    )}
                    <BaseIcon
                      className={`color-red ${isEdit ? "invisible" : "visible"}`}
                      icon={"mdi mdi-trash-can-outline font-size-18 "}
                      onClick={() => {
                        const newEmails = emails.selected
                        delete newEmails[item?.key ?? item?.id]
                        setEmails({ selected: newEmails })
                      }}
                    />
                  </>
                  {isEdit && (
                    <div className="auto-complete-item d-flex">
                      <input
                        className="flex-grow-1 rounded-start px-1"
                        value={itemEdit?.username || ""}
                        style={{
                          border: "none",
                          width: `${itemEdit?.username.length + 1}ch`,
                        }}
                        onChange={(e) => {
                          setItemEdit((prev) => ({
                            ...prev,
                            username: e.target.value,
                          }))
                          setSearch(true)
                        }}
                        onClick={handleInputClick}
                        onBlur={handleInputBlur}
                        ref={inputItemRef}
                      />
                      <BaseIcon
                        className={"color-red"}
                        icon={"mdi mdi-window-close font-size-18"}
                        onClick={() => {
                          setItemEdit({})
                          setSearch(false)
                        }}
                      />
                    </div>
                  )}
                </BaseButton>
              )
            })}

          {showInput && (
            <input
              className="m-2"
              value={keyword}
              placeholder={t("common.common_placeholder_term")}
              style={{ border: "none", color: "inherit" }}
              onChange={(e) => {
                setKeyword(e.target.value)
                setPage(1)
              }}
              onClick={handleInputClick}
              onBlur={handleInputBlur}
              ref={inputRef}
            />
          )}
        </div>
        <div
          style={{
            position: "sticky",
            top: 0,
            alignSelf: "flex-start",
          }}
        >
          {Object.values(emails?.selected).length > 0 && (
            <BaseIcon
              className={"color-red p-1 base-icon-hidden"}
              icon={"mdi mdi-trash-can-outline font-size-22"}
              onClick={() => setEmails({ selected: {} })}
            />
          )}
          {isLoading && (
            <div className="spinner-border text-primary spinner-border-sm m-2" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          )}
        </div>
      </div>
      {data && data.length > 0 && (keyword !== "" || search) && (
        <Card
          className="shadow-lg"
          style={{
            position: "absolute",
            top: dropdownPosition.top,
            left: dropdownPosition.left,
            maxHeight: "150px",
            overflowY: "auto",
          }}
          onScroll={(e) => {
            if (isScroll) handleScroll(e)
          }}
        >
          <CardBody>
            {data.map((item, idx) => (
              <CardText
                key={idx}
                className="cursor-pointer"
                onClick={() => {
                  if (search) handleEditUser(item)
                  else handleAddUser(item)
                }}
              >
                {item?.title}
              </CardText>
            ))}
          </CardBody>
        </Card>
      )}
    </div>
  )
}

export default OrgAutoComplete
