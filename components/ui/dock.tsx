'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

/* ─── Context ──────────────────────────────────────────────── */
interface DockContextType {
  mouseX: number
  magnification: number
  distance: number
}

const DockContext = createContext<DockContextType>({
  mouseX: Infinity,
  magnification: 60,
  distance: 140,
})

/* ─── Dock ──────────────────────────────────────────────────── */
interface DockProps {
  children: React.ReactNode
  className?: string
  magnification?: number
  distance?: number
}

export function Dock({ children, className, magnification = 60, distance = 140 }: DockProps) {
  const [mouseX, setMouseX] = useState(Infinity)

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    setMouseX(e.pageX)
  }, [])

  const onMouseLeave = useCallback(() => {
    setMouseX(Infinity)
  }, [])

  return (
    <DockContext.Provider value={{ mouseX, magnification, distance }}>
      <div
        className={cn(
          'flex h-[52px] w-max items-center gap-2 rounded-xl border border-white/10 px-3 backdrop-blur-md',
          className,
        )}
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)',
          boxShadow: '0 1px 0 0 rgba(255,255,255,0.08) inset, 0 -1px 0 0 rgba(0,0,0,0.5) inset, 0 8px 32px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.3)',
        }}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        {children}
      </div>
    </DockContext.Provider>
  )
}

/* ─── DockIcon ──────────────────────────────────────────────── */
interface DockIconProps {
  children: React.ReactNode
  className?: string
  href?: string
  target?: string
  rel?: string
  title?: string
}

export function DockIcon({ children, className, href, target, rel, title }: DockIconProps) {
  const ref = useRef<HTMLDivElement>(null)
  const boundsRef = useRef<DOMRect | null>(null)
  const { mouseX, magnification, distance } = useContext(DockContext)

  useEffect(() => {
    const update = () => { boundsRef.current = ref.current?.getBoundingClientRect() ?? null }
    update()
    window.addEventListener('resize', update, { passive: true })
    return () => window.removeEventListener('resize', update)
  }, [])

  const getWidth = () => {
    if (!boundsRef.current || mouseX === Infinity) return 36
    const dist = mouseX - boundsRef.current.x - boundsRef.current.width / 2
    if (Math.abs(dist) < distance) {
      return (1 - Math.abs(dist) / distance) * magnification + 36
    }
    return 36
  }

  const width = getWidth()

  const inner = (
    <div
      ref={ref}
      className={cn(
        'flex shrink-0 cursor-pointer items-center justify-center rounded-xl text-zinc-400 transition-all duration-200 ease-out hover:text-white',
        className,
      )}
      style={{ width: `${width}px`, height: `${width}px` }}
      title={title}
    >
      {children}
    </div>
  )

  if (href) {
    return (
      <a href={href} target={target} rel={rel} title={title}>
        {inner}
      </a>
    )
  }

  return inner
}

/* ─── DockSeparator ─────────────────────────────────────────── */
export function DockSeparator({ className }: { className?: string }) {
  return <div className={cn('h-4/5 w-px bg-white/10', className)} />
}
