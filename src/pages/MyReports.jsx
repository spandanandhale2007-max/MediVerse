import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { LifeBuoy, Siren, FileText, ArrowRight, Info } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Badge from '../components/Badge'
import { useAuth } from '../context/AuthContext'
import { readReports } from '../lib/reports'

const SUPPORT_EMAIL = 'mediversehelp@gmail.com'

// A patient's own submissions, filtered to their email so one person's tickets
// never show under another account on a shared device (same rule as health/meds).
export default function MyReports() {
  const { auth } = useAuth()
  const [all, setAll] = useState(readReports)

  const refresh = useCallback(() => setAll(readReports()), [])
  useEffect(() => {
    window.addEventListener('mediverse:report', refresh)
    window.addEventListener('storage', refresh)
    window.addEventListener('focus', refresh)
    return () => {
      window.removeEventListener('mediverse:report', refresh)
      window.removeEventListener('storage', refresh)
      window.removeEventListener('focus', refresh)
    }
  }, [refresh])

  const mine = useMemo(
    () => all.filter((r) => r.submittedBy?.email && r.submittedBy.email === auth?.email),
    [all, auth?.email],
  )

  return (
    <>
      <PageHeader
        eyebrow="Your Reports"
        title="Everything you've raised with us"
        description="Support requests and ambulance bookings you've submitted from this account."
      />

      <div className="mx-auto max-w-2xl px-4 pb-20 sm:px-6">
        {mine.length === 0 ? (
          <div className="card flex flex-col items-center gap-2 p-8 text-center">
            <FileText size={22} style={{ color: 'var(--text-muted)' }} />
            <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
              You haven't raised anything yet
            </p>
            <p className="max-w-xs text-xs" style={{ color: 'var(--text-muted)' }}>
              Anything you send through the support form or request an ambulance for will be listed here.
            </p>
            <div className="mt-2 flex flex-wrap justify-center gap-2">
              <Link
                to="/support"
                className="flex items-center gap-1 rounded-full px-4 py-2 text-xs font-semibold"
                style={{ color: 'var(--brand)', background: 'var(--brand-soft-2)' }}
              >
                Contact support <ArrowRight size={13} />
              </Link>
              <Link
                to="/emergency"
                className="flex items-center gap-1 rounded-full px-4 py-2 text-xs font-medium"
                style={{ color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
              >
                Request an ambulance <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        ) : (
          <>
            <p className="mb-3 text-xs" style={{ color: 'var(--text-muted)' }}>
              {mine.length} report{mine.length === 1 ? '' : 's'} from {auth?.email}
            </p>

            <div className="space-y-2.5">
              {mine.map((r) => {
                const isEmergency = r.kind === 'emergency'
                return (
                  <article key={r.id} className="card p-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                          style={{
                            background: isEmergency
                              ? 'color-mix(in srgb, var(--status-critical) 14%, transparent)'
                              : 'var(--brand-soft-2)',
                            color: isEmergency ? 'var(--status-critical)' : 'var(--brand)',
                          }}
                        >
                          {isEmergency ? <Siren size={16} /> : <LifeBuoy size={16} />}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                            {isEmergency ? 'Ambulance request' : r.payload.subject || 'Support request'}
                          </p>
                          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                            {new Date(r.at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant={r.delivered ? 'good' : 'warning'} showIcon={false}>
                        {r.delivered ? 'Sent' : 'Not sent (local preview)'}
                      </Badge>
                    </div>

                    {(r.payload.message || r.payload.details) && (
                      <p className="mt-2.5 whitespace-pre-wrap text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {r.payload.message || r.payload.details}
                      </p>
                    )}
                    {isEmergency && r.payload.area && (
                      <p className="mt-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                        Area: {r.payload.area}
                      </p>
                    )}
                    {!isEmergency && r.payload.category && (
                      <p className="mt-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                        Category: {r.payload.category}
                      </p>
                    )}
                  </article>
                )
              })}
            </div>
          </>
        )}

        <p
          className="mt-5 flex items-start gap-2 rounded-xl px-3.5 py-2.5 text-xs"
          style={{ background: 'var(--brand-soft-2)', color: 'var(--text-secondary)' }}
        >
          <Info size={14} className="mt-0.5 shrink-0" style={{ color: 'var(--brand)' }} />
          <span>
            This list is kept on this device. Reports you send once the site is live are also emailed to our team at{' '}
            <strong style={{ color: 'var(--text-primary)' }}>{SUPPORT_EMAIL}</strong>, and they'll reply there.
          </span>
        </p>
      </div>
    </>
  )
}
