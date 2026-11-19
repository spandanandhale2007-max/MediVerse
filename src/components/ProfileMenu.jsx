import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserRound, FileText, LogOut, ChevronDown, LayoutDashboard, Stethoscope } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

// No photo upload: avatar is initials on a colour derived from the name,
// so each person gets the same hue every time.
function initialsOf(name) {
  if (!name) return '?'
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

function hueOf(seed = '') {
  let h = 0
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) % 360
  return h
}

export default function ProfileMenu() {
  const { auth, profile, isPatient, isStaff, isAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)

  // Close on outside click or Escape.
  useEffect(() => {
    if (!open) return
    function onPointerDown(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false)
    }
    function onKeyDown(e) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  if (!auth) return null

  const displayName = isPatient ? (profile?.name ?? 'Your profile') : (auth.name ?? auth.userId ?? 'Account')
  const firstName = displayName.trim().split(/\s+/)[0]
  const subtitle = isPatient ? auth.email : isAdmin ? 'Administrator' : 'Ward / Doctor'
  const hue = hueOf(displayName + (auth.email ?? auth.userId ?? ''))

  const items = []
  if (isPatient) {
    items.push({ label: 'Your profile', icon: UserRound, to: '/profile' })
    items.push({ label: 'Your reports', icon: FileText, to: '/reports' })
  }
  if (isStaff) items.push({ label: 'Ward console', icon: Stethoscope, to: '/ward' })
  if (isAdmin) items.push({ label: 'Admin console', icon: LayoutDashboard, to: '/admin' })

  function go(to) {
    setOpen(false)
    navigate(to)
  }

  return (
    <div className="relative" ref={wrapRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex h-9 items-center gap-2 rounded-full py-1 pl-1 pr-2.5 text-xs font-semibold transition-colors"
        style={{ background: 'var(--brand-soft-2)', color: 'var(--brand)', border: '1px solid var(--border)' }}
      >
        <Avatar name={displayName} hue={hue} />
        <span className="hidden max-w-[7rem] truncate sm:inline">{firstName}</span>
        <ChevronDown size={13} className="shrink-0 transition-transform" style={{ transform: open ? 'rotate(180deg)' : 'none' }} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-xl shadow-lg"
          style={{ background: 'var(--surface-1)', border: '1px solid var(--border)' }}
        >
          <div className="flex items-center gap-2.5 px-3.5 py-3" style={{ borderBottom: '1px solid var(--border)' }}>
            <Avatar name={displayName} hue={hue} size={38} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                {displayName}
              </p>
              <p className="truncate text-xs" style={{ color: 'var(--text-muted)' }}>
                {subtitle}
              </p>
            </div>
          </div>

          <div className="p-1.5">
            {items.map(({ label, icon: Icon, to }) => (
              <button
                key={to}
                role="menuitem"
                type="button"
                onClick={() => go(to)}
                className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium"
                style={{ color: 'var(--text-secondary)' }}
              >
                <Icon size={15} className="shrink-0" /> {label}
              </button>
            ))}
          </div>

          <div className="p-1.5" style={{ borderTop: '1px solid var(--border)' }}>
            <button
              role="menuitem"
              type="button"
              onClick={() => {
                setOpen(false)
                navigate('/', { replace: true })
                logout()
              }}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold"
              style={{ color: 'var(--status-critical)' }}
            >
              <LogOut size={15} className="shrink-0" /> Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function Avatar({ name, hue, size = 26 }) {
  return (
    <span
      aria-hidden="true"
      className="flex shrink-0 items-center justify-center rounded-full font-semibold"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.4,
        background: `hsl(${hue} 62% 88%)`,
        color: `hsl(${hue} 55% 28%)`,
      }}
    >
      {initialsOf(name)}
    </span>
  )
}
