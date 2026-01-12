// @ts-nocheck
import { useState, useEffect } from "react"

// ----------------------------------------------------------------------

export default function useLocalStorage(key, defaultValue) {
  /**
   * Handle parse value
   * - If parsing succeeds, it's valid JSON, so return parsed JSON
   * - If parsing fails, it's not valid JSON, return the original string
   */
  const handleParseValue = (value) => {
    try {
      JSON.parse(value)
      return JSON.parse(value)
    } catch (error) {
      return value
    }
  }

  const [value, setValue] = useState(() => {
    const storedValue = typeof window !== "undefined" ? localStorage.getItem(key) : null
    if (storedValue !== null) {
      try {
        // return JSON.parse(storedValue);
        return handleParseValue(storedValue)
      } catch (e) {
        localStorage.removeItem(key)
      }
    }
    return defaultValue
  })

  useEffect(() => {
    const listener = (e) => {
      if (typeof window !== "undefined" && e.storageArea === localStorage && e.key === key) {
        // setValue(e.newValue ? JSON.parse(e.newValue) : e.newValue);
        setValue(e.newValue ? handleParseValue(e.newValue) : e.newValue)
      }
    }
    window.addEventListener("storage", listener)

    return () => {
      window.removeEventListener("storage", listener)
    }
  }, [key, defaultValue])

  const setValueInLocalStorage = (newValue) => {
    setValue((currentValue) => {
      const result = typeof newValue === "function" ? newValue(currentValue) : newValue
      // if (typeof window !== 'undefined') localStorage.setItem(key, JSON.stringify(result));
      if (typeof window !== "undefined") {
        if (typeof result === "string") {
          localStorage.setItem(key, result)
        } else {
          localStorage.setItem(key, JSON.stringify(result))
        }
      }
      return result
    })
  }

  const removeValueInLocalStorage = () => {
    setValue((currentValue) => {
      if (typeof window !== "undefined") localStorage.removeItem(key)
      return null
    })
  }

  return [value, setValueInLocalStorage, removeValueInLocalStorage]
}
