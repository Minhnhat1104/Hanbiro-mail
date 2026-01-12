// @ts-nocheck
// React
import React, { useEffect, useState } from "react"

// Third-party
import { useTranslation } from "react-i18next"
import { Card, Col, Collapse, Row } from "reactstrap"

// Project
import Tooltip from "components/SettingAdmin/Tooltip"
import { BaseButton } from "components/Common"
import RadioButton from "components/Common/Form/RadioButton"
import { useCustomToast } from "hooks/useCustomToast"
import { postMailToHtml5 } from "modules/mail/common/api"
import Loading from "components/Common/Loading"
import Rater from "./Rater"

const SpamFilter = (props) => {
  const { data = {}, handleModal = () => {}, isOpen = false, spamFilter = [], getRate } = props
  const { t } = useTranslation()
  const { successToast, errorToast } = useCustomToast()

  const [isLoading, setIsLoading] = useState(false)

  const [dataClone, setDataClone] = useState({})

  useEffect(() => {
    const dataClone = { ...data }
    setDataClone(dataClone)
  }, [data])

  const handleSave = async (data = {}, isOpen) => {
    let mode = data?.typeSpam
    if (!isOpen) {
      mode = "rate"
    }
    const newData = {}
    if (mode == "rate") {
      // get
      newData.mode = mode
      newData.rate = data?.rate
    } else if (mode == "usemanagerdb") {
      // get
      newData.mode = mode
    } else if (mode == "newuserdb") {
      // get
      newData.mode = mode
    } else if (mode == "justwhite") {
      // get
      newData.mode = mode
    } else if (mode == "spamoff") {
      // get
      newData.mode = mode
    } else return

    setIsLoading(true)

    try {
      const postParams = {
        act: "spam",
        ...newData,
      }
      const res = await postMailToHtml5(postParams)
      if (res.success == "1") {
        if (mode == "usemanagerdb") {
          setDataClone({ ...dataClone, msgShow: false, msg: "", rate: 90 })
        } else if (mode == "justwhite") {
          setDataClone({
            ...dataClone,
            msgShow: true,
            msg: "<span>Receive mail from addreses registered to the Whitelist only.</span>",
            rate: 90,
          })
        } else if (mode == "spamoff") {
          setDataClone({
            ...dataClone,
            msgShow: true,
            msg: "<span>No spam filter running. Please activate an option for protection.</span>",
            rate: 90,
          })
        } else if (mode == "useuserdb") {
          setDataClone({ ...dataClone, msgShow: false, msg: "", rate: 90 })
        }
        successToast()
        setIsLoading(false)
      } else {
        if (!res?.success) {
          errorToast()
        }
        setIsLoading(false)
      }
    } catch (err) {
      errorToast()
      setIsLoading(false)
    }
  }

  return (
    <div className="position-relative">
      <div className="mb-0">
        <div>
          {!data?.msgShow && (
            <span className="d-block mb-1">
              {data?.typeSpam != "usemanagerdb" && (
                <span className="description">{t("mail.mail_set_spam_userdbmsg2")}</span>
              )}

              {data?.typeSpam === "usemanagerdb" && (
                <>
                  {t("mail.mail_set_spam_admindbmsg2")}
                  {t("mail.mail_set_spam_dbmsg")}
                  {/* <span className="text-danger">{data?.rate || ""}</span> */}
                  <Rater data={data?.rate} getRate={getRate} />
                  {"% " + t("mail.mail_set_spam_dbmsg2")}
                </>
              )}
            </span>
          )}
          <Tooltip
            content={
              <div>
                <span dangerouslySetInnerHTML={{ __html: t("mail.mail_set_spam_spammsg") }}></span>
                <br />
                <span dangerouslySetInnerHTML={{ __html: t("mail.mail_set_spam_spammsg2") }}></span>
              </div>
            }
          />
        </div>
        <div>
          <BaseButton
            color="primary"
            icon="mdi mdi-plus font-size-18"
            type="button"
            onClick={handleModal}
            style={{ height: "38px" }}
          >
            {t("mail.mail_set_spam_setstat")}
          </BaseButton>
        </div>
        <Collapse isOpen={isOpen} className="pt-3 spam-list-helper-conatiner">
          <h4>{t("mail.mail_set_spam_setstat")}</h4>
          <div className="select-optionSpam pt-3">
            <RadioButton
              options={spamFilter}
              value={data.typeSpam}
              onChange={(e, value) => setDataClone({ ...dataClone, typeSpam: value })}
              valueDisable={data?.disableUseManagerDb ? "usemanagerdb" : ""}
            />
          </div>
          {dataClone?.typeSpam === "usemanagerdb" && (
            <div className="alert alert-success" id="spam-set-t1">
              <ul className="list-unstyled">
                <li>{t("mail.mail_set_spam_admindbmsg")}</li>
                {!!dataClone?.admindbuser && (
                  <li>
                    {t("mail.mail_set_spam_admindbmsg4")}{" "}
                    <span className="green">{data.admindbuser}</span>{" "}
                    {t("mail.mail_set_spam_admindbmsg5")}
                  </li>
                )}
              </ul>
            </div>
          )}
          {dataClone?.typeSpam === "newuserdb" && (
            <div className="alert alert-success" id="spam-set-t2">
              <ul className="list-unstyled">
                {!data.user_db && <li>{t("mail.mail_set_spam_userdbmsg")}</li>}
                {!data.user_db && <li>{t("mail.mail_set_spam_userdbmsg3")}</li>}
                {!!data.user_db && <li>{t("mail.mail_set_spam_makedbmsg")}</li>}
                <li>
                  {t("mail.mail_set_spam_makedbmsg3")} {t("mail.mail_set_spam_makedbmsg4")} [
                  {t("mail.mail_set_spam_makedb")}]{t("mail.mail_set_spam_makedbmsg5")}
                </li>
                <li>{t("mail.mail_set_spam_makedbmsg6")}</li>
                <li>{t("mail.mail_set_spam_makedbmsg7")}</li>
              </ul>
            </div>
          )}
          {dataClone?.typeSpam === "justwhite" && (
            <div className="alert alert-success" id="spam-set-t3">
              <ul className="list-unstyled">
                <li>{t("mail.mail_set_spam_whitemsg")}</li>
                <li>
                  {t("mail.mail_set_spam_whitemsg3")}{" "}
                  <span className="green">{dataClone?.numWhiteList || ""}</span>{" "}
                  {t("mail.mail_set_spam_whitemsg4")}
                </li>
                <li>{t("mail.mail_set_spam_whitemsg5")}</li>
              </ul>
            </div>
          )}
          {dataClone?.typeSpam === "spamoff" && (
            <div className="alert alert-success " id="spam-set-t4">
              {t("mail.mail_set_spam_stop_new_msg")}
            </div>
          )}
          <div className="d-flex justify-content-center p-2">
            <BaseButton color="primary" type="button" onClick={() => handleSave(dataClone, isOpen)}>
              {t("mail.mail_view_save")}
            </BaseButton>
          </div>
        </Collapse>
      </div>

      {isLoading && (
        <div className="position-absolute top-50 start-50 translate-middle">
          <Loading />
        </div>
      )}
    </div>
  )
}

export default SpamFilter
