'use client'

import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const circleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return

    const circle = circleRef.current
    if (!circle) return

    let mouseX = 0, mouseY = 0, curX = 0, curY = 0
    let rafId: number
    let started = false
    let isIdle = false
    let idleTimer: ReturnType<typeof setTimeout>

    const startLoop = () => {
      if (isIdle) {
        isIdle = false
        rafId = requestAnimationFrame(animate)
      }
    }

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY

      if (!started) {
        curX = mouseX
        curY = mouseY
        started = true
        circle.classList.add('is-visible')
      }

      document.querySelectorAll<HTMLElement>('.bento-card').forEach((card) => {
        const rect = card.getBoundingClientRect()
        card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`)
        card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`)
      })

      startLoop()
      clearTimeout(idleTimer)
      idleTimer = setTimeout(() => { isIdle = true }, 3000)
    }

    const animate = () => {
      if (isIdle) return
      curX += (mouseX - curX) * 0.07
      curY += (mouseY - curY) * 0.07
      circle.style.transform = `translate(${curX}px, ${curY}px) translate(-50%, -50%)`
      // If cursor is in service state but the element under it no longer has service-row, clear it
      if (circle.classList.contains('is-service')) {
        const el = document.elementFromPoint(mouseX, mouseY)
        if (!el?.closest('.service-row')) {
          circle.classList.remove('is-service')
        }
      }
      rafId = requestAnimationFrame(animate)
    }
    animate()

    const onEnter = () => circle.classList.add('is-hovering')
    const onLeave = () => circle.classList.remove('is-hovering')

    const onDelegatedEnter = (e: MouseEvent) => {
      const target = e.target as Element
      if (target.closest('.service-row')) {
        circle.classList.add('is-service')
        circle.classList.remove('is-hidden')
      } else {
        circle.classList.remove('is-service')
        if (target.closest('button, .shiny-cta, .contact-cta, [role="button"]')) {
          circle.classList.add('is-hidden')
        } else if (target.closest('.glass-card, .bento-card')) {
          circle.classList.add('is-hovering')
        }
      }
    }
    const onDelegatedLeave = (e: MouseEvent) => {
      const target = e.target as Element
      if (target.closest('.service-row')) {
        circle.classList.remove('is-service')
      } else if (target.closest('button, .shiny-cta, .contact-cta, [role="button"]')) {
        circle.classList.remove('is-hidden')
      } else if (target.closest('.glass-card, .bento-card')) {
        circle.classList.remove('is-hovering')
      }
    }

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onDelegatedEnter)
    document.addEventListener('mouseout', onDelegatedLeave)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onDelegatedEnter)
      document.removeEventListener('mouseout', onDelegatedLeave)
      cancelAnimationFrame(rafId)
      clearTimeout(idleTimer)
    }
  }, [])

  return <div ref={circleRef} className="cursor-circle hidden md:block" />
}
