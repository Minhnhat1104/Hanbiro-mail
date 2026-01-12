// @ts-nocheck
import { MenuItem, MenuList, Popover } from "@mui/material"
import { BaseButton, BaseIcon } from "components/Common"
import HanTooltip from "components/Common/HanTooltip"
import useDevice from "hooks/useDevice"
import React, { useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { useParams, useSearchParams } from "react-router-dom"
import { setQueryParams } from "store/mailList/actions"

const FilterStatus = ({ pageLimit, handleClickExcludedMailbox = () => {} }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { menu } = useParams()

  const { isMobile } = useDevice()

  const filterRef = useRef(null)

  const [searchParams, setSearchParams] = useSearchParams()
  const [openFilter, setOpenFilter] = useState(false)

  const queryParams = useSelector((state) => state.QueryParams.query)

  const isReceiptsMenu = menu === "Receive"

  const optionsStatus = [
    { label: t("common.mail_list_search_allfield"), value: "" },
    { label: t("mail.mail_status_unread_mail"), value: "new" },
    { label: t("mail.mail_status_important_mail"), value: "flag" },
  ]

  const handleChangeStatus = (value) => {
    let nParams = {
      ...queryParams,
      viewcont: `0,${pageLimit}`,
      ...(value && { msgsig: value }),
    }
    if (!value) {
      delete nParams?.msgsig
    }
    dispatch(setQueryParams(nParams))
    setSearchParams(nParams)
  }

  const handleChangeAttachment = () => {
    let nParams = { ...queryParams, viewcont: `0,${pageLimit}` }
    const isAtt = nParams?.isfile === "true"

    if (isAtt) {
      delete nParams.isfile
    } else {
      nParams.isfile = "true"
    }
    dispatch(setQueryParams(nParams))
    setSearchParams(nParams)
  }

  return (
    <>
      <div className="d-flex">
        {/* attachment */}
        {!isReceiptsMenu && (
          <>
            {isMobile ? (
              <div className="d-flex align-items-center">
                <BaseIcon
                  className={"p-2"}
                  icon={`fas fa-paperclip han-text-${
                    queryParams?.isfile === "true" ? "primary" : "secondary"
                  } font-size-16`}
                  onClick={handleChangeAttachment}
                />
              </div>
            ) : (
              <HanTooltip placement="top" overlay={t("mail.mail_search_has_file")} trigger="hover">
                <div className="d-flex align-items-center">
                  <BaseIcon
                    className={"px-3 px-2"}
                    icon={`fas fa-paperclip han-text-${
                      queryParams?.isfile === "true" ? "primary" : "secondary"
                    } font-size-16`}
                    onClick={handleChangeAttachment}
                  />
                </div>
              </HanTooltip>
            )}
          </>
        )}

        {menu === "all" && (
          <HanTooltip placement="top" overlay={t("mail.mail_excluded_mail")}>
            <BaseButton
              color={`grey`}
              className={`btn-action mx-2`}
              icon={"bx bx-list-minus"}
              iconClassName={`font-size-24`}
              iconPosition={`right`}
              onClick={handleClickExcludedMailbox}
            />
          </HanTooltip>
        )}

        {/* status */}
        {isMobile ? (
          <BaseButton
            outline
            buttonRef={filterRef}
            color={""}
            className={"p-1"}
            iconClassName="me-0"
            icon={"mdi mdi-filter-outline han-text-secondary font-size-18"}
            style={{ width: "auto" }}
            onClick={(e) => {
              e.stopPropagation()
              setOpenFilter(true)
            }}
          ></BaseButton>
        ) : (
          <HanTooltip placement="top" overlay={t("common.common_filter")} trigger="hover">
            <BaseButton
              color={"grey"}
              buttonRef={filterRef}
              className={"btn-action"}
              icon={"mdi mdi-filter-outline font-size-18"}
              iconClassName="me-0"
              onClick={(e) => setOpenFilter(true)}
            ></BaseButton>
          </HanTooltip>
        )}
      </div>

      <Popover
        id={"filter-status-popover"}
        open={openFilter}
        onClose={() => setOpenFilter(false)}
        anchorEl={filterRef.current}
        elevation={3}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{ mt: 0.25, "& .MuiPaper-root": { minWidth: 150 } }}
      >
        <MenuList sx={{ px: 1 }}>
          {optionsStatus.map((item) => (
            <MenuItem
              key={item.value}
              selected={(queryParams?.["msgsig"] || "") === item.value}
              onClick={() => {
                handleChangeStatus(item.value)
                setOpenFilter(false)
              }}
              sx={{
                fontSize: "13px",
                fontFamily: "inherit",
                "&.Mui-selected": {
                  color: "var(--bs-white)",
                  bgcolor: "var(--bs-primary)",
                  "&:hover": { color: "var(--bs-white)", bgcolor: "var(--bs-primary)" },
                },
              }}
            >
              {item.label}
            </MenuItem>
          ))}
        </MenuList>
      </Popover>
    </>
  )
}

export default FilterStatus
