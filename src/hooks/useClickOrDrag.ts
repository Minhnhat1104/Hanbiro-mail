// @ts-nocheck
import { useState, useEffect } from "react"

const useClickOrDrag = (onClick) => {
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [startY, setStartY] = useState(0)

  const handleMouseDown = (e) => {
    setIsDragging(false)
    setStartX(e.clientX)
    setStartY(e.clientY)
  }

  const handleMouseMove = (e) => {
    if (Math.abs(e.clientX - startX) > 5 || Math.abs(e.clientY - startY) > 5) {
      setIsDragging(true)
    }
  }

  const handleMouseUp = (e, type) => {
    if (!isDragging) {
      !!type ? onClick(type) : onClick()
    }
  }

  useEffect(() => {
    const handleDragStart = (e) => {
      e.preventDefault()
    }
    document.addEventListener("dragstart", handleDragStart)
    return () => {
      document.removeEventListener("dragstart", handleDragStart)
    }
  }, [])

  return { handleMouseDown, handleMouseMove, handleMouseUp }
}

export default useClickOrDrag
