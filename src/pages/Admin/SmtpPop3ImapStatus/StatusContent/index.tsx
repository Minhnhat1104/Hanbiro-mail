// @ts-nocheck
import classNames from "classnames"
import BaseIcon from "components/Common/BaseIcon"

const SmtpPop3ImapStatus = (props) => {
  const { t, item, type, onClickStatus } = props
  const information = item?.[type]

  function getStatusMessage(status) {
    if (status == "3") {
      return t("mail.mail_administrator_blocking")
    } else if (status == "2") {
      return t("mail.mail_authentication_blocking")
    } else if (status == "1") {
      return t("common.approval_formcode_useYes")
    } else {
      return t("common.approval_pwconfig_usePwcNo")
    }
  }

  return (
    <div>
      <div className={"d-flex align-items-center"}>
        <BaseIcon
          className={classNames("font-size-8", {
            "color-orange": information?.status == 3,
            "color-red": information?.status == 2,
            "color-green": information?.status == 1,
            "color-gray": information?.status == 0,
          })}
          icon={"fas fa-circle me-1"}
        />
        {getStatusMessage(information?.status)}
        {information?.status == 2 && (
          <BaseIcon
            icon={"fas fa-list"}
            onClick={() => {
              onClickStatus({
                type: type,
                item: item,
              })
            }}
          />
        )}
      </div>
      {information?.date && <div className={"color-gray ms-3"}>{information?.date}</div>}
      {information?.reason && (
        <div
          className={classNames("ms-3", {
            "color-orange": information?.status == 3,
            "color-red": information?.status == 2,
            "color-green": information?.status == 1,
            "color-gray": information?.status == 0,
          })}
        >
          {information.reason}
        </div>
      )}
    </div>
  )
}

export default SmtpPop3ImapStatus
