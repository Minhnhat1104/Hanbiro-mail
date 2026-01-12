// @ts-nocheck
import { Popover } from "@mui/material"
import React from "react"

const FilterPopover = ({
  id = "filter-popover",
  type,
  anchorEl,
  isOpen,
  onClose,
  elevation = 3,
  contentComponent,
  anchorOrigin = {
    vertical: "bottom",
    horizontal: "left",
  },
  transformOrigin = {
    vertical: "top",
    horizontal: "left",
  },
  sx = {},
  contentClass = "p-2",
}) => {
  return (
    <Popover
      id={id}
      open={isOpen}
      onClose={onClose}
      anchorEl={anchorEl}
      elevation={elevation}
      anchorOrigin={anchorOrigin}
      transformOrigin={transformOrigin}
      sx={{ mt: 0.125, "& .MuiPaper-root": { minWidth: 150 }, ...sx }}
    >
      <div className={contentClass}>{contentComponent || "Hello, world!"}</div>
    </Popover>
  )
}

export default FilterPopover
