// @ts-nocheck
import React from "react"
import "./styles.scss"
import BackButton from "pages/Main/BackButton"
import MailDetailButton from "../HeaderDetail/MailDetailButton"
import { useDispatch, useSelector } from "react-redux"
import { setShowSidebar } from "store/viewMode/actions"

const MobileHeader = (props) => {
  const dispatch = useDispatch()

  const isShowSidebar = useSelector((state) => state.viewMode.isShowSidebar)

  const toggleSidebar = () => {
    dispatch(setShowSidebar(!isShowSidebar))
  }

  return (
    <div className="detail-mobile-header">
      <div className="d-flex align-items-center">
        {/*<button*/}
        {/*  type="button"*/}
        {/*  onClick={() => {*/}
        {/*    toggleSidebar()*/}
        {/*  }}*/}
        {/*  className="btn btn-sm px-2 font-size-16 header-item "*/}
        {/*  id="vertical-menu-btn"*/}
        {/*>*/}
        {/*  <i className="fa fa-fw fa-bars" />*/}
        {/*</button>*/}
        <BackButton />
      </div>

      <MailDetailButton {...props} />
    </div>
  )
}

export default MobileHeader
