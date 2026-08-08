import { Link } from 'react-router-dom'
import { Activity, Mail, LifeBuoy } from 'lucide-react'

const ADMIN_EMAIL = 'mediversehelp@gmail.com'
const MAILTO_HREF = `mailto:${ADMIN_EMAIL}?subject=${encodeURIComponent('MediVerse Support Request')}`

export default function Footer() {
  return (
    <footer className="border-t" style={{ borderColor: 'var(--border)', background: 'var(--surface-1)' }}>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-start">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              <span
                className="flex h-6 w-6 items-center justify-center rounded-md"
                style={{ background: 'var(--brand)', color: 'var(--brand-on)' }}
              >
                <Activity size={14} strokeWidth={2.5} />
              </span>
              MediVerse
            </div>
            <p className="mt-2 max-w-xs text-sm" style={{ color: 'var(--text-muted)' }}>
              One platform for appointments, doctors, beds, medication, vaccination alerts &amp; hospital campaigns.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
              Need help?
            </span>
            <Link
              to="/support"
              className="flex items-center gap-1.5 text-sm font-medium"
              style={{ color: 'var(--brand)' }}
            >
              <LifeBuoy size={14} /> Report an issue
            </Link>
            <a href={MAILTO_HREF} className="footer-mail flex items-center gap-1.5 text-sm">
              <Mail size={14} /> {ADMIN_EMAIL}
            </a>
          </div>
        </div>
        <div
          className="mt-6 flex flex-col gap-2 border-t pt-4 text-xs sm:flex-row sm:items-center sm:justify-between"
          style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
        >
          <span>&copy; {new Date().getFullYear()} MediVerse. All rights reserved.</span>
          <span>Built for patients, by design.</span>
        </div>
      </div>
    </footer>
  )
}
