'use client'

import { useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'

export default function PageTransition() {
  const overlayRef   = useRef<HTMLDivElement>(null)
  const pathname     = usePathname()
  const router       = useRouter()
  const navigating   = useRef(false)

  // ── Reveal animation on every page arrival ────────────────────────────────
  useEffect(() => {
    const el = overlayRef.current
    if (!el) return
    import('gsap').then(({ gsap }) => {
      gsap.set(el, { scaleY: 1, transformOrigin: 'top', pointerEvents: 'none' })
      gsap.to(el, {
        scaleY: 0,
        duration: 1,
        ease: 'power4.inOut',
        delay: 0.05,
        onComplete: () => { navigating.current = false },
      })
    })
  }, [pathname])

  // ── Global click interceptor ───────────────────────────────────────────────
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (e.defaultPrevented) return

      const anchor = (e.target as Element).closest<HTMLAnchorElement>('a')
      if (!anchor) return

      const href = anchor.getAttribute('href')
      if (!href) return

      if (!href.startsWith('/')) return
      if (anchor.target === '_blank') return
      if (href === pathname) return
      if (navigating.current) return

      e.preventDefault()
      navigating.current = true

      const el = overlayRef.current
      if (!el) { router.push(href); return }

      import('gsap').then(({ gsap }) => {
        gsap.set(el, { scaleY: 0, transformOrigin: 'bottom', pointerEvents: 'all' })
        gsap.to(el, {
          scaleY: 1,
          duration: 1,
          ease: 'power4.inOut',
          onComplete: () => { router.push(href) },
        })
      })
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [pathname, router])

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[99999] pointer-events-none"
      style={{
        backgroundColor: '#000000',
        transform: 'scaleY(1)',
        transformOrigin: 'top',
      }}
    />
  )
}
