// @ts-nocheck
// React
import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

// Third-party
import {
  Col,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  FormGroup,
  Label,
} from "reactstrap"

// Project
import { emailGet } from "helpers/email_api_helper"
import SearchInput from "components/SettingAdmin/SearchInput"
import { SHARING_RESIGNEE_MAILBOX } from "modules/mail/admin/url"

const IdAutoComplete = (props) => {
  const { title, idUpdate, pageSize = 10, classForm = "", user, setUser } = props
  const { t } = useTranslation()

  const [data, setData] = useState()

  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(false)
  const [search, setSearch] = useState("")

  // State refetch data
  const [refetch, setRefetch] = useState(true)

  // State for Update
  const [openDrop, setOpenDrop] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await emailGet(
          `${SHARING_RESIGNEE_MAILBOX}/quitlist/${page}/${pageSize}/${search}`,
        )
        //   add data for Dropdown
        if (data) setData([...data, ...res?.rows])
        else setData(res?.rows)

        setUser(res?.rows[0])
        setMaxPage(res?.page * res?.linenum >= res?.tot)
      } catch (err) {
        console.log("error messenger", err)
      }
    }

    if (refetch) {
      setRefetch(false)
      fetchData()
    }
  }, [refetch])

  // update Data Edit
  useEffect(() => {
    if (idUpdate) {
      setUser({ ...user, id: idUpdate })
    } else if (data) {
      setUser(data[0])
    }
  }, [idUpdate, data])

  // Search when enter
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      setSearch(event.target.value)
      setRefetch(true)
      setPage(1)
      setData([])
    }
  }

  return (
    <FormGroup className={`${classForm}`} row>
      <Label htmlFor="taskname" className="col-form-label col-lg-3">
        {title}
      </Label>
      <Col lg="9" className="d-flex align-items-center">
        <Dropdown
          className="w-100 read-only"
          isOpen={openDrop}
          toggle={() => {
            setOpenDrop(!openDrop)
          }}
          disabled={idUpdate}
        >
          <DropdownToggle
            className={`form-control ${
              idUpdate ? "cursor-not-allowed bg-light" : "cursor-pointer"
            }`}
            tag="span"
            caret
          >
            {user?.id}
          </DropdownToggle>
          <DropdownMenu className="w-100" style={{ height: "200px", overflow: "auto" }} end>
            <DropdownItem header>
              <SearchInput onKeyDown={handleKeyPress} />
            </DropdownItem>
            {data &&
              data.map((item, idx) => (
                <DropdownItem key={idx} onClick={() => setUser(item)}>
                  {item?.name}
                </DropdownItem>
              ))}
            {!maxPage && (
              <DropdownItem className="d-flex justify-content-center">
                <div
                  className="text-primary"
                  onClick={(e) => {
                    e.stopPropagation()
                    setPage(page + 1)
                    setRefetch(true)
                  }}
                >
                  {t("common.common_load_more")}
                </div>
              </DropdownItem>
            )}
          </DropdownMenu>
        </Dropdown>
      </Col>
    </FormGroup>
  )
}

export default IdAutoComplete
