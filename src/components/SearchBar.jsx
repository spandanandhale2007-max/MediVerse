import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ArrowRight } from 'lucide-react'
import { searchMediVerse } from '../data/searchIndex'

const ROTATING_TERMS = [
  'doctors',
  'departments',
  'appointments',
  'medications',
  'vaccinations',
  'bed availability',
  'campaigns',
]
const ROTATE_MS = 2200

export default function SearchBar({ autoFocus = false }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [termIndex, setTermIndex] = useState(0)
  const navigate = useNavigate()
  const wrapRef = useRef(null)

  const results = searchMediVerse(query)

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Cycle the "Search for <term>..." hint while the field is empty — pauses
  // the moment the user types anything.
  useEffect(() => {
    if (query) return
    const t = setInterval(() => {
      setTermIndex((i) => (i + 1) % ROTATING_TERMS.length)
    }, ROTATE_MS)
    return () => clearInterval(t)
  }, [query])

  function go(item) {
    setOpen(false)
    setQuery('')
    navigate(item.to)
  }

  function handleKeyDown(e) {
    if (!open || results.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => (i + 1) % results.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => (i <= 0 ? results.length - 1 : i - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const chosen = results[activeIndex] ?? results[0]
      if (chosen) go(chosen)
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div ref={wrapRef} className="relative w-full">
      <div
        className="flex items-center gap-3 rounded-2xl px-4 py-3.5 sm:px-5 sm:py-4"
        style={{ background: 'var(--surface-card)', border: '1px solid var(--border)', boxShadow: '0 16px 40px -20px rgba(15, 40, 40, 0.35)' }}
      >
        <Search size={20} style={{ color: 'var(--text-muted)' }} className="shrink-0" />
        <div className="relative flex-1">
          <input
            autoFocus={autoFocus}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setOpen(true)
              setActiveIndex(-1)
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKeyDown}
            className="w-full bg-transparent text-sm outline-none sm:text-base"
            style={{ color: 'var(--text-primary)' }}
            aria-label="Search MediVerse"
            role="combobox"
            aria-expanded={open}
            aria-autocomplete="list"
          />
          {!query && (
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center overflow-hidden text-sm sm:text-base" style={{ color: 'var(--text-muted)' }}>
              <span>Search for&nbsp;</span>
              <span key={termIndex} className="search-flash-term">
                {ROTATING_TERMS[termIndex]}
              </span>
              <span>&hellip;</span>
            </span>
          )}
        </div>
      </div>

      {open && query.trim() && (
        <div
          className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-2xl"
          style={{ background: 'var(--surface-card)', border: '1px solid var(--border)', boxShadow: '0 20px 44px -18px rgba(15, 40, 40, 0.4)' }}
        >
          {results.length === 0 ? (
            <p className="px-4 py-4 text-sm" style={{ color: 'var(--text-muted)' }}>
              No matches for "{query}" — try a doctor's name, department, or service.
            </p>
          ) : (
            <ul className="max-h-80 overflow-y-auto py-2">
              {results.map((item, i) => {
                const Icon = item.icon
                const active = i === activeIndex
                return (
                  <li key={`${item.type}-${item.label}`}>
                    <button
                      type="button"
                      onMouseEnter={() => setActiveIndex(i)}
                      onClick={() => go(item)}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left"
                      style={{ background: active ? 'var(--brand-soft-2)' : 'transparent' }}
                    >
                      <span
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                        style={{ background: 'var(--brand-soft-2)', color: 'var(--brand)' }}
                      >
                        <Icon size={16} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                          {item.label}
                        </span>
                        <span className="block truncate text-xs" style={{ color: 'var(--text-muted)' }}>
                          {item.sub ?? item.type}
                        </span>
                      </span>
                      <ArrowRight size={14} style={{ color: 'var(--text-muted)' }} className="shrink-0" />
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}
