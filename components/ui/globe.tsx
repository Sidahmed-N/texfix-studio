'use client'

import createGlobe, { COBEOptions } from 'cobe'
import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

const BASE_CONFIG: Omit<COBEOptions, 'width' | 'height'> = {
  devicePixelRatio: typeof window !== 'undefined' ? Math.min(2, window.devicePixelRatio) : 2,
  phi: 0,
  theta: 0.25,
  dark: 1,
  diffuse: 0.4,
  mapSamples: 8000,
  mapBrightness: 1.5,
  baseColor: [0.15, 0.15, 0.15],
  markerColor: [59 / 255, 130 / 255, 246 / 255],
  glowColor: [0.1, 0.3, 0.8],
  markers: [
    { location: [40.7128, -74.006],   size: 0.04 }, // New York
    { location: [51.5072, -0.1276],   size: 0.04 }, // London
    { location: [35.6762, 139.6503],  size: 0.04 }, // Tokyo
    { location: [-33.8688, 151.2093], size: 0.03 }, // Sydney
    { location: [25.2048, 55.2708],   size: 0.03 }, // Dubai
    { location: [34.0522, -118.2437], size: 0.03 }, // Los Angeles
  ],
}

export function Globe({
  className,
  config = {},
}: {
  className?: string
  config?: Partial<Omit<COBEOptions, 'width' | 'height'>>
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const size = canvas.offsetWidth || 300
    let phi = 0
    let rafId: number
    let isVisible = false

    const globe = createGlobe(canvas, {
      ...BASE_CONFIG,
      ...config,
      width: size * 2,
      height: size * 2,
    })

    const animate = () => {
      if (!isVisible) return
      phi += 0.004
      globe.update({ phi })
      rafId = requestAnimationFrame(animate)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting
        if (isVisible) rafId = requestAnimationFrame(animate)
      },
      { threshold: 0 },
    )
    observer.observe(canvas)

    setTimeout(() => { canvas.style.opacity = '1' }, 100)

    return () => {
      observer.disconnect()
      cancelAnimationFrame(rafId)
      globe.destroy()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        'size-full opacity-0 transition-opacity duration-700',
        className,
      )}
    />
  )
}

