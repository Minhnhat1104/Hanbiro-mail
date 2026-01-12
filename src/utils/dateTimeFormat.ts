// @ts-nocheck
export const getDateFormat = (userGeneralConfigValue, seperator = "/", library = "datepicker") => {
  const date_format = userGeneralConfigValue?.date_format?.toUpperCase() || ""

  const date_format_arr = date_format.split("/")?.map((_item) => {
    if (_item === "Y") {
      return library === "datepicker" ? "yyyy" : "YYYY"
    } else if (_item === "M") {
      return "MM"
    } else if (_item === "D") {
      return library === "datepicker" ? "dd" : "DD"
    }
  })

  return date_format_arr.join(seperator)
}

export const getDateTimeFormat = (userGeneralConfigValue, dateSeperator = "/", library) => {
  const time_format = userGeneralConfigValue?.time_format?.toUpperCase() || ""

  const parsedDateFormat = getDateFormat(userGeneralConfigValue, dateSeperator, library)
  const parsedTimeFormat = time_format.replace("H", "HH").replace("I", "mm").replace("S", "ss")

  return [parsedDateFormat, parsedTimeFormat].join(" ")
  // return [parsedDateFormat, "HH:mm"].join(" ") // remove second
}

export function parseStrTimeToDate(value = "") {
  return new Date(`${new Date().toISOString().slice(0, 10)} ${value}`)
}
