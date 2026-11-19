import { useEffect } from 'react'

// Pointer effects: card spotlight + magnetic pull on marked elements.
//
// One delegated listener on the document, not one per card — cheap no matter
// how many cards are on screen. Only animates `transform` and a CSS variable
// (both GPU-friendly) and never reads layout during a move, so it stays smooth.
//
// Disabled when the pointer can't hover (touch: no cursor) or the user prefers
// reduced motion. Both are checked live, so a mouse or OS-setting change takes
// effect without a reload.

const MAGNET_RADIUS = 90 // px from centre where pull begins
const MAGNET_STRENGTH = 0.28 // 0 = no pull, 1 = sticks to cursor

export function usePointerFx() {
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return

    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')

    let raf = 0
    let pending = null
    let activeCard = null
    const pulled = new Set()

    function releaseAll() {
      pulled.forEach((el) => {
        el.style.transform = ''
      })
      pulled.clear()
      if (activeCard) {
        activeCard.classList.remove('fx-spotlight')
        activeCard = null
      }
    }

    function apply() {
      raf = 0
      const e = pending
      if (!e) return

      // ---------------------------------------------------------- spotlight
      // elementFromPoint avoids per-card enter/leave tracking.
      const under = document.elementFromPoint(e.clientX, e.clientY)
      const card = under?.closest?.('.card')

      if (card !== activeCard) {
        activeCard?.classList.remove('fx-spotlight')
        activeCard = card ?? null
        activeCard?.classList.add('fx-spotlight')
      }
      if (activeCard) {
        const r = activeCard.getBoundingClientRect()
        activeCard.style.setProperty('--mx', `${e.clientX - r.left}px`)
        activeCard.style.setProperty('--my', `${e.clientY - r.top}px`)
      }

      // ----------------------------------------------------------- magnets
      // Only elements near the cursor are pulled, so this stays cheap.
      const magnets = document.querySelectorAll('[data-magnetic]')
      magnets.forEach((el) => {
        const r = el.getBoundingClientRect()
        const cx = r.left + r.width / 2
        const cy = r.top + r.height / 2
        const dx = e.clientX - cx
        const dy = e.clientY - cy
        const dist = Math.hypot(dx, dy)
        const reach = Math.max(r.width, r.height) / 2 + MAGNET_RADIUS

        if (dist < reach) {
          // Fades with distance so the pull eases in, not snaps.
          const pull = (1 - dist / reach) * MAGNET_STRENGTH
          el.style.transform = `translate3d(${dx * pull}px, ${dy * pull}px, 0)`
          pulled.add(el)
        } else if (pulled.has(el)) {
          el.style.transform = ''
          pulled.delete(el)
        }
      })
    }

    function onMove(e) {
      pending = e
      if (!raf) raf = requestAnimationFrame(apply)
    }

    function enable() {
      document.addEventListener('mousemove', onMove, { passive: true })
      document.addEventListener('mouseleave', releaseAll)
    }
    function disable() {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', releaseAll)
      if (raf) cancelAnimationFrame(raf)
      raf = 0
      releaseAll()
    }

    function sync() {
      const on = canHover.matches && !reduced.matches
      disable()
      if (on) {
        enable()
        document.documentElement.classList.add('fx-on')
      } else {
        document.documentElement.classList.remove('fx-on')
      }
    }

    sync()
    canHover.addEventListener('change', sync)
    reduced.addEventListener('change', sync)

    return () => {
      canHover.removeEventListener('change', sync)
      reduced.removeEventListener('change', sync)
      disable()
      document.documentElement.classList.remove('fx-on')
    }
  }, [])
}
