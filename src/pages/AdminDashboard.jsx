import { useCallback, useEffect, useState } from 'react'
import { LayoutDashboard, Building2, Stethoscope, LifeBuoy, History, Settings, ShieldAlert, Menu, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useDirectory } from '../context/AdminContext'
import { unreadReportCount } from '../lib/reports'
import AdminOverview from '../components/admin/AdminOverview'
import AdminHospitals from '../components/admin/AdminHospitals'
import AdminDoctors from '../components/admin/AdminDoctors'
import AdminSupport from '../components/admin/AdminSupport'
import AdminActivity from '../components/admin/AdminActivity'
import AdminSettings from '../components/admin/AdminSettings'

// Sticky left nav rail + one working area. Sections are local state, not
// routes, so a half-finished edit survives the back button.
const SECTIONS = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'hospitals', label: 'Hospitals', icon: Building2 },
  { id: 'doctors', label: 'Doctors', icon: Stethoscope },
  { id: 'support', label: 'Support & Reports', icon: LifeBuoy },
  { id: 'activity', label: 'Activity Log', icon: History },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export default function AdminDashboard() {
  const { auth } = useAuth()
  const { pendingCount, log } = useDirectory()
  const [section, setSection] = useState('overview')
  const [navOpen, setNavOpen] = useState(false)
  const [unread, setUnread] = useState(unreadReportCount)

  // Patient tickets must appear here without a page reload.
  const refreshUnread = useCallback(() => setUnread(unreadReportCount()), [])
  useEffect(() => {
    window.addEventListener('mediverse:report', refreshUnread)
    window.addEventListener('storage', refreshUnread)
    window.addEventListener('focus', refreshUnread)
    return () => {
      window.removeEventListener('mediverse:report', refreshUnread)
      window.removeEventListener('storage', refreshUnread)
      window.removeEventListener('focus', refreshUnread)
    }
  }, [refreshUnread])

  // Re-count when leaving the support tab, where items get marked read.
  useEffect(() => {
    if (section !== 'support') refreshUnread()
  }, [section, refreshUnread])

  const counts = { activity: log.length, support: unread }

  return (
    <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 sm:px-6">
      {/* sidebar rail */}
      <aside className="hidden w-56 shrink-0 lg:block">
        <SideNav section={section} onSelect={setSection} counts={counts} pendingCount={pendingCount} />
      </aside>

      <div className="min-w-0 flex-1">
        <header className="mb-5 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--brand)' }}>
              Admin Console
            </p>
            <h1 className="truncate text-xl font-semibold sm:text-2xl" style={{ color: 'var(--text-primary)' }}>
              {SECTIONS.find((s) => s.id === section)?.label}
            </h1>
            <p className="mt-0.5 truncate text-xs" style={{ color: 'var(--text-muted)' }}>
              Signed in as {auth?.userId}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setNavOpen((v) => !v)}
            className="rounded-lg p-2 lg:hidden"
            style={{ color: 'var(--text-primary)', border: '1px solid var(--border)' }}
            aria-label="Toggle admin sections"
            aria-expanded={navOpen}
          >
            {navOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </header>

        {navOpen && (
          <div className="mb-5 lg:hidden">
            <SideNav
              section={section}
              onSelect={(s) => {
                setSection(s)
                setNavOpen(false)
              }}
              counts={counts}
              pendingCount={pendingCount}
            />
          </div>
        )}

        {section === 'overview' && <AdminOverview onJump={setSection} />}
        {section === 'hospitals' && <AdminHospitals />}
        {section === 'doctors' && <AdminDoctors />}
        {section === 'support' && <AdminSupport />}
        {section === 'activity' && <AdminActivity />}
        {section === 'settings' && <AdminSettings />}
      </div>
    </div>
  )
}

function SideNav({ section, onSelect, counts, pendingCount }) {
  return (
    <nav className="card sticky top-20 p-2">
      {SECTIONS.map((s) => {
        const Icon = s.icon
        const active = section === s.id
        const badge =
          s.id === 'support' ? counts.support : s.id === 'activity' ? counts.activity : s.id === 'hospitals' ? pendingCount : 0
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => onSelect(s.id)}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium"
            style={{
              color: active ? 'var(--brand)' : 'var(--text-secondary)',
              background: active ? 'var(--brand-soft-2)' : 'transparent',
            }}
          >
            <Icon size={16} className="shrink-0" />
            <span className="flex-1 text-left">{s.label}</span>
            {badge > 0 && (
              <span
                className="rounded-full px-1.5 py-0.5 text-[10px] font-semibold tabular-nums"
                style={{ background: 'var(--brand)', color: 'var(--brand-on)' }}
              >
                {badge}
              </span>
            )}
          </button>
        )
      })}

      <div
        className="mt-2 flex items-start gap-2 rounded-lg px-3 py-2.5 text-[11px] leading-snug"
        style={{ background: 'color-mix(in srgb, var(--status-warning) 16%, transparent)', color: 'var(--warn-fg)' }}
      >
        <ShieldAlert size={13} className="mt-0.5 shrink-0" strokeWidth={2.5} />
        <span>Changes save to this browser only — there's no backend yet.</span>
      </div>
    </nav>
  )
}
