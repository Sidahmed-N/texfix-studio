'use client'

import { cn } from '@/lib/utils'
import React, { useEffect, useRef } from 'react'

interface ThreeDMarqueeProps {
  items: React.ReactNode[]
  className?: string
  /** Number of columns (default 4) */
  columns?: number
}

export function ThreeDMarquee({ items, className, columns = 4 }: ThreeDMarqueeProps) {
  // Split items into columns
  const perCol = Math.ceil(items.length / columns)
  const cols = Array.from({ length: columns }, (_, i) =>
    items.slice(i * perCol, (i + 1) * perCol),
  )

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const colEls = el.querySelectorAll<HTMLElement>('.marquee-vertical, .marquee-vertical-reverse')
    const obs = new IntersectionObserver(
      ([entry]) => {
        colEls.forEach(c => {
          c.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused'
        })
      },
      { threshold: 0 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={containerRef}
      className={cn('overflow-hidden', className)}
      style={{ perspective: '900px' }}
    >
      <div
        className="flex gap-3 w-full h-full"
        style={{ transform: 'rotateX(18deg) rotateY(-12deg) rotateZ(4deg)', transformOrigin: 'center center' }}
      >
        {cols.map((col, colIdx) => (
          <div
            key={colIdx}
            className={cn(
              'flex flex-1 flex-col gap-3',
              colIdx % 2 === 0 ? 'marquee-vertical' : 'marquee-vertical-reverse',
            )}
          >
            {/* Duplicate for seamless loop */}
            {[...col, ...col].map((item, i) => (
              <div key={i} className="flex-shrink-0">
                {item}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
