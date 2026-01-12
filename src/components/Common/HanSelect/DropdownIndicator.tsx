// @ts-nocheck
import { ChevronDown } from "react-feather"

const DropdownIndicator = (props) => {
  return (
    <div
      style={{
        width: 24,
        height: 24,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ChevronDown strokeWidth={2} size={16} color="var(--bs-text-secondary)" />
    </div>
  )
}

export default DropdownIndicator
