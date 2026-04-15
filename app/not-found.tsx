'use client'

import { useEffect, useRef } from 'react'
import { AnimatedShinyButton } from '@/components/ui/animated-shiny-button'
import LiveButton from '@/components/ui/live-button'

export default function NotFound() {
  const glitchRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const el = glitchRef.current
    if (!el) return
    let frame = 0
    const chars = '!<>-_\\/[]{}—=+*^?#'
    const original = '404'
    let raf: number

    const scramble = () => {
      frame++
      if (frame > 30) {
        el.textContent = original
        return
      }
      el.textContent = original
        .split('')
        .map((char, i) =>
          frame / 30 > i / original.length
            ? char
            : chars[Math.floor(Math.random() * chars.length)]
        )
        .join('')
      raf = requestAnimationFrame(scramble)
    }

    const timeout = setTimeout(() => { raf = requestAnimationFrame(scramble) }, 400)
    return () => { clearTimeout(timeout); cancelAnimationFrame(raf) }
  }, [])

  return (
    <main className="min-h-screen bg-transparent text-white flex flex-col items-center justify-center px-8 relative overflow-hidden">

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-purple-500/5 rounded-full blur-[80px] pointer-events-none" />

      {/* Large background 404 */}
      <div
        className="absolute inset-0 flex items-center justify-center select-none pointer-events-none"
        aria-hidden
      >
        <span
          className="font-black text-white leading-none"
          style={{
            fontFamily: 'var(--font-hero)',
            fontVariationSettings: '"wght" 900',
            fontSize: 'clamp(12rem, 40vw, 36rem)',
            maskImage: 'linear-gradient(to bottom, rgba(255,255,255,0.03) 0%, transparent 80%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(255,255,255,0.03) 0%, transparent 80%)',
          }}
        >
          404
        </span>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center gap-6 max-w-lg">

        {/* Eyebrow */}
        <div className="flex items-center gap-3">
          <span className="block w-6 h-px bg-zinc-600" />
          <span className="text-zinc-500 font-sans text-xs uppercase tracking-[0.3em]">Page not found</span>
          <span className="block w-6 h-px bg-zinc-600" />
        </div>

        {/* Glitch number */}
        <span
          ref={glitchRef}
          className="font-black bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-zinc-500 tabular-nums"
          style={{
            fontFamily: 'var(--font-hero)',
            fontVariationSettings: '"wght" 800',
            fontSize: 'clamp(4rem, 12vw, 9rem)',
            lineHeight: 1,
          }}
        >
          404
        </span>

        <p
          className="text-zinc-400 font-sans text-sm leading-relaxed max-w-sm"

        >
          The page you are looking for does not exist or has been moved.
          Let&apos;s get you back on track.
        </p>

        <div
          className="flex flex-col sm:flex-row items-center gap-4 mt-2"

        >
          <AnimatedShinyButton url="/">
            Back to Home
          </AnimatedShinyButton>
          <LiveButton text="Contact Us" url="/contact" />
        </div>

      </div>

    </main>
  )
}
