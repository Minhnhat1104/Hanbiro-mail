// @ts-nocheck
// export const emailRegex = /<(.*)>/
export const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/

/**
 * @description Get unique array by email address of Org Modal > Ex: src/components/Common/ComposeMail/index.js
 * @param {*} arrDefault  - array
 * @returns newUniqueArr - array
 */
export const onGetUniqueArray = (arrDefault) => {
  let newUniqueArr = []

  if (arrDefault?.length > 0) {
    newUniqueArr = arrDefault
      ?.map((item, index, arr) => {
        const foundIndex = arr?.findIndex((otherItem) => {
          // Using case: Key is email or Key is string (not email) - Org Modal
          if (typeof item === "string" && typeof otherItem === "string") {
            const matchItem = item?.match(emailRegex)
            const matchOtherItem = otherItem?.match(emailRegex)
            /**
             * Using for case: Key is email
             * Check unique value by email address
             * Example: '"TS2 " <ts2@vndev.hanbiro.com>' and '"TS2" <ts2@vndev.hanbiro.com>'
             */
            if (matchItem && matchOtherItem && matchItem?.[0] === matchOtherItem?.[0]) {
              return true
            }
            /**
             * Using for case: Key is string (not email)
             * Check unique value
             * Example: ac4 and luu20
             */
            if (!matchItem && !matchOtherItem && item === otherItem) {
              return true
            }
          } else {
            // Using case: Key is label value {label: '', value: ''} - Compose Modal > Input
            const matchItem = item?.value?.match(emailRegex)
            const matchOtherItem = otherItem?.value?.match(emailRegex)
            /**
             * Check unique value by email address
             * Example: '"TS2 " <ts2@vndev.hanbiro.com>' and '"TS2" <ts2@vndev.hanbiro.com>'
             */
            if (matchItem && matchOtherItem && matchItem?.[0] === matchOtherItem?.[0]) {
              return true
            }
            /**
             * Check unique value by email address
             * Example:
             *  { label: '"TS2 " <ts2@vndev.hanbiro.com>', value: '"TS2 " <ts2@vndev.hanbiro.com>' }
             *  { label: '"TS2" <ts2@vndev.hanbiro.com>', value: '"TS2" <ts2@vndev.hanbiro.com>' }
             */
            if (!matchItem && !matchOtherItem && item?.value === otherItem?.value) {
              return true
            }
          }
        })
        return foundIndex === index ? item : null
      })
      ?.filter((item) => item !== null && item !== undefined)
  }

  return newUniqueArr
}

/**
 * @description Get unique object by key (email) of Org Modal > Ex: src/components/Common/Org/HanOrganizationNew/index.js
 * @param {*} objDefault - object
 * @returns newUniqueObject - object
 */
export const onGetUniqueObject = (objDefault) => {
  const newUniqueObject = {}
  if (Object.keys(objDefault).length > 0) {
    const newArr = Object.keys(objDefault).map((item) => {
      if (emailRegex.test(item)) {
        /**
         * @description Using for case: Key contain email address
         * Ex: "TS2" <ts2@vndev.hanbiro.com>
         */
        return item
      } else {
        /**
         * @description Using for case: Key don't contain email address
         * Ex: 0_18_633 > 0_18_633 <paul@vndev.hanbiro.com>
         */
        return objDefault?.[item]?.email ? `${item} <${objDefault?.[item]?.email}>` : item
      }
    })
    const newUniqueArr = onGetUniqueArray(newArr)
    newUniqueArr.forEach((key) => {
      let newKey = ""
      if (objDefault[key] === undefined) {
        newKey = key?.replace(` <${key?.match(emailRegex)?.[0]}>`, "")
      } else {
        if (Object.keys(objDefault[key]).length > 0) {
          newKey = key?.replace(objDefault[key]?.key, "")
          if (newKey === "") {
            newKey = key
          }
        } else {
          newKey = key
        }
      }
      newUniqueObject[newKey] = objDefault[objDefault[key] === undefined ? newKey : key]
    })
  }

  for (const key in newUniqueObject) {
    const keyArr = key?.split(" ")
    const emailKey = keyArr[keyArr.length - 1]
    if (emailKey?.includes(",")) {
      const emailKeyArr = emailKey.replace("<", "").replace(">", "").split(",")
      keyArr.pop()
      emailKeyArr.forEach((_e) => {
        const nKeyArr = [...keyArr]
        nKeyArr.push(`<${_e}>`)
        newUniqueObject[nKeyArr.join(" ")] = newUniqueObject[key]
      })
      delete newUniqueObject[key]
    }
  }
  return newUniqueObject
}

export const decodeHtmlEntities = (htmlString) => {
  const element = document.createElement("div")
  element.innerHTML = htmlString
  return element.textContent || element.innerText
}
