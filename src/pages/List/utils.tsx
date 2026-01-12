// @ts-nocheck
// Render to show cipher icon
export const showCipherIcon = (mail) => {
  const sentSecuInfo = mail?.sentsecuinfo
  if (sentSecuInfo && sentSecuInfo?.sentsecu_type) {
    if (sentSecuInfo?.sentsecu_type == "unabletostop") {
      if (mail?.isnew) {
        return (
          <i
            title="Unable to stop (Read)"
            className="mdi mdi-table-edit font-size-16"
            style={{ color: "red" }}
          >
            &nbsp;
          </i>
        )
      } else {
        return (
          <i
            title="Unable to stop (Unread)"
            className="mdi mdi-reiterate font-size-16"
            style={{ color: "red" }}
          >
            &nbsp;
          </i>
        )
      }
    } else {
      if (mail?.isnew) {
        return <></>
      } else {
        return <></>
      }
    }
  }
}

// Render to show sent secu status
export const showSentSecuStatus = (mail) => {
  const sentSecuInfo = mail?.sentsecuinfo
  if (mail?.acl == "Sent" && sentSecuInfo && sentSecuInfo?.sentsecu_status) {
    switch (sentSecuInfo?.sentsecu_status) {
      case "normal":
        return <span style={{ color: "green" }}>[{sentSecuInfo.sentsecu_status}] </span>
      case "expired":
      case "stop":
      case "overcount":
        return <span style={{ color: "red" }}>[{sentSecuInfo.sentsecu_status}] </span>
      default:
        return <span style={{ color: "red" }}>[Expired]</span>
    }
  }
  return <></>
}

export const decodeHtmlEntities = (str) => {
  const textarea = document.createElement("textarea")
  textarea.innerHTML = str
  return textarea.value
}
