'use client'

import { useEffect, useRef, useState } from 'react'

export default function Preloader() {
  const [mounted, setMounted] = useState(true)
  const tlRef = useRef<gsap.core.Timeline | null>(null)

  useEffect(() => {
    // Only show preloader once per browser session
    if (sessionStorage.getItem('preloader-shown')) {
      document.body.style.overflow = ''
      document.body.classList.remove('preloader-active')
      window.dispatchEvent(new Event('preloader-done'))
      setMounted(false)
      return
    }
    sessionStorage.setItem('preloader-shown', '1')

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    document.documentElement.style.paddingRight = `${scrollbarWidth}px`
    document.body.style.overflow = 'hidden'

    let cancelled = false
    const init = async () => {
      const { gsap } = await import('gsap')
      const { SplitText } = await import('gsap/SplitText')
      const { CustomEase } = await import('gsap/CustomEase')

      if (cancelled) return

      gsap.registerPlugin(CustomEase, SplitText)
      CustomEase.create('hop', '.8, 0, .3, 1')

      const splitTextElements = (
        selector: string,
        type = 'words,chars',
        addFirstChar = false
      ) => {
        const elements = document.querySelectorAll(selector)
        elements.forEach((element) => {
          const splitText = SplitText.create(element, {
            type,
            wordsClass: 'word',
            charsClass: 'char',
          })
          if (type.includes('chars')) {
            splitText.chars.forEach((char: Element, index: number) => {
              const originalText = char.textContent
              char.innerHTML = `<span>${originalText}</span>`
              if (addFirstChar && index === 0) {
                char.classList.add('first-char')
              }
            })
          }
        })
      }

      splitTextElements('.intro-title h1', 'words, chars', true)
      splitTextElements('.outro-title h1')
      splitTextElements('.tag p', 'words')

      const isMobile = window.innerWidth <= 1000

      gsap.set(
        [
          '.split-overlay .intro-title .first-char span',
          '.split-overlay .outro-title .char span',
        ],
        { y: '0%' }
      )
      gsap.set('.split-overlay .intro-title .first-char', {
        x: isMobile ? '4rem' : '14rem',
        y: isMobile ? '-1rem' : '-2.75rem',
        fontWeight: '900',
        scale: 0.75,
      })
      gsap.set('.split-overlay .outro-title .char', {
        x: isMobile ? '-4rem' : '-8rem',
        fontSize: isMobile ? '6rem' : '14rem',
        fontWeight: '800',
      })
      if (isMobile) {
        gsap.set('.preloader .outro-title .char', { fontSize: '3rem' })
      }

      // Hide site content until preloader reveals it
      gsap.set('.site-container', { clipPath: 'polygon(0 48%, 0 48%, 0 52%, 0 52%)' })
      // All chars are now positioned — make text visible before timeline starts
      gsap.set(['.preloader h1', '.split-overlay h1', '.tags-overlay p'], { opacity: 1 })

      const tl = gsap.timeline({ defaults: { ease: 'hop' } })
      tlRef.current = tl
      const tags = gsap.utils.toArray<Element>('.tag')

      tags.forEach((tag, index) => {
        tl.to(tag.querySelectorAll('p .word'), { y: '0%', duration: 0.75 }, 0.5 + index * 0.1)
      })

      tl.to('.preloader .intro-title .char span', { y: '0%', duration: 0.75, stagger: 0.05 }, 0.5)
        .to('.preloader .intro-title .char:not(.first-char) span', { y: '100%', duration: 0.75, stagger: 0.05 }, 1.75)
        .to('.preloader .outro-title .char span', { y: '0%', duration: 0.75, stagger: 0.075 }, 2.25)
        .to('.preloader .intro-title .first-char', { x: isMobile ? '5.5rem' : '16.5rem', duration: 1 }, 3)
        .to('.preloader .outro-title .char', { x: isMobile ? '-4rem' : '-8rem', duration: 1 }, 3)
        .to(
          '.preloader .intro-title .first-char',
          { x: isMobile ? '4rem' : '14rem', y: isMobile ? '-1rem' : '-2.75rem', fontWeight: '900', scale: 0.75, duration: 0.75 },
          4
        )
        .to(
          '.preloader .outro-title .char',
          {
            x: isMobile ? '-4rem' : '-8rem',
            fontSize: isMobile ? '6rem' : '14rem',
            fontWeight: '800',
            duration: 0.75,
            onComplete: () => {
              gsap.set('.preloader', { clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 50%)' })
              gsap.set('.split-overlay', { clipPath: 'polygon(0 50%, 100% 50%, 100% 100%, 0 100%)' })
            },
          },
          4
        )
        .to('.site-container', { clipPath: 'polygon(0% 48%, 100% 48%, 100% 52%, 0% 52%)', duration: 1 }, 4.5)

      tags.forEach((tag, index) => {
        tl.to(tag.querySelectorAll('p .word'), { y: '100%', duration: 0.75 }, 5 + index * 0.1)
      })

      tl.to(['.preloader', '.split-overlay'], { y: (i: number) => (i === 0 ? '-50%' : '50%'), duration: 1, force3D: true }, 5.25)
        .to(
          '.site-container',
          {
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
            duration: 1,
            onStart: () => {
              // Remove padding compensation before content is visible — prevents
              // the rightward layout shift caused by the scrollbar reappearing
              document.documentElement.style.paddingRight = ''
              document.body.style.overflow = ''
            },
            onComplete: () => {
              document.body.classList.remove('preloader-active')
              window.dispatchEvent(new Event('preloader-done'))
              gsap.set(['.preloader', '.split-overlay', '.tags-overlay'], { display: 'none' })
              setMounted(false)
            },
          },
          5.25
        )
    }

    init()

    return () => {
      cancelled = true
      tlRef.current?.kill()
    }

  }, [])

  if (!mounted) return null

  return (
    <>
      <div className="preloader">
        <div className="intro-title">
          <h1>Texfix Studio</h1>
        </div>
        <div className="outro-title">
          <h1>X</h1>
        </div>
      </div>

      <div className="split-overlay">
        <div className="intro-title">
          <h1>Texfix Studio</h1>
        </div>
        <div className="outro-title">
          <h1>X</h1>
        </div>
      </div>

      <div className="tags-overlay">
        <div className="tag tag-1">
          <p>Built to Scale</p>
        </div>
        <div className="tag tag-2">
          <p>Your Vision, Shipped</p>
        </div>
        <div className="tag tag-3">
          <p>From Idea to Product</p>
        </div>
      </div>
    </>
  )
}
