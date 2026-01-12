// @ts-nocheck
import { MenuItem, MenuList, Popover } from "@mui/material"
import { useEffect, useRef, useState } from "react"
import TranslatorModal from "./TranslatorModal"
import "./styles.scss"

const TranslatorTool = (props) => {
  const { text = "", position, setContextPosition } = props
  const menuRef = useRef(null)

  const [openModal, setOpenModal] = useState(false)
  const [searchText, setSearchText] = useState("")

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current?.contains(event?.target)) {
        setContextPosition && setContextPosition(undefined)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div className="language-popup">
      <Popover
        open={Boolean(position)}
        anchorReference="anchorPosition"
        anchorPosition={{ top: position?.top || 0, left: position?.left || 0 }}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        className="language-popup"
      >
        <MenuList ref={menuRef} className="language-popup">
          <MenuItem
            className="language-popup font-size-13"
            onClick={() => {
              setSearchText(text)
              setOpenModal(true)
              setContextPosition && setContextPosition(undefined)
            }}
          >
            <span className="language-popup me-1">{`Translate: `}</span>
            <span className="language-popup han-fw-bold">{text}</span>
          </MenuItem>
        </MenuList>
      </Popover>
      {openModal && (
        <TranslatorModal
          isOpen={openModal}
          onClose={() => {
            setOpenModal(false)
            setContextPosition && setContextPosition(undefined)
          }}
          searchLang={searchText}
        />
      )}
    </div>
  )
}

export default TranslatorTool
