// @ts-nocheck
import React, { useId } from "react"

const AiIcon = ({ isGradient = false, showLabel = false, stroke = 1.5, size = "normal" }) => {
  const gradientId = useId()
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={showLabel ? (size === "normal" ? 40 : 32) : 14}
      height={showLabel ? (size === "normal" ? 16 : 14) : 14}
      viewBox={`0 0 ${showLabel ? 50 : 24} 24`}
    >
      {isGradient && (
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#9D50BB">
              <animate
                attributeName="offset"
                values="0%;0.4;0%"
                dur="1s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="30%" stopColor="#6E48AA">
              <animate
                attributeName="offset"
                values="0.4;0.7;0.4"
                dur="1s"
                repeatCount="indefinite"
              />
            </stop>
            <stop offset="50%" stopColor="#4776E6">
              <animate
                attributeName="offset"
                values="0.5;0.7;0.5"
                dur="1s"
                repeatCount="indefinite"
              />
            </stop>
            <animateTransform
              attributeName="gradientTransform"
              type="translate"
              from="0,0"
              to="100,0"
              dur="1s"
              repeatCount="indefinite"
            />
          </linearGradient>
        </defs>
      )}
      <path
        fill="none"
        stroke={isGradient ? `url(#${gradientId})` : "currentColor"}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={stroke}
        d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0zM20 3v4m2-2h-4M4 17v2m1-1H3"
      />
      {showLabel && (
        <text
          x="30"
          y={size === "normal" ? 22 : 20}
          fontSize={size === "normal" ? 24 : 22}
          fontFamily="Arial"
          fill={isGradient ? `url(#${gradientId})` : "currentColor"}
        >
          AI
        </text>
      )}
    </svg>
  )
}

export default AiIcon
