// @ts-nocheck
import { components } from "react-select"
const CustomOption = (props) => {
  const { children, selectProps } = props

  const { inputValue } = selectProps

  // Function to escape special regex characters
  const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  }

  // Function to convert special characters to HTML entities
  const encodeHTML = (str) => {
    return str.replace(/</g, "&lt;").replace(/>/g, "&gt;")
  }

  const highlightText = (text, searchTerm) => {
    if (!searchTerm) return encodeHTML(text)
    const escapedTerm = escapeRegExp(searchTerm)
    const regex = new RegExp(`(${escapedTerm})`, "gi")
    const highlightedText = encodeHTML(text).replace(regex, `<strong>$1</strong>`)
    return highlightedText
  }

  return (
    <components.Option {...props}>
      {inputValue ? (
        <span dangerouslySetInnerHTML={{ __html: highlightText(children, inputValue) }} />
      ) : (
        children
      )}
    </components.Option>
  )
}

export default CustomOption
