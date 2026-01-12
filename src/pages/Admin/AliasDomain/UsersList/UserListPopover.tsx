// @ts-nocheck
import { BaseButton } from "components/Common"
import React, { useEffect, useRef, useState } from "react"
import FilterPopover from "./FilterPopover"
import { Headers, emailGet } from "helpers/email_api_helper"
import { URL_ALIAS_DOMAIN_GET_GROUP_USER_LIST } from "../constants"
import { useCustomToast } from "hooks/useCustomToast"
import useDevice from "hooks/useDevice"

const UserListPopover = ({ t, item }) => {
  const { successToast, errorToast } = useCustomToast()
  const { isMobile } = useDevice()

  const userListRef = useRef(null)

  const [isGetList, setIsGetList] = useState(false)
  const [loading, setLoading] = useState(false)
  const [userList, setUserList] = useState([])
  const [groGpInfo, setGroupInfo] = useState(null)
  const [openUserList, setOpenUserList] = useState(false)

  useEffect(() => {
    if (isGetList) getUserList()
  }, [isGetList])

  const getUserList = async () => {
    try {
      setLoading(true)
      const params = {
        groupid: item?.id || "",
      }
      const res = await emailGet(URL_ALIAS_DOMAIN_GET_GROUP_USER_LIST, params, Headers)
      if (res?.success) {
        setUserList(res?.userids)
        setGroupInfo(res?.groupinfo)
        setOpenUserList(true)
      } else {
        errorToast(res?.msg)
      }
    } catch (error) {
      errorToast()
    } finally {
      setIsGetList(false)
      setLoading(false)
    }
  }

  return (
    <>
      <BaseButton
        size={"sm"}
        color="grey"
        loading={loading}
        icon={"bx bx-group"}
        iconClassName={`text-white ${isMobile && "me-0"}`}
        buttonRef={userListRef}
        textClassName={"han-h5 text-white"}
        onClick={() => setIsGetList(true)}
      >
        {!isMobile && t("mail.mail_admin_spam_manager_users")}
      </BaseButton>
      <FilterPopover
        isOpen={openUserList}
        onClose={() => setOpenUserList(false)}
        anchorEl={userListRef?.current}
        id={`user-list-popover-${item?.groupno}`}
        contentClass="p-0"
        sx={{ maxWidth: 300 }}
        contentComponent={
          <div className="d-flex flex-column">
            <div className="p-2 han-h4 han-fw-medium han-bg-color-soft-grey text-truncate">
              {groGpInfo?.groupname}
            </div>
            <div className="p-2 d-flex flex-column gap-1">
              {userList?.map((user) => (
                <span key={user?.id} className="text-truncate">
                  {user?.name || ""}
                </span>
              ))}
            </div>
          </div>
        }
      />
    </>
  )
}

export default UserListPopover
