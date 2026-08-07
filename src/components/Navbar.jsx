import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, X, Activity } from 'lucide-react'

const links = [
  { to: '/', label: 'Home' },
  { to: '/appointments', label: 'Appointments' },
  { to: '/doctors', label: 'Doctors' },
  { to: '/beds', label: 'Bed Availability' },
  { to: '/medications', label: 'Medications' },
  { to: '/vaccinations', label: 'Vaccinations' },
  { to: '/campaigns', label: 'Campaigns' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header
      className="sticky top-0 z-50 border-b backdrop-blur"
      style={{ borderColor: 'var(--border)', background: 'color-mix(in srgb, var(--surface-1) 88%, transparent)' }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <NavLink to="/" className="flex items-center gap-2 font-semibold" onClick={() => setOpen(false)}>
          <span
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white"
            style={{ background: 'var(--brand)' }}
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
