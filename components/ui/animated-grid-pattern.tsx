'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/lib/utils'

interface AnimatedGridPatternProps {
  width?: number
  height?: number
  x?: number
  y?: number
  strokeDasharray?: number
  numSquares?: number
  maxOpacity?: number
  duration?: number
  repeatDelay?: number
  className?: string
}

export function AnimatedGridPattern({
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  strokeDasharray = 0,
  numSquares = 20,
  maxOpacity = 0.5,
  duration = 4,
  repeatDelay = 0.5,
  className,
}: AnimatedGridPatternProps) {
  const id = useId()
  const containerRef = useRef<SVGSVGElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [squares, setSquares] = useState<{ id: number; pos: [number, number] }[]>([])
  const dimensionsRef = useRef({ width: 0, height: 0 })

  function getPos(): [number, number] {
    return [
      Math.floor((Math.random() * dimensionsRef.current.width) / width),
      Math.floor((Math.random() * dimensionsRef.current.height) / height),
    ]
  }

  function generateSquares(count: number) {
    return Array.from({ length: count }, (_, i) => ({ id: i, pos: getPos() }))
  }

  // Update a single square's position when its animation completes
  const updateSquarePosition = (id: number) => {
    setSquares((prev) =>
      prev.map((sq) => (sq.id === id ? { ...sq, pos: getPos() } : sq)),
    )
  }

  useEffect(() => {
    if (dimensions.width && dimensions.height) {
      setSquares(generateSquares(numSquares))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dimensions.width, dimensions.height, numSquares])

  useEffect(() => {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: w, height: h } = entry.contentRect
        if (w > 0 && h > 0) {
          dimensionsRef.current = { width: w, height: h }
          // Only update state on first measurement — avoids re-generating squares
          // every frame during GSAP animations that resize the container
          setDimensions((prev) =>
            prev.width === 0 && prev.height === 0 ? { width: w, height: h } : prev,
          )
        }
      }
    })
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <svg
      ref={containerRef}
      aria-hidden="true"
      className={cn('pointer-events-none absolute inset-0 h-full w-full fill-gray-400/30 stroke-gray-400/30', className)}
    >
      <defs>
        <pattern id={id} width={width} height={height} patternUnits="userSpaceOnUse" x={x} y={y}>
          <path
            d={`M.5 ${height}V.5H${width}`}
            fill="none"
            strokeDasharray={strokeDasharray}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
      <svg x={x} y={y} className="overflow-visible">
        {squares.map(({ id: squareId, pos: [col, row] }) => (
          <motion.rect
            key={`${squareId}-${col}-${row}`}
            width={width - 1}
            height={height - 1}
            x={col * width + 1}
            y={row * height + 1}
            fill="currentColor"
            strokeWidth="0"
            initial={{ opacity: 0 }}
            animate={{ opacity: maxOpacity }}
            transition={{
              duration,
              repeat: 1,
              delay: Math.random() * (duration / 2),
              repeatType: 'reverse',
              ease: 'easeInOut',
              repeatDelay,
            }}
            onAnimationComplete={() => updateSquarePosition(squareId)}
          />
        ))}
      </svg>
    </svg>
  )
}
