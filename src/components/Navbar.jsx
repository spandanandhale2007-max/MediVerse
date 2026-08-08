import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, X, Activity, Sun, Moon, LifeBuoy } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import { useAuth } from '../context/AuthContext'
import ProfileMenu from './ProfileMenu'

const PATIENT_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/appointments', label: 'Appointments' },
  { to: '/doctors', label: 'Doctors' },
  { to: '/beds', label: 'Bed Availability' },
  { to: '/medications', label: 'Medications' },
  { to: '/vaccinations', label: 'Vaccinations' },
  { to: '/campaigns', label: 'Campaigns' },
  { to: '/support', label: 'Support' },
]

// Staff and admin consoles only mount a handful of routes (see App.jsx), so
// the nav must not offer patient pages that would just bounce them back.
const STAFF_LINKS = [
  { to: '/ward', label: 'Ward Console' },
  { to: '/hospitals', label: 'Hospitals' },
  { to: '/support', label: 'Support' },
]

const ADMIN_LINKS = [
  { to: '/admin', label: 'Overview' },
  { to: '/hospitals', label: 'Hospitals' },
  { to: '/support', label: 'Support' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const { isStaff, isAdmin } = useAuth()
  const links = isStaff ? STAFF_LINKS : isAdmin ? ADMIN_LINKS : PATIENT_LINKS
  const homeTo = isStaff ? '/ward' : isAdmin ? '/admin' : '/'

  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur"
      style={{ borderColor: 'var(--border)', background: 'color-mix(in srgb, var(--surface-1) 88%, transparent)' }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <NavLink to={homeTo} className="flex items-center gap-2 font-semibold" onClick={() => setOpen(false)}>
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ background: 'var(--brand)', color: 'var(--brand-on)' }}
          >
            <Activity size={18} strokeWidth={2.5} />
          </span>
          <span style={{ color: 'var(--text-primary)' }}>MediVerse</span>
        </NavLink>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${isActive ? '' : 'hover:bg-black/5'}`
              }
              style={({ isActive }) => ({
                color: isActive ? 'var(--brand)' : 'var(--text-secondary)',
                background: isActive ? 'var(--brand-soft-2)' : 'transparent',
              })}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <NavLink
            to="/support"
            onClick={() => setOpen(false)}
            className="hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium sm:flex lg:hidden"
            style={({ isActive }) => ({
              color: isActive ? 'var(--brand)' : 'var(--text-secondary)',
              background: isActive ? 'var(--brand-soft-2)' : 'transparent',
            })}
          >
            <LifeBuoy size={15} /> Support
          </NavLink>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
          <ProfileMenu />

          <button
            type="button"
            className="rounded-lg p-2 lg:hidden"
            style={{ color: 'var(--text-primary)' }}
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation menu"
            aria-expanded={open}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t px-4 py-2 lg:hidden" style={{ borderColor: 'var(--border)' }}>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-2.5 text-sm font-medium"
              style={({ isActive }) => ({
                color: isActive ? 'var(--brand)' : 'var(--text-secondary)',
                background: isActive ? 'var(--brand-soft-2)' : 'transparent',
              })}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  )
}

function ThemeToggle({ theme, onToggle }) {
  const isDark = theme === 'dark'
  return (
    <button
      type="button"
      onClick={onToggle}
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={isDark ? 'Deep Care (dark)' : 'Clinical Aurora (light)'}
      className="flex h-9 w-9 items-center justify-center rounded-full transition-colors"
      style={{ color: 'var(--brand)', background: 'var(--brand-soft-2)', border: '1px solid var(--border)' }}
    >
      {isDark ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  )
}
