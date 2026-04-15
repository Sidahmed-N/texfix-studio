'use client'

import React, { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { Home, User, Briefcase, Mail } from 'lucide-react'

const NAV_LINKS = [
  { id: 'home',     label: 'Home',    href: '/'         },
  { id: 'about',    label: 'About',   href: '/about'    },
  { id: 'projects', label: 'Work',    href: '/work'     },
  { id: 'contact',  label: 'Contact', href: '/contact'  },
]

const NAV_ICONS = [Home, User, Briefcase, Mail]

const SERVICE_TAGS = ['Web Apps', 'Websites', 'AI & Automation', 'SaaS Platforms', 'E-Commerce']

export default function Navbar() {
  const [isSticky, setIsSticky] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const isAnimatingRef = useRef(false)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check, { passive: true })
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    const onScroll = () => {
      if (!isMenuOpen) setIsSticky(prev => {
        const next = window.scrollY >= 100
        return prev === next ? prev : next
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isMenuOpen])

  const runOpen = async () => {
    if (isAnimatingRef.current) return
    isAnimatingRef.current = true
    setIsMenuOpen(true)
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    document.documentElement.style.overflow = 'hidden'
    document.documentElement.style.paddingRight = `${scrollbarWidth}px`

    const { gsap } = await import('gsap')
    const { CustomEase } = await import('gsap/CustomEase')
    gsap.registerPlugin(CustomEase)
    CustomEase.create('hop', '.87,0,.13,1')

    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))

    const overlay        = document.getElementById('menu-overlay')
    const overlayContent = document.getElementById('menu-overlay-content')
    const links          = document.querySelectorAll<HTMLElement>('[data-menu-line]')
    const media          = document.getElementById('menu-media')

    const tl = gsap.timeline({ onComplete: () => { isAnimatingRef.current = false } })

    tl.to(overlay, {
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
      duration: 1,
      ease: 'hop',
    }, '<')
    .to(overlayContent, { yPercent: 0, duration: 1, ease: 'hop' }, '<')
    .to(media, { opacity: 1, duration: 0.75, ease: 'power2.out' }, '-=0.3')
    .to(links, { y: '0%', duration: 1.2, ease: 'hop', stagger: -0.06 }, '-=0.7')
  }

  const runClose = async () => {
    if (isAnimatingRef.current) return
    isAnimatingRef.current = true

    const { gsap } = await import('gsap')
    const { CustomEase } = await import('gsap/CustomEase')
    gsap.registerPlugin(CustomEase)
    CustomEase.create('hop', '.87,0,.13,1')

    const overlay        = document.getElementById('menu-overlay')
    const overlayContent = document.getElementById('menu-overlay-content')
    const links          = document.querySelectorAll<HTMLElement>('[data-menu-line]')

    const tl = gsap.timeline({
      onComplete: () => {
        setIsMenuOpen(false)
        isAnimatingRef.current = false
        document.documentElement.style.overflow = ''
        document.documentElement.style.paddingRight = ''
        gsap.set(links, { y: '-110%' })
      },
    })

    tl.to(overlay, {
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
      duration: 1,
      ease: 'hop',
    }, '<')
    .to(overlayContent, { yPercent: -50, duration: 1, ease: 'hop' }, '<')
  }

  const handleMenuToggle = () => {
    if (isMenuOpen) runClose()
    else runOpen()
  }

  const handleLinkClick = (href: string, e: React.MouseEvent) => {
    if (href.startsWith('/')) {
      // Don't prevent default — PageTransition interceptor handles navigation
      if (isMenuOpen) runClose()
    } else {
      e.preventDefault()
      if (isMenuOpen) runClose()
      setTimeout(() => {
        const target = document.querySelector(href)
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 800)
    }
  }

  const collapsed = isMobile || isSticky

  // Track linksVisible with a delay on collapse to allow the CSS fade-out transition to play
  const [linksVisible, setLinksVisible] = useState(!collapsed)
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>
    if (collapsed) { t = setTimeout(() => setLinksVisible(false), 250) }
    else { setLinksVisible(true) }
    return () => clearTimeout(t)
  }, [collapsed])

  return (
    <>
      <div className="fixed z-50 w-full pointer-events-none">
        <nav
          ref={navRef}
          className={cn(
            'pointer-events-auto flex justify-center items-center',
            'backdrop-blur-md border',
            'shadow-[inset_0_1px_0_rgba(255,255,255,0.12),inset_0_-1px_0_rgba(0,0,0,0.4),0_16px_48px_rgba(0,0,0,0.7),0_0_0_1px_rgba(59,130,246,0.08)]',
            'bg-gradient-to-b from-white/10 to-white/4 border-white/10',
            'fixed',
          )}
          style={{
            height:       collapsed ? 64   : 68,
            width:        collapsed ? 64   : 440,
            borderRadius: collapsed ? 9999 : 14,
            top:          collapsed ? 24   : 28,
            left:         0,
            transform:    collapsed ? 'translateX(24px)' : 'translateX(calc(50vw - 220px))',
            transition:   'height 0.45s cubic-bezier(0.34,1.56,0.64,1), width 0.5s cubic-bezier(0.34,1.56,0.64,1), border-radius 0.45s cubic-bezier(0.34,1.56,0.64,1), transform 0.5s cubic-bezier(0.34,1.56,0.64,1)',
          }}
        >
          {linksVisible && NAV_LINKS.map((link, i) => (
            <a
              key={link.id}
              href={link.href}
              onClick={(e) => handleLinkClick(link.href, e)}
              style={{
                opacity:       collapsed ? 0 : 1,
                transform:     collapsed ? 'scale(0.8)' : 'scale(1)',
                transition:    `opacity 0.2s ease ${i * 0.05}s, transform 0.2s ease ${i * 0.05}s, color 0.2s ease`,
                pointerEvents: collapsed ? 'none' : 'auto',
              }}
              className="px-4 py-2 text-[12px] font-sans uppercase tracking-widest text-zinc-400 hover:text-white whitespace-nowrap flex items-center gap-1.5"
            >
              {React.createElement(NAV_ICONS[i], { className: 'w-3 h-3 opacity-60' })}
              {link.label}
            </a>
          ))}

          <button
            onClick={handleMenuToggle}
            aria-label="Toggle menu"
            className={cn(
              'absolute w-[52px] h-[52px] rounded-full outline-none border cursor-pointer',
              'bg-gradient-to-b from-white/12 to-white/4 border-white/10',
              'shadow-[inset_0_1px_0_rgba(255,255,255,0.15),inset_0_-1px_0_rgba(0,0,0,0.3),0_8px_24px_rgba(0,0,0,0.5),0_0_0_1px_rgba(59,130,246,0.10)]',
              'hover:from-white/18 hover:to-white/8 hover:border-white/15 transition-[transform,background,border-color,box-shadow] duration-200 backdrop-blur-md',
              collapsed ? 'flex' : 'flex md:hidden',
              'flex-col items-center justify-center gap-[5px]',
            )}
          >
            <span
              className="block w-4 h-[1.5px] bg-zinc-300 origin-center"
              style={{
                transform:  isMenuOpen ? 'translateY(6.5px) rotate(45deg)' : 'translateY(0px) rotate(0deg)',
                transition: 'transform 0.4s cubic-bezier(0.87,0,0.13,1)',
              }}
            />
            <span
              className="block w-4 h-[1.5px] bg-zinc-300"
              style={{
                opacity:    isMenuOpen ? 0 : 1,
                transition: 'opacity 0.2s ease',
              }}
            />
            <span
              className="block w-4 h-[1.5px] bg-zinc-300 origin-center"
              style={{
                transform:  isMenuOpen ? 'translateY(-6.5px) rotate(-45deg)' : 'translateY(0px) rotate(0deg)',
                transition: 'transform 0.4s cubic-bezier(0.87,0,0.13,1)',
              }}
            />
          </button>
        </nav>
      </div>

      {isMenuOpen && (
        <div
          id="menu-overlay"
          className="fixed inset-0 z-40 overflow-hidden"
          style={{
            backgroundColor: '#0d0d0d',
            clipPath: 'polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)',
            willChange: 'clip-path',
          }}
        >
          <div
            id="menu-overlay-content"
            className="flex w-full h-full"
            style={{ transform: 'translateY(-50%)', willChange: 'transform' }}
          >
            {/* Left visual panel */}
            <div
              id="menu-media"
              className="hidden lg:flex flex-[2] relative overflow-hidden"
              style={{ opacity: 0, willChange: 'opacity' }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/menu-media.jpg"
                alt=""
                className="w-full h-full object-cover"
                style={{ opacity: 0.25 }}
              />
            </div>

            {/* Right content panel */}
            <div className="flex-[3] flex flex-col justify-between h-full px-10 lg:px-16 py-10 border-l border-zinc-800/40">

              <div />

              <div className="flex flex-col gap-1 mt-8">
                {NAV_LINKS.map((link, i) => (
                  <div key={link.id} className="overflow-hidden leading-none py-1">
                    <a
                      href={link.href}
                      onClick={(e) => handleLinkClick(link.href, e)}
                      data-menu-line={i}
                      className="block font-display font-medium uppercase bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-zinc-500 hover:to-zinc-300 transition-all duration-300"
                      style={{
                        fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
                        letterSpacing: '-0.02em',
                        lineHeight: 1.1,
                        transform: 'translateY(-110%)',
                        willChange: 'transform',
                      }}
                    >
                      {link.label}
                    </a>
                  </div>
                ))}

                <div className="overflow-hidden mt-6">
                  <div
                    data-menu-line="tags"
                    className="flex flex-wrap gap-2"
                    style={{ transform: 'translateY(-110%)', willChange: 'transform' }}
                  >
                    {SERVICE_TAGS.map((tag) => (
                      <span key={tag} className="text-xs text-zinc-500 font-sans border border-zinc-800 px-3 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="overflow-hidden border-t border-zinc-800/50 pt-6">
                <div
                  data-menu-line="footer"
                  className="flex flex-col sm:flex-row gap-8"
                  style={{ transform: 'translateY(-110%)', willChange: 'transform' }}
                >
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-600 font-sans mb-1">Location</p>
                    <p className="text-sm text-zinc-400 font-sans">Guelma, Algeria</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-zinc-600 font-sans mb-1">Email</p>
                    <p className="text-sm text-zinc-400 font-sans">texfix.info@gmail.com</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  )
}
