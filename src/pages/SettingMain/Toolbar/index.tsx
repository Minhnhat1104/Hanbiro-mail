// @ts-nocheck

const Toolbar = (props) => {
  const {
    start = <></>,
    end = <></>,
    display = {
      start: "row",
      end: "row"
    }
  } = props

  return (
    <div className={`d-flex justify-content-between align-items-start gap-2 mb-2`}>
      <div className={`d-flex ${display.start === "row" ? "justify-content-start align-items-center gap-2" : "flex-column"}`}>
        {start}
      </div>
      <div className={`d-flex justify-content-end align-items-center gap-2`}>
        {end}
      </div>
    </div>
  )
}

export default Toolbar