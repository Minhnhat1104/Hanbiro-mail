// @ts-nocheck
import { IconButton, MenuItem, Select, useTheme } from "@mui/material"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Input } from "reactstrap"
import "./style.scss"
import useDevice from "hooks/useDevice"
import { isEqual } from "lodash"

const PaginationV2 = ({
  onChangePage,
  setPageSize,
  pageSize,
  pageIndex,
  pageCount,
  isSplitMode = false,
  isFetching = false,
  isHideSetLimit = false,
  isHidePageInfo,
  hideBorderTop = false,
  hideRowPerPage = false,
  isNoPaddingX = false,
}) => {
  const { t } = useTranslation()
  const { isMobile } = useDevice()

  const [open, setOpen] = useState(false)
  const [pageValue, setPageValue] = useState(1)

  const totalPages = Math.ceil(pageCount / pageSize)

  useEffect(() => {
    if (pageIndex) {
      if (!isEqual(pageIndex, pageValue)) {
        setPageValue(pageIndex)
      }
    } else {
      setPageValue(1)
    }
  }, [pageIndex])

  const handleClose = () => {
    setOpen(false)
  }

  const handleOpen = () => {
    setOpen(true)
  }

  const handleChangePagination = (value) => {
    onChangePage(value)
  }

  const handlePageSizeChange = (event) => {
    const newPageSize = +event.target.value
    setPageSize && setPageSize("items_per_page", newPageSize.toString())
  }

  const isLastItem = pageCount - (pageIndex - 1) * pageSize === 1

  const listPageOf =
    pageIndex === totalPages
      ? pageCount === 0
        ? 0
        : isLastItem
        ? pageCount
        : `${(pageIndex - 1) * pageSize + 1} / ${pageCount}`
      : `${(pageIndex - 1) * pageSize + 1} / ${pageIndex * pageSize}`

  const listPageSize = [5, 10, 15, 20, 25, 30, 35, 40, 50, 60, 80, 100]

  return (
    <div
      className={`pagination-v2 ${isMobile && !isNoPaddingX ? "px-2" : ""} ${
        isMobile && !hideBorderTop ? "pb-2 border-1" : ""
      }
     d-flex justify-content-between align-items-center flex-wrap`}
      style={{ paddingTop: isMobile ? "12px" : "unset" }}
    >
      <div
        className={`${
          isMobile || hideRowPerPage ? "w-100" : ""
        } d-flex justify-content-between align-items-center`}
      >
        <div className="d-flex align-items-center">
          {!isHidePageInfo && (
            <span className="han-caption han-fw-medium han-text-secondary me-1">{` ${t(
              "common.common_total",
            )} ${pageCount} | ${t("common.common_list_page")} ${pageIndex} / ${totalPages}`}</span>
          )}
        </div>
        <div className="ms-1 d-flex align-items-center">
          <IconButton
            className="me-1"
            size="medium"
            sx={{
              width: 32,
              color: pageIndex > 1 ? "grey.600" : "grey.300",
              "&:hover": {
                borderColor: pageIndex > 1 ? "grey.500" : "grey.300",
                bgcolor: pageIndex > 1 ? "grey.100" : "inherit",
                color: pageIndex > 1 ? "grey.600" : "grey.300",
              },
            }}
            variant="text"
            shape="rounded"
            disabled={Boolean(isFetching) || pageIndex === 1 || pageCount == 0}
            onClick={() => handleChangePagination(pageIndex - 1)}
          >
            <i className="fa fa-chevron-left font-size-16" />
          </IconButton>
          <IconButton
            size="medium"
            sx={{
              width: 32,
              color: pageIndex < totalPages ? "grey.600" : "grey.300",
              "&:hover": {
                borderColor: pageIndex < totalPages ? "grey.500" : "grey.300",
                bgcolor: pageIndex < totalPages ? "grey.100" : "inherit",
                color: pageIndex < totalPages ? "grey.600" : "grey.300",
              },
            }}
            variant="text"
            shape="rounded"
            disabled={Boolean(isFetching) || pageIndex === totalPages || pageCount == 0}
            onClick={() => handleChangePagination(pageIndex + 1)}
          >
            <i className="fa fa-chevron-right font-size-16" />
          </IconButton>
          <span className="han-caption han-fw-medium han-text-secondary me-2">
            {t("common.common_list_page")}
          </span>
          <Input
            className={`han-text-primary han-bg-color-soft-grey border-0 page-number text-center`}
            style={{
              maxWidth: pageValue < 10 ? 36 : pageValue < 100 ? 44 : 50,
            }}
            bsSize={"small"}
            value={pageValue}
            onChange={(e) => {
              setPageValue(parseInt(e.target.value) || 0)
            }}
            onBlur={(e) => {
              const page = parseInt(e.target.value)
              if (page >= 1 && page <= totalPages) {
                onChangePage(page)
              } else {
                onChangePage(totalPages)
                setPageValue(totalPages)
              }
            }}
            onKeyDown={(e) => {
              if (e?.key === "Enter") {
                const page = parseInt(e.target.value)
                if (page >= 1 && page <= totalPages) {
                  onChangePage(page)
                } else {
                  onChangePage(totalPages)
                  setPageValue(totalPages)
                }
              }
            }}
            disabled={pageCount == 0}
          />
        </div>
      </div>
      {!isMobile && !hideRowPerPage && (
        <div className="d-flex align-item-center">
          {/*<span className="han-caption han-fw-medium han-text-secondary lh-1 align-self-center me-2">Row per page</span>*/}
          <Select
            className={`row-per-page d-flex align-items-center justify-content-center`}
            size="small"
            open={open}
            onClose={handleClose}
            onOpen={handleOpen}
            value={pageSize}
            disabled={pageCount == 0}
            onChange={handlePageSizeChange}
          >
            {listPageSize.map((v) => (
              <MenuItem sx={{ fontSize: "inherit", fontFamily: "inherit" }} key={v} value={v}>
                {v}
              </MenuItem>
            ))}
          </Select>
        </div>
      )}
    </div>
  )
}

export default PaginationV2
