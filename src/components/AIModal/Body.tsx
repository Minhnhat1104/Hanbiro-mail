// @ts-nocheck
import "./styles.scss"
import SummaryItem from "./SummaryItem"

const Body = ({ type, curLang, renderData, langList, onCopy }) => {
  return (
    <>
      {renderData?.map((item, index) => (
        <SummaryItem
          key={item?.mid || index}
          type={type}
          index={index}
          item={item}
          onCopy={onCopy}
          curLang={curLang}
          langList={langList}
        />
      ))}
    </>
  )
}

export default Body
