import Badge from './Badge'

// Occupancy meter: a labelled bar + explicit status badge, never color alone.
function statusFor(pct) {
  if (pct >= 95) return { variant: 'critical', label: 'Critical' }
  if (pct >= 80) return { variant: 'serious', label: 'High' }
  if (pct >= 60) return { variant: 'warning', label: 'Moderate' }
  return { variant: 'good', label: 'Available' }
}

export default function StatMeter({ label, occupied, total }) {
  const pct = Math.round((occupied / total) * 100)
  const { variant, label: statusLabel } = statusFor(pct)
  const barColor = `var(--status-${variant === 'serious' ? 'serious' : variant})`

  return (
    <div className="card p-4 sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
          {label}
        </h3>
        <Badge variant={variant}>{statusLabel}</Badge>
      </div>

      <div className="mt-3 flex items-baseline gap-1.5">
        <span className="text-2xl font-semibold tabular-nums" style={{ color: 'var(--text-primary)' }}>
          {total - occupied}
        </span>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          beds free of {total}
        </span>
      </div>

      <div className="meter-track mt-3 h-2" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${label} occupancy`}>
        <div className="meter-fill" style={{ width: `${pct}%`, background: barColor }} />
      </div>
      <div className="mt-1.5 flex justify-between text-xs tabular-nums" style={{ color: 'var(--text-muted)' }}>
        <span>{pct}% occupied</span>
        <span>{occupied}/{total}</span>
      </div>
    </div>
  )
}
