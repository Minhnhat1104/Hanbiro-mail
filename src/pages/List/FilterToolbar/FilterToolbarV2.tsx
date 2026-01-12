// @ts-nocheck
import { BaseButton, BaseIcon } from "components/Common"
import { Fragment, useRef, useState } from "react"
import { Filter } from "react-feather"
import { useTranslation } from "react-i18next"
import { useParams } from "react-router-dom"
import FilterModal from "./FilterModal"
import useDevice from "hooks/useDevice"
import HanTooltip from "components/Common/HanTooltip"

const FilterToolbarV2 = ({ isShowIcon = false }) => {
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
              className="filter-icon mdi mdi-filter-outline mx-2 font-size-18 han-text-secondary"
              onClick={() => setOpenFilter(true)}
            />
          ) : (
            <HanTooltip placement="top" overlay={t("mail.mail_secure_filter")}>
              <BaseButton
                color="grey"
                className={"filter-button btn-action"}
                icon={"mdi mdi-filter-outline fs-5 han-text-secondary"}
                iconClassName={"me-0"}
                onClick={() => setOpenFilter(true)}
              ></BaseButton>
            </HanTooltip>
          )}
        </div>
      )}

      <FilterModal
        isOpen={openFilter}
        anchorEl={filterRef?.current}
        onClose={() => setOpenFilter(false)}
        isHideFilterButton={isReceiveMenu || isSecureMenu}
      />
    </>
  )
}

export default FilterToolbarV2
