import { useCallback, useEffect, useMemo, useState } from 'react'
import { History, EyeOff, Eye, PencilLine, Undo2, RotateCcw, LifeBuoy, Siren } from 'lucide-react'
import { useDirectory } from '../../context/AdminContext'
import { readReports } from '../../lib/reports'

// Audit trail: every mutation in useAdminStore writes a line here.
const ACTION_META = {
  'hospital.hide': { icon: EyeOff, label: 'Hid hospital', tone: 'var(--status-critical)' },
  'hospital.restore': { icon: Eye, label: 'Restored hospital', tone: 'var(--status-good)' },
  'hospital.edit': { icon: PencilLine, label: 'Edited hospital', tone: 'var(--brand)' },
  'hospital.revert': { icon: Undo2, label: 'Reverted hospital edits', tone: 'var(--text-secondary)' },
  'doctor.hide': { icon: EyeOff, label: 'Hid doctor', tone: 'var(--status-critical)' },
  'doctor.restore': { icon: Eye, label: 'Restored doctor', tone: 'var(--status-good)' },
  'doctor.edit': { icon: PencilLine, label: 'Edited doctor', tone: 'var(--brand)' },
  'doctor.revert': { icon: Undo2, label: 'Reverted doctor edits', tone: 'var(--text-secondary)' },
  'overrides.reset': { icon: RotateCcw, label: 'Discarded all changes', tone: 'var(--status-serious)' },
  'report.support': { icon: LifeBuoy, label: 'Support request raised', tone: 'var(--brand)' },
  'report.emergency': { icon: Siren, label: 'Ambulance requested', tone: 'var(--status-critical)' },
}

export default function AdminActivity() {
  const { log: adminLog } = useDirectory()
  const [reports, setReports] = useState(readReports)

  const refresh = useCallback(() => setReports(readReports()), [])
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

  // Merge admin changes and user reports into one timeline, newest first.
  const log = useMemo(() => {
    const asEntries = reports.map((r) => ({
      id: `report-${r.id}`,
      action: `report.${r.kind}`,
      label: r.kind === 'emergency' ? `${r.payload.area ?? 'area not given'}` : r.payload.subject || 'No subject',
      actor: r.submittedBy ? `${r.submittedBy.name ? `${r.submittedBy.name} · ` : ''}${r.submittedBy.email}` : 'Signed-out visitor',
      at: r.at,
      undelivered: !r.delivered,
    }))
    return [...adminLog, ...asEntries].sort((a, b) => new Date(b.at) - new Date(a.at))
  }, [adminLog, reports])

  if (log.length === 0) {
    return (
      <div className="card flex flex-col items-center gap-2 p-8 text-center">
        <History size={20} style={{ color: 'var(--text-muted)' }} />
        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
          No changes yet
        </p>
        <p className="max-w-xs text-xs" style={{ color: 'var(--text-muted)' }}>
          Every admin change and every support or ambulance report from a user lands here, with who did it and when.
        </p>
      </div>
    )
  }

  return (
    <div className="card divide-y divide-[var(--border)] overflow-hidden p-0" style={{ borderColor: 'var(--border)' }}>
      {log.map((entry) => {
        const meta = ACTION_META[entry.action] ?? { icon: History, label: entry.action, tone: 'var(--text-secondary)' }
        const Icon = meta.icon
        return (
          <div key={entry.id} className="flex items-start gap-3 px-4 py-3">
            <span
              className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
              style={{ background: `color-mix(in srgb, ${meta.tone} 14%, transparent)`, color: meta.tone }}
            >
              <Icon size={14} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                <span className="font-medium">{meta.label}</span>{' '}
                <span style={{ color: 'var(--text-secondary)' }}>{entry.label}</span>
              </p>
              {entry.fields?.length > 0 && (
                <p className="mt-0.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                  Fields changed: {entry.fields.join(', ')}
                </p>
              )}
              <p className="mt-0.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                {entry.actor} · {new Date(entry.at).toLocaleString()}
                {entry.target ? ` · ${entry.target}` : ''}
                {entry.undelivered ? ' · not emailed (dev)' : ''}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
