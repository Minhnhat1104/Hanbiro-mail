// @ts-nocheck
// React
import React from "react"

// Project
import SentMailItem from "./SentMailItem"

const SentMailList = ({ mailListState = {}, setMailListState, onActionModal = () => {}, renderCheckBox = () => {} }) => {
  return (
    <div
      className={`my-2 ${
        mailListState?.data?.length > 5 ? "scroll-sent-list" : ""
      }`}
    >
      {mailListState?.data?.length > 0 &&
        mailListState?.data?.map((mail, index) => (
          <React.Fragment key={index}>
            <SentMailItem
              index={index}
              mail={mail}
              mailListState={mailListState}
              setMailListState={setMailListState}
              onActionModal={onActionModal}
              renderCheckBox={renderCheckBox}
            />
          </React.Fragment>
        ))}
    </div>
  )
}

export default SentMailList
