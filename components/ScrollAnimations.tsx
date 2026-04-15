'use client'

import { useEffect } from 'react'

export default function ScrollAnimations() {
  useEffect(() => {
    let cleanup: (() => void) | undefined

    const init = async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      const Lenis = (await import('lenis')).default
      gsap.registerPlugin(ScrollTrigger)

      // ── Lenis smooth scroll ─────────────────────────────────────────────
      const lenis = new Lenis({
        duration: 1.1,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      })

      // Sync Lenis with GSAP ScrollTrigger
      lenis.on('scroll', ScrollTrigger.update)
      const rafTicker = (time: number) => lenis.raf(time * 1000)
      gsap.ticker.add(rafTicker)
      gsap.ticker.lagSmoothing(0)

      const triggers: globalThis.ScrollTrigger[] = []

      // Project Cards Staggered Fade In
      gsap.utils.toArray<Element>('.project-card').forEach((card, i) => {
        const tween = gsap.from(card, {
          scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none reverse' },
          y: 50, opacity: 0, duration: 0.8, delay: i * 0.1, ease: 'power3.out',
        })
        if (tween.scrollTrigger) triggers.push(tween.scrollTrigger)
      })

      // Bento Cards Staggered Fade In
      gsap.utils.toArray<Element>('.bento-card').forEach((card, i) => {
        const tween = gsap.from(card, {
          scrollTrigger: { trigger: '#about', start: 'top 70%' },
          y: 30, opacity: 0, duration: 0.6, delay: i * 0.1, ease: 'power2.out',
        })
        if (tween.scrollTrigger) triggers.push(tween.scrollTrigger)
      })

      cleanup = () => {
        triggers.forEach(t => t.kill(true))
        lenis.destroy()
        gsap.ticker.remove(rafTicker)
      }
    }

    init()

    return () => { cleanup?.() }
  }, [])

  return null
}
