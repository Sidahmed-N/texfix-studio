'use client'

import { useEffect, useRef } from 'react'

export default function AuraBackground() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const fadeIn = () => {
      const el = containerRef.current
      if (!el) return
      el.style.transition = 'opacity 1.8s cubic-bezier(0.16,1,0.3,1)'
      el.style.opacity = '0.4'
    }

    const loadScript = () => {
      if (!(window as any).UnicornStudio) {
        ;(window as any).UnicornStudio = { isInitialized: false }
        const script = document.createElement('script')
        script.src =
          'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.29/dist/unicornStudio.umd.js'
        script.onload = () => {
          if (!(window as any).UnicornStudio.isInitialized) {
            ;(window as any).UnicornStudio.init()
            ;(window as any).UnicornStudio.isInitialized = true
          }
          // If preloader was skipped it fires before this listener attaches — use short timeout fallback
          if (sessionStorage.getItem('preloader-shown')) {
            setTimeout(fadeIn, 300)
          } else {
            const onDone = () => {
              fadeIn()
              window.removeEventListener('preloader-done', onDone)
            }
            window.addEventListener('preloader-done', onDone)
          }
        }
        ;(document.head || document.body).appendChild(script)
      } else {
        // Script already loaded on subsequent navigations — reset then fade in after reveal finishes (1s)
        const el = containerRef.current
        if (el) {
          el.style.transition = 'none'
          el.style.opacity = '0'
        }
        setTimeout(fadeIn, 1100)
      }
    }

    // Defer loading until browser is idle so it doesn't block initial paint
    let idleHandle: number
    const hasRIC = typeof window.requestIdleCallback === 'function'
    if (hasRIC) {
      idleHandle = window.requestIdleCallback(loadScript)
    } else {
      idleHandle = window.setTimeout(loadScript, 1)
    }

    return () => {
      if (hasRIC) window.cancelIdleCallback(idleHandle)
      else clearTimeout(idleHandle)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="aura-background-component fixed top-0 w-full h-screen z-0 pointer-events-none"
      data-alpha-mask="80"
      style={{
        opacity: 0,
        maskImage: 'linear-gradient(to bottom, transparent, black 0%, black 80%, transparent)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 0%, black 80%, transparent)',
      }}
    >
      <div
        data-us-project="cqcLtDwfoHqqRPttBbQE"
        className="absolute top-0 left-0 w-full h-full"
      />
    </div>
  )
}
