import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

// Horizontal scroll rail (like PharmEasy "Shop by Category").
// A real scroll container, not a JS carousel — so touch/trackpad, CSS
// scroll-snap, and keyboard tab-to-card all work natively.
// Arrows are a mouse-only extra: hidden when there's nothing to scroll,
// and only shown from `sm` up (touch devices swipe instead).
export default function HScroll({ children, ariaLabel, className = '', gap = 'gap-3' }) {
  const railRef = useRef(null)
  const [canLeft, setCanLeft] = useState(false)
  const [canRight, setCanRight] = useState(false)

  const sync = useCallback(() => {
    const el = railRef.current
    if (!el) return
    // 2px tolerance: sub-pixel widths would otherwise keep an arrow always lit.
    setCanLeft(el.scrollLeft > 2)
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2)
  }, [])

  useEffect(() => {
    const el = railRef.current
    if (!el) return
    sync()
    el.addEventListener('scroll', sync, { passive: true })
    const ro = new ResizeObserver(sync)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', sync)
      ro.disconnect()
    }
  }, [sync, children])

  function nudge(dir) {
    const el = railRef.current
    if (!el) return
    // Scroll ~80% of a viewport so the last card stays partly visible
    // (a full-width jump loses your place).
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: 'smooth' })
  }

  return (
    <div className={`relative ${className}`}>
      <div
        ref={railRef}
        role="region"
        aria-label={ariaLabel}
        tabIndex={0}
        className={`hscroll flex ${gap} overflow-x-auto scroll-smooth pb-1`}
      >
        {children}
      </div>

      <Arrow side="left" show={canLeft} onClick={() => nudge(-1)} />
      <Arrow side="right" show={canRight} onClick={() => nudge(1)} />
    </div>
  )
}

function Arrow({ side, show, onClick }) {
  if (!show) return null
  const isLeft = side === 'left'
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isLeft ? 'Scroll left' : 'Scroll right'}
      tabIndex={-1}
      className="absolute top-1/2 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full shadow-md sm:flex"
      style={{
        [isLeft ? 'left' : 'right']: '-0.5rem',
        background: 'var(--surface-1)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border)',
      }}
    >
      {isLeft ? <ChevronLeft size={17} /> : <ChevronRight size={17} />}
    </button>
  )
}
