// @ts-nocheck
import { MenuItem, MenuList, Popover } from "@mui/material"
import { BaseButton, BaseIcon } from "components/Common"
import { useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { useSelector } from "react-redux"
import AiIcon from "./AiIcon"
import "flag-icon-css/css/flag-icons.min.css"

export const getFlagCode = (lang) => {
  switch (lang) {
    case "vi":
      return "vn"
    case "en":
      return "us"
    case "ko":
      return "kr"
    case "id":
      return "id"
    default:
      return "cn"
  }
}

const AISelectButton = ({ isSplitMode, setAiData, isNewWindow, isHoverButton, onClose }) => {
  const { t } = useTranslation()
  // const { isMobile } = useDevice()
  const isDetailView = useSelector((state) => state.mailDetail.isDetailView)
  const langList = useSelector((state) => state.EmailConfig?.langList) || []

  const aiRef = useRef(null)
  const translateRef = useRef(null)
  const [openAi, setOpenAi] = useState(false)
  const [openTranslate, setOpenTranslate] = useState(false)
  const [openSummary, setOpenSummary] = useState(false)
  const [isHoverAi, setIsHoverAi] = useState(false)

  const isDropdownButton = ((isDetailView || isHoverButton) && !isSplitMode) || isNewWindow

  const aiOptions = [
    { label: t("common.common_summary_msg"), value: "1", icon: <AiIcon /> },
    { label: t("common.translate_msg"), value: "2", icon: <BaseIcon icon="mdi mdi-translate" /> },
  ]

  const handleTranslate = (lang) => {
    setAiData({
      open: true,
      lang,
      type: "translate",
    })
  }

  const handleSummary = () => {
    setAiData({
      open: true,
      type: "summary",
    })
  }

  return (
    <>
      {isHoverButton ? (
        <BaseButton
          outline
          buttonRef={aiRef}
          className={`ai-button btn-outline-grey`}
          textClassName="han-fw-semibold font-size-16"
          onClick={(e) => {
            e.stopPropagation()
            setOpenAi(true)
          }}
          onMouseEnter={() => setIsHoverAi(true)}
          onMouseLeave={() => setIsHoverAi(false)}
        >
          <span className="d-flex align-items-center">
            <AiIcon isGradient={!isHoverAi} showLabel />
          </span>
        </BaseButton>
      ) : (
        <BaseButton
          outline
          buttonRef={aiRef}
          className={`btn-action gradient-border me-1 p-1 px-2 ${
            isDropdownButton ? "ai-button-view" : ""
          }`}
          iconClassName="me-0"
          onClick={(e) => {
            e.stopPropagation()
            setOpenAi(true)
          }}
        >
          <span className="d-flex align-items-center">
            <span className="d-flex align-items-center">
              <AiIcon stroke={2} isGradient showLabel size="small" />
            </span>
            {/* {isDropdownButton && <i className="bx bx-chevron-down font-size-16"></i>} */}
          </span>
        </BaseButton>
      )}

      <Popover
        id={"ai-popover"}
        open={openAi}
        onClose={() => {
          setOpenAi(false)
          onClose && onClose()
        }}
        anchorEl={aiRef.current}
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
        <MenuList sx={{ px: 0 }}>
          {aiOptions.map((item) => (
            <MenuItem
              key={item.value}
              onClick={() => {
                if (item.value === "1") {
                  handleSummary()
                  setOpenAi(false)
                  // onClose && onClose()
                } else {
                  setOpenTranslate(true)
                }
              }}
              sx={{
                pr: 1,
                display: item.value === "2" ? (isDropdownButton ? "block" : "none") : "block",
                fontSize: "13px",
                fontFamily: "inherit",
                "&.Mui-selected": {
                  color: "var(--bs-white)",
                  bgcolor: "var(--bs-primary)",
                  "&:hover": { color: "var(--bs-white)", bgcolor: "var(--bs-primary)" },
                },
              }}
              {...(item.value === "2" && {
                ref: translateRef,
              })}
            >
              <div className="w-100 d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center gap-2">
                  {item.icon}
                  {item.label}
                </div>
                {item.value === "2" && <i className="bx bx-chevron-right font-size-16"></i>}
              </div>
            </MenuItem>
          ))}
        </MenuList>

        <Popover
          id="translate-popover"
          sx={{ "& .MuiPaper-root": { mr: 3, minWidth: 150 } }}
          open={openTranslate}
          anchorEl={translateRef.current}
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          onClose={() => {
            setOpenTranslate(false)
            onClose && onClose()
          }}
        >
          <MenuList>
            {langList
              ?.map((_item) => ({
                ..._item,
                flagCode: getFlagCode(_item.value),
              }))
              ?.map((item) => (
                <MenuItem
                  key={item.value}
                  onClick={() => {
                    handleTranslate(item.value)
                    setOpenTranslate(false)
                    setOpenAi(false)
                    onClose && onClose()
                  }}
                  sx={{
                    pr: 0,
                    fontSize: "13px",
                    fontFamily: "inherit",
                    "&.Mui-selected": {
                      color: "var(--bs-white)",
                      bgcolor: "var(--bs-primary)",
                      "&:hover": { color: "var(--bs-white)", bgcolor: "var(--bs-primary)" },
                    },
                  }}
                >
                  <BaseIcon className={"me-2"} icon={`flag-icon flag-icon-${item.flagCode}`} />
                  {item.label}
                </MenuItem>
              ))}
          </MenuList>
        </Popover>
      </Popover>

      {/* summary pop-up */}
      <Popover
        id={"ai-popover"}
        open={openSummary}
        onClose={() => {
          setOpenSummary(false)
        }}
        anchorEl={aiRef.current}
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
        Summary Content
      </Popover>
    </>
  )
}

export default AISelectButton
