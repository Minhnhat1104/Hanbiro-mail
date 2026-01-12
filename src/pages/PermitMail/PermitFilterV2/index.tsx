// @ts-nocheck
import { BaseButton, BaseIcon } from "components/Common"
import useDevice from "hooks/useDevice"
import { useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import PermitFilterModal from "./PermitFilterModal"

const PermitFilterV2 = ({ isShowIcon }) => {
  const { t } = useTranslation()
  const { menu } = useParams()
  const { isDesktop, isMobile } = useDevice()

  const filterRef = useRef(null)

  const isReceiveMenu = menu === "Receive"
  const isSecureMenu = menu === "Secure"

  const [openFilter, setOpenFilter] = useState(false)

  return (
    <>
      {!isReceiveMenu && !isSecureMenu && (
        <div ref={filterRef}>
          {isMobile || isShowIcon ? (
            <BaseIcon
              className="filter-icon mdi mdi-filter-outline mx-2 han-color-grey-light font-size-18"
              onClick={() => setOpenFilter(true)}
            />
          ) : (
            <BaseButton
              color="grey"
              iconClassName={"me-0"}
              className={"filter-button btn-filter btn-action"}
              icon={"mdi mdi-filter-outline font-size-16"}
              onClick={() => setOpenFilter(true)}
            ></BaseButton>
          )}
        </div>
      )}

      <PermitFilterModal
        isOpen={openFilter}
        anchorEl={filterRef?.current}
        onClose={() => setOpenFilter(false)}
        isHideFilterButton={isReceiveMenu || isSecureMenu}
      />
    </>
  )
}

export default PermitFilterV2
