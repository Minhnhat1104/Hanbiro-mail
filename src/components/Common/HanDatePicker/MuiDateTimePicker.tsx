// @ts-nocheck
import { Calendar } from "react-feather"

import { InputAdornment, ThemeProvider, createTheme, useTheme } from "@mui/material"
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers"
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment"
import moment from "moment"
import { getDateTimeFormat } from "utils/dateTimeFormat"
import { useSelector } from "react-redux"
import useDevice from "hooks/useDevice"
import i18n from "../../../i18n"
import { useEffect, useMemo, useState } from "react"

// DefaultProps {
//   inputFormat?: string;
//   value: Date | null;
//   onChange: (date: Date | null) => void;
//   disabled?: boolean;
//   size?: 'small' | 'medium';
//   ampm?: boolean;
//   sx?: SxProps;
//   timeSteps?: TimeStepOptions;
//   shouldDisableTime?: (value: dayjs.Dayjs, view: TimeView) => boolean;
//   disablePast?: boolean;
//   closeOnSelect?: boolean;
//   minTime?: Dayjs;
//   maxTime?: Dayjs;
//   viewsFormat?: DateOrTimeView[];
// }

const MuiDateTimePicker = (props) => {
  const {
    inputFormat,
    value,
    onChange,
    disabled,
    size = "medium",
    ampm = false,
    timeSteps,
    shouldDisableDate,
    shouldDisableTime,
    disablePast = false,
    minTime,
    maxTime,
    minDate,
    maxDate,
    closeOnSelect = true,
    viewsFormat = ["year", "month", "day", "hours", "minutes"],
    sx,
  } = props

  const theme = useTheme()

  // redux state
  const userConfig = useSelector((state) => state.Config.userConfig)
  const userGeneralConfigValue = useSelector((state) => state?.Config?.userConfig)
  const userDateTimeFormat = getDateTimeFormat(userGeneralConfigValue, "/", "MUI")
  const dateFormat = inputFormat ? inputFormat : userDateTimeFormat || "MM/DD/YYYY HH:mm"

  return (
    <LocalizationProvider dateAdapter={AdapterMoment} adapterLocale={userConfig?.lang}>
      <DateTimePicker
        desktopModeMediaQuery={`@media screen and (min-width: ${theme.breakpoints.values.md}px)`}
        format={dateFormat}
        value={moment(value)}
        views={viewsFormat}
        onChange={(val) => onChange(val ? val.toDate() : null)}
        disabled={disabled}
        ampm={ampm}
        timeSteps={timeSteps}
        shouldDisableDate={shouldDisableDate}
        shouldDisableTime={shouldDisableTime}
        slotProps={{
          popper: {
            sx: {
              "& .MuiButtonBase-root.MuiPickersDay-root.Mui-selected": {
                bgcolor: "var(--bs-primary)",
              },
              "& .MuiButtonBase-root.MuiMenuItem-root.Mui-selected": {
                bgcolor: "var(--bs-primary)",
              },
              "& .MuiDialogActions-root .MuiButtonBase-root": {
                color: "var(--bs-primary)",
              },
            },
          },
          mobilePaper: {
            sx: {
              "& .MuiTab-root.Mui-selected": {
                color: "var(--bs-primary)",
              },
              "& .MuiDialogActions-root .MuiButtonBase-root": {
                color: "var(--bs-primary)",
              },
              "& .MuiTabs-indicator,.MuiButtonBase-root.MuiPickersDay-root.Mui-selected,.MuiButtonBase-root.MuiMenuItem-root.Mui-selected,.MuiClockPointer-root,.MuiClock-pin":
                {
                  bgcolor: "var(--bs-primary)",
                },
              "& .MuiClockPointer-thumb": {
                bgcolor: "var(--bs-primary)",
                borderColor: "var(--bs-primary)",
              },
            },
          },
        }}
        minTime={minTime}
        maxTime={maxTime}
        minDate={minDate}
        maxDate={maxDate}
        slots={{
          openPickerIcon: Calendar,
        }}
        disablePast={disablePast}
        closeOnSelect={closeOnSelect}
        sx={{
          width: "100%",
          "& .MuiInputBase-root": {
            height: 38,
            fontSize: "14px",
            "&:hover": {
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "var(--bs-input-border-color)" },
            },
            "&.MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "var(--bs-primary)",
            },
            "&.MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline": {
              borderColor: "var(--bs-input-border-color)",
            },
            "& .MuiInputAdornment-root svg": { width: 18, height: 18 },
          },
        }}
      />
    </LocalizationProvider>
  )
}

export default MuiDateTimePicker
