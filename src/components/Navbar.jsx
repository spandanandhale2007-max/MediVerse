import { useCallback, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, X, Sun, Moon, LifeBuoy, Download } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import { useAuth } from '../context/AuthContext'
import ProfileMenu from './ProfileMenu'
import BrandGlyph from './BrandGlyph'
import InstallAppDialog from './InstallAppDialog'
import { usePwaInstall } from '../hooks/usePwaInstall'
import { isNativeApp } from '../lib/pwa'

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

// Staff/admin mount only a few routes (see App.jsx); don't link patient pages that would bounce back.
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
  const { canPrompt, installed, promptInstall } = usePwaInstall()
  const [installOpen, setInstallOpen] = useState(false)
  const closeInstall = useCallback(() => setInstallOpen(false), [])

  // Use the browser's own install dialog when it offers one (Android Chrome,
  // desktop Chrome/Edge); otherwise show step-by-step instructions (iPhone).
  function handleGetApp() {
    if (canPrompt) promptInstall()
    else setInstallOpen(true)
  }

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
            <BrandGlyph size={20} />
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
          {!isNativeApp && !installed && (
            <button
              type="button"
              onClick={handleGetApp}
              className="flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-sm font-semibold transition-opacity hover:opacity-90"
              style={{ background: 'var(--brand)', color: 'var(--brand-on)' }}
              title="Install MediVerse as an app on this device"
            >
              <Download size={15} /> <span className="hidden sm:inline">Get app</span>
            </button>
          )}
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

      {installOpen && <InstallAppDialog onClose={closeInstall} />}
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
