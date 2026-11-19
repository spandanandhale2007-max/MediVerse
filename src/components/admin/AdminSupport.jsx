import { useCallback, useEffect, useState } from 'react'
import { Mail, Siren, LifeBuoy, ExternalLink, Info, Trash2, MailOpen, MailCheck, UserRound } from 'lucide-react'
import Badge from '../Badge'
import { readReports, markReportRead, clearReports } from '../../lib/reports'

const SUPPORT_EMAIL = 'mediversehelp@gmail.com'
const NETLIFY_FORMS_URL = 'https://app.netlify.com/'

export default function AdminSupport() {
  const [reports, setReports] = useState(readReports)
  const [filter, setFilter] = useState('all') // all | support | emergency | unread

  const refresh = useCallback(() => setReports(readReports()), [])

  // Keep the list live: `mediverse:report` = filed in this tab,
  // `storage` = filed in another tab, focus = returning to this tab.
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

  const shown = reports.filter((r) => {
    if (filter === 'unread') return !r.read
    if (filter === 'all') return true
    return r.kind === filter
  })

  const unread = reports.filter((r) => !r.read).length

  return (
    <div className="space-y-4">
      {/* Where reports actually go, and what this local list is. */}
      <div className="card p-5">
        <h2 className="flex items-center gap-2 text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          <Mail size={16} style={{ color: 'var(--brand)' }} /> Where reports are delivered
        </h2>
        <p className="mt-1.5 text-xs" style={{ color: 'var(--text-secondary)' }}>
          Support requests and ambulance bookings post to Netlify Forms, which emails{' '}
          <strong style={{ color: 'var(--text-primary)' }}>{SUPPORT_EMAIL}</strong>. That inbox and the Netlify
          dashboard are the real record of every submission from every user.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-semibold"
            style={{ background: 'var(--brand)', color: 'var(--brand-on)' }}
          >
            <Mail size={13} /> Open support inbox
          </a>
          <a
            href={NETLIFY_FORMS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-xs font-medium"
            style={{ color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
          >
            Netlify form submissions <ExternalLink size={11} />
          </a>
        </div>

        <p
          className="mt-3 flex items-start gap-2 rounded-lg px-3 py-2.5 text-xs"
          style={{ background: 'var(--brand-soft-2)', color: 'var(--text-secondary)' }}
        >
          <Info size={14} className="mt-0.5 shrink-0" style={{ color: 'var(--brand)' }} />
          <span>
            The list below is a copy of reports raised <strong style={{ color: 'var(--text-primary)' }}>from this
            browser</strong>, kept locally so you can review the flow. It is not the cross-user inbox — reading that
            needs a Netlify API token, which can't safely live in front-end code.
          </span>
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Tab active={filter === 'all'} onClick={() => setFilter('all')} label={`All (${reports.length})`} />
        <Tab active={filter === 'unread'} onClick={() => setFilter('unread')} label={`Unread (${unread})`} />
        <Tab active={filter === 'support'} onClick={() => setFilter('support')} label="Support" />
        <Tab active={filter === 'emergency'} onClick={() => setFilter('emergency')} label="Ambulance" />
        {reports.length > 0 && (
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Clear the locally stored copies? This does not affect anything already emailed.')) {
                clearReports()
                refresh()
              }
            }}
            className="ml-auto flex items-center gap-1 text-xs font-medium"
            style={{ color: 'var(--status-critical)' }}
          >
            <Trash2 size={12} /> Clear local copies
          </button>
        )}
      </div>

      {shown.length === 0 ? (
        <div className="card flex flex-col items-center gap-2 p-8 text-center">
          <LifeBuoy size={20} style={{ color: 'var(--text-muted)' }} />
          <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            No reports here yet
          </p>
          <p className="max-w-xs text-xs" style={{ color: 'var(--text-muted)' }}>
            Submit the support or ambulance form and it will appear here for review.
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {shown.map((r) => {
            const isEmergency = r.kind === 'emergency'
            return (
              <article key={r.id} className="card p-4" style={r.read ? { opacity: 0.72 } : undefined}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                      style={{
                        background: isEmergency
                          ? 'color-mix(in srgb, var(--status-critical) 14%, transparent)'
                          : 'var(--brand-soft-2)',
                        color: isEmergency ? 'var(--status-critical)' : 'var(--brand)',
                      }}
                    >
                      {isEmergency ? <Siren size={15} /> : <LifeBuoy size={15} />}
                    </span>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {isEmergency ? 'Ambulance request' : r.payload.subject || 'Support request'}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                        {new Date(r.at).toLocaleString()}
                      </p>
                      {/* Signed-in identity, not the free-text name field */}
                      <p className="mt-0.5 flex items-center gap-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                        <UserRound size={11} />
                        {r.submittedBy
                          ? `${r.submittedBy.name ? `${r.submittedBy.name} · ` : ''}${r.submittedBy.email}`
                          : 'Signed-out visitor'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {!r.delivered && (
                      <Badge variant="warning" showIcon={false}>
                        Not sent (dev)
                      </Badge>
                    )}
                    {!r.read && <Badge variant="good" showIcon={false}>New</Badge>}
                    <button
                      type="button"
                      onClick={() => {
                        markReportRead(r.id, !r.read)
                        refresh()
                      }}
                      className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium"
                      style={{ color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
                    >
                      {r.read ? <MailOpen size={12} /> : <MailCheck size={12} />} {r.read ? 'Mark unread' : 'Mark read'}
                    </button>
                  </div>
                </div>

                <dl className="mt-3 grid grid-cols-1 gap-x-4 gap-y-1.5 sm:grid-cols-2">
                  {Object.entries(r.payload)
                    .filter(([k, v]) => v && k !== 'form-name')
                    .map(([k, v]) => (
                      <div key={k} className="min-w-0">
                        <dt className="text-[11px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                          {k}
                        </dt>
                        <dd className="break-words text-xs" style={{ color: 'var(--text-secondary)' }}>
                          {String(v)}
                        </dd>
                      </div>
                    ))}
                </dl>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}

function Tab({ active, onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full px-3.5 py-1.5 text-xs font-semibold"
      style={{
        color: active ? 'var(--brand-on)' : 'var(--text-secondary)',
        background: active ? 'var(--brand)' : 'var(--surface-2)',
      }}
    >
      {label}
    </button>
  )
}
