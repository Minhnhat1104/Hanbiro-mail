// @ts-nocheck
// Handle get signature from data of api get draft mail -> Using for Draft Mail
export const extractSignature = (htmlString) => {
  if (htmlString) {
    const startTag = "<!--HanbiroSignatureStart-->"
    const endTag = "<!--HanbiroSignatureEnd-->"

    const startIndex = htmlString?.indexOf(startTag)
    const endIndex = htmlString?.indexOf(endTag) + endTag?.length

    if (startIndex !== -1 && endIndex !== -1) {
      return {
        text: (htmlString?.slice(0, startIndex) + htmlString?.slice(endIndex))?.replace(
          /(\r\n|\n|\r)/gm,
          "",
        ),
        signature: htmlString?.substring(startIndex, endIndex),
      }
    }
    return htmlString
  }
  return ""
}

// Handle insert signature prefix to signature
export const insertHanbiroSignaturePrefix = (htmlString) => {
  if (htmlString) {
    const startTag = "<!--HanbiroSignatureStart-->"
    const endTag = "<!--HanbiroSignatureEnd-->"

    const startIndex = htmlString?.includes(startTag)
    const endIndex = htmlString?.includes(endTag)

    if (!startIndex && !endIndex) {
      return startTag + htmlString + endTag
    }
    return htmlString
  }
  return ""
}

// Handle get data from html and body
export const getDataFromHtml = (html) => {
  const match = html.match(/<body>([\s\S]*?)<\/body>/)
  return match ? match[1] : html
}

export const updateSignature = (content, newSignature, composeType = "") => {
  const regex = /<!--HanbiroSignatureStart-->(.|\n)*?<!--HanbiroSignatureEnd-->/g

  if (content.match(new RegExp("<!--HanbiroSignatureStart-->"))) {
    let _newSignature = $("<div />").html(newSignature).html()

    _newSignature = _newSignature.match(regex)
      ? _newSignature.match(regex)[0]
      : applyDefaultFont(_newSignature)

    content = content.replace(content.match(regex)[0], _newSignature)
    return content
  }

  return composeType !== "" ? newSignature + content : content + newSignature
}

export const signatureRemoveSpace = (item) => {
  const ele = item
  if (ele.getAttribute("name") === "HanbiroSignature") {
    let eleDelete = ele.querySelector("div > div")
    if (eleDelete) {
      let text = eleDelete.textContent.trim()
      let html = eleDelete.innerHTML
      let checkImg = html.indexOf("<img")
      if (text === "" && checkImg === -1) {
        eleDelete.remove()
        text = ele.textContent.trim()
        html = ele.innerHTML.trim()
        checkImg = html.indexOf("<br><img")
        if (text === "" && checkImg !== -1) {
          html = html.replace("<br><img", "<img")
          ele.innerHTML = html
        }
      }
    } else {
      let text = ele.textContent.trim()
      let html = ele.innerHTML.trim()
      let checkImg = html.indexOf("<br><img")
      if (text === "" && checkImg !== -1) {
        html = html.replace("<br><img", "<img")
        ele.innerHTML = html
      }
    }
  } else {
    if (ele.children.length !== 0) {
      Array.from(ele.children).forEach((child) => {
        signatureRemoveSpace(child)
      })
    } else {
      let text = ele.textContent.trim()
      let html = ele.innerHTML.trim()
      let checkImg = html.indexOf("<img")
      if (text === "" && checkImg === -1) {
        ele.remove()
      }
    }
  }
}

export const removeEmptyTags = (html) => {
  // Create a temporary div element to manipulate the HTML string
  const tempDiv = document.createElement("div")
  tempDiv.innerHTML = html

  // Function to recursively remove empty tags
  const clean = (element) => {
    // Get all child elements
    const children = Array.from(element.children)

    // Loop through child elements
    children.forEach((child) => {
      // If the child element is empty (no children and no text content)
      if (
        child.children.length === 0 &&
        child.textContent.trim() === "" &&
        child.tagName.toLowerCase() !== "span" &&
        child.tagName.toLowerCase() !== "img" &&
        child.tagName.toLowerCase() !== "br"
      ) {
        child.remove()
      } else {
        // Recursively clean child elements
        clean(child)
      }
    })
  }

  // Start the cleaning process from the temporary div
  clean(tempDiv)

  // Return the cleaned HTML as a string
  return tempDiv.innerHTML
}

export const applyDefaultFont = (content) => {
  const div = $("<div/>")
  div.html(content)

  div.children().each((idx, item) => {
    signatureRemoveSpace(item)
  })

  let html = div.html()
  let tmpHtml = html
    .replace("<!--HanbiroSignatureStart-->", "")
    .replace("<!--HanbiroSignatureEnd-->", "")
    .replace(/(\r\n|\n|\r)/gm, "")

  if (tmpHtml === "") {
    html = "<div></div>"
  } else if (tmpHtml.indexOf('<div name="HanbiroSignature"><div></div></div>') !== -1) {
    div.find('div[name="HanbiroSignature"]').remove()
    html = div.html()
    html = html
      .replace("<!--HanbiroSignatureStart-->", "")
      .replace("<!--HanbiroSignatureEnd-->", "")
  }

  return html
}
