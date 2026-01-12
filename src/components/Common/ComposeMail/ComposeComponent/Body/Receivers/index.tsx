// @ts-nocheck
import { ComposeContext } from "components/Common/ComposeMail"
import CustomMenuList from "components/Common/CustomReactSelect/CustomMenuList"
import CustomMultipleValue from "components/Common/CustomReactSelect/CustomMultipleValue/CustomMultipleValue"
import { useContext, useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch } from "react-redux"
import { COL_LAYOUT_COMPOSE, MAX_HEIGHT_MENU } from ".."

import CustomOption from "components/Common/CustomReactSelect/CustomOption"
import { emailGet } from "helpers/email_api_helper"
import { Input } from "reactstrap"
import { openOrgModal } from "store/composeMail/actions"
import ComposeAutoComplete from "../ComposeAutoComplete"
import ComposeOrgButton from "./ComposeOrgButton"
import { isEmpty } from "lodash"
import DivError from "./DivError"

const Receivers = ({ innerRef, composeId, errors }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const {
    optionTo,
    toValue,
    handleChangeTo,
    handleCheckboxToValue,
    checkedValue,
    isSending,
    isLoading,
    handlePageCurrent,
    ccValue,
    handleChangeCc,
    handleChangeBcc,
    bccValue,
  } = useContext(ComposeContext)

  const [recentList, setRecentList] = useState([])
  const [isShowCC, setIsShowCC] = useState(() => (isEmpty(ccValue) ? false : true))
  const [isShowBCC, setIsShowBCC] = useState(() => (isEmpty(bccValue) ? false : true))

  useEffect(() => {
    emailGet("email/recentlist/1/15", {}, Headers).then((res) => {
      let newRecentList = []
      if (res?.row?.length > 0) {
        res.row.map((mail) => newRecentList.push({ value: mail, label: mail }))
      }
      setRecentList(newRecentList)
    })
  }, [])

  useEffect(() => {
    if (!isShowCC) {
      handleChangeCc([])
    }

    if (!isShowBCC) {
      handleChangeBcc([])
    }
  }, [isShowCC, isShowBCC])

  useEffect(() => {
    if (ccValue && ccValue.length > 0) {
      setIsShowCC(true)
    }

    if (bccValue && bccValue.length > 0) {
      setIsShowBCC(true)
    }
  }, [ccValue, bccValue])

  const handleOpenOrgModal = (type) => {
    dispatch(openOrgModal(type, composeId))
  }

  return (
    <>
      <ComposeAutoComplete
        isMulti
        innerRef={innerRef}
        title={t("common.mail_write_to")}
        value={toValue}
        onChange={handleChangeTo}
        optionGroup={optionTo}
        maxMenuHeight={MAX_HEIGHT_MENU}
        onMenuScrollToBottom={handlePageCurrent}
        component={<ComposeOrgButton t={t} type={"to"} handleOpenOrgModal={handleOpenOrgModal} />}
        customComponents={{
          MultiValue: CustomMultipleValue,
          MenuList: CustomMenuList,
          Option: CustomOption,
        }}
        mbForm="mb-form"
        col={COL_LAYOUT_COMPOSE}
        defaultOptions={recentList}
      />

      {errors?.to?.length > 0 && <DivError data={errors.to} />}

      {/* send to me */}
      <div className="w-100 d-flex justify-content-between mb-1">
        <div className="">
          <Input
            id={`send-to-me-${composeId}`}
            type="checkbox"
            onClick={(event) => handleCheckboxToValue(event)}
            onChange={() => {}}
            checked={checkedValue}
            className={isLoading || isSending ? "cursor-not-allowed" : "cursor-pointer"}
          />
          <label
            htmlFor={`send-to-me-${composeId}`}
            className={`mb-0 mx-2 ${
              isLoading || isSending ? "cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            {t("mail.mail_write_to_me")}
          </label>
        </div>

        <div className="sub-receivers d-flex gap-1">
          <span
            className={isShowCC ? "selected" : ""}
            onClick={() => {
              setIsShowCC((prev) => !prev)
            }}
          >
            {t("common.main_mail_cc")}
          </span>
          <span
            className={isShowBCC ? "selected" : ""}
            onClick={() => {
              setIsShowBCC((prev) => !prev)
            }}
          >
            {t("common.main_mail_bcc")}
          </span>
        </div>
      </div>

      {/* CC */}
      {isShowCC && (
        <ComposeAutoComplete
          title={t("common.main_mail_cc")}
          isMulti
          value={ccValue}
          onChange={handleChangeCc}
          optionGroup={optionTo}
          maxMenuHeight={MAX_HEIGHT_MENU}
          onMenuScrollToBottom={handlePageCurrent}
          component={<ComposeOrgButton t={t} type={"cc"} handleOpenOrgModal={handleOpenOrgModal} />}
          customComponents={{
            MultiValue: CustomMultipleValue,
            MenuList: CustomMenuList,
            Option: CustomOption,
          }}
          mbForm="mb-form mb-2"
          col={COL_LAYOUT_COMPOSE}
          defaultOptions={recentList}
        />
      )}
      {isShowCC && errors?.cc?.length > 0 && <DivError data={errors.cc} />}

      {isShowBCC && (
        <ComposeAutoComplete
          title={t("common.main_mail_bcc")}
          isMulti
          value={bccValue}
          onChange={handleChangeBcc}
          optionGroup={optionTo}
          maxMenuHeight={MAX_HEIGHT_MENU}
          onMenuScrollToBottom={handlePageCurrent}
          component={
            <ComposeOrgButton t={t} type={"bcc"} handleOpenOrgModal={handleOpenOrgModal} />
          }
          customComponents={{
            MultiValue: CustomMultipleValue,
            MenuList: CustomMenuList,
            Option: CustomOption,
          }}
          mbForm="mb-form mb-2"
          col={COL_LAYOUT_COMPOSE}
          defaultOptions={recentList}
        />
      )}
      {isShowBCC && errors?.bcc?.length > 0 && <DivError data={errors.bcc} />}
    </>
  )
}

export default Receivers
