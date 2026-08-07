import { Activity } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t" style={{ borderColor: 'var(--border)', background: 'var(--surface-1)' }}>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
            <span
              className="flex h-6 w-6 items-center justify-center rounded-md text-white"
              style={{ background: 'var(--brand)' }}
            >
              <Activity size={14} strokeWidth={2.5} />
            </span>
            MediVerse
          </div>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            One platform for appointments, doctors, beds, medication, vaccination alerts &amp; hospital campaigns.
          </p>
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
