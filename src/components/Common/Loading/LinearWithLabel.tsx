// @ts-nocheck
import { Box, LinearProgress, Typography, linearProgressClasses, styled } from "@mui/material"

export const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[300],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === "light" ? "#1890FF" : "#308fe8",
  },
}))

function LinearWithMiddleLabel(props) {
  const { value, containerSx, ...others } = props
  return (
    <Box sx={{ display: "flex", alignItems: "center", position: "relative", ...containerSx }}>
      <Box sx={{ width: "100%" }}>
        <BorderLinearProgress variant="determinate" value={value} {...others} />
      </Box>
      <Typography
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          color: "var(--bs-white)",
          fontSize: 10,
        }}
      >{`${Math.round(value || 0)}%`}</Typography>
    </Box>
  )
}

export default LinearWithMiddleLabel
