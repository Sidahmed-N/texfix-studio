"use client"

import React, { useState } from "react"

interface LiveButtonProps {
  text: string
  url: string
  className?: string
}

export default function LiveButton({
  text,
  url,
  className = "",
}: LiveButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  return (
    <button
      className={`group relative flex items-center justify-center gap-2 overflow-hidden rounded-lg border border-zinc-700 bg-transparent px-5 py-3 transition-[transform,box-shadow,border-color] duration-500 ease-out before:absolute before:inset-0 before:translate-x-[-100%] before:bg-gradient-to-r before:from-transparent before:via-white/5 before:to-transparent before:transition-transform before:duration-700 hover:scale-105 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20 hover:before:translate-x-[100%] active:scale-95 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setIsPressed(false)
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onClick={() => (window.location.href = url)}
    >
      {/* Subtle glow effect */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-blue-500/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

      {/* Text */}
      <span className="relative z-10 text-sm leading-[1.2] font-medium tracking-wide whitespace-nowrap text-white transition-all duration-300 group-hover:text-blue-300">
        {text}
      </span>

      {/* Animated dot */}
      <span
        className={`relative z-10 h-3 w-3 rounded-full bg-blue-500 transition-[transform,background-color,box-shadow] duration-500 ease-out ${isHovered ? "scale-125 bg-blue-400 shadow-lg shadow-blue-400/50" : ""} ${isPressed ? "scale-90" : ""}`}
      >
        {isHovered && (
          <div
            className="absolute inset-0 animate-ping rounded-full bg-blue-500 opacity-60"
            style={{ animationDuration: "2s" }}
          />
        )}
      </span>

      {/* Hover state border animation */}
      {isHovered && (
        <div className="absolute inset-0 animate-pulse rounded-lg border-2 border-blue-500/30 opacity-100" />
      )}
    </button>
  )
}
