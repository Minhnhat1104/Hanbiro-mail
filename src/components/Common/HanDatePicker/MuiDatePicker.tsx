// @ts-nocheck
import { Calendar } from "react-feather"

import { useTheme } from "@mui/material"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"

import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment"
import moment from "moment"
import { useSelector } from "react-redux"
import { getDateFormat } from "utils/dateTimeFormat"


// DefaultProps {
//   inputFormat?: string;
//   value: Date | string | null;
//   onChange: (date: Date | null) => void;
//   disabled?: boolean;
//   size?: 'small' | 'medium';
//   minDate?: any; // set minDate for schedule can not select day in past
//   fullWidth?: boolean;
//   inputSx?: SxProps;
//   views?: Array<'day' | 'month' | 'year'>;
//   openTo?: 'day' | 'month' | 'year';
//   disablePast?: boolean;
//   shouldDisableDate?: (day: dayjs.Dayjs) => boolean;
// }

const MuiDatePicker = (props) => {
  const {
    inputFormat,
    value,
    onChange,
    disabled,
    size = "medium",
    minDate,
    fullWidth = true,
    inputSx,
    views,
    openTo,
    disablePast = false,
    shouldDisableDate,
  } = props

  const theme = useTheme()

  // redux state
  const userConfig = useSelector((state) => state.Config.userConfig)
  const userGeneralConfigValue = useSelector((state) => state?.Config?.userConfig)
  const userDateFormat = getDateFormat(userGeneralConfigValue, "/", "MUI")
  const dateFormat = inputFormat ? inputFormat : userDateFormat || "MM/DD/YYYY"

  return (
    <LocalizationProvider adapterLocale={userConfig?.lang} dateAdapter={AdapterMoment}>
      <DatePicker
        desktopModeMediaQuery={`@media screen and (min-width: ${theme.breakpoints.values.md}px)`}
        format={dateFormat}
        value={moment(value)}
        onChange={(val) => onChange(val ? val.toDate() : null)}
        disabled={disabled}
        minDate={minDate}
        views={views}
        openTo={openTo}
        disablePast={disablePast}
        shouldDisableDate={shouldDisableDate}
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
        slots={{
          openPickerIcon: Calendar,
        }}
        sx={{
          width: fullWidth ? "100%" : "auto",
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
          ...inputSx,
        }}
      />
    </LocalizationProvider>
  )
}

export default MuiDatePicker
